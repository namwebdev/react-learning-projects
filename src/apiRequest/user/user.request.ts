import { api } from "../_base";

interface User {
  id: string;
  name: string;
  phone: string;
  address: string;
}

export const userApi = {
  getMe: async (token: string) => {
    return api.request<User>({
      path: "/user",
      method: "GET",
      token,
    });
  },
};
