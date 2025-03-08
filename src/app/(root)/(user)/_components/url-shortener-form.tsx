"use client";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { urlSchema } from "../schemas";
import { UrlFormData } from "../schemas";
import { useSession } from "next-auth/react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { shortenUrl } from "../_actions";
import { useRouter, usePathname } from "next/navigation";
import { toast } from "sonner";

export function UrlShortenerForm() {
    const { data: session } = useSession();
    const router = useRouter();
    const pathname = usePathname();

    const [error, setError] = useState<string | null>(null);
    const [shortUrl, setShortUrl] = useState<string | null>(null);
    const [shortCode, setShortCode] = useState<string | null>(null);
    const [flaggedInfo, setFlaggedInfo] = useState<{
        flagged: boolean;
        reason: string | null;
        message?: string;
    } | null>(null);


    const form = useForm<UrlFormData>({
        resolver: zodResolver(urlSchema),
        defaultValues: {
            url: "",
            customCode: "",
        },
    });
    const isSubmitting = form.formState.isSubmitting;

    async function onSubmit(data: UrlFormData) {
        try {
            const formData = new FormData();
            formData.append("url", data.url);

            if (data.customCode && data.customCode.trim() !== "") {
                formData.append("customCode", data.customCode.trim());
            }

            const response = await shortenUrl(formData);
            if (response.success && response.data) {
                setShortUrl(response.data.shortUrl);
                // Extract the short code from the short URL
                const shortCodeMatch = response.data.shortUrl.match(/\/r\/([^/]+)$/);
                if (shortCodeMatch && shortCodeMatch[1]) {
                    setShortCode(shortCodeMatch[1]);
                }

                if (response.data.flagged) {
                    setFlaggedInfo({
                        flagged: response.data.flagged,
                        reason: response.data.flagReason || null,
                        message: response.data.message,
                    });

                    toast.warning(response.data.message || "This URL is flagged", {
                        description: response.data.flagReason,
                        duration: 20000,

                    });
                } else {
                    toast.success("URL shortened successfully");
                }
            }

            if (!response.success) {
                setError(response.error || "An error occurred. Please try again.");
            }

            if (session?.user && pathname.includes("/dashboard")) {
                router.refresh();
            }

            if (!session?.user) {
                // setShowSignupDialog(true);
            }
        } catch (error) {
            setError("An error occurred. Please try again.");
            console.error(error);
        }
    }
    return (
        <>
            <div className="w-full max-w-2xl mx-auto">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <div className="flex flex-col sm:flex-row gap-2">

                            <FormField
                                control={form.control}
                                name="url"
                                render={({ field }) => (
                                    <FormItem className="flex-1">
                                        <FormControl>
                                            <Input
                                                placeholder="Paste your long URL here"
                                                {...field}
                                                disabled={false}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting ? (
                                    <>
                                        <span className="mr-2 size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                        Shortening...
                                    </>
                                ) : (
                                    "Shorten"
                                )}
                            </Button>
                        </div>

                        <FormField
                            control={form.control}
                            name="customCode"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <div className="flex items-center">
                                            <span className="text-sm text-muted-foreground mr-2">
                                                {process.env.NEXT_PUBLIC_APP_URL ||
                                                    window.location.origin}
                                                /r/
                                            </span>
                                            <Input
                                                placeholder="Custom code (optional)"
                                                {...field}
                                                value={field.value || ""}
                                                onChange={(e) => field.onChange(e.target.value || "")}
                                                disabled={isSubmitting}
                                                className="flex-1"
                                            />
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {error && (
                            <div className="p-3 bg-destructive/10 text-destructive rounded-md text-sm">
                                {error}
                            </div>
                        )}

                    </form>
                </Form>
                {shortUrl}
                -
                {shortCode}
            </div>
        </>
    )
}