export type SupabaseConfig = {
  url: string;
  publishableKey: string;
};

export class MissingSupabaseConfigError extends Error {
  constructor() {
    super(
      'Supabase is not configured. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY (or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY) in your .env.local file.',
    );
    this.name = 'MissingSupabaseConfigError';
  }
}

function isPlaceholder(value: string) {
  if (!value || typeof value !== 'string') return true;
  const trimmed = value.trim();
  if (trimmed.length < 10) return true;
  const normalized = trimmed.toLowerCase();
  return (
    normalized.includes('placeholder') ||
    normalized.includes('your-project-ref') ||
    normalized.includes('your-publishable-key') ||
    normalized.includes('your-anon-key')
  );
}

export function getSupabaseConfig(): SupabaseConfig | null {
  // Explicit literal property access required for Next.js client-side Webpack inlining
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const publishableKey =
    (process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
     process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)?.trim();

  if (!url || !publishableKey || isPlaceholder(url) || isPlaceholder(publishableKey)) {
    return null;
  }

  return {
    url,
    publishableKey,
  };
}

export function isSupabaseConfigured() {
  return getSupabaseConfig() !== null;
}

export function getSupabaseConfigOrThrow() {
  const config = getSupabaseConfig();

  if (!config) {
    throw new MissingSupabaseConfigError();
  }

  return config;
}
