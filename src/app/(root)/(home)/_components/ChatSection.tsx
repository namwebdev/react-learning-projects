import { get } from "http";
import ListMessage from "./ListMessage";
import { getMessages } from "../_action";
import MessageStateStore from "@/lib/store/message-state";

export const ChatSection = async () => {
  const messages = await getMessages();
  if (!messages) return <div>Error fetching messages</div>;

  return (
    <>
      <ListMessage />

      <MessageStateStore messages={messages} />
    </>
  );
};
