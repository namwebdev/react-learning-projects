import { getUserInfo } from "@/actions/user.action";
import { auth } from "@/auth";
import { Button, Navbar, NavbarBrand, NavbarContent } from "@nextui-org/react";
import Link from "next/link";
import React from "react";
import { GiSelfLove } from "react-icons/gi";
import { NavLink } from "./NavLink";
import UserMenu from "./UserMenu";

const memberLinks = [
  { href: "/members", label: "Matches" },
  { href: "/lists", label: "Lists" },
  { href: "/messages", label: "Messages" },
];

// const adminLinks = [
//   {
//     href: "/admin/moderation",
//     label: "Photo Moderation",
//   },
// ];

const Header = async () => {
  const session = await auth();
  const userInfo = session?.user && (await getUserInfo());

  return (
    <Navbar
      maxWidth="full"
      className="bg-gradient-to-r from-pink-400 via-red-400 to-pink-600"
      classNames={{
        item: [
          "text-xl",
          "text-white",
          "uppercase",
          "data-[active=true]:text-yellow-200",
        ],
      }}
    >
      <NavbarBrand as={Link} href="/">
        <GiSelfLove size={40} className="text-gray-200" />
        <div className="font-bold text-3xl flex">
          <span className="text-gray-200">MatchMe</span>
        </div>
      </NavbarBrand>

      <NavbarContent justify="center">
        {memberLinks.map((item) => (
          <NavLink key={item.href} href={item.href} label={item.label} />
        ))}
      </NavbarContent>

      <NavbarContent justify="end">
        {userInfo && <UserMenu userInfo={userInfo} />}

        {!userInfo && (
          <>
            <Button
              as={Link}
              href="/login"
              variant="bordered"
              className="text-white"
            >
              Login
            </Button>
            <Button
              as={Link}
              href="/register"
              variant="bordered"
              className="text-white"
            >
              Register
            </Button>
          </>
        )}
      </NavbarContent>
    </Navbar>
  );
};

export default Header;
