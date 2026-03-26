import type { Metadata } from "next";
import { AuthProvider } from "@/components/admin/AuthContext";
import { ToastProvider } from "@/components/admin/shared/Toast";

export const metadata: Metadata = {
  title: "Admin CMS",
  robots: { index: false, follow: false },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <ToastProvider>{children}</ToastProvider>
    </AuthProvider>
  );
}
