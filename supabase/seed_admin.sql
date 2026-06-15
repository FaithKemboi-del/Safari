-- Run AFTER creating the admin auth user (see scripts/seed-admin-user.mjs)
-- Marks fchepkosgei21@gmail.com as admin in profiles

update public.profiles
set
  is_admin = true,
  full_name = coalesce(full_name, 'Safari Admin'),
  updated_at = now()
where id = (
  select id
  from auth.users
  where lower(email) = lower('fchepkosgei21@gmail.com')
  limit 1
);
