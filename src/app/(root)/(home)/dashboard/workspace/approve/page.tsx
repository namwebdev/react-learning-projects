"use client";

import { useEffect, useState } from "react";
import { ROUTES } from "@/constants";
import { supabaseBrowserClient } from "@/lib/supabase/supabase.client";
import { redirect, useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import Typography from "@/components/ui/typography";

function ApproveUserToWorkspacePage() {
  const searchParams = useSearchParams()!;
  const workspaceId = searchParams.get("workspaceId");
  const userId = searchParams.get("userId");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const init = async () => {
      if (!workspaceId || !userId) {
        setError("No workspaceId or userId provided");
        return
      }
      const { error } = await supabaseBrowserClient.rpc(
        "add_member_to_workspace",
        {
          user_id: userId,
          workspace_id: workspaceId,
        }
      );
      if (error) {
        setError("Error adding member to workspace.");
        return;
      }

      toast.success("Member added to workspace. Navigate to workspace page.");
      return router.push(ROUTES.workspace(workspaceId));
    };

    init();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      {error ? (
        <Typography text={error} variant="h3"  />
      ) : (
        <Loader2 className="w-8 h-8 animate-spin mb-4" />
      )}
    </div>
  );
}

export default ApproveUserToWorkspacePage;
