"use client";

import type { VideoData } from "@/lib/cms/types";
import Header from "@/components/shared/Header";
import Image from "next/image";
import Link from "next/link";
import { formatDate } from "@/lib/utils";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense, useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { ScrollAnimated } from "@/components/shared/ScrollAnimated";
import { TypewriterText } from "@/components/shared/TypewriterText";

interface VideosPageClientProps {
  videos: VideoData[];
}

export function VideosPageClient({ videos }: VideosPageClientProps) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-black text-terminal-400 flex items-center justify-center font-pixel text-sm">
          Loading videos...
        </div>
      }
    >
      <VideosPageContent videos={videos} />
    </Suspense>
  );
}

function VideosPageContent({ videos }: { videos: VideoData[] }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");

  const tagFilter = searchParams.get("tag");

  const filteredVideos = useMemo(() => {
    let filtered = [...videos];

    if (tagFilter) {
      filtered = filtered.filter((video) =>
        video.tags.some((t) => t.toLowerCase() === tagFilter.toLowerCase()),
      );
    }

    if (searchTerm) {
      filtered = filtered.filter((video) => {
        const searchFields = [video.title, video.description, ...video.tags]
          .join(" ")
          .toLowerCase();
        return searchFields.includes(searchTerm.toLowerCase());
      });
    }

    return filtered;
  }, [videos, tagFilter, searchTerm]);

  const allTags = useMemo(() => {
    const tags = new Set<string>();
    videos.forEach((video) => video.tags.forEach((t) => tags.add(t)));
    return Array.from(tags).sort();
  }, [videos]);

  const updateFilter = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/videos?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-black">
      <ScrollAnimated animation="fade-in">
        <Header />
      </ScrollAnimated>

      <main className="container mx-auto px-4 pt-24 pb-12">
        <ScrollAnimated animation="fade-in" delay={200}>
          <div className="mb-12">
            <div className="font-pixel text-sm text-terminal-400 mb-2">
              <TypewriterText
                text="caspian@localhost:~$ ls videos/"
                speed={40}
              />
            </div>
            <h1 className="text-4xl md:text-6xl font-pixel font-bold text-white mb-4">
              VIDEOS/
            </h1>
            <p className="text-terminal-300 max-w-2xl">
              Video content covering development, tutorials, and tech topics.
            </p>
          </div>
        </ScrollAnimated>

        <ScrollAnimated animation="slide-in-left" delay={400}>
          <div className="mb-8 space-y-6">
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search videos..."
                className="w-full font-pixel text-sm bg-black border border-terminal-400 text-white px-4 py-3 focus:border-white focus:outline-none placeholder-terminal-500 transition-all duration-150"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 font-pixel text-xs text-terminal-400 hover:text-white"
                >
                  ✕
                </button>
              )}
            </div>

            {allTags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => updateFilter("tag", null)}
                  className={cn(
                    "font-pixel text-xs px-3 py-2 border transition-colors",
                    !tagFilter
                      ? "border-white bg-white text-black font-bold"
                      : "border-terminal-400 text-terminal-300 hover:border-white hover:text-white",
                  )}
                >
                  ALL
                </button>
                {allTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => updateFilter("tag", tag)}
                    className={cn(
                      "font-pixel text-xs px-3 py-2 border transition-colors",
                      tagFilter === tag
                        ? "border-white bg-white text-black font-bold"
                        : "border-terminal-400 text-terminal-300 hover:border-white hover:text-white",
                    )}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            )}
          </div>
        </ScrollAnimated>

        <div className="mb-6">
          <div className="font-pixel text-xs text-terminal-400">
            {filteredVideos.length === 0
              ? "No videos found"
              : `showing ${filteredVideos.length} of ${videos.length} videos`}
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredVideos.map((video) => (
            <ScrollAnimated key={video.slug} animation="fade-in">
              <Link
                href={`/videos/${video.slug}`}
                className="block border border-terminal-400 hover:border-white hover:bg-terminal-900 transition-all duration-150 group overflow-hidden"
              >
                <div className="relative aspect-video bg-terminal-900">
                  {video.thumbnail ? (
                    <Image
                      src={video.thumbnail}
                      alt={video.title}
                      fill
                      className="object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <span className="font-pixel text-4xl text-terminal-600">
                        ▶
                      </span>
                    </div>
                  )}
                  {video.duration && (
                    <span className="absolute bottom-2 right-2 font-pixel text-xs bg-black/80 text-white px-2 py-1">
                      {video.duration}
                    </span>
                  )}
                </div>

                <div className="p-4">
                  <span className="font-pixel text-xs text-terminal-500">
                    {formatDate(new Date(video.publishedAt))}
                  </span>
                  <h2 className="text-lg font-bold text-white group-hover:text-terminal-200 transition-colors mt-1 mb-2 line-clamp-2">
                    {video.title}
                  </h2>
                  <p className="text-terminal-300 text-sm line-clamp-2">
                    {video.description}
                  </p>
                </div>
              </Link>
            </ScrollAnimated>
          ))}
        </div>

        <ScrollAnimated animation="fade-in">
          <div className="mt-12 pt-8 border-t border-terminal-400">
            <div className="font-pixel text-xs text-terminal-400">
              {filteredVideos.length} videos
            </div>
          </div>
        </ScrollAnimated>
      </main>
    </div>
  );
}
