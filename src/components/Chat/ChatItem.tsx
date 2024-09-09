import { Message, MessageWithUser } from "@/types";
import React from "react";
import { Avatar, AvatarImage } from "../ui/avatar";
import { AvatarFallback } from "@radix-ui/react-avatar";
import Typography from "../ui/typography";
import { useChatStateValues } from "@/hooks/chat-state-values";
import { MdOutlineAdminPanelSettings } from "react-icons/md";
import { cn } from "@/lib/utils";

export const ChatItem = ({ message }: { message: MessageWithUser }) => {
  const { currUser, currChannel } = useChatStateValues();
  const { user } = message;

  const isSuperAdmin = currUser.id === currChannel?.user_id;
  const isSender = currUser.id === message.user_id;

  return (
    <div
      className={cn(
        "relative group flex items-center hover:bg-black/5 px-1 py-2 rounded transition w-full",
        {
          "justify-end": isSender,
          "justify-start": !isSender,
        }
      )}
    >
      <div className="flex gap-x-2">
        <div className="cursor-pointer hover:drop-shadow-md transition">
          <Avatar>
            <AvatarImage
              src={user.avatar_url}
              alt={user.name ?? user.email}
              className="object-cover w-full h-full"
            />
            <AvatarFallback className="bg-neutral-700">
              <Typography variant="p" text={user.name?.slice(0, 2) ?? "User"} />
            </AvatarFallback>
          </Avatar>
        </div>

        <div className="flex flex-col w-full">
          <div className="flex items-center gap-x-2">
            <Typography
              variant="p"
              text={user.name ?? user.email}
              className="font-semibold text-sm hover:underline cursor-pointer"
            />
            {isSuperAdmin && (
              <MdOutlineAdminPanelSettings className="w-5 h-5" />
            )}
          </div>
          <div className="flex items-center gap-x-2">
            <Typography variant="p" text={message.content} />
          </div>
        </div>
      </div>
    </div>
  );
};
