"use client"

import { Table, TableHead, TableRow, TableHeader, TableCell, TableBody } from "@/components/ui/table";
import { ArrowUp, ArrowDown, ArrowUpDown, AlertTriangle, ExternalLink } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { UrlWithUser } from "../_types";
import { Pagination, PaginationPrevious, PaginationContent, PaginationItem, PaginationNext, PaginationLink, PaginationEllipsis } from "@/components/ui/pagination";

interface UrlsTableProps {
    urls: UrlWithUser[];
    total: number;
    currentPage: number;
    currentSearch: string;
    currentSortBy: string;
    currentSortOrder: string;
    highlightStyle?: "security" | "inappropriate" | "other" | "none";
}
const limit = 10;

export function UrlsTable({
    urls,
    total,
    currentPage,
    currentSearch,
    currentSortBy,
    currentSortOrder,
    highlightStyle,
}: UrlsTableProps) {
    const router = useRouter();
    const [copyingId, setCopyingId] = useState<number | null>(null);

    const basePath =
        typeof window !== "undefined" ? window.location.pathname : "/admin/urls";
    const preserveParams = () => {
        if (typeof window === "undefined") return "";

        const url = new URL(window.location.href);
        const params = new URLSearchParams(url.search);
        let paramString = "";

        // Preserve filter parameter if it exists
        if (params.has("filter")) {
            paramString += `&filter=${params.get("filter")}`;
        }

        return paramString;
    };
    const totalPage = Math.ceil(total / limit);

    const getHighlightStyles = (url: UrlWithUser) => {
        if (!url.flagged) return "";

        switch (highlightStyle) {
            case "security":
                return "bg-red-50/50 dark:bg-red-900/10 hover:bg-red-50/80 dark:hover:bg-red-900/20";
            case "inappropriate":
                return "bg-orange-50/50 dark:bg-orange-900/10 hover:bg-orange-50/80 dark:hover:bg-orange-900/20";
            case "other":
                return "bg-yellow-50/50 dark:bg-yellow-900/10 hover:bg-yellow-50/80 dark:hover:bg-yellow-900/20";
            default:
                return url.flagged ? "bg-yellow-50/50 dark:bg-yellow-900/10" : "";
        }
    };
    const getFlagIconColor = () => {
        switch (highlightStyle) {
            case "security":
                return "text-red-500 dark:text-red-400";
            case "inappropriate":
                return "text-orange-500 dark:text-orange-400";
            case "other":
                return "text-yellow-500 dark:text-yellow-400";
            default:
                return "text-yellow-600 dark:text-yellow-400";
        }
    };
    const getSortIcon = (column: string) => {
        if (currentSortBy !== column) {
            return <ArrowUpDown className="ml-2 size-4" />;
        }

        return currentSortOrder === "asc" ? (
            <ArrowUp className="ml-2 size-4" />
        ) : (
            <ArrowDown className="ml-2 size-4" />
        );
    };
    const handleSort = (column: string) => {
        const params = new URLSearchParams();

        if (currentSearch) {
            params.set("search", currentSearch);
        }

        params.set("sortBy", column);

        if (currentSortBy === column) {
            params.set("sortOrder", currentSortOrder === "asc" ? "desc" : "asc");
        } else {
            params.set("sortOrder", "asc");
        }

        params.set("page", "1");

        router.push(`${basePath}?${params.toString()}`);
    };
    const getPaginationItems = () => {
        const items = [];
        const additionalParams = preserveParams();

        // always show first page
        items.push(
            <PaginationItem key={"first"}>
                <PaginationLink
                    href={`${basePath}?page=1${currentSearch ? `&search=${currentSearch}` : ""
                        }${currentSortBy
                            ? `&sortBy=${currentSortBy}&sortOrder=${currentSortOrder}`
                            : ""
                        }${additionalParams}`}
                    isActive={currentPage === 1}
                >
                    1
                </PaginationLink>
            </PaginationItem>
        );

        if (currentPage > 3) {
            items.push(
                <PaginationItem key={"ellipsis-1"}>
                    <PaginationEllipsis />
                </PaginationItem>
            );
        }

        for (
            let i = Math.max(2, currentPage - 1);
            i <= Math.min(totalPage - 1, currentPage + 1);
            i++
        ) {
            if (i === 1 || i === totalPage) continue;

            items.push(
                <PaginationItem key={i}>
                    <PaginationLink
                        href={`${basePath}?page=${i}${currentSearch ? `&search=${currentSearch}` : ""
                            }${currentSortBy
                                ? `&sortBy=${currentSortBy}&sortOrder=${currentSortOrder}`
                                : ""
                            }${additionalParams}`}
                        isActive={currentPage === i}
                    >
                        {i}
                    </PaginationLink>
                </PaginationItem>
            );
        }

        if (currentPage < totalPage - 2) {
            items.push(
                <PaginationItem key={"ellipsis-2"}>
                    <PaginationEllipsis />
                </PaginationItem>
            );
        }

        if (totalPage > 1) {
            items.push(
                <PaginationItem key={"last"}>
                    <PaginationLink
                        href={`${basePath}?page=${totalPage}${currentSearch ? `&search=${currentSearch}` : ""
                            }${currentSortBy
                                ? `&sortBy=${currentSortBy}&sortOrder=${currentSortOrder}`
                                : ""
                            }${additionalParams}`}
                        isActive={currentPage === totalPage}
                    >
                        {totalPage}
                    </PaginationLink>
                </PaginationItem>
            );
        }

        return items;
    };

    return (
        <div className="space-y-4">
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[300px]">
                                <button
                                    className="flex items-center font-medium"
                                    onClick={() => handleSort("originalUrl")}
                                >
                                    Original URL
                                    {getSortIcon("originalUrl")}
                                </button>
                            </TableHead>
                            <TableHead className="w-[150px]">
                                <button
                                    className="flex items-center font-medium"
                                onClick={() => handleSort("shortCode")}
                                >
                                    Short Code
                                    {getSortIcon("shortCode")}
                                </button>
                            </TableHead>
                            <TableHead className="w-[100px]">
                                <button
                                    className="flex items-center font-medium"
                                onClick={() => handleSort("clicks")}
                                >
                                    Clicks
                                    {getSortIcon("clicks")}
                                </button>
                            </TableHead>
                            <TableHead className="w-[150px]">
                                <button
                                    className="flex items-center font-medium"
                                onClick={() => handleSort("userName")}
                                >
                                    Created By
                                    {getSortIcon("userName")}
                                </button>
                            </TableHead>
                            <TableHead className="w-[150px]">
                                <button
                                    className="flex items-center font-medium"
                                onClick={() => handleSort("createdAt")}
                                >
                                    Created
                                    {getSortIcon("createdAt")}
                                </button>
                            </TableHead>
                            <TableHead className="w-[80px] text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {urls.length === 0 ? (
                            <TableRow>
                                <TableCell>
                                    {currentSearch
                                        ? "No URLs found with the search term."
                                        : "No URLs found."}
                                </TableCell>
                            </TableRow>
                        ) : (
                            urls.map((url) => (
                                <TableRow key={url.id} className={getHighlightStyles(url)}>
                                    <TableCell className="font-medium">
                                        <div className="flex items-center gap-2">
                                            {url.flagged && (
                                                <div
                                                    className={getFlagIconColor()}
                                                    title={url.flagReason || "Flagged By AI"}
                                                >
                                                    <AlertTriangle className="size-4" />
                                                </div>
                                            )}
                                            <a
                                                href={url.originalUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-600 hover:underline flex items-center gap-1 max-w-[250px] truncate"
                                            >
                                                {truncateUrl(url.originalUrl)}
                                                <ExternalLink className="size-3" />
                                            </a>
                                        </div>
                                        {url.flagged && url.flagReason && (
                                            <div className="mt-1 text-xs text-yellow-600 dark:text-yellow-400 max-w-[250px] truncate">
                                                Reason: {url.flagReason}
                                            </div>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {totalPage > 1 && (
                <Pagination>
                    <PaginationContent>
                        <PaginationItem>
                            <PaginationPrevious
                                href={`${basePath}?page=${Math.max(1, currentPage - 1)}${currentSearch ? `&search=${currentSearch}` : ""
                                    }${currentSortBy
                                        ? `&sortBy=${currentSortBy}&sortOrder=${currentSortOrder}`
                                        : ""
                                    }${preserveParams()}`}
                            />
                        </PaginationItem>

                        {getPaginationItems()}

                        <PaginationItem>
                            <PaginationNext
                                href={`${basePath}?page=${Math.min(
                                    totalPage,
                                    currentPage + 1
                                )}${currentSearch ? `&search=${currentSearch}` : ""}${currentSortBy
                                    ? `&sortBy=${currentSortBy}&sortOrder=${currentSortOrder}`
                                    : ""
                                    }${preserveParams()}`}
                            />
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            )}
        </div>
    )
}

const truncateUrl = (url: string, maxLenght = 50) => {
    if (url.length <= maxLenght) return url;
    return url.substring(0, maxLenght) + "...";
};

