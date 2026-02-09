-- Ensure the profiles table handles the superadmin role
-- Checks if the profiles table exists and has the correct structure (it should based on previous steps)

-- Create a function to handle new user signup (if not already exists)
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, role, status)
  values (new.id, new.email, new.raw_user_meta_data ->> 'full_name', 'admin', 'pending');
  return new;
end;
$$;

-- Trigger the function every time a user is created
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- INSTRUCTIONS TO CREATE A SUPERADMIN:
-- 1. Sign up a new user via the App's Register page normally.
-- 2. Run this SQL command in Supabase SQL Editor to upgrade that user and confirm their email:

-- UPDATE auth.users
-- SET email_confirmed_at = now()
-- WHERE email = 'aldyalfiansyah@upi.edu';

-- UPDATE public.profiles
-- SET role = 'superadmin', status = 'approved'
-- WHERE email = 'aldyalfiansyah@upi.edu';
