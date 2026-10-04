-- Fixes the circular RLS dependency between organizations and organization_members.
-- Safe to apply after the security policies migration on an existing database.

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
