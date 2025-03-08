import { api } from "./_base";

export const authApi = {
  login: (phone: string, password: string) => {
    return api.request<{
      token: string;
    }>({
      path: "/login",
      method: "POST",
      body: { phone, password },
    })
  }
}