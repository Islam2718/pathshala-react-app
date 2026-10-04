-- Depends on: 20261002000000_create_courses.sql
-- Extends the existing course table with organization/course meta fields used by PicoLearn.

alter table public.courses
  add column if not exists thumbnail_url text,
  add column if not exists course_type varchar(30) not null default 'system'
    check (course_type in ('system','organization','teacher')),
  add column if not exists organization_id uuid,
  add column if not exists created_by uuid,
  add column if not exists is_published boolean not null default false;

DO $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conrelid = 'public.courses'::regclass
      and conname = 'courses_organization_id_fkey'
  ) then
    alter table public.courses
      add constraint courses_organization_id_fkey
      foreign key (organization_id) references public.organizations(id)
      on delete cascade;
  end if;

  if not exists (
    select 1
    from pg_constraint
    where conrelid = 'public.courses'::regclass
      and conname = 'courses_created_by_fkey'
  ) then
    alter table public.courses
      add constraint courses_created_by_fkey
      foreign key (created_by) references public.profiles(id);
  end if;
end $$;

create index if not exists idx_courses_organization_id on public.courses (organization_id);
create index if not exists idx_courses_created_by on public.courses (created_by);
