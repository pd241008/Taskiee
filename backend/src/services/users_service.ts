import User, { IUser } from "../models/users";

export const createUserService = async (userData: Partial<IUser>) => {
  const user = new User(userData);
  return await user.save();
};

export const getAllUsersService = async () => {
  // Returns all users, sorted by jobTitle to easily group them on the frontend
  return await User.find().sort({ jobTitle: 1 });
};
