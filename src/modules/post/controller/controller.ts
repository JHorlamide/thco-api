import { Request, Response } from "express";
import responseHandler from "../../../common/responseHandler";
import asyncHandler from "../../../common/middleware/asyncHandler";
import postService from "../services/service";

class PostController {
  createPost = asyncHandler(async (req: Request, res: Response) => {
    const { text, media } = req.body;
    const { user_id } = res.locals.jwt;

    const post = await postService.createPost({
      user: user_id,
      text,
      media
    });

    responseHandler.successfullyCreated("Post created successfully", post, res);
  })

  getFeed = asyncHandler(async (req: Request, res: Response) => {
    const { user_id } = res.locals.jwt;
    const { page = "1", limit = "10" } = req.query as { page?: string, limit?: string };
    const posts = await postService.getPostsFeed({ user_id, page, limit });
    responseHandler.successResponse("Posts fetched successfully", posts, res);
  })

  commentPost = asyncHandler(async (req: Request, res: Response) => {
    const { user_id } = res.locals.jwt;
    const { post_id, } = req.params;
    const { text } = req.body;
    const comment = await postService.commentPost({ user_id, post_id, text });
    responseHandler.successfullyCreated("Comment added successfully", comment, res);
  })

  likePost = asyncHandler(async (req: Request, res: Response) => {
    const { user_id } = res.locals.jwt;
    const { post_id } = req.params;
    const Post_likes = await postService.likePost({ user_id, post_id });
    responseHandler.successResponse("Post liked successfully", Post_likes, res);
  })
}

export default new PostController();
