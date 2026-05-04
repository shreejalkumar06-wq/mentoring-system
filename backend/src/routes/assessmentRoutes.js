import { Router } from "express";
import {
  fetchCoding,
  fetchQuiz,
  getUserAssessment,
  submitCodingScore,
  submitQuizAnswers
} from "../controllers/assessmentController.js";
import { requireAuth } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { submitCodingSchema, submitQuizSchema } from "./schemas.js";

export const assessmentRoutes = Router();

assessmentRoutes.get("/quiz/:career", requireAuth, fetchQuiz);
assessmentRoutes.post("/quiz/submit", requireAuth, validate(submitQuizSchema), submitQuizAnswers);
assessmentRoutes.post("/submit-quiz", requireAuth, validate(submitQuizSchema), submitQuizAnswers);
assessmentRoutes.get("/coding/:career", requireAuth, fetchCoding);
assessmentRoutes.post("/coding/submit", requireAuth, validate(submitCodingSchema), submitCodingScore);
assessmentRoutes.post("/submit-coding", requireAuth, validate(submitCodingSchema), submitCodingScore);
assessmentRoutes.get("/assessment/:user_id", requireAuth, getUserAssessment);
