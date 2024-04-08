/* Libraries */
import { Request, Response, NextFunction } from "express";
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

/* Application Modules */
import config from "../../../config/appConfig";
import responseHandler from "../../../common/responseHandler";
import userService from "../service/service";
import requestBodyValidator from "../../../common/middleware/requestValidation";
import { token_refresh } from "../validation/validationSchema";
import { Jwt } from "../types/authTypes";


class JwtMiddleware {
  verifyRefreshBodyField = requestBodyValidator(token_refresh);

  validJWTNeeded(req: Request, res: Response, next: NextFunction) {
    if (req.headers["authorization"]) {
      try {
        const authorization = req.headers["authorization"].split(" ");

        if (authorization[0] !== "Bearer") {
          return responseHandler.unAuthorizedResponse("Invalid authorization token", res);
        }

        res.locals.jwt = jwt.verify(authorization[1], config.jwt.secret) as Jwt;
        return next();
      } catch (error: any) {
        return responseHandler.forbiddenResponse(`Not authorize ${error}`, res);
      }
    }

    responseHandler.unAuthorizedResponse("Authorization denied", res);
  }

  async validRefreshNeeded(req: Request, res: Response, next: NextFunction) {
    const { email, refresh_key, user_id } = res.locals.jwt;
    const { refresh_token } = req.body;

    const user = await userService.getUserByEmail(email);
    if(!user) return responseHandler.badRequest("User not found", res);
    const salt = crypto.createSecretKey(Buffer.from(refresh_key.data));
    const hash = crypto
      .createHmac("sha512", salt)
      .update(user_id + config.jwt.secret)
      .digest("base64");

    if (hash === refresh_token) {
      req.body = {
        user_id: user.id,
        name: user.username,
        email: user.email
      }

      return next();
    }

    responseHandler.badRequest("Invalid refresh token", res);
  }
}

export default new JwtMiddleware();
