"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { FALL_BACK_IMG_PATH, Props } from "./constants";

export default function ClientImage({
  src,
  alt,
  fallbackSrc = FALL_BACK_IMG_PATH,
  ...props
}: Props) {
  const [error, setError] = useState(false);
  const imageSrc = error ? fallbackSrc : src;

  useEffect(() => setError(false), [src]);

  return (
    <Image alt={alt} src={imageSrc} onError={() => setError(true)} {...props} />
  );
}
