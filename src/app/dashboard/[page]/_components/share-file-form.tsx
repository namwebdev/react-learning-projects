import { useState, Dispatch, SetStateAction } from "react";
import { IFile } from "@/lib/database/schemas/file.model";
import { updateFilePermissions } from "../_actions";
import { toast } from "sonner";
import { TShareFileForm, permissionFormSchema as formSchema } from "../_types";
import { DialogContent, DialogHeader, DialogTitle, DialogDescription, Dialog } from "@/components/ui/dialog";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RiShareFill, RiLoader3Fill } from "@remixicon/react";
import { cn } from "@/lib/utils";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Checkbox } from "@/components/ui/checkbox";

const permissions = [
    {
        id: "file:read",
        label: "Read",
    },
    {
        id: "file:update",
        label: "Update",
    },
    {
        id: "file:delete",
        label: "Delete",
    },
] as const;

export const ShareFileForm = ({
    file,
    isShareDialogOpen,
    setIsShareDialogOpen,
}: {
    file: IFile;
    isShareDialogOpen: boolean;
    setIsShareDialogOpen: Dispatch<SetStateAction<boolean>>;
}) => {
    const [isLoading, setIsLoading] = useState(false);
    const form = useForm<TShareFileForm>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            permissions: [],
        },
    });
    async function onSubmit(values: TShareFileForm) {
        setIsLoading(true);

        const res = await updateFilePermissions(file, values);

        toast(res.message, {
            description: res.description,
        });

        setIsLoading(false);
        setIsShareDialogOpen(false);
    }

    return (
        <Dialog open={isShareDialogOpen} onOpenChange={setIsShareDialogOpen}>
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
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <div className="flex items-center justify-start gap-3 border rounded-2xl px-3 py-2">
                                                <RiShareFill />
                                                <Input
                                                    className={cn("input")}
                                                    placeholder="email here..."
                                                    {...field}
                                                    type="email"
                                                />
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Permission */}
                            <FormField
                                control={form.control}
                                name="permissions"
                                render={() => (
                                    <FormItem>
                                        <div className="mb-4">
                                            <FormLabel className="text-base">
                                                Select Permission
                                            </FormLabel>
                                        </div>
                                        {permissions.map((permission) => (
                                            <FormField
                                                key={permission.id}
                                                control={form.control}
                                                name="permissions"
                                                render={({ field }) => {
                                                    return (
                                                        <FormItem
                                                            key={permission.id}
                                                            className="flex flex-row items-start space-x-3 space-y-0"
                                                        >
                                                            <FormControl>
                                                                <Checkbox
                                                                    checked={field.value?.includes(permission.id)}
                                                                    onCheckedChange={(checked) => {
                                                                        return checked
                                                                            ? field.onChange([
                                                                                ...field.value,
                                                                                permission.id,
                                                                            ])
                                                                            : field.onChange(
                                                                                field.value?.filter(
                                                                                    (value) => value !== permission.id
                                                                                )
                                                                            );
                                                                    }}
                                                                />
                                                            </FormControl>
                                                            <FormLabel className="text-sm font-normal">
                                                                {permission.label}
                                                            </FormLabel>
                                                        </FormItem>
                                                    );
                                                }}
                                            />
                                        ))}
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <Button disabled={isLoading} type="submit" variant="lift">
                                {!isLoading ? (
                                    "Share"
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