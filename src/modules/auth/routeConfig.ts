/* Libraries */
import { Application } from "express";

/* Application Modules */
import config from "../../config/appConfig";
import jwtMiddleware from "./middleware/jwtMiddleware";
import authMiddleware from "./middleware/middleware";
import authController from "./controller/controller";
import { CommonRoutesConfig } from "../../common/commonRouteConfig";

const APP_PREFIX_PATH = config.prefix;

export class AuthRoute extends CommonRoutesConfig {
  constructor(app: Application) {
    super(app, "AuthRoute")
  }

  configureRoutes(): Application {
    /***
    * @route  POST /api/users/register.
    * @desc   Register new user.
    * @access Public.
    * @body   { firstname: string, lastname: string, username: string, email: string, password: string}.
    * ***/
    this.app.post(`${APP_PREFIX_PATH}/users/register`, [
      authMiddleware.validateReqRegFields,
      authMiddleware.validateUserAlreadyExist,
      authController.createUser
    ])

    /***
    * @route  POST /api/users/login.
    * @desc   User authentication.
    * @access Public.
    * @body   { email: string, password: string }.
    * ***/
    this.app.post(`${APP_PREFIX_PATH}/users/login`, [
      authMiddleware.validateReqAuthFields,
      authMiddleware.verifyPassword,
      authController.createUserJWT
    ])

    /***
    * @route  POST /api/users/refresh-token.
    * @desc   Get authentication refresh token.
    * @access Private.
    * @body   { refresh_token: string }.
    * ***/
    this.app.post(`${APP_PREFIX_PATH}/users/refresh-token`, [
      jwtMiddleware.validJWTNeeded,
      jwtMiddleware.verifyRefreshBodyField,
      jwtMiddleware.validRefreshNeeded,
      authController.createUserJWT
    ])

    /***
    * @route  POST /api/users/follow.
    * @desc   Follow another user.
    * @access Private.
    * @body   { followed_user_id: string }.
    * ***/
     this.app.post(`${APP_PREFIX_PATH}/users/follow`, [
      jwtMiddleware.validJWTNeeded,
      authMiddleware.validateReqFollowField,
      authController.followUser
    ])

    return this.app;
  }
}
