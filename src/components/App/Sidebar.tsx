"use client";

interface Menu {
  name: string;
  icon: JSX.Element;
  href: string;
}
const menus: Menu[] = [
  { name: "Home", icon: <HomeIcon />, href: "/" },
  { name: "Contact", icon: <Contact />, href: "/contact" },
  {
    name: "Todo-Lists",
    icon: <ListChecks />,
    href: "/todo-lists",
  },
];
import { cn } from "@/lib/utils";
import clsx from "clsx";
import {
  Contact,
  HomeIcon,
  ChevronsLeft,
  List,
  ListChecks,
  ChevronDown,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState } from "react";

export const Sidebar = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(true);
  const [activeMenuIndex, setActiveMenuIndex] = useState(-1);
  const toggleSidebar = () => setIsOpen((prevState) => !prevState);

  return (
    <nav
      id="sidebar"
      className={cn(
        "bg-gray-800 text-white transition-all ease-in-out duration-300 fixed bottom-0 w-full h-16 sm:w-64 sm:h-screen sm:sticky sm:top-0 ",
        {
          "sm:w-14 p-2": !isOpen,
        }
      )}
    >
      <ul className="flex flex-row justify-between items-center mx-7 h-full sm:block sm:justify-start sm:items-start sm:mx-0">
        <li
          className={cn("items-center justify-between p-4 hidden sm:flex", {
            "px-0 justify-center": !isOpen,
          })}
        >
          <span
            className={cn("logo", {
              hidden: !isOpen,
            })}
          >
            coding2go
          </span>
          <button
            onClick={() => toggleSidebar()}
            id="toggle-btn"
            className={cn({ "rotate-180": !isOpen })}
          >
            <ChevronsLeft />
          </button>
        </li>
        {menus.map(({ name, icon, href }) => {
          const isActive = pathname === href;

          return (
            <li
              key={name}
              className={cn("flex items-center justify-between", {
                "justify-center": !isOpen,
              })}
            >
              <Link
                href={href}
                className={cn(
                  "flex items-center py-4 px-6 sm:px-4 hover:bg-gray-700 w-full transition-all duration-300",
                  {
                    "sm:px-0 justify-center": !isOpen,
                    "text-blue-500": isActive,
                  }
                )}
              >
                {icon}
                <span
                  className={cn("ml-2 hidden sm:block", {
                    "sm:hidden": !isOpen,
                  })}
                >
                  {name}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};
