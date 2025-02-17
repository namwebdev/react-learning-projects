"use client"

import { IFile } from "@/lib/database/schemas/file.model";
import { Dispatch, SetStateAction, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { renameFile } from "../_actions";
import { toast } from "sonner";
import { renameFormSchema, TRenameFileForm } from "../_types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { RiFileEditFill, RiLoader3Fill } from "@remixicon/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export const RenameFileForm = ({
    file,
    isRenameDialogOpen,
    setIsRenameDialogOpen,
}: {
    file: IFile;
    isRenameDialogOpen: boolean;
    setIsRenameDialogOpen: Dispatch<SetStateAction<boolean>>;
}) => {
    const [isLoading, setIsLoading] = useState(false);
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: renameFile,
        onSuccess: (newData) => {
            queryClient.setQueryData(["files", file.category],
                (oldData: { files: IFile[] }) => {
                    const oldFiles = oldData?.files || [];
                    const newFile = newData.file;

                    const withNewFiles = oldFiles.map((oldFile) =>
                        oldFile._id === newFile?._id ? newFile : oldFile
                    );
                    const updatedData = {
                        ...oldData,
                        files: withNewFiles,
                    };
                    return updatedData;
                }
            );

            queryClient.invalidateQueries({
                queryKey: ["files", file.category]
            });

            toast("Success", {
                description: file.name,
            });
        },
        onSettled: () => {
            setIsLoading(false);
            setIsRenameDialogOpen(false);
        },
        onError: (e) => {
            toast(e.name, {
                description: e.message,
            });
        },
    });
    const form = useForm<TRenameFileForm>({
        resolver: zodResolver(renameFormSchema),
        defaultValues: {
            name: file.name || "",
        },
    });

    function onSubmit(values: TRenameFileForm) {
        setIsLoading(true);

        mutation.mutateAsync({ values, file });
    }

    return (
        <Dialog open={isRenameDialogOpen} onOpenChange={setIsRenameDialogOpen}>
            <DialogContent>
                <DialogHeader className="hidden">
                    <DialogTitle>title</DialogTitle>
                    <DialogDescription>description</DialogDescription>
                </DialogHeader>
                <div>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                            {/* Email */}
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>New Name</FormLabel>
                                        <FormControl>
                                            <div className="flex items-center justify-start gap-3 border rounded-2xl px-3 py-2">
                                                <RiFileEditFill />
                                                <Input
                                                    className={cn("input")}
                                                    placeholder="new name here..."
                                                    {...field}
                                                />
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button disabled={isLoading} type="submit" variant="lift">
                                {!isLoading ? (
                                    "Rename"
                                ) : (
                                    <RiLoader3Fill className="animate-spin" />
                                )}
                            </Button>
                        </form>
                    </Form>
                </div>
            </DialogContent>
        </Dialog>
    );
}
