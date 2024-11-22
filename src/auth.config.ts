import { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { loginSchema } from "./schemas";
import { getUserByEmail } from "./actions/auth.action";
import { compare } from "bcryptjs";

export default {
  providers: [
    Credentials({
      name: "credentials",
      async authorize(credentials) {
        const validated = loginSchema.safeParse(credentials);

        if (!validated.success) return null;

        const { email, password } = validated.data;
        const user = await getUserByEmail(email);
        if (
          user &&
          user.passwordHash &&
          (await compare(password, user.passwordHash))
        )
          return user;

        return null;
      },
    }),
  ],
  trustHost: true,
} satisfies NextAuthConfig;
