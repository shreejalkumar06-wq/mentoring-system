# Smart Mentoring and Employability Backend

Node.js + Express backend for a Smart Mentoring and Employability System with human counselling, Supabase PostgreSQL, JWT auth, REST APIs, and Socket.io chat.

## File Structure

```text
backend/
  docs/API.md
  supabase/schema.sql
  supabase/seed.sql
  src/
    app.js
    server.js
    config/
    controllers/
    data/
    middleware/
    models/
    routes/
    services/
    utils/
```

## Run Locally

1. Create a Supabase project.
2. In Supabase SQL editor, run `supabase/schema.sql`.
3. Run `supabase/seed.sql`.
4. Copy `.env.example` to `.env` and fill your keys.
5. Apply schema/seed and run:

```bash
npm install
npm run supabase:setup
npm run dev
```

The API runs on `http://localhost:5000` by default.

## Core Features

- JWT signup/login with hashed passwords.
- User onboarding with skills, interests, and target career.
- Mentor matching based on target career and skill overlap.
- Group session booking with max 5 users per session.
- Mentor availability, conflict checks, rescheduling, cancellation, and status changes.
- Role-based quiz and coding assessment APIs.
- Hackathon-grade coding judge for JavaScript and SQL submissions.
- Weighted level score:

```text
0.35 * coding + 0.25 * quiz + 0.25 * project + 0.15 * skill_match
```

- Dashboard with score breakdown, skill gaps, progress history.
- Career roadmap from Supabase career data.
- Project listing and submission.
- Job/company matching with salary range, match percentage, missing skills, and explanation.
- Resume JSON storage and generation.
- Socket.io live chat for mentoring sessions.

Full endpoint documentation is in `docs/API.md`.

Deployment instructions are in `docs/DEPLOYMENT.md`.
