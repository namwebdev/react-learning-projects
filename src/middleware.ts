import { NextResponse, type NextRequest } from "next/server";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { ROUTES } from "./constants";
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";

const authRoutes: string[] = [ROUTES.login];
const protectedRoutes: string[] = [ROUTES.dashboard, ROUTES.createWorkspace];

export async function middleware(request: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req: request, res });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (authRoutes.includes(request.nextUrl.pathname)) {
    if (session)
      return NextResponse.redirect(new URL(ROUTES.home, request.url));
  }

  if (protectedRoutes.includes(request.nextUrl.pathname)) {
    if (!session)
      return NextResponse.redirect(new URL(ROUTES.login, request.url));
  }

  return res;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
