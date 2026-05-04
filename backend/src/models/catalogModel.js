import { supabase } from "../config/supabase.js";
import { ApiError } from "../utils/errors.js";
import { insertOne, listRows, selectOne } from "./baseModel.js";

export async function listMentors() {
  return listRows("mentors");
}

export async function listCareers() {
  return listRows("careers");
}

export async function findCareer(career) {
  const { data, error } = await supabase
    .from("careers")
    .select("*")
    .ilike("name", career)
    .maybeSingle();
  if (error) throw new ApiError(500, "Failed to read career", error.message);
  return data;
}

export async function listProjectsByCareer(career) {
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .or(`career.ilike.${career},career.is.null`);
  if (error) throw new ApiError(500, "Failed to read projects", error.message);
  return data || [];
}

export async function findProject(id) {
  return selectOne("projects", "id", id);
}

export async function listJobs() {
  return listRows("jobs");
}

export async function createUserProject(payload) {
  return insertOne("user_projects", payload);
}

export async function listUserProjects(userId) {
  const { data, error } = await supabase
    .from("user_projects")
    .select("*,projects(*)")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  if (error) throw new ApiError(500, "Failed to read user projects", error.message);
  return data || [];
}
