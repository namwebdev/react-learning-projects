import { Header } from "@/components/App/Header";

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <main className="mt-14">{children}</main>;
}
