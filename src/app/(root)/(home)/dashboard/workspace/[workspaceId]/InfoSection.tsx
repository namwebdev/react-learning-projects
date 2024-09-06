"use client";

import { useState } from "react";
import { FaArrowDown, FaArrowUp, FaPlus } from "react-icons/fa6";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import Typography from "@/components/ui/typography";
import { Channel, User, Workspace } from "@/types";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/constants";

interface Props {
  userData: User;
  currentWorkspaceData: Workspace;
  userWorkspaceChannels: Channel[];
  currentChannelId: string | undefined;
}

export const InfoSection = ({
  userWorkspaceChannels,
  currentChannelId,
  currentWorkspaceData,
}: Props) => {
  const [isChannelCollapsed, setIsChannelCollapsed] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const router = useRouter();

  return (
    <div className="fixed text-white bg-neutral-800 left-20 rounded-l-xl md:w-52 lg:w-[350px] h-[calc(100%-63px)] z-20 flex flex-col items-center">
      <div className="w-full flex flex-col gap-2 p-3">
        <Collapsible
          open={isChannelCollapsed}
          onOpenChange={() => setIsChannelCollapsed((prevState) => !prevState)}
          className="flex flex-col gap-2"
        >
          <div className="flex items-center justify-between">
            <CollapsibleTrigger className="flex items-center gap-2">
              {isChannelCollapsed ? <FaArrowDown /> : <FaArrowUp />}
              <Typography variant="p" text="Channels" className="font-bold" />
            </CollapsibleTrigger>
            <div className="cursor-pointer p-2 rounded-full hover:bg-primary-dark">
              <FaPlus onClick={() => setDialogOpen(true)} />
            </div>
          </div>

          <CollapsibleContent>
            {userWorkspaceChannels.map((channel) => {
              const activeChannel = currentChannelId === channel.id;

              return (
                <Typography
                  key={channel.id}
                  variant="p"
                  text={`# ${channel.name}`}
                  className={cn(
                    "px-2 py-1 rounded-sm cursor-pointer hover:bg-primary-dark",
                    activeChannel && "bg-primary-dark"
                  )}
                  onClick={() => router.push(ROUTES.channel(channel.id))}
                />
              );
            })}
          </CollapsibleContent>
        </Collapsible>
      </div>
    </div>
  );
};
