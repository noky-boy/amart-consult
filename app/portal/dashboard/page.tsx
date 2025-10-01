// amart-consult/app/portal/dashboard/page.tsx
"use client";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useClientData, useProjectData } from "@/hooks/useClientData";
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
import { Loader2, AlertCircle, ArrowLeft } from "lucide-react";

type Tab = "overview" | "timeline" | "photos" | "documents" | "messages";

function ClientDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [showSettings, setShowSettings] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { signOut } = useClientAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const projectId = searchParams.get("project");

  const {
    user,
    client,
    authLoading,
    loading: clientLoading,
    error: clientError,
    projects,
  } = useClientData();

  const {
    loading: projectLoading,
    error: projectError,
    project,
    phases,
    documents,
    messages,
    photos,
    unreadMessagesCount,
    setMessages,
    markAdminMessagesAsRead,
  } = useProjectData(projectId);

  // Redirect to projects page if no project is selected
  useEffect(() => {
    if (!authLoading && !clientLoading && client && !projectId) {
      router.push("/portal/projects");
    }
  }, [authLoading, clientLoading, client, projectId, router]);

  // Redirect if project doesn't exist or doesn't belong to client
  useEffect(() => {
    if (
      !authLoading &&
      !clientLoading &&
      !projectLoading &&
      client &&
      projectId &&
      projects.length > 0
    ) {
      const projectExists = projects.some((p) => p.id === projectId);
      if (!projectExists) {
        router.push("/portal/projects");
      }
    }
  }, [
    authLoading,
    clientLoading,
    projectLoading,
    client,
    projectId,
    projects,
    router,
  ]);

  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab);
    if (tab === "messages") {
      markAdminMessagesAsRead();
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  if (authLoading || clientLoading || projectLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-indigo-600 mb-4 mx-auto" />
          <p className="text-slate-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (clientError || projectError) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center p-6">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">
            Error Loading Dashboard
          </h2>
          <p className="text-slate-600 mb-4">{clientError || projectError}</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </Card>
      </div>
    );
  }

  if (!client || !user || !project) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center p-6">
          <AlertCircle className="h-12 w-12 text-orange-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Project Not Found</h2>
          <p className="text-slate-600 mb-4">
            The requested project could not be found or you don't have access to
            it.
          </p>
          <Link href="/portal/projects">
            <Button>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Projects
            </Button>
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
            project={project}
            phases={phases}
            documents={documents}
            messages={messages}
            unreadMessagesCount={unreadMessagesCount}
          />
        );
      case "timeline":
        return <ProjectTimeline phases={phases} />;
      case "documents":
        return <ProjectDocuments documents={documents} />;
      case "photos":
        return <ProjectPhotos photos={photos} />;
      case "messages":
        return (
          <ProjectMessages
            messages={messages}
            client={client}
            project={project}
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
        currentProject={project}
        unreadMessagesCount={unreadMessagesCount}
        onShowSettings={() => setShowSettings(true)}
        onLogout={signOut}
        onToggleMobileMenu={toggleMobileMenu}
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
          isMobileMenuOpen={isMobileMenuOpen}
          onCloseMobileMenu={closeMobileMenu}
        />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}

export default function ClientDashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-indigo-600 mb-4 mx-auto" />
            <p className="text-slate-600">Loading dashboard...</p>
          </div>
        </div>
      }
    >
      <ClientDashboard />
    </Suspense>
  );
}
