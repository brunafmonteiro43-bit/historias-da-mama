'use client';

import { createBrowserClient } from '@supabase/ssr';
import { assertSupabaseConfig } from './env';

export function createBrowserSupabaseClient() {
  const { anonKey, url } = assertSupabaseConfig();

  return createBrowserClient(url, anonKey);
}
