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
import { Suspense } from "react";

function DashboardPage() {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const { stats, loading, error, enablingPortal, handleEnablePortalAccess } =
    useAdminDashboard();

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
      <div className="container mx-auto p-6">
        <div className="animate-pulse">
          <div className="mb-8">
            <div className="h-8 bg-gray-200 rounded w-64 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-96"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome back, {user?.email}</p>
        </div>
        <Button variant="outline" onClick={handleSignOut}>
          <LogOut className="h-4 w-4 mr-2" />
          Sign Out
        </Button>
      </div>

      <DashboardStatCards
        totalClients={stats.totalClients}
        totalProjects={stats.totalProjects}
        activeProjects={stats.activeProjects}
        completedProjects={stats.statusCounts["Completed"] || 0}
      />

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          {error}
        </div>
      )}

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-6 bg-white p-1 rounded-lg shadow-sm">
          <TabsTrigger value="overview" className="flex items-center space-x-2">
            <TrendingUp className="h-4 w-4" /> <span>Overview</span>
          </TabsTrigger>
          <TabsTrigger value="clients" className="flex items-center space-x-2">
            <Users className="h-4 w-4" /> <span>Clients</span>
          </TabsTrigger>
          <TabsTrigger value="projects" className="flex items-center space-x-2">
            <Building2 className="h-4 w-4" /> <span>Projects</span>
          </TabsTrigger>
          <TabsTrigger
            value="newsletter"
            className="flex items-center space-x-2"
          >
            <Mail className="h-4 w-4" /> <span>Newsletter</span>
          </TabsTrigger>
          <TabsTrigger
            value="documents"
            className="flex items-center space-x-2"
          >
            <FileText className="h-4 w-4" /> <span>Documents</span>
          </TabsTrigger>
          <TabsTrigger value="messages" className="flex items-center space-x-2">
            <MessageSquare className="h-4 w-4" /> <span>Messages</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <RecentClientsCard
              clients={stats.recentClients}
              enablingPortal={enablingPortal}
              onEnablePortalAccess={handleEnablePortalAccess}
            />
            <RecentProjectsCard projects={stats.recentProjects} />
          </div>
          <div className="mt-6">
            <ProjectStatusBreakdown
              statusCounts={stats.statusCounts}
              totalProjects={stats.totalProjects}
            />
          </div>
        </TabsContent>

        <TabsContent value="clients" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Client Management</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
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

        <TabsContent value="projects" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Project Management</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
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

        <TabsContent value="newsletter" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Newsletter Management</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
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

        <TabsContent value="documents" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Document Management</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
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

        <TabsContent value="messages" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Message Center</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
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
  );
}

export default function DashboardPages() {
  return (
    <Suspense
      fallback={
        <div className="container mx-auto p-6">
          <div className="animate-pulse">
            <div className="mb-8">
              <div className="h-8 bg-gray-200 rounded w-64 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-96"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 rounded"></div>
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
