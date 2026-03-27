"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { AdminShell } from "@/components/admin/AdminShell";
import { BlogPostForm } from "@/components/admin/forms/BlogPostForm";
import { useAuth } from "@/components/admin/AuthContext";
import { cmsApiFetch } from "@/lib/admin/api";

export default function EditPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const { apiKey } = useAuth();
  const [initial, setInitial] = useState<Record<string, unknown> | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!apiKey || !slug) return;
    cmsApiFetch(`/posts/${slug}`, apiKey)
      .then((data) => {
        const post = data as Record<string, unknown>;
        // Format publishedAt for datetime-local input
        if (post.publishedAt && typeof post.publishedAt === "string") {
          post.publishedAt = new Date(post.publishedAt as string)
            .toISOString()
            .slice(0, 16);
        }
        setInitial(post);
      })
      .catch(() => setError("Failed to load post"));
  }, [apiKey, slug]);

  return (
    <AdminShell>
      <div className="mb-6">
        <h1 className="font-pixel text-sm text-white">
          admin@cms:~/posts$ vim {slug}
        </h1>
        <p className="mt-1 font-pixel text-xs text-terminal-500">
          Edit blog post
        </p>
      </div>
      {error ? (
        <p className="font-pixel text-xs text-red-400">{error}</p>
      ) : !initial ? (
        <p className="font-pixel text-xs text-terminal-400 animate-pulse">
          Loading...
        </p>
      ) : (
        <BlogPostForm
          initial={
            initial as unknown as {
              title: string;
              slug: string;
              content: string;
              summary: string;
              tags: string[];
              category: string;
              coverImage: string;
              author: string;
              draft: boolean;
              publishedAt: string;
              seoTitle: string;
              seoDescription: string;
              seoKeywords: string[];
            }
          }
          slug={slug}
        />
      )}
    </AdminShell>
  );
}
