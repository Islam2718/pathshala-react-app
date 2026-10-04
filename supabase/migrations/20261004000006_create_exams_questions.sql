-- Depends on: 20261002000000_create_courses.sql
-- Creates exam and question tables.

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
      create table if not exists public.exams (
        id uuid primary key default gen_random_uuid(),
        title varchar(200) not null,
        description text,
        course_id %s references public.courses(id) on delete set null,
        organization_id uuid references public.organizations(id) on delete cascade,
        created_by uuid not null references public.profiles(id),
        duration_minutes integer,
        total_marks numeric(8,2),
        pass_marks numeric(8,2),
        is_published boolean not null default false,
        start_at timestamptz,
        end_at timestamptz,
        created_at timestamptz not null default now()
      );
    ',
    course_id_type
  );

  execute format(
    '
      create table if not exists public.questions (
        id uuid primary key default gen_random_uuid(),
        exam_id uuid not null references public.exams(id) on delete cascade,
        question_text text not null,
        marks numeric(6,2) not null default 1,
        question_order integer not null default 1,
        created_at timestamptz not null default now()
      );
    '
  );

  execute format(
    '
      create table if not exists public.question_options (
        id uuid primary key default gen_random_uuid(),
        question_id uuid not null references public.questions(id) on delete cascade,
        option_text text not null,
        is_correct boolean not null default false,
        option_order integer not null default 1
      );
    '
  );
end $$;

create index if not exists idx_exams_course_id on public.exams (course_id);
create index if not exists idx_exams_organization_id on public.exams (organization_id);
create index if not exists idx_exams_created_by on public.exams (created_by);
create index if not exists idx_questions_exam_id on public.questions (exam_id);
create index if not exists idx_question_options_question_id on public.question_options (question_id);

create or replace view public.question_options_public as
select
  qo.id,
  qo.question_id,
  qo.option_text,
  qo.option_order
from public.question_options qo;

grant select on public.question_options_public to authenticated;
