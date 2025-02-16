"use client"

import { useQuery } from "@tanstack/react-query";
import React from "react";
import { getSubscription } from "./_actions";
import { P } from "@/components/custom/p";
import { StorageCard } from "./_components/storage-card";
import { RiLoader3Fill } from "@remixicon/react";

const SubscriptionPage = () => {
    const {
        data: subscription,
        isLoading,
        error,
    } = useQuery({
        queryKey: ["subscription"],
        queryFn: getSubscription,
        refetchOnMount: false,
        refetchOnReconnect: false,
        refetchOnWindowFocus: false,
    });

    if (error)
        return (
            <P weight="bold" size="large">
                {error.message}
            </P>
        );

    if (isLoading) return (
        <div className="flex items-center justify-center h-full">
            <RiLoader3Fill className="animate-spin" />
        </div>
    )

    if (!subscription?.data) return (
        <P weight="bold" size="large">
            Subscription not found. Please log out and log in again to refresh your session.
        </P>
    )

    return (
        <div className="space-y-6">
            <StorageCard isLoading={isLoading} subs={subscription?.data} />
        </div>
    )
};

export default SubscriptionPage;
