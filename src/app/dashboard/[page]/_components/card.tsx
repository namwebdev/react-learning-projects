"use client"

import { IFile } from "@/lib/database/schemas/file.model";
import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { P } from "@/components/custom/p";
import FileMenu from "./menu";
import { formatFileSize } from "@/lib/utils";

export const FileCard = ({ file }: { file: IFile }) => {
    const [isLinkInProgress, setIsLinkInProgress] = useState(false);

    const { name, size, createdAt, userInfo, category } = file;
    const formattedFileSize = formatFileSize(size);

    return (
        <Card className="w-full max-h-60 border-none shadow-none drop-shadow-xl">
            <CardHeader>
                <div className="flex items-start gap-4 justify-between">
                    <Avatar className="size-20 rounded-none">
                        <AvatarImage src={`/${category}.png`} />
                        <AvatarFallback>{name.slice(0, 2)}</AvatarFallback>
                    </Avatar>
                    <P>{name}</P>
                    <div className="flex flex-col items-end gap-4 justify-between w-full">
                        <FileMenu
                            file={file}
                            isLinkInProgress={isLinkInProgress}
                            setIsLinkInProgress={setIsLinkInProgress}
                        />

                        <P weight={"light"}>{formattedFileSize}</P>
                    </div>
                </div>
            </CardHeader>
        </Card>
    )

}

