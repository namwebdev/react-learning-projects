"use client";

import React, { useEffect, useRef } from "react";

import { LIMIT_MESSAGE } from "@/constants";
import { MessageWithSender } from "@/types";
import { useMessages } from "./messages";

export default function MessageStateStore({
  messages,
}: {
  messages: MessageWithSender[];
}) {
  const initState = useRef(false);
  const hasMore = messages.length >= LIMIT_MESSAGE;

  useEffect(() => {
    if (!initState.current) {
      useMessages.setState({ messages, hasMore });
    }
    initState.current = true;
    // eslint-disable-next-line
  }, []);

  return <></>;
}
