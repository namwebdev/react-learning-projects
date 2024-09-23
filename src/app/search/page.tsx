import { imagekit } from "@/lib/imageKit";
import { unstable_noStore } from "next/cache";
import ImageCardList from "./_components/ImageCardList";
import { UploadButton } from "./_components/UploadButton";

async function SearchPage({ searchParams }: { searchParams: { q: string } }) {
  unstable_noStore();

  const files = await imagekit.listFiles({
    tags: searchParams.q,
  });

  return (
    <div>
      <div className="flex mb-5 justify-end">
        <UploadButton />
      </div>
      <ImageCardList files={files} />
    </div>
  );
}

export default SearchPage;
