"use server";

import { auth, signIn, signOut } from "@/auth";
import { ROUTES } from "@/constants/routes";
import { sendVerificationEmail } from "@/lib/mail";
import { prisma } from "@/lib/prisma";
import { generateToken, getTokenByToken } from "@/lib/token";
import { LoginSchema, registerSchema, RegisterSchema } from "@/schemas";
import { ActionResult } from "@/types";
import { User } from "@prisma/client";
import bcrypt from "bcryptjs";
import { AuthError } from "next-auth";

export async function register(
  data: RegisterSchema
): Promise<ActionResult<User>> {
  try {
    const validated = registerSchema.safeParse(data);
    console.log("🚀 ~ validated:", validated);
    if (!validated.success)
      return { status: "error", error: validated.error.errors };

    const { name, email, password } = validated.data;

    const existingUser = await getUserByEmail(email);
    if (existingUser)
      return { status: "error", error: "Email already in use!" };

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash: hashedPassword,
      },
    });

    const { email: emailForVerification, token } = await generateToken(
      email,
      "VERIFICATION"
    );
    await sendVerificationEmail(emailForVerification, token);

    return { status: "success", data: user };
  } catch (error) {
    console.error("auth.action - register ~ error:", error);
    return { status: "error", error: "Something went wrong" };
  }
}

export async function verifyToken(
  token: string
): Promise<ActionResult<string>> {
  const existingToken = await getTokenByToken(token);

  if (!existingToken) {
    return { status: "error", error: "Invalid token" };
  }

  const hasExpired = new Date() > existingToken.expires;
  if (hasExpired) {
    return { status: "error", error: "Token has expired" };
  }

  const existingUser = await getUserByEmail(existingToken.email);
  if (!existingUser) {
    return { status: "error", error: "User not found" };
  }

  await prisma.user.update({
    where: { id: existingUser.id },
    data: { emailVerified: new Date() },
  });
  await prisma.token.delete({ where: { id: existingToken.id } });

  return { status: "success", data: existingUser.id };
}

export async function login(data: LoginSchema): Promise<ActionResult<string>> {
  try {
    const existingUser = await getUserByEmail(data.email);
    if (!existingUser || !existingUser.email)
      return { status: "error", error: "Invalid credentials" };

    await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });

    return { status: "success", data: "Logged in" };
  } catch (error) {
    console.error("auth.action - signIn ~ error: ", error);
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { status: "error", error: "Invalid credentials" };
        default:
          return { status: "error", error: "Something went wrong" };
      }
    }

    return { status: "error", error: "Something else went wrong" };
  }
}

export async function getAuthUserId() {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) throw new Error('Unauthorized');

  return userId;
}

export async function logout() {
  await signOut({ redirectTo: ROUTES.login });
}

export async function getUserByEmail(email: string) {
  return prisma.user.findUnique({ where: { email } });
}
