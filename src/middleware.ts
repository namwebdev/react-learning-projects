import { NextRequest, NextResponse } from "next/server";
import { Session } from "./lib/auth/auth-types";

async function getMiddlewareSession(req: NextRequest) {
    const response = await fetch(`${req.nextUrl.origin}/api/auth/get-session`, {
        headers: {
            cookie: req.headers.get("cookie") || "",
        },
    });

    if (!response.ok) {
        console.error(response.statusText)
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    const session: Session = await response.json();

    return session;
}

export default async function authMiddleware(req: NextRequest) {
    const session = await getMiddlewareSession(req);
    const pathname = req.nextUrl.pathname
    const url = req.url

    if (pathname === "/") {
        return NextResponse.redirect(new URL("/dashboard", url))
    }

    if (pathname.startsWith("/dashboard")) {
        if (session) {
            return NextResponse.next()
        }

        return NextResponse.redirect(new URL("/sign-in", url))
    }

    if (pathname.startsWith("/sign-")) {
        if (!session) {
            return NextResponse.next()
        }

        return NextResponse.redirect(new URL("/dashboard", url))
    }

    return NextResponse.next();
}
export const config = {
    matcher: [
        // Skip Next.js internals and all static files, unless found in search params
        "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
        // Always run for API routes
        "/(api|trpc)(.*)",
    ],
};
