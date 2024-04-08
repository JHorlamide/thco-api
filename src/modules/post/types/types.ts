export interface IPost {
  user: string;
  text: string;
  media?: string;
}

export interface IGetPostFeed {
  user_id: string;
  page: string;
  limit: string;
}
export interface PostComment {
  user_id: string;
  post_id: string;
  text: string;
}

export type PostLike = Pick<PostComment, "post_id" | "user_id">;