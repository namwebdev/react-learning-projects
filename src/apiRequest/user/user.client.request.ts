import { getCookie } from "@/lib/cookie";
import { userApi } from "./user.request";
import { AUTH_SESSION_NAME } from "@/constants";

export const userClientApi = {
  getMe: () => {
    const token = getCookie(AUTH_SESSION_NAME);
    return userApi.getMe(token!);
  },
};
