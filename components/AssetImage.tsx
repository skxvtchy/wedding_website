"use client";

import Image, { type ImageProps } from "next/image";
import { useState } from "react";

type AssetImageProps = Omit<ImageProps, "onError"> & {
  fallbackLabel?: string;
};

/** Renders next/image, or a labeled placeholder if the asset fails to load. */
export function AssetImage({
  fallbackLabel = "Photo coming soon",
  className = "",
  alt,
  ...props
}: AssetImageProps) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        className={`flex items-center justify-center bg-sky-low/80 text-center text-xs text-ink-soft ${className}`}
        role="img"
        aria-label={alt || fallbackLabel}
      >
        {fallbackLabel}
      </div>
    );
  }

  return (
    <Image
      {...props}
      alt={alt}
      className={className}
      onError={() => setFailed(true)}
    />
  );
}
