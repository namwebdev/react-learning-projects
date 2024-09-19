"use client";

import { ROUTES } from "@/constants";
import { supabaseBrowserClient } from "@/lib/supabase/supabase.client";
import { useRouter } from "next/navigation";

export const LogoutButton = () => {
  const router = useRouter();

  const handleLogout = async () => {
    await supabaseBrowserClient.auth.signOut();
    router.push(ROUTES.auth);
  };

  return <button onClick={handleLogout}>Logout</button>;
};
