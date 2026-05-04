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

create index if not exists idx_users_email on public.users(email);
create unique index if not exists idx_mentors_name_unique on public.mentors(name);
create index if not exists idx_sessions_time on public.sessions(time);
create index if not exists idx_assessments_user on public.assessments(user_id);
create index if not exists idx_assessment_history_user on public.assessments_history(user_id);
create index if not exists idx_projects_career on public.projects(career);
create unique index if not exists idx_projects_title_unique on public.projects(title);
create index if not exists idx_user_projects_user on public.user_projects(user_id);
create unique index if not exists idx_jobs_company_role_unique on public.jobs(company_name, role);
create unique index if not exists idx_resumes_user_unique on public.resumes(user_id);

insert into public.careers (name, required_skills, roadmap) values
('Frontend Developer', array['HTML','CSS','JavaScript','React','API','Accessibility','Testing'], '[{"level":"beginner","focus":"Core web foundations","skills":["HTML","CSS","JavaScript"]},{"level":"intermediate","focus":"React applications and API integration","skills":["React","API","State Management"]},{"level":"advanced","focus":"Production quality UI","skills":["Accessibility","Testing","Performance"]}]'::jsonb),
('Backend Developer', array['Node.js','Express','PostgreSQL','REST API','Authentication','Testing','Caching'], '[{"level":"beginner","focus":"Server and API basics","skills":["Node.js","Express","REST API"]},{"level":"intermediate","focus":"Persistence and secure auth","skills":["PostgreSQL","Authentication","Validation"]},{"level":"advanced","focus":"Scalability and reliability","skills":["Testing","Caching","Observability"]}]'::jsonb),
('Data Analyst', array['SQL','Excel','Python','Statistics','Dashboards','Data Cleaning','Storytelling'], '[{"level":"beginner","focus":"Analysis foundations","skills":["Excel","SQL","Statistics"]},{"level":"intermediate","focus":"Automation and dashboards","skills":["Python","Dashboards","Data Cleaning"]},{"level":"advanced","focus":"Business storytelling","skills":["Storytelling","Experiment Analysis","Metrics Design"]}]'::jsonb)
on conflict (name) do nothing;

insert into public.mentors (name, domain, skills, experience, availability) values
('Aarav Mehta', 'Frontend Developer', array['React','JavaScript','Accessibility','Testing'], 6, '{"timezone":"UTC","slots":[{"day":1,"start":"09:00","end":"17:00"},{"day":3,"start":"09:00","end":"17:00"},{"day":5,"start":"09:00","end":"17:00"}]}'::jsonb),
('Nisha Rao', 'Backend Developer', array['Node.js','Express','PostgreSQL','Authentication'], 8, '{"timezone":"UTC","slots":[{"day":2,"start":"09:00","end":"17:00"},{"day":4,"start":"09:00","end":"17:00"}]}'::jsonb),
('Kavya Iyer', 'Data Analyst', array['SQL','Python','Dashboards','Statistics'], 5, '{"timezone":"UTC","slots":[{"day":1,"start":"10:00","end":"18:00"},{"day":4,"start":"10:00","end":"18:00"}]}'::jsonb),
('Rohan Sen', 'Frontend Developer', array['React','API','Performance','CSS'], 4, '{"timezone":"UTC","slots":[{"day":2,"start":"08:00","end":"16:00"},{"day":5,"start":"08:00","end":"16:00"}]}'::jsonb),
('Meera Kapoor', 'Backend Developer', array['REST API','Caching','Testing','PostgreSQL'], 7, '{"timezone":"UTC","slots":[{"day":3,"start":"11:00","end":"19:00"},{"day":5,"start":"11:00","end":"19:00"}]}'::jsonb)
on conflict (name) do nothing;

insert into public.projects (title, career, level, skills_required, description) values
('Portfolio Website with Accessibility Audit', 'Frontend Developer', 'beginner', array['HTML','CSS','Accessibility'], 'Create a responsive portfolio and document accessibility fixes.'),
('React Job Tracker Dashboard', 'Frontend Developer', 'intermediate', array['React','JavaScript','API'], 'Build a dashboard that consumes job listing APIs and filters results.'),
('Express REST API with JWT', 'Backend Developer', 'intermediate', array['Node.js','Express','Authentication','PostgreSQL'], 'Create a secure CRUD API with JWT auth and validation.'),
('API Rate Limiter Service', 'Backend Developer', 'advanced', array['Node.js','Caching','Testing'], 'Build and test a reusable rate limiter middleware.'),
('Sales Insights Dashboard', 'Data Analyst', 'beginner', array['Excel','SQL','Dashboards'], 'Analyze sales data and present core revenue trends.'),
('Customer Retention Cohort Analysis', 'Data Analyst', 'advanced', array['SQL','Python','Statistics'], 'Build retention cohorts and explain churn patterns.')
on conflict (title) do nothing;

insert into public.jobs (company_name, role, required_skills, min_level, salary_range) values
('SkillForge Labs', 'Frontend Developer Intern', array['HTML','CSS','JavaScript','React'], 'beginner', 'INR 3-5 LPA'),
('MentorGrid', 'Junior Backend Developer', array['Node.js','Express','PostgreSQL','REST API'], 'intermediate', 'INR 5-8 LPA'),
('DataNest Analytics', 'Data Analyst Trainee', array['SQL','Excel','Dashboards','Statistics'], 'beginner', 'INR 4-6 LPA'),
('CareerCloud', 'Full Stack Associate', array['React','Node.js','PostgreSQL','Authentication'], 'intermediate', 'INR 7-10 LPA'),
('InsightWorks', 'Product Data Analyst', array['SQL','Python','Storytelling','Dashboards'], 'intermediate', 'INR 6-9 LPA')
on conflict (company_name, role) do nothing;
