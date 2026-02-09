-- Allow Superadmins to update any profile (e.g., to approve/reject admins)
create policy "Superadmins can update any profile." 
  on profiles for update using (
    exists (select 1 from profiles where id = auth.uid() and role = 'superadmin')
  );

-- Allow Superadmins to delete profiles (if needed for cleanup)
create policy "Superadmins can delete any profile." 
  on profiles for delete using (
    exists (select 1 from profiles where id = auth.uid() and role = 'superadmin')
  );
