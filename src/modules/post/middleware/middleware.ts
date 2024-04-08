import { Request, Response, NextFunction } from "express";
import requestBodyValidator from "../../../common/middleware/requestValidation";
import { post_schema, post_comment } from "../validation/validation.schema";
import responseHandler from "../../../common/responseHandler";
import postService from "../services/service"

class PostMiddleware {
  validatePostBody = requestBodyValidator(post_schema);
  validateCommentBody = requestBodyValidator(post_comment);

  async validatePostExist(req: Request, res: Response, next: NextFunction) {
    const { post_id } = req.params;
    const post = await postService.getPostById(post_id);
    if (!post) return responseHandler.badRequest("Post not found", res);
    next();
  }
}

export default new PostMiddleware();
