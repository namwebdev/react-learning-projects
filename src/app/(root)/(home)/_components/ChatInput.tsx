"use client";

import React, { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { supabaseBrowserClient } from "@/lib/supabase/supabase.client";
import { Input } from "@/components/ui/input";
import { BiSend } from "react-icons/bi";
import { Button } from "@/components/ui/button";
import { FaRegStopCircle } from "react-icons/fa";
import { useMessages } from "@/lib/store/messages";
import { MessageWithSender } from "@/types";
import { v4 as uuid } from "uuid";
import { useUser } from "@/lib/store/user";

export default function ChatInput() {
  const [isSending, setIsSending] = useState(false);
  const [message, setMessage] = useState("");
  const { addMessage, setOptimisticId } = useMessages();
  const { user } = useUser();

  const handleSendMessage = async (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (!message.trim()) return;

    setIsSending(true);

    const newMess: MessageWithSender = {
      id: uuid(),
      content: message,
      created_at: new Date().toISOString(),
      is_deleted: false,
      is_edited: false,
      user_id: user.id,
      users: {
        id: user.id,
        avatar_url: user.avatar_url,
        name: user.name,
      },
    };

    addMessage(newMess);
    setOptimisticId(newMess.id);
    const { error } = await supabaseBrowserClient
      .from("messages")
      .insert({ content: message });

    resetChat();

    if (error) {
      console.error("handleSendMessage error: ", error);
      toast({
        title: "Error",
        description: "Failed to send message",
      });
      return;
    }
  };
  const resetChat = () => {
    setMessage("");
    setIsSending(false);
  };

  return (
    <div className="p-5 flex items-center gap-2">
      <Input
        type="text"
        placeholder="Type your message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") handleSendMessage(e);
        }}
        className="flex-grow"
      />

      <Button variant="ghost" disabled={!message.trim() || isSending}>
        {isSending ? <FaRegStopCircle size={28} /> : <BiSend size={28} />}
      </Button>
    </div>
  );
}
