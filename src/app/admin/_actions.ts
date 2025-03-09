import { ApiResponse } from "@/types";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { UrlWithUser } from "./_types";

type GetAllUrlsOptions = {
    page?: number;
    limit?: number;
    sortBy?: "originalUrl" | "shortCode" | "createdAt" | "clicks" | "userName";
    sortOrder?: "asc" | "desc";
    search?: string;
    filter?: "all" | "flagged" | "security" | "inappropriate" | "other";
};

export async function getAllUrls(
    options: GetAllUrlsOptions = {}
): Promise<ApiResponse<{ urls: UrlWithUser[]; total: number }>> {
    try {
        const session = await auth();
        if (!session?.user) {
            return { success: false, error: "Unauthorized" };
        }

        if (session.user.role !== "admin") {
            return { success: false, error: "Unauthorized" };
        }

        const {
            page = 1,
            limit = 10,
            sortBy = "createdAt",
            sortOrder = "desc",
            search = "",
            filter = "all",
        } = options;

        const allUrls = await db.query.urls.findMany({
            with: { user: true },
        });
        let transformedUrls: UrlWithUser[] = allUrls.map((url) => ({
            id: url.id,
            originalUrl: url.originalUrl,
            shortCode: url.shortCode,
            createdAt: url.createdAt,
            clicks: url.clicks,
            userId: url.userId,
            userName: url.user?.name || null,
            userEmail: url.user?.email || null,
            flagged: url.flagged,
            flagReason: url.flagReason,
        }));
        if (search) {
            transformedUrls = transformedUrls.filter(
                (url) =>
                    url.originalUrl.toLowerCase().includes(search.toLowerCase()) ||
                    url.shortCode.toLowerCase().includes(search.toLowerCase()) ||
                    url.userName?.toLowerCase().includes(search.toLowerCase()) ||
                    url.userEmail?.toLowerCase().includes(search.toLowerCase()) ||
                    url.flagReason?.toLowerCase().includes(search.toLowerCase())
            );
        }

        if (filter !== "all") {
            transformedUrls = transformedUrls.filter(
                (url) => {
                    if (filter === "flagged") return url.flagged;

                    if (filter === "security" && url.flagReason) return (
                        url.flagReason.toLowerCase().includes("security") ||
                        url.flagReason.toLowerCase().includes("phishing") ||
                        url.flagReason.toLowerCase().includes("malware")
                    );

                    return false;
                }
            );
        }

        const offset = (page - 1) * limit;
        const total = transformedUrls.length;
        const paginatedUrls = transformedUrls.slice(offset, offset + limit);

        return {
            success: true,
            data: {
                urls: paginatedUrls,
                total,
            },
        };
    } catch (error) {
        console.error("Error getting all URLs:", error);
        return { success: false, error: "Internal Server Error" };
    }
}