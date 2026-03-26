"use client";

export function StatusBadge({ draft }: { draft: boolean }) {
  return (
    <span
      className={`inline-block px-2 py-0.5 font-pixel text-xs ${
        draft
          ? "border border-terminal-500 text-terminal-400"
          : "border border-white bg-white text-black"
      }`}
    >
      {draft ? "DRAFT" : "LIVE"}
    </span>
  );
}
