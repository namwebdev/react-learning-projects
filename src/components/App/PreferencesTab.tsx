"use client"

import { usePreferences } from "@/store/usePreferences";
import React from "react";
import useSound from "use-sound";
import { Button } from "../ui/button";
import { Volume2, VolumeX } from "lucide-react";

export const PreferencesTab = () => {
  const { soundEnabled, setSoundEnabled } = usePreferences();
  const [playSoundOn] = useSound("/sounds/sound-on.mp3", { volume: 0.3 });
  const [playSoundOff] = useSound("/sounds/sound-off.mp3", { volume: 0.3 });
  return (
    <div className="flex flex-wrap gap-2 px-1 md:px-2">
      <Button
        variant={"outline"}
        size={"icon"}
        onClick={() => {
          setSoundEnabled(!soundEnabled);
          soundEnabled ? playSoundOff() : playSoundOn();
        }}
      >
        {soundEnabled ? (
          <Volume2 className="size-[1.2rem] text-muted-foreground" />
        ) : (
          <VolumeX className="size-[1.2rem] text-muted-foreground" />
        )}
      </Button>
    </div>
  );
};
