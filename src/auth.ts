import { PrismaAdapter } from "@auth/prisma-adapter";
import { PrismaClient, User, Role } from "@prisma/client";
import NextAuth from "next-auth";
import authConfig from "./auth.config";

const prisma = new PrismaClient();

export const { auth, signIn, signOut } = NextAuth({
  callbacks: {
    async jwt({ user, token }) {
      if (user) {
        token.profileComplete = (user as User).profileComplete;
        token.role = (user as User).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
        (session.user as User).profileComplete =
          token.profileComplete as boolean;
        (session.user as User).role = token.role as Role;
      }

      return session;
    },
  },
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  ...authConfig,
});
