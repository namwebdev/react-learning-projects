"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { authClient } from "@/lib/auth/auth-client";
import { paragraphVariants } from "@/components/custom/p";
import { RiGithubFill, RiLoader3Fill } from "@remixicon/react";

const SignInPage = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const login = async () => {
    await authClient.signIn.social(
      {
        provider: "github",
        callbackURL: `${window.location.origin}/dashboard`,
      },
      {
        onSuccess: () => {
          toast({
            title: "Success",
            description: "You have successfully logged in",
          });
        },
        onError: (c) => {
          toast({
            title: "Error",
            description: c.error.message,
          });
        },
        onRequest: () => {
          setIsLoading(true);
        },
        onResponse: () => {
          setIsLoading(false);
        },
      }
    );
  };

  return (
    <Card className="w-96 drop-shadow-2xl">
      <CardHeader>
        <CardTitle
          className={paragraphVariants({ size: "large", weight: "bold" })}
        >
          Sign in
        </CardTitle>
        <CardDescription>Sign in to access your account</CardDescription>
      </CardHeader>

      <CardContent className="space-y-3">
        <Button variant="lift" disabled={isLoading} onClick={login}>
          {" "}
          {!isLoading ? (
            <RiGithubFill />
          ) : (
            <RiLoader3Fill className="animate-spin" />
          )}{" "}
          Sign in with Github
        </Button>
      </CardContent>
    </Card>
  );
};

export default SignInPage;
