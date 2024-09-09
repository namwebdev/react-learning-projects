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
import CreateChannelDialog from "./CreateChannelDialog";

interface Props {
  userData: User;
  currentWorkspaceData: Workspace;
  userWorkspaceChannels: Channel[];
  currentChannelId?: string;
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
    <>
      <div className="w-full flex flex-col gap-2 p-4">
        <Typography
          variant="h4"
          text={currentWorkspaceData.name}
          className="font-bold"
        />
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
                  onClick={() =>
                    router.push(
                      ROUTES.channel(currentWorkspaceData.id, channel.id)
                    )
                  }
                />
              );
            })}
          </CollapsibleContent>
        </Collapsible>
      </div>

      <CreateChannelDialog
        dialogOpen={dialogOpen}
        setDialogOpen={setDialogOpen}
        workspaceId={currentWorkspaceData.id}
        userId={currentWorkspaceData.super_admin}
      />
    </>
  );
};
