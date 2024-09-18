import { User } from "@/types/index";
import { create } from "zustand";

export const useUser = create<{
  user: User;
}>((set) => ({
  user: {} as User,
}));
