"use server"

import { GetMemberParams, PaginatedResponse } from "@/types";
import { Member } from "@prisma/client";
import { getAuthUserId } from "./auth.action";
import { addYears } from "date-fns";
import { prisma } from "@/lib/prisma";

export async function getMembers({
  ageRange = "18,100",
  gender = "male,female",
  orderBy = "updated",
  pageNumber = "1",
  pageSize = "12",
  withPhoto = "true",
}: GetMemberParams): Promise<PaginatedResponse<Member>> {
  const userId = await getAuthUserId();
  const [minDob, maxDob] = getAgeRange(ageRange);

  const page = parseInt(pageNumber);
  const limit = parseInt(pageSize);
  const skip = (page - 1) * limit;

  try {
    const count = await prisma.member.count({});
    const members = await prisma.member.findMany({
      orderBy: { [orderBy]: "desc" },
      skip,
      take: limit,
    });
    return {
      items: members,
      totalCount: count,
    };
  } catch (error) {
    console.error("getMembers: ", error);
    throw error;
  }
}

export async function getMemberByUserId(userId: string) {
  try {
    return prisma.member.findUnique({ where: { userId } });
  } catch (error) {
    console.error("🚀 ~ getMemberByUserId ~ error:", error);
  }
}

function getAgeRange(ageRange: string): Date[] {
  const [minAge, maxAge] = ageRange.split(",");
  const currentDate = new Date();
  const minDob = addYears(currentDate, -maxAge - 1);
  const maxDob = addYears(currentDate, -minAge);

  return [minDob, maxDob];
}
