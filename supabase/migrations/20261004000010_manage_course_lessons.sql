-- Depends on: 20261004000008_create_rls_and_security.sql
-- Adds role/creator-authorized lesson management and limits public reads to published lessons.

create or replace function public.can_manage_course(p_course_id text)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.courses c
    where c.id::text = p_course_id
      and (
        c.created_by = (select auth.uid())
        or exists (
          select 1
          from public.profiles p
          where p.id = (select auth.uid())
            and p.role in ('admin', 'owner', 'teacher')
        )
        or exists (
          select 1
          from public.organizations o
          where o.id = c.organization_id
            and o.owner_id = (select auth.uid())
        )
      )
  );
$$;

revoke all on function public.can_manage_course(text) from public, anon;
grant execute on function public.can_manage_course(text) to authenticated;

grant select, insert, update, delete on public.course_lessons to authenticated;
grant select on public.course_lessons to anon;

drop policy if exists "course_lessons_select_visible" on public.course_lessons;
create policy "course_lessons_select_visible"
on public.course_lessons for select to authenticated
using (
  public.can_manage_course(course_id::text)
  or (
    is_published = true
    and exists (
      select 1
      from public.courses c
      where c.id = course_lessons.course_id
        and c.status = 'Published'
    )
  )
);

drop policy if exists "course_lessons_select_public" on public.course_lessons;
create policy "course_lessons_select_public"
on public.course_lessons for select to anon
using (
  is_published = true
  and exists (
    select 1
    from public.courses c
    where c.id = course_lessons.course_id
      and c.status = 'Published'
  )
);

drop policy if exists "course_lessons_insert_managed_course" on public.course_lessons;
create policy "course_lessons_insert_managed_course"
on public.course_lessons for insert to authenticated
with check (public.can_manage_course(course_id::text));

drop policy if exists "course_lessons_update_managed_course" on public.course_lessons;
create policy "course_lessons_update_managed_course"
on public.course_lessons for update to authenticated
using (public.can_manage_course(course_id::text))
with check (public.can_manage_course(course_id::text));

drop policy if exists "course_lessons_delete_managed_course" on public.course_lessons;
create policy "course_lessons_delete_managed_course"
on public.course_lessons for delete to authenticated
using (public.can_manage_course(course_id::text));
