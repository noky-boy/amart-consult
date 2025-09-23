"use client";

import { ClientAuthProvider } from "@/hooks/useClientAuth";

export default function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClientAuthProvider>
      <div className="min-h-screen">{children}</div>
    </ClientAuthProvider>
  );
}
