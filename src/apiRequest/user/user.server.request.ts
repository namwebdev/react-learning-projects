import { userApi } from "./user.request";
import { AUTH_SESSION_NAME } from "@/constants";
import { cookies } from "next/headers";

export const userServerApi = {
  getMe: () => {
    const token = cookies().get(AUTH_SESSION_NAME)?.value;
    return userApi.getMe(token!);
  },
};
