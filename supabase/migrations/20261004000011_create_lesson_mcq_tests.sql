-- Depends on: 20261004000010_manage_course_lessons.sql
-- Supports one optional MCQ exam per lesson and atomically saves a question with its options.

alter table public.exams
  add column if not exists lesson_id uuid
  references public.course_lessons(id) on delete cascade;

create unique index if not exists exams_lesson_id_unique
  on public.exams (lesson_id)
  where lesson_id is not null;

create index if not exists idx_exams_lesson_id on public.exams (lesson_id);

grant select, insert, update, delete on public.exams to authenticated;
grant select, insert, update, delete on public.questions to authenticated;
grant select on public.question_options to authenticated;
grant select on public.question_options_public to anon, authenticated;

create or replace view public.question_options_public as
select
  qo.id,
  qo.question_id,
  qo.option_text,
  qo.option_order
from public.question_options qo
join public.questions q on q.id = qo.question_id
join public.exams e on e.id = q.exam_id
left join public.course_lessons cl on cl.id = e.lesson_id
left join public.courses c on c.id = e.course_id
where e.is_published = true
  and (
    e.lesson_id is null
    or (
      cl.is_published = true
      and c.status = 'Published'
    )
  );

drop policy if exists "exams_select_visible" on public.exams;
create policy "exams_select_visible" on public.exams for select to authenticated
using (
  created_by = (select auth.uid())
  or (
    course_id is not null
    and public.can_manage_course(course_id::text)
  )
  or (
    is_published = true
    and (
      lesson_id is null
      or exists (
        select 1
        from public.course_lessons cl
        join public.courses c on c.id = cl.course_id
        where cl.id = exams.lesson_id
          and cl.is_published = true
          and c.status = 'Published'
      )
    )
  )
);

drop policy if exists "exams_select_public" on public.exams;
create policy "exams_select_public" on public.exams for select to anon
using (
  is_published = true
  and (
    lesson_id is null
    or exists (
      select 1
      from public.course_lessons cl
      join public.courses c on c.id = cl.course_id
      where cl.id = exams.lesson_id
        and cl.is_published = true
        and c.status = 'Published'
    )
  )
);

drop policy if exists "exams_manage_auth" on public.exams;
create policy "exams_manage_auth" on public.exams for insert to authenticated
with check (
  created_by = (select auth.uid())
  and (
    course_id is null
    or public.can_manage_course(course_id::text)
  )
  and (
    lesson_id is null
    or exists (
      select 1
      from public.course_lessons cl
      where cl.id = exams.lesson_id
        and cl.course_id = exams.course_id
    )
  )
);

drop policy if exists "exams_update_auth" on public.exams;
create policy "exams_update_auth" on public.exams for update to authenticated
using (
  created_by = (select auth.uid())
  or (
    course_id is not null
    and public.can_manage_course(course_id::text)
  )
)
with check (
  (
    created_by = (select auth.uid())
    or (
      course_id is not null
      and public.can_manage_course(course_id::text)
    )
  )
  and (
    lesson_id is null
    or exists (
      select 1
      from public.course_lessons cl
      where cl.id = exams.lesson_id
        and cl.course_id = exams.course_id
    )
  )
);

drop policy if exists "exams_delete_managed_course" on public.exams;
create policy "exams_delete_managed_course" on public.exams for delete to authenticated
using (
  created_by = (select auth.uid())
  or (
    course_id is not null
    and public.can_manage_course(course_id::text)
  )
);

drop policy if exists "questions_select_visible" on public.questions;
create policy "questions_select_visible" on public.questions for select to authenticated
using (
  exists (
    select 1
    from public.exams e
    where e.id = questions.exam_id
      and (
        e.created_by = (select auth.uid())
        or (
          e.course_id is not null
          and public.can_manage_course(e.course_id::text)
        )
        or (
          e.is_published = true
          and (
            e.lesson_id is null
            or exists (
              select 1
              from public.course_lessons cl
              join public.courses c on c.id = cl.course_id
              where cl.id = e.lesson_id
                and cl.is_published = true
                and c.status = 'Published'
            )
          )
        )
      )
  )
);

drop policy if exists "questions_select_public" on public.questions;
create policy "questions_select_public" on public.questions for select to anon
using (
  exists (
    select 1
    from public.exams e
    where e.id = questions.exam_id
      and e.is_published = true
      and (
        e.lesson_id is null
        or exists (
          select 1
          from public.course_lessons cl
          join public.courses c on c.id = cl.course_id
          where cl.id = e.lesson_id
            and cl.is_published = true
            and c.status = 'Published'
        )
      )
  )
);

