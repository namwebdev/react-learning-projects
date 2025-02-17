import PageFiles from "./_components/page-files";
import SubscriptionPage from "./_components/page-subscription";

interface Props {
  params: Promise<{
    page:
    | "subscription"
    | "documents"
    | "images"
    | "videos"
    | "others"
    | "shared";
  }>;
}

const page = async ({ params }: Props) => {
  const _page = (await params).page;
  const page = _page.endsWith("s") ? _page.slice(0, -1) : _page;

  return (
    <>
      <h1 className="capitalize">{page}</h1>
      <br />
      <PageFiles page={page} />
    </>
  );
};

export default page;
