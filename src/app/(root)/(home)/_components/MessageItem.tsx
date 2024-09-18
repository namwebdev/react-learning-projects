import Image from "next/image";
import { useUser } from "@/lib/store/user";
import { MessageWithSender } from "@/types";

export default function MessageItem({
  message,
}: {
  message: MessageWithSender;
}) {
  const user = useUser((state) => state.user);

  return (
    <div
      className={`flex min-w-[712px] ${
        message.users.id === user?.id ? "justify-end" : "justify-start"
      }`}
    >
      <div className="flex gap-2">
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
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 text-sm">
              <h1 className="font-bold">{message.users.name}</h1>
              <h1 className="text-sm text-gray-400">
                {formatDate(message.created_at)}
              </h1>
              {message.is_edited && (
                <h1 className="text-sm text-gray-400">edited</h1>
              )}
            </div>
            {/* {message.users?.id === user?.id && <MessageMenu message={message} />} */}
          </div>
          <p className="text-gray-800 mt-1">{message.content}</p>
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
