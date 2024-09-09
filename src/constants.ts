import { channel } from "diagnostics_channel";

export const ROUTES = {
  login: "/auth",
  authError: "/auth/auth-code-error",
  home: "/",
  dashboard: "/dashboard",
  createWorkspace: "/dashboard/create-workspace",
  workspace: (id: string) => `/dashboard/workspace/${id}`,
  channel: (workspaceId: string, channelId: string) =>
    `/dashboard/workspace/${workspaceId}/channel/${channelId}`,
} as const;

export const SOCKET_API_URL = "/api/web-socket/io";

export const API_END_POINTS = {
  socketChannelMessages: "/api/web-socket/channel-messages",
  messages: "/api/messages",
};
