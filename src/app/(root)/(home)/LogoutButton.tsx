"use client";

import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants";
import { supabaseBrowserClient } from "@/lib/supabase/supabase.client";
import { useRouter } from "next/navigation";

export const LogoutButton = () => {
  const router = useRouter();

  const handleLogout = async () => {
    await supabaseBrowserClient.auth.signOut();
    router.push(ROUTES.auth);
  };

  return <Button variant="outline" size="sm" onClick={handleLogout}>Logout</Button>;
};
