"use client";

import { ROUTES } from "@/constants";
import { supabaseBrowserClient } from "@/lib/supabase/supabase.client";
import { useRouter } from "next/navigation";

export const Header = () => {
  const router = useRouter();

  const onSignOut = async () => {
    await supabaseBrowserClient.auth.signOut();
    router.push(ROUTES.login);
  };
  return (
    <div className="w-screen fixed top-0 left-0 shadow-sm px-6 py-4 fr justify-between">
      <div>Logo</div>
      <div>
        <button onClick={onSignOut}>Sign out</button>
      </div>
    </div>
  );
};
