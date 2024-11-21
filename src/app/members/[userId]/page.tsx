import { getMemberByUserId } from "@/actions/member.action";
import React from "react";
import { ROUTES } from "@/constants/routes";
import CardInnerWrapper from "@/components/CardInnerWrapper";
import { notFound } from "next/navigation";
import MemberContainer from "../_MemberContainer";

async function MemberDetailPage({ params }: { params: { userId: string } }) {
  const member = await getMemberByUserId(params.userId);
  if (!member) return notFound();

  const memUserId = member.userId;

  const navLinks = [
    { name: "Profile", href: ROUTES.memberDetail(memUserId) },
    // {
    //   name: "Photos",
    //   href: `${basePath}/photos`,
    // },
    // { name: "Chat", href: `${basePath}/chat` },
  ];
  return (
    <MemberContainer member={member} navLinks={navLinks}>
      <CardInnerWrapper header="Profile" body={member.description} />
    </MemberContainer>
  );
}

export default MemberDetailPage;
