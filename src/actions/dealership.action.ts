"use server";

import { db } from "@/lib/prisma";

export async function getDealerships() {
    const dealerships = await db.dealershipInfo.findMany({
        include: {
            workingHours: true,
        },
    });
    return dealerships;
}
