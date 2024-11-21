export const ROUTES = {
  home: "/",
  login: "/login",
  register: "/register",
  registerSuccess: "/register/success",
  verifyEmail: "/verify-email",
  member: "/members",
  memberDetail: (id: string) => `/members/${id}`,
  memberEdit: "/members/edit",
}
