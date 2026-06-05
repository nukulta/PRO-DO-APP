-- Run this in your Supabase SQL Editor to create the necessary table

create table if not exists tasks (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  title text not null,
  description text,
  status text check (status in ('todo', 'in-progress', 'done')) default 'todo',
  priority text check (priority in ('low', 'medium', 'high')) default 'medium',
  user_id uuid references auth.users not null
);

-- Enable RLS
alter table tasks enable row level security;

-- Create Policies
create policy "Enable read access for all users" on tasks
  for select using (auth.role() = 'authenticated');

create policy "Enable insert for authenticated users" on tasks
  for insert with check (auth.role() = 'authenticated');

create policy "Enable update for task owners" on tasks
  for update using (auth.uid() = user_id);

create policy "Enable delete for task owners" on tasks
  for delete using (auth.uid() = user_id);
