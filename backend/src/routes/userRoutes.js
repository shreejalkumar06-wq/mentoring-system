import { Router } from "express";
import {
  getCareerMatchForUser,
  getProfile,
  getResumeJson,
  storeResumeJson,
  getUser,
  getUserScore,
  updateSkills
} from "../controllers/userController.js";
import { requireAuth } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { resumeSchema, updateSkillsSchema } from "./schemas.js";

export const userRoutes = Router();

userRoutes.get("/user/profile", requireAuth, getProfile);
userRoutes.get("/user/score", requireAuth, getUserScore);
userRoutes.get("/career/match", requireAuth, getCareerMatchForUser);
userRoutes.get("/resume", requireAuth, getResumeJson);
userRoutes.get("/resume/:user_id", requireAuth, getResumeJson);
userRoutes.put("/resume", requireAuth, validate(resumeSchema), storeResumeJson);
userRoutes.get("/user/:id", requireAuth, getUser);
userRoutes.put("/user/update-skills", requireAuth, validate(updateSkillsSchema), updateSkills);
userRoutes.put("/user/profile", requireAuth, validate(updateSkillsSchema), updateSkills);
