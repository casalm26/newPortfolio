"use client";

import { AdminShell } from "@/components/admin/AdminShell";
import { TimelineEntryForm } from "@/components/admin/forms/TimelineEntryForm";

export default function NewTimelinePage() {
  return (
    <AdminShell>
      <div className="mb-6">
        <h1 className="font-pixel text-sm text-white">
          admin@cms:~/timeline$ touch new-entry
        </h1>
        <p className="mt-1 font-pixel text-xs text-terminal-500">
          Create new timeline entry
        </p>
      </div>
      <TimelineEntryForm />
    </AdminShell>
  );
}
