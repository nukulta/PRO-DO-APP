# Backend Setup Instructions

## 1. Environment Variables
Ensure you have a `.env` file in this `Backend` directory with the following:
```env
PORT=5000
SUPABASE_URL="YOUR_SUPABASE_URL"
SUPABASE_KEY="YOUR_SUPABASE_SERVICE_ROLE_KEY" 
SUPABASE_JWT_SECRET="YOUR_SUPABASE_JWT_SECRET"
```
*   **SUPABASE_KEY**: Use the `service_role` key for the backend to allow full access.
*   **SUPABASE_JWT_SECRET**: Get this from Supabase Dashboard > Project Settings > API. This is required for the tokens to work with your frontend RLS.

## 2. Database Setup (CRITICAL)
You must create the `custom_users` table in your Supabase project.

1.  Go to the [Supabase Dashboard](https://supabase.com/dashboard).
2.  Open your project.
3.  Go to the **SQL Editor** (Icon on the left).
4.  Copy the content of `frontend/custom_auth.sql` (or see below) and run it.

```sql
create table custom_users (
  id uuid default uuid_generate_v4() primary key,
  email text unique not null,
  password_hash text not null,
  full_name text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table custom_users enable row level security;

create policy "Allow all for now"
  on custom_users for all
  using (true)
  with check (true);
```

## 3. Running
```bash
npm install
node index.js
```
