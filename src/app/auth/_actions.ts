"use server";

import { supabaseServerClient } from "@/lib/supabase/supabase.server";
import { Provider } from "@supabase/supabase-js";

export async function login(provider: Provider) {
    const supabase = await supabaseServerClient();
    await supabase.auth.signInWithOAuth({
        provider,
        options: {
            redirectTo: `${location.origin}/auth/callback`,
        },
    });
}