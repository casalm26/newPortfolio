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
import { ListEditor } from "../shared/ListEditor";
import { LinksEditor } from "../shared/LinksEditor";
import { useAuth } from "../AuthContext";
import { useToast } from "../shared/Toast";
import { cmsApiFetch } from "@/lib/admin/api";
import { revalidateAfterMutation } from "@/lib/admin/revalidate";

const ENTRY_TYPES = [
  "work",
  "education",
  "skill",
  "personal",
  "certification",
  "project",
  "volunteer",
] as const;

interface TimelineData {
  entryId: string;
  type: string;
  title: string;
  company: string;
  institution: string;
  category: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
  responsibilities: string[];
  details: string[];
  achievements: string[];
  skills: string[];
  level: string;
  yearsOfExperience: number | null;
  impact: string;
  issuer: string;
  credentialId: string;
  links: Record<string, string>;
  order: number;
}

const EMPTY: TimelineData = {
  entryId: "",
  type: "work",
  title: "",
  company: "",
  institution: "",
  category: "",
  location: "",
  startDate: "",
  endDate: "",
  current: false,
  description: "",
  responsibilities: [],
  details: [],
  achievements: [],
  skills: [],
  level: "",
  yearsOfExperience: null,
  impact: "",
  issuer: "",
  credentialId: "",
  links: {},
  order: 0,
};

interface TimelineEntryFormProps {
  initial?: TimelineData;
  entryId?: string; // set when editing
}

