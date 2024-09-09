"use client";

import { Channel, ChatType, Message } from "@/types";
import { API_END_POINTS } from "@/constants";
import { TextEditor } from "./Editor/TextEditor";
import { Button } from "../ui/Button";
import ChatMessages from "./ChatMessages";
import { useChatStateValues } from "@/hooks/chat-state-values";
import { useState } from "react";

interface Props {
  type?: ChatType;
  workspaceId: string;
}

const ChatGroup = ({ type = "channel", workspaceId }: Props) => {
  const { currChannel: channel } = useChatStateValues();
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    setLoading(true);
    const payload: Pick<Message, "content"> = {
      content: "Hello",
    };
    let endPoint = API_END_POINTS.socketChannelMessages;
    endPoint += `?workspaceId=${workspaceId}&channelId=${channel.id}`;

    const res = await fetch(endPoint, {
      method: "POST",
      body: JSON.stringify(payload),
    }).catch((error) => {
      console.error("Failed to send message", error);
    });
    console.log("🚀 ~ sendMessage ~ res:", res);
    setLoading(false);
  };

  return (
    <div className="h-[calc(100vh-256px)] overflow-y-auto [&::-webkit-scrollbar-thumb]:rounded-[6px] [&::-webkit-scrollbar-thumb]:bg-foreground/60 [&::-webkit-scrollbar-track]:bg-none [&::-webkit-scrollbar]:w-2">
      <ChatMessages />
      <Button onClick={sendMessage} loading={loading} className="mt-2">
        Send
      </Button>
      <div className="m-4">
        {/* <TextEditor channel={channel} /> */}
      </div>
    </div>
  );
};

export default ChatGroup;
