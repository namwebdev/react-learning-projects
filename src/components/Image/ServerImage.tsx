import fs from "fs";
import path from "path";
import Image, { ImageProps } from "next/image";
import { StaticImport } from "next/dist/shared/lib/get-img-props";
import { getPlaiceholder } from "plaiceholder";
import { FALL_BACK_IMG_PATH, Props } from "./constants";

const fallbackImagePath = FALL_BACK_IMG_PATH;

export const ServerImage = async ({
  src,
  alt,
  fallbackSrc = fallbackImagePath,
  ...props
}: Props) => {
  const imageSrc = await getImageSrc(src, fallbackSrc);
  const blurData = await getBase64(imageSrc as string);

  const imageProps: Omit<ImageProps, "alt"> = {
    src: imageSrc,
    ...props,
  };
  if (blurData) {
    imageProps.placeholder = "blur";
    imageProps.blurDataURL = blurData;
  }

  return <Image {...imageProps} alt={alt} />;
};

const getImageSrc = async (
  src: string | StaticImport,
  fallbackSrc = fallbackImagePath
) => {
  if (!src) return fallbackSrc;

  // If the src is statically imported image, or a data:image string
  if (typeof src === "object" || src.startsWith("data:")) return src;

  // With remote image
  if (src.startsWith("http") || src.startsWith("//")) {
    const isExists = await checkRemoteImageExists(src);
    return isExists ? src : fallbackSrc;
  }

  // With local image
  const localImagePath = path.join(process.cwd(), "public", src);
  const isExists = await checkLocalImageExists(localImagePath);
  return isExists ? src : fallbackSrc;
};
const checkRemoteImageExists = async (url: string) => {
  try {
    const res = await fetch(url, { method: "HEAD" });
    return res.ok;
  } catch (error) {
    console.error(
      `checkRemoteImageExists - Error checking image with url: ${url} - ${error}`
    );
    return false;
  }
};
const checkLocalImageExists = async (path: string) => {
  try {
    await fs.promises.access(path, fs.constants.F_OK);
    return true;
  } catch (error) {
    console.error(
      `checkLocalImageExists - Error checking image with path: ${path} - ${error}`
    );
    return false;
  }
};
const getBase64 = async (url: string) => {
  try {
    const res = await fetch(url);
    if (!res.ok) return null;

    const buffer = await res.arrayBuffer();
    const { base64 } = await getPlaiceholder(Buffer.from(buffer));
    return base64;
  } catch (error) {
    console.error(
      `getBase64 - Error getting image with url: ${url} - ${error}`
    );
    return null;
  }
};
