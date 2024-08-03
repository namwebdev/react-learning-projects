"use client";

import { LoginLink, RegisterLink } from "@kinde-oss/kinde-auth-nextjs";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export const AuthButtons = () => {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="flex gap-3 flex-1 md:flex-row flex-col relative z-50">
      <RegisterLink className="flex-1" onClick={() => setIsLoading(true)}>
        <Button className="w-full" variant={"outline"} disabled={isLoading}>
          Sign Up
        </Button>
      </RegisterLink>

      <LoginLink className="flex-1">
        <Button className="w-full" disabled={isLoading}>
          Login
        </Button>
      </LoginLink>
    </div>
  );
};
