import { USER_ID } from '@/configs/constants'
import { addToast } from '@heroui/toast';
import axios from 'axios';
import React, { useEffect, useMemo, useState } from 'react'
import FileLoading from './FileLoading';
import { FileTabs } from './FileTabs';
import { File as FileType } from '@/lib/db/schema';
import FolderNavigation from './FolderNavigation';
import FileEmpty from './FileEmpty';
import { Card } from '@heroui/card';
import {
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
} from "@heroui/table";
import { Divider } from "@heroui/divider";
import { Tooltip } from "@heroui/tooltip";
import { ExternalLink, Folder, Star } from 'lucide-react';

const userId = USER_ID

const FileList = ({ refreshTrigger, onFolderChange }: {
    refreshTrigger?: number;
    onFolderChange?: (folderId: string | null) => void;
}) => {
    const [files, setFiles] = useState<FileType[]>([]);
    const [currentFolder, setCurrentFolder] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [activeTab, setActiveTab] = useState("all");
    const [folderPath, setFolderPath] = useState<
        Array<{ id: string; name: string }>
    >([]);

    useEffect(() => {
        const fetchFiles = async () => {
            setIsLoading(true);
            try {
                let url = `/api/files?userId=${userId}`;
                if (currentFolder) {
                    url += `&parentId=${currentFolder}`;
                }
                const response = await axios.get(url);
                setFiles(response.data);
            } catch (error) {
                console.error("Error fetching files:", error);
                addToast({
                    title: "Error Loading Files",
                    description: "We couldn't load your files. Please try again later.",
                    color: "danger",
                });
            } finally {
                setIsLoading(false);
            }
        }
        fetchFiles();
    }, [refreshTrigger, currentFolder])

    const filteredFiles = useMemo(() => {
        switch (activeTab) {
            case "starred":
                return files.filter((file) => file.isStarred && !file.isTrash);
            case "trash":
                return files.filter((file) => file.isTrash);
            case "all":
            default:
                return files.filter((file) => !file.isTrash);
        }
    }, [files, activeTab]);
    const trashCount = useMemo(() => {
        return files.filter((file) => file.isTrash).length;
    }, [files]);
    const starredCount = useMemo(() => {
        return files.filter((file) => file.isStarred && !file.isTrash).length;
    }, [files]);

    // Navigate back to parent folder
    const navigateUp = () => {
        if (folderPath.length > 0) {
            const newPath = [...folderPath];
            newPath.pop();
            setFolderPath(newPath);
            const newFolderId =
                newPath.length > 0 ? newPath[newPath.length - 1].id : null;
            setCurrentFolder(newFolderId);

            // Notify parent component about folder change
            if (onFolderChange) {
                onFolderChange(newFolderId);
            }
        }
    };
    const navigateToPathFolder = (index: number) => {
        if (index < 0) {
            setCurrentFolder(null);
            setFolderPath([]);

            // Notify parent component about folder change
            if (onFolderChange) {
                onFolderChange(null);
            }
        } else {
            const newPath = folderPath.slice(0, index + 1);
            setFolderPath(newPath);
            const newFolderId = newPath[newPath.length - 1].id;
            setCurrentFolder(newFolderId);

            // Notify parent component about folder change
            if (onFolderChange) {
                onFolderChange(newFolderId);
            }
        }
    };
    const navigateToFolder = (folderId: string, folderName: string) => {
        setCurrentFolder(folderId);
        setFolderPath([...folderPath, { id: folderId, name: folderName }]);

        // Notify parent component about folder change
        if (onFolderChange) {
            onFolderChange(folderId);
        }
    };
    const handleItemClick = (file: FileType) => {
        if (file.isFolder) {
            navigateToFolder(file.id, file.name);
        } else if (file.type.startsWith("image/")) {
            if (file.type.startsWith("image/")) {
                // Create an optimized URL with ImageKit transformations for viewing
                // Using higher quality and responsive sizing for better viewing experience
                const optimizedUrl = `${process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT}/tr:q-90,w-1600,h-1200,fo-auto/${file.path}`;
                window.open(optimizedUrl, "_blank");
            }
        }
    };


    if (isLoading) {
        return <FileLoading />
    }

    return (
        <div className="space-y-6">
            {/* Tabs for filtering files */}
            <FileTabs
                activeTab={activeTab}
                onTabChange={setActiveTab}
                files={files}
                starredCount={starredCount}
                trashCount={trashCount}
            />

            {activeTab === "all" && (
                <FolderNavigation
                    folderPath={folderPath}
                    navigateUp={navigateUp}
                    navigateToPathFolder={navigateToPathFolder}
                />
            )}

            {/* Files table */}
            {filteredFiles.length === 0 ? (
                <FileEmpty activeTab={activeTab} />
            ) : (
                <Card
                    shadow="sm"
                    className="border border-default-200 bg-default-50 overflow-hidden"
                >
                    <div className="overflow-x-auto">
                        <Table
                            aria-label="Files table"
                            isStriped
                            color="default"
                            selectionMode="none"
                            classNames={{
                                base: "min-w-full",
                                th: "bg-default-100 text-default-800 font-medium text-sm",
                                td: "py-4",
                            }}
                        >
                            <TableHeader>
                                <TableColumn>Name</TableColumn>
                                <TableColumn className="hidden sm:table-cell">Type</TableColumn>
                                <TableColumn className="hidden md:table-cell">Size</TableColumn>
                                <TableColumn className="hidden sm:table-cell">
                                    Added
                                </TableColumn>
                                <TableColumn width={240}>Actions</TableColumn>
                            </TableHeader>
                            <TableBody>
                                {filteredFiles.map((file) => (
                                    <TableRow
                                        key={file.id}
                                        className={`hover:bg-default-100 transition-colors ${file.isFolder || file.type.startsWith("image/")
                                            ? "cursor-pointer"
                                            : ""
                                            }`}
                                        onClick={() => handleItemClick(file)}
                                    >
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                {/* <FileIcon file={file} /> */}
                                                <div>
                                                    <div className="font-medium flex items-center gap-2 text-default-800">
                                                        <span className="truncate max-w-[150px] sm:max-w-[200px] md:max-w-[300px]">
                                                            {file.name}
                                                        </span>
                                                        {file.isStarred && (
                                                            <Tooltip content="Starred">
                                                                <Star
                                                                    className="h-4 w-4 text-yellow-400"
                                                                    fill="currentColor"
                                                                />
                                                            </Tooltip>
                                                        )}
                                                        {file.isFolder && (
                                                            <Tooltip content="Folder">
                                                                <Folder className="h-3 w-3 text-default-400" />
                                                            </Tooltip>
                                                        )}
                                                        {file.type.startsWith("image/") && (
                                                            <Tooltip content="Click to view image">
                                                                <ExternalLink className="h-3 w-3 text-default-400" />
                                                            </Tooltip>
                                                        )}
                                                    </div>
                                                    <div className="text-xs text-default-500 sm:hidden">
                                                        {/* dòng này đã được thay thế bằng customFormatDistanceToNow */}
                                                    </div>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="hidden sm:table-cell">
                                            <div className="text-xs text-default-500">
                                                {file.isFolder ? "Folder" : file.type}
                                            </div>
                                        </TableCell>
                                        <TableCell className="hidden md:table-cell">
                                            <div className="text-default-700">
                                                {file.isFolder
                                                    ? "-"
                                                    : file.size < 1024
                                                        ? `${file.size} B`
                                                        : file.size < 1024 * 1024
                                                            ? `${(file.size / 1024).toFixed(1)} KB`
                                                            : `${(file.size / (1024 * 1024)).toFixed(1)} MB`}
                                            </div>
                                        </TableCell>
                                        <TableCell className="hidden sm:table-cell">
                                            <div>
                                                <div className="text-default-700">
                                                    {customFormatDistanceToNow(new Date(file.createdAt), {
                                                        addSuffix: true,
                                                    })}
                                                </div>
                                                <div className="text-xs text-default-500 mt-1">
                                                    {customFormatDate(new Date(file.createdAt))}
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell onClick={(e) => e.stopPropagation()}>
                                            {/* <FileActions
                                                file={file}
                                                onStar={handleStarFile}
                                                onTrash={handleTrashFile}
                                                onDelete={(file) => {
                                                    setSelectedFile(file);
                                                    setDeleteModalOpen(true);
                                                }}
                                                onDownload={handleDownloadFile}
                                            /> */}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </Card>
            )}
        </div>


    )
}

// Custom function to format distance to now (tương tự formatDistanceToNow của date-fns)
function customFormatDistanceToNow(date: Date, options?: { addSuffix?: boolean }) {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const months = Math.floor(days / 30);
    const years = Math.floor(days / 365);

    let result = '';
    if (years > 0) {
        result = `${years} năm`;
    } else if (months > 0) {
        result = `${months} tháng`;
    } else if (days > 0) {
        result = `${days} ngày`;
    } else if (hours > 0) {
        result = `${hours} giờ`;
    } else if (minutes > 0) {
        result = `${minutes} phút`;
    } else {
        result = `${seconds} giây`;
    }

    if (options?.addSuffix) {
        if (diff > 0) {
            result += ' trước';
        } else {
            result = 'sau ' + result;
        }
    }
    return result;
}

// Custom function to format date giống format(new Date(), 'MMMM d, yyyy')
function customFormatDate(date: Date) {
    const months = [
        'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
        'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'
    ];
    const month = months[date.getMonth()];
    const day = date.getDate();
    const year = date.getFullYear();
    return `${month} ${day}, ${year}`;
}

export default FileList