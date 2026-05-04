import { Router } from "express";
import { authRoutes } from "./authRoutes.js";
import { userRoutes } from "./userRoutes.js";
import { mentoringRoutes } from "./mentoringRoutes.js";
import { assessmentRoutes } from "./assessmentRoutes.js";
import { dashboardRoutes } from "./dashboardRoutes.js";
import { roadmapRoutes } from "./roadmapRoutes.js";
import { projectRoutes } from "./projectRoutes.js";
import { jobRoutes } from "./jobRoutes.js";

export const apiRoutes = Router();

apiRoutes.get("/health", (_req, res) => {
  res.json({ success: true, message: "Smart Mentoring API is healthy" });
});

apiRoutes.use(authRoutes);
apiRoutes.use(userRoutes);
apiRoutes.use(mentoringRoutes);
apiRoutes.use(assessmentRoutes);
apiRoutes.use(dashboardRoutes);
apiRoutes.use(roadmapRoutes);
apiRoutes.use(projectRoutes);
apiRoutes.use(jobRoutes);
