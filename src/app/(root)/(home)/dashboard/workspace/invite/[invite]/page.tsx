import { getUserData } from "@/actions/user.action";
import { addWorkspaceToUser } from "@/actions/workspace.action";
import { ROUTES } from "@/constants";
import { supabaseServerClient } from "@/lib/supabase/supabase.server";
import { Workspace } from "@/types";
import { Loader2 } from "lucide-react";
import { redirect } from "next/navigation";
import { validate } from "uuid";

interface Props {
  params: {
    invite: string;
  };
}

const addUsersToWorkspaceHandler = async (inviteCode: string) => {
  if (!validate(inviteCode)) return { error: "Invalid invite code" };

  const supabase = await supabaseServerClient();
  const userData = await getUserData();
  if (!userData) return { error: "User not found" };

  const { data, error } = await supabase
    .from("workspaces")
    .select("*")
    .eq("invite_code", inviteCode)
    .single<Workspace>();
  if (error || !data)
    return {
      error,
      details: "Error fetching workspace",
    };

  const isMember = data.members.includes(userData.id);
  if (isMember)
    return {
      ok: true,
      isMember: true,
      data: {
        workspaceId: data.id,
        userId: userData.id,
      },
    };

  const { error: addToWorkspaceErr } = await addWorkspaceToUser(supabase, {
    userId: userData.id,
    workspaceId: data.id,
  });
  if (addToWorkspaceErr)
    return {
      error: addToWorkspaceErr,
      details: "Error adding user to workspace",
    };

  return {
    ok: true,
    data: {
      workspaceId: data.id,
      userId: userData.id,
    },
  };
};

async function InviteToWorkspacePage({
  params: { invite: inviteCode },
}: Props) {
  let linkData:
    | {
        workspaceId: string;
        userId: string;
      }
    | undefined;

  const res = await addUsersToWorkspaceHandler(inviteCode);
  if (res?.error) {
    console.error(
      `InviteToWorkspacePage - Error adding user to workspace: ${res.error} - details: ${res.details}`
    );
    return redirect(ROUTES.home);
  }
  if (res?.ok) {
    if (res.isMember) {
      return redirect(ROUTES.workspace(res.data.workspaceId));
    }
    linkData = res.data;
  }
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      {linkData ? (
        <div className="text-center">
          <div>
            Send this link to your admin:
            <br />
            {`${process.env.NEXT_PUBLIC_SITE_URL}/dashboard/workspace/approve?workspaceId=${linkData.workspaceId}&userId=${linkData.userId}`}
          </div>
          <div>
            When approved, please access this link:
            <br />
            {`${process.env.NEXT_PUBLIC_SITE_URL}/dashboard/workspace/${linkData.workspaceId}`}
          </div>
        </div>
      ) : (
        <>
          <Loader2 className="w-8 h-8 animate-spin mb-4" />
          <p>Verifying invite code...</p>
        </>
      )}
    </div>
  );
}

export default InviteToWorkspacePage;
