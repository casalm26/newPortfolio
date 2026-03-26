"use client";

import { AdminShell } from "@/components/admin/AdminShell";
import { VideoForm } from "@/components/admin/forms/VideoForm";

export default function NewVideoPage() {
  return (
    <AdminShell>
      <div className="mb-6">
        <h1 className="font-pixel text-sm text-white">
          admin@cms:~/videos$ touch new-video
        </h1>
        <p className="mt-1 font-pixel text-xs text-terminal-500">
          Create new video
        </p>
      </div>
      <VideoForm />
    </AdminShell>
  );
}
