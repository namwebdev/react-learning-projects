"use client"

import { useState } from "react";
import { RiLoader3Fill, RiHardDrive2Fill } from "@remixicon/react";

import { ISubscription } from "@/lib/database/schema/subscription.model";
import { formatFileSize } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { P, paragraphVariants } from "@/components/custom/p";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

export const StorageCard = ({ isLoading, subs }: {
    isLoading: boolean;
    subs: ISubscription;
}) => {
    const [isAlertOpen, setIsAlertOpen] = useState(false);
    const usedStorage = formatFileSize(subs?.usedStorage);
    const selectedStorage = formatFileSize(subs?.selectedStorage);
    const percentageUsedStorage =
        (subs?.usedStorage / subs?.selectedStorage) * 100;

    return (
        <>
            <Card className="bg-primary text-white border-none shadow-lg transition-all hover:shadow-xl rounded-lg">
                <CardContent className="space-y-2 py-8">
                    <div className="flex gap-x-6 items-center justify-between">
                        <div className="space-y-4">
                            <P
                                className="flex items-center justify-start gap-2 w-full h-fit"
                                size="large"
                                weight="bold"
                            >
                                {!isLoading ? (
                                    <RiHardDrive2Fill />
                                ) : (
                                    <RiLoader3Fill className="animate-spin" />
                                )}{" "}
                                Storage
                            </P>

                            {!isLoading ? (
                                <>
                                    <span
                                        className={cn(
                                            paragraphVariants({ size: "small", weight: "medium" }),
                                            "text-start w-full inline-block"
                                        )}
                                    >
                                        <b>Available Storage</b> {usedStorage} / {selectedStorage}
                                    </span>
                                    <Progress
                                        value={percentageUsedStorage}
                                        className="bg-white/20"
                                    />
                                </>
                            ) : (
                                <Skeleton className="w-40 h-5 rounded-md bg-white/50" />
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </>
    )
}