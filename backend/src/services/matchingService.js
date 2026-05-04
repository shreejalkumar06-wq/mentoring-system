import { getAssessmentHistory, getLatestAssessment } from "../models/assessmentModel.js";
import { findCareer, listJobs, listMentors } from "../models/catalogModel.js";
import { getUserOrThrow } from "./userService.js";
import { calculateSkillOverlap, getLevelLabel } from "../utils/scoring.js";

const levelRank = { beginner: 1, intermediate: 2, advanced: 3 };

export async function matchMentors(userId) {
  const user = await getUserOrThrow(userId);
  const mentors = await listMentors();

  return mentors
    .map((mentor) => {
      const skillOverlap = calculateSkillOverlap(user.skills || [], mentor.skills || []);
      const domainBoost = mentor.domain?.toLowerCase() === user.target_career?.toLowerCase() ? 35 : 0;
      const matchPercentage = Math.min(100, Math.round(domainBoost + skillOverlap.percentage * 0.65));
      return {
        ...mentor,
        matchPercentage,
        explanation: `Matched because ${skillOverlap.matchedSkills.join(", ") || "your career goal"} aligns with ${mentor.domain}.`
      };
    })
    .sort((a, b) => b.matchPercentage - a.matchPercentage)
    .slice(0, 3);
}

export async function matchJobs(userId) {
  const user = await getUserOrThrow(userId);
  const jobs = await listJobs();
  const userLevel = getLevelLabel(user.level_score || 0);

  return jobs
    .map((job) => {
      const overlap = calculateSkillOverlap(user.skills || [], job.required_skills || []);
      const levelEligible = levelRank[userLevel] >= levelRank[job.min_level];
      const matchPercentage = Math.round(overlap.percentage * 0.8 + (levelEligible ? 20 : 0));
      return {
        id: job.id,
        companyName: job.company_name,
        role: job.role,
        salaryRange: job.salary_range,
        minLevel: job.min_level,
        userLevel,
        matchPercentage,
        eligible: levelEligible && matchPercentage >= 50,
        missingSkills: overlap.missingSkills,
        explanation: `Matched because your skills align with ${overlap.matchedSkills.join(", ") || "some role requirements"}.`
      };
    })
    .sort((a, b) => b.matchPercentage - a.matchPercentage);
}

export async function getCareerMatch(userId) {
  const user = await getUserOrThrow(userId);
  const career = await findCareer(user.target_career);
  if (!career) return null;
  const overlap = calculateSkillOverlap(user.skills || [], career.required_skills || []);
  return {
    career: career.name,
    matchPercentage: overlap.percentage,
    missingSkills: overlap.missingSkills,
    matchedSkills: overlap.matchedSkills
  };
}

export async function getDashboard(userId) {
  const user = await getUserOrThrow(userId);
  const assessment = await getLatestAssessment(userId);
  const careerMatch = await getCareerMatch(userId);
  const history = await getAssessmentHistory(userId);

  const firstScore = history[0]?.level_score || 0;
  const latestScore = assessment?.level_score || user.level_score || 0;

  return {
    user,
    levelScore: latestScore,
    level: getLevelLabel(latestScore),
    breakdown: {
      codingScore: assessment?.coding_score || 0,
      quizScore: assessment?.quiz_score || 0,
      projectScore: assessment?.project_score || 0,
      skillMatchScore: assessment?.skill_match_score || careerMatch?.matchPercentage || 0
    },
    skillGaps: careerMatch?.missingSkills || [],
    careerMatch,
    progress: {
      attempts: history.length,
      improvement: latestScore - firstScore,
      history
    }
  };
}
