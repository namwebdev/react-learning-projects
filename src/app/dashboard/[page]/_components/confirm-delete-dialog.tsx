"use client"

import { Dispatch, SetStateAction, useState } from "react"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { IFile } from "@/lib/database/schema/file.model";
import { useMutation } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import { deleteFile } from "../_actions";
import { toast } from "sonner";

export const ConfirmDeleteDialog = ({
    file,
    isShow,
    setIsShow,
}: {
    file: IFile;
    isShow: boolean;
    setIsShow: Dispatch<SetStateAction<boolean>>;
}) => {
    const [isLoading, setIsLoading] = useState(false);
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: deleteFile,
        onSuccess: (data) => {
            toast("Success", {
                description: file.name,
            });
        },
        onSettled: () => {
            setIsLoading(false);
            setIsShow(false);
        },
        onError: (e) => {
            toast(e.name, {
                description: e.message,
            });
        },
    });

    const onConfirm = () => {
        setIsLoading(true);
        mutation.mutateAsync(file);
    }

    return (
        <Dialog open={isShow} onOpenChange={setIsShow}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Are you sure?</DialogTitle>
                    <DialogDescription>This action cannot be undone. Are you sure you want to proceed?</DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setIsShow(false)}>
                        Cancel
                    </Button>
                    <Button onClick={onConfirm} disabled={isLoading}>
                        {isLoading ? "Processing..." : "Confirm"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

