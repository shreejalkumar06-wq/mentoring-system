import { ApiError } from "../utils/errors.js";
import { findUserById, updateUser } from "../models/userModel.js";

export async function getUserOrThrow(id) {
  const user = await findUserById(id);
  if (!user) throw new ApiError(404, "User not found");
  return user;
}

export async function updateSkills(userId, payload) {
  await getUserOrThrow(userId);
  return updateUser(userId, {
    skills: payload.skills,
    interests: payload.interests || [],
    target_career: payload.targetCareer,
    onboarding_complete: true
  });
}
