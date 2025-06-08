"use client";

import { BsSlack } from "react-icons/bs";
import { RxGithubLogo } from "react-icons/rx";
import { useState } from "react";
import { Button } from "@heroui/button";
import { CircularProgress } from "@heroui/progress";
import { Provider } from "@supabase/supabase-js";
import Typography from "@/components/Typography";
import { login } from "./_actions";

export default function AuthPage() {
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  async function socialAuth(provider: Provider) {
    setIsAuthenticating(true);
    await login(provider);
  }

  return (
    <div className="min-h-screen p-5 grid text-center place-content-center bg-white">
      <div className="max-w-[450px]">
        <div className="flex justify-center items-center gap-3 mb-4">
          <BsSlack size={30} />
          <Typography text="ZSlack" variant="h2" />
        </div>

        <Typography
          text="Sign in to your ZSlack"
          variant="h2"
          className="mb-3"
        />

        <Typography
          text="We suggest using the email address that you use at work"
          variant="p"
          className="opacity-90 mb-7"
        />

        <div className="flex flex-col space-y-4">
          <Button
            disabled={isAuthenticating}
            variant="solid"
            className="py-6 border-2 flex space-x-1"
            radius="full"
            onPress={() => socialAuth("github")}
          >
            {isAuthenticating ? <CircularProgress aria-label="Loading..." size="sm" color="default" /> : <RxGithubLogo size={30} />}
            <Typography
              className="text-xl text-foreground-700"
              text="Sign in with Github"
              variant="p"
            />
          </Button>
        </div>
      </div>
    </div>
  );
}
