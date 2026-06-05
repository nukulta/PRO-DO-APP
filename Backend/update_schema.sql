-- Add due_date to tasks if it doesn't exist
alter table tasks add column if not exists due_date timestamp with time zone;
alter table tasks add column if not exists start_date timestamp with time zone default now();

-- Create Messages Table for Chat
create table if not exists messages (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  content text not null,
  user_id uuid references auth.users not null,
  project_id uuid -- Optional: if you want channel/project specific chat later
);

-- Realtime for Messages
alter publication supabase_realtime add table messages;

-- RLS for Messages
alter table messages enable row level security;

create policy "Enable read access for all users" on messages
  for select using (auth.role() = 'authenticated');

create policy "Enable insert for authenticated users" on messages
  for insert with check (auth.role() = 'authenticated');
