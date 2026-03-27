"use client";

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({
  page,
  totalPages,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        className="border border-terminal-400 px-3 py-1.5 font-pixel text-xs text-terminal-400 transition-colors hover:border-white hover:text-white disabled:opacity-30 disabled:hover:border-terminal-400 disabled:hover:text-terminal-400"
      >
        prev
      </button>
      <span className="font-pixel text-xs text-terminal-500">
        {page}/{totalPages}
      </span>
      <button
        type="button"
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
        className="border border-terminal-400 px-3 py-1.5 font-pixel text-xs text-terminal-400 transition-colors hover:border-white hover:text-white disabled:opacity-30 disabled:hover:border-terminal-400 disabled:hover:text-terminal-400"
      >
        next
      </button>
    </div>
  );
}
