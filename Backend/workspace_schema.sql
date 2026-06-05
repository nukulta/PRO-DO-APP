-- Create Workspaces Table
create table if not exists workspaces (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  name text not null,
  join_code text default substr(md5(random()::text), 0, 7) unique, -- Simple 6 char code
  owner_id uuid references auth.users not null
);

-- Create Members Table
create table if not exists workspace_members (
  id uuid default gen_random_uuid() primary key,
  workspace_id uuid references workspaces on delete cascade not null,
  user_id uuid references auth.users not null,
  joined_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(workspace_id, user_id)
);

-- Add workspace_id to constraints
alter table tasks add column if not exists workspace_id uuid references workspaces on delete cascade;
alter table messages add column if not exists workspace_id uuid references workspaces on delete cascade;

-- Enable RLS
alter table workspaces enable row level security;
alter table workspace_members enable row level security;

-- Policies for Workspaces
create policy "Users can view workspaces they are members of" on workspaces
  for select using (
    exists (
      select 1 from workspace_members
      where workspace_members.workspace_id = workspaces.id
      and workspace_members.user_id = auth.uid()
    )
  );

create policy "Users can create workspaces" on workspaces
  for insert with check (auth.uid() = owner_id);

-- Policies for Members
create policy "Users can view members of their workspaces" on workspace_members
  for select using (
    exists (
      select 1 from workspace_members as wm
      where wm.workspace_id = workspace_members.workspace_id
      and wm.user_id = auth.uid()
    )
  );

create policy "Users can join workspaces" on workspace_members
  for insert with check (auth.uid() = user_id);

-- Update Task/Message Policies to be Workspace Scoped
-- Note: You might want to drop old policies if they conflict, but adding strict ones usually works with OR/AND logic depending on Supabase version. 
-- For now we'll add new restrictive policies. Ideally, we drop the "public read" policies from before.

drop policy if exists "Enable read access for all users" on tasks;
drop policy if exists "Enable insert for authenticated users" on tasks;
drop policy if exists "Enable update for task owners" on tasks;
drop policy if exists "Enable delete for task owners" on tasks;

create policy "View tasks in my workspaces" on tasks
  for select using (
    exists (
      select 1 from workspace_members
      where workspace_members.workspace_id = tasks.workspace_id
      and workspace_members.user_id = auth.uid()
    )
  );

create policy "Create tasks in my workspaces" on tasks
  for insert with check (
    exists (
      select 1 from workspace_members
      where workspace_members.workspace_id = tasks.workspace_id
      and workspace_members.user_id = auth.uid()
    )
  );

create policy "Update tasks in my workspaces" on tasks
  for update using (
    exists (
      select 1 from workspace_members
      where workspace_members.workspace_id = tasks.workspace_id
      and workspace_members.user_id = auth.uid()
    )
  );

-- Similar for Messages
drop policy if exists "Enable read access for all users" on messages;
create policy "View messages in my workspaces" on messages
  for select using (
    exists (
      select 1 from workspace_members
      where workspace_members.workspace_id = messages.workspace_id
      and workspace_members.user_id = auth.uid()
    )
  );

create policy "Create messages in my workspaces" on messages
  for insert with check (
    exists (
      select 1 from workspace_members
      where workspace_members.workspace_id = messages.workspace_id
      and workspace_members.user_id = auth.uid()
    )
  );
