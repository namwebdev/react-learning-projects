"use client";

import { ImageKitProvider } from "imagekitio-next";

const publicKey = process.env.NEXT_PUBLIC_PUBLIC_KEY;
const urlEndpoint = process.env.NEXT_PUBLIC_URL_ENDPOINT;
const authenticator = async () => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/auth`);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Request failed with status ${response.status}: ${errorText}`
      );
    }

    const data = await response.json();
    const { signature, expire, token } = data;
    return { signature, expire, token };
  } catch (err) {
    const error = err as Error;
    throw new Error(`Authentication request failed: ${error.message}`);
  }
};

export function Provider({ children }: { children: React.ReactNode }) {
  return (
    <ImageKitProvider
      publicKey={publicKey}
      urlEndpoint={urlEndpoint}
      authenticator={authenticator}
    >
      {children}
    </ImageKitProvider>
  );
}
