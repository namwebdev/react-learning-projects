"use client"

import { z } from "zod";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { updateUrl } from "../_actions";
import { toast } from "sonner";
import { useEffect } from "react";

const editUrlSchema = z.object({
    customCode: z
        .string()
        .min(3, "Custom code must be at least 3 characters")
        .max(255, "Custom code must be less than 255 characters")
        .regex(/^[a-zA-Z0-9_-]+$/, "Custom code must be alphanumeric or hyphen"),
});
type EditUrlFormData = z.infer<typeof editUrlSchema>;

interface EditUrlModalProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    urlId: number;
    currentShortCode: string;
    onSuccess: (newShortCode: string) => void;
}

export function EditUrlModal({
    isOpen,
    onOpenChange,
    urlId,
    currentShortCode,
    onSuccess,
}: EditUrlModalProps) {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || window.location.origin;
    const form = useForm<EditUrlFormData>({
        resolver: zodResolver(editUrlSchema),
        defaultValues: {
            customCode: currentShortCode,
        },
    });
    const isSubmitting = form.formState.isSubmitting;

    useEffect(() => {
        console.log(isOpen)
        if (isOpen) form.reset({
            customCode: currentShortCode,
        });
    }, [isOpen]);

    const onSubmit = async (data: EditUrlFormData) => {
        try {
            const formData = new FormData();
            formData.append("id", urlId.toString());
            formData.append("customCode", data.customCode);

            const response = await updateUrl(formData);
            if (response.success && response.data) {
                setTimeout(() => {
                    onOpenChange(false);
                }, 10)
                toast.success("URL updated successfully", {
                    description: "The URL has been updated successfully",
                });
                onSuccess(data.customCode);
            }
        } catch (error) {
            console.error("Failed to update URL", error);
            toast.error("Failed to update URL", {
                description: "An error occurred",
            });
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Edit Short URL</DialogTitle>
                    <DialogDescription>
                        Customize the short code for this URL. The short code must be unique
                        and can only contain letters, numbers, hyphens, and underscores.
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="customCode"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <div className="flex items-center">
                                            <span className="text-sm text-muted-foreground mr-2">
                                                {baseUrl}/r/
                                            </span>
                                            <Input
                                                placeholder="Custom code"
                                                {...field}
                                                disabled={form.formState.isSubmitting}
                                                className="flex-1"
                                            />
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <DialogFooter className="sm:justify-end">
                            <Button
                                type="button"
                                variant={"outline"}
                                onClick={() => onOpenChange(false)}
                                disabled={isSubmitting}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="animate-spin size-4 mr-2" />
                                        Updating...
                                    </>
                                ) : (
                                    "Save Changes"
                                )}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}