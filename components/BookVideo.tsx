"use client";

import React from "react";
import { IKVideo, ImageKitProvider } from "imagekitio-next";
import config from "@/lib/config";

const BookVideo = ({ videoUrl }: { videoUrl: string }) => {
  // Check if the URL is actually a video file
  const isVideoFile =
    videoUrl &&
    (videoUrl.endsWith(".mp4") ||
      videoUrl.endsWith(".webm") ||
      videoUrl.endsWith(".ogg") ||
      videoUrl.endsWith(".avi") ||
      videoUrl.endsWith(".mov") ||
      videoUrl.includes("/video/"));

  // If it's not a video file, show a placeholder
  if (!isVideoFile) {
    return (
      <div className="flex h-64 w-full items-center justify-center rounded-xl bg-gray-100">
        <p className="text-gray-500">No video available</p>
      </div>
    );
  }

  return (
    <ImageKitProvider
      publicKey={config.env.imagekit.publicKey}
      urlEndpoint={config.env.imagekit.urlEndpoint}
    >
      <IKVideo src={videoUrl} controls={true} className="w-full rounded-xl" />
    </ImageKitProvider>
  );
};
export default BookVideo;
