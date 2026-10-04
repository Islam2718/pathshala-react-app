-- Depends on: 20261002000000_create_courses.sql
-- Creates student/teacher profiles and organization membership tables.

create table if not exists public.student_profiles (
  id uuid primary key references public.profiles(id) on delete cascade,
  student_id varchar(50) unique,
  date_of_birth date,
  gender varchar(20),
  current_class varchar(50),
  institution_name varchar(200),
  address text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.teacher_profiles (
  id uuid primary key references public.profiles(id) on delete cascade,
  teacher_id varchar(50) unique,
  designation varchar(100),
  specialization varchar(200),
  qualification text,
  experience_years numeric(4,1),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.organizations (
  id uuid primary key default gen_random_uuid(),
  name varchar(200) not null,
  organization_type varchar(30) not null
    check (organization_type in ('school', 'college', 'kindergarten', 'coaching')),
  code varchar(50) unique,
  email varchar(255),
  phone varchar(30),
  address text,
  logo_url text,
  owner_id uuid not null references public.profiles(id),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.organization_members (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  member_role varchar(30) not null
    check (member_role in ('student', 'teacher', 'admin', 'staff')),
  status varchar(20) not null default 'active'
    check (status in ('pending','active','inactive','rejected')),
  joined_at timestamptz not null default now(),
  unique (organization_id, user_id)
);

create index if not exists idx_organization_members_organization_id on public.organization_members (organization_id);
create index if not exists idx_organization_members_user_id on public.organization_members (user_id);
