"use client";

import { useUser } from "@/lib/store/user";
import { ChatPresence } from "./ChatPresence";
import { Button } from "@/components/ui/button";
import { LogoutButton } from "../LogoutButton";

export const ChatHeader = () => {
  const { user } = useUser();

  return (
    <div className="h-20">
      <div className="p-5 border-b flex items-center justify-between h-full">
        <div>
          <h1 className="text-xl font-bold">Daily Chat</h1>
          <ChatPresence />
        </div>

        <LogoutButton />
      </div>
    </div>
  );
};
