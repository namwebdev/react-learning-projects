import Image from "next/image";
import { useUser } from "@/lib/store/user";
import { Message, MessageWithSender } from "@/types";
import { useState } from "react";
import { BiTrash } from "react-icons/bi";
import { cn } from "@/lib/utils";
import { deleteMessage } from "../_action";
import { useMessages } from "@/lib/store/messages";

export default function MessageItem({
  message,
}: {
  message: MessageWithSender;
}) {
  const user = useUser((state) => state.user);
  const { optimisticMessage } = useMessages();
  const [isHovered, setIsHovered] = useState(false);

  const onDeleteMessage = async () => {
    await deleteMessage(message.id);
    optimisticMessage({
      ...message,
      is_deleted: true,
    });
  };
  return (
    <div
      className={`flex min-w-[712px] pr-4 pt-1 transition-colors duration-200 ${
        message.users.id === user?.id ? "justify-end" : "justify-start"
      } ${!message.is_deleted ? "hover:bg-gray-100" : ""}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative flex gap-2">
        <div>
          <Image
            src={message.users.avatar_url!}
            alt={message.users.name!}
            width={40}
            height={40}
            className=" rounded-full ring-2"
          />
        </div>
        <div className="flex-1">
          {message.is_deleted ? (
            <p className="text-gray-400 text-sm">message is deleted</p>
          ) : (
            <>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-sm">
                  <h1 className="font-bold">{message.users.name}</h1>
                  <h1 className="text-sm text-gray-400">
                    {formatDate(message.created_at)}
                  </h1>
                </div>

                <div
                  className={cn(
                    "absolute bottom-0 right-1 transition-all duration-200",
                    isHovered && message.users?.id === user?.id
                      ? "opacity-100"
                      : "opacity-0"
                  )}
                >
                  <span
                    onClick={onDeleteMessage}
                    className="cursor-pointer hover:text-red-400 transition-colors duration-200"
                  >
                    <BiTrash size={20} />
                  </span>
                </div>
              </div>
              <p className="text-gray-800 mt-1">
                {message.content}

                {message.is_edited && (
                  <span className="text-sm text-gray-500">(edited)</span>
                )}
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function formatDate(dateString: string) {
  // Parse the input date string
  const date = new Date(dateString);

  // Get the components
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
  const year = date.getFullYear();

  // Get the hours and minutes
  let hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, "0");

  // Determine AM/PM
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12; // Convert 24h to 12h format and handle midnight (0 => 12)

  // Format the final string
  const formattedDate = `${day}/${month}/${year} - ${hours}:${minutes} ${ampm}`;

  return formattedDate;
}
