import { NextUIProvider } from "@nextui-org/react";
import { ReactNode } from "react";

export default function Providers({
  children,
  // userId,
  // profileComplete,
}: {
  children: ReactNode;
  // userId: string | null;
  // profileComplete: boolean;
}) {
  return (
    // <SessionProvider>
    <NextUIProvider>
      {/* <ToastContainer
              position="bottom-right"
              hideProgressBar
            /> */}
      {children}
    </NextUIProvider>
    // </SessionProvider>
  );
}
