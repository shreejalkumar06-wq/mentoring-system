import { supabase } from "../config/supabase.js";
import { ApiError } from "../utils/errors.js";

export async function selectOne(table, column, value) {
  const { data, error } = await supabase.from(table).select("*").eq(column, value).maybeSingle();
  if (error) throw new ApiError(500, `Failed to read ${table}`, error.message);
  return data;
}

export async function insertOne(table, payload) {
  const { data, error } = await supabase.from(table).insert(payload).select("*").single();
  if (error) throw new ApiError(500, `Failed to create ${table} record`, error.message);
  return data;
}

export async function updateOne(table, column, value, payload) {
  const { data, error } = await supabase
    .from(table)
    .update(payload)
    .eq(column, value)
    .select("*")
    .single();
  if (error) throw new ApiError(500, `Failed to update ${table}`, error.message);
  return data;
}

export async function listRows(table, query = "*") {
  const { data, error } = await supabase.from(table).select(query);
  if (error) throw new ApiError(500, `Failed to list ${table}`, error.message);
  return data || [];
}
