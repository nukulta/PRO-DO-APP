-- Fix Infinite Recursion in RLS by using a Security Definer function

-- 1. Create a helper function to check membership safely
-- This function runs with the privileges of the creator (postgres), bypassing RLS on the table it queries
create or replace function public.is_workspace_member(_workspace_id uuid)
returns boolean
language plpgsql
security definer 
set search_path = public 
as $$
begin
  return exists (
    select 1
    from workspace_members
    where workspace_id = _workspace_id
    and user_id = auth.uid()
  );
end;
$$;

-- 2. Drop existing failing policies to avoid conflicts
drop policy if exists "Users can view members of their workspaces" on workspace_members;
drop policy if exists "Users can view workspaces they are members of" on workspaces;
drop policy if exists "View tasks in my workspaces" on tasks;
drop policy if exists "Create tasks in my workspaces" on tasks;
drop policy if exists "Update tasks in my workspaces" on tasks;
drop policy if exists "View messages in my workspaces" on messages;
drop policy if exists "Create messages in my workspaces" on messages;

-- 3. Re-create policies using the helper function

-- Workspace Members: Users can view rows if they are a member of that workspace (including themselves)
create policy "Users can view members of their workspaces" on workspace_members
  for select using (
    is_workspace_member(workspace_id)
  );

-- Workspaces: View if member
create policy "Users can view workspaces they are members of" on workspaces
  for select using (
    is_workspace_member(id)
  );

-- Tasks: Restrict access to workspace members
create policy "View tasks in my workspaces" on tasks
  for select using (
    is_workspace_member(workspace_id)
  );

create policy "Create tasks in my workspaces" on tasks
  for insert with check (
    is_workspace_member(workspace_id)
  );

create policy "Update tasks in my workspaces" on tasks
  for update using (
    is_workspace_member(workspace_id)
  );

create policy "Delete tasks in my workspaces" on tasks
  for delete using (
    is_workspace_member(workspace_id)
  );

-- Messages: Restrict access to workspace members
create policy "View messages in my workspaces" on messages
  for select using (
    is_workspace_member(workspace_id)
  );

create policy "Create messages in my workspaces" on messages
  for insert with check (
    is_workspace_member(workspace_id)
  );
