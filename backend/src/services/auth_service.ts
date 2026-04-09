import fs from "fs/promises";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import User from "../models/users";
import mongoose from "mongoose";

const USERS_FILE = path.join(process.cwd(), "data", "users.json");

export interface MockUser {
  _id: string;
  name: string;
  email: string;
  password?: string;
  jobTitle: string;
  accessLevel: "PRESIDENT" | "ADMIN" | "USER";
}

async function readUsers(): Promise<MockUser[]> {
  try {
    const data = await fs.readFile(USERS_FILE, "utf-8");
    return JSON.parse(data);
  } catch (err) {
    return [];
  }
}

async function writeUsers(users: MockUser[]): Promise<void> {
  await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2));
}

export const registerUserService = async (userData: Omit<MockUser, "_id">) => {
  const users = await readUsers();
  if (users.find((u) => u.email === userData.email)) {
    throw new Error("User with this email already exists");
  }

  // 1. Create in MongoDB first to get a valid ObjectId
  const mongoUser = new User({
    name: userData.name,
    email: userData.email,
    jobTitle: userData.jobTitle,
    accessLevel: userData.accessLevel,
  });
  
  await mongoUser.save();

  // 2. Use the same ID for our JSON store to ensure consistency
  const newUser: MockUser = {
    ...userData,
    _id: (mongoUser._id as any).toString(),
  };

  users.push(newUser);
  await writeUsers(users);
  
  const { password, ...userWithoutPassword } = newUser;
  return userWithoutPassword;
};

export const loginUserService = async (email: string, password?: string) => {
  const users = await readUsers();
  const user = users.find((u) => u.email === email && u.password === password);
  
  if (!user) {
    throw new Error("Invalid email or password");
  }

  const { password: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

export const getUserByIdService = async (id: string) => {
  const users = await readUsers();
  const user = users.find((u) => u._id === id);
  if (!user) return null;
  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
};
