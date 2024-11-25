import { getMessagesByContainer } from "@/actions/message.action";
import React from "react";

export default async function MessagesPage({
  searchParams,
}: {
  searchParams: { container: string };
}) {
  const messages = await getMessagesByContainer(searchParams.container);

  return <div>MessagesPage</div>;
}
