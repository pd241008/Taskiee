import { Request, Response } from "express";
import { registerUserService, loginUserService } from "../services/auth_service";

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password, jobTitle } = req.body;
    
    if (!name || !email || !password || !jobTitle) {
      res.status(400).json({ error: "Missing required fields" });
      return;
    }

    const newUser = await registerUserService({
      name,
      email,
      password,
      jobTitle,
      accessLevel: "USER", // Default for new registrations
    });

    res.status(201).json(newUser);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

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
