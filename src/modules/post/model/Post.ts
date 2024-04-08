import mongoose, { Schema, model } from 'mongoose';

interface IPost {
  user: mongoose.Types.ObjectId;
  text: string;
  media?: string;
  likes: mongoose.Types.ObjectId[];
  comments: mongoose.Types.ObjectId[];
}

interface IComment {
  user: mongoose.Types.ObjectId;
  post: mongoose.Types.ObjectId;
  text: string;
}

const post_schema = new Schema<IPost>({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  text: { type: String, required: true },
  media: { type: Schema.Types.ObjectId, ref: "Media" },
  likes: [{ type: Schema.Types.ObjectId, ref: "User" }], // Array of user IDs who liked the post
  comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }] // Array of comment IDs associated with the post
}, { timestamps: true });

const comment_schema = new Schema<IComment>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  post: { type: Schema.Types.ObjectId, ref: 'Post', required: true },
  text: { type: String, required: true },
}, { timestamps: true });

/* Database indexing */
post_schema.index({ user: 1 });
comment_schema.index({ user: 1, post: 1 });

/* Model Definition */
const Post = model<IPost>('Posts', post_schema);
const Comment = model<IComment>("Comments", comment_schema);

export { Post, Comment }