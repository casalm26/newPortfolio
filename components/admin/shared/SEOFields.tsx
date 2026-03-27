"use client";

import { useState } from "react";
import { FormField, inputClasses, textareaClasses } from "./FormField";
import { TagInput } from "./TagInput";

interface SEOFieldsProps {
  seoTitle: string;
  seoDescription: string;
  seoKeywords?: string[];
  onSeoTitleChange: (v: string) => void;
  onSeoDescriptionChange: (v: string) => void;
  onSeoKeywordsChange?: (v: string[]) => void;
}

export function SEOFields({
  seoTitle,
  seoDescription,
  seoKeywords,
  onSeoTitleChange,
  onSeoDescriptionChange,
  onSeoKeywordsChange,
}: SEOFieldsProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border border-terminal-400 p-4">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between font-pixel text-xs text-terminal-400 hover:text-white"
      >
        <span>SEO Settings</span>
        <span>{open ? "[-]" : "[+]"}</span>
      </button>

      {open && (
        <div className="mt-4 space-y-0">
          <FormField label="SEO Title" hint="Override the page title tag">
            <input
              type="text"
              value={seoTitle}
              onChange={(e) => onSeoTitleChange(e.target.value)}
              className={inputClasses}
              placeholder="Custom SEO title..."
            />
          </FormField>

          <FormField
            label="SEO Description"
            hint="Meta description for search engines"
          >
            <textarea
              value={seoDescription}
              onChange={(e) => onSeoDescriptionChange(e.target.value)}
              className={textareaClasses}
              placeholder="Custom meta description..."
              rows={2}
            />
          </FormField>

          {onSeoKeywordsChange && seoKeywords !== undefined && (
            <FormField label="SEO Keywords">
              <TagInput
                value={seoKeywords}
                onChange={onSeoKeywordsChange}
                placeholder="Add keyword..."
              />
            </FormField>
          )}
        </div>
      )}
    </div>
  );
}
