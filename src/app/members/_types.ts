import { Member } from "@prisma/client";

export type Props = {
  member: Member;
  navLinks: { name: string; href: string }[];
};