export function TimelineEntryForm({
  initial,
  entryId,
}: TimelineEntryFormProps) {
  const [data, setData] = useState<TimelineData>(initial ?? EMPTY);
  const [saving, setSaving] = useState(false);
  const { apiKey } = useAuth();
  const { showToast } = useToast();
  const router = useRouter();
  const isEdit = !!entryId;

  const set = <K extends keyof TimelineData>(key: K, val: TimelineData[K]) =>
    setData((d) => ({ ...d, [key]: val }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiKey) return;
    setSaving(true);

    try {
      const body: Record<string, unknown> = { ...data };
      if (data.current) {
        body.endDate = null;
      }

      if (isEdit) {
        await cmsApiFetch(`/timeline/${entryId}`, apiKey, {
          method: "PUT",
          body: JSON.stringify(body),
        });
        await revalidateAfterMutation(apiKey, "timeline");
        showToast("Timeline entry updated");
      } else {
        await cmsApiFetch("/timeline", apiKey, {
          method: "POST",
          body: JSON.stringify(body),
        });
        await revalidateAfterMutation(apiKey, "timeline");
        showToast("Timeline entry created");
        router.push("/admin/timeline");
      }
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Failed to save", "error");
    } finally {
      setSaving(false);
    }
  };

  const showCompany = data.type === "work" || data.type === "volunteer";
  const showInstitution = data.type === "education";
  const showCertFields = data.type === "certification";
  const showResponsibilities =
    data.type === "work" || data.type === "volunteer";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <FormField label="Type" required>
            <select
              value={data.type}
              onChange={(e) => set("type", e.target.value)}
              className={selectClasses}
            >
              {ENTRY_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </FormField>

          <FormField label="Title" required>
            <input
              type="text"
              value={data.title}
              onChange={(e) => set("title", e.target.value)}
              className={inputClasses}
              placeholder="Position or achievement title..."
              required
            />
          </FormField>

          {isEdit && (
            <FormField label="Entry ID" hint="Auto-generated, read-only">
              <input
                type="text"
                value={data.entryId}
                className={inputClasses}
                readOnly
              />
            </FormField>
          )}

          {showCompany && (
            <FormField label="Company">
              <input
                type="text"
                value={data.company}
                onChange={(e) => set("company", e.target.value)}
                className={inputClasses}
                placeholder="Company name..."
              />
            </FormField>
          )}

          {showInstitution && (
            <FormField label="Institution">
              <input
                type="text"
                value={data.institution}
                onChange={(e) => set("institution", e.target.value)}
                className={inputClasses}
                placeholder="School or university..."
              />
            </FormField>
          )}

          {showCertFields && (
            <>
              <FormField label="Issuer">
                <input
                  type="text"
                  value={data.issuer}
                  onChange={(e) => set("issuer", e.target.value)}
                  className={inputClasses}
                  placeholder="Issuing organization..."
                />
              </FormField>
              <FormField label="Credential ID">
                <input
                  type="text"
                  value={data.credentialId}
                  onChange={(e) => set("credentialId", e.target.value)}
                  className={inputClasses}
                  placeholder="Credential ID..."
                />
              </FormField>
            </>
          )}

          <FormField label="Category">
            <input
              type="text"
              value={data.category}
              onChange={(e) => set("category", e.target.value)}
              className={inputClasses}
              placeholder="e.g. frontend"
            />
          </FormField>

          <FormField label="Location">
            <input
              type="text"
              value={data.location}
              onChange={(e) => set("location", e.target.value)}
              className={inputClasses}
              placeholder="City, Country"
            />
          </FormField>

          <div className="grid grid-cols-2 gap-4">
            <FormField label="Start Date" required>
              <input
                type="date"
                value={data.startDate}
                onChange={(e) => set("startDate", e.target.value)}
                className={inputClasses}
                required
              />
            </FormField>
            <FormField label="End Date">
              <input
                type="date"
                value={data.endDate}
                onChange={(e) => set("endDate", e.target.value)}
                className={inputClasses}
                disabled={data.current}
              />
            </FormField>
          </div>

          <FormField label="Current">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={data.current}
                onChange={(e) => {
                  set("current", e.target.checked);
                  if (e.target.checked) set("endDate", "");
                }}
                className="accent-white"
              />
              <span className="font-pixel text-xs text-terminal-400">
                Currently active
              </span>
            </label>
          </FormField>

          <div className="grid grid-cols-2 gap-4">
            <FormField label="Level">
              <input
                type="text"
                value={data.level}
                onChange={(e) => set("level", e.target.value)}
                className={inputClasses}
                placeholder="e.g. Senior"
              />
            </FormField>
            <FormField label="Years of Experience">
              <input
                type="number"
                value={data.yearsOfExperience ?? ""}
                onChange={(e) =>
                  set(
                    "yearsOfExperience",
                    e.target.value ? Number(e.target.value) : null,
                  )
                }
                className={inputClasses}
                min={0}
              />
            </FormField>
          </div>

          <FormField label="Order" hint="Lower numbers appear first">
            <input
              type="number"
              value={data.order}
              onChange={(e) => set("order", Number(e.target.value))}
              className={inputClasses}
            />
          </FormField>
        </div>

        <div className="space-y-4">
          <FormField label="Description">
            <textarea
              value={data.description}
              onChange={(e) => set("description", e.target.value)}
              className={textareaClasses}
              placeholder="Description..."
              rows={4}
            />
          </FormField>

          {showResponsibilities && (
            <FormField label="Responsibilities">
              <ListEditor
                value={data.responsibilities}
                onChange={(v) => set("responsibilities", v)}
                placeholder="Add responsibility..."
              />
            </FormField>
          )}

          <FormField label="Details">
            <ListEditor
              value={data.details}
              onChange={(v) => set("details", v)}
              placeholder="Add detail..."
            />
          </FormField>

          <FormField label="Achievements">
            <ListEditor
              value={data.achievements}
              onChange={(v) => set("achievements", v)}
              placeholder="Add achievement..."
            />
          </FormField>

          <FormField label="Skills">
            <TagInput
              value={data.skills}
              onChange={(v) => set("skills", v)}
              placeholder="Add skill..."
            />
          </FormField>

          <FormField label="Impact">
            <textarea
              value={data.impact}
              onChange={(e) => set("impact", e.target.value)}
              className={textareaClasses}
              placeholder="Impact statement..."
              rows={2}
            />
          </FormField>

          <FormField label="Links">
            <LinksEditor value={data.links} onChange={(v) => set("links", v)} />
          </FormField>
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
          onClick={() => router.push("/admin/timeline")}
          className="border border-terminal-400 px-6 py-2.5 font-pixel text-xs text-terminal-400 transition-colors hover:border-white hover:text-white"
        >
          [CANCEL]
        </button>
      </div>
    </form>
  );
}
