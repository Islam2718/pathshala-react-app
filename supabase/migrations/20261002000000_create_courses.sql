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

alter table public.courses enable row level security;

drop policy if exists "Signed-in users can view courses" on public.courses;
create policy "Signed-in users can view courses"
  on public.courses for select to authenticated
  using (true);

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

notify pgrst, 'reload schema';
