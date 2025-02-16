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
import { P, paragraphVariants } from "@/components/custom/p";
import { RiGithubFill, RiLoader3Fill } from "@remixicon/react";
import Link from "next/link";

interface Props {
  action: "Sign In" | "Sign Up";
}

export const AuthForm = ({ action }: Props) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const login = async () => {
    await authClient.signIn.social(
      {
        provider: "github",
        callbackURL: "/dashboard",
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
          {action}
        </CardTitle>
        <CardDescription>{action} to access your account</CardDescription>
      </CardHeader>

      <CardContent className="space-y-3">
        <Button variant="lift" disabled={isLoading} onClick={login}>
          {" "}
          {!isLoading ? (
            <RiGithubFill />
          ) : (
            <RiLoader3Fill className="animate-spin" />
          )}{" "}
          {action} with google
        </Button>

        <P
          variant="muted"
          size="small"
          weight="light"
          className="w-full text-center"
        >
          {action === "Sign In" ? (
            <>
              Don&apos;t have an account?{" "}
              <Link href="/sign-up" className="link">
                Sign Up
              </Link>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <Link href="/sign-in" className="link">
                Sign In
              </Link>
            </>
          )}
        </P>
      </CardContent>
    </Card>
  );
};
