import { create } from "zustand";

type Preference = {
  soundEnabled: boolean;
  setSoundEnabled: (soundEnabled: boolean) => void;
};

export const usePreferences = create<Preference>((set) => ({
  soundEnabled: true,
  setSoundEnabled: (soundEnabled) => set({ soundEnabled }),
}));
