import { ClientError, ServerError } from "../../../common/exceptions/APIError";
import User, { User as IUser } from "../model/User";
import { FollowedParam } from "../types/authTypes";

class UserService {
  async createUser(user: IUser) {
    try {
      const new_user = new User(user);
      await new_user.save();
      return { user_id: new_user.id }
    } catch (error: any) {
      throw new ServerError(error.message);
    }
  }

  async followUser({ user_id, followed_user_id }: FollowedParam) {
    try {
      const user = await User.findById(user_id);
      const followed_user = await User.findById(followed_user_id);

      if (!user || !followed_user) throw new ClientError("User not found");

      if (user.following.includes(followed_user_id))
        throw new ClientError('You is already following this user');

      user.following.push(followed_user_id);
      await user.save();

      return followed_user_id;
    } catch (error: any) {
      throw new ServerError(error.message);
    }
  }

  async getUserByEmail(user_email: string) {
    try {
      return await User.findOne({ email: user_email });
    } catch (error: any) {
      throw new ServerError(error.message);
    }
  }

  async getUserByEmailOrUsername(user_email: string, username: string) {
    try {
      return await User.findOne({
        $or: [
          { email: user_email },
          { username }
        ]
      });
    } catch (error: any) {
      throw new ServerError(error.message);
    }
  }

  async getUserById(user_id: string) {
    try {
      return await User.findById(user_id);
    } catch (error: any) {
      throw new ServerError(error.message);
    }
  }
}

export default new UserService();