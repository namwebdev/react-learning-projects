import { getMemberByUserId } from "@/actions/member.action";
import React from "react";
import MemberSideBar from "../_MemberSideBar";
import { ROUTES } from "@/constants/routes";
import { Card } from "@nextui-org/react";
import CardInnerWrapper from "@/components/CardInnerWrapper";
import { notFound } from "next/navigation";

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
    <div className="grid grid-cols-12 gap-5 h-[80vh]">
      <div className="col-span-3">
        <MemberSideBar member={member} navLinks={navLinks} />
      </div>

      <div className="col-span-9">
        <Card className="w-full mt-10 h-[80vh]">
          <CardInnerWrapper header="Profile" body={member.description} />
        </Card>
      </div>
    </div>
  );
}

export default MemberDetailPage;
