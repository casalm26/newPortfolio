"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { AdminShell } from "@/components/admin/AdminShell";
import { VideoForm } from "@/components/admin/forms/VideoForm";
import { useAuth } from "@/components/admin/AuthContext";
import { cmsApiFetch } from "@/lib/admin/api";

export default function EditVideoPage() {
  const { slug } = useParams<{ slug: string }>();
  const { apiKey } = useAuth();
  const [initial, setInitial] = useState<Record<string, unknown> | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!apiKey || !slug) return;
    cmsApiFetch(`/videos/${slug}`, apiKey)
      .then((data) => {
        const video = data as Record<string, unknown>;
        if (video.publishedAt && typeof video.publishedAt === "string") {
          video.publishedAt = new Date(video.publishedAt as string)
            .toISOString()
            .slice(0, 16);
        }
        setInitial(video);
      })
      .catch(() => setError("Failed to load video"));
  }, [apiKey, slug]);

  return (
    <AdminShell>
      <div className="mb-6">
        <h1 className="font-pixel text-sm text-white">
          admin@cms:~/videos$ vim {slug}
        </h1>
        <p className="mt-1 font-pixel text-xs text-terminal-500">Edit video</p>
      </div>
      {error ? (
        <p className="font-pixel text-xs text-red-400">{error}</p>
      ) : !initial ? (
        <p className="font-pixel text-xs text-terminal-400 animate-pulse">
          Loading...
        </p>
      ) : (
        <VideoForm
          initial={
            initial as unknown as {
              title: string;
              slug: string;
              youtubeId: string;
              description: string;
              tags: string[];
              category: string;
              publishedAt: string;
              duration: string;
              thumbnail: string;
              relatedPosts: string[];
              relatedProjects: string[];
              draft: boolean;
              seoTitle: string;
              seoDescription: string;
            }
          }
          slug={slug}
        />
      )}
    </AdminShell>
  );
}
