"use client";

import { AdminAuthProvider } from "@/hooks/useAdminAuth";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminAuthProvider>
      <div className="min-h-screen">{children}</div>
    </AdminAuthProvider>
  );
}
