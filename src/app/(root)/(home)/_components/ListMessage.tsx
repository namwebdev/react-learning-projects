"use client";

import { useMessages } from "@/lib/store/messages";
import { MutableRefObject, useEffect, useRef, useState } from "react";
import MessageItem from "./MessageItem";
import { supabaseBrowserClient as supabase } from "@/lib/supabase/supabase.client";
import { Message, MessageWithSender } from "@/types";

const ListMessage = () => {
  const { messages, optimisticId, optimisticUpdateNewMessId, addMessage } =
    useMessages();
  const scrollRef = useRef() as MutableRefObject<HTMLDivElement>;
  const [userScrolled, setUserScrolled] = useState(false);

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (scrollContainer && !userScrolled) {
      scrollContainer.scrollTop = scrollContainer.scrollHeight;
    }
  }, [messages, userScrolled]);
  useEffect(() => {
    const subscription = supabase
      .channel("chat-room")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages" },
        async (payload) => {
          addNewMessage(payload.new as Message);
        }
      )
      .subscribe();
    return () => {
      subscription.unsubscribe();
    };
  });

  const addNewMessage = async (message: Message) => {
    if (optimisticId) {
      optimisticUpdateNewMessId(message.id);
      return;
    }
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", message.user_id)
      .single();
    if (error) {
      console.error("addNewMessage to ListMessage error: ", error);
      return;
    }

    const newMess: MessageWithSender = {
      ...message,
      users: {
        id: data.id,
        name: data.name,
        avatar_url: data.avatar_url!,
      },
    };
    addMessage(newMess);
  };
  const handleScroll = () => {
    const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
    const isAtBottom = scrollHeight - scrollTop === clientHeight;
    setUserScrolled(!isAtBottom);
  };

  return (
    <div
      className="flex-1 flex flex-col p-5 h-full overflow-y-auto"
      ref={scrollRef}
      onScroll={handleScroll}
    >
      <div className="flex-1" />
      <div className="space-y-7">
        {messages
          .slice()
          .reverse()
          .map((value, index) => (
            <MessageItem key={messages.length - 1 - index} message={value} />
          ))}
      </div>
    </div>
  );
};

export default ListMessage;
