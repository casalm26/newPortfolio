"use client";

import { AdminShell } from "@/components/admin/AdminShell";
import { BlogPostForm } from "@/components/admin/forms/BlogPostForm";

export default function NewPostPage() {
  return (
    <AdminShell>
      <div className="mb-6">
        <h1 className="font-pixel text-sm text-white">
          admin@cms:~/posts$ touch new-post
        </h1>
        <p className="mt-1 font-pixel text-xs text-terminal-500">
          Create new blog post
        </p>
      </div>
      <BlogPostForm />
    </AdminShell>
  );
}
