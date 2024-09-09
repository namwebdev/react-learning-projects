import React from "react";
import LeftContent from "./LeftContent";
import { InfoSection } from "./InfoSection";

function WorkspaceLayout({
  params: { workspaceId },
  children,
}: {
  params: { workspaceId: string };
  children: React.ReactNode;
}) {
  return (
    <section>
      <div className="fixed text-white bg-neutral-800 left-0 rounded-l-xl md:w-52 lg:w-[350px] h-[calc(100%-63px)] z-20 flex flex-col items-center">
        <LeftContent workspaceId={workspaceId} />
      </div>
      <div className="p-4 ml-56 lg:ml-72">{children}</div>
    </section>
  );
}

export default WorkspaceLayout;
