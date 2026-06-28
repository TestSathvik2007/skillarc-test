-- =============================================================
-- SkillArc Database Schema v1.0
-- Date: 2026-06-12
--
-- Instructions:
-- 1. Create a new Supabase project.
-- 2. Open SQL Editor.
-- 3. Run this file.
-- 4. Do not modify existing tables or columns.
-- 5. Discuss schema changes before implementation.
-- =============================================================

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";


-- -------------------------------------------------------------
-- CORE: Organizations, Institutions, Departments, Programs
-- -------------------------------------------------------------

CREATE TABLE public.organizations (
  id           uuid NOT NULL DEFAULT uuid_generate_v4(),
  name         text NOT NULL,
  created_at   timestamp DEFAULT now(),
  CONSTRAINT organizations_pkey PRIMARY KEY (id)
);

CREATE TABLE public.institutions (
  id              uuid NOT NULL DEFAULT uuid_generate_v4(),
  name            text,
  domain          text,
  organization_id uuid,
  CONSTRAINT institutions_pkey PRIMARY KEY (id),
  CONSTRAINT institutions_organization_id_fkey
    FOREIGN KEY (organization_id) REFERENCES public.organizations(id)
);

CREATE TABLE public.departments (
  id             uuid NOT NULL DEFAULT uuid_generate_v4(),
  institution_id uuid,
  name           text,
  CONSTRAINT departments_pkey PRIMARY KEY (id),
  CONSTRAINT departments_institution_id_fkey
    FOREIGN KEY (institution_id) REFERENCES public.institutions(id)
);

CREATE TABLE public.programs (
  id              uuid NOT NULL DEFAULT uuid_generate_v4(),
  name            text NOT NULL,
  department_id   uuid,
  institution_id  uuid,
  organization_id uuid,
  CONSTRAINT programs_pkey PRIMARY KEY (id),
  CONSTRAINT programs_department_id_fkey
    FOREIGN KEY (department_id) REFERENCES public.departments(id),
  CONSTRAINT programs_institution_id_fkey
    FOREIGN KEY (institution_id) REFERENCES public.institutions(id),
  CONSTRAINT programs_organization_id_fkey
    FOREIGN KEY (organization_id) REFERENCES public.organizations(id)
);


-- -------------------------------------------------------------
-- USERS & ACCESS
-- -------------------------------------------------------------

-- NOTE: sections references users (faculty_advisor_id), and users references
-- sections (section_id) — create users first without the FK, then add it after sections.

CREATE TABLE public.users (
  id                  uuid NOT NULL,
  institution_id      uuid,
  department_id       uuid,
  name                text,
  email               text UNIQUE,
  role                text CHECK (role = ANY (ARRAY[
                        'SUPER_ADMIN','ORG_ADMIN','INSTITUTION_ADMIN',
                        'HOD','PROGRAM_HEAD','FACULTY','STUDENT','PARENT'
                      ])),
  program_id          uuid,
  organization_id     uuid,
  section_id          uuid,   -- FK added after sections table
  semester            integer,
  created_at          timestamp DEFAULT now(),
  updated_at          timestamp DEFAULT now(),
  phone               text,
  is_active           boolean DEFAULT true,
  profile_image_url   text,
  registration_number text UNIQUE,
  admission_year      integer,
  dob                 date,
  gender              text,
  employee_id         text UNIQUE,
  CONSTRAINT users_pkey PRIMARY KEY (id),
  CONSTRAINT users_institution_id_fkey
    FOREIGN KEY (institution_id) REFERENCES public.institutions(id),
  CONSTRAINT users_department_id_fkey
    FOREIGN KEY (department_id) REFERENCES public.departments(id),
  CONSTRAINT users_program_id_fkey
    FOREIGN KEY (program_id) REFERENCES public.programs(id),
  CONSTRAINT users_organization_id_fkey
    FOREIGN KEY (organization_id) REFERENCES public.organizations(id)
);

