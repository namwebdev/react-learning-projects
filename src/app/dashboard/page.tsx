"use client"

import FileUploadForm from "@/components/FileUploadForm";
import { Tabs, Tab } from "@heroui/tabs";
import { FileText, FileUp, User } from "lucide-react";
import { useState } from "react";
import { Card, CardBody, CardHeader } from "@heroui/card";
import FileList from "@/components/FileList";

function DashboardPage() {
    const [activeTab, setActiveTab] = useState<"files" | "profile">("files");




    return (
        <>
            <Tabs
                aria-label="Dashboard Tabs"
                color="primary"
                variant="underlined"
                selectedKey={activeTab}
                onSelectionChange={(key) => setActiveTab(key as "files" | "profile")}
                classNames={{
                    tabList: "gap-6",
                    tab: "py-3",
                    cursor: "bg-primary",
                }}
            >
                <Tab
                    key="files"
                    title={
                        <div className="flex items-center gap-3">
                            <FileText className="h-5 w-5" />
                            <span className="font-medium">My Files</span>
                        </div>
                    }
                >
                    <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-1">
                            <Card className="border border-default-200 bg-default-50 shadow-sm hover:shadow-md transition-shadow">
                                <CardHeader className="flex gap-3">
                                    <FileUp className="h-5 w-5 text-primary" />
                                    <h2 className="text-xl font-semibold">Upload</h2>
                                </CardHeader>
                                <CardBody>
                                    <FileUploadForm
                                    // onUploadSuccess={handleFileUploadSuccess}
                                    // currentFolder={currentFolder}
                                    />
                                </CardBody>
                            </Card>
                        </div>

                        <div className="lg:col-span-2">
                            <Card className="border border-default-200 bg-default-50 shadow-sm hover:shadow-md transition-shadow">
                                <CardHeader className="flex gap-3">
                                    <FileText className="h-5 w-5 text-primary" />
                                    <h2 className="text-xl font-semibold">Your Files</h2>
                                </CardHeader>
                                <CardBody>
                                    <FileList
                                        // refreshTrigger={refreshTrigger}
                                        // onFolderChange={handleFolderChange}
                                    />
                                </CardBody>
                            </Card>
                        </div>
                    </div>
                </Tab>

                <Tab
                    key="profile"
                    title={
                        <div className="flex items-center gap-3">
                            <User className="h-5 w-5" />
                            <span className="font-medium">Profile</span>
                        </div>
                    }
                >
                    <div className="mt-8">
                        User Profile
                    </div>
                </Tab>
            </Tabs>
        </>
    )
}

export default DashboardPage;