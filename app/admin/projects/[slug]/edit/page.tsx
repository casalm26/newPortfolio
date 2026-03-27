"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { AdminShell } from "@/components/admin/AdminShell";
import { ProjectForm } from "@/components/admin/forms/ProjectForm";
import { useAuth } from "@/components/admin/AuthContext";
import { cmsApiFetch } from "@/lib/admin/api";

export default function EditProjectPage() {
  const { slug } = useParams<{ slug: string }>();
  const { apiKey } = useAuth();
  const [initial, setInitial] = useState<Record<string, unknown> | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!apiKey || !slug) return;
    cmsApiFetch(`/projects/${slug}`, apiKey)
      .then((data) => {
        const project = data as Record<string, unknown>;
        if (project.publishedAt && typeof project.publishedAt === "string") {
          project.publishedAt = new Date(project.publishedAt as string)
            .toISOString()
            .slice(0, 16);
        }
        setInitial(project);
      })
      .catch(() => setError("Failed to load project"));
  }, [apiKey, slug]);

  return (
    <AdminShell>
      <div className="mb-6">
        <h1 className="font-pixel text-sm text-white">
          admin@cms:~/projects$ vim {slug}
        </h1>
        <p className="mt-1 font-pixel text-xs text-terminal-500">
          Edit project
        </p>
      </div>
      {error ? (
        <p className="font-pixel text-xs text-red-400">{error}</p>
      ) : !initial ? (
        <p className="font-pixel text-xs text-terminal-400 animate-pulse">
          Loading...
        </p>
      ) : (
        <ProjectForm
          initial={
            initial as unknown as {
              title: string;
              slug: string;
              content: string;
              summary: string;
              projectType: string;
              category: string;
              skills: string[];
              tools: string[];
              links: Record<string, string>;
              duration: string;
              role: string;
              coverImage: string;
              draft: boolean;
              publishedAt: string;
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
