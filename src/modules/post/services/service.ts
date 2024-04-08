/* Library */
import mongoose from "mongoose";

/* Application Module */
import userService from "../../auth/service/service";
import { Post, Comment } from "../model/Post";
import { IPost, IGetPostFeed, PostComment, PostLike } from "../types/types";
import { ApiError, ClientError, NotFoundError, ServerError } from "../../../common/exceptions/APIError";
import { broadcastMessage } from "../../../websocketServer";

class PostService {
  async createPost(post_param: IPost) {
    const { user: user_id, text, media } = post_param;

    try {
      const user = await userService.getUserById(user_id);

      if (!user) {
        throw new NotFoundError("User not found");
      }

      const post = new Post({ user: user_id, text, media });
      await post.save();
      return post;
    } catch (error: any) {
      throw new ServerError(error.message);
    }
  }

  async getPostsFeed(inputParam: IGetPostFeed) {
    const { user_id, page, limit } = inputParam;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    try {
      const user = await userService.getUserById(user_id);

      if (!user) {
        throw new NotFoundError("User not found");
      }

      const following = user.following;
      const posts = await Post.find({ user: { $in: following } })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .populate("user")

      return posts;
    } catch (error: any) {
      throw new ServerError(error.message);
    }
  }

  async getPostById(post_id: string) {
    try {
      return await Post.findById(post_id);
    } catch (error: any) {
      throw new ServerError(error.message);
    }
  }

  async commentPost(comment_param: PostComment) {
    const { user_id, post_id, text } = comment_param;

    try {
      const post = await Post.findById(post_id);

      if (!post) throw new ClientError("Post not found");

      // Create new comment
      const comment = new Comment({ user: user_id, post: post_id, text });
      await comment.save();

      // Add comment ID to the comments array of the post
      post.comments.push(comment.id);
      await post.save();

      broadcastMessage({
        post_id,
        type: "comment",
        message: text
      });

      return comment;
    } catch (error: any) {
      throw new ServerError(error.message);
    }
  }

  async likePost({ user_id, post_id }: PostLike) {
    const user_object_id = new mongoose.Types.ObjectId(user_id);

    try {
      const post = await Post.findById(post_id);
      if (!post) throw new ApiError("Post not found", 400);

      // Check if user has already liked the post
      if (post.likes.includes(user_object_id))
        throw new ApiError("Post has already been liked!", 400);

      // Add user ID to the likes array of the post
      post.likes.push(user_object_id);
      await post.save();

      broadcastMessage({
        post_id,
        type: "like",
        message: "Your post got a like"
      });

      return post.likes;
    } catch (error: any) {
      throw new ServerError(error.message);
    }
  }
}

export default new PostService();
