import { Router } from "express";
import { getProjects, createProject } from "../../controllers/project_controller";
import { requireAuth, requireAdmin } from "../../middleware/auth_middleware";

const router = Router();

router.get("/", requireAuth, getProjects);
router.post("/", requireAuth, requireAdmin, createProject);

export default router;
