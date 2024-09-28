import { Sidebar } from "@/components/Sidebar/Sidebar";
import { SidebarWithCollapse } from "@/components/Sidebar/SidebarWithCollapse";

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <section className="grid sm:grid-cols-[220px_1fr] grid-cols-[1fr] gap-4">
      {/* <Sidebar /> */}
      <SidebarWithCollapse />
      <main>{children}</main>
    </section>
  );
}
