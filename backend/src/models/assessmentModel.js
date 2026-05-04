import { supabase } from "../config/supabase.js";
import { ApiError } from "../utils/errors.js";
import { insertOne } from "./baseModel.js";

export async function getLatestAssessment(userId) {
  const { data, error } = await supabase
    .from("assessments")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) throw new ApiError(500, "Failed to read assessment", error.message);
  return data;
}

export async function upsertAssessment(payload) {
  const existing = await getLatestAssessment(payload.user_id);
  if (!existing) return insertOne("assessments", payload);

  const { data, error } = await supabase
    .from("assessments")
    .update(payload)
    .eq("id", existing.id)
    .select("*")
    .single();
  if (error) throw new ApiError(500, "Failed to update assessment", error.message);
  return data;
}

export async function addAssessmentHistory(payload) {
  return insertOne("assessments_history", payload);
}

export async function getAssessmentHistory(userId) {
  const { data, error } = await supabase
    .from("assessments_history")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: true });
  if (error) throw new ApiError(500, "Failed to read assessment history", error.message);
  return data || [];
}
