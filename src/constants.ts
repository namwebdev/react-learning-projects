export const ROUTES = {
  login: "/auth",
  authError: "/auth/auth-code-error",
  home: "/",
  dashboard: "/dashboard",
  createWorkspace: "/dashboard/create-workspace",
  workspace: (id: string) => `/dashboard/workspace/${id}`,
  channel: (id: string) => `/dashboard/workspace/channel/${id}`,
} as const;
