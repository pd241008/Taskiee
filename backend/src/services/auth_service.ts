import crypto from "crypto";
import fs from "fs/promises";
import path from "path";
import User from "../models/users";

const USERS_FILE = path.join(process.cwd(), "data", "users.json");
const SALT = "Taskie-Security-Core-2025"; // Static salt for SHA-256

export interface MockUser {
  _id: string;
  name: string;
  email: string;
  password?: string;
  jobTitle: string;
  accessLevel: "PRESIDENT" | "ADMIN" | "USER";
}

export function hashPassword(password: string): string {
  return crypto.createHash("sha256").update(password + SALT).digest("hex");
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

// Helper to ensure MongoDB and JSON stay in sync
export async function syncUserToJSON(user: MockUser) {
  const users = await readUsers();
  const index = users.findIndex((u) => u.email === user.email || u._id === user._id);
  if (index !== -1) {
    users[index] = user;
  } else {
    users.push(user);
  }
  await writeUsers(users);
}



export const loginUserService = async (email: string, password?: string) => {
  // Try to find user in MongoDB first as the source of truth
  let mongoUser = await User.findOne({ email });
  
  // If not in Mongo, check JSON (legacy/sync case)
  const users = await readUsers();
  const jsonUser = users.find((u) => u.email === email);

  if (!mongoUser && !jsonUser) {
    throw new Error("Invalid email or password");
  }

  // If user is in JSON but not in Mongo, migrate to Mongo
  if (jsonUser && !mongoUser) {
    mongoUser = new User({
      _id: jsonUser._id,
      name: jsonUser.name,
      email: jsonUser.email,
      password: jsonUser.password,
      jobTitle: jsonUser.jobTitle,
      accessLevel: jsonUser.accessLevel,
    });
    await mongoUser.save();
  }

  // If user is in Mongo but not in JSON, sync to JSON
  if (mongoUser && !jsonUser) {
    await syncUserToJSON({
      _id: (mongoUser._id as any).toString(),
      name: mongoUser.name,
      email: mongoUser.email,
      password: mongoUser.password,
      jobTitle: mongoUser.jobTitle,
      accessLevel: mongoUser.accessLevel as any,
    });
  }

  // Verification 
  const hashedPassword = password ? hashPassword(password) : undefined;
  if (mongoUser?.password !== hashedPassword) {
    throw new Error("Invalid email or password");
  }

  const { password: _, ...userWithoutPassword } = (mongoUser as any).toObject();
  return userWithoutPassword;
};

export const getUserByIdService = async (id: string) => {
  const mongoUser = await User.findById(id);
  if (mongoUser) {
    const { password, ...userWithoutPassword } = (mongoUser as any).toObject();
    return userWithoutPassword;
  }

  const users = await readUsers();
  const user = users.find((u) => u._id === id);
  if (!user) return null;
  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
};
