import { Header } from "@/components/Header";
import { ROUTES } from "@/constants";
import { auth } from "@/lib/auth/";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

interface DashboardLayoutProps {
    children: ReactNode;
}

export default async function DashboardLayout({
    children,
}: DashboardLayoutProps) {
    const session = await auth();
    if (!session?.user) {
        redirect(ROUTES.login);
    }

    return (
        <div className="min-h-[calc(100vh-64px-56px)]">
            <Header />
            <div className="container max-w-6xl mx-auto py-10 px-4 md:px-8">
                {children}
            </div>
        </div>
    );
}
