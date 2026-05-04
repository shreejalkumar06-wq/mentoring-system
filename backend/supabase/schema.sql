create extension if not exists "pgcrypto";

create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text unique,
  password_hash text,
  role text not null default 'user' check (role in ('user', 'mentor', 'admin', 'company')),
  skills text[] not null default '{}',
  interests text[] not null default '{}',
  target_career text,
  level_score numeric not null default 0 check (level_score >= 0 and level_score <= 100),
  onboarding_complete boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.mentors (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  domain text not null,
  skills text[] not null default '{}',
  experience integer not null default 0 check (experience >= 0),
  availability jsonb not null default '{"timezone":"UTC","slots":[{"day":1,"start":"09:00","end":"17:00"},{"day":2,"start":"09:00","end":"17:00"},{"day":3,"start":"09:00","end":"17:00"},{"day":4,"start":"09:00","end":"17:00"},{"day":5,"start":"09:00","end":"17:00"}]}',
  created_at timestamptz not null default now()
);

create table if not exists public.sessions (
  id uuid primary key default gen_random_uuid(),
  mentor_id uuid not null references public.mentors(id) on delete cascade,
  users uuid[] not null default '{}',
  status text not null default 'scheduled' check (status in ('scheduled', 'live', 'completed')),
  time timestamptz not null,
  created_at timestamptz not null default now()
);

create table if not exists public.session_participants (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.sessions(id) on delete cascade,
  user_id uuid not null references public.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (session_id, user_id)
);

create table if not exists public.assessments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  quiz_score numeric not null default 0 check (quiz_score >= 0 and quiz_score <= 100),
  coding_score numeric not null default 0 check (coding_score >= 0 and coding_score <= 100),
  project_score numeric not null default 0 check (project_score >= 0 and project_score <= 100),
  skill_match_score numeric not null default 0 check (skill_match_score >= 0 and skill_match_score <= 100),
  level_score numeric not null default 0 check (level_score >= 0 and level_score <= 100),
  created_at timestamptz not null default now()
);

create table if not exists public.assessments_history (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  assessment_type text not null check (assessment_type in ('quiz', 'coding', 'project', 'manual')),
  quiz_score numeric not null default 0,
  coding_score numeric not null default 0,
  project_score numeric not null default 0,
  skill_match_score numeric not null default 0,
  level_score numeric not null default 0,
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now()
);

create table if not exists public.careers (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  required_skills text[] not null default '{}',
  roadmap jsonb not null default '[]',
  created_at timestamptz not null default now()
);

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  career text,
  level text not null check (level in ('beginner', 'intermediate', 'advanced')),
  skills_required text[] not null default '{}',
  description text,
  created_at timestamptz not null default now()
);

create table if not exists public.user_projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  project_id uuid not null references public.projects(id) on delete cascade,
  status text not null default 'pending' check (status in ('pending', 'completed')),
  submission_link text,
  created_at timestamptz not null default now()
);

create table if not exists public.jobs (
  id uuid primary key default gen_random_uuid(),
  company_name text not null,
  role text not null,
  required_skills text[] not null default '{}',
  min_level text not null check (min_level in ('beginner', 'intermediate', 'advanced')),
  salary_range text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.resumes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  resume_data jsonb not null default '{}',
  updated_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create unique index if not exists idx_resumes_user_unique on public.resumes(user_id);

create index if not exists idx_users_email on public.users(email);
create unique index if not exists idx_mentors_name_unique on public.mentors(name);
create index if not exists idx_sessions_time on public.sessions(time);
create index if not exists idx_assessments_user on public.assessments(user_id);
create index if not exists idx_assessment_history_user on public.assessments_history(user_id);
create index if not exists idx_projects_career on public.projects(career);
create unique index if not exists idx_projects_title_unique on public.projects(title);
create index if not exists idx_user_projects_user on public.user_projects(user_id);
create unique index if not exists idx_jobs_company_role_unique on public.jobs(company_name, role);
