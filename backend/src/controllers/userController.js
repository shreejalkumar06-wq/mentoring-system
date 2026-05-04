import { ApiError, asyncHandler } from "../utils/errors.js";
import * as userService from "../services/userService.js";
import { getDashboard, getCareerMatch } from "../services/matchingService.js";
import { getResume, saveResume } from "../services/resumeService.js";

export const getUser = asyncHandler(async (req, res) => {
  if (req.params.id !== req.auth.sub) throw new ApiError(403, "You can only access your own user record");
  const user = await userService.getUserOrThrow(req.params.id);
  res.json({ success: true, data: user });
});

export const getProfile = asyncHandler(async (req, res) => {
  const user = await userService.getUserOrThrow(req.auth.sub);
  res.json({ success: true, data: user });
});

export const updateSkills = asyncHandler(async (req, res) => {
  const user = await userService.updateSkills(req.auth.sub, req.body);
  res.json({ success: true, message: "Skills updated", data: user });
});

export const getUserScore = asyncHandler(async (req, res) => {
  const dashboard = await getDashboard(req.auth.sub);
  res.json({
    success: true,
    data: {
      levelScore: dashboard.levelScore,
      level: dashboard.level,
      breakdown: dashboard.breakdown
    }
  });
});

export const getCareerMatchForUser = asyncHandler(async (req, res) => {
  const result = await getCareerMatch(req.auth.sub);
  res.json({ success: true, data: result });
});

export const getResumeJson = asyncHandler(async (req, res) => {
  const requestedUserId = req.params.user_id || req.auth.sub;
  if (requestedUserId !== req.auth.sub) throw new ApiError(403, "You can only access your own resume");
  const resume = await getResume(requestedUserId);
  res.json({ success: true, data: resume });
});

export const storeResumeJson = asyncHandler(async (req, res) => {
  const resume = await saveResume(req.auth.sub, req.body.resumeData);
  res.json({ success: true, message: "Resume stored", data: resume });
});
