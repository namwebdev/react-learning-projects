"use client";

import { addImage } from "@/actions/user.action";
import {
  CldUploadButton,
  CloudinaryUploadWidgetResults,
} from "next-cloudinary";
import { useRouter } from "next/navigation";
import { HiPhoto } from "react-icons/hi2";

export default function MemberPhotoUpload() {
  const router = useRouter();
  const onUploadImage = async (result: CloudinaryUploadWidgetResults) => {
    if (result.info && typeof result.info === "object") {
      await addImage(result.info.secure_url, result.info.public_id);
      router.refresh();
      return;
    }

    console.error("Failed to upload image");
  };

  return (
    <div>
      <CldUploadButton
        options={{ maxFiles: 1 }}
        onSuccess={onUploadImage}
        signatureEndpoint="/api/sign-image"
        uploadPreset="matchme-demo"
        className={`flex items-center gap-2 border-2 border-default text-default 
          rounded-lg py-2 px-4 hover:bg-default/10`}
      >
        <HiPhoto size={28} />
        Upload new image
      </CldUploadButton>
    </div>
  );
}
