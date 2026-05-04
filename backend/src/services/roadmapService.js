import { findCareer } from "../models/catalogModel.js";
import { ApiError } from "../utils/errors.js";

export async function getRoadmap(careerName) {
  const career = await findCareer(careerName);
  if (!career) throw new ApiError(404, "Career roadmap not found");

  return {
    career: career.name,
    requiredSkills: career.required_skills,
    phases: career.roadmap || [
      {
        level: "beginner",
        focus: "Build core foundations",
        skills: career.required_skills.slice(0, 3)
      },
      {
        level: "intermediate",
        focus: "Build practical projects and workflows",
        skills: career.required_skills.slice(3, 6)
      },
      {
        level: "advanced",
        focus: "Ship portfolio-grade work and prepare for interviews",
        skills: career.required_skills.slice(6)
      }
    ]
  };
}
