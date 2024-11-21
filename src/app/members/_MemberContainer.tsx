import React from "react";
import { Props } from "./_types";
import MemberSideBar from "./_MemberSideBar";
import { Card } from "@nextui-org/react";

const MemberContainer = ({
  children,
  member,
  navLinks,
}: Props & {
  children: React.ReactNode;
}) => {
  return (
    <div className="grid grid-cols-12 gap-5 h-[80vh]">
      <div className="col-span-3">
        <MemberSideBar member={member} navLinks={navLinks} />
      </div>

      <div className="col-span-9">
        <Card className="w-full mt-10 h-[80vh]">{children}</Card>
      </div>
    </div>
  );
};

export default MemberContainer;
