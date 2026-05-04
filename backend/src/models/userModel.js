import { supabase } from "../config/supabase.js";
import { ApiError } from "../utils/errors.js";
import { insertOne, selectOne } from "./baseModel.js";

const publicUserColumns =
  "id,name,email,role,skills,interests,target_career,level_score,onboarding_complete,created_at";

export async function createUser(payload) {
  return insertOne("users", payload);
}

export async function findUserByEmail(email) {
  if (!email) return null;
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("email", email.toLowerCase())
    .maybeSingle();
  if (error) throw new ApiError(500, "Failed to lookup user", error.message);
  return data;
}

export async function findUserById(id, includePassword = false) {
  if (includePassword) return selectOne("users", "id", id);

  const { data, error } = await supabase.from("users").select(publicUserColumns).eq("id", id).maybeSingle();
  if (error) throw new ApiError(500, "Failed to lookup user", error.message);
  return data;
}

export async function updateUser(id, payload) {
  const cleaned = { ...payload };
  delete cleaned.id;
  delete cleaned.password_hash;

  const { data, error } = await supabase
    .from("users")
    .update(cleaned)
    .eq("id", id)
    .select(publicUserColumns)
    .single();
  if (error) throw new ApiError(500, "Failed to update user", error.message);
  return data;
}
