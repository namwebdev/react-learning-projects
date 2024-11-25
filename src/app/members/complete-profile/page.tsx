"use client";

import CardWrapper from "@/components/CardWrapper";
import { ProfileSchema, profileSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { RiProfileLine } from "react-icons/ri";
import { ProfileDetailsForm } from "./_ProfileDetailsForm";
import { Button } from "@nextui-org/react";
import { updateUserInfo } from "@/actions/user.action";

function CompleteProfilePage() {
  const methods = useForm<ProfileSchema>({
    resolver: zodResolver(profileSchema),
    mode: "onTouched",
  });
  const {
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
  } = methods;
  const onSubmit = async (data: ProfileSchema) => {
    const res = await updateUserInfo(data);
    if (res.status === "success") {
      console.log("Profile updated successfully");
    }
  };
  return (
    <div className="lg:max-w-[600px] mx-auto">
      <CardWrapper
        fullWidth
        headerText="About you"
        subHeaderText="Please complete your profile to continue to the app"
        headerIcon={RiProfileLine}
        body={
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="space-y-4">
                <ProfileDetailsForm />

                {errors.root?.serverError && (
                  <p className="text-danger text-sm">
                    {errors.root.serverError.message}
                  </p>
                )}

                <div className="flex flex-row items-center gap-6">
                  <Button
                    isLoading={isSubmitting}
                    isDisabled={!isValid}
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
        }
      />
    </div>
  );
}

export default CompleteProfilePage;
