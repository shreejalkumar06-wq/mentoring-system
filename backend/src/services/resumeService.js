import { getLatestAssessment } from "../models/assessmentModel.js";
import { listUserProjects } from "../models/catalogModel.js";
import { getStoredResume, upsertStoredResume } from "../models/resumeModel.js";
import { getLevelLabel } from "../utils/scoring.js";
import { getUserOrThrow } from "./userService.js";

export async function getResume(userId) {
  const stored = await getStoredResume(userId);
  if (stored?.resume_data && Object.keys(stored.resume_data).length) {
    return stored.resume_data;
  }

  const user = await getUserOrThrow(userId);
  const assessment = await getLatestAssessment(userId);
  const projects = await listUserProjects(userId);
  const levelScore = assessment?.level_score || user.level_score || 0;

  return {
    basics: {
      name: user.name,
      email: user.email,
      targetCareer: user.target_career
    },
    profile: `Aspiring ${user.target_career || "professional"} with a ${getLevelLabel(levelScore)} readiness level.`,
    skills: user.skills || [],
    interests: user.interests || [],
    assessments: {
      levelScore,
      level: getLevelLabel(levelScore),
      quizScore: assessment?.quiz_score || 0,
      codingScore: assessment?.coding_score || 0,
      projectScore: assessment?.project_score || 0
    },
    projects: projects.map((item) => ({
      title: item.projects?.title,
      status: item.status,
      submissionLink: item.submission_link,
      skillsRequired: item.projects?.skills_required || []
    }))
  };
}

export async function saveResume(userId, resumeData) {
  await getUserOrThrow(userId);
  return upsertStoredResume(userId, resumeData);
}
