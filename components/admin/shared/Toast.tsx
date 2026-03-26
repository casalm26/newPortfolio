"use client";

import {
  useEffect,
  useState,
  useCallback,
  createContext,
  useContext,
  type ReactNode,
} from "react";

interface ToastMessage {
  id: number;
  text: string;
  type: "success" | "error";
}

interface ToastContextType {
  showToast: (text: string, type?: "success" | "error") => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

let nextId = 0;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = useCallback(
    (text: string, type: "success" | "error" = "success") => {
      const id = nextId++;
      setToasts((prev) => [...prev, { id, text, type }]);
    },
    [],
  );

  const removeToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-[110] flex flex-col gap-2">
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onDone={removeToast} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

function ToastItem({
  toast,
  onDone,
}: {
  toast: ToastMessage;
  onDone: (id: number) => void;
}) {
  useEffect(() => {
    const timer = setTimeout(() => onDone(toast.id), 3000);
    return () => clearTimeout(timer);
  }, [toast.id, onDone]);

  return (
    <div
      className={`border px-4 py-2.5 font-pixel text-xs ${
        toast.type === "success"
          ? "border-white bg-black text-white"
          : "border-red-400 bg-black text-red-400"
      }`}
    >
      {toast.type === "success" ? "[OK] " : "[ERR] "}
      {toast.text}
    </div>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}
