import User, { IUser } from "../models/users";
import { hashPassword, syncUserToJSON } from "./auth_service";

export const createUserService = async (userData: Partial<IUser>) => {
  // 1. Hash password if provided
  if (userData.password) {
    userData.password = hashPassword(userData.password);
  }

  // 2. Set default job title if missing
  if (!userData.jobTitle || userData.jobTitle.trim() === "") {
    userData.jobTitle = "Team Member";
  }

  // 3. Normalize email
  if (userData.email) {
    userData.email = userData.email.toLowerCase().trim();
  }

  // 4. Save to MongoDB
  const user = new User(userData);
  const savedUser = await user.save();

  // 3. Sync to JSON store for login compatibility
  await syncUserToJSON({
    _id: (savedUser._id as any).toString(),
    name: savedUser.name,
    email: savedUser.email,
    password: savedUser.password,
    jobTitle: savedUser.jobTitle,
    accessLevel: savedUser.accessLevel as any,
  });

  return savedUser;
};

export const getAllUsersService = async () => {
  // Returns all users, sorted by jobTitle to easily group them on the frontend
  return await User.find().sort({ jobTitle: 1 });
};
