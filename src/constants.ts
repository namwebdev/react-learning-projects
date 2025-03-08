export const AUTH_SESSION_NAME = "auth-session";

export const ROUTES = {
  home: "/",
  // auth routes
  login: "/login",
  signOut: "/logout",
  verifyRequest: "/verify-request",
  register: "/register",
  // protected routes
  dashboard: "/dashboard",

} as const;
