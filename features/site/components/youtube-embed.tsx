"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";

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
  loadImmediately = false,
}: {
  url: string;
  title: string;
  posterSrc?: string;
  loadImmediately?: boolean;
}) {
  const pathname = usePathname();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [playing, setPlaying] = useState(false);
  const id = youtubeId(url);
  const showPlayer = loadImmediately || playing;

  useEffect(() => {
    const iframe = iframeRef.current;

    return () => {
      iframe?.contentWindow?.postMessage(
        JSON.stringify({ event: "command", func: "stopVideo", args: [] }),
        "*",
      );
    };
  }, [pathname]);

  if (!id) return null;

  return (
    <div className="aspect-video overflow-hidden rounded-2xl bg-primary text-primary-foreground">
      {showPlayer ? (
        <iframe
          ref={iframeRef}
          className="size-full border-0"
          src={`https://www.youtube-nocookie.com/embed/${id}?enablejsapi=1&rel=0`}
          title={title}
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
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
            ></Button>
          </div>
        </div>
      )}
    </div>
  );
}
