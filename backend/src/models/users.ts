import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  jobTitle: string; // e.g., 'President', 'Tech Lead', 'Developer'
  accessLevel: "PRESIDENT" | "ADMIN" | "USER"; // This dictates what they can do in the portal
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: false, // Optional because we might migrate some legacy users later
    },
    jobTitle: {
      type: String,
      required: true,
    },
    accessLevel: {
      type: String,
      enum: ["PRESIDENT", "ADMIN", "USER"],
      default: "USER", // Defaults to standard user for safety
    },
  },
  {
    timestamps: true, // Automatically manages createdAt and updatedAt
  },
);

export default mongoose.model<IUser>("User", UserSchema);
