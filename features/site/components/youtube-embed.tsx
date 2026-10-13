"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

function youtubeId(url: string) {
  try {
    const parsed = new URL(url);
    if (parsed.hostname === "youtu.be") return parsed.pathname.slice(1);
    if (parsed.hostname.endsWith("youtube.com")) {
      return (
        parsed.searchParams.get("v") ||
        parsed.pathname.split("/").filter(Boolean).at(-1)
      );
    }
  } catch {
    return null;
  }
  return null;
}

export function YouTubeEmbed({
  url,
  title,
  posterSrc,
}: {
  url: string;
  title: string;
  posterSrc?: string;
}) {
  const [playing, setPlaying] = useState(false);
  const id = youtubeId(url);
  if (!id) return null;

  return (
    /* Video embed */
    <div className="aspect-video overflow-hidden rounded-2xl bg-primary text-primary-foreground">
      {playing ? (
        <iframe
          className="size-full"
          src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1`}
          title={title}
          allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      ) : (
        <div className="relative size-full">
          <Image
            src={posterSrc || `https://img.youtube.com/vi/${id}/hqdefault.jpg`}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
            priority
          />
          <div
            className="absolute inset-0 bg-foreground/25"
            aria-hidden="true"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setPlaying(true)}
              aria-label={title}
              className="size-16 rounded-full bg-card/95 p-0 text-foreground shadow-xl transition-transform hover:scale-105"
            >
              <span aria-hidden="true" className="ml-1 text-2xl">
                ▶
              </span>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
