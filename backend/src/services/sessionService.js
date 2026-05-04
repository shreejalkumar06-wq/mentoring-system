import { ApiError } from "../utils/errors.js";
import {
  createParticipant,
  createSession,
  findMentor,
  findMentorSessionsInWindow,
  findParticipant,
  getSession,
  listSessions,
  updateSession,
  updateSessionUsers
} from "../models/sessionModel.js";
import { getUserOrThrow } from "./userService.js";

const MAX_USERS_PER_SESSION = 5;
const SESSION_DURATION_MINUTES = 60;

function minutesFromTime(time) {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

function assertMentorAvailable(mentor, date) {
  const slots = mentor.availability?.slots || [];
  if (!slots.length) return;

  const day = date.getUTCDay();
  const minutes = date.getUTCHours() * 60 + date.getUTCMinutes();
  const available = slots.some((slot) => {
    return slot.day === day && minutes >= minutesFromTime(slot.start) && minutes + SESSION_DURATION_MINUTES <= minutesFromTime(slot.end);
  });

  if (!available) throw new ApiError(409, "Mentor is not available at the requested time");
}

async function assertNoMentorConflict(mentorId, time, ignoredSessionId = null) {
  const requested = new Date(time);
  const start = new Date(requested.getTime() - SESSION_DURATION_MINUTES * 60 * 1000);
  const end = new Date(requested.getTime() + SESSION_DURATION_MINUTES * 60 * 1000);
  const conflicts = await findMentorSessionsInWindow(mentorId, start.toISOString(), end.toISOString());
  const blocking = conflicts.find((session) => session.id !== ignoredSessionId);
  if (blocking) throw new ApiError(409, "Mentor already has a session near this time");
}

export async function getAvailableSessions() {
  const sessions = await listSessions();
  return sessions.map((session) => ({
    ...session,
    participantCount: session.session_participants?.length || 0,
    seatsLeft: Math.max(0, MAX_USERS_PER_SESSION - (session.session_participants?.length || 0))
  }));
}

export async function bookSession({ userId, mentorId, time }) {
  await getUserOrThrow(userId);
  const mentor = await findMentor(mentorId);
  if (!mentor) throw new ApiError(404, "Mentor not found");
  const requestedTime = new Date(time);
  if (Number.isNaN(requestedTime.getTime())) throw new ApiError(400, "Invalid session time");
  assertMentorAvailable(mentor, requestedTime);
  await assertNoMentorConflict(mentorId, time);

  const session = await createSession({
    mentor_id: mentorId,
    users: [userId],
    status: "scheduled",
    time
  });

  await createParticipant({ session_id: session.id, user_id: userId });
  return getSession(session.id);
}

export async function rescheduleSession({ sessionId, userId, role, time }) {
  const session = await getSessionDetails(sessionId);
  const participantIds = session.users || [];
  if (role !== "admin" && !participantIds.includes(userId)) {
    throw new ApiError(403, "Only participants or admins can reschedule this session");
  }

  const mentor = await findMentor(session.mentor_id);
  const requestedTime = new Date(time);
  if (Number.isNaN(requestedTime.getTime())) throw new ApiError(400, "Invalid session time");
  assertMentorAvailable(mentor, requestedTime);
  await assertNoMentorConflict(session.mentor_id, time, sessionId);

  await updateSession(sessionId, { time, status: "scheduled" });
  return getSessionDetails(sessionId);
}

export async function cancelSession({ sessionId, userId, role }) {
  const session = await getSessionDetails(sessionId);
  const participantIds = session.users || [];
  if (role !== "admin" && !participantIds.includes(userId)) {
    throw new ApiError(403, "Only participants or admins can cancel this session");
  }

  await updateSession(sessionId, { status: "completed" });
  return getSessionDetails(sessionId);
}

export async function updateSessionStatus({ sessionId, status }) {
  await getSessionDetails(sessionId);
  await updateSession(sessionId, { status });
  return getSessionDetails(sessionId);
}

export async function joinSession({ userId, sessionId }) {
  await getUserOrThrow(userId);
  const session = await getSession(sessionId);
  if (!session) throw new ApiError(404, "Session not found");

  const participants = session.session_participants || [];
  if (participants.length >= MAX_USERS_PER_SESSION) throw new ApiError(409, "Session is already full");

  const existing = await findParticipant(sessionId, userId);
  if (existing) return session;

  await createParticipant({ session_id: sessionId, user_id: userId });
  await updateSessionUsers(sessionId, [...new Set([...(session.users || []), userId])]);
  return getSession(sessionId);
}

export async function getSessionDetails(sessionId) {
  const session = await getSession(sessionId);
  if (!session) throw new ApiError(404, "Session not found");
  return session;
}
