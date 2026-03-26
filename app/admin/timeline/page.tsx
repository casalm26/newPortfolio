"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import Link from "next/link";
import { AdminShell } from "@/components/admin/AdminShell";
import { useAuth } from "@/components/admin/AuthContext";
import { useToast } from "@/components/admin/shared/Toast";
import { SearchInput } from "@/components/admin/shared/SearchInput";
import { DeleteConfirmModal } from "@/components/admin/shared/DeleteConfirmModal";
import { cmsApiFetch } from "@/lib/admin/api";
import { revalidateAfterMutation } from "@/lib/admin/revalidate";

const TYPE_LABELS: Record<string, string> = {
  work: "Work",
  education: "Education",
  skill: "Skill",
  personal: "Personal",
  certification: "Cert",
  project: "Project",
  volunteer: "Volunteer",
};

interface TimelineEntry {
  _id: string;
  entryId: string;
  type: string;
  title: string;
  company: string;
  institution: string;
  startDate: string;
  endDate: string | null;
  current: boolean;
  order: number;
}

export default function TimelineListPage() {
  const { apiKey } = useAuth();
  const { showToast } = useToast();
  const [entries, setEntries] = useState<TimelineEntry[]>([]);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<TimelineEntry | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchEntries = useCallback(async () => {
    if (!apiKey) return;
    setLoading(true);
    try {
      const query = typeFilter ? `?type=${typeFilter}` : "";
      const data = await cmsApiFetch<{ entries: TimelineEntry[] }>(
        `/timeline${query}`,
        apiKey,
      );
      setEntries(data.entries);
    } catch {
      showToast("Failed to load timeline entries", "error");
    } finally {
      setLoading(false);
    }
  }, [apiKey, typeFilter, showToast]);

  useEffect(() => {
    fetchEntries();
  }, [fetchEntries]);

  const handleDelete = async () => {
    if (!deleteTarget || !apiKey) return;
    setDeleting(true);
    try {
      await cmsApiFetch(`/timeline/${deleteTarget.entryId}`, apiKey, {
        method: "DELETE",
      });
      await revalidateAfterMutation(apiKey, "timeline");
      showToast("Entry deleted");
      setDeleteTarget(null);
      fetchEntries();
    } catch {
      showToast("Failed to delete entry", "error");
    } finally {
      setDeleting(false);
    }
  };

  const filtered = useMemo(() => {
    if (!search) return entries;
    const q = search.toLowerCase();
    return entries.filter(
      (e) =>
        e.title.toLowerCase().includes(q) ||
        e.company.toLowerCase().includes(q) ||
        e.institution.toLowerCase().includes(q),
    );
  }, [entries, search]);

  const types = Object.keys(TYPE_LABELS);

  return (
    <AdminShell>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-pixel text-sm text-white">
            admin@cms:~/timeline$ ls
          </h1>
          <p className="mt-1 font-pixel text-xs text-terminal-500">
            {entries.length} entries
          </p>
        </div>
        <Link
          href="/admin/timeline/new"
          className="border border-white bg-white px-4 py-2 font-pixel text-xs text-black transition-colors hover:bg-black hover:text-white"
        >
          [NEW ENTRY]
        </Link>
      </div>

      <div className="mb-4 flex flex-col gap-3 sm:flex-row">
        <div className="flex-1">
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Search entries..."
          />
        </div>
        <div className="flex gap-1">
          <button
            type="button"
            onClick={() => setTypeFilter("")}
            className={`px-2 py-1.5 font-pixel text-xs transition-colors ${
              !typeFilter
                ? "border border-white bg-white text-black"
                : "border border-terminal-400 text-terminal-400 hover:text-white"
            }`}
          >
            All
          </button>
          {types.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTypeFilter(t)}
              className={`px-2 py-1.5 font-pixel text-xs transition-colors ${
                typeFilter === t
                  ? "border border-white bg-white text-black"
                  : "border border-terminal-400 text-terminal-400 hover:text-white"
              }`}
            >
              {TYPE_LABELS[t]}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <p className="font-pixel text-xs text-terminal-400 animate-pulse">
          Loading...
        </p>
      ) : filtered.length === 0 ? (
        <p className="font-pixel text-xs text-terminal-500">
          No entries found.
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
                  Organization
                </th>
                <th className="pb-2 pr-4 font-pixel text-xs text-terminal-500">
                  Date Range
                </th>
                <th className="pb-2 pr-4 font-pixel text-xs text-terminal-500">
                  Order
                </th>
                <th className="pb-2 font-pixel text-xs text-terminal-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((entry) => (
                <tr
                  key={entry._id}
                  className="border-b border-terminal-800 hover:bg-terminal-900"
                >
                  <td className="py-3 pr-4 font-pixel text-xs text-white">
                    {entry.title}
                  </td>
                  <td className="py-3 pr-4">
                    <span className="border border-terminal-500 px-2 py-0.5 font-pixel text-xs text-terminal-400">
                      {entry.type}
                    </span>
                  </td>
                  <td className="py-3 pr-4 font-pixel text-xs text-terminal-400">
                    {entry.company || entry.institution || "—"}
                  </td>
                  <td className="py-3 pr-4 font-pixel text-xs text-terminal-500">
                    {entry.startDate?.slice(0, 10)} —{" "}
                    {entry.current
                      ? "Present"
                      : entry.endDate?.slice(0, 10) || "—"}
                  </td>
                  <td className="py-3 pr-4 font-pixel text-xs text-terminal-500">
                    {entry.order}
                  </td>
                  <td className="py-3">
                    <div className="flex gap-2">
                      <Link
                        href={`/admin/timeline/${entry.entryId}/edit`}
                        className="font-pixel text-xs text-terminal-400 hover:text-white"
                      >
                        [edit]
                      </Link>
                      <button
                        type="button"
                        onClick={() => setDeleteTarget(entry)}
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