CREATE TABLE public.sections (
  id                uuid NOT NULL DEFAULT uuid_generate_v4(),
  name              text NOT NULL,
  semester          integer NOT NULL,
  program_id        uuid,
  institution_id    uuid,
  faculty_advisor_id uuid,
  CONSTRAINT sections_pkey PRIMARY KEY (id),
  CONSTRAINT sections_program_id_fkey
    FOREIGN KEY (program_id) REFERENCES public.programs(id),
  CONSTRAINT sections_institution_id_fkey
    FOREIGN KEY (institution_id) REFERENCES public.institutions(id),
  CONSTRAINT sections_faculty_advisor_id_fkey
    FOREIGN KEY (faculty_advisor_id) REFERENCES public.users(id)
);

-- Resolve circular FK: users.section_id → sections
ALTER TABLE public.users
  ADD CONSTRAINT users_section_id_fkey
  FOREIGN KEY (section_id) REFERENCES public.sections(id);

CREATE TABLE public.parent_student_relations (
  id           uuid NOT NULL DEFAULT uuid_generate_v4(),
  parent_id    uuid,
  student_id   uuid,
  relationship text,
  CONSTRAINT parent_student_relations_pkey PRIMARY KEY (id),
  CONSTRAINT parent_student_relations_parent_id_fkey
    FOREIGN KEY (parent_id) REFERENCES public.users(id),
  CONSTRAINT parent_student_relations_student_id_fkey
    FOREIGN KEY (student_id) REFERENCES public.users(id)
);

CREATE TABLE public.permissions (
  id   uuid NOT NULL DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  CONSTRAINT permissions_pkey PRIMARY KEY (id)
);

CREATE TABLE public.user_permissions (
  id            uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id       uuid,
  permission_id uuid,
  CONSTRAINT user_permissions_pkey PRIMARY KEY (id),
  CONSTRAINT user_permissions_user_id_fkey
    FOREIGN KEY (user_id) REFERENCES public.users(id),
  CONSTRAINT user_permissions_permission_id_fkey
    FOREIGN KEY (permission_id) REFERENCES public.permissions(id)
);


-- -------------------------------------------------------------
-- ACADEMIC: Subjects, Timetable, Periods
-- -------------------------------------------------------------

CREATE TABLE public.subjects (
  id             uuid NOT NULL DEFAULT uuid_generate_v4(),
  institution_id uuid,
  name           text,
  code           text,
  semester       integer,
  faculty_id     uuid,
  section_id     uuid,
  program_id     uuid,
  credits        integer,
  subject_type   text CHECK (subject_type = ANY (ARRAY['THEORY','LAB','ELECTIVE'])),
  CONSTRAINT subjects_pkey PRIMARY KEY (id),
  CONSTRAINT subjects_institution_id_fkey
    FOREIGN KEY (institution_id) REFERENCES public.institutions(id),
  CONSTRAINT subjects_teacher_id_fkey
    FOREIGN KEY (faculty_id) REFERENCES public.users(id),
  CONSTRAINT subjects_section_id_fkey
    FOREIGN KEY (section_id) REFERENCES public.sections(id),
  CONSTRAINT subjects_program_id_fkey
    FOREIGN KEY (program_id) REFERENCES public.programs(id)
);

CREATE TABLE public.timetable_slots (
  id              uuid NOT NULL DEFAULT uuid_generate_v4(),
  institution_id  uuid,
  day             text,
  period          integer,
  subject_id      uuid,
  faculty_id      uuid,
  semester        integer,
  organization_id uuid,
  section_id      uuid,
  CONSTRAINT timetable_slots_pkey PRIMARY KEY (id),
  CONSTRAINT timetable_slots_institution_id_fkey
    FOREIGN KEY (institution_id) REFERENCES public.institutions(id),
  CONSTRAINT timetable_slots_subject_id_fkey
    FOREIGN KEY (subject_id) REFERENCES public.subjects(id),
  CONSTRAINT timetable_slots_teacher_id_fkey
    FOREIGN KEY (faculty_id) REFERENCES public.users(id),
  CONSTRAINT timetable_slots_organization_id_fkey
    FOREIGN KEY (organization_id) REFERENCES public.organizations(id),
  CONSTRAINT timetable_slots_section_id_fkey
    FOREIGN KEY (section_id) REFERENCES public.sections(id)
);

