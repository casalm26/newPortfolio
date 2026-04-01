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

interface Project {
  _id: string;
  title: string;
  slug: string;
  projectType: string;
  skills: string[];
  draft: boolean;
  publishedAt: string;
}

interface ProjectsResponse {
  projects: Project[];
  pagination: { page: number; limit: number; total: number; pages: number };
}

export default function ProjectsListPage() {
  const { apiKey } = useAuth();
  const { showToast } = useToast();
  const [projects, setProjects] = useState<Project[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "published" | "draft"
  >("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<Project | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchProjects = useCallback(async () => {
    if (!apiKey) return;
    setLoading(true);
    try {
      const draftParam =
        statusFilter === "all" ? "" : `&draft=${statusFilter === "draft"}`;
      const data = await cmsApiFetch<ProjectsResponse>(
        `/projects?page=${page}&limit=50${draftParam}`,
        apiKey,
      );
      setProjects(data.projects);
      setTotalPages(data.pagination.pages);
    } catch {
      showToast("Failed to load projects", "error");
    } finally {
      setLoading(false);
    }
  }, [apiKey, page, statusFilter, showToast]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const handleDelete = async () => {
    if (!deleteTarget || !apiKey) return;
    setDeleting(true);
    try {
      await cmsApiFetch(`/projects/${deleteTarget.slug}`, apiKey, {
        method: "DELETE",
      });
      await revalidateAfterMutation(apiKey, "projects", deleteTarget.slug);
      showToast("Project deleted");
      setDeleteTarget(null);
      fetchProjects();
    } catch {
      showToast("Failed to delete project", "error");
    } finally {
      setDeleting(false);
    }
  };

  const filtered = useMemo(() => {
    if (!search) return projects;
    const q = search.toLowerCase();
    return projects.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.slug.toLowerCase().includes(q) ||
        p.projectType.toLowerCase().includes(q),
    );
  }, [projects, search]);

  return (
    <AdminShell>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-pixel text-sm text-white">
            admin@cms:~/projects$ ls
          </h1>
          <p className="mt-1 font-pixel text-xs text-terminal-500">
            {projects.length} projects
          </p>
        </div>
        <Link
          href="/admin/projects/new"
          className="border border-white bg-white px-4 py-2 font-pixel text-xs text-black transition-colors hover:bg-black hover:text-white"
        >
          [NEW PROJECT]
        </Link>
      </div>

      <div className="mb-4 flex gap-3">
        <div className="flex-1">
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Search projects..."
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
        <p className="font-pixel text-xs text-terminal-500">
          No projects found.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-terminal-400">
                <th className="pb-2 pr-4 font-pixel text-xs text-terminal-500">
                  Title
                </th>
                <th className="pb-2 pr-4 font-pixel text-xs text-terminal-500">
                  Type
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
              {filtered.map((project) => (
                <tr
                  key={project._id}
                  className="border-b border-terminal-800 hover:bg-terminal-900"
                >
                  <td className="py-3 pr-4">
                    <span className="font-pixel text-xs text-white">
                      {project.title}
                    </span>
                    {project.skills.length > 0 && (
                      <div className="mt-1 flex gap-1">
                        {project.skills.slice(0, 3).map((skill) => (
                          <span
                            key={skill}
                            className="font-pixel text-xs text-terminal-600"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    )}
                  </td>
                  <td className="py-3 pr-4 font-pixel text-xs text-terminal-400">
                    {project.projectType}
                  </td>
                  <td className="py-3 pr-4">
                    <StatusBadge draft={project.draft} />
                  </td>
                  <td className="py-3 pr-4 font-pixel text-xs text-terminal-500">
                    {new Date(project.publishedAt).toLocaleDateString()}
                  </td>
                  <td className="py-3">
                    <div className="flex gap-2">
                      <Link
                        href={`/admin/projects/${project.slug}/edit`}
                        className="font-pixel text-xs text-terminal-400 hover:text-white"
                      >
                        [edit]
                      </Link>
                      <button
                        type="button"
                        onClick={() => setDeleteTarget(project)}
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
