import type { Metadata } from "next";
import "./globals.css";
import { Outfit } from "next/font/google";
import { cn } from "@/lib/utils";
import { Toaster as Toast } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import ConfirmDialog from "@/components/App/ConfirmDialog";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Z Next Template",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn(`antialiased`, outfit.variable)}>
        {children}

        <Toast />
        <Sonner />
        <ConfirmDialog />
      </body>
    </html>
  );
}
