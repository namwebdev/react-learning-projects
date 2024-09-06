import {
  getCurrentWorkspaceData,
  getUserWorkspaceData,
} from "@/actions/workspace.action";
import Sidebar from "@/components/Sidebar/Sidebar";
import { ROUTES } from "@/constants";
import { redirect } from "next/navigation";
import { InfoSection } from "./InfoSection";

async function WorkspacePage({
  params: { workspaceId },
}: {
  params: { workspaceId: string };
}) {
  const { data, error } = await getUserWorkspaceData(workspaceId);
  if (error) return redirect(ROUTES.home);

  const { data: currWorkspaceData, error: currWorkspaceErr } =
    await getCurrentWorkspaceData(workspaceId);
  if (currWorkspaceErr) return redirect(ROUTES.home);
  console.log("WorkspacePage ", data, currWorkspaceData);

  return (
    <div>
      <Sidebar />
      {/* <InfoSection /> */}
    </div>
  );
}

export default WorkspacePage;
