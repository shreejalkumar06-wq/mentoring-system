# Deployment Guide

## Supabase

1. Create a Supabase project.
2. Copy the project URL into `SUPABASE_URL`.
3. Copy the service role key into `SUPABASE_SERVICE_ROLE_KEY`.
4. Copy the pooled Postgres connection string into `DATABASE_URL`.
5. Run:

```bash
npm run supabase:setup
```

This applies `supabase/schema.sql` and `supabase/seed.sql`.

## Render

This repo includes `render.yaml` and `Dockerfile`.

Set these environment variables in Render:

```text
NODE_ENV=production
PORT=5000
SUPABASE_URL=...
SUPABASE_SERVICE_ROLE_KEY=...
DATABASE_URL=...
JWT_SECRET=...
FRONTEND_ORIGIN=https://your-angular-or-react-frontend.example
```

The health check path is `/health`.

## Docker

```bash
docker build -t smart-mentoring-backend .
docker run --env-file .env -p 5000:5000 smart-mentoring-backend
```

## CI

GitHub Actions is configured at `.github/workflows/ci.yml` and runs:

```bash
npm ci
npm run lint
npm test
```
