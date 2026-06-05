-- Fix Workspace Creation Policy

-- The previous policy: 
-- create policy "Users can create workspaces" on workspaces for insert with check (auth.uid() = owner_id);
-- This is correct, but sometimes fails if the user context isn't perfectly set or if the trigger runs before RLS.

-- Let's ensure the user can also select their own created workspace immediately (often needed for the returning clause)

drop policy if exists "Users can create workspaces" on workspaces;

create policy "Users can create workspaces" on workspaces
  for insert with check (
    auth.uid() = owner_id
  );

-- Ensure authenticated users can actually Insert
grant insert on table workspaces to authenticated;
grant insert on table workspace_members to authenticated;

-- Also check if the 'public' schema usage needs explicit grants (Supabase defaults usually handle this, but good to be sure)
grant usage on schema public to authenticated;
grant all on all tables in schema public to authenticated;
grant all on all sequences in schema public to authenticated;

-- Fix for "Users can view workspaces they are members of" potentially blocking the INSERT ... RETURNING
-- When you insert, RLS checks if you *can* see the new row.
-- The previous policy relied on 'is_workspace_member(id)'.
-- BUT, the member row hasn't been created yet when we create the workspace!
-- So the user creates the workspace, but RLS says "You aren't a member yet" (because the next step is adding membership), 
-- so it blocks the "RETURNING *" part of the insert.

-- We need a policy that allows the OWNER to view the workspace they just created, even before they are a member.
drop policy if exists "Users can view workspaces they are members of" on workspaces;

create policy "Users can view workspaces" on workspaces
  for select using (
    is_workspace_member(id) 
    OR 
    owner_id = auth.uid() -- Allow owner to see it immediately
  );
