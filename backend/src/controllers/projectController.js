import { asyncHandler } from "../utils/errors.js";
import { ApiError } from "../utils/errors.js";
import { getProjects, getUserProjects, submitProject } from "../services/projectService.js";

export const projectsByCareer = asyncHandler(async (req, res) => {
  const projects = await getProjects(req.params.career);
  res.json({ success: true, data: projects });
});

export const submitUserProject = asyncHandler(async (req, res) => {
  const project = await submitProject({
    userId: req.auth.sub,
    projectId: req.body.projectId,
    submissionLink: req.body.submissionLink,
    status: req.body.status
  });
  res.status(201).json({ success: true, message: "Project submitted", data: project });
});

export const userProjects = asyncHandler(async (req, res) => {
  if (req.params.user_id !== req.auth.sub) throw new ApiError(403, "You can only access your own projects");
  const projects = await getUserProjects(req.params.user_id);
  res.json({ success: true, data: projects });
});
