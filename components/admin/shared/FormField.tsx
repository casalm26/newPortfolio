"use client";

import type { ReactNode } from "react";

interface FormFieldProps {
  label: string;
  htmlFor?: string;
  required?: boolean;
  hint?: string;
  children: ReactNode;
}

export function FormField({
  label,
  htmlFor,
  required,
  hint,
  children,
}: FormFieldProps) {
  return (
    <div className="mb-4">
      <label
        htmlFor={htmlFor}
        className="mb-1.5 block font-pixel text-xs text-terminal-400"
      >
        {label}
        {required && <span className="ml-1 text-red-400">*</span>}
      </label>
      {children}
      {hint && (
        <p className="mt-1 font-pixel text-xs text-terminal-600">{hint}</p>
      )}
    </div>
  );
}

export const inputClasses =
  "w-full bg-black px-4 py-2.5 font-pixel text-sm text-white border border-terminal-400 focus:border-white focus:outline-none placeholder-terminal-600 transition-colors";

export const selectClasses =
  "w-full bg-black px-4 py-2.5 font-pixel text-sm text-white border border-terminal-400 focus:border-white focus:outline-none transition-colors";

export const textareaClasses =
  "w-full bg-black px-4 py-2.5 font-pixel text-sm text-white border border-terminal-400 focus:border-white focus:outline-none placeholder-terminal-600 transition-colors resize-y min-h-[80px]";
