import { USER_ID } from "@/configs/constants";
import { db } from "@/lib/db";
import { and, eq } from "drizzle-orm";
import { files } from "@/lib/db/schema";
import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

const userId = USER_ID
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { name, userId: bodyUserId, parentId = null } = body;

        if (bodyUserId !== userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        if (!name || typeof name !== "string" || name.trim() === "") {
            return NextResponse.json(
                { error: "Folder name is required" },
                { status: 400 }
            );
        }

        if (parentId) {
            const [parentFolder] = await db
                .select()
                .from(files)
                .where(
                    and(
                        eq(files.id, parentId),
                        eq(files.userId, userId),
                        eq(files.isFolder, true)
                    )
                );

            if (!parentFolder) {
                return NextResponse.json(
                    { error: "Parent folder not found" },
                    { status: 404 }
                );
            }
        }

        const [newFolder] = await db.insert(files).values({
            id: uuidv4(),
            name: name.trim(),
            path: `/folders/${userId}/${uuidv4()}`,
            size: 0,
            type: "folder",
            fileUrl: "",
            thumbnailUrl: null,
            userId,
            parentId,
            isFolder: true,
            isStarred: false,
            isTrash: false,
        }).returning();

        return NextResponse.json({
            success: true,
            message: "Folder created successfully",
            folder: newFolder,
        });
    } catch (error) {
        console.error("Error creating folder:", error);
        return NextResponse.json({ error: "Failed to create folder" }, { status: 500 });
    }
}