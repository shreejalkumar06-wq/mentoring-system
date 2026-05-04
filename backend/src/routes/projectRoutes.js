import { Router } from "express";
import { projectsByCareer, submitUserProject, userProjects } from "../controllers/projectController.js";
import { requireAuth } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { submitProjectSchema } from "./schemas.js";

export const projectRoutes = Router();

projectRoutes.get("/projects/:career", requireAuth, projectsByCareer);
projectRoutes.post("/submit-project", requireAuth, validate(submitProjectSchema), submitUserProject);
projectRoutes.post("/projects/submit", requireAuth, validate(submitProjectSchema), submitUserProject);
projectRoutes.get("/user-projects/:user_id", requireAuth, userProjects);
