import { ROUTES } from "@/constants";
import { DefaultSession, NextAuthConfig } from "next-auth";
import { JWT } from "next-auth/jwt";
import GitHub from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import { z } from "zod";
import { db } from "@/db";
import { eq } from "drizzle-orm";
import { users, accounts, sessions, verificationTokens } from "@/db/schema";
import bcrypt from "bcryptjs";
import { DrizzleAdapter } from "@auth/drizzle-adapter";

declare module "next-auth" {
    interface User {
        role?: "user" | "admin";
    }

    interface Session {
        user: {
            id: string;
            role?: "user" | "admin";
        } & DefaultSession["user"];
    }
}
declare module "next-auth/jwt" {
    interface JWT {
        role?: "user" | "admin";
    }
}

export const authConfig: NextAuthConfig = {
    secret: process.env.AUTH_SECRET,
    adapter: DrizzleAdapter(db, {
        usersTable: users as any,
        accountsTable: accounts as any,
        sessionsTable: sessions as any,
        verificationTokensTable: verificationTokens as any,
    }),
    pages: {
        signIn: ROUTES.login,
        signOut: ROUTES.signOut,
        error: ROUTES.login,
        verifyRequest: ROUTES.verifyRequest,
        newUser: ROUTES.register,
    },
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;
            const isOnDashboard = nextUrl.pathname.startsWith(ROUTES.dashboard);
            if (isOnDashboard) {
                if (isLoggedIn) return true;
                return false;
            }

            if (isOnDashboard) return true;

            return true;
        },
        jwt: async ({ token, user }) => {
            if (user) {
                token.id = user.id;
                token.email = user.email;
                token.name = user.name;
                token.picture = user.image;
                token.role = user.role;
            }
            return token;
        },
        session: async ({ session, token }) => {
            if (token) {
                session.user.id = token.id as string;
                session.user.role = token.role;
            }
            return session;
        },
    },
    providers: [
        GitHub({
            clientId: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
        }),
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: {
                    label: "Email",
                    type: "email",
                    placeholder: "example@exmple.com",
                },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                const parsedCredentials = z
                    .object({
                        email: z.string().email(),
                        password: z.string().min(6),
                    })
                    .safeParse(credentials);

                if (!parsedCredentials.success) return null;

                const { email, password } = parsedCredentials.data;

                const user = await db.query.users.findFirst({
                    where: eq(users.email, email),
                });
                if (!user) return null;

                const passwordsMatch = await bcrypt.compare(
                    password,
                    user.password || ""
                );
                if (!passwordsMatch) return null;

                return {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    image: user.image,
                    role: user.role,
                };
            },
        }),
    ],

}