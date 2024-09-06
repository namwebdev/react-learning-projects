import { Workspace } from "@/types";

type SidebarNavProps = {
  userWorkspacesData: Workspace[];
  currentWorkspaceData: Workspace;
};

export default function SidebarNav({}: Partial<SidebarNavProps>) {
  return (
    <nav>
      <ul className="flex flex-col space-y-4">
        <li>Text</li>
      </ul>
    </nav>
  );
}
