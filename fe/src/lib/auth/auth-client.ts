import { createAuthClient } from "better-auth/react";
import { NEXT_PUBLIC_SERVER_BASE_URL } from "@/env";

export const authClient = createAuthClient({
  baseURL: NEXT_PUBLIC_SERVER_BASE_URL,
});

export const { useSession, signOut } = authClient;
