"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AdminShell } from "@/components/admin/AdminShell";
import { useAuth } from "@/components/admin/AuthContext";
import { cmsApiFetch } from "@/lib/admin/api";

interface ContentCounts {
  posts: number;
  projects: number;
  videos: number;
  timeline: number;
}

export default function AdminDashboard() {
  const { apiKey } = useAuth();
  const [counts, setCounts] = useState<ContentCounts | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!apiKey) return;

    async function fetchCounts() {
      try {
        const [posts, projects, videos, timeline] = await Promise.all([
          cmsApiFetch<{ pagination: { total: number } }>(
            "/posts?limit=1",
            apiKey!,
          ),
          cmsApiFetch<{ pagination: { total: number } }>(
            "/projects?limit=1",
            apiKey!,
          ),
          cmsApiFetch<{ pagination: { total: number } }>(
            "/videos?limit=1",
            apiKey!,
          ),
          cmsApiFetch<{ entries: unknown[] }>("/timeline", apiKey!),
        ]);
        setCounts({
          posts: posts.pagination.total,
          projects: projects.pagination.total,
          videos: videos.pagination.total,
          timeline: timeline.entries.length,
        });
      } catch {
        // Silently fail — counts are non-critical
      } finally {
        setLoading(false);
      }
    }

    fetchCounts();
  }, [apiKey]);

  const cards = [
    { label: "Blog Posts", href: "/admin/posts", count: counts?.posts },
    { label: "Projects", href: "/admin/projects", count: counts?.projects },
    { label: "Videos", href: "/admin/videos", count: counts?.videos },
    {
      label: "Timeline Entries",
      href: "/admin/timeline",
      count: counts?.timeline,
    },
  ];

  return (
    <AdminShell>
      <div className="mb-8">
        <h1 className="font-pixel text-sm text-white">
          admin@cms:~$ dashboard
        </h1>
        <p className="mt-1 font-pixel text-xs text-terminal-500">
          Content overview
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="border border-terminal-400 p-6 transition-colors hover:border-white hover:bg-terminal-900"
          >
            <div className="font-pixel text-2xl text-white">
              {loading ? "..." : (card.count ?? "—")}
            </div>
            <div className="mt-2 font-pixel text-xs text-terminal-400">
              {card.label}
            </div>
          </Link>
        ))}
      </div>
    </AdminShell>
  );
}
