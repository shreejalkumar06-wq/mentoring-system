import { asyncHandler } from "../utils/errors.js";
import { listMentors } from "../models/catalogModel.js";
import { matchMentors } from "../services/matchingService.js";
import {
  bookSession,
  cancelSession,
  getAvailableSessions,
  getSessionDetails,
  joinSession,
  rescheduleSession,
  updateSessionStatus
} from "../services/sessionService.js";

export const getMentors = asyncHandler(async (_req, res) => {
  const mentors = await listMentors();
  res.json({ success: true, data: mentors });
});

export const matchMentor = asyncHandler(async (req, res) => {
  const mentors = await matchMentors(req.auth.sub);
  res.json({ success: true, data: mentors });
});

export const bookMentoringSession = asyncHandler(async (req, res) => {
  const session = await bookSession({ userId: req.auth.sub, mentorId: req.body.mentorId, time: req.body.time });
  res.status(201).json({ success: true, message: "Session booked", data: session });
});

export const getSessions = asyncHandler(async (_req, res) => {
  const sessions = await getAvailableSessions();
  res.json({ success: true, data: sessions });
});

export const joinMentoringSession = asyncHandler(async (req, res) => {
  const session = await joinSession({ userId: req.auth.sub, sessionId: req.body.sessionId });
  res.json({ success: true, message: "Joined session", data: session });
});

export const getSession = asyncHandler(async (req, res) => {
  const session = await getSessionDetails(req.params.id);
  res.json({ success: true, data: session });
});

export const rescheduleMentoringSession = asyncHandler(async (req, res) => {
  const session = await rescheduleSession({
    sessionId: req.params.id,
    userId: req.auth.sub,
    role: req.auth.role,
    time: req.body.time
  });
  res.json({ success: true, message: "Session rescheduled", data: session });
});

export const cancelMentoringSession = asyncHandler(async (req, res) => {
  const session = await cancelSession({
    sessionId: req.params.id,
    userId: req.auth.sub,
    role: req.auth.role
  });
  res.json({ success: true, message: "Session cancelled", data: session });
});

export const changeSessionStatus = asyncHandler(async (req, res) => {
  const session = await updateSessionStatus({ sessionId: req.params.id, status: req.body.status });
  res.json({ success: true, message: "Session status updated", data: session });
});
