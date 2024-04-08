import mongoose from 'mongoose';

export interface Jwt {
  user_id: string;
  refresh_key: string;
};

export interface FollowedParam {
  user_id: string,
  followed_user_id: mongoose.Types.ObjectId
}