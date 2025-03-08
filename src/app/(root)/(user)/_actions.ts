"use server";

import { auth } from "@/lib/auth";
import { ApiResponse } from "@/types";
import { z } from "zod";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { nanoid } from "nanoid";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { urls } from "@/db/schema";
import { eq } from "drizzle-orm";
import { ROUTES } from "@/constants";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY!);

const shortenUrlSchema = z.object({
    url: z.string().refine(isValidUrl, {
        message: "Please enter a valid URL",
    }),
    customCode: z
        .string()
        .max(20, "Custom code must be less than 255 characters")
        .regex(/^[a-zA-Z0-9_-]+$/, "Custom code must be alphanumeric or hyphen")
        .optional()
        .nullable()
        .transform((val) => (val === null || val === "" ? undefined : val)),
});
export async function shortenUrl(formData: FormData): Promise<
    ApiResponse<{
        shortUrl: string;
        flagged: boolean;
        flagReason?: string | null;
        message?: string;
    }>
> {
    try {
        const session = await auth();
        const userId = session?.user?.id;

        const url = formData.get("url") as string;
        const customCode = formData.get("customCode") as string;

        const validatedFields = shortenUrlSchema.safeParse({
            url,
            customCode: customCode ? customCode : undefined,
        });
        if (!validatedFields.success) {
            return {
                success: false,
                error:
                    validatedFields.error.flatten().fieldErrors.url?.[0] ||
                    validatedFields.error.flatten().fieldErrors.customCode?.[0] ||
                    "Invalid URL",
            };
        }

        const originalUrl = ensureHttps(validatedFields.data.url);

        const safetyCheck = await checkUrlSafety(originalUrl);
        let flagged = false;
        let flagReason = null;

        if (safetyCheck.success && safetyCheck.data) {
            flagged = safetyCheck.data.flagged;
            flagReason = safetyCheck.data.reason;

            if (
                safetyCheck.data.category === "malicious" &&
                safetyCheck.data.confidence > 0.7 &&
                session?.user?.role !== "admin"
            ) {
                return {
                    success: false,
                    error: "This URL is flagged as malicious",
                };
            }
        }
        const shortCode = validatedFields.data.customCode || nanoid(6);
        const existingUrl = await db.query.urls.findFirst({
            where: (urls, { eq }) => eq(urls.shortCode, shortCode),
        });
        if (existingUrl) {
            if (validatedFields.data.customCode) {
                return {
                    success: false,
                    error: "Custom code already exists",
                };
            }
            return shortenUrl(formData);
        }

        await db.insert(urls).values({
            originalUrl,
            shortCode,
            createdAt: new Date(),
            updatedAt: new Date(),
            userId: userId || null,
            flagged,
            flagReason,
        });

        const baseUrl = process.env.NEXT_PUBLIC_APP_URL!;
        const shortUrl = `${baseUrl}/r/${shortCode}`;

        revalidatePath(ROUTES.home);

        return {
            success: true,
            data: {
                shortUrl,
                flagged,
                flagReason,
                message: flagged
                    ? "This URL has been flagged for review by our safety system. It may be temporarily limited until approved by an administrator."
                    : undefined,
            },
        };
    } catch (error) {
        console.error("Failed to shorten URL", error);
        return {
            success: false,
            error: "Failed to shorten URL",
        };
    }
}

export async function getUserUrls(userId: string): Promise<
    ApiResponse<
        Array<{
            id: number;
            originalUrl: string;
            shortCode: string;
            createdAt: Date;
            clicks: number;
        }>
    >
> {
    try {
        const session = await auth();
        if (!session?.user || session.user.id !== userId) {
            return {
                success: false,
                error: "Unauthorized",
            };
        }

        const userUrls = await db.query.urls.findMany({
            where: (urls, { eq }) => eq(urls.userId, userId),
            orderBy: (urls, { desc }) => [desc(urls.createdAt)],
        });
        return {
            success: true,
            data: userUrls.map((url) => ({
                id: url.id,
                originalUrl: url.originalUrl,
                shortCode: url.shortCode,
                createdAt: url.createdAt,
                clicks: url.clicks,
            })),
        };
    } catch (error) {
        console.error("Error getting user URLs", error);
        return {
            success: false,
            error: "An error occurred",
        };
    }
}

export async function getUrlByShortCode(shortCode: string): Promise<
    ApiResponse<{
        originalUrl: string;
        flagged?: boolean;
        flagReason?: string | null;
    }>
> {
    try {
        const url = await db.query.urls.findFirst({
            where: (urls, { eq }) => eq(urls.shortCode, shortCode),
        });
        if (!url) {
            return {
                success: false,
                error: "URL not found",
            };
        }
        await db
            .update(urls)
            .set({
                clicks: url.clicks + 1,
                updatedAt: new Date(),
            })
            .where(eq(urls.shortCode, shortCode));

        return {
            success: true,
            data: {
                originalUrl: url.originalUrl,
                flagged: url.flagged || false,
                flagReason: url.flagReason || null,
            },
        };
    } catch (error) {
        console.error(error);
        return {
            success: false,
            error: "An error occurred while fetching the URL",
        };
    }
}

