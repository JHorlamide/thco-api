import  mongoose, { Schema, model } from 'mongoose';

export interface User {
  firstname: string;
  lastname: string;
  username: string;
  email: string;
  password: string;
}

interface IUser extends User {
  following: mongoose.Types.ObjectId[];
}

const user_schema = new Schema<IUser>({
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  following: [{ type: Schema.Types.ObjectId, ref: 'User' }]
}, { timestamps: true });

user_schema.index({ email: 1, username: 1 }, { unique: true });

export default model<IUser>('User', user_schema);