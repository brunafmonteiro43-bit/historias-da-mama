'use client';

import { LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { createBrowserSupabaseClient } from '@/lib/supabase/client';

export function AdminLogoutButton() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  async function handleLogout() {
    setIsLoading(true);
    const supabase = createBrowserSupabaseClient();
    await supabase.auth.signOut();
    router.replace('/hm-admin');
    router.refresh();
  }

  return (
    <button
      className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-black text-ink shadow-sm transition hover:-translate-y-0.5 disabled:opacity-60"
      disabled={isLoading}
      onClick={handleLogout}
      type="button"
    >
      <LogOut className="h-4 w-4" />
      Sair
    </button>
  );
}
