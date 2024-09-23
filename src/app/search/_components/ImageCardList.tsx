"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { HeartFilledIcon } from "@radix-ui/react-icons";
import { FileObject } from "imagekit/dist/libs/interfaces";
import { IKImage } from "imagekitio-next";
import Link from "next/link";
import React from "react";

interface Props {
  files: FileObject[];
  counts?: {
    memeId: string;
    count: number;
  }[];
}

const ImageCardList = ({ files, counts }: Props) => {
  if (files.length === 0)
    return (
      <div className="text-center text-3xl font-semibold">No memes found</div>
    );
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4 md:gap-5 lg:gap-8">
      {files.map(({ fileId, customMetadata, name, filePath }) => (
        <Card key={fileId}>
          <CardHeader>
            <CardTitle className="flex justify-between">
              <div>{customMetadata?.displayName || name}</div>
              {/* Favorite */}
              {/* <div className="flex gap-1 items-center">
              <HeartFilledIcon />
              {counts.find((c) => c.memeId === fileId)?.count ?? 0}
            </div> */}
            </CardTitle>
          </CardHeader>

          <CardContent>
            <IKImage
              key={fileId}
              path={filePath}
              alt={name}
              width={300}
              height={300}
            />
          </CardContent>

          <CardFooter>
            <Link href={`/customize/${fileId}`}>Customize</Link>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default ImageCardList;
