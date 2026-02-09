-- Create a function to delete the auth user when the public profile is deleted
create or replace function public.delete_auth_user()
returns trigger
language plpgsql
security definer
as $$
begin
  delete from auth.users where id = old.id;
  return old;
end;
$$;

-- Create a trigger to execute the function after deletion on profiles
drop trigger if exists on_profile_deleted on public.profiles;
create trigger on_profile_deleted
  after delete on public.profiles
  for each row execute procedure public.delete_auth_user();
