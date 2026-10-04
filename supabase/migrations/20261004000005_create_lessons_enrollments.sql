-- Depends on: 20261002000000_create_courses.sql
-- Creates course lesson and enrollment tables.

do $$
declare
  course_id_type text;
begin
  select data_type
  into course_id_type
  from information_schema.columns
  where table_schema = 'public'
    and table_name = 'courses'
    and column_name = 'id';

  if course_id_type is null then
    course_id_type := 'uuid';
  end if;

  execute format(
    '
      create table if not exists public.course_lessons (
        id uuid primary key default gen_random_uuid(),
        course_id %s not null references public.courses(id) on delete cascade,
        title varchar(200) not null,
        description text,
        video_url text,
        content text,
        lesson_order integer not null default 1,
        is_published boolean not null default false,
        created_at timestamptz not null default now()
      );
    ',
    course_id_type
  );

  execute format(
    '
      create table if not exists public.course_enrollments (
        id uuid primary key default gen_random_uuid(),
        course_id %s not null references public.courses(id) on delete cascade,
        student_id uuid not null references public.student_profiles(id) on delete cascade,
        enrolled_at timestamptz not null default now(),
        status varchar(20) not null default ''active''
          check (status in (''active'', ''completed'', ''cancelled'')),
        progress numeric(5,2) not null default 0
          check (progress >= 0 and progress <= 100),
        completed_at timestamptz,
        unique (course_id, student_id)
      );
    ',
    course_id_type
  );
end $$;

create index if not exists idx_course_lessons_course_id on public.course_lessons (course_id);
create index if not exists idx_course_enrollments_course_id on public.course_enrollments (course_id);
create index if not exists idx_course_enrollments_student_id on public.course_enrollments (student_id);
