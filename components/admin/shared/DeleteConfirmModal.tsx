"use client";

interface DeleteConfirmModalProps {
  title: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
}

export function DeleteConfirmModal({
  title,
  onConfirm,
  onCancel,
  loading,
}: DeleteConfirmModalProps) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80">
      <div className="w-full max-w-md border border-terminal-400 bg-black p-6">
        <h3 className="font-pixel text-sm text-white">Confirm Delete</h3>
        <p className="mt-3 font-pixel text-xs text-terminal-400">
          Are you sure you want to delete &quot;{title}&quot;? This action
          cannot be undone.
        </p>

        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="flex-1 border border-terminal-400 px-4 py-2.5 font-pixel text-xs text-terminal-400 transition-colors hover:border-white hover:text-white"
          >
            [CANCEL]
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 border border-red-400 bg-black px-4 py-2.5 font-pixel text-xs text-red-400 transition-colors hover:bg-red-400 hover:text-black disabled:opacity-40"
          >
            {loading ? "Deleting..." : "[DELETE]"}
          </button>
        </div>
      </div>
    </div>
  );
}
