import { createBrowserClient } from '@supabase/ssr';
import { getSupabaseConfigOrThrow } from './config';

export function createClient() {
  const config = getSupabaseConfigOrThrow();

  return createBrowserClient(config.url, config.publishableKey);
}
