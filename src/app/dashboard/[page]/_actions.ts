"use server";

import { getServerSession } from "@/actions/auth.action";
import db from "@/lib/database/db";
import { File, IFile } from "@/lib/database/schemas/file.model";
import { pinata } from "@/lib/pinata";
import { ActionResponse, parseError } from "@/lib/utils";
import { TRenameFileForm, TShareFileForm } from "./_types";

const FILE_SIZE = 9;
export async function getFiles({
    page,
    currentPage,
}: {
    page: string;
    currentPage: number;
}) {
    await db();

    const category = page.endsWith("s") ? page.slice(0, -1) : page;

    const session = await getServerSession();
    if (!session) {
        return { files: [] };
    }

    const {
        user: { id: userId },
    } = session;

    const totalFiles = await File.countDocuments({
        "userInfo.id": userId,
        category,
    });
    const files = await File.find({ "userInfo.id": userId, category })
        .skip((currentPage - 1) * FILE_SIZE)
        .limit(FILE_SIZE)
        .sort({ createdAt: -1 })
        .lean();

    return {
        status: 200,
        files: files,
        total: totalFiles,
        currentPage,
        totalPages: Math.ceil(totalFiles / FILE_SIZE),
    };
}

export async function renameFile({ file, values }: { file: IFile; values: TRenameFileForm }) {
    try {
        await db();

        const { pinataId } = file;
        const { name } = values;
        const updatedFile = await File.findOneAndUpdate(
            { pinataId },
            { name },
            { new: true } // Return the updated document
        );
        return ActionResponse({
            message: "Rename Successful",
            description: `New name: ${name}`,
            status: 200,
            file: updatedFile,
        });
    } catch (error) {
        console.error("Error renaming file", error);
        return ActionResponse({
            message: "Error renaming file",
            description: "Please try again",
            status: 500,
            file: null,
        });
    }
}

export async function deleteFile(file: IFile) {
    await db();

    const { pinataId, category, _id } = file;

    await pinata.files.delete([pinataId]);

    await File.deleteOne({ pinataId });

    return { status: 200, category, fileId: _id };
}

export async function updateFilePermissions(file: IFile, values: TShareFileForm) {
    try {
        await db();

        const { pinataId } = file;
        const newPermission = {
            email: values.email,
            permissions: values.permissions,
        };

        const dbFiles = (await File.findOne({ pinataId })) as IFile;

        const { sharedWith } = dbFiles;
        const allPermission = sharedWith.filter(
            ({ email }) => email !== values.email
        );

        const permissionToSave = [...allPermission, newPermission];
        await File.updateOne(
            { pinataId },
            {
                $set: {
                    sharedWith: permissionToSave,
                },
            }
        );

        return {
            message: `Shared with ${values.email}`,
            description: `${values.permissions}`,
            status: 200,
        };
    } catch (error) {
        console.error("Error in updating files: ", error);
        const err = parseError(error);

        return {
            message: "Error",
            description: err,
            status: 500,
        };
    }
}