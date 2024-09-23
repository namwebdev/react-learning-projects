import { imagekit } from "@/lib/imageKit";
import React from "react";
import { CustomizePanel } from "./_components/CustomizePanel";

export default async function CustomizePage({
  params,
}: {
  params: { fileId: string };
}) {
  const file = await imagekit.getFileDetails(params.fileId);

  return (
    <div className="container mx-auto space-y-8 py-8 px-4">
      <CustomizePanel file={file} />
    </div>
  );
}
