-- Create a table for public profiles using Supabase key
create table profiles (
  id uuid references auth.users on delete cascade not null primary key,
  updated_at timestamp with time zone,
  username text unique,
  full_name text,
  avatar_url text,
  website text,

  constraint username_length check (char_length(username) >= 3)
);

-- Set up Row Level Security!
alter table profiles enable row level security;

create policy "Public profiles are viewable by everyone."
  on profiles for select
  using ( true );

create policy "Users can insert their own profile."
  on profiles for insert
  with check ( auth.uid() = id );

create policy "Users can update own profile."
  on profiles for update
  using ( auth.uid() = id );

-- Create Teams table
create table teams (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  name text not null,
  owner_id uuid references profiles(id)
);

alter table teams enable row level security;

create policy "Team members can view teams"
  on teams for select
  using ( auth.uid() in (select user_id from team_members where team_id = id) or auth.uid() = owner_id );

create policy "Owners can update teams"
  on teams for update
  using ( auth.uid() = owner_id );

create policy "Start a team"
  on teams for insert
  with check ( auth.uid() = owner_id );

-- Create Team Members table
create table team_members (
  id uuid default uuid_generate_v4() primary key,
  team_id uuid references teams(id) on delete cascade not null,
  user_id uuid references profiles(id) on delete cascade not null,
  role text default 'member' check (role in ('owner', 'admin', 'member')),
  joined_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table team_members enable row level security;

create policy "Team members can view members"
  on team_members for select
  using ( auth.uid() in (select user_id from team_members tm where tm.team_id = team_id) );

-- Create Projects table
create table projects (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  title text not null,
  description text,
  team_id uuid references teams(id) on delete cascade,
  owner_id uuid references profiles(id)
);

alter table projects enable row level security;

create policy "Team members can view projects"
  on projects for select
  using ( auth.uid() in (select user_id from team_members where team_id = projects.team_id) or auth.uid() = owner_id );

create policy "Team members can create projects"
  on projects for insert
  with check ( auth.uid() in (select user_id from team_members where team_id = team_id) or auth.uid() = owner_id );

-- Create Tasks table
create table tasks (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  title text not null,
  description text,
  status text default 'todo' check (status in ('todo', 'in-progress', 'done')),
  priority text default 'medium' check (priority in ('low', 'medium', 'high')),
  project_id uuid references projects(id) on delete cascade,
  assignee_id uuid references profiles(id),
  due_date timestamp with time zone
);

alter table tasks enable row level security;

create policy "Project members can view tasks"
  on tasks for select
  using ( 
    auth.uid() in (
      select user_id from team_members 
      join projects on projects.team_id = team_members.team_id
      where projects.id = tasks.project_id
    )
  );

create policy "Project members can create tasks"
  on tasks for insert
  with check ( 
    auth.uid() in (
      select user_id from team_members 
      join projects on projects.team_id = team_members.team_id
      where projects.id = project_id
    )
  );

create policy "Project members can update tasks"
  on tasks for update
  using ( 
    auth.uid() in (
      select user_id from team_members 
      join projects on projects.team_id = team_members.team_id
      where projects.id = project_id
    )
  );

-- Function to handle new user signup
create or replace function public.handle_new_user() 
returns trigger as $$
begin
  insert into public.profiles (id, username, full_name, avatar_url)
  values (new.id, new.raw_user_meta_data->>'username', new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$ language plpgsql security definer;

-- Trigger for new user signup
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
