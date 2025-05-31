import { type CookieOptions, createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { ROUTES } from "@/constants";
import env from "@/env";
import { db } from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams, origin } = new URL(req.url);
  const code = searchParams.get("code");

  if (!code) return NextResponse.redirect(`${origin}/${ROUTES.authError}`);

  const cookie = await cookies();
  const supabase = createServerClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
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

  const supabaseUserData = (await supabase.auth.getUser()).data.user;
  if (!supabaseUserData)
    return NextResponse.redirect(`${origin}/${ROUTES.authError}`);

  const existingUser = await db.user.findUnique({
    where: { supabaseUserId: supabaseUserData.id },
  });
  if (existingUser) return NextResponse.redirect(`${origin}`);

  const { id, user_metadata } = supabaseUserData;
  await db.user.create({
    data: {
      supabaseUserId: id,
      email: user_metadata.email,
      name: user_metadata.full_name,
      imageUrl: user_metadata.avatar_url,
      phone: user_metadata.phone || "",
    },
  });

  return NextResponse.redirect(`${origin}`);
}
