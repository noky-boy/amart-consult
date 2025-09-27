// amart-consult/app/portal/dashboard/page.tsx
"use client";
import { useState } from "react";
import Link from "next/link";
import { useClientData } from "@/hooks/useClientData";
import { useClientAuth } from "@/hooks/useClientAuth";

// Layout & Modal Components
import ClientHeader from "@/components/portal/ClientHeader";
import ClientSidebar from "@/components/portal/ClientSidebar";
import ChangePasswordModal from "@/components/portal/ChangePasswordModal";

// Tab Content Components
import DashboardOverview from "@/components/dashboard/DashboardOverview";
import ProjectTimeline from "@/components/dashboard/ProjectTimeline";
import ProjectDocuments from "@/components/dashboard/ProjectDocuments";
import ProjectPhotos from "@/components/dashboard/ProjectPhotos";
import ProjectMessages from "@/components/dashboard/ProjectMessages";

// UI & Icons
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, AlertCircle } from "lucide-react";

type Tab = "overview" | "timeline" | "photos" | "documents" | "messages";

export default function ClientDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [showSettings, setShowSettings] = useState(false);
  const { signOut } = useClientAuth();

  const {
    user,
    client,
    authLoading,
    loading,
    error,
    milestones,
    documents,
    messages,
    photos,
    unreadMessagesCount,
    setMessages,
    markAdminMessagesAsRead,
  } = useClientData();

  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab);
    if (tab === "messages") {
      markAdminMessagesAsRead();
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Card className="w-full max-w-md text-center p-6">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">
            Error Loading Dashboard
          </h2>
          <p className="text-slate-600 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </Card>
      </div>
    );
  }

  if (!client || !user) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Card className="w-full max-w-md text-center p-6">
          <AlertCircle className="h-12 w-12 text-orange-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Account Setup Required</h2>
          <p className="text-slate-600 mb-4">
            Your account needs to be linked to a client profile. Please contact
            support.
          </p>
          <Link href="/contact">
            <Button>Contact Support</Button>
          </Link>
        </Card>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <DashboardOverview
            client={client}
            milestones={milestones}
            documents={documents}
            messages={messages}
            unreadMessagesCount={unreadMessagesCount}
          />
        );
      case "timeline":
        return <ProjectTimeline milestones={milestones} />;
      case "documents":
        return <ProjectDocuments documents={documents} />;
      case "photos":
        return <ProjectPhotos photos={photos} />;
      case "messages":
        return (
          <ProjectMessages
            messages={messages}
            client={client}
            user={user}
            onNewMessage={setMessages}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <ClientHeader
        client={client}
        unreadMessagesCount={unreadMessagesCount}
        onShowSettings={() => setShowSettings(true)}
        onLogout={signOut}
      />

      {showSettings && (
        <ChangePasswordModal onClose={() => setShowSettings(false)} />
      )}

      <div className="flex">
        <ClientSidebar
          activeTab={activeTab}
          onTabChange={handleTabChange}
          photoCount={photos.length}
          documentCount={documents.length}
          unreadMessagesCount={unreadMessagesCount}
        />
        <main className="flex-1 p-8">{renderContent()}</main>
      </div>
    </div>
  );
}
