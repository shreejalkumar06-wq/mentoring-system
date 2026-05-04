import { asyncHandler } from "../utils/errors.js";
import { ApiError } from "../utils/errors.js";
import { getDashboard } from "../services/matchingService.js";

export const dashboard = asyncHandler(async (req, res) => {
  if (req.params.user_id !== req.auth.sub) throw new ApiError(403, "You can only access your own dashboard");
  const result = await getDashboard(req.params.user_id);
  res.json({ success: true, data: result });
});
