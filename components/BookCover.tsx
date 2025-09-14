"use client";

import React from "react";
import { cn } from "@/lib/utils";
import BookCoverSvg from "@/components/BookCoverSvg";
import { IKImage } from "imagekitio-next";
import config from "@/lib/config";

type BookCoverVariant = "extraSmall" | "small" | "medium" | "regular" | "wide";

const variantStyles: Record<BookCoverVariant, string> = {
  extraSmall: "book-cover_extra_small",
  small: "book-cover_small",
  medium: "book-cover_medium",
  regular: "book-cover_regular",
  wide: "book-cover_wide",
};

interface Props {
  className?: string;
  variant?: BookCoverVariant;
  coverColor: string;
  coverImage: string;
}

const BookCover = ({
  className,
  variant = "regular",
  coverColor,
  coverImage,
}: Props) => {
  return (
    <div
      className={cn(
        "relative transition-all duration-300",
        variantStyles[variant],
        className
      )}
    >
      <BookCoverSvg coverColor={coverColor} />

      <div
        className="absolute z-10"
        style={{ left: "12%", width: "87.5%", height: "88%" }}
      >
        {coverImage && coverImage.startsWith("http") ? (
          <img
            src={coverImage}
            alt="Book cover"
            className="size-full rounded-sm object-fill"
          />
        ) : coverImage ? (
          <IKImage
            path={coverImage}
            urlEndpoint={config.env.imagekit.urlEndpoint}
            alt="Book cover"
            fill
            className="rounded-sm object-fill"
            lqip={{ active: true }}
          />
        ) : (
          <div className="size-full rounded-sm bg-gray-200 flex items-center justify-center">
            <span className="text-gray-500 text-sm">No Cover</span>
          </div>
        )}
      </div>
    </div>
  );
};
export default BookCover;
