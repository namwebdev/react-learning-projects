"use client"

import React, { useState } from "react";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { useConfirmDialogStore } from "@/hooks/use-dialog-store";

export default function ConfirmDialog() {
    const { isOpen, config, closeDialog } = useConfirmDialogStore(state => state);
    const [isPending, setIsPending] = useState(false);

    const handleConfirm = async () => {
        if (!config) return;

        setIsPending(true);
        try {
            await config.onConfirm();
        } finally {
            setIsPending(false);
            closeDialog();
        }
    };

    const handleCancel = () => {
        if (config?.onCancel) config.onCancel();
        closeDialog();
    };

    if (!config) return null;

    return (
        <Dialog open={isOpen} onOpenChange={closeDialog}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{config.title}</DialogTitle>
                    <DialogDescription>{config.description}</DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button variant="outline" onClick={handleCancel}>
                        Cancel
                    </Button>
                    <Button onClick={handleConfirm} loading={isPending}>
                        Confirm
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
