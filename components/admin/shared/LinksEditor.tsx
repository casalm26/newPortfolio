"use client";

import { useState } from "react";

interface LinksEditorProps {
  value: Record<string, string>;
  onChange: (links: Record<string, string>) => void;
}

export function LinksEditor({ value, onChange }: LinksEditorProps) {
  const [newKey, setNewKey] = useState("");
  const [newUrl, setNewUrl] = useState("");

  const entries = Object.entries(value);

  const addLink = () => {
    const k = newKey.trim();
    const u = newUrl.trim();
    if (k && u) {
      onChange({ ...value, [k]: u });
      setNewKey("");
      setNewUrl("");
    }
  };

  const removeLink = (key: string) => {
    const next = { ...value };
    delete next[key];
    onChange(next);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addLink();
    }
  };

  return (
    <div className="space-y-2">
      {entries.map(([key, url]) => (
        <div key={key} className="flex items-center gap-2">
          <span className="min-w-[80px] font-pixel text-xs text-terminal-400">
            {key}:
          </span>
          <span className="flex-1 truncate font-pixel text-xs text-terminal-300">
            {url}
          </span>
          <button
            type="button"
            onClick={() => removeLink(key)}
            className="font-pixel text-xs text-terminal-500 hover:text-red-400"
          >
            [rm]
          </button>
        </div>
      ))}

      <div className="flex gap-2">
        <input
          type="text"
          value={newKey}
          onChange={(e) => setNewKey(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="label"
          className="w-28 bg-black px-2 py-1.5 font-pixel text-xs text-white border border-terminal-400 focus:border-white focus:outline-none placeholder-terminal-600"
        />
        <input
          type="text"
          value={newUrl}
          onChange={(e) => setNewUrl(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="https://..."
          className="flex-1 bg-black px-2 py-1.5 font-pixel text-xs text-white border border-terminal-400 focus:border-white focus:outline-none placeholder-terminal-600"
        />
        <button
          type="button"
          onClick={addLink}
          className="border border-terminal-400 px-2 py-1.5 font-pixel text-xs text-terminal-400 hover:border-white hover:text-white"
        >
          [add]
        </button>
      </div>
    </div>
  );
}
