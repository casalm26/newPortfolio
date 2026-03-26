"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FormField, inputClasses, textareaClasses } from "../shared/FormField";
import { TagInput } from "../shared/TagInput";
import { SEOFields } from "../shared/SEOFields";
import { useAuth } from "../AuthContext";
import { useToast } from "../shared/Toast";
import { cmsApiFetch } from "@/lib/admin/api";
import { revalidateAfterMutation } from "@/lib/admin/revalidate";

interface VideoData {
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

const EMPTY: VideoData = {
  title: "",
  slug: "",
  youtubeId: "",
  description: "",
  tags: [],
  category: "",
  publishedAt: new Date().toISOString().slice(0, 16),
  duration: "",
  thumbnail: "",
  relatedPosts: [],
  relatedProjects: [],
  draft: true,
  seoTitle: "",
  seoDescription: "",
};

interface VideoFormProps {
  initial?: VideoData;
  slug?: string;
}

export function VideoForm({ initial, slug }: VideoFormProps) {
  const [data, setData] = useState<VideoData>(initial ?? EMPTY);
  const [saving, setSaving] = useState(false);
  const { apiKey } = useAuth();
  const { showToast } = useToast();
  const router = useRouter();
  const isEdit = !!slug;

  const set = <K extends keyof VideoData>(key: K, val: VideoData[K]) =>
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
        await cmsApiFetch(`/videos/${slug}`, apiKey, {
          method: "PUT",
          body: JSON.stringify(body),
        });
        await revalidateAfterMutation(apiKey, "videos", slug);
        showToast("Video updated");
      } else {
        const created = await cmsApiFetch<{ slug: string }>("/videos", apiKey, {
          method: "POST",
          body: JSON.stringify(body),
        });
        await revalidateAfterMutation(apiKey, "videos", created.slug);
        showToast("Video created");
        router.push("/admin/videos");
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
              placeholder="Video title..."
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
              placeholder="video-slug"
              readOnly={isEdit}
            />
          </FormField>

          <FormField
            label="YouTube ID"
            required
            hint="The video ID from the YouTube URL (e.g. dQw4w9WgXcQ)"
          >
            <input
              type="text"
              value={data.youtubeId}
              onChange={(e) => set("youtubeId", e.target.value)}
              className={inputClasses}
              placeholder="dQw4w9WgXcQ"
              required
            />
          </FormField>

          {data.youtubeId && (
            <div className="border border-terminal-400 p-2">
              <p className="mb-2 font-pixel text-xs text-terminal-500">
                Preview:
              </p>
              <div className="aspect-video">
                <iframe
                  src={`https://www.youtube.com/embed/${data.youtubeId}`}
                  className="h-full w-full"
                  allowFullScreen
                  title="YouTube preview"
                />
              </div>
            </div>
          )}

          <FormField label="Description">
            <textarea
              value={data.description}
              onChange={(e) => set("description", e.target.value)}
              className={textareaClasses}
              placeholder="Video description..."
              rows={5}
            />
          </FormField>
        </div>

        <div className="space-y-4">
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

          <FormField label="Duration" hint="e.g. 12:34">
            <input
              type="text"
              value={data.duration}
              onChange={(e) => set("duration", e.target.value)}
              className={inputClasses}
              placeholder="12:34"
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

          <FormField
            label="Thumbnail URL"
            hint="Auto-generated from YouTube ID if left empty"
          >
            <input
              type="text"
              value={data.thumbnail}
              onChange={(e) => set("thumbnail", e.target.value)}
              className={inputClasses}
              placeholder="https://..."
            />
          </FormField>

          <FormField label="Related Posts" hint="Blog post slugs">
            <TagInput
              value={data.relatedPosts}
              onChange={(v) => set("relatedPosts", v)}
              placeholder="Add post slug..."
            />
          </FormField>

          <FormField label="Related Projects" hint="Project slugs">
            <TagInput
              value={data.relatedProjects}
              onChange={(v) => set("relatedProjects", v)}
              placeholder="Add project slug..."
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
          onClick={() => router.push("/admin/videos")}
          className="border border-terminal-400 px-6 py-2.5 font-pixel text-xs text-terminal-400 transition-colors hover:border-white hover:text-white"
        >
          [CANCEL]
        </button>
      </div>
    </form>
  );
}
