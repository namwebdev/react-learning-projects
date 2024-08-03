import React from "react";
import { ChatBottomBar } from "./ChatBottomBar";
import ChatTopBar from "./ChatTopBar";
import { MessageList } from "./MessageList";

export const MessageContainer = () => {
  return (
    <div>
      <ChatTopBar />

      <div className="w-full overflow-y-auto overflow-x-hidden h-full flex flex-col">
        <MessageList />
        <ChatBottomBar />
      </div>
    </div>
  );
};
