export function getSupabaseConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  return {
    anonKey,
    isConfigured: Boolean(url && anonKey),
    url,
  };
}

export function assertSupabaseConfig() {
  const config = getSupabaseConfig();

  if (!config.url || !config.anonKey) {
    throw new Error('Configure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.');
  }

  return { url: config.url, anonKey: config.anonKey };
}
