import { User, Workspace } from "@/types";
import SidebarNav from "./SidebarNav";

type SidebarProps = {
  userWorksapcesData: Workspace[];
  currentWorkspaceData: Workspace;
  userData: User;
};

function Sidebar({}: Partial<SidebarProps>) {
  return (
    <aside
      className="
      fixed
      top-0
      left-0
      pt-[68px]
      pb-8
      z-30
      flex
      flex-col
      justify-between
      items-center
      h-screen
      w-20
  "
    >
      <SidebarNav />
    </aside>
  );
}

export default Sidebar;
