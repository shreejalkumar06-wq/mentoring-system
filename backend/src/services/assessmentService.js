import { codingProblems, normalizeCareer, quizQuestions } from "../data/questions.js";
import { getLatestAssessment, upsertAssessment, addAssessmentHistory } from "../models/assessmentModel.js";
import { findCareer } from "../models/catalogModel.js";
import { updateUser } from "../models/userModel.js";
import { calculateLevelScore, calculateSkillOverlap, clampScore } from "../utils/scoring.js";
import { getUserOrThrow } from "./userService.js";
import { judgeCodingSubmission } from "./codeJudgeService.js";

export function getQuiz(career) {
  return quizQuestions[normalizeCareer(career)] || [];
}

export function getCodingProblems(career) {
  return codingProblems[normalizeCareer(career)] || [];
}

export async function submitQuiz({ userId, career, answers }) {
  const questions = getQuiz(career);
  const answerMap = new Map(answers.map((item) => [item.questionId, item.answer]));
  const correct = questions.filter((question) => answerMap.get(question.id) === question.correctAnswer).length;
  const quizScore = questions.length ? Math.round((correct / questions.length) * 100) : 0;
  return saveAssessmentScore(userId, { quiz_score: quizScore }, "quiz", { career, correct, total: questions.length });
}

export async function submitCoding({ userId, career, score, submissionLink, problemId, code }) {
  const judgeResult = code ? judgeCodingSubmission({ career, problemId, code }) : null;
  const finalScore = judgeResult ? judgeResult.score : score;
  return saveAssessmentScore(
    userId,
    { coding_score: clampScore(finalScore) },
    "coding",
    { career, submissionLink, problemId, judgeResult }
  );
}

export async function saveAssessmentScore(userId, scorePatch, type, metadata = {}) {
  const user = await getUserOrThrow(userId);
  const latest = await getLatestAssessment(userId);
  const career = user.target_career ? await findCareer(user.target_career) : null;
  const skillMatch = career ? calculateSkillOverlap(user.skills || [], career.required_skills || []).percentage : 0;

  const assessment = {
    user_id: userId,
    quiz_score: scorePatch.quiz_score ?? latest?.quiz_score ?? 0,
    coding_score: scorePatch.coding_score ?? latest?.coding_score ?? 0,
    project_score: scorePatch.project_score ?? latest?.project_score ?? 0,
    skill_match_score: skillMatch
  };

  assessment.level_score = calculateLevelScore({
    codingScore: assessment.coding_score,
    quizScore: assessment.quiz_score,
    projectScore: assessment.project_score,
    skillMatchScore: assessment.skill_match_score
  });

  const saved = await upsertAssessment(assessment);
  await updateUser(userId, { level_score: saved.level_score });
  await addAssessmentHistory({
    user_id: userId,
    assessment_type: type,
    quiz_score: saved.quiz_score,
    coding_score: saved.coding_score,
    project_score: saved.project_score,
    skill_match_score: saved.skill_match_score,
    level_score: saved.level_score,
    metadata
  });

  return saved;
}

export async function getAssessment(userId) {
  await getUserOrThrow(userId);
  return getLatestAssessment(userId);
}
