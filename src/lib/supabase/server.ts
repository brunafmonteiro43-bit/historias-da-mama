import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { assertSupabaseConfig } from './env';

export function createServerSupabaseClient() {
  const { anonKey, url } = assertSupabaseConfig();
  const cookieStore = cookies();

  return createServerClient(url, anonKey, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value;
      },
      set(name: string, value: string, options: CookieOptions) {
        try {
          cookieStore.set({ name, value, ...options });
        } catch {
          // Server Components cannot set cookies. Middleware and Server Actions can.
        }
      },
      remove(name: string, options: CookieOptions) {
        try {
          cookieStore.set({ name, value: '', ...options });
        } catch {
          // Server Components cannot set cookies. Middleware and Server Actions can.
        }
      },
    },
  });
}
