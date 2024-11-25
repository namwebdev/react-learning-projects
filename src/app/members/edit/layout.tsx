import { getAuthUserId } from "@/actions/auth.action";
import { getMemberByUserId } from "@/actions/member.action";
import { ROUTES } from "@/constants/routes";
import { notFound } from "next/navigation";
import React from "react";
import MemberContainer from "../_MemberContainer";
import CardInnerWrapper from "@/components/CardInnerWrapper";

const navLinks = [
  { name: "Edit Profile", href: ROUTES.memberEdit },
  // {
  //   name: "Update Photos",
  //   href: `${basePath}/photos`,
  // },
];

async function MemberEditLayout({ children }: { children: React.ReactNode }) {
  const userId = await getAuthUserId();
  const member = await getMemberByUserId(userId);
  if (!member) return notFound();

  return (
    <MemberContainer navLinks={navLinks} member={member}>
      {children}
    </MemberContainer>
  );
}

export default MemberEditLayout;
