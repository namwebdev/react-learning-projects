import { verifyToken } from "@/actions/auth.action";
import CardWrapper from "@/components/CardWrapper";
import ResultMessage from "@/components/ResultMessage";
import React from "react";
import { MdOutlineMailOutline } from "react-icons/md";

async function VerifyEmailPage({
  searchParams,
}: {
  searchParams: { token: string };
}) {
  const result = await verifyToken(searchParams.token);

  return (
    <CardWrapper
      headerText="Verify your email address"
      headerIcon={MdOutlineMailOutline}
      footer={<ResultMessage result={result} />}
    />
  );
}

export default VerifyEmailPage;
