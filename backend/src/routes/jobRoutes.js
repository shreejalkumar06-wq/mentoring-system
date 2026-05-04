import { Router } from "express";
import { matchEligibleJobs } from "../controllers/jobController.js";
import { requireAuth } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { matchByUserSchema } from "./schemas.js";

export const jobRoutes = Router();

jobRoutes.post("/match-jobs", requireAuth, validate(matchByUserSchema), matchEligibleJobs);
