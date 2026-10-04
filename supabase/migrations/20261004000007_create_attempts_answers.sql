-- Depends on: 20261002000000_create_courses.sql
-- Creates exam attempts, answer records, lesson progress, and aggregated course performance.

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
      create table if not exists public.exam_attempts (
        id uuid primary key default gen_random_uuid(),
        exam_id uuid not null references public.exams(id) on delete cascade,
        student_id uuid not null references public.student_profiles(id) on delete cascade,
        started_at timestamptz not null default now(),
        submitted_at timestamptz,
        score numeric(8,2) default 0,
        total_marks numeric(8,2),
        percentage numeric(5,2),
        passed boolean,
        status varchar(20) not null default ''in_progress''
          check (status in (''in_progress'',''submitted'',''evaluated''))
      );
    '
  );

  execute format(
    '
      create table if not exists public.exam_answers (
        id uuid primary key default gen_random_uuid(),
        attempt_id uuid not null references public.exam_attempts(id) on delete cascade,
        question_id uuid not null references public.questions(id) on delete cascade,
        selected_option_id uuid references public.question_options(id) on delete set null,
        is_correct boolean,
        marks_obtained numeric(6,2) default 0,
        unique (attempt_id, question_id)
      );
    '
  );

  execute format(
    '
      create table if not exists public.lesson_progress (
        id uuid primary key default gen_random_uuid(),
        student_id uuid not null references public.student_profiles(id) on delete cascade,
        lesson_id uuid not null references public.course_lessons(id) on delete cascade,
        is_completed boolean not null default false,
        completed_at timestamptz,
        last_watched_at timestamptz,
        unique (student_id, lesson_id)
      );
    '
  );

  execute format(
    '
      create table if not exists public.student_course_performance (
        id uuid primary key default gen_random_uuid(),
        student_id uuid not null references public.student_profiles(id) on delete cascade,
        course_id %s not null references public.courses(id) on delete cascade,
        total_exams integer not null default 0,
        total_marks numeric(10,2) not null default 0,
        obtained_marks numeric(10,2) not null default 0,
        average_percentage numeric(5,2) not null default 0,
        updated_at timestamptz not null default now(),
        unique (student_id, course_id)
      );
    ',
    course_id_type
  );
end $$;

create index if not exists idx_exam_attempts_exam_id on public.exam_attempts (exam_id);
create index if not exists idx_exam_attempts_student_id on public.exam_attempts (student_id);
create index if not exists idx_exam_answers_attempt_id on public.exam_answers (attempt_id);
create index if not exists idx_exam_answers_question_id on public.exam_answers (question_id);
create index if not exists idx_lesson_progress_student_id on public.lesson_progress (student_id);
create index if not exists idx_lesson_progress_lesson_id on public.lesson_progress (lesson_id);
