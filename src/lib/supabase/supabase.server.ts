"use server"

import { type CookieOptions, createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import env from "@/env";

export async function supabaseServerClient() {
  const cookieStore = cookies();

  const supabase = createServerClient(
    env.NEXT_PUBLIC_SUPABASE_URL!,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        async get(name: string) {
          const cookies = await cookieStore;
          return cookies.get(name)?.value;
        },
        async set(name: string, value: string, options: CookieOptions) {
          const cookies = await cookieStore;
          cookies.set({ name, value, ...options });
        },
        async remove(name: string, options: CookieOptions) {
          const cookies = await cookieStore;
          cookies.delete(name);
        },
      },
    }
  );

  return supabase;
}
