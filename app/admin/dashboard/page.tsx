"use client";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import {
  TrendingUp,
  Users,
  Mail,
  FileText,
  MessageSquare,
  Plus,
  Eye,
  Edit,
  LogOut,
} from "lucide-react";
import { useState, useEffect } from "react";
import { clientService } from "@/lib/supabase";
import type { Client } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";

interface DashboardStats {
  totalClients: number;
  activeProjects: number;
  statusCounts: Record<string, number>;
  recentClients: Client[];
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalClients: 0,
    activeProjects: 0,
    statusCounts: {},
    recentClients: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { user, signOut } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const dashboardStats = await clientService.getDashboardStats();
        setStats(dashboardStats);
      } catch (err: any) {
        console.error("Failed to fetch dashboard data:", err);
        setError("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push("/admin/login");
    } catch (err) {
      console.error("Sign out error:", err);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Planning":
        return "bg-yellow-100 text-yellow-800";
      case "In Progress":
        return "bg-blue-100 text-blue-800";
      case "Review":
        return "bg-purple-100 text-purple-800";
      case "Completed":
        return "bg-green-100 text-green-800";
      case "On Hold":
        return "bg-orange-100 text-orange-800";
      case "Cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
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
      {/* Header */}
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

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">
                  Total Clients
                </p>
                <p className="text-3xl font-bold">{stats.totalClients}</p>
                <p className="text-blue-100 text-sm mt-1">Active clients</p>
              </div>
              <div className="p-3 rounded-full bg-blue-400">
                <Users className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-medium">
                  Active Projects
                </p>
                <p className="text-3xl font-bold">{stats.activeProjects}</p>
                <p className="text-green-100 text-sm mt-1">In progress</p>
              </div>
              <div className="p-3 rounded-full bg-green-400">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm font-medium">
                  Planning Phase
                </p>
                <p className="text-3xl font-bold">
                  {stats.statusCounts["Planning"] || 0}
                </p>
                <p className="text-purple-100 text-sm mt-1">New projects</p>
              </div>
              <div className="p-3 rounded-full bg-purple-400">
                <FileText className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm font-medium">Completed</p>
                <p className="text-3xl font-bold">
                  {stats.statusCounts["Completed"] || 0}
                </p>
                <p className="text-orange-100 text-sm mt-1">
                  Finished projects
                </p>
              </div>
              <div className="p-3 rounded-full bg-orange-400">
                <MessageSquare className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          {error}
        </div>
      )}

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-6 bg-white p-1 rounded-lg shadow-sm">
          <TabsTrigger value="overview" className="flex items-center space-x-2">
            <TrendingUp className="h-4 w-4" />
            <span>Overview</span>
          </TabsTrigger>
          <TabsTrigger value="clients" className="flex items-center space-x-2">
            <Users className="h-4 w-4" />
            <span>Clients</span>
          </TabsTrigger>
          <TabsTrigger
            value="newsletter"
            className="flex items-center space-x-2"
          >
            <Mail className="h-4 w-4" />
            <span>Newsletter</span>
          </TabsTrigger>
          <TabsTrigger
            value="documents"
            className="flex items-center space-x-2"
          >
            <FileText className="h-4 w-4" />
            <span>Documents</span>
          </TabsTrigger>
          <TabsTrigger value="messages" className="flex items-center space-x-2">
            <MessageSquare className="h-4 w-4" />
            <span>Messages</span>
          </TabsTrigger>
          <TabsTrigger
            value="analytics"
            className="flex items-center space-x-2"
          >
            <TrendingUp className="h-4 w-4" />
            <span>Analytics</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Clients */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="flex items-center space-x-2">
                    <Users className="h-5 w-5" />
                    <span>Recent Clients</span>
                  </CardTitle>
                </div>
                <Button size="sm" asChild>
                  <Link href="/admin/clients/add">
                    <Plus className="h-4 w-4 mr-1" />
                    Add Client
                  </Link>
                </Button>
              </CardHeader>
              <CardContent>
                {stats.recentClients.length > 0 ? (
                  <div className="space-y-4">
                    {stats.recentClients.map((client) => (
                      <div
                        key={client.id}
                        className="flex items-center justify-between p-4 border border-slate-200 rounded-lg"
                      >
                        <div className="flex-1">
                          <h4 className="font-semibold text-slate-900">
                            {client.first_name} {client.last_name}
                          </h4>
                          <p className="text-sm text-slate-600">
                            {client.project_title}
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge className={getStatusColor(client.status)}>
                              {client.status}
                            </Badge>
                            <Badge variant="outline">{client.tier}</Badge>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="ghost" asChild>
                            <Link href={`/admin/clients/${client.id}`}>
                              <Eye className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Button size="sm" variant="ghost" asChild>
                            <Link href={`/admin/clients/${client.id}/edit`}>
                              <Edit className="h-4 w-4" />
                            </Link>
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Users className="h-12 w-12 text-slate-400 mx-auto mb-3" />
                    <h3 className="text-lg font-semibold text-slate-900">
                      No clients yet
                    </h3>
                    <p className="text-slate-600 mb-4">
                      Get started by adding your first client
                    </p>
                    <Button asChild>
                      <Link href="/admin/clients/add">
                        <Plus className="h-4 w-4 mr-2" />
                        Add First Client
                      </Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Project Status Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5" />
                  <span>Project Status Breakdown</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {Object.keys(stats.statusCounts).length > 0 ? (
                  <div className="space-y-4">
                    {Object.entries(stats.statusCounts).map(
                      ([status, count]) => (
                        <div
                          key={status}
                          className="flex items-center justify-between"
                        >
                          <div className="flex items-center gap-3">
                            <Badge className={getStatusColor(status)}>
                              {status}
                            </Badge>
                            <span className="text-sm text-slate-600">
                              {count} projects
                            </span>
                          </div>
                          <div className="w-24 bg-slate-200 rounded-full h-2">
                            <div
                              className="bg-indigo-600 h-2 rounded-full"
                              style={{
                                width:
                                  stats.totalClients > 0
                                    ? `${(count / stats.totalClients) * 100}%`
                                    : "0%",
                              }}
                            ></div>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <TrendingUp className="h-12 w-12 text-slate-400 mx-auto mb-3" />
                    <p className="text-slate-600">No project data available</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="clients" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Client Management</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                className="w-full justify-start bg-transparent"
                variant="outline"
                asChild
              >
                <Link href="/admin/clients/add">
                  <Plus className="h-4 w-4 mr-2" />
                  Add New Client
                </Link>
              </Button>
              <Button
                className="w-full justify-start bg-transparent"
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

        <TabsContent value="newsletter" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Newsletter Management</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                className="w-full justify-start bg-transparent"
                variant="outline"
              >
                <Mail className="h-4 w-4 mr-2" />
                Create Campaign
              </Button>
              <Button
                className="w-full justify-start bg-transparent"
                variant="outline"
              >
                <Mail className="h-4 w-4 mr-2" />
                Schedule Email
              </Button>
              <Button
                className="w-full justify-start bg-transparent"
                variant="outline"
                asChild
              >
                <Link href="/email-templates">
                  <Mail className="h-4 w-4 mr-2" />
                  Email Templates
                </Link>
              </Button>
              <Button
                className="w-full justify-start bg-transparent"
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
                className="w-full justify-start bg-transparent"
                variant="outline"
                asChild
              >
                <Link href="/admin/documents">
                  <FileText className="h-4 w-4 mr-2" />
                  Manage Documents
                </Link>
              </Button>
              <Button
                className="w-full justify-start bg-transparent"
                variant="outline"
                asChild
              >
                <Link href="/admin/documents/upload">
                  <FileText className="h-4 w-4 mr-2" />
                  Simple Upload
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
                className="w-full justify-start bg-transparent"
                variant="outline"
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                View Messages
              </Button>
              <Button
                className="w-full justify-start bg-transparent"
                variant="outline"
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                Send Message
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Analytics & Reports</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                className="w-full justify-start bg-transparent"
                variant="outline"
              >
                <TrendingUp className="h-4 w-4 mr-2" />
                View Analytics
              </Button>
              <Button
                className="w-full justify-start bg-transparent"
                variant="outline"
              >
                <TrendingUp className="h-4 w-4 mr-2" />
                Generate Report
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
