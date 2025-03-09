export type UrlWithUser = {
    id: number;
    originalUrl: string;
    shortCode: string;
    createdAt: Date;
    clicks: number;
    userId: string | null;
    userName: string | null;
    userEmail: string | null;
    flagged: boolean;
    flagReason: string | null;
};