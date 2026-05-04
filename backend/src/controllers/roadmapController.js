import { asyncHandler } from "../utils/errors.js";
import { getRoadmap } from "../services/roadmapService.js";

export const roadmap = asyncHandler(async (req, res) => {
  const result = await getRoadmap(req.params.career);
  res.json({ success: true, data: result });
});
