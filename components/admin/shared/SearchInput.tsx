"use client";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function SearchInput({
  value,
  onChange,
  placeholder = "Search...",
}: SearchInputProps) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full bg-black px-4 py-2.5 font-pixel text-sm text-white border border-terminal-400 focus:border-white focus:outline-none placeholder-terminal-600 transition-colors"
    />
  );
}
