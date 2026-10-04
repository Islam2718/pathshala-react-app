-- Depends on: 20261002000000_create_courses.sql
-- Creates class and membership tables for school/college/coaching contexts.

create table if not exists public.classes (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  name varchar(100) not null,
  description text,
  academic_year varchar(20),
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now()
);

create table if not exists public.class_students (
  id uuid primary key default gen_random_uuid(),
  class_id uuid not null references public.classes(id) on delete cascade,
  student_id uuid not null references public.student_profiles(id) on delete cascade,
  joined_at timestamptz not null default now(),
  status varchar(20) not null default 'active'
    check (status in ('active', 'inactive')),
  unique (class_id, student_id)
);

create table if not exists public.class_teachers (
  id uuid primary key default gen_random_uuid(),
  class_id uuid not null references public.classes(id) on delete cascade,
  teacher_id uuid not null references public.teacher_profiles(id) on delete cascade,
  joined_at timestamptz not null default now(),
  unique (class_id, teacher_id)
);

create index if not exists idx_classes_organization_id on public.classes (organization_id);
create index if not exists idx_class_students_class_id on public.class_students (class_id);
create index if not exists idx_class_students_student_id on public.class_students (student_id);
create index if not exists idx_class_teachers_class_id on public.class_teachers (class_id);
create index if not exists idx_class_teachers_teacher_id on public.class_teachers (teacher_id);
