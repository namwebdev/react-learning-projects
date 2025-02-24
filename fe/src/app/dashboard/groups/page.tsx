import getServerSession from "@/lib/auth/server-session";
import PageHeader from "../_components/page-header";
import GroupCardWrapper from "./_components/group-card";
import { redirect } from "next/navigation";

const GroupsPage = async () => {
    const session = await getServerSession();

    if (!session) return redirect("/sign-in");

    return (
        <>
            {/* Header */}
            <PageHeader
                title="Telegram Groups"
                description="Manage your registered Telegram groups"
            />

            {/* <GroupCardWrapper userId={session.user.id} /> */}
        </>
    );
};

export default GroupsPage;
