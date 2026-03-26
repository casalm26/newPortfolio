"use client";

import { useEffect, useState } from "react";

interface EditorPreviewProps {
  content: string;
}

export function EditorPreview({ content }: EditorPreviewProps) {
  const [html, setHtml] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (!content.trim()) {
        setHtml("");
        setError("");
        return;
      }

      try {
        setHtml(simpleMarkdownToHtml(content));
        setError("");
      } catch (e) {
        setError(e instanceof Error ? e.message : "Preview error");
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [content]);

  return (
    <div className="h-full overflow-auto p-4">
      {error ? (
        <p className="font-pixel text-xs text-red-400">
          [Preview Error] {error}
        </p>
      ) : html ? (
        <div
          className="prose prose-invert prose-sm max-w-none font-pixel text-xs leading-relaxed"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      ) : (
        <p className="font-pixel text-xs text-terminal-600">
          Preview will appear here...
        </p>
      )}
    </div>
  );
}

function simpleMarkdownToHtml(md: string): string {
  const html = md
    // Code blocks
    .replace(/```(\w*)\n([\s\S]*?)```/g, "<pre><code>$2</code></pre>")
    // Headings
    .replace(/^### (.+)$/gm, "<h3>$1</h3>")
    .replace(/^## (.+)$/gm, "<h2>$1</h2>")
    .replace(/^# (.+)$/gm, "<h1>$1</h1>")
    // Bold & italic
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    // Inline code
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    // Images
    .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img alt="$1" src="$2" />')
    // Links
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
    // Blockquotes
    .replace(/^> (.+)$/gm, "<blockquote>$1</blockquote>")
    // Horizontal rules
    .replace(/^---$/gm, "<hr />")
    // Unordered list items
    .replace(/^- (.+)$/gm, "<li>$1</li>")
    // Ordered list items
    .replace(/^\d+\. (.+)$/gm, "<li>$1</li>")
    // Paragraphs (lines not already wrapped)
    .replace(/^(?!<[a-z])((?!$).+)$/gm, "<p>$1</p>");

  return html;
}
