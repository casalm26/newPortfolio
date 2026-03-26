"use client";

import type { ReactNode } from "react";
import { AdminSidebar } from "./AdminSidebar";
import { AuthGate } from "./AuthGate";

export function AdminShell({ children }: { children: ReactNode }) {
  return (
    <AuthGate>
      <div className="flex min-h-screen bg-black">
        <AdminSidebar />
        <main className="ml-56 flex-1 p-8">{children}</main>
      </div>
    </AuthGate>
  );
}
