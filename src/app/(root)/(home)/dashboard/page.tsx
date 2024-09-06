"use client";

import { Button } from "@/components/ui/Button";
import { ROUTES } from "@/constants";
import { supabaseBrowserClient as sbc } from "@/lib/supabase/supabase.client";
import { Workspace } from "@/types";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function DashboardPage() {
  const router = useRouter();
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);

  useEffect(() => {
    const getAllWorkspacesForUser = async () => {
      const {
        data: { user },
      } = await sbc.auth.getUser();
      if (!user) router.push(ROUTES.login);

      const { data: workspaces, error } = await sbc
        .from("workspaces")
        .select("*")
        .contains("members", [user?.id]);

      if (error)
        return { error, message: "Failed to fetch workspaces for user" };
      setWorkspaces(workspaces);
    };

    getAllWorkspacesForUser();
  }, []);

  return (
    <div>
      <Button onClick={() => router.push(ROUTES.createWorkspace)}>
        Create Workspace
      </Button>
      <div className="flex flex-col gap-2 mt-5">
        {workspaces.map((workspace) => (
          <Link href={ROUTES.workspace(workspace.id)} key={workspace.id}>
            {workspace.name}
          </Link>
        ))}
      </div>
    </div>
  );
}
