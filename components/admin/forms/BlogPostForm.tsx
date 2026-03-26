"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FormField, inputClasses, textareaClasses } from "../shared/FormField";
import { TagInput } from "../shared/TagInput";
import { SEOFields } from "../shared/SEOFields";
import { MDXEditor } from "../editor/MDXEditor";
import { useAuth } from "../AuthContext";
import { useToast } from "../shared/Toast";
import { cmsApiFetch } from "@/lib/admin/api";
import { revalidateAfterMutation } from "@/lib/admin/revalidate";

interface BlogPostData {
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

const EMPTY: BlogPostData = {
  title: "",
  slug: "",
  content: "",
  summary: "",
  tags: [],
  category: "",
  coverImage: "",
  author: "Caspian Almerud",
  draft: true,
  publishedAt: new Date().toISOString().slice(0, 16),
  seoTitle: "",
  seoDescription: "",
  seoKeywords: [],
};

interface BlogPostFormProps {
  initial?: BlogPostData;
  slug?: string; // set when editing
}

export function BlogPostForm({ initial, slug }: BlogPostFormProps) {
  const [data, setData] = useState<BlogPostData>(initial ?? EMPTY);
  const [saving, setSaving] = useState(false);
  const { apiKey } = useAuth();
  const { showToast } = useToast();
  const router = useRouter();
  const isEdit = !!slug;

  const set = <K extends keyof BlogPostData>(key: K, val: BlogPostData[K]) =>
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
        await cmsApiFetch(`/posts/${slug}`, apiKey, {
          method: "PUT",
          body: JSON.stringify(body),
        });
        await revalidateAfterMutation(apiKey, "posts", slug);
        showToast("Post updated");
      } else {
        const created = await cmsApiFetch<{ slug: string }>("/posts", apiKey, {
          method: "POST",
          body: JSON.stringify(body),
        });
        await revalidateAfterMutation(apiKey, "posts", created.slug);
        showToast("Post created");
        router.push("/admin/posts");
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
              placeholder="Post title..."
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
              placeholder="post-slug"
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
              placeholder="e.g. tutorial"
            />
          </FormField>

          <FormField label="Tags">
            <TagInput
              value={data.tags}
              onChange={(v) => set("tags", v)}
              placeholder="Add tag..."
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

          <FormField label="Author">
            <input
              type="text"
              value={data.author}
              onChange={(e) => set("author", e.target.value)}
              className={inputClasses}
            />
          </FormField>

          <SEOFields
            seoTitle={data.seoTitle}
            seoDescription={data.seoDescription}
            seoKeywords={data.seoKeywords}
            onSeoTitleChange={(v) => set("seoTitle", v)}
            onSeoDescriptionChange={(v) => set("seoDescription", v)}
            onSeoKeywordsChange={(v) => set("seoKeywords", v)}
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
          onClick={() => router.push("/admin/posts")}
          className="border border-terminal-400 px-6 py-2.5 font-pixel text-xs text-terminal-400 transition-colors hover:border-white hover:text-white"
        >
          [CANCEL]
        </button>
      </div>
    </form>
  );
}
