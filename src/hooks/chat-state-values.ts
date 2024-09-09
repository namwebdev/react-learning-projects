import { create } from "zustand";
import { Channel } from "@/types";
import { User } from '@supabase/auth-js';

type Values = {
  currUser: User;
  currChannel: Channel;
  setCurrChannel: (channel: Channel) => void;
  setCurrUser: (user: User) => void;
};

export const useChatStateValues = create<Values>((set) => ({
  currChannel: {} as Channel,
  currUser: {} as User,
  setCurrChannel: (channel) => set({ currChannel: channel }),
  setCurrUser: (user) => set({ currUser: user }),
}));
