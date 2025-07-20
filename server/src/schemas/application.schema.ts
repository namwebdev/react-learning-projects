import { z } from "zod";
import { ApplicationStatus } from "@prisma/client";

export const applicationStatusSchema = z.string().refine(
    (status) => Object.values(ApplicationStatus).includes(status as ApplicationStatus),
    { message: "Invalid status" }
)

export const applicationSchema = z.object({
    propertyId: z.number(),
    name: z.string(),
    email: z.string().email(),
    phoneNumber: z.string(),
    applicationDate: z.string().datetime().optional(),
    message: z.string().optional(),
})


export type ApplicationFormData = z.infer<typeof applicationSchema>;
