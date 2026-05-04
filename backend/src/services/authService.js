import bcrypt from "bcryptjs";
import { ApiError } from "../utils/errors.js";
import { generateHumanName } from "../utils/nameGenerator.js";
import { signToken } from "../utils/jwt.js";
import { createUser, findUserByEmail } from "../models/userModel.js";

export async function signup({ email, password, name, skills = [], interests = [], targetCareer }) {
  const normalizedEmail = email.toLowerCase();
  const existing = await findUserByEmail(normalizedEmail);
  if (existing) throw new ApiError(409, "A user with this email already exists");

  const passwordHash = await bcrypt.hash(password, 12);
  const user = await createUser({
    name: name || generateHumanName(),
    email: normalizedEmail,
    password_hash: passwordHash,
    role: "user",
    skills,
    interests,
    target_career: targetCareer || null,
    onboarding_complete: Boolean(skills.length && targetCareer)
  });

  const { password_hash: _passwordHash, ...safeUser } = user;
  return { user: safeUser, token: signToken(safeUser) };
}

export async function login({ email, password }) {
  const user = await findUserByEmail(email.toLowerCase());
  if (!user) throw new ApiError(401, "Invalid email or password");

  const matches = await bcrypt.compare(password, user.password_hash || "");
  if (!matches) throw new ApiError(401, "Invalid email or password");

  const { password_hash: _passwordHash, ...safeUser } = user;
  return { user: safeUser, token: signToken(safeUser) };
}
