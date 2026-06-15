#!/usr/bin/env node
/**
 * Creates or updates the Safari admin user in Supabase Auth.
 *
 * Usage (from project root):
 *   SUPABASE_URL=https://xxx.supabase.co \
 *   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key \
 *   node scripts/seed-admin-user.mjs
 *
 * Then run supabase/seed_admin.sql in the SQL Editor to set is_admin = true.
 */

import { createClient } from '@supabase/supabase-js';

const ADMIN_EMAIL = 'fchepkosgei21@gmail.com';
const ADMIN_PASSWORD = 'Affrdablekenya254';
const ADMIN_NAME = 'Safari Admin';

const url = process.env.SUPABASE_URL ?? process.env.VITE_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.error(
    'Missing SUPABASE_URL (or VITE_SUPABASE_URL) and SUPABASE_SERVICE_ROLE_KEY environment variables.',
  );
  process.exit(1);
}

const supabase = createClient(url, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function findUserByEmail(email) {
  let page = 1;
  const perPage = 200;

  while (true) {
    const { data, error } = await supabase.auth.admin.listUsers({ page, perPage });
    if (error) {
      throw error;
    }

    const match = data.users.find((user) => user.email?.toLowerCase() === email.toLowerCase());
    if (match) {
      return match;
    }

    if (data.users.length < perPage) {
      return null;
    }

    page += 1;
  }
}

async function main() {
  const existing = await findUserByEmail(ADMIN_EMAIL);

  let userId = existing?.id;

  if (existing) {
    const { error } = await supabase.auth.admin.updateUserById(existing.id, {
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
      email_confirm: true,
      user_metadata: { full_name: ADMIN_NAME },
    });

    if (error) {
      throw error;
    }

    console.log(`Updated admin user: ${ADMIN_EMAIL}`);
    console.log(`User id: ${existing.id}`);
  } else {
    const { data, error } = await supabase.auth.admin.createUser({
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
      email_confirm: true,
      user_metadata: { full_name: ADMIN_NAME },
    });

    if (error) {
      throw error;
    }

    userId = data.user.id;
    console.log(`Created admin user: ${ADMIN_EMAIL}`);
    console.log(`User id: ${data.user.id}`);
  }

  if (userId) {
    const { error: profileError } = await supabase.from('profiles').upsert(
      {
        id: userId,
        full_name: ADMIN_NAME,
        is_admin: true,
        avatar_initials: 'SA',
      },
      { onConflict: 'id' },
    );

    if (profileError) {
      console.warn('Could not upsert profile via API (run seed_admin.sql if needed):', profileError.message);
    } else {
      console.log('Profile marked is_admin = true.');
    }
  }

  console.log('\nDone. Sign in at #admin-login with the admin email and password.');
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
