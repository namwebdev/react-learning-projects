import { z } from "zod";

export const renameFormSchema = z.object({
    name: z.string().min(1, "Name is required"),
});

export type TRenameFileForm = z.infer<typeof renameFormSchema>;

export const permissionFormSchema = z.object({
    email: z.string().email(),
    permissions: z
        .array(z.string())
        .refine((value) => value.some((item) => item), {
            message: "You have to select at least one item.",
        }),
});

export type TShareFileForm = z.infer<typeof permissionFormSchema>;