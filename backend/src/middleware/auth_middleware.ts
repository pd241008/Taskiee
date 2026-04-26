import { Request, Response, NextFunction } from "express";
import User from "../models/users";
import { getUserByIdService } from "../services/auth_service";

// Extend Express Request to hold our authenticated user
export interface AuthRequest extends Request {
  user?: any;
}

export const requireAuth = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const userId = req.headers["x-user-id"]; // Simulating auth for the assignment demo
    if (!userId) {
      res.status(401).json({ error: "Unauthorized: Missing x-user-id header" });
      return;
    }

    let user: any = await User.findById(userId);

    // If not in MongoDB, check the Mock JSON store
    if (!user) {
      user = await getUserByIdService(userId as string);
    }

    if (!user) {
      res.status(401).json({ error: "Unauthorized: User not found in any store" });
      return;
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(500).json({ error: "Server error in auth middleware" });
  }
};

export const requireAdmin = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): void => {
  if (req.user && (req.user.accessLevel === "ADMIN" || req.user.accessLevel === "PRESIDENT")) {
    next();
  } else {
    res.status(403).json({ error: "Forbidden: Admin access required" });
  }
};

export const requirePresident = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): void => {
  if (req.user && req.user.accessLevel === "PRESIDENT") {
    next();
  } else {
    res.status(403).json({ error: "Forbidden: President access required" });
  }
};
