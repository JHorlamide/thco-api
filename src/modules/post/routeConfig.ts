import { Application } from "express";
import { CommonRoutesConfig } from "../../common/commonRouteConfig";
import postMiddleware from "./middleware/middleware";
import postController from "./controller/controller";
import jwtMiddleware from "../auth/middleware/jwtMiddleware";
import config from "../../config/appConfig";

const APP_PREFIX_PATH = config.prefix;

export class PostRoutes extends CommonRoutesConfig {
  constructor(app: Application) {
    super(app, "PostRoutes");
  }

  configureRoutes() {
    /***
    * @router  POST: /api/posts
    * @desc    Create new post
    * @access  Private
    * @body { user: string, text: string, media?: string }
    * ***/
    this.app.post(`${APP_PREFIX_PATH}/posts`, [
      jwtMiddleware.validJWTNeeded,
      postMiddleware.validatePostBody,
      postController.createPost
    ])

    /***
    * @router  GET: /api/posts
    * @desc    Get posts from followed users with pagination
    * @access  Private
    * ***/
    this.app.get(`${APP_PREFIX_PATH}/posts`, [
      jwtMiddleware.validJWTNeeded,
      postController.getFeed
    ])

    /***
    * @router  GET: /api/posts/comment
    * @desc    Comment on a post
    * @access  Private
    * @body    { text: string }
    * ***/
    this.app.post(`${APP_PREFIX_PATH}/posts/:post_id/comment`, [
      jwtMiddleware.validJWTNeeded,
      postMiddleware.validateCommentBody,
      postMiddleware.validatePostExist,
      postController.commentPost
    ])

    /***
    * @router  GET: /api/posts/like
    * @desc    Like a post
    * @access  Private
    * ***/
    this.app.post(`${APP_PREFIX_PATH}/posts/:post_id/like`, [
      jwtMiddleware.validJWTNeeded,
      postMiddleware.validatePostExist,
      postController.likePost
    ])

    return this.app;
  }
}
