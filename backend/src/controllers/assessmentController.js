import { asyncHandler } from "../utils/errors.js";
import { ApiError } from "../utils/errors.js";
import {
  getAssessment,
  getCodingProblems,
  getQuiz,
  submitCoding,
  submitQuiz
} from "../services/assessmentService.js";

export const fetchQuiz = asyncHandler(async (req, res) => {
  const questions = getQuiz(req.params.career).map(({ correctAnswer: _correctAnswer, ...question }) => question);
  res.json({ success: true, data: questions });
});

export const fetchCoding = asyncHandler(async (req, res) => {
  res.json({ success: true, data: getCodingProblems(req.params.career) });
});

export const submitQuizAnswers = asyncHandler(async (req, res) => {
  const assessment = await submitQuiz({ userId: req.auth.sub, career: req.body.career, answers: req.body.answers });
  res.json({ success: true, message: "Quiz submitted", data: assessment });
});

export const submitCodingScore = asyncHandler(async (req, res) => {
  const assessment = await submitCoding({
    userId: req.auth.sub,
    career: req.body.career,
    score: req.body.score,
    submissionLink: req.body.submissionLink,
    problemId: req.body.problemId,
    code: req.body.code
  });
  res.json({ success: true, message: "Coding assessment submitted", data: assessment });
});

export const getUserAssessment = asyncHandler(async (req, res) => {
  if (req.params.user_id !== req.auth.sub) throw new ApiError(403, "You can only access your own assessment");
  const assessment = await getAssessment(req.params.user_id);
  res.json({ success: true, data: assessment });
});
