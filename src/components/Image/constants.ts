import { ImageProps } from "next/image";

export type Props = ImageProps & {
  fallbackSrc?: string;
};

export const FALL_BACK_IMG_PATH = "/images/no_image.jpg";
