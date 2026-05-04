import { asyncHandler } from "../utils/errors.js";
import * as authService from "../services/authService.js";

export const signup = asyncHandler(async (req, res) => {
  const result = await authService.signup(req.body);
  res.status(201).json({ success: true, message: "Signup successful", data: result });
});

export const login = asyncHandler(async (req, res) => {
  const result = await authService.login(req.body);
  res.json({ success: true, message: "Login successful", data: result });
});
