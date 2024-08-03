import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { User } from "@/db/dummy";
import React from "react";
import { ScrollArea } from "../ui/scroll-area";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useSelectedUser } from "@/store/useSelectedUser";
import { usePreferences } from "@/store/usePreferences";
import useSound from "use-sound";

interface SidebarProps {
  isCollapsed: boolean;
  users: User[];
}

export const Sidebar = ({ isCollapsed, users }: SidebarProps) => {
  const [playClickSound] = useSound("/sounds/mouse-click.mp3");
  const { soundEnabled } = usePreferences();
  const { setSelectedUser, selectedUser } = useSelectedUser();

  const { user } = useKindeBrowserClient();

  return (
    <div className="group relative flex flex-col h-full gap-4 p-2 data-[collapsed=true]:p-2  max-h-full overflow-auto bg-background">
      <ScrollArea className="gap-2 px-2 group-[[data-collapsed=true]]:justify-center group-[[data-collapsed=true]]:px-2">
        {users.map((user, idx) => (
          <TooltipProvider key={idx}>
            <Tooltip delayDuration={0}>
              <TooltipTrigger asChild>
                <div
                  className="cursor-pointer flex items-center gap-3"
                  onClick={() => {
                    soundEnabled && playClickSound();
                    setSelectedUser(user);
                  }}
                >
                  <Avatar className="my-1 flex justify-center items-center">
                    <AvatarImage
                      src={user.image || "/user-placeholder.png"}
                      alt="User Image"
                      className="border-2 border-white rounded-full w-10 h-10"
                    />
                    <AvatarFallback>{user.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="">{user.name}</div>
                </div>
              </TooltipTrigger>
              <TooltipContent side="right" className="flex items-center gap-4">
                {user.name}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ))}
      </ScrollArea>
    </div>
  );
};
