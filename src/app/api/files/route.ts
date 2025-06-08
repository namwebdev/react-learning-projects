import { USER_ID } from "@/configs/constants";
import { db } from "@/lib/db";
import { files } from "@/lib/db/schema";
import { and, eq, isNull } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

const userId = USER_ID

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const queryUserId = searchParams.get("userId");
        const parentId = searchParams.get("parentId");

        if (!queryUserId || queryUserId !== userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        let userFiles = parentId
            ? await db.select().from(files).where(and(eq(files.parentId, parentId), eq(files.userId, userId)))
            : await db.select().from(files).where(and(eq(files.userId, userId), isNull(files.parentId)));

        return NextResponse.json(userFiles);
    } catch (error) {
        console.error("Error fetching files:", error);
        return NextResponse.json(
            { error: "Failed to fetch files" },
            { status: 500 }
        );
    }
}