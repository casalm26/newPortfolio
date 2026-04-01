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

interface Post {
  _id: string;
  title: string;
  slug: string;
  category: string;
  tags: string[];
  draft: boolean;
  publishedAt: string;
}

interface PostsResponse {
  posts: Post[];
  pagination: { page: number; limit: number; total: number; pages: number };
}

export default function PostsListPage() {
  const { apiKey } = useAuth();
  const { showToast } = useToast();
  const [posts, setPosts] = useState<Post[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "published" | "draft"
  >("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<Post | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchPosts = useCallback(async () => {
    if (!apiKey) return;
    setLoading(true);
    try {
      const draftParam =
        statusFilter === "all" ? "" : `&draft=${statusFilter === "draft"}`;
      const data = await cmsApiFetch<PostsResponse>(
        `/posts?page=${page}&limit=20${draftParam}`,
        apiKey,
      );
      setPosts(data.posts);
      setTotalPages(data.pagination.pages);
    } catch {
      showToast("Failed to load posts", "error");
    } finally {
      setLoading(false);
    }
  }, [apiKey, page, statusFilter, showToast]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handleDelete = async () => {
    if (!deleteTarget || !apiKey) return;
    setDeleting(true);
    try {
      await cmsApiFetch(`/posts/${deleteTarget.slug}`, apiKey, {
        method: "DELETE",
      });
      await revalidateAfterMutation(apiKey, "posts", deleteTarget.slug);
      showToast("Post deleted");
      setDeleteTarget(null);
      fetchPosts();
    } catch {
      showToast("Failed to delete post", "error");
    } finally {
      setDeleting(false);
    }
  };

  const filtered = useMemo(() => {
    if (!search) return posts;
    const q = search.toLowerCase();
    return posts.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.slug.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q),
    );
  }, [posts, search]);

  return (
    <AdminShell>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-pixel text-sm text-white">
            admin@cms:~/posts$ ls
          </h1>
          <p className="mt-1 font-pixel text-xs text-terminal-500">
            {posts.length} posts
          </p>
        </div>
        <Link
          href="/admin/posts/new"
          className="border border-white bg-white px-4 py-2 font-pixel text-xs text-black transition-colors hover:bg-black hover:text-white"
        >
          [NEW POST]
        </Link>
      </div>

      <div className="mb-4 flex gap-3">
        <div className="flex-1">
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Search posts..."
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value as "all" | "published" | "draft");
            setPage(1);
          }}
          className="border border-terminal-600 bg-black px-3 py-2 font-pixel text-xs text-terminal-400 focus:border-white focus:outline-none"
        >
          <option value="all">All</option>
          <option value="published">Published</option>
          <option value="draft">Drafts</option>
        </select>
      </div>

      {loading ? (
        <p className="font-pixel text-xs text-terminal-400 animate-pulse">
          Loading...
        </p>
      ) : filtered.length === 0 ? (
        <p className="font-pixel text-xs text-terminal-500">No posts found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-terminal-400">
                <th className="pb-2 pr-4 font-pixel text-xs text-terminal-500">
                  Title
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
              {filtered.map((post) => (
                <tr
                  key={post._id}
                  className="border-b border-terminal-800 hover:bg-terminal-900"
                >
                  <td className="py-3 pr-4">
                    <span className="font-pixel text-xs text-white">
                      {post.title}
                    </span>
                    {post.tags.length > 0 && (
                      <div className="mt-1 flex gap-1">
                        {post.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="font-pixel text-xs text-terminal-600"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </td>
                  <td className="py-3 pr-4 font-pixel text-xs text-terminal-400">
                    {post.category || "—"}
                  </td>
                  <td className="py-3 pr-4">
                    <StatusBadge draft={post.draft} />
                  </td>
                  <td className="py-3 pr-4 font-pixel text-xs text-terminal-500">
                    {new Date(post.publishedAt).toLocaleDateString()}
                  </td>
                  <td className="py-3">
                    <div className="flex gap-2">
                      <Link
                        href={`/admin/posts/${post.slug}/edit`}
                        className="font-pixel text-xs text-terminal-400 hover:text-white"
                      >
                        [edit]
                      </Link>
                      <button
                        type="button"
                        onClick={() => setDeleteTarget(post)}
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
