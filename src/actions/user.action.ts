"use server";

import { ActionResult } from "@/types";
import { prisma } from "@/lib/prisma";
import { getAuthUserId } from "./auth.action";
import { auth } from "@/auth";
import { ProfileSchema } from "@/schemas";

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

export async function updateUserInfo(
  data: ProfileSchema
): Promise<ActionResult<string>> {
  const session = await auth();
  if (!session?.user) return { status: "error", error: "User not found" };

  try {
    const user = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        profileComplete: true,
        member: {
          create: {
            name: session.user.name as string,
            image: session.user.image,
            gender: data.gender,
            dateOfBirth: new Date(data.dateOfBirth),
            description: data.description || "",
            city: data.city,
            country: data.country,
          },
        },
      },
      // select: {
      //   accounts: {
      //     select: {
      //       provider: true,
      //     },
      //   },
      // },
    });
    console.log("🚀 ~ user:", user);

    return { status: "success", data: "ok" };
  } catch (error) {
    console.error("🚀 ~ updateUserInfo ~ error:", error);
    throw error;
  }
}

export async function addImage(imageUrl: string, publicId: string) {
  try {
    const userId = await getAuthUserId();
    console.log(await auth());
    return await prisma.member.update({
      where: { userId },
      data: {
        photos: {
          create: [
            {
              url: imageUrl,
              publicId,
            },
          ],
        },
      },
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function getMemberPhotoByUserId() {
  const currentUserId = await getAuthUserId();
  const member = await prisma.member.findUnique({
    where: { userId: currentUserId },
    select: {
      // photos: { where: currentUserId === userId ? {} : { isApproved: true } },
      photos: {},
    },
  });
  if (!member) return null;

  return member.photos.map((p) => p)[0];
}
