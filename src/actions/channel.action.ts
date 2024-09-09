"use server";

import { supabaseServerClient } from "@/lib/supabase/supabase.server";
import { SupabaseClient } from "@supabase/supabase-js";
import { validate } from "uuid";

interface CreateChannelData {
  workspaceId: string;
  name: string;
  userId: string;
}
export const createChannel = async ({
  name,
  userId,
  workspaceId,
}: CreateChannelData) => {
  const supabase = await supabaseServerClient();

  const { data, error } = await supabase
    .from("channels")
    .insert({
      name,
      user_id: userId,
      workspace_id: workspaceId,
    })
    .select("*");
  if (error || !data?.[0])
    return {
      error,
      message: "Failed to create channel",
    };

  const newChannel = data?.[0];

  const { error: addChannelError } = await addChannelToUser({
    channelId: newChannel.id,
    userId,
  });
  if (addChannelError)
    return {
      error: addChannelError,
      message: "Failed to add channel to user",
    };

  const { error: updateChannelMembersError } = await updateChannelMembers(
    supabase,
    {
      channelId: newChannel.id,
      userId,
    }
  );
  if (updateChannelMembersError)
    return {
      error: updateChannelMembersError,
      message: "Failed to update channel members",
    };

  const { error: updateWorkspaceChannelError } = await updateWorkspaceChannel(
    supabase,
    {
      channelId: newChannel.id,
      workspaceId,
    }
  );
  if (updateWorkspaceChannelError)
    return {
      error: updateWorkspaceChannelError,
      message: "Failed to update workspace channel",
    };

  return { data: newChannel };
};

export const getUserWorkspaceChannels = async ({
  userId,
  workspaceId,
}: {
  userId: string;
  workspaceId: string;
}) => {
  if (!validate(userId)) return { error: "Invalid user id" };
  if (!validate(workspaceId)) return { error: "Invalid workspace id" };

  const supabase = await supabaseServerClient();
  const { data, error } = await supabase
    .from("workspaces")
    .select("channels")
    .eq("id", workspaceId)
    .single();
  if (error)
    return { error, message: "Failed to fetch user workspace channels" };

  const channelIds = data.channels;
  if (!channelIds) return { data: [] };

  const { data: channelsData, error: channelsErr } = await supabase
    .from("channels")
    .select("*")
    .in("id", channelIds);
  if (channelsErr) {
    console.error("getUserWorkspaceChannels", channelsErr);
    return { error: channelsErr, message: "Failed to fetch channels" };
  }

  return { data: channelsData };
};

interface ChannelData {
  userId: string;
  channelId: string;
}
const addChannelToUser = async ({ channelId, userId }: ChannelData) => {
  const supabase = await supabaseServerClient();

  const { error } = await supabase.rpc("update_user_channels", {
    user_id: userId,
    channel_id: channelId,
  });

  return { error };
};
const updateChannelMembers = async (
  supabase: SupabaseClient,
  { channelId, userId }: ChannelData
) => {
  const { error } = await supabase.rpc("update_channel_members", {
    new_member: userId,
    channel_id: channelId,
  });
  return { error };
};
const updateWorkspaceChannel = async (
  supabase: SupabaseClient,
  { channelId, workspaceId }: { channelId: string; workspaceId: string }
) => {
  const { error } = await supabase.rpc("add_channel_to_workspace", {
    channel_id: channelId,
    workspace_id: workspaceId,
  });

  return { error };
};
