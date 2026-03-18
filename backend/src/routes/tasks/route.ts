import { Router } from "express";
import {
  createTask,
  getTasks,
  updateTask,
  // 1. Added an extra '../' to reach the controllers folder
} from "../../controllers/tasks_controller";
// 2. Added an extra '../' and fixed 'middlewares' to 'middleware' and '.middleware' to '_middleware'
import { requireAuth, requireAdmin } from "../../middleware/auth_middleware";

const router = Router();

router.post("/", requireAuth, requireAdmin, createTask);
router.get("/", requireAuth, getTasks);
router.patch("/:id/status", requireAuth, updateTask);

export default router;
