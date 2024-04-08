/* Core */
import http from "http";
import mongoose from "mongoose"

/* Libraries */
import supertest, { SuperAgentTest } from "supertest";

/* Application Modules */
import createServer from "../server";

const BASE_URL = "/api/users";
export let first_register_user_id = "";
export let access_token = "";
export let refresh_token = "";

describe("user and authentication endpoint", function () {
  let server: http.Server;
  let request: SuperAgentTest

  beforeAll(async function () {
    server = await createServer();
    request = supertest.agent(server);
  })

  afterAll(async function () {
    server.close();
    first_register_user_id = "";
    access_token = ""
    refresh_token = ""
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  })

  it("it should allow POST to register new user", async function () {
    const register_user_test = {
      firstname: "Sam ",
      lastname: "Smith",
      username: "Sammy",
      email: "sam.smith@outlook.com",
      password: "Sammy234"
    }

    const response = await request.post(`${BASE_URL}/register`).send(register_user_test);

    expect(response.status).toBe(201);
    expect(response.body.status).toBe("Success");
    expect(response.body.data).toHaveProperty("user_id");
    first_register_user_id = response.body.data.user_id;
  });

  it("it should allow POST  to login", async function () {
    const user_login_test = {
      email: "sam.smith@outlook.com",
      password: "Sammy234"
    }

    const response = await request.post(`${BASE_URL}/login`).send(user_login_test);

    expect(response.status).toBe(200);
    expect(response.body.status).toBe("Success");
    expect(response.body.message).toBe("Login successful");
    expect(response.body.data).toHaveProperty("access_token");
    expect(response.body.data).toHaveProperty("refresh_token");
    expect(response.body.data.user.user_id).toBe(first_register_user_id);

    access_token = response.body.data.access_token;
    refresh_token = response.body.data.refresh_token;
  });

  it("it should disallow POST to register new user with invalid payload", async function () {
    const invalid_user_register = {
      firstname: "Jubril",
      lastname: "Olamide",
      username: "Jay",
      password: "olamide"
    }

    const response = await request.post(`${BASE_URL}/register`).send(invalid_user_register);

    expect(response.status).toBe(400);
    expect(response.body.status).toBe("Failure");
    expect(response.body.message).toMatch("\"email\" is required")
  });

  it("it should disallow POST to login with invalid login details", async function () {
    const invalid_login_test = {
      email: "olamidejubril@outlook.com",
      password: "olamide"
    }

    const response = await request.post(`${BASE_URL}/login`).send(invalid_login_test);

    expect(response.status).toBe(400);
    expect(response.body.status).toBe("Failure");
    expect(response.body.message).toBe("User not found");
  });

  describe("with valid access_token", function () {
    it("it should allow POST to refresh user token", async function () {
      const response = await request
        .post(`${BASE_URL}/refresh-token`)
        .set({ Authorization: `Bearer ${access_token}` })
        .send({ refresh_token: refresh_token });

      expect(response.status).toBe(200);
      expect(response.body.status).toBe("Success");
      expect(response.body.data).toHaveProperty("access_token");
      expect(response.body.data).toHaveProperty("refresh_token");
      expect(response.body.data.user).toHaveProperty("user_id");
      expect(response.body.data.user.user_id).toBe(first_register_user_id);

      access_token = response.body.data.access_token;
      refresh_token = response.body.data.refresh_token;
    })
  })
});
