"use client";

import { usePathname } from "next/navigation";
import { NavbarItem } from "@nextui-org/react";
import Link from "next/link";

export const NavLink = ({ href, label }: { href: string; label: string }) => {
  const pathname = usePathname();

  return (
    <NavbarItem isActive={pathname === href} as={Link} href={href}>
      <span>{label}</span>
    </NavbarItem>
  );
};
