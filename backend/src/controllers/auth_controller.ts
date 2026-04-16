import { Request, Response } from "express";
import { loginUserService } from "../services/auth_service";
import { createUserService } from "../services/users_service";

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: "Missing email or password" });
      return;
    }

    const user = await loginUserService(email, password);
    res.status(200).json(user);
  } catch (error: any) {
    res.status(401).json({ error: error.message });
  }
};

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password, jobTitle } = req.body;

    if (!name || !email || !password) {
      res.status(400).json({ error: "Missing required fields (name, email, password)" });
      return;
    }

    // Default to USER level for self-registration
    const newUser = await createUserService({
      name,
      email,
      password,
      jobTitle: jobTitle || "Team Member",
      accessLevel: "USER"
    });

    res.status(201).json(newUser);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};
