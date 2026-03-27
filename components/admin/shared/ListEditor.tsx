"use client";

import { useState } from "react";

interface ListEditorProps {
  value: string[];
  onChange: (items: string[]) => void;
  placeholder?: string;
}

export function ListEditor({
  value,
  onChange,
  placeholder = "Add item...",
}: ListEditorProps) {
  const [input, setInput] = useState("");

  const addItem = () => {
    const trimmed = input.trim();
    if (trimmed) {
      onChange([...value, trimmed]);
      setInput("");
    }
  };

  const removeItem = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, newValue: string) => {
    const next = [...value];
    next[index] = newValue;
    onChange(next);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addItem();
    }
  };

  return (
    <div className="space-y-1.5">
      {value.map((item, i) => (
        <div key={i} className="flex items-start gap-2">
          <span className="mt-1.5 font-pixel text-xs text-terminal-600">
            {i + 1}.
          </span>
          <input
            type="text"
            value={item}
            onChange={(e) => updateItem(i, e.target.value)}
            className="flex-1 bg-black px-2 py-1.5 font-pixel text-xs text-white border border-terminal-400 focus:border-white focus:outline-none"
          />
          <button
            type="button"
            onClick={() => removeItem(i)}
            className="mt-0.5 font-pixel text-xs text-terminal-500 hover:text-red-400"
          >
            [rm]
          </button>
        </div>
      ))}

      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="flex-1 bg-black px-2 py-1.5 font-pixel text-xs text-white border border-terminal-400 focus:border-white focus:outline-none placeholder-terminal-600"
        />
        <button
          type="button"
          onClick={addItem}
          className="border border-terminal-400 px-2 py-1.5 font-pixel text-xs text-terminal-400 hover:border-white hover:text-white"
        >
          [add]
        </button>
      </div>
    </div>
  );
}
