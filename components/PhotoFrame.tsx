"use client";

import { AssetImage } from "./AssetImage";

type PhotoFrameProps = {
  src: string;
  alt: string;
  className?: string;
  objectPosition?: string;
  sizes?: string;
  priority?: boolean;
};

export function PhotoFrame({
  src,
  alt,
  className = "",
  objectPosition = "center",
  sizes = "200px",
  priority = false,
}: PhotoFrameProps) {
  return (
    <div className={`relative overflow-hidden bg-sky-low/60 ${className}`}>
      <AssetImage
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        className="object-cover"
        style={{ objectPosition }}
        fallbackLabel="Photo"
      />
    </div>
  );
}
