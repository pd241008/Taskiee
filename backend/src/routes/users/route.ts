import { Router } from "express";
// Assuming you create this file next based on the earlier code provided
import { createUser, getUsers, getUserById } from "../../controllers/user_controller";
// 1. Changed "middlewares" to "middleware"
import { requireAuth, requireAdmin } from "../../middleware/auth_middleware";

const router = Router();

router.post("/", createUser); // Middleware temporarily removed!
router.get("/", requireAuth, getUsers);
router.get("/:id", requireAuth, getUserById);

export default router;
