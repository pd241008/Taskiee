import { Router } from "express";
import { getReport } from "../../controllers/reports_controller";
import { requireAuth } from "../../middleware/auth_middleware";

const router = Router();

router.get("/", requireAuth, getReport);

export default router;
