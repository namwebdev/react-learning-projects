"use server"

import { prisma } from "@/lib/prisma";
import { getAuthUserId } from "./auth.action";

export async function getUserInfo() {
  try {
    const userId = await getAuthUserId();
    return prisma.user.findUnique({
      where: { id: userId },
      select: { name: true, image: true },
    });
  } catch (error) {
    console.error("🚀 ~ getUserInfo ~ error:", error);
    throw error;
  }
}
