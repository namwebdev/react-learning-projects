import { useChatFetcher } from "@/hooks/use-chat-fetcher";
import React from "react";
import { ChatItem } from "./ChatItem";
import { API_END_POINTS } from "@/constants";
import { ChatType } from "@/types";
import { useChatSocketConnection } from "@/hooks/use-chat-socket-connection";
import { useChatStateValues } from "@/hooks/chat-state-values";

const apiUrl = API_END_POINTS.messages;

interface Props {
  type?: ChatType;
}

const ChatMessages = ({ type = "channel" }: Props) => {
  const {
    currChannel: { id: channelId },
  } = useChatStateValues();

  const queryKey =
    type === "channel" ? `channel:${channelId}` : `direct_message:${channelId}`;
  const {
    data: messages,
    status,
    isFetchingNextPage,
  } = useChatFetcher({
    apiUrl,
    queryKey,
    pageSize: 10,
    paramValue: channelId,
  });

  useChatSocketConnection({
    queryKey,
    addKey:
      type === "channel"
        ? `${queryKey}:channel-messages`
        : `direct_messages:post`,
    updateKey:
      type === "channel"
        ? `${queryKey}:channel-messaegs:update`
        : `direct_messages:update`,
    paramValue: channelId,
  });

  return (
    <div className="flex flex-col-reverse mt-auto">
      {status === "pending" ? (
        <>
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="flex items-center gap-2 my-2">
              <div className="w-10 h-10 rounded-full bg-gray-300 animate-pulse" />
              <div className="w-full h-4 bg-gray-300 animate-pulse" />
            </div>
          ))}
        </>
      ) : (
        <>
          {messages?.pages.map(({ data }) =>
            data?.map((message) => (
              <ChatItem key={message.id} message={message} />
            ))
          )}
        </>
      )}
    </div>
  );
};

export default ChatMessages;
