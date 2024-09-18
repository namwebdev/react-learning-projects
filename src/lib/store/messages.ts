import { MessageWithSender } from "@/types";
import { create } from "zustand";

interface State {
  messages: MessageWithSender[];
  hasMore: boolean;
  optimisticId: string;

  setOptimisticId: (id: string) => void;
  optimisticUpdateNewMessId: (id: string) => void;
  addMessage: (message: MessageWithSender) => void;
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
  addMessage: (message) =>
    set((state) => ({ messages: [message, ...state.messages] })),
}));
