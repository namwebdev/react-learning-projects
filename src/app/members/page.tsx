import { getMembers } from "@/actions/member.action";
import React from "react";
import MemberCard from "./_MemberCard";

async function MemberPage() {
  const { items: members } = await getMembers({ pageSize: "9" });

  return (
    <div className="mt-10 grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-8">
      {members.map((member) => (
        <MemberCard key={member.userId} member={member} />
      ))}
    </div>
  );
}

export default MemberPage;
