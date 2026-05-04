import { z } from "zod";

const nonEmptyString = z.string().trim().min(1);
const uuid = z.string().uuid();
const skillArray = z.array(z.string().trim().min(1)).default([]);

export const signupSchema = z.object({
  name: z.string().trim().min(2).optional(),
  email: z.string().email(),
  password: z.string().min(8),
  skills: skillArray.optional(),
  interests: skillArray.optional(),
  targetCareer: z.string().trim().min(2).optional()
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
});

export const updateSkillsSchema = z.object({
  userId: uuid.optional(),
  skills: skillArray,
  interests: skillArray.optional(),
  targetCareer: nonEmptyString
});

export const matchByUserSchema = z.object({
  userId: uuid.optional()
});

export const bookSessionSchema = z.object({
  userId: uuid.optional(),
  mentorId: uuid,
  time: z.string().datetime()
});

export const joinSessionSchema = z.object({
  userId: uuid.optional(),
  sessionId: uuid
});

export const rescheduleSessionSchema = z.object({
  time: z.string().datetime()
});

export const sessionStatusSchema = z.object({
  status: z.enum(["scheduled", "live", "completed"])
});

export const submitQuizSchema = z.object({
  userId: uuid.optional(),
  career: nonEmptyString,
  answers: z.array(
    z.object({
      questionId: nonEmptyString,
      answer: nonEmptyString
    })
  )
});

export const submitCodingSchema = z.object({
  userId: uuid.optional(),
  career: nonEmptyString,
  score: z.number().min(0).max(100).optional(),
  problemId: z.string().trim().min(1).optional(),
  code: z.string().min(1).optional(),
  submissionLink: z.string().url().optional()
}).refine((data) => typeof data.score === "number" || (data.problemId && data.code), {
  message: "Provide either a score or problemId with code"
});

export const submitProjectSchema = z.object({
  userId: uuid.optional(),
  projectId: uuid,
  status: z.enum(["pending", "completed"]).default("completed"),
  submissionLink: z.string().url()
});

export const resumeSchema = z.object({
  resumeData: z.record(z.unknown())
});
