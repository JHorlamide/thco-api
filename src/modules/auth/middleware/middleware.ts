/* Libraries */
import { Request, Response, NextFunction } from "express";
import argon2 from "argon2";

/* Application Modules */
import requestBodyValidator from "../../../common/middleware/requestValidation";
import userService from "../service/service"
import responseHandler from "../../../common/responseHandler";
import { user_login, user_registration, follow_user } from "../validation/validationSchema";

class AuthMiddleware {
  validateReqRegFields = requestBodyValidator(user_registration);
  validateReqAuthFields = requestBodyValidator(user_login);
  validateReqFollowField = requestBodyValidator(follow_user);

  async validateUserAlreadyExist(req: Request, res: Response, next: NextFunction) {
    const { email, username } = req.body;

    const user = await userService.getUserByEmailOrUsername(email, username);

    if (user) {
      return responseHandler.badRequest("User already exist", res);
    }

    next();
  }

  async verifyPassword(req: Request, res: Response, next: NextFunction) {
    const { email, password } = req.body;

    try {
      const user = await userService.getUserByEmail(email);

      if (!user) return responseHandler.badRequest("User not found", res);

      if (await argon2.verify(user.password, password)) {
        req.body = {
          user_id: user.id,
          email: user.email,
          username: user.username,
        }

        return next();
      }

      return responseHandler.badRequest("Invalid email and/or password", res);
    } catch (error: any) {
      return responseHandler.badRequest(error.message, res);
    }
  }
}

export default new AuthMiddleware();
