"use client";

import type React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft,
  Edit,
  Mail,
  Phone,
  MapPin,
  Building2,
  Calendar,
  FileText,
  MessageSquare,
  Upload,
  Download,
  Eye,
  Clock,
  CheckCircle,
  File,
  Folder,
  Plus,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, use } from "react";
import {
  clientService,
  projectService,
  documentService,
  messageService,
  phaseService,
} from "@/lib/supabase";
import type {
  Client,
  Project,
  ClientDocument,
  ClientMessage,
  ProjectPhase,
} from "@/lib/supabase";

export default function ClientDetails({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  const [client, setClient] = useState<Client | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [documents, setDocuments] = useState<ClientDocument[]>([]);
  const [messages, setMessages] = useState<ClientMessage[]>([]);
  // CHANGE: Renamed state from 'milestones' to 'phases' for clarity.
  const [phases, setPhases] = useState<ProjectPhase[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchClientData = async () => {
      try {
        setLoading(true);
        setError("");

        // Fetch client and top-level data
        const clientData = await clientService.getById(id);
        setClient(clientData);

        const projectsData = await projectService.getByClientId(id);
        setProjects(projectsData);

        const documentsData = await documentService
          .getByClientId(id)
          .catch(() => []);
        setDocuments(documentsData);

        const messagesData = await messageService
          .getByClientId(id)
          .catch(() => []);
        setMessages(messagesData);

        // CHANGE: Correctly fetch phases for EACH project.
        if (projectsData.length > 0) {
          const phasePromises = projectsData.map((project) =>
            phaseService.getByProjectId(project.id)
          );
          const phasesByProject = await Promise.all(phasePromises);
          // Flatten the array of arrays into a single array of phases
          const allPhases = phasesByProject.flat();
          setPhases(allPhases);
        } else {
          setPhases([]);
        }
      } catch (err: any) {
        console.error("Failed to fetch client:", err);
        setError("Failed to load client data");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchClientData();
    }
  }, [id]);

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

  // CHANGE: Removed getMilestoneStatusColor as it's no longer needed.

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return "Unknown size";
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getFileIcon = (fileType?: string) => {
    if (!fileType) return <File className="h-5 w-5" />;
    if (fileType.startsWith("image/"))
      return <FileText className="h-5 w-5 text-green-600" />;
    if (fileType.includes("pdf"))
      return <FileText className="h-5 w-5 text-red-600" />;
    return <File className="h-5 w-5" />;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
          <div className="px-6 py-4">
            <div className="flex items-center gap-4">
              <div className="h-8 w-8 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-6 w-32 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
        </header>
        <div className="max-w-6xl mx-auto p-6">
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="h-32 bg-gray-200 rounded animate-pulse"
              ></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !client) {
    return (
      <div className="min-h-screen bg-slate-50">
        <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
          <div className="px-6 py-4">
            <div className="flex items-center gap-4">
              <Link href="/admin/dashboard">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <div className="h-6 w-px bg-slate-300" />
              <Image
                src="/images/amart-logo.png"
                alt="Amart Consult"
                width={120}
                height={40}
                className="h-8 w-auto"
              />
              <h1 className="text-xl font-semibold text-slate-900">
                Client Details
              </h1>
            </div>
          </div>
        </header>
        <div className="max-w-6xl mx-auto p-6">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
            {error || "Client not found"}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/admin/dashboard">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <div className="h-6 w-px bg-slate-300" />
              <Image
                src="/images/amart-logo.png"
                alt="Amart Consult"
                width={120}
                height={40}
                className="h-8 w-auto"
              />
              <h1 className="text-xl font-semibold text-slate-900">
                Client Details
              </h1>
            </div>
            <Button asChild className="bg-indigo-600 hover:bg-indigo-700">
              <Link href={`/admin/clients/${id}/edit`}>
                <Edit className="h-4 w-4 mr-2" />
                Edit Client
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto p-6">
        {/* Client Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <Card className="lg:col-span-2 border-0 shadow-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl">
                    {client.first_name} {client.last_name}
                  </CardTitle>
                  <CardDescription className="text-base mt-1">
                    {projects.length} project{projects.length !== 1 ? "s" : ""}{" "}
                    • Joined {new Date(client.created_at).toLocaleDateString()}
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Badge
                    variant={
                      client.client_status === "Active"
                        ? "default"
                        : "secondary"
                    }
                    className="text-sm"
                  >
                    {client.client_status}
                  </Badge>
                  <Badge variant="outline">{client.tier}</Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-slate-400" />
                  <span className="text-slate-900">{client.email}</span>
                </div>
                {client.phone && (
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-slate-400" />
                    <span className="text-slate-900">{client.phone}</span>
                  </div>
                )}
                {client.company && (
                  <div className="flex items-center gap-3">
                    <Building2 className="h-4 w-4 text-slate-400" />
                    <span className="text-slate-900">{client.company}</span>
                  </div>
                )}
                {client.has_portal_access && (
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-green-900">
                      Portal Access Enabled
                    </span>
                  </div>
                )}
              </div>
              {client.address && (
                <div className="flex items-start gap-3 mt-4">
                  <MapPin className="h-4 w-4 text-slate-400 mt-1" />
                  <span className="text-slate-900">{client.address}</span>
                </div>
              )}
              {client.notes && (
                <div className="mt-4 p-4 bg-slate-50 rounded-lg">
                  <h4 className="font-medium text-slate-900 mb-2">
                    Client Notes
                  </h4>
                  <p className="text-slate-700">{client.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full justify-start" asChild>
                <Link href={`/admin/projects/add?clientId=${client.id}`}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add New Project
                </Link>
              </Button>
              <Button
                className="w-full justify-start"
                variant="outline"
                asChild
              >
                <Link href={`/admin/messages?clientId=${client.id}`}>
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Send Message
                </Link>
              </Button>
              <Button
                className="w-full justify-start"
                variant="outline"
                asChild
              >
                <Link href={`/admin/documents?clientId=${client.id}`}>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Document
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Tabs */}
        <Tabs defaultValue="projects" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="projects">
              Projects ({projects.length})
            </TabsTrigger>
            <TabsTrigger value="documents">
              Documents ({documents.length})
            </TabsTrigger>
            <TabsTrigger value="messages">
              Messages ({messages.length})
            </TabsTrigger>
            {/* CHANGE: Updated tab to 'phases' and used correct length */}
            <TabsTrigger value="phases">Phases ({phases.length})</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>

          <TabsContent value="projects" className="space-y-6">
            <Card className="border-0 shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Client Projects</CardTitle>
                <Button size="sm" asChild>
                  <Link href={`/admin/projects/add?clientId=${client.id}`}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Project
                  </Link>
                </Button>
              </CardHeader>
              <CardContent>
                {projects.length > 0 ? (
                  <div className="space-y-4">
                    {projects.map((project) => (
                      <div
                        key={project.id}
                        className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                      >
                        <div className="flex-1">
                          <h4 className="font-semibold text-slate-900">
                            {project.project_title}
                          </h4>
                          {project.project_description && (
                            <p className="text-sm text-slate-600 mt-1">
                              {project.project_description}
                            </p>
                          )}
                          <div className="flex items-center gap-2 mt-3">
                            <Badge className={getStatusColor(project.status)}>
                              {project.status}
                            </Badge>
                            <Badge variant="outline" className="capitalize">
                              {project.project_type}
                            </Badge>
                            {project.budget_range && (
                              <Badge variant="outline">
                                {project.budget_range}
                              </Badge>
                            )}
                            {project.timeline && (
                              <div className="flex items-center gap-1 text-slate-500">
                                <Clock className="h-3 w-3" />
                                <span className="text-xs">
                                  {project.timeline}
                                </span>
                              </div>
                            )}
                          </div>
                          <div className="text-xs text-slate-500 mt-2">
                            Created:{" "}
                            {new Date(project.created_at).toLocaleDateString()}
                            {project.project_start_date && (
                              <>
                                {" "}
                                • Started:{" "}
                                {new Date(
                                  project.project_start_date
                                ).toLocaleDateString()}
                              </>
                            )}
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="sm" asChild>
                            <Link href={`/admin/projects/${project.id}`}>
                              <Eye className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Button variant="ghost" size="sm" asChild>
                            <Link href={`/admin/projects/${project.id}/edit`}>
                              <Edit className="h-4 w-4" />
                            </Link>
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Building2 className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">
                      No projects yet
                    </h3>
                    <p className="text-slate-600 mb-4">
                      Create the first project for this client
                    </p>
                    <Button asChild>
                      <Link href={`/admin/projects/add?clientId=${client.id}`}>
                        <Plus className="h-4 w-4 mr-2" />
                        Create First Project
                      </Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="documents" className="space-y-6">
            <Card className="border-0 shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Client Documents</CardTitle>
                <Button size="sm" asChild>
                  <Link href={`/admin/documents/upload?clientId=${client.id}`}>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Documents
                  </Link>
                </Button>
              </CardHeader>
              <CardContent>
                {documents.length > 0 ? (
                  <div className="space-y-3">
                    {documents.map((doc) => (
                      <div
                        key={doc.id}
                        className="flex items-center justify-between p-4 border border-slate-200 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          {getFileIcon(doc.file_type)}
                          <div>
                            <h4 className="font-medium text-slate-900">
                              {doc.title}
                            </h4>
                            {doc.description && (
                              <p className="text-sm text-slate-600">
                                {doc.description}
                              </p>
                            )}
                            <div className="flex items-center gap-2 mt-1">
                              {doc.category && (
                                <Badge variant="secondary">
                                  {doc.category}
                                </Badge>
                              )}
                              <span className="text-xs text-slate-500">
                                {formatFileSize(doc.file_size)} •{" "}
                                {new Date(doc.created_at).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={async () => {
                              const url = await documentService.getDownloadUrl(
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
                              const url = await documentService.getDownloadUrl(
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
                    <Folder className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">
                      No documents uploaded
                    </h3>
                    <p className="text-slate-600 mb-4">
                      Upload documents for this client to get started
                    </p>
                    <Button asChild>
                      <Link
                        href={`/admin/documents/upload?clientId=${client.id}`}
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Upload First Document
                      </Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="messages" className="space-y-6">
            <Card className="border-0 shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Message History</CardTitle>
                <Button size="sm" asChild>
                  <Link href={`/admin/messages?clientId=${client.id}`}>
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Send Message
                  </Link>
                </Button>
              </CardHeader>
              <CardContent>
                {messages.length > 0 ? (
                  <div className="space-y-4">
                    {messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`p-4 rounded-lg border ${
                          msg.sender_type === "admin"
                            ? "bg-indigo-50 border-indigo-200 ml-8"
                            : "bg-slate-50 border-slate-200 mr-8"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Badge
                              variant={
                                msg.sender_type === "admin"
                                  ? "default"
                                  : "secondary"
                              }
                            >
                              {msg.sender_name}
                            </Badge>
                            {!msg.is_read && msg.sender_type === "client" && (
                              <Badge variant="destructive">Unread</Badge>
                            )}
                          </div>
                          <span className="text-sm text-slate-500">
                            {new Date(msg.created_at).toLocaleDateString()}{" "}
                            {new Date(msg.created_at).toLocaleTimeString()}
                          </span>
                        </div>
                        <p className="text-slate-900 whitespace-pre-wrap">
                          {msg.message}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <MessageSquare className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">
                      No messages yet
                    </h3>
                    <p className="text-slate-600 mb-4">
                      Start a conversation with this client
                    </p>
                    <Button asChild>
                      <Link href={`/admin/messages?clientId=${client.id}`}>
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Send First Message
                      </Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* CHANGE: The entire 'milestones' tab has been replaced with the 'phases' tab */}
          <TabsContent value="phases" className="space-y-6">
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle>All Project Phases</CardTitle>
                <CardDescription>
                  An overview of all phases across all of this client's
                  projects.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {phases.length > 0 ? (
                  <div className="space-y-3">
                    {phases.map((phase) => {
                      // Find the parent project to display its title
                      const project = projects.find(
                        (p) => p.id === phase.project_id
                      );
                      return (
                        <div
                          key={phase.id}
                          className="flex items-center gap-4 p-3 border border-slate-200 rounded-lg"
                        >
                          {phase.is_completed ? (
                            <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                          ) : (
                            <Clock className="h-5 w-5 text-blue-500 flex-shrink-0" />
                          )}
                          <div className="flex-1">
                            <p className="text-sm font-medium text-slate-900">
                              {phase.phase_name}
                            </p>
                            {project && (
                              <p className="text-xs text-slate-500">
                                Project:{" "}
                                <Link
                                  href={`/admin/projects/${project.id}`}
                                  className="font-semibold hover:underline"
                                >
                                  {project.project_title}
                                </Link>
                              </p>
                            )}
                            {phase.completed_date && (
                              <p className="text-xs text-slate-500 mt-1">
                                Completed:{" "}
                                {new Date(
                                  phase.completed_date
                                ).toLocaleDateString()}
                              </p>
                            )}
                          </div>
                          <Badge
                            variant={
                              phase.is_completed ? "default" : "secondary"
                            }
                          >
                            {phase.is_completed ? "Completed" : "Pending"}
                          </Badge>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Clock className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">
                      No phases defined
                    </h3>
                    <p className="text-slate-600">
                      Project phases will appear here once they are added to a
                      project.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activity" className="space-y-6">
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Clock className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">
                    Activity tracking coming soon
                  </h3>
                  <p className="text-slate-600">
                    Client activity and timeline will be displayed here
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
