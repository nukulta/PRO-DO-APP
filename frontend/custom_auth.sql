-- Create a custom users table for manual authenitcation
-- Run this in your Supabase SQL Editor

-- Ensure UUID extension is available
create extension if not exists "uuid-ossp";

create table custom_users (
  id uuid default uuid_generate_v4() primary key,
  email text unique not null,
  password_hash text not null,
  full_name text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS (optional, but good practice)
alter table custom_users enable row level security;

-- Allow the anon key (used by backend with simple client) to read/insert?
-- Actually if backend uses service role, we don't need this.
-- If backend uses Anon key, we need to allow access.
-- Warning: This makes the table potentially accessible if RLS is not careful.
-- For now, allow all interactions if you are the backend.
-- Ideally, create a policy that only allows the Service Role or specific logic.

create policy "Allow all for now (adjust for production)"
  on custom_users for all
  using (true)
  with check (true);
