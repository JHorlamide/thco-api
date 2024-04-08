import { Schema, model } from "mongoose";

export interface IMedia {
  media_url: string;
  key: string;
}

const uploadSchema = new Schema<IMedia>({
  media_url: { type: String, required: true },
  key: { type: String, required: true },
}, { timestamps: true })

export default model<IMedia>("Media", uploadSchema);
