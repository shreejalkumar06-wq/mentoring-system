import { supabase } from "../config/supabase.js";
import { ApiError } from "../utils/errors.js";

export async function getStoredResume(userId) {
  const { data, error } = await supabase
    .from("resumes")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();
  if (error) throw new ApiError(500, "Failed to read resume", error.message);
  return data;
}

export async function upsertStoredResume(userId, resumeData) {
  const { data, error } = await supabase
    .from("resumes")
    .upsert(
      {
        user_id: userId,
        resume_data: resumeData,
        updated_at: new Date().toISOString()
      },
      { onConflict: "user_id" }
    )
    .select("*")
    .single();
  if (error) throw new ApiError(500, "Failed to store resume", error.message);
  return data;
}
