export const metadata = {
  layout: 'false',
};

export default function Layout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    return <>{children}</>;
  }
