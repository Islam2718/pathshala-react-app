create table if not exists public.courses (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category text not null,
  class_level text not null,
  board text not null,
  description text not null default '',
  subjects text[] not null default '{}',
  lessons integer not null default 0 check (lessons >= 0),
  tests integer not null default 0 check (tests >= 0),
  students integer not null default 0 check (students >= 0),
  status text not null default 'Draft'
    check (status in ('Published', 'Draft', 'Archived')),
  updated_at date not null default current_date
);

alter table public.courses
  add column if not exists description text not null default '',
  add column if not exists subjects text[] not null default '{}';

create table if not exists public.course_categories (
  name text primary key check (length(trim(name)) > 0),
  slug text not null unique,
  description text not null default '',
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.course_categories
  add column if not exists slug text;

update public.course_categories
set slug = coalesce(
  nullif(trim(both '-' from regexp_replace(lower(name), '[^a-z0-9]+', '-', 'g')), ''),
  'category'
) || '-' || left(md5(name), 8)
where slug is null or trim(slug) = '';

alter table public.course_categories
  alter column slug set not null;

create unique index if not exists course_categories_slug_key
  on public.course_categories(slug);

insert into public.course_categories (name, slug)
select distinct
  coalesce(nullif(trim(category), ''), 'Uncategorized'),
  coalesce(
    nullif(trim(both '-' from regexp_replace(lower(coalesce(nullif(trim(category), ''), 'Uncategorized')), '[^a-z0-9]+', '-', 'g')), ''),
    'category'
  ) || '-' || left(md5(coalesce(nullif(trim(category), ''), 'Uncategorized')), 8)
from public.courses
on conflict (name) do nothing;

update public.courses
set category = coalesce(nullif(trim(category), ''), 'Uncategorized')
where category is distinct from coalesce(nullif(trim(category), ''), 'Uncategorized');

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conrelid = 'public.courses'::regclass
      and conname = 'courses_category_fkey'
  ) then
    alter table public.courses
      add constraint courses_category_fkey
      foreign key (category) references public.course_categories(name)
      on update cascade on delete restrict;
  end if;
end
$$;

create index if not exists courses_category_idx on public.courses(category);

alter table public.courses enable row level security;
alter table public.course_categories enable row level security;

grant select on public.courses, public.course_categories to anon, authenticated;
grant insert, update, delete on public.courses, public.course_categories to authenticated;

drop policy if exists "Signed-in users can view courses" on public.courses;
create policy "Signed-in users can view courses"
  on public.courses for select to authenticated
  using (true);

drop policy if exists "Anyone can view published courses" on public.courses;
create policy "Anyone can view published courses"
  on public.courses for select to anon, authenticated
  using (status = 'Published');

drop policy if exists "Signed-in users can add courses" on public.courses;
create policy "Signed-in users can add courses"
  on public.courses for insert to authenticated
  with check (true);

drop policy if exists "Signed-in users can edit courses" on public.courses;
create policy "Signed-in users can edit courses"
  on public.courses for update to authenticated
  using (true) with check (true);

drop policy if exists "Signed-in users can delete courses" on public.courses;
create policy "Signed-in users can delete courses"
  on public.courses for delete to authenticated
  using (true);

drop policy if exists "Anyone can view active course categories" on public.course_categories;
create policy "Anyone can view active course categories"
  on public.course_categories for select to anon, authenticated
  using (is_active = true);

drop policy if exists "Signed-in users can view course categories" on public.course_categories;
create policy "Signed-in users can view course categories"
  on public.course_categories for select to authenticated
  using (true);

drop policy if exists "Signed-in users can add course categories" on public.course_categories;
create policy "Signed-in users can add course categories"
  on public.course_categories for insert to authenticated
  with check (true);

drop policy if exists "Signed-in users can edit course categories" on public.course_categories;
create policy "Signed-in users can edit course categories"
  on public.course_categories for update to authenticated
  using (true) with check (true);

drop policy if exists "Signed-in users can delete course categories" on public.course_categories;
create policy "Signed-in users can delete course categories"
  on public.course_categories for delete to authenticated
  using (true);

notify pgrst, 'reload schema';
