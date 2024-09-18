import UserStateStore from "@/lib/store/user-state";
import { ChatHeader } from "./_components/ChatHeader";
import { ChatSection } from "./_components/ChatSection";
import { getUserData } from "./_action";
import { LogoutButton } from "./LogoutButton";
import ChatInput from "./_components/ChatInput";

export default async function Home() {
  const data = await getUserData();
  if (!data)
    return (
      <div>
        <LogoutButton />
        Error fetching user data
      </div>
    );

  return (
    <>
      <section className="max-w-3xl mx-auto md:py-10 h-screen">
        <div className=" h-full border rounded-md flex flex-col relative">
          <ChatHeader />
          <ChatSection />
          <ChatInput />
        </div>
      </section>

      <UserStateStore user={data} />
    </>
  );
}
