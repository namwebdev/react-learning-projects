"use client"

import { ChangeEvent, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { IFile } from "@/lib/database/schemas/file.model";
import { toast } from "sonner";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { P } from "@/components/custom/p";
import { Button } from "@/components/ui/button";
import { RiFileAddFill } from "@remixicon/react";
import axios from "axios";

type UploadResponse = {
    category: string;
    file: IFile;
    message?: string;
    description?: string;
};

export const UploadButton = () => {
    const queryClient = useQueryClient();
    const [fileProgress, setFileProgress] = useState<Record<string, number>>({});
    const [isUploading, setIsUploading] = useState(false);

    const mutation = useMutation({
        mutationFn: (file: File) => uploadFile(file, setFileProgress),
        onSuccess: (_newData) => {
            const newData = _newData as UploadResponse;
            
            // Cập nhật cache
            queryClient.setQueryData(
                ["files", (newData).category],
                (oldData: { files: IFile[] }) => {
                    const uploadedFile = newData.file;
                    const oldFile = oldData?.files || [];
                    const newMergeFiles = [uploadedFile, ...oldFile];
                    return { ...oldData, files: newMergeFiles };
                }
            );

            // Thêm dòng này để invalidate query và trigger refetch
            queryClient.invalidateQueries({
                queryKey: ["files", newData.category]
            });

            toast(newData?.message, {
                description: newData?.description,
            });
        },
        onError: (c) => {
            toast(c.name, {
                description: c.message,
            });
        },
        onSettled: () => {
            setIsUploading(false);
        },
    })

    const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (!files.length) {
            toast("No file selected", {
                description: "Please select a file to upload",
            });

            return;
        }

        const progressMap: Record<string, number> = {};
        setFileProgress(progressMap);
        setIsUploading(true);

        await Promise.all(files.map((file) => mutation.mutateAsync(file)));
        e.target.value = "";
    }

    return (
        <>
            {isUploading &&
                Object.entries(fileProgress).map(([fileName, progress], i) => (
                    <TooltipProvider key={i}>
                        <Tooltip>
                            <TooltipTrigger>
                                <div className="relative size-9 rounded-full flex items-center justify-center drop-shadow-md cursor-default animate-pulse">
                                    <svg
                                        className="absolute w-full h-full transform -rotate-90"
                                        viewBox="0 0 36 36"
                                    >
                                        <circle
                                            className="text-gray-300"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                            fill="transparent"
                                            r="16"
                                            cx="18"
                                            cy="18"
                                        />
                                        <circle
                                            className="text-primary"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                            strokeLinecap="round"
                                            fill="transparent"
                                            r="16"
                                            cx="18"
                                            cy="18"
                                            strokeDasharray="100"
                                            strokeDashoffset={100 - progress}
                                        />
                                    </svg>
                                    <P className="text-xs text-primary font-bold">{progress}%</P>
                                </div>
                            </TooltipTrigger>
                            <TooltipContent>
                                <P className="text-xs font-bold">{fileName}</P>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                ))}

            <Button
                onClick={() => {
                    document.getElementById("file-upload")?.click();
                }}
            >
                <RiFileAddFill /> Upload
            </Button>

            <input
                type="file"
                className="hidden"
                id="file-upload"
                multiple
                onChange={handleFileChange}
            />
        </>
    )
}

// async function uploadFile(
//     file: File,
//     setFileProgress: (cb: (prev: Record<string, number>) => Record<string, number>) => void
// ) {
//     return new Promise((resolve, reject) => {
//         const xhr = new XMLHttpRequest();
//         const formData = new FormData();
//         formData.append("file", file);

//         xhr.upload.addEventListener("progress", (e) => {
//             if (e.lengthComputable) {
//                 const progress = Math.round((e.loaded / e.total) * 100);
//                 setFileProgress((prev) => ({
//                     ...prev,
//                     [file.name]: progress,
//                 }));
//             }
//         });

//         xhr.addEventListener("load", () => {
//             if (xhr.status === 200) {
//                 resolve(JSON.parse(xhr.response));
//             } else {
//                 reject(new Error(`Upload failed: ${xhr.statusText}`));
//             }
//         });

//         xhr.addEventListener("error", () => {
//             reject(new Error("Upload failed"));
//         });

//         xhr.open("POST", "/api/v1/files/upload");
//         xhr.send(formData);
//     });
// }

async function uploadFile(file: File,
    setFileProgress: (cb: (prev: Record<string, number>) => Record<string, number>) => void
) {
    const formData = new FormData();
    formData.append("file", file);

    const res = await axios.post("/api/v1/files/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (progressEvent) => {
            console.log(progressEvent);
            const total = progressEvent.total || 1;
            const loaded = progressEvent.loaded;
            const percent = Math.round((loaded / total) * 100);

            setFileProgress((prev) => ({
                ...prev,
                [file.name]: percent,
            }));
        },
    });

    return res.data;
}