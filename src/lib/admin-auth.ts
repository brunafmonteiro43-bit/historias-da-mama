import type { User } from '@supabase/supabase-js';
import { redirect } from 'next/navigation';
import { getSupabaseConfig } from './supabase/env';
import { createServerSupabaseClient } from './supabase/server';

type AdminContext = {
  supabase: ReturnType<typeof createServerSupabaseClient>;
  user: User;
};

export async function getAdminContext(): Promise<AdminContext | null> {
  if (!getSupabaseConfig().isConfigured) {
    return null;
  }

  const supabase = createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data: isAdmin, error } = await supabase.rpc('is_admin');

  if (error || isAdmin !== true) {
    return null;
  }

  return { supabase, user };
}

export async function requireAdmin() {
  const context = await getAdminContext();

  if (!context) {
    redirect('/admin');
  }

  return context;
}

export async function redirectAdminToDashboard() {
  const context = await getAdminContext();

  if (context) {
    redirect('/admin/dashboard');
  }
}
