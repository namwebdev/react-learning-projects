import React from "react";
import ChatForm from "./_ChatForm";
import MessageList from "./_MessageList";
import { getAuthUserId } from "@/actions/auth.action";
import { createChatId } from "@/lib/utils";
import { getMessageThread } from "@/actions/message.action";

export default async function ChatPage({
  params,
}: {
  params: { userId: string };
}) {
  const userId = await getAuthUserId();
  const messages = await getMessageThread(params.userId);

  const chatId = createChatId(userId, params.userId);

  return (
    <>
      <MessageList
        chatId={chatId}
        currentUserId={userId}
        initialMessages={messages}
      />
      <ChatForm />
    </>
  );
}
