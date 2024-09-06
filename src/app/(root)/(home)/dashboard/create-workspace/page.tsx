"use client";

import { createWorkspace } from "@/actions/workspace.action";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import Typography from "@/components/ui/typography";
import { UploadthingImageUpload } from "@/components/UploadthingImageUpload";
import { ROUTES } from "@/constants";
import { useCreateWorkspaceValues } from "@/hooks/create-workspace-values.ts";
import { UploadButton } from "@/lib/uploadthing";
import { useRouter } from "next/navigation";
import { useState } from "react";
import slugify from "slugify";
import { toast } from "sonner";
import { v4 as uuid } from "uuid";

function CreateWorkspacePage() {
  const { currStep } = useCreateWorkspaceValues();

  let stepInView: JSX.Element;
  switch (currStep) {
    case 1:
      stepInView = <Step1 />;
      break;
    case 2:
      stepInView = <Step2 />;
      break;
  }

  return (
    <div className="w-screen h-screen grid place-content-center bg-neutral-800 text-white">
      <div className="p-3 max-w-[550px]">
        <Typography
          text={`step ${currStep} of 2`}
          variant="p"
          className="text-neutral-400"
        />

        {stepInView}
      </div>
    </div>
  );
}

export default CreateWorkspacePage;

const Step1 = () => {
  const { name, updateValues, setCurrStep } = useCreateWorkspaceValues();
  return (
    <>
      <Typography
        text="What is the name of your company or team"
        className="my-4"
      />
      <Typography
        text="This will be the name of your ZSlack workspace - choose something that your team will recognize."
        className="text-neutral-300"
        variant="p"
      />

      <form className="mt-6">
        <fieldset>
          <Input
            className="bg-neutral-700 text-white border-neutral-600"
            type="text"
            value={name}
            placeholder="Enter your company name"
            onChange={(e) => updateValues({ name: e.target.value })}
          />
          <Button
            type="button"
            className="mt-10"
            onClick={() => setCurrStep(2)}
            disabled={!name}
          >
            <Typography text="Next" variant="p" />
          </Button>
        </fieldset>
      </form>
    </>
  );
};

const Step2 = () => {
  const { imageUrl, updateImageUrl, setCurrStep, name, reset } =
    useCreateWorkspaceValues();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    const slug = slugify(name);
    const invite_code = uuid();
    const { data, error } = await createWorkspace({
      imageUrl,
      name,
      slug,
      invite_code,
    });
    setIsSubmitting(false);
    if (error) {
      console.error("Step 2 - Handle Submit error: ", error);
      return toast.error("Couldn't create workspace. Please try again.");
    }

    toast.success("Workspace created successfully");

    setTimeout(() => {
      reset();
      router.push(ROUTES.workspace(data.id));
    }, 1000);
  };

  return (
    <>
      <Button
        size="sm"
        className="text-white"
        variant="link"
        onClick={() => setCurrStep(1)}
      >
        <Typography text="Back" variant="p" />
      </Button>

      <form>
        <Typography text="Add workspace avatar" className="my-4" />
        <Typography
          text="This image can be changed later in your workspace settings."
          className="text-neutral-300"
          variant="p"
        />
        <fieldset
          disabled={isSubmitting}
          className="mt-6 flex flex-col items-center space-y-9"
        >
          <UploadthingImageUpload />

          <div className="space-x-5">
            <Button
              onClick={() => {
                updateImageUrl("");
                handleSubmit();
              }}
            >
              <Typography text="Skip for now" variant="p" />
            </Button>

            {imageUrl && (
              <Button
                type="button"
                onClick={handleSubmit}
                size="sm"
                variant="destructive"
              >
                <Typography text="Submit" variant="p" />
              </Button>
            )}
          </div>
        </fieldset>
      </form>
    </>
  );
};
