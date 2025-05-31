export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="h-full">
            {/* <Header isAdminPage={true} /> */}
            <div className="flex h-full w-40 flex-col top-20 fixed inset-y-0 z-50">
                {/* <Sidebar /> */}
            </div>
            <main className="md:pl-40 pt-[80px] h-full">{children}</main>
        </div>
    );
}
