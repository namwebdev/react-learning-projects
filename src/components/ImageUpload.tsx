/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { Upload } from "lucide-react";
import { compressImage } from "@/lib/utils";

export default function ImageUpload({
  onDrop,
  imageUrl,
  setImageUrl,
}: {
  onDrop: (imageUrl: string | null) => void;
  imageUrl: string | null;
  setImageUrl: (url: string | null) => void;
}) {
  const [isUploading, setIsUploading] = useState(false);
  const { getRootProps, getInputProps, open, isDragActive, isDragReject } =
    useDropzone({
      noKeyboard: true,
      accept: {
        "image/*": [".jpeg", ".jpg", ".png"],
      },
      maxFiles: 1,
      onDrop: async (acceptedFiles) => {
        const file = acceptedFiles[0];
        if (file.size > MAX_FILE_SIZE) {
          toast.error("File size must be less than 5MB");
          return;
        }

        setIsUploading(true);
        try {
          // Compress the image before processing
          const compressedImage = await compressImage(file, 1200, 800, 0.8);
          setImageUrl(compressedImage);
          onDrop(compressedImage);
        } catch (error) {
          console.error("Error compressing image:", error);
          toast.error("Failed to process the image");
        } finally {
          setIsUploading(false);
        }
      },
    });

  return (
    <div>
      {imageUrl ? (
        <div className="flex flex-col items-center">
          <img
            src={imageUrl}
            alt="Car preview"
            className="h-40 object-contain mb-4"
          />
          <Button
            variant="outline"
            onClick={() => {
              onDrop(null);
              setImageUrl(null);
            }}
          >
            Remove Image
          </Button>
        </div>
      ) : (
        <div
          {...getRootProps()}
          className="w-full h-48 rounded-lg border-2 border-gray-300 border-dashed cursor-pointer"
        >
          <input {...getInputProps()} />

          <div className="flex flex-col items-center">
            <Upload className="h-12 w-12 text-gray-400 mb-2" />

            <p className="text-gray-500 mb-2">
              {isUploading
                ? "Compressing image..."
                : isDragActive && !isDragReject
                ? "Leave the file here to upload"
                : "Drag & drop a car image or click to select"}
            </p>

            {isDragReject && (
              <p className="text-red-500 mb-2">Invalid image type</p>
            )}
            <p className="text-gray-400 text-sm">
              Supports: JPG, PNG (max 5MB) • Images will be compressed automatically
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

const MAX_FILE_SIZE = 1024 * 1024 * 5; // 5MB
