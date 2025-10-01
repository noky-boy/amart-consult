"use client";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import {
  TrendingUp,
  Users,
  Mail,
  FileText,
  MessageSquare,
  Plus,
  LogOut,
  Building2,
  FolderOpen,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useAdminDashboard } from "@/hooks/useAdminDashboard";
import { DashboardStatCards } from "@/components/admin/DashboardStatCards";
import { RecentClientsCard } from "@/components/admin/RecentClientsCard";
import { RecentProjectsCard } from "@/components/admin/RecentProjectsCard";
import { ProjectStatusBreakdown } from "@/components/admin/ProjectStatusBreakdown";
import { MobileNav } from "@/components/admin/MobileNav";
import { Suspense, useState } from "react";

function DashboardPage() {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const { stats, loading, error, enablingPortal, handleEnablePortalAccess } =
    useAdminDashboard();
  const [activeTab, setActiveTab] = useState("overview");

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push("/admin/login");
    } catch (err) {
      console.error("Sign out error:", err);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-4 sm:p-6">
        <div className="animate-pulse">
          <div className="mb-6 sm:mb-8">
            <div className="h-6 sm:h-8 bg-gray-200 rounded w-48 sm:w-64 mb-2"></div>
            <div className="h-3 sm:h-4 bg-gray-200 rounded w-64 sm:w-96"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-28 sm:h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto p-4 sm:p-6">
        {/* Header Section */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Admin Dashboard
              </h1>
              <p className="text-sm sm:text-base text-gray-600 mt-1 sm:mt-2">
                Welcome back, {user?.email}
              </p>
            </div>
            <Button
              variant="outline"
              onClick={handleSignOut}
              className="w-full sm:w-auto"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <DashboardStatCards
          totalClients={stats.totalClients}
          totalProjects={stats.totalProjects}
          activeProjects={stats.activeProjects}
          completedProjects={stats.statusCounts["Completed"] || 0}
        />

        {/* Error Message */}
        {error && (
          <div className="mb-4 sm:mb-6 bg-red-50 border border-red-200 text-red-700 px-3 sm:px-4 py-2 sm:py-3 rounded-md text-sm">
            {error}
          </div>
        )}

        {/* Mobile Navigation */}
        <MobileNav activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Desktop & Mobile Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          {/* Desktop Tab List - Hidden on Mobile */}
          <TabsList className="hidden lg:grid w-full grid-cols-6 bg-white p-1 rounded-lg shadow-sm mb-6">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              <span className="hidden xl:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger value="clients" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span className="hidden xl:inline">Clients</span>
            </TabsTrigger>
            <TabsTrigger value="projects" className="flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              <span className="hidden xl:inline">Projects</span>
            </TabsTrigger>
            <TabsTrigger value="newsletter" className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              <span className="hidden xl:inline">Newsletter</span>
            </TabsTrigger>
            <TabsTrigger value="documents" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span className="hidden xl:inline">Documents</span>
            </TabsTrigger>
            <TabsTrigger value="messages" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              <span className="hidden xl:inline">Messages</span>
            </TabsTrigger>
          </TabsList>

          {/* Tab Content */}
          <TabsContent value="overview" className="mt-4 sm:mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              <RecentClientsCard
                clients={stats.recentClients}
                enablingPortal={enablingPortal}
                onEnablePortalAccess={handleEnablePortalAccess}
              />
              <RecentProjectsCard projects={stats.recentProjects} />
            </div>
            <div className="mt-4 sm:mt-6">
              <ProjectStatusBreakdown
                statusCounts={stats.statusCounts}
                totalProjects={stats.totalProjects}
              />
            </div>
          </TabsContent>

          <TabsContent value="clients" className="mt-4 sm:mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Client Management</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 sm:space-y-4">
                <Button
                  className="w-full justify-start"
                  variant="outline"
                  asChild
                >
                  <Link href="/admin/clients/add">
                    <Plus className="h-4 w-4 mr-2" />
                    Add New Client
                  </Link>
                </Button>
                <Button
                  className="w-full justify-start"
                  variant="outline"
                  asChild
                >
                  <Link href="/admin/clients">
                    <Users className="h-4 w-4 mr-2" />
                    View All Clients
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="projects" className="mt-4 sm:mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Project Management</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 sm:space-y-4">
                <Button
                  className="w-full justify-start"
                  variant="outline"
                  asChild
                >
                  <Link href="/admin/projects/add">
                    <Plus className="h-4 w-4 mr-2" />
                    Add New Project
                  </Link>
                </Button>
                <Button
                  className="w-full justify-start"
                  variant="outline"
                  asChild
                >
                  <Link href="/admin/projects">
                    <FolderOpen className="h-4 w-4 mr-2" />
                    View All Projects
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="newsletter" className="mt-4 sm:mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Newsletter Management</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 sm:space-y-4">
                <Button className="w-full justify-start" variant="outline">
                  <Mail className="h-4 w-4 mr-2" />
                  Create Campaign
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Mail className="h-4 w-4 mr-2" />
                  Schedule Email
                </Button>
                <Button
                  className="w-full justify-start"
                  variant="outline"
                  asChild
                >
                  <Link href="/email-templates">
                    <Mail className="h-4 w-4 mr-2" />
                    Email Templates
                  </Link>
                </Button>
                <Button
                  className="w-full justify-start"
                  variant="outline"
                  asChild
                >
                  <Link href="/admin/automation">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Automation
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="documents" className="mt-4 sm:mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Document Management</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 sm:space-y-4">
                <Button
                  className="w-full justify-start"
                  variant="outline"
                  asChild
                >
                  <Link href="/admin/documents">
                    <FileText className="h-4 w-4 mr-2" />
                    Manage Documents
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="messages" className="mt-4 sm:mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Message Center</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 sm:space-y-4">
                <Button
                  className="w-full justify-start"
                  variant="outline"
                  asChild
                >
                  <Link href="/admin/messages">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Message Center
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default function DashboardPages() {
  return (
    <Suspense
      fallback={
        <div className="container mx-auto p-4 sm:p-6">
          <div className="animate-pulse">
            <div className="mb-6 sm:mb-8">
              <div className="h-6 sm:h-8 bg-gray-200 rounded w-48 sm:w-64 mb-2"></div>
              <div className="h-3 sm:h-4 bg-gray-200 rounded w-64 sm:w-96"></div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-28 sm:h-32 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      }
    >
      <DashboardPage />
    </Suspense>
  );
}
