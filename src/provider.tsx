"use client";

import { ToastProvider } from "@heroui/toast";
import { useRouter } from "next/navigation";
import { HeroUIProvider } from "@heroui/system";
import { createContext, useContext } from "react";
import { ImageKitProvider } from "imagekitio-next";

export const ImageKitAuthContext = createContext<{
    authenticate: () => Promise<{
        signature: string;
        token: string;
        expire: number;
    }>;
}>({
    authenticate: async () => ({ signature: "", token: "", expire: 0 }),
});

export const useImageKitAuth = () => useContext(ImageKitAuthContext);

const authenticator = async () => {
    try {
        const response = await fetch("/api/imagekit-auth");
        const data = await response.json();
        console.log("🚀 ~ authenticator ~ data:", data)
        return data;
    } catch (error) {
        console.error("Authentication error:", error);
        throw error;
    }
};

export function Provider({ children }: {
    children: React.ReactNode;
}) {
    const router = useRouter();

    return (
        <HeroUIProvider navigate={router.push}>
            <ImageKitProvider
                authenticator={authenticator}
                publicKey={process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY || ""}
                urlEndpoint={process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT || ""}
            >
                <ImageKitAuthContext.Provider value={{ authenticate: authenticator }}>

                    <ToastProvider placement="top-right" />
                    {children}
                </ImageKitAuthContext.Provider>
            </ImageKitProvider>
        </HeroUIProvider>
    )
}