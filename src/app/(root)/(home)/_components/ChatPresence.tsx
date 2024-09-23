"use client";

import { useUser } from "@/lib/store/user";
import { supabaseBrowserClient } from "@/lib/supabase/supabase.client";
import React, { useEffect, useState } from "react";

export const ChatPresence = () => {
  const { user } = useUser();
  const [onlineUsers, setOnlineUsers] = useState(0);

  useEffect(() => {
    const channel = supabaseBrowserClient.channel("room1");
    channel
      .on("presence", { event: "sync" }, () => {
        const presenceState = channel.presenceState();
        const userIds = [];
        for (const id in presenceState) {
          // @ts-ignore
          userIds.push(presenceState[id][0].user_id);
        }
        setOnlineUsers(userIds.length);
      })
      .subscribe(async (status) => {
        if (status === "SUBSCRIBED") {
          await channel.track({
            online_at: new Date().toISOString(),
            user_id: user?.id,
          });
        }
      });

    return () => {
      channel.unsubscribe();
    };
  }, [user]);
  return (
    <div className="flex items-center gap-1">
      <div className="h-4 w-4 bg-green-500 rounded-full animate-pulse"></div>
      <h1 className="text-sm text-gray-400">{onlineUsers} onlines</h1>
    </div>
  );
};
