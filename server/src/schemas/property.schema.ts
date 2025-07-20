import { z } from "zod";

const isValidCognitoId = (id: string): boolean => {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return uuidRegex.test(id);
};

enum PropertyTypeEnum {
    Rooms = "Rooms",
    Tinyhouse = "Tinyhouse",
    Apartment = "Apartment",
    Villa = "Villa",
    Townhouse = "Townhouse",
    Cottage = "Cottage",
}
export const propertySchema = z.object({
    managerCognitoId: z.string().refine(isValidCognitoId, { message: "Invalid cognito id" }),
    address: z.string().min(1),
    amenities: z.string().min(1),
    applicationFee: z.coerce.number().positive().min(0).int(),
    baths: z.coerce.number().positive().min(0).max(10).int(),
    beds: z.coerce.number().positive().min(0).max(10).int(),
    city: z.string().min(1),
    country: z.string().min(1),
    description: z.string().min(1),
    highlights: z.string().min(1),
    isParkingIncluded: z.boolean(),
    isPetsAllowed: z.boolean(),
    name: z.string().min(1),
    imageUrls: z.array(z.string()).min(1),
    postalCode: z.string().min(1),
    pricePerMonth: z.coerce.number().positive().min(0).int(),
    propertyType: z.nativeEnum(PropertyTypeEnum),
    securityDeposit: z.coerce.number().positive().min(0).int(),
    squareFeet: z.coerce.number().int().positive(),
    state: z.string().min(1, "State is required"),
});

export const filterPropertySchema = z.object({
    favoriteIds: z.array(z.string()).optional(),
    priceMin: z.coerce.number().positive().min(0).int().optional(),
    priceMax: z.coerce.number().positive().min(0).int().optional(),
    beds: z.coerce.number().positive().min(0).max(10).int().optional(),
    baths: z.coerce.number().positive().min(0).max(10).int().optional(),
    propertyType: z.nativeEnum(PropertyTypeEnum).optional(),
    squareFeetMin: z.coerce.number().int().positive().optional(),
    squareFeetMax: z.coerce.number().int().positive().optional(),
    amenities: z.string().min(1).optional(),
})

