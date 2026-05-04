import { createUserProject, findProject, listProjectsByCareer, listUserProjects } from "../models/catalogModel.js";
import { saveAssessmentScore } from "./assessmentService.js";
import { getUserOrThrow } from "./userService.js";
import { ApiError } from "../utils/errors.js";

export async function getProjects(career) {
  return listProjectsByCareer(career);
}

export async function submitProject({ userId, projectId, submissionLink, status = "completed" }) {
  await getUserOrThrow(userId);
  const project = await findProject(projectId);
  if (!project) throw new ApiError(404, "Project not found");

  const userProject = await createUserProject({
    user_id: userId,
    project_id: projectId,
    status,
    submission_link: submissionLink
  });

  const projectScore = status === "completed" ? 80 : 30;
  await saveAssessmentScore(userId, { project_score: projectScore }, "project", { projectId, submissionLink });

  return userProject;
}

export async function getUserProjects(userId) {
  await getUserOrThrow(userId);
  return listUserProjects(userId);
}
