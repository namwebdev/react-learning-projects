import { SidebarProvider } from "@/components/ui/sidebar";
import { DashboardSidebar } from "./_components/sidebar";
import DashboardHeader from "./_components/header";

const Layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <main>
            <SidebarProvider>
                <DashboardSidebar />
                <div className="w-full px-5">
                    <DashboardHeader />
                    <div className="bg-primary/5 w-full min-h-[calc(100vh-80px)] rounded-lg p-5">
                        {children}
                    </div>
                </div>
            </SidebarProvider>
        </main>
    );
};

export default Layout;
