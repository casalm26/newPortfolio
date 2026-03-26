"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import Link from "next/link";
import { AdminShell } from "@/components/admin/AdminShell";
import { useAuth } from "@/components/admin/AuthContext";
import { useToast } from "@/components/admin/shared/Toast";
import { SearchInput } from "@/components/admin/shared/SearchInput";
import { StatusBadge } from "@/components/admin/shared/StatusBadge";
import { Pagination } from "@/components/admin/shared/Pagination";
import { DeleteConfirmModal } from "@/components/admin/shared/DeleteConfirmModal";
import { cmsApiFetch } from "@/lib/admin/api";
import { revalidateAfterMutation } from "@/lib/admin/revalidate";

interface Video {
  _id: string;
  title: string;
  slug: string;
  youtubeId: string;
  category: string;
  draft: boolean;
  publishedAt: string;
}

interface VideosResponse {
  videos: Video[];
  pagination: { page: number; limit: number; total: number; pages: number };
}

export default function VideosListPage() {
  const { apiKey } = useAuth();
  const { showToast } = useToast();
  const [videos, setVideos] = useState<Video[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<Video | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchVideos = useCallback(async () => {
    if (!apiKey) return;
    setLoading(true);
    try {
      const data = await cmsApiFetch<VideosResponse>(
        `/videos?page=${page}&limit=20`,
        apiKey,
      );
      setVideos(data.videos);
      setTotalPages(data.pagination.pages);
    } catch {
      showToast("Failed to load videos", "error");
    } finally {
      setLoading(false);
    }
  }, [apiKey, page, showToast]);

  useEffect(() => {
    fetchVideos();
  }, [fetchVideos]);

  const handleDelete = async () => {
    if (!deleteTarget || !apiKey) return;
    setDeleting(true);
    try {
      await cmsApiFetch(`/videos/${deleteTarget.slug}`, apiKey, {
        method: "DELETE",
      });
      await revalidateAfterMutation(apiKey, "videos", deleteTarget.slug);
      showToast("Video deleted");
      setDeleteTarget(null);
      fetchVideos();
    } catch {
      showToast("Failed to delete video", "error");
    } finally {
      setDeleting(false);
    }
  };

  const filtered = useMemo(() => {
    if (!search) return videos;
    const q = search.toLowerCase();
    return videos.filter(
      (v) =>
        v.title.toLowerCase().includes(q) ||
        v.slug.toLowerCase().includes(q) ||
        v.youtubeId.toLowerCase().includes(q),
    );
  }, [videos, search]);

  return (
    <AdminShell>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-pixel text-sm text-white">
            admin@cms:~/videos$ ls
          </h1>
          <p className="mt-1 font-pixel text-xs text-terminal-500">
            {videos.length} videos
          </p>
        </div>
        <Link
          href="/admin/videos/new"
          className="border border-white bg-white px-4 py-2 font-pixel text-xs text-black transition-colors hover:bg-black hover:text-white"
        >
          [NEW VIDEO]
        </Link>
      </div>

      <div className="mb-4">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search videos..."
        />
      </div>

      {loading ? (
        <p className="font-pixel text-xs text-terminal-400 animate-pulse">
          Loading...
        </p>
      ) : filtered.length === 0 ? (
        <p className="font-pixel text-xs text-terminal-500">No videos found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-terminal-400">
                <th className="pb-2 pr-4 font-pixel text-xs text-terminal-500">
                  Title
                </th>
                <th className="pb-2 pr-4 font-pixel text-xs text-terminal-500">
                  YouTube ID
                </th>
                <th className="pb-2 pr-4 font-pixel text-xs text-terminal-500">
                  Category
                </th>
                <th className="pb-2 pr-4 font-pixel text-xs text-terminal-500">
                  Status
                </th>
                <th className="pb-2 pr-4 font-pixel text-xs text-terminal-500">
                  Date
                </th>
                <th className="pb-2 font-pixel text-xs text-terminal-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((video) => (
                <tr
                  key={video._id}
                  className="border-b border-terminal-800 hover:bg-terminal-900"
                >
                  <td className="py-3 pr-4 font-pixel text-xs text-white">
                    {video.title}
                  </td>
                  <td className="py-3 pr-4">
                    <a
                      href={`https://youtube.com/watch?v=${video.youtubeId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-pixel text-xs text-terminal-400 hover:text-white underline"
                    >
                      {video.youtubeId}
                    </a>
                  </td>
                  <td className="py-3 pr-4 font-pixel text-xs text-terminal-400">
                    {video.category || "—"}
                  </td>
                  <td className="py-3 pr-4">
                    <StatusBadge draft={video.draft} />
                  </td>
                  <td className="py-3 pr-4 font-pixel text-xs text-terminal-500">
                    {new Date(video.publishedAt).toLocaleDateString()}
                  </td>
                  <td className="py-3">
                    <div className="flex gap-2">
                      <Link
                        href={`/admin/videos/${video.slug}/edit`}
                        className="font-pixel text-xs text-terminal-400 hover:text-white"
                      >
                        [edit]
                      </Link>
                      <button
                        type="button"
                        onClick={() => setDeleteTarget(video)}
                        className="font-pixel text-xs text-terminal-400 hover:text-red-400"
                      >
                        [del]
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-4">
        <Pagination
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      </div>

      {deleteTarget && (
        <DeleteConfirmModal
          title={deleteTarget.title}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
          loading={deleting}
        />
      )}
    </AdminShell>
  );
}
