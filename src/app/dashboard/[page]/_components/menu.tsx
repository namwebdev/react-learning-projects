"use client";

import { paragraphVariants } from "@/components/custom/p";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { IFile } from "@/lib/database/schema/file.model";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

import { cn, parseError } from "@/lib/utils";
import {
    RiDeleteBin7Fill,
    RiFileEditFill,
    RiFolderDownloadFill,
    RiFolderSharedFill,
    RiLoader3Fill,
    RiShareFill,
} from "@remixicon/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Dispatch, ReactNode, SetStateAction, useState } from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import { deleteFile } from "../_actions";
import { KebabMenuIcon } from "./kebab-icon";
import { RenameFileForm } from "./rename-file-form";
import { ConfirmDeleteDialog } from "./confirm-delete-dialog";
import { ShareFileForm } from "./share-file-form";
interface Action {
    name: string;
    icon: ReactNode;
    permissions: "file:read" | "file:update" | "file:delete";
}

const actions: Action[] = [
    {
        name: "Rename",
        icon: <RiFileEditFill />,
        permissions: "file:update",
    },
    {
        name: "Share",
        icon: <RiFolderSharedFill />,
        permissions: "file:read",
    },
    {
        name: "Download",
        icon: <RiFolderDownloadFill />,
        permissions: "file:read",
    },
    {
        name: "Delete",
        icon: <RiDeleteBin7Fill />,
        permissions: "file:delete",
    },
];

const FileMenu = ({
    file,
    isLinkInProgress,
    setIsLinkInProgress,
}: {
    file: IFile;
    isLinkInProgress: boolean;
    setIsLinkInProgress: Dispatch<SetStateAction<boolean>>;
}) => {
    const pathname = usePathname();
    const queryClient = useQueryClient();
    const [isConfirmDeleteDialogOpen, setIsConfirmDeleteDialogOpen] = useState(false);
    const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false);
    const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);


    const mutation = useMutation({
        mutationFn: deleteFile,
        onSuccess: (data) => {
            queryClient.setQueryData(
                ["files", data.category],
                (oldData: { files: IFile[] }) => {
                    const deletedFileId = data.fileId;

                    const updatedFiles = oldData.files.filter(
                        (file) => file._id !== deletedFileId
                    );

                    const updatedData = { ...oldData, files: updatedFiles };

                    return updatedData;
                }
            );

            toast("File Deleted", {
                description: file.name,
            });
        },
        onError: (error) => {
            const err = parseError(error);

            toast("Error", {
                description: `${err}`,
            });
        },
    });
    const onItemClick = (action: Action) => {
        if (action.name === "Rename") {
            setIsRenameDialogOpen(true);
            return
        }

        if (action.name === "Delete") {
            setIsConfirmDeleteDialogOpen(true);
            return
        }

        if (action.name === "Share") {
            setIsShareDialogOpen(true);
            return
        }

    }


    return (
        <>
            <DropdownMenu>
                {!mutation.isPending && !isLinkInProgress ? (
                    <DropdownMenuTrigger className="hover:bg-accent rounded-md p-2">
                        <KebabMenuIcon />
                    </DropdownMenuTrigger>
                ) : (
                    <RiLoader3Fill className="animate-spin" />
                )}
                <DropdownMenuContent className="px-2">
                    <DropdownMenuLabel
                        className={cn(
                            paragraphVariants({ size: "medium", weight: "bold" })
                        )}
                    >
                        Action
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {actions.map((action, i) => (
                        <DropdownMenuItem
                            key={i}
                            className="flex items-center justify-start gap-2 px-3 py-4"
                            onClick={() => onItemClick(action)}
                        >
                            {action.icon}

                            <span
                                className={cn(
                                    paragraphVariants({ size: "small", weight: "medium" })
                                )}
                            >
                                {action.name}
                            </span>
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>

            <RenameFileForm
                file={file}
                isRenameDialogOpen={isRenameDialogOpen}
                setIsRenameDialogOpen={setIsRenameDialogOpen}
            />

            <ConfirmDeleteDialog
                file={file}
                isShow={isConfirmDeleteDialogOpen}
                setIsShow={setIsConfirmDeleteDialogOpen}
            />

            <ShareFileForm
                file={file}
                isShareDialogOpen={isShareDialogOpen}
                setIsShareDialogOpen={setIsShareDialogOpen}
            />
        </>
    );
};








export default FileMenu;
