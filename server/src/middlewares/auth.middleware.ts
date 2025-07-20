import type { MiddlewareHandler } from 'hono';
import jwt from "jsonwebtoken";
import type { JwtPayload } from "jsonwebtoken";
import type { Context, Next } from 'hono';
import type { ROLES } from '@/constants.js';

interface DecodedToken extends JwtPayload {
    sub: string;
    "custom:role"?: string;
}

declare global {
    namespace Express {
        interface Request {
            user?: {
                id: string;
                role: string;
            };
        }
    }
}

export const authMiddleware = (allowedRoles: typeof ROLES[keyof typeof ROLES][]) => {
    return (async (c: Context, next: Next) => {
        const token = c.req.header('authorization')?.split(" ")[1];
        if (!token) {
            return c.json({ message: "Unauthorized" }, 401);
        }

        try {
            const decoded = jwt.decode(token) as DecodedToken;
            const userRole = decoded["custom:role"] || "";
            c.set('user', {
                id: decoded.sub,
                role: userRole,
            });

            const hasAccess = allowedRoles.some(role => role.toLowerCase() === userRole.toLowerCase());
            if (!hasAccess) {
                return c.json({ message: "Access Denied" }, 403);
            }
        } catch (err) {
            console.error("------------ Failed to decode token");
            return c.json({ message: "Invalid token" }, 400);
        }

        return next();
    }) as MiddlewareHandler
};
