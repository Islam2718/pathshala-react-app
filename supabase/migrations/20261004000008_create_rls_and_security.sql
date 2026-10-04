-- Depends on: 20261002000000_create_courses.sql
-- Enables RLS and applies the application security model.

alter table public.profiles enable row level security;
alter table public.student_profiles enable row level security;
alter table public.teacher_profiles enable row level security;
alter table public.organizations enable row level security;
alter table public.organization_members enable row level security;
alter table public.classes enable row level security;
alter table public.class_students enable row level security;
alter table public.class_teachers enable row level security;
alter table public.courses enable row level security;
alter table public.course_lessons enable row level security;
alter table public.course_enrollments enable row level security;
alter table public.exams enable row level security;
alter table public.questions enable row level security;
alter table public.question_options enable row level security;
alter table public.exam_attempts enable row level security;
alter table public.exam_answers enable row level security;
alter table public.lesson_progress enable row level security;
alter table public.student_course_performance enable row level security;

-- Profiles

drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own" on public.profiles for select to authenticated
using (auth.uid() = id);

drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own" on public.profiles for insert to authenticated
with check (auth.uid() = id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own" on public.profiles for update to authenticated
using (auth.uid() = id)
with check (auth.uid() = id);

-- Student and teacher profiles

drop policy if exists "student_profiles_select_own" on public.student_profiles;
create policy "student_profiles_select_own" on public.student_profiles for select to authenticated
using (auth.uid() = id);

drop policy if exists "student_profiles_manage_own" on public.student_profiles;
create policy "student_profiles_manage_own" on public.student_profiles for insert to authenticated
with check (auth.uid() = id);

drop policy if exists "student_profiles_update_own" on public.student_profiles;
create policy "student_profiles_update_own" on public.student_profiles for update to authenticated
using (auth.uid() = id)
with check (auth.uid() = id);

drop policy if exists "teacher_profiles_select_own" on public.teacher_profiles;
create policy "teacher_profiles_select_own" on public.teacher_profiles for select to authenticated
using (auth.uid() = id);

drop policy if exists "teacher_profiles_manage_own" on public.teacher_profiles;
create policy "teacher_profiles_manage_own" on public.teacher_profiles for insert to authenticated
with check (auth.uid() = id);

drop policy if exists "teacher_profiles_update_own" on public.teacher_profiles;
create policy "teacher_profiles_update_own" on public.teacher_profiles for update to authenticated
using (auth.uid() = id)
with check (auth.uid() = id);

-- Organizations and memberships

create or replace function public.is_organization_owner(p_organization_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.organizations o
    where o.id = p_organization_id
      and o.owner_id = (select auth.uid())
  );
$$;

create or replace function public.is_active_organization_member(p_organization_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.organization_members om
    where om.organization_id = p_organization_id
      and om.user_id = (select auth.uid())
      and om.status = 'active'
  );
$$;

revoke all on function public.is_organization_owner(uuid) from public, anon;
revoke all on function public.is_active_organization_member(uuid) from public, anon;
grant execute on function public.is_organization_owner(uuid) to authenticated;
grant execute on function public.is_active_organization_member(uuid) to authenticated;

drop policy if exists "organizations_select_visible" on public.organizations;
create policy "organizations_select_visible" on public.organizations for select to authenticated
using (
  is_active = true
  or owner_id = auth.uid()
  or public.is_active_organization_member(id)
);

drop policy if exists "organizations_manage_own" on public.organizations;
create policy "organizations_manage_own" on public.organizations for insert to authenticated
with check (owner_id = auth.uid());

drop policy if exists "organizations_update_own" on public.organizations;
create policy "organizations_update_own" on public.organizations for update to authenticated
using (owner_id = auth.uid())
with check (owner_id = auth.uid());

drop policy if exists "organization_members_select_visible" on public.organization_members;
create policy "organization_members_select_visible" on public.organization_members for select to authenticated
using (
  user_id = auth.uid()
  or public.is_organization_owner(organization_id)
);

drop policy if exists "organization_members_manage_own" on public.organization_members;
create policy "organization_members_manage_own" on public.organization_members for insert to authenticated
with check (
  user_id = auth.uid()
  or public.is_organization_owner(organization_id)
);

drop policy if exists "organization_members_update_own" on public.organization_members;
create policy "organization_members_update_own" on public.organization_members for update to authenticated
using (
  user_id = auth.uid()
  or public.is_organization_owner(organization_id)
)
with check (
  user_id = auth.uid()
  or public.is_organization_owner(organization_id)
);

-- Classes and members

drop policy if exists "classes_select_visible" on public.classes;
create policy "classes_select_visible" on public.classes for select to authenticated
using (
  exists (
    select 1 from public.organization_members om
    where om.organization_id = classes.organization_id
      and om.user_id = auth.uid()
      and om.status = 'active'
  )
  or exists (
    select 1 from public.organizations o
    where o.id = classes.organization_id
      and o.owner_id = auth.uid()
  )
);

drop policy if exists "classes_manage_own" on public.classes;
create policy "classes_manage_own" on public.classes for insert to authenticated
with check (
  exists (
    select 1 from public.organizations o
    where o.id = classes.organization_id
      and o.owner_id = auth.uid()
  )
);

drop policy if exists "classes_update_own" on public.classes;
create policy "classes_update_own" on public.classes for update to authenticated
using (
  exists (
    select 1 from public.organizations o
    where o.id = classes.organization_id
      and o.owner_id = auth.uid()
  )
)
with check (
  exists (
    select 1 from public.organizations o
    where o.id = classes.organization_id
      and o.owner_id = auth.uid()
  )
);

-- Courses and lessons

drop policy if exists "courses_select_published_or_own" on public.courses;
create policy "courses_select_published_or_own" on public.courses for select to authenticated
using (
  is_published = true
  or created_by = auth.uid()
  or exists (
    select 1 from public.organizations o
    where o.id = courses.organization_id
      and o.owner_id = auth.uid()
  )
  or exists (
    select 1 from public.organization_members om
    where om.organization_id = courses.organization_id
      and om.user_id = auth.uid()
      and om.status = 'active'
  )
);

drop policy if exists "courses_select_public" on public.courses;
create policy "courses_select_public" on public.courses for select to anon
using (is_published = true);

drop policy if exists "courses_insert_auth" on public.courses;
create policy "courses_insert_auth" on public.courses for insert to authenticated
with check (
  created_by = auth.uid()
  or exists (
    select 1 from public.organizations o
    where o.id = courses.organization_id
      and o.owner_id = auth.uid()
  )
);

drop policy if exists "courses_update_auth" on public.courses;
create policy "courses_update_auth" on public.courses for update to authenticated
using (
  created_by = auth.uid()
  or exists (
    select 1 from public.organizations o
    where o.id = courses.organization_id
      and o.owner_id = auth.uid()
  )
)
with check (
  created_by = auth.uid()
  or exists (
    select 1 from public.organizations o
    where o.id = courses.organization_id
      and o.owner_id = auth.uid()
  )
);

drop policy if exists "courses_delete_auth" on public.courses;
create policy "courses_delete_auth" on public.courses for delete to authenticated
using (
  created_by = auth.uid()
  or exists (
    select 1 from public.organizations o
    where o.id = courses.organization_id
      and o.owner_id = auth.uid()
  )
);

drop policy if exists "course_lessons_select_visible" on public.course_lessons;
create policy "course_lessons_select_visible" on public.course_lessons for select to authenticated
using (
  exists (
    select 1 from public.courses c
    where c.id = course_lessons.course_id
      and c.is_published = true
  )
  or exists (
    select 1 from public.courses c
    where c.id = course_lessons.course_id
      and c.created_by = auth.uid()
  )
);

drop policy if exists "course_lessons_select_public" on public.course_lessons;
create policy "course_lessons_select_public" on public.course_lessons for select to anon
using (
  exists (
    select 1 from public.courses c
    where c.id = course_lessons.course_id
      and c.is_published = true
  )
);

-- Enrollments and progress

drop policy if exists "course_enrollments_select_own" on public.course_enrollments;
create policy "course_enrollments_select_own" on public.course_enrollments for select to authenticated
using (
  exists (
    select 1 from public.student_profiles sp
    where sp.id = auth.uid()
      and sp.id = course_enrollments.student_id
  )
  or exists (
    select 1 from public.organizations o
    join public.courses c on c.organization_id = o.id
    where c.id = course_enrollments.course_id
      and o.owner_id = auth.uid()
  )
);

drop policy if exists "course_enrollments_insert_own" on public.course_enrollments;
create policy "course_enrollments_insert_own" on public.course_enrollments for insert to authenticated
with check (
  exists (
    select 1 from public.student_profiles sp
    where sp.id = auth.uid()
      and sp.id = course_enrollments.student_id
  )
);

drop policy if exists "course_enrollments_update_own" on public.course_enrollments;
create policy "course_enrollments_update_own" on public.course_enrollments for update to authenticated
using (
  exists (
    select 1 from public.student_profiles sp
    where sp.id = auth.uid()
      and sp.id = course_enrollments.student_id
  )
  or exists (
    select 1 from public.organizations o
    join public.courses c on c.organization_id = o.id
    where c.id = course_enrollments.course_id
      and o.owner_id = auth.uid()
  )
)
with check (
  exists (
    select 1 from public.student_profiles sp
    where sp.id = auth.uid()
      and sp.id = course_enrollments.student_id
  )
  or exists (
    select 1 from public.organizations o
    join public.courses c on c.organization_id = o.id
    where c.id = course_enrollments.course_id
      and o.owner_id = auth.uid()
  )
);

drop policy if exists "lesson_progress_select_own" on public.lesson_progress;
create policy "lesson_progress_select_own" on public.lesson_progress for select to authenticated
using (
  exists (
    select 1 from public.student_profiles sp
    where sp.id = auth.uid()
      and sp.id = lesson_progress.student_id
  )
);

drop policy if exists "lesson_progress_manage_own" on public.lesson_progress;
create policy "lesson_progress_manage_own" on public.lesson_progress for insert to authenticated
with check (
  exists (
    select 1 from public.student_profiles sp
    where sp.id = auth.uid()
      and sp.id = lesson_progress.student_id
  )
);

drop policy if exists "lesson_progress_update_own" on public.lesson_progress;
create policy "lesson_progress_update_own" on public.lesson_progress for update to authenticated
using (
  exists (
    select 1 from public.student_profiles sp
    where sp.id = auth.uid()
      and sp.id = lesson_progress.student_id
  )
)
with check (
  exists (
    select 1 from public.student_profiles sp
    where sp.id = auth.uid()
      and sp.id = lesson_progress.student_id
  )
);

-- Exams and attempts

drop policy if exists "exams_select_visible" on public.exams;
create policy "exams_select_visible" on public.exams for select to authenticated
using (
  is_published = true
  or created_by = auth.uid()
  or exists (
    select 1 from public.organizations o
    where o.id = exams.organization_id
      and o.owner_id = auth.uid()
  )
);

drop policy if exists "exams_select_public" on public.exams;
create policy "exams_select_public" on public.exams for select to anon
using (is_published = true);

drop policy if exists "exams_manage_auth" on public.exams;
create policy "exams_manage_auth" on public.exams for insert to authenticated
with check (created_by = auth.uid());

drop policy if exists "exams_update_auth" on public.exams;
create policy "exams_update_auth" on public.exams for update to authenticated
using (created_by = auth.uid())
with check (created_by = auth.uid());

drop policy if exists "questions_select_visible" on public.questions;
create policy "questions_select_visible" on public.questions for select to authenticated
using (
  exists (
    select 1 from public.exams e
    where e.id = questions.exam_id
      and (e.is_published = true or e.created_by = auth.uid())
  )
);

drop policy if exists "questions_select_public" on public.questions;
create policy "questions_select_public" on public.questions for select to anon
using (
  exists (
    select 1 from public.exams e
    where e.id = questions.exam_id
      and e.is_published = true
  )
);

drop policy if exists "questions_manage_auth" on public.questions;
create policy "questions_manage_auth" on public.questions for insert to authenticated
with check (
  exists (
    select 1 from public.exams e
    where e.id = questions.exam_id
      and e.created_by = auth.uid()
  )
);

drop policy if exists "questions_update_auth" on public.questions;
create policy "questions_update_auth" on public.questions for update to authenticated
using (
  exists (
    select 1 from public.exams e
    where e.id = questions.exam_id
      and e.created_by = auth.uid()
  )
)
with check (
  exists (
    select 1 from public.exams e
    where e.id = questions.exam_id
      and e.created_by = auth.uid()
  )
);

drop policy if exists "question_options_read_restricted_to_teachers" on public.question_options;
create policy "question_options_read_restricted_to_teachers"
on public.question_options for select to authenticated
using (
  exists (
    select 1 from public.profiles p
    where p.id = auth.uid()
      and p.role in ('teacher','owner','admin')
  )
);

drop policy if exists "question_options_manage_restricted_to_teachers" on public.question_options;
create policy "question_options_manage_restricted_to_teachers"
on public.question_options for insert to authenticated
with check (
  exists (
    select 1 from public.profiles p
    where p.id = auth.uid()
      and p.role in ('teacher','owner','admin')
  )
);

drop policy if exists "question_options_update_restricted_to_teachers" on public.question_options;
create policy "question_options_update_restricted_to_teachers"
on public.question_options for update to authenticated
using (
  exists (
    select 1 from public.profiles p
    where p.id = auth.uid()
      and p.role in ('teacher','owner','admin')
  )
)
with check (
  exists (
    select 1 from public.profiles p
    where p.id = auth.uid()
      and p.role in ('teacher','owner','admin')
  )
);

drop policy if exists "question_options_delete_restricted_to_teachers" on public.question_options;
create policy "question_options_delete_restricted_to_teachers"
on public.question_options for delete to authenticated
using (
  exists (
    select 1 from public.profiles p
    where p.id = auth.uid()
      and p.role in ('teacher','owner','admin')
  )
);

drop policy if exists "exam_attempts_select_own" on public.exam_attempts;
create policy "exam_attempts_select_own" on public.exam_attempts for select to authenticated
using (
  exists (
    select 1 from public.student_profiles sp
    where sp.id = auth.uid()
      and sp.id = exam_attempts.student_id
  )
  or exists (
    select 1 from public.exams e
    where e.id = exam_attempts.exam_id
      and e.created_by = auth.uid()
  )
);

drop policy if exists "exam_attempts_insert_own" on public.exam_attempts;
create policy "exam_attempts_insert_own" on public.exam_attempts for insert to authenticated
with check (
  exists (
    select 1 from public.student_profiles sp
    where sp.id = auth.uid()
      and sp.id = exam_attempts.student_id
  )
);

drop policy if exists "exam_attempts_update_own" on public.exam_attempts;
create policy "exam_attempts_update_own" on public.exam_attempts for update to authenticated
using (
  exists (
    select 1 from public.student_profiles sp
    where sp.id = auth.uid()
      and sp.id = exam_attempts.student_id
  )
  or exists (
    select 1 from public.exams e
    where e.id = exam_attempts.exam_id
      and e.created_by = auth.uid()
  )
)
with check (
  exists (
    select 1 from public.student_profiles sp
    where sp.id = auth.uid()
      and sp.id = exam_attempts.student_id
  )
  or exists (
    select 1 from public.exams e
    where e.id = exam_attempts.exam_id
      and e.created_by = auth.uid()
  )
);

drop policy if exists "exam_answers_select_own" on public.exam_answers;
create policy "exam_answers_select_own" on public.exam_answers for select to authenticated
using (
  exists (
    select 1 from public.exam_attempts ea
    join public.student_profiles sp on sp.id = ea.student_id
    where ea.id = exam_answers.attempt_id
      and sp.id = auth.uid()
  )
  or exists (
    select 1 from public.exams e
    join public.exam_attempts ea on ea.exam_id = e.id
    where ea.id = exam_answers.attempt_id
      and e.created_by = auth.uid()
  )
);

drop policy if exists "exam_answers_insert_own" on public.exam_answers;
create policy "exam_answers_insert_own" on public.exam_answers for insert to authenticated
with check (
  exists (
    select 1 from public.exam_attempts ea
    join public.student_profiles sp on sp.id = ea.student_id
    where ea.id = exam_answers.attempt_id
      and sp.id = auth.uid()
  )
);

drop policy if exists "exam_answers_update_own" on public.exam_answers;
create policy "exam_answers_update_own" on public.exam_answers for update to authenticated
using (
  exists (
    select 1 from public.exam_attempts ea
    join public.student_profiles sp on sp.id = ea.student_id
    where ea.id = exam_answers.attempt_id
      and sp.id = auth.uid()
  )
  or exists (
    select 1 from public.exams e
    join public.exam_attempts ea on ea.exam_id = e.id
    where ea.id = exam_answers.attempt_id
      and e.created_by = auth.uid()
  )
)
with check (
  exists (
    select 1 from public.exam_attempts ea
    join public.student_profiles sp on sp.id = ea.student_id
    where ea.id = exam_answers.attempt_id
      and sp.id = auth.uid()
  )
  or exists (
    select 1 from public.exams e
    join public.exam_attempts ea on ea.exam_id = e.id
    where ea.id = exam_answers.attempt_id
      and e.created_by = auth.uid()
  )
);

drop policy if exists "student_course_performance_select_own" on public.student_course_performance;
create policy "student_course_performance_select_own" on public.student_course_performance for select to authenticated
using (
  exists (
    select 1 from public.student_profiles sp
    where sp.id = auth.uid()
      and sp.id = student_course_performance.student_id
  )
);

notify pgrst, 'reload schema';
