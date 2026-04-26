import { Request, Response } from "express";
// Note: Ensure your user service file is named users_service.ts
import {
  createUserService,
  getAllUsersService,
} from "../services/users_service";
import User from "../models/users";

export const createUser = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const newUser = await createUserService(req.body);
    res.status(201).json(newUser);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const getUsers = async (_req: Request, res: Response): Promise<void> => {
  try {
    const users = await getAllUsersService();
    res.status(200).json(users);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
export const getUserById = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }
    res.status(200).json(user);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const updateUser = async (
  req: any, // Using any for req.user access
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;
    const { accessLevel, ...otherData } = req.body;

    const userToUpdate = await User.findById(id);
    if (!userToUpdate) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    // Permission check for accessLevel
    if (accessLevel && accessLevel !== userToUpdate.accessLevel) {
      const requesterRole = req.user?.accessLevel;
      if (requesterRole !== "ADMIN" && requesterRole !== "PRESIDENT") {
        res.status(403).json({ error: "Forbidden: Only admins or presidents can change access levels" });
        return;
      }
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { ...otherData, ...(accessLevel ? { accessLevel } : {}) },
      { new: true },
    );

    res.status(200).json(updatedUser);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};