CREATE TABLE public.periods (
  id             uuid NOT NULL DEFAULT uuid_generate_v4(),
  institution_id uuid,
  period_number  integer NOT NULL,
  start_time     time NOT NULL,
  end_time       time NOT NULL,
  CONSTRAINT periods_pkey PRIMARY KEY (id),
  CONSTRAINT periods_institution_id_fkey
    FOREIGN KEY (institution_id) REFERENCES public.institutions(id)
);

CREATE TABLE public.subject_allocations (
  id         uuid NOT NULL DEFAULT uuid_generate_v4(),
  subject_id uuid,
  faculty_id uuid,
  section_id uuid,
  created_at timestamp DEFAULT now(),
  CONSTRAINT subject_allocations_pkey PRIMARY KEY (id),
  CONSTRAINT subject_allocations_subject_id_fkey
    FOREIGN KEY (subject_id) REFERENCES public.subjects(id),
  CONSTRAINT subject_allocations_faculty_id_fkey
    FOREIGN KEY (faculty_id) REFERENCES public.users(id),
  CONSTRAINT subject_allocations_section_id_fkey
    FOREIGN KEY (section_id) REFERENCES public.sections(id)
);


-- -------------------------------------------------------------
-- ATTENDANCE
-- -------------------------------------------------------------

CREATE TABLE public.attendance_sessions (
  id              uuid NOT NULL DEFAULT gen_random_uuid(),
  subject_id      uuid,
  faculty_id      uuid,
  section_id      uuid,
  attendance_date date NOT NULL,
  period          integer NOT NULL,
  CONSTRAINT attendance_sessions_pkey PRIMARY KEY (id),
  CONSTRAINT attendance_sessions_subject_id_fkey
    FOREIGN KEY (subject_id) REFERENCES public.subjects(id),
  CONSTRAINT attendance_sessions_faculty_id_fkey
    FOREIGN KEY (faculty_id) REFERENCES public.users(id),
  CONSTRAINT attendance_sessions_section_id_fkey
    FOREIGN KEY (section_id) REFERENCES public.sections(id)
);

CREATE TABLE public.attendance_records (
  id         uuid NOT NULL DEFAULT gen_random_uuid(),
  session_id uuid,
  student_id uuid,
  status     text NOT NULL CHECK (status = ANY (ARRAY['PRESENT','ABSENT','LATE'])),
  CONSTRAINT attendance_records_pkey PRIMARY KEY (id),
  CONSTRAINT attendance_records_session_id_fkey
    FOREIGN KEY (session_id) REFERENCES public.attendance_sessions(id),
  CONSTRAINT attendance_records_student_id_fkey
    FOREIGN KEY (student_id) REFERENCES public.users(id)
);


-- -------------------------------------------------------------
-- ASSIGNMENTS & SUBMISSIONS
-- -------------------------------------------------------------

CREATE TABLE public.assignments (
  id          uuid NOT NULL DEFAULT gen_random_uuid(),
  subject_id  uuid,
  faculty_id  uuid,
  title       text NOT NULL,
  description text,
  due_date    timestamp,
  created_at  timestamp DEFAULT now(),
  updated_at  timestamp DEFAULT now(),
  CONSTRAINT assignments_pkey PRIMARY KEY (id),
  CONSTRAINT assignments_subject_id_fkey
    FOREIGN KEY (subject_id) REFERENCES public.subjects(id),
  CONSTRAINT assignments_faculty_id_fkey
    FOREIGN KEY (faculty_id) REFERENCES public.users(id)
);

CREATE TABLE public.submissions (
  id            uuid NOT NULL DEFAULT gen_random_uuid(),
  assignment_id uuid,
  student_id    uuid,
  file_url      text,
  submitted_at  timestamp DEFAULT now(),
  grade         numeric,
  feedback      text,
  CONSTRAINT submissions_pkey PRIMARY KEY (id),
  CONSTRAINT submissions_assignment_id_fkey
    FOREIGN KEY (assignment_id) REFERENCES public.assignments(id),
  CONSTRAINT submissions_student_id_fkey
    FOREIGN KEY (student_id) REFERENCES public.users(id)
);


