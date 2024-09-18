"use client";

import { useUser } from "@/lib/store/user";

export const ChatHeader = () => {
  const { user } = useUser();

  return <div className="h-20">ChatHeader -{user?.id}</div>;
};
