# Smart Mentoring Backend API

Base URL locally: `http://localhost:5000`

Protected endpoints require:

```http
Authorization: Bearer <jwt>
Content-Type: application/json
```

All responses are JSON.

## Auth

### POST `/signup`

```json
{
  "name": "Isha Learner",
  "email": "isha@example.com",
  "password": "password123",
  "skills": ["JavaScript", "React"],
  "interests": ["Frontend", "UI"],
  "targetCareer": "Frontend Developer"
}
```

Example response:

```json
{
  "success": true,
  "message": "Signup successful",
  "data": {
    "user": {
      "id": "uuid",
      "name": "Isha Learner",
      "email": "isha@example.com",
      "role": "user",
      "skills": ["JavaScript", "React"],
      "interests": ["Frontend", "UI"],
      "target_career": "Frontend Developer",
      "level_score": 0,
      "onboarding_complete": true
    },
    "token": "jwt-token"
  }
}
```

### POST `/login`

```json
{
  "email": "isha@example.com",
  "password": "password123"
}
```

## User

### GET `/user/{id}`

Returns the authenticated user's profile. A user can only access their own record.

### PUT `/user/update-skills`

```json
{
  "skills": ["JavaScript", "React", "CSS", "API"],
  "interests": ["Design Systems"],
  "targetCareer": "Frontend Developer"
}
```

## Mentoring

### GET `/mentors`

Returns seeded mentors.

### POST `/match-mentor`

Returns top 3 mentors by domain match and skill overlap.

```json
{}
```

Example response:

```json
{
  "success": true,
  "data": [
    {
      "name": "Aarav Mehta",
      "domain": "Frontend Developer",
      "skills": ["React", "JavaScript", "Accessibility", "Testing"],
      "experience": 6,
      "matchPercentage": 68,
      "explanation": "Matched because JavaScript, React aligns with Frontend Developer."
    }
  ]
}
```

### POST `/book-session`

Creates a scheduled group mentoring session and adds the current user. Sessions support up to 5 users.

```json
{
  "mentorId": "mentor-uuid",
  "time": "2026-05-05T10:00:00.000Z"
}
```

The API checks mentor availability and blocks overlapping sessions.

### PATCH `/sessions/{id}/reschedule`

```json
{
  "time": "2026-05-06T10:00:00.000Z"
}
```

Participants and admins can reschedule.

### PATCH `/sessions/{id}/cancel`

Cancels a session by marking it `completed`. Participants and admins can cancel.

### PATCH `/sessions/{id}/status`

Requires `mentor` or `admin` role.

```json
{
  "status": "live"
}
```

## Assessment

### POST `/submit-quiz`

```json
{
  "career": "Frontend Developer",
  "answers": [
    { "questionId": "fe-q1", "answer": "useMemo" },
    { "questionId": "fe-q2", "answer": "Accessibility" },
    { "questionId": "fe-q3", "answer": "Grid" }
  ]
}
```

### POST `/submit-coding`

Either submit a trusted score:

```json
{
  "career": "Frontend Developer",
  "score": 82,
  "submissionLink": "https://github.com/example/debounced-search"
}
```

Or submit code for the built-in hackathon judge:

```json
{
  "career": "Backend Developer",
  "problemId": "be-c1",
  "code": "function isAllowed(requests, maxRequests) { return requests < maxRequests; } module.exports = isAllowed;"
}
```

### GET `/assessment/{user_id}`

Returns latest quiz, coding, skill match, project, and level score for the authenticated user.

## Dashboard

### GET `/dashboard/{user_id}`

Example response:

```json
{
  "success": true,
  "data": {
    "levelScore": 72,
    "level": "intermediate",
    "breakdown": {
      "codingScore": 82,
      "quizScore": 100,
      "projectScore": 80,
      "skillMatchScore": 57
    },
    "skillGaps": ["HTML", "Accessibility", "Testing"],
    "progress": {
      "attempts": 3,
      "improvement": 18,
      "history": []
    }
  }
}
```

## Roadmap

### GET `/roadmap/{career}`

Returns phases and required skills for the career.

## Projects

### GET `/projects/{career}`

Returns projects for a career.

### POST `/submit-project`

```json
{
  "projectId": "project-uuid",
  "status": "completed",
  "submissionLink": "https://github.com/example/project"
}
```

### GET `/user-projects/{user_id}`

Returns projects submitted by the authenticated user.

## Job Matching

### POST `/match-jobs`

Returns matching companies with match percentage, salary range, eligibility, and missing skills.

```json
{}
```

Example response:

```json
{
  "success": true,
  "data": [
    {
      "companyName": "SkillForge Labs",
      "role": "Frontend Developer Intern",
      "salaryRange": "INR 3-5 LPA",
      "matchPercentage": 80,
      "eligible": true,
      "missingSkills": ["HTML", "CSS"],
      "explanation": "Matched because your skills align with JavaScript, React."
    }
  ]
}
```

## Resume Data Storage

### GET `/resume/{user_id}`

Returns stored resume JSON if present. If no stored resume exists, the API generates resume JSON from the user's skills, assessment, and submitted projects.

### PUT `/resume`

```json
{
  "resumeData": {
    "basics": {
      "name": "Isha Learner",
      "email": "isha@example.com",
      "targetCareer": "Frontend Developer"
    },
    "skills": ["JavaScript", "React"],
    "projects": []
  }
}
```

## Socket.io

Socket.io is available for live group counselling chat when needed.

```js
const socket = io("http://localhost:5000", {
  auth: { token }
});

socket.emit("session:join", { sessionId });
socket.emit("session:message", { sessionId, message: "Hello mentor!" });
```

## Local Setup

```bash
cp .env.example .env
npm install
npm run supabase:setup
npm run dev
```

`npm run supabase:setup` requires a real Supabase `DATABASE_URL`.
