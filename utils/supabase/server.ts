import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

function sanitizeSupabaseUrl(url?: string): string {
  if (!url) return "";
  let clean = url.trim();
  clean = clean.replace(/\/rest\/v1\/?$/, "");
  clean = clean.replace(/\/+$/, "");
  return clean;
}

const supabaseUrl = sanitizeSupabaseUrl(process.env.NEXT_PUBLIC_SUPABASE_URL);
const supabaseKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const createClient = (cookieStore: Awaited<ReturnType<typeof cookies>>) => {
  return createServerClient(
    supabaseUrl!,
    supabaseKey!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet: Array<{ name: string; value: string; options?: unknown }>) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              // @ts-expect-error cookie options parameter
              cookieStore.set(name, value, options);
            });
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    },
  );
};
