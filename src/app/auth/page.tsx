"use client";

import { BsSlack } from "react-icons/bs";
import { RxGithubLogo } from "react-icons/rx";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Provider } from "@supabase/supabase-js";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { MdOutlineAutoAwesome } from "react-icons/md";
import Typography from "@/components/ui/typography";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { supabaseBrowserClient } from "@/lib/supabase/supabase.client";
import { toast } from "@/hooks/use-toast";

const formSchema = z.object({
  email: z.string().email().min(2, { message: "Email must be 2 characters" }),
});

const AuthPage = () => {
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  async function socialAuth(provider: Provider) {
    setIsAuthenticating(true);
    await supabaseBrowserClient.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${location.origin}/auth/callback`,
      },
    });
    setIsAuthenticating(false);
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
            variant="outline"
            className="py-6 border-2 flex space-x-3"
            onClick={() => socialAuth("github")}
          >
            <RxGithubLogo size={30} />
            <Typography
              className="text-xl"
              text="Sign in with Github"
              variant="p"
            />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
