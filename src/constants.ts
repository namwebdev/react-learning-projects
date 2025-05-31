export const AUTH_SESSION_NAME = "auth-session";

export const ROUTES = {
  home: "/",
  // auth routes
  auth: "/auth",
  authError: "/auth/auth-code-error",

  login: "/login",

  //admin routes
  admin: "/admin",
  adminCars: "/admin/cars/",
} as const;

export const bodyTypes = [
  { id: 1, name: "SUV", image: "/body/suv.webp" },
  { id: 2, name: "Sedan", image: "/body/sedan.webp" },
  { id: 3, name: "Hatchback", image: "/body/hatchback.webp" },
  { id: 4, name: "Convertible", image: "/body/convertible.webp" },
];