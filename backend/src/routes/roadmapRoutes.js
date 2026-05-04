import { Router } from "express";
import { roadmap } from "../controllers/roadmapController.js";
import { requireAuth } from "../middleware/auth.js";

export const roadmapRoutes = Router();

roadmapRoutes.get("/roadmap/:career", requireAuth, roadmap);
