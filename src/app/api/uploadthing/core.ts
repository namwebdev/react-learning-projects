import { getUserData } from "@/actions/user.action";
import { createUploadthing, type FileRouter } from "uploadthing/next";

const MAX_FILE_SIZE = "4MB";

const f = createUploadthing();

const currentUser = async () => {
  const user = await getUserData();
  return { userId: user?.id };
};

export const ourFileRouter = {
  workspaceImage: f({
    image: { maxFileSize: MAX_FILE_SIZE, maxFileCount: 1 },
  })
    .middleware(() => currentUser())
    .onUploadComplete(() => {
      console.info("api - uploadthing - core: Upload complete");
    }),
} satisfies FileRouter;
export type OurFileRouter = typeof ourFileRouter;
