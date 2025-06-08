import { type CookieOptions, createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function supabaseServerClient() {
  const cookieStore = cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        async get(name: string) {
          const store = await cookieStore;
          return store.get(name)?.value;
        },
        async set(name: string, value: string, options: CookieOptions) {
          const store = await cookieStore;
          store.set({ name, value, ...options });
        },
        async remove(name: string, options: CookieOptions) {
          const store = await cookieStore;
          store.set({ name, value: "", ...options });
        },
      },
    }
  );

  return supabase;
}
