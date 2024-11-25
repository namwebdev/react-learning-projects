"use client";

import { MessageDto } from "@/types";
import React, { useCallback, useEffect, useState } from "react";
import MessageBox from "./_MessageBox";
import useMessageStore from "@/hooks/useMessagesStore";
import { formatShortDateTime } from "@/lib/utils";
import { pusherClient } from "@/lib/pusher";

type Props = {
  initialMessages: {
    messages: MessageDto[];
    readCount: number;
  };
  currentUserId: string;
  chatId: string;
};

export default function MessageList({
  initialMessages,
  currentUserId,
  chatId,
}: Props) {
  const [messages, setMessages] = useState(initialMessages.messages);

  const { updateUnreadCount } = useMessageStore((state) => ({
    updateUnreadCount: state.updateUnreadCount,
  }));
  const handleNewMessage = useCallback((message: MessageDto) => {
    setMessages((prevState) => {
      return [...prevState, message];
    });
  }, []);
  const handleReadMessages = useCallback((messageIds: string[]) => {
    setMessages((prevState) =>
      prevState.map((message) =>
        messageIds.includes(message.id)
          ? {
              ...message,
              dateRead: formatShortDateTime(new Date()),
            }
          : message
      )
    );
  }, []);

  useEffect(() => {
    const channel = pusherClient.subscribe(chatId);
    channel.bind("message:new", handleNewMessage);
    // channel.bind("messages:read", handleReadMessages);

    return () => {
      channel.unsubscribe();
      channel.unbind("message:new", handleNewMessage);
      channel.unbind("messages:read", handleReadMessages);
    };
  }, [chatId]);

  if (messages.length === 0) return <div>No messages</div>;

  return (
    <>
      {messages.map((message) => (
        <MessageBox
          key={message.id}
          message={message}
          currentUserId={currentUserId}
        />
      ))}
    </>
  );
}
