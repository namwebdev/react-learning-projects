import { ROUTES } from "@/constants/routes";
import { calculateAge } from "@/lib/utils";
import { Card, CardFooter, Image } from "@nextui-org/react";
import { Member } from "@prisma/client";
import Link from "next/link";

type Props = {
  member: Member;
  // likeIds: string[];
};

const MemberCard = ({ member }: Props) => {
  return (
    <Card fullWidth as={Link} href={ROUTES.memberDetail(member.userId)} isPressable>
      <Image
        isZoomed
        alt={member.name}
        width={300}
        src={member.image || "/images/user.png"}
        className="aspect-square object-cover"
      />

      <CardFooter className="flex justify-start bg-black overflow-hidden absolute bottom-0 z-10 bg-dark-gradient">
        <div className="flex flex-col text-white">
          <span className="font-semibold">
            {member.name}, {calculateAge(member.dateOfBirth)}
          </span>
          <span className="text-sm">{member.city}</span>
        </div>
      </CardFooter>
    </Card>
  );
};

export default MemberCard;
