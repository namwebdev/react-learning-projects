import React from "react";
import { ChatBottomBar } from "./ChatBottomBar";
import ChatTopBar from "./ChatTopBar";
import { MessageList } from "./MessageList";
import { ScrollArea } from "../ui/scroll-area";

export const MessageContainer = () => {
  return (
    <div>
      <ChatTopBar />

      <div className="w-full overflow-y-auto overflow-x-hidden h-full flex flex-col">
        <ScrollArea className="h-[400px] w-full rounded-md border">
          <MessageList />
        </ScrollArea>
        <ChatBottomBar />
      </div>
    </div>
  );
};