-- -------------------------------------------------------------
-- RESOURCES & ONLINE SESSIONS
-- -------------------------------------------------------------

CREATE TABLE public.resources (
  id          uuid NOT NULL DEFAULT gen_random_uuid(),
  subject_id  uuid,
  faculty_id  uuid,
  title       text NOT NULL,
  file_url    text NOT NULL,
  uploaded_at timestamp DEFAULT now(),
  CONSTRAINT resources_pkey PRIMARY KEY (id),
  CONSTRAINT resources_subject_id_fkey
    FOREIGN KEY (subject_id) REFERENCES public.subjects(id),
  CONSTRAINT resources_faculty_id_fkey
    FOREIGN KEY (faculty_id) REFERENCES public.users(id)
);

CREATE TABLE public.online_sessions (
  id             uuid NOT NULL DEFAULT gen_random_uuid(),
  title          text NOT NULL,
  description    text,
  host_id        uuid,
  institution_id uuid,
  session_link   text NOT NULL,
  start_time     timestamp NOT NULL,
  end_time       timestamp,
  created_at     timestamp DEFAULT now(),
  CONSTRAINT online_sessions_pkey PRIMARY KEY (id),
  CONSTRAINT online_sessions_host_id_fkey
    FOREIGN KEY (host_id) REFERENCES public.users(id),
  CONSTRAINT online_sessions_institution_id_fkey
    FOREIGN KEY (institution_id) REFERENCES public.institutions(id)
);

CREATE TABLE public.online_session_participants (
  id         uuid NOT NULL DEFAULT gen_random_uuid(),
  session_id uuid,
  user_id    uuid,
  joined_at  timestamp,
  left_at    timestamp,
  CONSTRAINT online_session_participants_pkey PRIMARY KEY (id),
  CONSTRAINT online_session_participants_session_id_fkey
    FOREIGN KEY (session_id) REFERENCES public.online_sessions(id),
  CONSTRAINT online_session_participants_user_id_fkey
    FOREIGN KEY (user_id) REFERENCES public.users(id)
);


-- -------------------------------------------------------------
-- PROJECTS
-- -------------------------------------------------------------

CREATE TABLE public.projects (
  id          uuid NOT NULL DEFAULT gen_random_uuid(),
  title       text NOT NULL,
  description text,
  faculty_id  uuid,
  created_at  timestamp DEFAULT now(),
  CONSTRAINT projects_pkey PRIMARY KEY (id),
  CONSTRAINT projects_faculty_id_fkey
    FOREIGN KEY (faculty_id) REFERENCES public.users(id)
);

CREATE TABLE public.project_groups (
  id         uuid NOT NULL DEFAULT gen_random_uuid(),
  project_id uuid,
  group_name text NOT NULL,
  CONSTRAINT project_groups_pkey PRIMARY KEY (id),
  CONSTRAINT project_groups_project_id_fkey
    FOREIGN KEY (project_id) REFERENCES public.projects(id)
);

CREATE TABLE public.group_members (
  id         uuid NOT NULL DEFAULT gen_random_uuid(),
  group_id   uuid,
  student_id uuid,
  CONSTRAINT group_members_pkey PRIMARY KEY (id),
  CONSTRAINT group_members_group_id_fkey
    FOREIGN KEY (group_id) REFERENCES public.project_groups(id),
  CONSTRAINT group_members_student_id_fkey
    FOREIGN KEY (student_id) REFERENCES public.users(id)
);


-- -------------------------------------------------------------
-- EVENTS & ANNOUNCEMENTS
-- -------------------------------------------------------------

CREATE TABLE public.events (
  id             uuid NOT NULL DEFAULT gen_random_uuid(),
  institution_id uuid,
  title          text NOT NULL,
  description    text,
  event_date     timestamp,
  venue          text,
  created_by     uuid,
  created_at     timestamp DEFAULT now(),
  CONSTRAINT events_pkey PRIMARY KEY (id),
  CONSTRAINT events_institution_id_fkey
    FOREIGN KEY (institution_id) REFERENCES public.institutions(id),
  CONSTRAINT events_created_by_fkey
    FOREIGN KEY (created_by) REFERENCES public.users(id)
);

