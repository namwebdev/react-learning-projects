import { type CookieOptions, createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { ROUTES } from "@/constants";

export async function GET(req: Request) {
  const { searchParams, origin } = new URL(req.url);
  const code = searchParams.get("code");

  if (!code) return NextResponse.redirect(`${origin}/${ROUTES.authError}`);

  const cookie = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name) => cookie.get(name)?.value,
        set(name: string, value: string, options: CookieOptions) {
          cookie.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          cookie.delete({ name, ...options });
        },
      },
    }
  );

  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) return NextResponse.redirect(`${origin}/${ROUTES.authError}`);

  return NextResponse.redirect(`${origin}`);
}
