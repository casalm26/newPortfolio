"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { EditorToolbar } from "./EditorToolbar";
import { EditorPreview } from "./EditorPreview";
import type { EditorView as EditorViewType } from "@codemirror/view";

interface MDXEditorProps {
  value: string;
  onChange: (value: string) => void;
}

type ViewMode = "edit" | "split" | "preview";

export function MDXEditor({ value, onChange }: MDXEditorProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const editorViewRef = useRef<EditorViewType | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("split");
  const [mounted, setMounted] = useState(false);
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  const initEditor = useCallback(async () => {
    if (!containerRef.current) return;

    const { EditorView } = await import("@codemirror/view");
    const { EditorState } = await import("@codemirror/state");
    const { markdown } = await import("@codemirror/lang-markdown");
    const { oneDark } = await import("@codemirror/theme-one-dark");
    const { basicSetup } = await import("codemirror");

    // Clean up existing editor
    if (editorViewRef.current) {
      editorViewRef.current.destroy();
    }

    const terminalTheme = EditorView.theme({
      "&": {
        backgroundColor: "#000",
        color: "#fff",
        fontSize: "13px",
        fontFamily: '"Courier New", Monaco, Menlo, monospace',
      },
      ".cm-gutters": {
        backgroundColor: "#000",
        color: "#666",
        borderRight: "1px solid #444",
      },
      ".cm-activeLine": {
        backgroundColor: "#111",
      },
      ".cm-activeLineGutter": {
        backgroundColor: "#111",
      },
      "&.cm-focused": {
        outline: "none",
      },
      ".cm-cursor": {
        borderLeftColor: "#fff",
      },
      ".cm-selectionBackground": {
        backgroundColor: "#333 !important",
      },
      "&.cm-focused .cm-selectionBackground": {
        backgroundColor: "#444 !important",
      },
    });

    const state = EditorState.create({
      doc: value,
      extensions: [
        basicSetup,
        markdown(),
        oneDark,
        terminalTheme,
        EditorView.updateListener.of((update) => {
          if (update.docChanged) {
            onChangeRef.current(update.state.doc.toString());
          }
        }),
        EditorView.lineWrapping,
      ],
    });

    const view = new EditorView({
      state,
      parent: containerRef.current,
    });

    editorViewRef.current = view;
    setMounted(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // intentionally empty — value is only used for initial doc

  useEffect(() => {
    initEditor();
    return () => {
      editorViewRef.current?.destroy();
    };
  }, [initEditor]);

  // Sync external value changes (e.g. when loading data for editing)
  useEffect(() => {
    const view = editorViewRef.current;
    if (view && view.state.doc.toString() !== value) {
      view.dispatch({
        changes: { from: 0, to: view.state.doc.length, insert: value },
      });
    }
  }, [value]);

  const VIEW_MODES: { mode: ViewMode; label: string }[] = [
    { mode: "edit", label: "Edit" },
    { mode: "split", label: "Split" },
    { mode: "preview", label: "Preview" },
  ];

  return (
    <div className="border border-terminal-400">
      <div className="flex items-center justify-between border-b border-terminal-400 px-2 py-1">
        <EditorToolbar editorView={mounted ? editorViewRef.current : null} />
        <div className="flex gap-1">
          {VIEW_MODES.map(({ mode, label }) => (
            <button
              key={mode}
              type="button"
              onClick={() => setViewMode(mode)}
              className={`px-2 py-1 font-pixel text-xs transition-colors ${
                viewMode === mode
                  ? "border border-white bg-white text-black"
                  : "border border-transparent text-terminal-400 hover:text-white"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div
        className={`flex ${viewMode === "split" ? "divide-x divide-terminal-400" : ""}`}
        style={{ minHeight: "400px" }}
      >
        {viewMode !== "preview" && (
          <div
            ref={containerRef}
            className={`${viewMode === "split" ? "w-1/2" : "w-full"} overflow-auto`}
            style={{ minHeight: "400px" }}
          />
        )}
        {viewMode !== "edit" && (
          <div
            className={`${viewMode === "split" ? "w-1/2" : "w-full"} overflow-auto bg-black`}
            style={{ minHeight: "400px" }}
          >
            <EditorPreview content={value} />
          </div>
        )}
      </div>
    </div>
  );
}
