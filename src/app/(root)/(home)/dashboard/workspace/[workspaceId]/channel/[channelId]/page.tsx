"use client";

import ChatGroup from "@/components/Chat/ChatGroup";
import { ROUTES } from "@/constants";
import { useChatStateValues } from "@/hooks/chat-state-values";
import { supabaseBrowserClient } from "@/lib/supabase/supabase.client";
import { QueryProvider } from "@/providers/query.provider";
import { WebSocketProvider } from "@/providers/websocket.provider";
import { Channel } from "@/types";
import { Loader2 } from "lucide-react";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";

function ChannelPage({
  params: { channelId, workspaceId },
}: {
  params: { channelId: string; workspaceId: string };
}) {
  const [loading, setLoading] = useState(true);
  const { setCurrChannel, setCurrUser } = useChatStateValues();

  useEffect(() => {
    const init = async () => {
      const {
        data: { user },
      } = await supabaseBrowserClient.auth.getUser();
      if (!user) {
        console.error("User not found");
        return redirect(ROUTES.home);
      }

      const { data, error } = await supabaseBrowserClient
        .from("channels")
        .select("*")
        .eq("id", channelId)
        .single<Channel>();
      if (error) {
        console.error("Failed to fetch channel data", error);
        return redirect(ROUTES.home);
      }
      setCurrChannel(data!);
      setCurrUser(user);

      setLoading(false);
    };

    init();
  }, []);

  return (
    <WebSocketProvider>
      <QueryProvider>
        {loading ? (
          <Loader2 className="w-8 h-8 animate-spin" />
        ) : (
          <ChatGroup workspaceId={workspaceId} />
        )}
      </QueryProvider>
    </WebSocketProvider>
  );
}

export default ChannelPage;
