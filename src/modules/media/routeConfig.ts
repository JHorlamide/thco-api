/* Libraries */
import { Application } from "express";

/* Application Modules */ 
import { CommonRoutesConfig } from "../../common/commonRouteConfig";
import jwtMiddleware from "../auth/middleware/jwtMiddleware";
import config from "../../config/appConfig";
import mediaMiddleware from "./middleware/middleware"
import mediaController from "./controller/controller"

const APP_PREFIX_PATH = config.prefix;

export class MediaRoutes extends CommonRoutesConfig {
  constructor(app: Application) {
    super(app, "MediaRoutes");
  }

  configureRoutes() {
    /***
    * @router  POST: /api/media
    * @desc    Upload new media file
    * @access  Private
    * ***/
    this.app.post(`${APP_PREFIX_PATH}/media`, [
      jwtMiddleware.validJWTNeeded,
      mediaMiddleware.validateUploadedFile,
      mediaController.uploadFile
    ])

    return this.app;
  }
}
