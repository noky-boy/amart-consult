"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  MessageSquare,
  FileText,
  Camera,
  Bell,
  LogOut,
  TrendingUp,
  Clock,
  CheckCircle,
  Download,
  Send,
  AlertCircle,
  Loader2,
  Eye,
  X,
  Settings,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRequireAuth, useClientAuth } from "@/hooks/useClientAuth";
import {
  milestoneService,
  documentService,
  messageService,
} from "@/lib/supabase";
import type {
  ProjectMilestone,
  ClientDocument,
  ClientMessage,
} from "@/lib/supabase";

export default function ClientDashboard() {
  const { user, client, loading: authLoading } = useRequireAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Data states
  const [milestones, setMilestones] = useState<ProjectMilestone[]>([]);
  const [documents, setDocuments] = useState<ClientDocument[]>([]);
  const [messages, setMessages] = useState<ClientMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [sendingMessage, setSendingMessage] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [updatingPassword, setUpdatingPassword] = useState(false);

  useEffect(() => {
    if (client?.id) {
      fetchClientData();
    }
  }, [client?.id]);

  const fetchClientData = async () => {
    if (!client?.id) return;

    try {
      setLoading(true);
      setError("");

      const [milestonesData, documentsData, messagesData] = await Promise.all([
        milestoneService.getByClientId(client.id).catch(() => []),
        documentService.getByClientId(client.id).catch(() => []),
        messageService.getByClientId(client.id).catch(() => []),
      ]);

      setMilestones(milestonesData);
      setDocuments(documentsData);
      setMessages(messagesData);
    } catch (err: any) {
      console.error("Failed to fetch client data:", err);
      setError("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const { signOut, updatePassword } = useClientAuth();

  const handleLogout = async () => {
    try {
      await signOut();
      // Redirect will be handled by the auth provider
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const handlePasswordUpdate = async () => {
    if (newPassword !== confirmPassword) {
      alert("Passwords don't match");
      return;
    }

    if (newPassword.length < 8) {
      alert("Password must be at least 8 characters long");
      return;
    }

    setUpdatingPassword(true);
    try {
      const result = await updatePassword(newPassword);
      if (result.success) {
        alert("Password updated successfully");
        setNewPassword("");
        setConfirmPassword("");
        setShowSettings(false);
      } else {
        alert(`Failed to update password: ${result.error}`);
      }
    } catch (error: any) {
      alert(`Failed to update password: ${error.message}`);
    } finally {
      setUpdatingPassword(false);
    }
  };

  // Update the handleSendMessage function in your dashboard page.tsx:

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !client?.id || !user?.email) return;

    setSendingMessage(true);
    try {
      const response = await fetch("/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          client_id: client.id,
          sender_type: "client",
          sender_name: `${client.first_name} ${client.last_name}`,
          message: newMessage,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to send message");
      }

      setNewMessage("");
      // Refresh messages
      const updatedMessages = await messageService.getByClientId(client.id);
      setMessages(updatedMessages);
    } catch (error: any) {
      console.error("Failed to send message:", error);
      alert(`Failed to send message: ${error.message}`);
    } finally {
      setSendingMessage(false);
    }
  };

  const calculateProjectProgress = () => {
    if (milestones.length === 0) return 0;
    const completed = milestones.filter((m) => m.status === "completed").length;
    return Math.round((completed / milestones.length) * 100);
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

  const getMilestoneStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500";
      case "in-progress":
        return "bg-blue-500";
      case "pending":
        return "bg-slate-300";
      case "cancelled":
        return "bg-red-500";
      default:
        return "bg-slate-300";
    }
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  // Show loading state
  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-indigo-600 mx-auto mb-4" />
          <p className="text-slate-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-slate-900 mb-2">
                Error Loading Dashboard
              </h2>
              <p className="text-slate-600 mb-4">{error}</p>
              <Button onClick={() => window.location.reload()}>
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!client) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <AlertCircle className="h-12 w-12 text-orange-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-slate-900 mb-2">
                Account Setup Required
              </h2>
              <p className="text-slate-600 mb-4">
                Your account needs to be linked to a client profile. Please
                contact support.
              </p>
              <Link href="/contact">
                <Button>Contact Support</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const projectProgress = calculateProjectProgress();
  const completedMilestones = milestones.filter(
    (m) => m.status === "completed"
  ).length;
  const unreadMessages = messages.filter(
    (m) => m.sender_type === "admin" && !m.is_read
  ).length;
  const photos = documents.filter(
    (doc) => doc.file_type?.startsWith("image/") || doc.category === "photos"
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200/60 sticky top-0 z-40 shadow-sm">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link
                href="/"
                className="flex items-center hover:opacity-80 transition-opacity"
              >
                <Image
                  src="/images/amart-logo.png"
                  alt="Amart Consult"
                  width={120}
                  height={40}
                />
              </Link>
              <div className="h-6 w-px bg-slate-300"></div>
              <h1 className="text-xl font-serif font-bold text-slate-800">
                Client Portal
              </h1>
            </div>

            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                className="relative hover:bg-slate-100 transition-colors"
              >
                <Bell className="h-4 w-4" />
                {unreadMessages > 0 && (
                  <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full animate-pulse"></span>
                )}
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowSettings(true)}
                className="hover:bg-slate-100 transition-colors"
              >
                <Settings className="h-4 w-4" />
              </Button>

              <div className="flex items-center space-x-3 bg-slate-50 rounded-full px-3 py-2">
                <Avatar className="h-8 w-8 ring-2 ring-indigo-100">
                  <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-xs font-semibold">
                    {client?.first_name[0]}
                    {client?.last_name[0]}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium text-slate-700">
                  {client?.first_name} {client?.last_name}
                </span>
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="hover:bg-red-50 hover:text-red-600 transition-colors"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Settings Modal - Add this after the header, before the sidebar */}
      {showSettings && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-slate-700 mb-2">
                  Change Password
                </h3>
                <div className="space-y-3">
                  <Input
                    type="password"
                    placeholder="New password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    minLength={8}
                  />
                  <Input
                    type="password"
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    minLength={8}
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setShowSettings(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handlePasswordUpdate}
                  disabled={
                    updatingPassword || !newPassword || !confirmPassword
                  }
                  className="flex-1"
                >
                  {updatingPassword ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : null}
                  Update Password
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="flex min-h-screen">
        {/* Sidebar */}
        <aside className="w-64 bg-white/70 backdrop-blur-sm border-r border-slate-200/60">
          <nav className="p-6">
            <div className="space-y-2">
              {[
                { id: "overview", label: "Overview", icon: TrendingUp },
                { id: "timeline", label: "Timeline", icon: Clock },
                {
                  id: "photos",
                  label: `Photos (${photos.length})`,
                  icon: Camera,
                },
                {
                  id: "documents",
                  label: `Documents (${documents.length})`,
                  icon: FileText,
                },
                {
                  id: "messages",
                  label: "Messages",
                  icon: MessageSquare,
                  badge: unreadMessages,
                },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                    activeTab === tab.id
                      ? "bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-lg shadow-indigo-200 transform scale-105"
                      : "text-slate-700 hover:bg-slate-100 hover:scale-102 hover:shadow-sm"
                  }`}
                >
                  <tab.icon className="mr-3 h-4 w-4" />
                  <span className="flex-1 text-left">{tab.label}</span>
                  {tab.badge && tab.badge > 0 && (
                    <span className="ml-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                      {tab.badge}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Team Info */}
            <div className="mt-8 p-4 bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl border border-slate-200">
              <h3 className="text-sm font-semibold text-slate-700 mb-3 text-center">
                Your Project Team
              </h3>
              <div className="flex items-center justify-center space-x-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white text-xs">
                    AM
                  </AvatarFallback>
                </Avatar>
                <div className="text-center">
                  <p className="text-xs font-medium text-slate-700">
                    Amart Consult
                  </p>
                  <p className="text-xs text-slate-500">
                    Your Architecture Team
                  </p>
                </div>
              </div>
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          {/* Overview Tab */}
          {activeTab === "overview" && (
            <div className="space-y-8">
              <div className="text-center">
                <h2 className="text-3xl font-serif font-bold text-slate-900 mb-2">
                  Project Overview
                </h2>
                <p className="text-slate-600">{client.project_title}</p>
                <Badge className={`mt-2 ${getStatusColor(client.status)}`}>
                  {client.status}
                </Badge>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <CardContent className="p-6 text-center">
                    <div className="p-3 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl mb-4 mx-auto w-fit">
                      <TrendingUp className="h-6 w-6 text-white" />
                    </div>
                    <p className="text-sm font-medium text-slate-600 mb-2">
                      Overall Progress
                    </p>
                    <p className="text-3xl font-bold text-slate-900 mb-4">
                      {projectProgress}%
                    </p>
                    <Progress value={projectProgress} className="h-2 w-full" />
                    <p className="text-xs text-slate-500 mt-2">
                      {completedMilestones} of {milestones.length} milestones
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <CardContent className="p-6 text-center">
                    <div className="p-3 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl mb-4 mx-auto w-fit">
                      <Calendar className="h-6 w-6 text-white" />
                    </div>
                    <p className="text-sm font-medium text-slate-600 mb-2">
                      Project Type
                    </p>
                    <p className="text-2xl font-bold text-slate-900 mb-4 capitalize">
                      {client.project_type}
                    </p>
                    <p className="text-xs text-slate-500">
                      {client.timeline || "Timeline TBD"}
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <CardContent className="p-6 text-center">
                    <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-xl mb-4 mx-auto w-fit">
                      <CheckCircle className="h-6 w-6 text-white" />
                    </div>
                    <p className="text-sm font-medium text-slate-600 mb-2">
                      Completed Tasks
                    </p>
                    <p className="text-3xl font-bold text-slate-900 mb-4">
                      {completedMilestones}
                    </p>
                    <p className="text-xs text-slate-500">
                      {milestones.length - completedMilestones} remaining
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <CardContent className="p-6 text-center">
                    <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl mb-4 mx-auto w-fit">
                      <MessageSquare className="h-6 w-6 text-white" />
                    </div>
                    <p className="text-sm font-medium text-slate-600 mb-2">
                      Messages
                    </p>
                    <p className="text-3xl font-bold text-slate-900 mb-4">
                      {messages.length}
                    </p>
                    <p className="text-xs text-slate-500">
                      {unreadMessages} unread
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Activity */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Clock className="h-5 w-5 text-indigo-600" />
                      <span>Project Milestones</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {milestones.length > 0 ? (
                      <div className="space-y-4">
                        {milestones.slice(0, 5).map((milestone) => (
                          <div
                            key={milestone.id}
                            className="flex items-start space-x-4 p-3 rounded-lg border border-slate-200"
                          >
                            <div
                              className={`h-3 w-3 rounded-full mt-2 ${getMilestoneStatusColor(
                                milestone.status
                              )}`}
                            ></div>
                            <div className="flex-1">
                              <h4 className="font-medium text-slate-900">
                                {milestone.title}
                              </h4>
                              {milestone.description && (
                                <p className="text-sm text-slate-600 mt-1">
                                  {milestone.description}
                                </p>
                              )}
                              <div className="flex items-center justify-between mt-2">
                                <Badge
                                  variant={
                                    milestone.status === "completed"
                                      ? "default"
                                      : milestone.status === "in-progress"
                                      ? "secondary"
                                      : "outline"
                                  }
                                  className="text-xs"
                                >
                                  {milestone.status}
                                </Badge>
                                {milestone.due_date && (
                                  <span className="text-xs text-slate-500">
                                    Due:{" "}
                                    {new Date(
                                      milestone.due_date
                                    ).toLocaleDateString()}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Clock className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                        <p className="text-slate-600">
                          No milestones defined yet
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <FileText className="h-5 w-5 text-purple-600" />
                      <span>Recent Documents</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {documents.length > 0 ? (
                      <div className="space-y-3">
                        {documents.slice(0, 5).map((doc) => (
                          <div
                            key={doc.id}
                            className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200"
                          >
                            <div className="flex items-center space-x-3">
                              <FileText className="h-5 w-5 text-blue-600" />
                              <div>
                                <p className="font-medium text-slate-900">
                                  {doc.title}
                                </p>
                                <p className="text-xs text-slate-500">
                                  {new Date(
                                    doc.created_at
                                  ).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={async () => {
                                const url =
                                  await documentService.getDownloadUrl(
                                    doc.file_path
                                  );
                                if (url) window.open(url, "_blank");
                              }}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <FileText className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                        <p className="text-slate-600">No documents available</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* Timeline Tab */}
          {activeTab === "timeline" && (
            <div className="space-y-6">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Clock className="h-5 w-5 text-indigo-600" />
                    <span>Project Timeline</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {milestones.length > 0 ? (
                    <div className="relative">
                      <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-indigo-500 to-purple-500"></div>
                      <div className="space-y-8">
                        {milestones.map((milestone) => (
                          <div
                            key={milestone.id}
                            className="relative flex items-start space-x-4"
                          >
                            <div
                              className={`h-4 w-4 rounded-full border-4 border-white shadow-lg z-10 ${getMilestoneStatusColor(
                                milestone.status
                              )} ${
                                milestone.status === "in-progress"
                                  ? "animate-pulse"
                                  : ""
                              }`}
                            ></div>
                            <div
                              className={`flex-1 p-4 rounded-lg border ${
                                milestone.status === "completed"
                                  ? "bg-green-50 border-green-200"
                                  : milestone.status === "in-progress"
                                  ? "bg-blue-50 border-blue-200"
                                  : milestone.status === "cancelled"
                                  ? "bg-red-50 border-red-200"
                                  : "bg-slate-50 border-slate-200"
                              }`}
                            >
                              <h3
                                className={`font-semibold ${
                                  milestone.status === "completed"
                                    ? "text-green-800"
                                    : milestone.status === "in-progress"
                                    ? "text-blue-800"
                                    : milestone.status === "cancelled"
                                    ? "text-red-800"
                                    : "text-slate-600"
                                }`}
                              >
                                {milestone.title}
                              </h3>
                              {milestone.description && (
                                <p
                                  className={`text-sm mt-1 ${
                                    milestone.status === "completed"
                                      ? "text-green-600"
                                      : milestone.status === "in-progress"
                                      ? "text-blue-600"
                                      : milestone.status === "cancelled"
                                      ? "text-red-600"
                                      : "text-slate-500"
                                  }`}
                                >
                                  {milestone.description}
                                </p>
                              )}
                              <div className="flex items-center justify-between mt-2">
                                <Badge
                                  variant={
                                    milestone.status === "completed"
                                      ? "default"
                                      : milestone.status === "in-progress"
                                      ? "secondary"
                                      : "outline"
                                  }
                                  className="text-xs capitalize"
                                >
                                  {milestone.status.replace("-", " ")}
                                </Badge>
                                {milestone.due_date && (
                                  <p
                                    className={`text-xs ${
                                      milestone.status === "completed"
                                        ? "text-green-500"
                                        : milestone.status === "in-progress"
                                        ? "text-blue-500"
                                        : "text-slate-400"
                                    }`}
                                  >
                                    {milestone.status === "completed" &&
                                    milestone.completed_date
                                      ? `Completed: ${new Date(
                                          milestone.completed_date
                                        ).toLocaleDateString()}`
                                      : `Due: ${new Date(
                                          milestone.due_date
                                        ).toLocaleDateString()}`}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Clock className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-slate-900 mb-2">
                        No Timeline Available
                      </h3>
                      <p className="text-slate-600">
                        Your project timeline will appear here once milestones
                        are defined.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {/* Photos Tab */}
          {activeTab === "photos" && (
            <div className="space-y-6">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Camera className="h-5 w-5 text-purple-600" />
                    <span>Project Photos</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {photos.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {photos.map((photo) => (
                        <div
                          key={photo.id}
                          className="group relative aspect-square bg-slate-100 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer"
                          onClick={async () => {
                            const url = await documentService.getDownloadUrl(
                              photo.file_path
                            );
                            if (url) setSelectedImage(url);
                          }}
                        >
                          <div className="absolute inset-0 bg-slate-200 flex items-center justify-center">
                            <Camera className="h-8 w-8 text-slate-400" />
                          </div>
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <div className="absolute bottom-2 left-2 text-white text-xs">
                              {new Date(photo.created_at).toLocaleDateString()}
                            </div>
                            <div className="absolute top-2 right-2">
                              <Eye className="h-4 w-4 text-white" />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Camera className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-slate-900 mb-2">
                        No Photos Yet
                      </h3>
                      <p className="text-slate-600">
                        Project photos will appear here as they become
                        available.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Image Modal */}
              {selectedImage && (
                <div
                  className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
                  onClick={() => setSelectedImage(null)}
                >
                  <div className="relative max-w-4xl max-h-full">
                    <img
                      src={selectedImage}
                      alt="Project photo"
                      className="max-w-full max-h-full object-contain rounded-lg"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute top-2 right-2 text-white hover:bg-white/20"
                      onClick={() => setSelectedImage(null)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Documents Tab */}
          {activeTab === "documents" && (
            <div className="space-y-6">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <FileText className="h-5 w-5 text-green-600" />
                    <span>Project Documents</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {documents.length > 0 ? (
                    <div className="space-y-4">
                      {documents.map((doc) => (
                        <div
                          key={doc.id}
                          className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200 hover:bg-slate-100 transition-colors"
                        >
                          <div className="flex items-center space-x-3">
                            <div className="p-2 bg-blue-100 rounded-lg">
                              <FileText className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                              <p className="font-medium text-slate-900">
                                {doc.title}
                              </p>
                              {doc.description && (
                                <p className="text-sm text-slate-600">
                                  {doc.description}
                                </p>
                              )}
                              <div className="flex items-center gap-2 mt-1">
                                {doc.category && (
                                  <Badge
                                    variant="secondary"
                                    className="text-xs"
                                  >
                                    {doc.category}
                                  </Badge>
                                )}
                                <span className="text-xs text-slate-500">
                                  {doc.file_size &&
                                    `${Math.round(
                                      doc.file_size / 1024
                                    )} KB`}{" "}
                                  •{" "}
                                  {new Date(
                                    doc.created_at
                                  ).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={async () => {
                                const url =
                                  await documentService.getDownloadUrl(
                                    doc.file_path
                                  );
                                if (url) window.open(url, "_blank");
                              }}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={async () => {
                                const url =
                                  await documentService.getDownloadUrl(
                                    doc.file_path
                                  );
                                if (url) {
                                  const a = document.createElement("a");
                                  a.href = url;
                                  a.download = doc.file_name;
                                  a.click();
                                }
                              }}
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <FileText className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-slate-900 mb-2">
                        No Documents Available
                      </h3>
                      <p className="text-slate-600">
                        Project documents will appear here when they're ready
                        for review.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "messages" && (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-3xl font-serif font-bold text-slate-900 mb-2">
                  Project Communication
                </h2>
                <p className="text-slate-600">
                  Stay connected with your project team
                </p>
              </div>

              <Card className="border-0 shadow-lg shadow-slate-200/50 bg-gradient-to-br from-white to-slate-50">
                <CardHeader className="pb-4 text-center">
                  <CardTitle className="flex items-center justify-center space-x-2">
                    <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg">
                      <MessageSquare className="h-4 w-4 text-white" />
                    </div>
                    <span>Messages</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-96 overflow-y-auto space-y-4 mb-4 p-4 bg-slate-50 rounded-lg">
                    {messages.length > 0 ? (
                      messages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${
                            message.sender_type === "client"
                              ? "justify-end"
                              : "justify-start"
                          }`}
                        >
                          <div
                            className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl shadow-sm ${
                              message.sender_type === "client"
                                ? "bg-gradient-to-r from-indigo-600 to-indigo-700 text-white"
                                : "bg-white text-slate-900 border border-slate-200"
                            }`}
                          >
                            <div className="flex items-center space-x-2 mb-1">
                              <span className="text-sm font-medium">
                                {message.sender_name}
                              </span>
                              {message.sender_type === "admin" &&
                                !message.is_read && (
                                  <span className="text-xs text-blue-600 font-medium">
                                    New
                                  </span>
                                )}
                            </div>
                            <p className="text-sm">{message.message}</p>
                            <p
                              className={`text-xs mt-1 ${
                                message.sender_type === "client"
                                  ? "text-indigo-200"
                                  : "text-slate-400"
                              }`}
                            >
                              {formatTimestamp(message.timestamp)}
                            </p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <MessageSquare className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                        <p className="text-slate-600">
                          No messages yet. Start a conversation!
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="flex space-x-3">
                    <Textarea
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type your message..."
                      className="flex-1 border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none bg-white"
                      rows={3}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                    />
                    <Button
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim() || sendingMessage}
                      className="bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 px-6 self-end"
                    >
                      {sendingMessage ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Send className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
