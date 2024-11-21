import { NextResponse } from "next/server";
import { auth } from "./auth";
import { ROUTES } from "./constants/routes";

const publicRoutes = [ROUTES.home, ROUTES.registerSuccess, ROUTES.verifyEmail];
const privateRoutes = [ROUTES.login, ROUTES.register];

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;

  const isPublic = publicRoutes.includes(nextUrl.pathname);
  const isAuthRoute = privateRoutes.includes(nextUrl.pathname);

  if (isPublic) return NextResponse.next();

  if (isAuthRoute) {
    if (isLoggedIn)
      return NextResponse.redirect(new URL(ROUTES.member, nextUrl));
    return NextResponse.next();
  }

  if (!isPublic && !isLoggedIn)
    return NextResponse.redirect(new URL(ROUTES.login, nextUrl));

  return NextResponse.next();
});

/**
 * This is a regular expression that will match any URL path
 * that does not start with /api, /_next/static, /_next/image, or favicon.ico.
 */
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
