import { asyncHandler } from "../utils/errors.js";
import { matchJobs } from "../services/matchingService.js";

export const matchEligibleJobs = asyncHandler(async (req, res) => {
  const jobs = await matchJobs(req.auth.sub);
  res.json({ success: true, data: jobs });
});
