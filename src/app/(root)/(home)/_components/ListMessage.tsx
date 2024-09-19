"use client";

import { useMessages } from "@/lib/store/messages";
import {
  MutableRefObject,
  useEffect,
  useRef,
  useState,
  useCallback,
} from "react";
import MessageItem from "./MessageItem";
import { supabaseBrowserClient as supabase } from "@/lib/supabase/supabase.client";
import { Message, MessageWithSender } from "@/types";
import { BiLoader } from "react-icons/bi";

const ListMessage = () => {
  const {
    messages,
    optimisticId,
    optimisticUpdateNewMessId,
    addMessage,
    optimisticMessage,
    addMessagesToTail,
  } = useMessages();
  const scrollRef = useRef() as MutableRefObject<HTMLDivElement>;
  const [userScrolled, setUserScrolled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

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
        (payload) => {
          addNewMessage(payload.new as Message);
        }
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "messages" },
        (payload) => {
          console.log("🚀 ~ useEffect ~ payload:", payload);
          optimisticMessage(payload.new as Message);
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

  const fetchMessages = useCallback(async () => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);
    const oldestMessageTimestamp = messages[messages.length - 1]?.created_at;

    const { data, error } = await supabase
      .from("messages")
      .select("*, users(*)")
      .order("created_at", { ascending: false })
      .lt("created_at", oldestMessageTimestamp)
      .limit(20);

    if (error) {
      console.error("Error fetching messages:", error);
      setHasMore(false);
      setIsLoading(false);
      return;
    }

    if (data.length === 0) {
      setHasMore(false);
      setIsLoading(false);
      return;
    }
    addMessagesToTail(data as MessageWithSender[]);
    setIsLoading(false);
  }, [messages, isLoading, hasMore, addMessage]);

  const handleScroll = () => {
    const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
    const isAtBottom = scrollHeight - scrollTop === clientHeight;
    setUserScrolled(!isAtBottom);

    // Check if scrolled near the top
    if (scrollTop < 100 && !isLoading && hasMore) {
      // Scroll down a bit before fetching new messages
      const scrollAmount = 50; // Adjust this value as needed
      scrollRef.current.scrollTop += scrollAmount;
      
      fetchMessages();
    }
  };

  return (
    <div
      className="flex-1 flex flex-col p-5 h-full overflow-y-auto"
      ref={scrollRef}
      onScroll={handleScroll}
    >
      {!hasMore && !isLoading && (
        <div className="flex justify-center items-center text-gray-400 text-sm mb-5">
          <p>There is no more message</p>
        </div>
      )}
      {isLoading && (
        <div className="flex-1 flex justify-center items-center">
          <BiLoader size={20} className="animate-spin" />
        </div>
      )}
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
