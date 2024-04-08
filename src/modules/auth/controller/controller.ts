/* Libraries */
import { Request, Response } from "express";
import argon2 from "argon2";
import crypto from "crypto";
import jwt from "jsonwebtoken";

/* Application Modules */
import responseHandler from "../../../common/responseHandler";
import asyncHandler from "../../../common/middleware/asyncHandler";
import config from "../../../config/appConfig";
import userService from "../service/service"

class AuthController {
  createUser = asyncHandler(async (req: Request, res: Response) => {
    req.body.password = await argon2.hash(req.body.password);
    const user = await userService.createUser({ ...req.body });
    responseHandler.successfullyCreated("Registration successful", user, res);
  })

  createUserJWT = asyncHandler(async (req: Request, res: Response) => {
    const refreshId = req.body.user_id + config.jwt.secret;
    const salt = crypto.createSecretKey(crypto.randomBytes(16));
    const hash = crypto
      .createHmac("sha512", salt)
      .update(refreshId)
      .digest("base64");

    req.body.refresh_key = salt.export();

    const access_token = jwt.sign(req.body, config.jwt.secret, {
      expiresIn: config.jwt.token_expiration
    });

    delete req.body.refresh_key;

    const user_auth = { access_token, refresh_token: hash, user: req.body };
    responseHandler.successResponse("Login successful", user_auth, res);
  });

  followUser = asyncHandler(async (req: Request, res: Response) => {
    const { user_id } = res.locals.jwt;
    const { followed_user_id } = req.body;
    const followed_user = await userService.followUser({ user_id, followed_user_id });
    responseHandler.successResponse("User followed successfully", { followed_user }, res);
  })
}

export default new AuthController();
