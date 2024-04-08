/* Core */
import http from "http";
import mongoose from "mongoose";

/* Libraries */
import supertest, { SuperAgentTest } from "supertest";

/* Application Modules */
import createServer from "../server";

const BASE_URL = "/api/posts";
let access_token = "";
let post_id = "";
let first_register_user_id = "";

describe("Post endpoint", function () {
  let server: http.Server;
  let request: SuperAgentTest

  beforeAll(async function () {
    server = await createServer();
    request = supertest.agent(server);
  })

  afterAll(async function () {
    server.close();
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });

  // We need this here to test authenticated user post API
  describe("Authentication endpoint", function () {
    const BASE_AUTH_URL = "/api/users";

    it("it should allow POST to register new user", async function () {
      const register_user_test = {
        firstname: "Sam ",
        lastname: "Smith",
        username: "Sammy",
        email: "sam.smith@outlook.com",
        password: "Sammy234"
      }

      const response = await request.post(`${BASE_AUTH_URL}/register`).send(register_user_test);

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

      const response = await request.post(`${BASE_AUTH_URL}/login`).send(user_login_test);

      expect(response.status).toBe(200);
      expect(response.body.status).toBe("Success");
      expect(response.body.message).toBe("Login successful");
      expect(response.body.data).toHaveProperty("access_token");

      access_token = response.body.data.access_token;
    });
  })

  describe("With valid access token", function () {
    it("it should allow POST to create new post", async function () {
      const post_body = {
        text: "Sample post",
        media: "661087d85e8ac622434788d9",
      }

      const response = await request.post(BASE_URL)
        .set({ Authorization: `Bearer ${access_token}` })
        .send(post_body);

      expect(response.status).toBe(201);
      expect(response.body.status).toBe("Success");
      expect(response.body.data).toHaveProperty("_id");
      post_id = response.body.data._id;
    });

    it("it should disallow POST to create new post with invalid payload", async function () {
      const response = await request.post(BASE_URL)
        .set({ Authorization: `Bearer ${access_token}` })
        .send({ media: "661087d85e8ac622434788d9" });

      expect(response.status).toBe(400);
      expect(response.body.status).toBe("Failure");
      expect(response.body.message).toMatch("\"text\" is required")
    });
  });

  describe("With valid access token", function () {
    it("it should allow POST to create new comment", async function () {
      const comment_body = { text: "Sample comment!" }

      const response = await request.post(`${BASE_URL}/${post_id}/comment`)
        .set({ Authorization: `Bearer ${access_token}` })
        .send(comment_body);

      expect(response.status).toBe(201);
      expect(response.body.status).toBe("Success");
      expect(response.body.data).toHaveProperty("_id");
    });

    it("it should disallow POST to create new comment with invalid payload", async function () {
      const response = await request.post(`${BASE_URL}/${post_id}/comment`)
        .set({ Authorization: `Bearer ${access_token}` })
        .send({});

      expect(response.status).toBe(400);
      expect(response.body.status).toBe("Failure");
      expect(response.body.message).toMatch("\"text\" is required")
    });
  });
});
