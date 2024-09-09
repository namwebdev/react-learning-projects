"use server";

import { supabaseServerClient } from "@/lib/supabase/supabase.server";
import { getUserData } from "./user.action";
import { validate } from "uuid";
import { SupabaseClient } from "@supabase/supabase-js";

interface Workspace {
  imageUrl: string;
  name: string;
  slug: string;
  invite_code: string;
}

export const createWorkspace = async ({
  imageUrl,
  name,
  slug,
  invite_code,
}: Workspace) => {
  const supabase = await supabaseServerClient();
  const userData = await getUserData();
  if (!userData) {
    return { error: "User not found" };
  }
  const { error, data: workspaceRecord } = await supabase
    .from("workspaces")
    .insert({
      image_url: imageUrl,
      name,
      super_admin: userData.id,
      slug,
      invite_code,
    })
    .select("*");

  if (error)
    return {
      error,
      message: "Failed to create workspace",
    };

  const newWorkspace = workspaceRecord?.[0];
  const { error: addWorkspaceError } = await addWorkspaceToUser(supabase, {
    userId: userData.id,
    workspaceId: newWorkspace.id,
  });
  if (addWorkspaceError)
    return {
      error: addWorkspaceError,
      message: "Failed to add workspace to user",
    };

  const { error: addMemberError } = await addMemberToWorkspace(supabase, {
    userId: userData.id,
    workspaceId: newWorkspace.id,
  });
  if (addMemberError)
    return {
      error: addMemberError,
      message: "Failed to add member to workspace",
    };

  return { data: workspaceRecord?.[0] };
};

export const getAllWorkspacesForUser = async (userId: string) => {
  if (!validate(userId)) return { error: "Invalid user id" };

  const supabase = await supabaseServerClient();
  const { data: workspaces, error } = await supabase
    .from("workspaces")
    .select("*")
    .contains("members", [userId]);

  if (error) return { error, message: "Failed to fetch workspaces for user" };

  return workspaces;
};

export const getUserWorkspaceData = async (workspaceId: string) => {
  if (!validate(workspaceId)) return { error: "Invalid workspace id" };

  const supabase = await supabaseServerClient();
  const { data, error } = await supabase
    .from("workspaces")
    .select("*")
    .in("id", [workspaceId]);
  if (error) return { error };

  return { data: data?.[0] };
};

export const getCurrentWorkspaceData = async (workspaceId: string) => {
  if (!validate(workspaceId)) return { error: "Invalid workspace id" };

  const supabase = await supabaseServerClient();
  const { data, error } = await supabase
    .from("workspaces")
    .select("*, channels (*)")
    .eq("id", workspaceId)
    .single();
  if (error) return { error, message: "Failed to fetch workspace data" };

  const { members } = data;
  const memberDetails = await Promise.all(
    members.map(async (memberId: string) => {
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("*")
        .eq("id", memberId)
        .single();
      if (userError)
        return { error: userError, message: "Failed to fetch user data" };

      return userData;
    })
  );

  data.members = memberDetails.filter((member) => member !== null);
  return { data };
};
interface WorkspaceData {
  userId: string;
  workspaceId: string;
}
export const addWorkspaceToUser = async (
  supabase: SupabaseClient,
  { userId, workspaceId }: WorkspaceData
) => {
  const { data, error } = await supabase.rpc("add_workspace_to_user", {
    user_id: userId,
    new_workspace: workspaceId,
  });
  return { data, error };
};

export const addMemberToWorkspace = async (
  supabase: SupabaseClient,
  { userId, workspaceId }: WorkspaceData
) => {
  const { data, error } = await supabase.rpc("add_member_to_workspace", {
    user_id: userId,
    workspace_id: workspaceId,
  });
  return { data, error };
};
