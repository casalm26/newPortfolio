"use client";

import type { EditorView } from "@codemirror/view";

interface ToolbarAction {
  label: string;
  title: string;
  action: (view: EditorView) => void;
}

function wrapSelection(view: EditorView, before: string, after: string) {
  const { from, to } = view.state.selection.main;
  const selected = view.state.sliceDoc(from, to);
  const replacement = selected
    ? `${before}${selected}${after}`
    : `${before}text${after}`;
  view.dispatch({
    changes: { from, to, insert: replacement },
    selection: {
      anchor: selected ? from + before.length : from + before.length,
      head: selected
        ? from + before.length + selected.length
        : from + before.length + 4,
    },
  });
  view.focus();
}

function insertAtCursor(view: EditorView, text: string) {
  const { from } = view.state.selection.main;
  view.dispatch({ changes: { from, insert: text } });
  view.focus();
}

function insertAtLineStart(view: EditorView, prefix: string) {
  const { from } = view.state.selection.main;
  const line = view.state.doc.lineAt(from);
  view.dispatch({
    changes: { from: line.from, insert: prefix },
  });
  view.focus();
}

const ACTIONS: ToolbarAction[] = [
  {
    label: "B",
    title: "Bold",
    action: (v) => wrapSelection(v, "**", "**"),
  },
  {
    label: "I",
    title: "Italic",
    action: (v) => wrapSelection(v, "*", "*"),
  },
  {
    label: "H2",
    title: "Heading 2",
    action: (v) => insertAtLineStart(v, "## "),
  },
  {
    label: "H3",
    title: "Heading 3",
    action: (v) => insertAtLineStart(v, "### "),
  },
  {
    label: "{}",
    title: "Inline Code",
    action: (v) => wrapSelection(v, "`", "`"),
  },
  {
    label: "</>",
    title: "Code Block",
    action: (v) => insertAtCursor(v, "\n```\n\n```\n"),
  },
  {
    label: "Link",
    title: "Link",
    action: (v) => {
      const { from, to } = v.state.selection.main;
      const selected = v.state.sliceDoc(from, to);
      const text = selected || "link text";
      v.dispatch({
        changes: { from, to, insert: `[${text}](url)` },
      });
      v.focus();
    },
  },
  {
    label: "Img",
    title: "Image",
    action: (v) => insertAtCursor(v, "![alt](url)"),
  },
  {
    label: "UL",
    title: "Unordered List",
    action: (v) => insertAtLineStart(v, "- "),
  },
  {
    label: "OL",
    title: "Ordered List",
    action: (v) => insertAtLineStart(v, "1. "),
  },
  {
    label: ">",
    title: "Blockquote",
    action: (v) => insertAtLineStart(v, "> "),
  },
  {
    label: "---",
    title: "Horizontal Rule",
    action: (v) => insertAtCursor(v, "\n---\n"),
  },
];

interface EditorToolbarProps {
  editorView: EditorView | null;
}

export function EditorToolbar({ editorView }: EditorToolbarProps) {
  return (
    <div className="flex flex-wrap gap-1 border-b border-terminal-400 px-2 py-1.5">
      {ACTIONS.map((action) => (
        <button
          key={action.label}
          type="button"
          title={action.title}
          onClick={() => editorView && action.action(editorView)}
          disabled={!editorView}
          className="border border-terminal-500 px-2 py-1 font-pixel text-xs text-terminal-400 transition-colors hover:border-white hover:text-white disabled:opacity-30"
        >
          {action.label}
        </button>
      ))}
    </div>
  );
}
