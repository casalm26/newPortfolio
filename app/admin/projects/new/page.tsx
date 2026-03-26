"use client";

import { AdminShell } from "@/components/admin/AdminShell";
import { ProjectForm } from "@/components/admin/forms/ProjectForm";

export default function NewProjectPage() {
  return (
    <AdminShell>
      <div className="mb-6">
        <h1 className="font-pixel text-sm text-white">
          admin@cms:~/projects$ touch new-project
        </h1>
        <p className="mt-1 font-pixel text-xs text-terminal-500">
          Create new project
        </p>
      </div>
      <ProjectForm />
    </AdminShell>
  );
}
