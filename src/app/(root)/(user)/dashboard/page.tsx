import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { auth } from "@/lib/auth";
import { Metadata } from "next";
import { UrlShortenerForm } from "../_components/url-shortener-form";
import { UserUrlsTable } from "../_components/user-users-table";
import { getUserUrls } from "../_actions";

export const metadata: Metadata = {
    title: "Dashboard | ShortLink",
    description: "Dashboard page",
};

export default async function DashboardPage() {
    const session = await auth();
    const response = await getUserUrls(session?.user.id as string);
    const userUrls = response.success && response.data ? response.data : [];

    return (
        <>
            <h1 className="text-3xl font-bold mb-8 text-center">Dashboard</h1>

            <div className="grid gap-8">
                <Card className="shadow-sm">
                    <CardHeader>
                        <CardTitle>Create New Short URL</CardTitle>
                        <CardDescription>
                            Enter a long URL to create a shortened link. You can also
                            customize the short code.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <UrlShortenerForm />
                    </CardContent>
                </Card>

                <Card className="shadow-sm border border-dashed">
                    <CardHeader>
                        <CardTitle>Your URLs</CardTitle>
                        <CardDescription>
                            Manage and track your shortened URLs.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <UserUrlsTable urls={userUrls} />
                    </CardContent>
                </Card>
            </div>
        </>
    )
}