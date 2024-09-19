import { Message, MessageWithSender } from "@/types";
import { create } from "zustand";

interface State {
  messages: MessageWithSender[];
  hasMore: boolean;
  optimisticId: string;

  setOptimisticId: (id: string) => void;
  optimisticUpdateNewMessId: (id: string) => void;
  addMessagesToTail: (messages: MessageWithSender[]) => void;
  addMessage: (message: MessageWithSender) => void;

  optimisticMessage: (message: Message) => void;
}

export const useMessages = create<State>((set) => ({
  messages: [],
  hasMore: false,
  optimisticId: "",

  setOptimisticId: (id) => set({ optimisticId: id }),
  optimisticUpdateNewMessId: (newMessageId: string) =>
    set(({ messages, optimisticId }) => {
      if (!optimisticId) return { messages };

      const optimisticMessage = messages.find(
        (message) => message.id === optimisticId
      );
      if (optimisticMessage) optimisticMessage.id = newMessageId;

      return { messages: [...messages], optimisticId: "" };
    }),
  addMessagesToTail: (messages: MessageWithSender[]) =>
    set((state) => ({ messages: [...state.messages, ...messages] })),
  addMessage: (message) =>
    set((state) => ({ messages: [message, ...state.messages] })),
  optimisticMessage: (message) =>
    set((state) => ({
      messages: state.messages.map((mess) =>
        mess.id === message.id ? { ...mess, ...message } : mess
      ),
    })),
}));