CREATE TABLE public.event_registrations (
  id            uuid NOT NULL DEFAULT gen_random_uuid(),
  event_id      uuid,
  user_id       uuid,
  registered_at timestamp DEFAULT now(),
  CONSTRAINT event_registrations_pkey PRIMARY KEY (id),
  CONSTRAINT event_registrations_event_id_fkey
    FOREIGN KEY (event_id) REFERENCES public.events(id),
  CONSTRAINT event_registrations_user_id_fkey
    FOREIGN KEY (user_id) REFERENCES public.users(id)
);

CREATE TABLE public.announcements (
  id             uuid NOT NULL DEFAULT gen_random_uuid(),
  title          text NOT NULL,
  content        text NOT NULL,
  created_by     uuid,
  institution_id uuid,
  created_at     timestamp DEFAULT now(),
  CONSTRAINT announcements_pkey PRIMARY KEY (id),
  CONSTRAINT announcements_created_by_fkey
    FOREIGN KEY (created_by) REFERENCES public.users(id),
  CONSTRAINT announcements_institution_id_fkey
    FOREIGN KEY (institution_id) REFERENCES public.institutions(id)
);


-- -------------------------------------------------------------
-- PLACEMENTS
-- -------------------------------------------------------------

CREATE TABLE public.companies (
  id          uuid NOT NULL DEFAULT gen_random_uuid(),
  name        text NOT NULL,
  website     text,
  description text,
  CONSTRAINT companies_pkey PRIMARY KEY (id)
);

CREATE TABLE public.job_posts (
  id          uuid NOT NULL DEFAULT gen_random_uuid(),
  company_id  uuid,
  title       text NOT NULL,
  description text,
  deadline    date,
  CONSTRAINT job_posts_pkey PRIMARY KEY (id),
  CONSTRAINT job_posts_company_id_fkey
    FOREIGN KEY (company_id) REFERENCES public.companies(id)
);

CREATE TABLE public.applications (
  id          uuid NOT NULL DEFAULT gen_random_uuid(),
  job_post_id uuid,
  student_id  uuid,
  status      text DEFAULT 'APPLIED',
  CONSTRAINT applications_pkey PRIMARY KEY (id),
  CONSTRAINT applications_job_post_id_fkey
    FOREIGN KEY (job_post_id) REFERENCES public.job_posts(id),
  CONSTRAINT applications_student_id_fkey
    FOREIGN KEY (student_id) REFERENCES public.users(id)
);


-- -------------------------------------------------------------
-- COMPLAINTS, NOTIFICATIONS, AUDIT
-- -------------------------------------------------------------

CREATE TABLE public.complaints (
  id          uuid NOT NULL DEFAULT gen_random_uuid(),
  student_id  uuid,
  title       text NOT NULL,
  description text,
  status      text DEFAULT 'OPEN' CHECK (status = ANY (ARRAY['OPEN','IN_PROGRESS','RESOLVED','CLOSED'])),
  created_at  timestamp DEFAULT now(),
  CONSTRAINT complaints_pkey PRIMARY KEY (id),
  CONSTRAINT complaints_student_id_fkey
    FOREIGN KEY (student_id) REFERENCES public.users(id)
);

CREATE TABLE public.notifications (
  id         uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id    uuid,
  title      text NOT NULL,
  message    text NOT NULL,
  is_read    boolean DEFAULT false,
  created_at timestamp DEFAULT now(),
  CONSTRAINT notifications_pkey PRIMARY KEY (id),
  CONSTRAINT notifications_user_id_fkey
    FOREIGN KEY (user_id) REFERENCES public.users(id)
);

CREATE TABLE public.audit_logs (
  id          uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id     uuid,
  action      text NOT NULL,
  entity_type text NOT NULL,
  entity_id   uuid,
  metadata    jsonb,
  created_at  timestamp DEFAULT now(),
  CONSTRAINT audit_logs_pkey PRIMARY KEY (id),
  CONSTRAINT audit_logs_user_id_fkey
    FOREIGN KEY (user_id) REFERENCES public.users(id)
);


-- =============================================================
--  END OF SCHEMA  (30 tables total)
-- =============================================================