const updateUrlSchema = z.object({
    id: z.coerce.number(),
    customCode: z
        .string()
        .max(255, "Custom code must be less than 255 characters")
        .regex(/^[a-zA-Z0-9_-]+$/, "Custom code must be alphanumeric or hyphen"),
});

export async function updateUrl(
    formData: FormData
): Promise<ApiResponse<{ shortUrl: string }>> {
    try {
        const session = await auth();
        const userId = session?.user?.id;
        if (!userId) {
            return {
                success: false,
                error: "You must be logged in to update a URL",
            };
        }

        const validatedFields = updateUrlSchema.safeParse({
            id: formData.get("id"),
            customCode: formData.get("customCode"),
        });
        if (!validatedFields.success) {
            return {
                success: false,
                error:
                    validatedFields.error.flatten().fieldErrors.id?.[0] ||
                    validatedFields.error.flatten().fieldErrors.customCode?.[0] ||
                    "Invalid URL ID",
            };
        }

        const { id, customCode } = validatedFields.data;
        const existingUrl = await db.query.urls.findFirst({
            where: (urls, { eq, and }) =>
                and(eq(urls.id, id), eq(urls.userId, userId)),
        });
        if (!existingUrl) {
            return {
                success: false,
                error: "URL not found or you don't have permission to update it",
            };
        }

        const codeExists = await db.query.urls.findFirst({
            where: (urls, { eq, and, ne }) =>
                and(eq(urls.shortCode, customCode), ne(urls.id, id)),
        });
        if (codeExists) {
            return {
                success: false,
                error: "Custom code already exists",
            };
        }

        await db
            .update(urls)
            .set({
                shortCode: customCode,
                updatedAt: new Date(),
            })
            .where(eq(urls.id, id));

        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
        const shortUrl = `${baseUrl}/r/${customCode}`;

        revalidatePath(ROUTES.dashboard);

        return {
            success: true,
            data: { shortUrl },
        };
    } catch (error) {
        console.error("Failed to update URL", error);
        return {
            success: false,
            error: "An error occurred",
        };
    }
}

export async function deleteUrl(urlId: number): Promise<ApiResponse<null>> {
    try {
        const session = await auth();
        if (!session?.user) {
            return {
                success: false,
                error: "Unauthorized",
            };
        }

        const [url] = await db.select().from(urls).where(eq(urls.id, urlId));

        if (!url) {
            return {
                success: false,
                error: "URL not found",
            };
        }

        if (url.userId && url.userId !== session.user.id) {
            return {
                success: false,
                error: "Unauthorized",
            };
        }

        await db.delete(urls).where(eq(urls.id, urlId));

        return {
            success: true,
            data: null,
        };
    } catch (error) {
        console.error("Error deleting URL", error);
        return {
            success: false,
            error: "An error occurred",
        };
    }
}

function isValidUrl(url: string): boolean {
    try {
        const urlObj = new URL(url)
        return urlObj.protocol === "http:" || urlObj.protocol === "https:"
    } catch (error) {
        return false
    }
}
function ensureHttps(url: string): string {
    if (!url.startsWith("https://") && !url.startsWith("https://")) {
        return `https://${url}`
    }

    if (url.startsWith("http://")) {
        return url.replace("http://", "https://")
    }

    return url
}
type UrlSafetyCheck = {
    isSafe: boolean;
    flagged: boolean;
    reason: string | null;
    category: "safe" | "suspicious" | "malicious" | "inappropriate" | "unknown";
    confidence: number;
};
async function checkUrlSafety(
    url: string
): Promise<ApiResponse<UrlSafetyCheck>> {
    try {
        if (!isUrlValidFormat(url)) {
            return {
                success: false,
                error: "Invalid URL format",
            };
        }
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const prompt = `
        Analyze this URL for safety concerns: "${url}"
        
        Consider the following aspects:
        1. Is it a known phishing site?
        2. Does it contain malware or suspicious redirects?
        3. Is it associated with scams or fraud?
        4. Does it contain inappropriate content (adult, violence, etc.)?
        5. Is the domain suspicious or newly registered?
        
        Respond in JSON format with the following structure:
        {
          "isSafe": boolean,
          "flagged": boolean,
          "reason": string or null,
          "category": "safe" | "suspicious" | "malicious" | "inappropriate" | "unknown",
          "confidence": number between 0 and 1
        }
        
        Only respond with the JSON object, no additional text.
      `;
        const result = await model.generateContent(prompt);
        const response = result.response;
        const text = response.text();

        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            throw new Error("Failed to parse JSON response");
        }

        const jsonResponse = JSON.parse(jsonMatch[0]) as UrlSafetyCheck;

        return {
            success: true,
            data: jsonResponse,
        };
    } catch (error) {
        console.error(error);
        return {
            success: false,
            error: "Failed to check URL safety"
        };
    }
}

function isUrlValidFormat(url: string): boolean {
    try {
        new URL(url);
        return true;
    } catch (error) {
        return false;
    }
}
