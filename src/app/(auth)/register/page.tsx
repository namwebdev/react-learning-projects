"use client";

import { registerSchema, RegisterSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Card, CardBody, CardHeader } from "@nextui-org/react";
import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { GiPadlock } from "react-icons/gi";
import RegisterForm from "./_RegisterForm";
import { register } from "@/actions/auth.action";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/constants/routes";

function Register() {
  const router = useRouter();

  const registerFormMethods = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
    mode: "onTouched",
  });

  const {
    handleSubmit,
    getValues,
    formState: { errors, isValid, isSubmitting },
  } = registerFormMethods;

  const onSubmit = async () => {
    const res = await register(getValues());
    if (res.status) {
      router.push(ROUTES.registerSuccess);
    }
    console.log("🚀 ~ onSubmit ~ res:", res);
  };

  return (
    <Card className="w-3/5 mx-auto">
      <CardHeader className="flex flex-col items-center justify-center">
        <div className="flex flex-col gap-2 items-center text-default">
          <div className="flex flex-row items-center gap-3">
            <GiPadlock size={30} />
            <h1 className="text-3xl font-semibold">Register</h1>
          </div>
          <p className="text-neutral-500">Welcome to NextMatch</p>
        </div>
      </CardHeader>

      <CardBody>
        <FormProvider {...registerFormMethods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-4">
              <RegisterForm />

              <div className="flex flex-row items-center gap-6">
                <Button
                  isLoading={isSubmitting}
                  fullWidth
                  color="default"
                  type="submit"
                >
                  Submit
                </Button>
              </div>
            </div>
          </form>
        </FormProvider>
      </CardBody>
    </Card>
  );
}

export default Register;
