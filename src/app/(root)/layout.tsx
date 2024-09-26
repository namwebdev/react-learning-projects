import { Sidebar } from "@/components/Sidebar/Sidebar";


export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <section className="grid sm:grid-cols-[220px_1fr] grid-cols-[1fr] gap-4">
      <Sidebar />
      <main>{children}</main>
    </section>
  );
}
