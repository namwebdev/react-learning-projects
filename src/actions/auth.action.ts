"use server";

import { supabaseServerClient } from "@/lib/supabase/supabase.server";

export async function signInWithEmail(email: string) {
  const supabase = await supabaseServerClient();

  const response = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: process.env.NEXT_PUBLIC_SITE_URL,
    },
  });

  return JSON.parse(JSON.stringify(response));
}
