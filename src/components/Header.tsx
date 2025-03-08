"use client";

import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
    BarChart3Icon,
    LayoutDashboard,
    LogIn,
    LogOut,
    Menu,
    UserPlus,
} from "lucide-react";
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";

export function Header() {
    const { data: session, status } = useSession();
    const isAuthenticated = status === "authenticated";

    return (
        <header className="border-b">
            <div className="container mx-auto flex items-center justify-between p-4">
                <Link href={"/"} className="text-xl font-bold">
                    ShortLink
                </Link>

                {/* Desktop nav */}
                <nav className="hidden md:flex items-center gap-2">
                    <Link href={"/stats"}>
                        <Button variant={"ghost"} size={"sm"} className="flex items-center gap-1">
                            <BarChart3Icon className="size-4" />
                            Stats
                        </Button>
                    </Link>

                    {isAuthenticated ? (
                        <>
                            <Link href={"/dashboard"}>
                                <Button variant={"ghost"} size={"sm"} className="flex items-center gap-1">
                                    <LayoutDashboard className="size-4" />
                                    Dashboard
                                </Button>
                            </Link>

                            <Link href={"/dashboard/stats"}>
                                <Button variant={"ghost"} size={"sm"} className="flex items-center gap-1">
                                    <LayoutDashboard className="size-4" />
                                    My Stats
                                </Button>
                            </Link>

                            <Button variant={"ghost"} size={"sm"} onClick={() => signOut()}>
                                <LogOut className="size-4" />
                                Logout
                            </Button>
                        </>
                    ) : (
                        <>
                            <Link href={"/login"}>
                                <Button variant={"ghost"} size={"sm"} className="flex items-center gap-1">
                                    <LogIn className="size-4" />
                                    Login
                                </Button>
                            </Link>

                            <Link href={"/register"}>
                                <Button variant={"ghost"} size={"sm"} className="flex items-center gap-1">
                                    <UserPlus className="size-4" />
                                    Register
                                </Button>
                            </Link>
                        </>
                    )}
                </nav>

                {/* Mobile nav */}
                <div className="flex items-center gap-2 md:hidden">
                    {/* TODO: add theme toggle here */}
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant={"ghost"} size={"icon"}>
                                <Menu className="size-5" />
                                <span className="sr-only">Toggle menu</span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right" className="w-[250px] sm:w-[300px]">
                            <SheetHeader>
                                <SheetTitle>Navigation Menu</SheetTitle>
                            </SheetHeader>
                            <nav className="flex flex-col gap-4 mt-6">
                                <Link href={"/stats"}>
                                    <Button
                                        variant={"ghost"}
                                        size={"sm"}
                                        className="flex items-center gap-2 justify-start w-full"
                                    >
                                        <BarChart3Icon className="size-4" />
                                        Stats
                                    </Button>
                                </Link>

                                {isAuthenticated ? (
                                    <>
                                        <Link href={"/dashboard"}>
                                            <Button
                                                variant={"ghost"}
                                                size={"sm"}
                                                className="flex items-center gap-2 justify-start w-full"
                                            >
                                                <LayoutDashboard className="size-4" />
                                                Dashboard
                                            </Button>
                                        </Link>

                                        <Link href={"/dashboard/stats"}>
                                            <Button
                                                variant={"ghost"}
                                                size={"sm"}
                                                className="flex items-center gap-2 justify-start w-full"
                                            >
                                                <LayoutDashboard className="size-4" />
                                                My Stats
                                            </Button>
                                        </Link>

                                        <Button
                                            variant={"ghost"}
                                            size={"sm"}
                                            onClick={() => signOut()}
                                            className="flex items-center gap-2 justify-start w-full"
                                        >
                                            <LogOut className="size-4" />
                                            Logout
                                        </Button>
                                    </>
                                ) : (
                                    <>
                                        <Link href={"/login"}>
                                            <Button
                                                variant={"ghost"}
                                                size={"sm"}
                                                className="flex items-center gap-2 justify-start w-full"
                                            >
                                                <LogIn className="size-4" />
                                                Login
                                            </Button>
                                        </Link>

                                        <Link href={"/register"}>
                                            <Button
                                                variant={"ghost"}
                                                size={"sm"}
                                                className="flex items-center gap-2 justify-start w-full"
                                            >
                                                <UserPlus className="size-4" />
                                                Register
                                            </Button>
                                        </Link>
                                    </>
                                )}
                            </nav>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </header>
    );
}
