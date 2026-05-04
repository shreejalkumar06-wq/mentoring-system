insert into public.careers (name, required_skills, roadmap) values
(
  'Frontend Developer',
  array['HTML','CSS','JavaScript','React','API','Accessibility','Testing'],
  '[
    {"level":"beginner","focus":"Core web foundations","skills":["HTML","CSS","JavaScript"]},
    {"level":"intermediate","focus":"React applications and API integration","skills":["React","API","State Management"]},
    {"level":"advanced","focus":"Production quality UI","skills":["Accessibility","Testing","Performance"]}
  ]'::jsonb
),
(
  'Backend Developer',
  array['Node.js','Express','PostgreSQL','REST API','Authentication','Testing','Caching'],
  '[
    {"level":"beginner","focus":"Server and API basics","skills":["Node.js","Express","REST API"]},
    {"level":"intermediate","focus":"Persistence and secure auth","skills":["PostgreSQL","Authentication","Validation"]},
    {"level":"advanced","focus":"Scalability and reliability","skills":["Testing","Caching","Observability"]}
  ]'::jsonb
),
(
  'Data Analyst',
  array['SQL','Excel','Python','Statistics','Dashboards','Data Cleaning','Storytelling'],
  '[
    {"level":"beginner","focus":"Analysis foundations","skills":["Excel","SQL","Statistics"]},
    {"level":"intermediate","focus":"Automation and dashboards","skills":["Python","Dashboards","Data Cleaning"]},
    {"level":"advanced","focus":"Business storytelling","skills":["Storytelling","Experiment Analysis","Metrics Design"]}
  ]'::jsonb
)
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
