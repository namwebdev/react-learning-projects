import { USER_ID } from "@/configs/constants";
import { db } from "@/lib/db";
import { files } from "@/lib/db/schema";
import imagekit from "@/lib/imageKit";
import { and, eq } from "drizzle-orm";
import { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

export async function POST(request: NextRequest) {
    try {
        const userId = USER_ID
        const formData = await request.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return NextResponse.json({ error: "No file provided" }, { status: 400 });
        }

        const formUserId = formData.get("userId") as string;
        if (formUserId !== userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const parentId = (formData.get("parentId") as string) || null;

        if (parentId) {
            const [parentFolder] = await db.select().from(files).where(and(
                eq(files.id, parentId),
                eq(files.userId, userId),
                eq(files.isFolder, true)
            ))

            if (!parentFolder) return NextResponse.json(
                { error: "Parent folder not found" },
                { status: 404 }
            );
        }

        if (!file.type.startsWith("image/") && file.type !== "application/pdf")
            return NextResponse.json(
                { error: "Only image files are supported" },
                { status: 400 }
            );


        const buffer = await file.arrayBuffer();
        const fileBuffer = Buffer.from(buffer);

        const originalFilename = file.name;
        const fileExtension = originalFilename.split(".").pop() || "";
        const uniqueFilename = `${uuidv4()}.${fileExtension}`;

        const folderPath = parentId
            ? `/droply/${userId}/folders/${parentId}`
            : `/droply/${userId}`;

        const uploadResponse = await imagekit.upload({
            file: fileBuffer,
            fileName: uniqueFilename,
            folder: folderPath,
            useUniqueFileName: false,
        });

        const [newFile] = await db.insert(files).values({
            name: originalFilename,
            path: uploadResponse.filePath,
            size: file.size,
            type: file.type,
            fileUrl: uploadResponse.url,
            thumbnailUrl: uploadResponse.thumbnailUrl || null,
            userId: userId,
            parentId: parentId,
            isFolder: false,
            isStarred: false,
            isTrash: false,
        }).returning();
        return NextResponse.json(newFile);
    } catch (error) {
        console.error("Error uploading file:", error);
        return NextResponse.json(
            { error: "Failed to upload file" },
            { status: 500 }
        );
    }
}