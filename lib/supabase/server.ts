import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { getSupabaseConfigOrThrow } from './config';

export async function createClient() {
  const cookieStore = cookies();
  const config = getSupabaseConfigOrThrow();
  type CookieOptions = Parameters<typeof cookieStore.set>[2];

  return createServerClient(
    config.url,
    config.publishableKey,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options?: CookieOptions }[]) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Server Component cookie mutation catch
          }
        },
      },
    }
  );
}
