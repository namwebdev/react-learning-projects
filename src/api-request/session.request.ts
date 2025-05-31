import { UserWithSession } from "@/lib/auth/auth-types";
import { api } from "./_base";

export const sessionApi = {
  getUserSession: () => {
    return api.request<UserWithSession>({
      path: "/user/session",
      method: "GET",
      secure: true,
    });
  },
};
