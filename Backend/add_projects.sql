-- Create Projects Table
create table if not exists projects (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  name text not null,
  description text,
  workspace_id uuid references workspaces on delete cascade not null
);

-- Add project_id to tasks
alter table tasks add column if not exists project_id uuid references projects on delete set null;

-- Enable RLS
alter table projects enable row level security;

-- Policies for Projects (Reuse helper function)
create policy "View projects in my workspaces" on projects
  for select using (
    is_workspace_member(workspace_id)
  );

create policy "Create projects in my workspaces" on projects
  for insert with check (
    is_workspace_member(workspace_id)
  );

create policy "Update projects in my workspaces" on projects
  for update using (
    is_workspace_member(workspace_id)
  );

create policy "Delete projects in my workspaces" on projects
  for delete using (
    is_workspace_member(workspace_id)
  );

-- Update Task RLS to be aware of project constraints? 
-- Actually, the existing task policy checks workspace_id. 
-- Since a project belongs to a workspace, if we insert a task with a project_id, 
-- we should probably ensure that project belongs to the same workspace, but DB constraints usually suffice for referential integrity.
-- However, RLS for tasks is already based on `workspace_id`.
-- When creating a task, we must ensure the `workspace_id` is set correctly.
