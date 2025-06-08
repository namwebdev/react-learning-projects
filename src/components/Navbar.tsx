"use client"

import Link from "next/link";
import { useEffect, useState } from "react";
import { BsCloudUpload } from "react-icons/bs";

export const Navbar = () => {
     const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 0);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <header
            className={`bg-default-50 border-b border-default-200 sticky top-0 z-50 transition-shadow ${isScrolled ? "shadow-sm" : ""}`}
        >
            <div className="container mx-auto py-3 md:py-4 px-4 md:px-6">
                <div className="flex justify-between items-center">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 z-10">
                        <BsCloudUpload className="h-6 w-6 text-primary" />
                        <h1 className="text-xl font-bold">Droply</h1>
                    </Link>

                <div className="hidden md:flex gap-4 items-center">
                    Sign Out
                </div>
                </div>
            </div>
        </header>
    )
}
