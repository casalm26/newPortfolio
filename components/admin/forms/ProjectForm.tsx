"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  FormField,
  inputClasses,
  selectClasses,
  textareaClasses,
} from "../shared/FormField";
import { TagInput } from "../shared/TagInput";
import { LinksEditor } from "../shared/LinksEditor";
import { SEOFields } from "../shared/SEOFields";
import { MDXEditor } from "../editor/MDXEditor";
import { useAuth } from "../AuthContext";
import { useToast } from "../shared/Toast";
import { cmsApiFetch } from "@/lib/admin/api";
import { revalidateAfterMutation } from "@/lib/admin/revalidate";

const PROJECT_TYPES = ["Technical", "Creative", "Business", "Learning"];

interface ProjectData {
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

const EMPTY: ProjectData = {
  title: "",
  slug: "",
  content: "",
  summary: "",
  projectType: "Technical",
  category: "",
  skills: [],
  tools: [],
  links: {},
  duration: "",
  role: "",
  coverImage: "",
  draft: true,
  publishedAt: new Date().toISOString().slice(0, 16),
  seoTitle: "",
  seoDescription: "",
};

interface ProjectFormProps {
  initial?: ProjectData;
  slug?: string;
}

export function ProjectForm({ initial, slug }: ProjectFormProps) {
  const [data, setData] = useState<ProjectData>(initial ?? EMPTY);
  const [saving, setSaving] = useState(false);
  const { apiKey } = useAuth();
  const { showToast } = useToast();
  const router = useRouter();
  const isEdit = !!slug;

  const set = <K extends keyof ProjectData>(key: K, val: ProjectData[K]) =>
    setData((d) => ({ ...d, [key]: val }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiKey) return;
    setSaving(true);

    try {
      const body = { ...data };
      if (body.publishedAt) {
        body.publishedAt = new Date(body.publishedAt).toISOString();
      }

      if (isEdit) {
        await cmsApiFetch(`/projects/${slug}`, apiKey, {
          method: "PUT",
          body: JSON.stringify(body),
        });
        await revalidateAfterMutation(apiKey, "projects", slug);
        showToast("Project updated");
      } else {
        const created = await cmsApiFetch<{ slug: string }>(
          "/projects",
          apiKey,
          { method: "POST", body: JSON.stringify(body) },
        );
        await revalidateAfterMutation(apiKey, "projects", created.slug);
        showToast("Project created");
        router.push("/admin/projects");
      }
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Failed to save", "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <FormField label="Title" required>
            <input
              type="text"
              value={data.title}
              onChange={(e) => set("title", e.target.value)}
              className={inputClasses}
              placeholder="Project title..."
              required
            />
          </FormField>

          <FormField
            label="Slug"
            hint={
              isEdit
                ? "Cannot change slug after creation"
                : "Auto-generated from title if left empty"
            }
          >
            <input
              type="text"
              value={data.slug}
              onChange={(e) => set("slug", e.target.value)}
              className={inputClasses}
              placeholder="project-slug"
              readOnly={isEdit}
            />
          </FormField>

          <FormField label="Content (MDX)" required>
            <MDXEditor
              value={data.content}
              onChange={(v) => set("content", v)}
            />
          </FormField>
        </div>

        <div className="space-y-4">
          <FormField label="Summary" required>
            <textarea
              value={data.summary}
              onChange={(e) => set("summary", e.target.value)}
              className={textareaClasses}
              placeholder="Brief description..."
              rows={3}
              required
            />
          </FormField>

          <FormField label="Project Type" required>
            <select
              value={data.projectType}
              onChange={(e) => set("projectType", e.target.value)}
              className={selectClasses}
            >
              {PROJECT_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </FormField>

          <FormField label="Status">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={!data.draft}
                onChange={(e) => set("draft", !e.target.checked)}
                className="accent-white"
              />
              <span className="font-pixel text-xs text-terminal-400">
                {data.draft ? "Draft" : "Published"}
              </span>
            </label>
          </FormField>

          <FormField label="Published At">
            <input
              type="datetime-local"
              value={data.publishedAt}
              onChange={(e) => set("publishedAt", e.target.value)}
              className={inputClasses}
            />
          </FormField>

          <FormField label="Category">
            <input
              type="text"
              value={data.category}
              onChange={(e) => set("category", e.target.value)}
              className={inputClasses}
              placeholder="e.g. web"
            />
          </FormField>

          <FormField label="Skills">
            <TagInput
              value={data.skills}
              onChange={(v) => set("skills", v)}
              placeholder="Add skill..."
            />
          </FormField>

          <FormField label="Tools">
            <TagInput
              value={data.tools}
              onChange={(v) => set("tools", v)}
              placeholder="Add tool..."
            />
          </FormField>

          <FormField label="Links">
            <LinksEditor value={data.links} onChange={(v) => set("links", v)} />
          </FormField>

          <FormField label="Duration">
            <input
              type="text"
              value={data.duration}
              onChange={(e) => set("duration", e.target.value)}
              className={inputClasses}
              placeholder="e.g. 3 months"
            />
          </FormField>

          <FormField label="Role">
            <input
              type="text"
              value={data.role}
              onChange={(e) => set("role", e.target.value)}
              className={inputClasses}
              placeholder="e.g. Lead Developer"
            />
          </FormField>

          <FormField label="Cover Image URL">
            <input
              type="text"
              value={data.coverImage}
              onChange={(e) => set("coverImage", e.target.value)}
              className={inputClasses}
              placeholder="https://..."
            />
          </FormField>

          <SEOFields
            seoTitle={data.seoTitle}
            seoDescription={data.seoDescription}
            onSeoTitleChange={(v) => set("seoTitle", v)}
            onSeoDescriptionChange={(v) => set("seoDescription", v)}
          />
        </div>
      </div>

      <div className="flex gap-3 border-t border-terminal-400 pt-4">
        <button
          type="submit"
          disabled={saving}
          className="border border-white bg-white px-6 py-2.5 font-pixel text-xs text-black transition-colors hover:bg-black hover:text-white disabled:opacity-40"
        >
          {saving ? "Saving..." : isEdit ? "[SAVE]" : "[CREATE]"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/projects")}
          className="border border-terminal-400 px-6 py-2.5 font-pixel text-xs text-terminal-400 transition-colors hover:border-white hover:text-white"
        >
          [CANCEL]
        </button>
      </div>
    </form>
  );
}