drop policy if exists "questions_manage_auth" on public.questions;
create policy "questions_manage_auth" on public.questions for insert to authenticated
with check (
  exists (
    select 1 from public.exams e
    where e.id = questions.exam_id
      and (
        e.created_by = (select auth.uid())
        or (
          e.course_id is not null
          and public.can_manage_course(e.course_id::text)
        )
      )
  )
);

drop policy if exists "questions_update_auth" on public.questions;
create policy "questions_update_auth" on public.questions for update to authenticated
using (
  exists (
    select 1 from public.exams e
    where e.id = questions.exam_id
      and (
        e.created_by = (select auth.uid())
        or (
          e.course_id is not null
          and public.can_manage_course(e.course_id::text)
        )
      )
  )
)
with check (
  exists (
    select 1 from public.exams e
    where e.id = questions.exam_id
      and (
        e.created_by = (select auth.uid())
        or (
          e.course_id is not null
          and public.can_manage_course(e.course_id::text)
        )
      )
  )
);

drop policy if exists "questions_delete_managed_course" on public.questions;
create policy "questions_delete_managed_course" on public.questions for delete to authenticated
using (
  exists (
    select 1 from public.exams e
    where e.id = questions.exam_id
      and (
        e.created_by = (select auth.uid())
        or (
          e.course_id is not null
          and public.can_manage_course(e.course_id::text)
        )
      )
  )
);

drop policy if exists "question_options_read_restricted_to_teachers" on public.question_options;
create policy "question_options_read_restricted_to_teachers"
on public.question_options for select to authenticated
using (
  exists (
    select 1
    from public.questions q
    join public.exams e on e.id = q.exam_id
    where q.id = question_options.question_id
      and public.can_manage_course(e.course_id::text)
  )
  or exists (
    select 1
    from public.profiles p
    where p.id = (select auth.uid())
      and p.role in ('teacher', 'owner', 'admin')
  )
);

create or replace function public.save_lesson_mcq_question(
  p_lesson_id uuid,
  p_exam_id uuid,
  p_question_id uuid,
  p_question_text text,
  p_marks numeric,
  p_options jsonb
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  saved_question_id uuid;
  option_count integer;
  correct_count integer;
begin
  if (select auth.uid()) is null then
    raise exception 'Authentication is required to manage lesson tests.';
  end if;

  if nullif(trim(p_question_text), '') is null then
    raise exception 'Question text is required.';
  end if;

  if p_marks is null or p_marks <= 0 then
    raise exception 'Question marks must be greater than zero.';
  end if;

  if jsonb_typeof(p_options) <> 'array' then
    raise exception 'Question options must be a JSON array.';
  end if;

  select count(*), count(*) filter (where (option_row->>'is_correct')::boolean)
  into option_count, correct_count
  from jsonb_array_elements(p_options) as option_row
  where nullif(trim(option_row->>'option_text'), '') is not null;

  if option_count < 2 or option_count > 6 then
    raise exception 'An MCQ must have between two and six non-empty options.';
  end if;

  if correct_count <> 1 then
    raise exception 'Exactly one MCQ option must be marked correct.';
  end if;

  if not exists (
    select 1
    from public.exams e
    join public.course_lessons cl on cl.id = e.lesson_id
    where e.id = p_exam_id
      and cl.id = p_lesson_id
      and e.lesson_id = p_lesson_id
      and cl.course_id = e.course_id
      and public.can_manage_course(e.course_id::text)
  ) then
    raise exception 'You do not have permission to manage this lesson test.';
  end if;

  if p_question_id is null then
    insert into public.questions (exam_id, question_text, marks, question_order)
    select p_exam_id, trim(p_question_text), p_marks, coalesce(max(q.question_order), 0) + 1
    from public.questions q
    where q.exam_id = p_exam_id
    returning id into saved_question_id;
  else
    update public.questions
    set question_text = trim(p_question_text),
        marks = p_marks
    where id = p_question_id
      and exam_id = p_exam_id
    returning id into saved_question_id;

    if saved_question_id is null then
      raise exception 'Question not found in this lesson test.';
    end if;

    delete from public.question_options
    where question_id = saved_question_id;
  end if;

  insert into public.question_options (question_id, option_text, is_correct, option_order)
  select
    saved_question_id,
    trim(option_row->>'option_text'),
    (option_row->>'is_correct')::boolean,
    coalesce((option_row->>'option_order')::integer, option_number::integer)
  from jsonb_array_elements(p_options) with ordinality as options(option_row, option_number)
  where nullif(trim(option_row->>'option_text'), '') is not null;

  return saved_question_id;
end;
$$;

revoke all on function public.save_lesson_mcq_question(uuid, uuid, uuid, text, numeric, jsonb) from public, anon;
grant execute on function public.save_lesson_mcq_question(uuid, uuid, uuid, text, numeric, jsonb) to authenticated;

notify pgrst, 'reload schema';
