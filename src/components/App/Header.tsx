"use client"

import { AUTH_SESSION_NAME, routes } from "@/constants";
import { deleteCookie } from "@/lib/utils";
import { useRouter } from "next/navigation";

export const Header = () => {
  const router = useRouter();

  const signOut = () => {
    deleteCookie(AUTH_SESSION_NAME);
    router.push(routes.login);
  };

  return (
    <div className="w-screen fixed top-0 left-0 shadow-sm px-6 py-4 fr justify-between">
      <div>Logo</div>
      <div>
        <button onClick={signOut}>Sign out</button>
      </div>
    </div>
  );
};
