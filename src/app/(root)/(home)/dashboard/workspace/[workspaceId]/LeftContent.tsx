import { getCurrentWorkspaceData } from "@/actions/workspace.action";
import Sidebar from "@/components/Sidebar/Sidebar";
import { ROUTES } from "@/constants";
import { redirect } from "next/navigation";
import { InfoSection } from "./InfoSection";
import { getUserData } from "@/actions/user.action";
import { getUserWorkspaceChannels } from "@/actions/channel.action";

async function LeftContent({ workspaceId }: { workspaceId: string }) {
  const userData = await getUserData();
  if (!userData?.id) {
    console.error("WorkspacePage - User not found");
    return redirect(ROUTES.home);
  }

  const { data: currWorkspaceData, error: currWorkspaceErr } =
    await getCurrentWorkspaceData(workspaceId);
  if (currWorkspaceErr) {
    console.error("WorkspacePage - Failed to fetch current workspace data");
    return redirect(ROUTES.home);
  }

  const { data: userWorkspaceChannelsData, error: userWorkspaceChannelsErr } =
    await getUserWorkspaceChannels({
      userId: userData.id,
      workspaceId,
    });
  if (userWorkspaceChannelsErr) {
    console.error("WorkspacePage - Failed to fetch user workspace channels");
    return redirect(ROUTES.home);
  }

  return (
    <InfoSection
      userData={userData}
      currentWorkspaceData={currWorkspaceData}
      userWorkspaceChannels={userWorkspaceChannelsData || []}
    />
  );
}

export default LeftContent;
