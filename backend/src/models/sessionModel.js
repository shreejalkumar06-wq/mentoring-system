import { supabase } from "../config/supabase.js";
import { ApiError } from "../utils/errors.js";
import { insertOne, selectOne } from "./baseModel.js";

export async function listSessions() {
  const { data, error } = await supabase
    .from("sessions")
    .select("*,mentors(*),session_participants(user_id)")
    .order("time", { ascending: true });
  if (error) throw new ApiError(500, "Failed to list sessions", error.message);
  return data || [];
}

export async function findMentorSessionsInWindow(mentorId, startIso, endIso) {
  const { data, error } = await supabase
    .from("sessions")
    .select("*")
    .eq("mentor_id", mentorId)
    .neq("status", "completed")
    .gte("time", startIso)
    .lte("time", endIso);
  if (error) throw new ApiError(500, "Failed to read mentor sessions", error.message);
  return data || [];
}

export async function getSession(id) {
  const { data, error } = await supabase
    .from("sessions")
    .select("*,mentors(*),session_participants(user_id,users(id,name,email))")
    .eq("id", id)
    .maybeSingle();
  if (error) throw new ApiError(500, "Failed to read session", error.message);
  return data;
}

export async function createSession(payload) {
  return insertOne("sessions", payload);
}

export async function updateSessionUsers(sessionId, users) {
  const { data, error } = await supabase
    .from("sessions")
    .update({ users })
    .eq("id", sessionId)
    .select("*")
    .single();
  if (error) throw new ApiError(500, "Failed to update session users", error.message);
  return data;
}

export async function updateSession(sessionId, payload) {
  const { data, error } = await supabase
    .from("sessions")
    .update(payload)
    .eq("id", sessionId)
    .select("*")
    .single();
  if (error) throw new ApiError(500, "Failed to update session", error.message);
  return data;
}

export async function createParticipant(payload) {
  return insertOne("session_participants", payload);
}

export async function findParticipant(sessionId, userId) {
  const { data, error } = await supabase
    .from("session_participants")
    .select("*")
    .eq("session_id", sessionId)
    .eq("user_id", userId)
    .maybeSingle();
  if (error) throw new ApiError(500, "Failed to read session participant", error.message);
  return data;
}

export async function findMentor(id) {
  return selectOne("mentors", "id", id);
}
