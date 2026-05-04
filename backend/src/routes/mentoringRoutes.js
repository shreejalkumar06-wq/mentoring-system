import { Router } from "express";
import {
  bookMentoringSession,
  cancelMentoringSession,
  changeSessionStatus,
  getMentors,
  getSession,
  getSessions,
  joinMentoringSession,
  matchMentor,
  rescheduleMentoringSession
} from "../controllers/mentoringController.js";
import { requireAuth, requireRole } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import {
  bookSessionSchema,
  joinSessionSchema,
  matchByUserSchema,
  rescheduleSessionSchema,
  sessionStatusSchema
} from "./schemas.js";

export const mentoringRoutes = Router();

mentoringRoutes.get("/mentors", requireAuth, getMentors);
mentoringRoutes.post("/match-mentor", requireAuth, validate(matchByUserSchema), matchMentor);
mentoringRoutes.post("/book-session", requireAuth, validate(bookSessionSchema), bookMentoringSession);
mentoringRoutes.get("/sessions", requireAuth, getSessions);
mentoringRoutes.post("/sessions/join", requireAuth, validate(joinSessionSchema), joinMentoringSession);
mentoringRoutes.get("/sessions/:id", requireAuth, getSession);
mentoringRoutes.patch("/sessions/:id/reschedule", requireAuth, validate(rescheduleSessionSchema), rescheduleMentoringSession);
mentoringRoutes.patch("/sessions/:id/cancel", requireAuth, cancelMentoringSession);
mentoringRoutes.patch(
  "/sessions/:id/status",
  requireAuth,
  requireRole("mentor", "admin"),
  validate(sessionStatusSchema),
  changeSessionStatus
);
