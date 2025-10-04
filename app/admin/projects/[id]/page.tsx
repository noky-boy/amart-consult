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
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import {
  ArrowLeft,
  Edit,
  Mail,
  Phone,
  MapPin,
  Building2,
  Calendar,
  DollarSign,
  FileText,
  MessageSquare,
  Upload,
  Download,
  Eye,
  Clock,
  CheckCircle,
  File,
  Folder,
  User,
  TrendingUp,
  Plus,
  PieChart,
  Target,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, use } from "react";
import {
  projectService,
  documentService,
  messageService,
  phaseService,
  getFinancialSummary,
} from "@/lib/supabase";
import type {
  Project,
  Client,
  ClientDocument,
  ClientMessage,
  ProjectPhase,
  ProjectWithProgress,
} from "@/lib/supabase";

import { getPhaseStatus, getStatusColorClasses } from "@/lib/phase-helpers";
import type { PhaseStatus } from "@/lib/phase-helpers";
import { DocumentList } from "../../documents/components/DocumentList";

type ProjectWithClientAndProgress = ProjectWithProgress & { client: Client };

export default function ProjectDetails({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // Unwrap params using React.use()
  const { id } = use(params);

  const [project, setProject] = useState<ProjectWithClientAndProgress | null>(
    null
  );
  const [phases, setPhases] = useState<ProjectPhase[]>([]);
  const [documents, setDocuments] = useState<ClientDocument[]>([]);
  const [messages, setMessages] = useState<ClientMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProjectData = async () => {
      try {
        setLoading(true);
        setError("");

        // Fetch project with client data and progress
        const projectData = await projectService.getWithClientAndProgress(id);
        setProject(projectData);

        // Fetch project phases
        const phasesData = await phaseService.getByProjectId(id);
        setPhases(phasesData);

        // Fetch related data for this specific project
        const [documentsData, messagesData] = await Promise.all([
          documentService.getByProjectId(id).catch(() => []),
          messageService.getByProjectId(id).catch(() => []),
        ]);

        setDocuments(documentsData);
        setMessages(messagesData);
      } catch (err: any) {
        console.error("Failed to fetch project:", err);
        setError("Failed to load project data");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProjectData();
    }
  }, [id]);

  const handlePhaseToggle = async (phase: ProjectPhase) => {
    try {
      let updatedPhase: ProjectPhase;
      if (phase.is_completed) {
        updatedPhase = await phaseService.markIncomplete(phase.id);
      } else {
        updatedPhase = await phaseService.markCompleted(phase.id);
      }

      // Update phases list
      setPhases(phases.map((p) => (p.id === phase.id ? updatedPhase : p)));

      // Refresh project progress
      const updatedProject = await projectService.getWithClientAndProgress(id);
      setProject(updatedProject);
    } catch (err: any) {
      console.error("Failed to update phase:", err);
      alert("Failed to update phase: " + err.message);
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

  const handleDeleteDocument = async (docToDelete: ClientDocument) => {
    // Optional: Confirm with the user before deleting
    if (!confirm(`Are you sure you want to delete "${docToDelete.title}"?`)) {
      return;
    }

    try {
      await documentService.delete(docToDelete.id);
      // Update the state to remove the deleted document from the list
      setDocuments((prevDocs) =>
        prevDocs.filter((doc) => doc.id !== docToDelete.id)
      );
      alert("Document deleted successfully.");
    } catch (error: any) {
      console.error("Failed to delete document:", error);
      alert("Failed to delete document: " + error.message);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
          <div className="px-6 py-4">
            <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
              <div className="h-8 w-8 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-6 w-32 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
        </header>
        <div className="max-w-6xl mx-auto p-4 sm:p-6">
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

  // Error state
  if (error || !project) {
    return (
      <div className="min-h-screen bg-slate-50">
        <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
          <div className="px-6 py-4">
            <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
              <Link href="/admin/projects">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Projects
                </Button>
              </Link>
              <div className="h-6 w-px bg-slate-300" />
              <Image
                src="/images/amart-logo.png"
                alt="Amart Consult"
                width={120}
                height={40}
                className="h-6 sm:h-8 w-auto hidden sm:block"
              />
              <h1 className="text-base sm:text-xl font-semibold text-slate-900 truncate">
                Project Details
              </h1>
            </div>
          </div>
        </header>
        <div className="max-w-6xl mx-auto p-4 sm:p-6">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
            {error || "Project not found"}
          </div>
        </div>
      </div>
    );
  }

  const financialSummary = getFinancialSummary(project);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
            <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
              <Link href="/admin/projects">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Projects
                </Button>
              </Link>
              <div className="h-6 w-px bg-slate-300" />
              <Image
                src="/images/amart-logo.png"
                alt="Amart Consult"
                width={120}
                height={40}
                className="h-6 sm:h-8 w-auto hidden sm:block"
              />
              <h1 className="text-base sm:text-xl font-semibold text-slate-900 truncate">
                Project Details
              </h1>
            </div>
            <Button
              asChild
              className="bg-indigo-600 hover:bg-indigo-700 w-full sm:w-auto text-sm"
            >
              <Link href={`/admin/projects/${id}/edit`}>
                <Edit className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Edit Project</span>
                <span className="sm:hidden">Edit</span>
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto p-4 sm:p-6">
        {/* Project Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-4 sm:mb-6">
          <Card className="lg:col-span-2 border-0 shadow-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl sm:text-2xl truncate">
                    {project.project_title}
                  </CardTitle>
                  <CardDescription className="text-base mt-1">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      <Link
                        href={`/admin/clients/${project.client.id}`}
                        className="hover:text-indigo-600 hover:underline"
                      >
                        {project.client.first_name} {project.client.last_name}
                      </Link>
                      {project.client.company && (
                        <>
                          <span>•</span>
                          <span>{project.client.company}</span>
                        </>
                      )}
                    </div>
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    variant={
                      project.status === "In Progress" ? "default" : "secondary"
                    }
                    className={`text-sm ${getStatusColor(project.status)}`}
                  >
                    {project.status}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <Building2 className="h-4 w-4 text-slate-400" />
                  <span className="text-slate-900 capitalize">
                    {project.project_type}
                  </span>
                </div>
                {project.timeline && (
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <Clock className="h-4 w-4 text-slate-400" />
                    <span className="text-slate-900">{project.timeline}</span>
                  </div>
                )}
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <Calendar className="h-4 w-4 text-slate-400" />
                  <span className="text-sm text-slate-900">
                    Created {new Date(project.created_at).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <Target className="h-4 w-4 text-slate-400" />
                  <span className="text-sm text-slate-900">
                    {project.progress_percentage || 0}% Complete
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mt-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-slate-600">
                    Project Progress
                  </span>
                  <span className="text-sm text-slate-600">
                    {project.completed_phases || 0} of{" "}
                    {project.total_phases || 0} phases completed
                  </span>
                </div>
                <Progress
                  value={project.progress_percentage || 0}
                  className="h-2"
                />
              </div>

              {project.project_description && (
                <div className="mt-4">
                  <h4 className="font-medium text-slate-900 mb-2">
                    Description
                  </h4>
                  <p className="text-slate-700">
                    {project.project_description}
                  </p>
                </div>
              )}

              {(project.project_start_date || project.project_end_date) && (
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  {project.project_start_date && (
                    <div>
                      <span className="text-sm font-medium text-slate-600">
                        Start Date:
                      </span>
                      <div className="text-slate-900">
                        {new Date(
                          project.project_start_date
                        ).toLocaleDateString()}
                      </div>
                    </div>
                  )}
                  {project.project_end_date && (
                    <div>
                      <span className="text-sm font-medium text-slate-600">
                        End Date:
                      </span>
                      <div className="text-slate-900">
                        {new Date(
                          project.project_end_date
                        ).toLocaleDateString()}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {project.notes && (
                <div className="mt-4 p-4 bg-slate-50 rounded-lg">
                  <h4 className="font-medium text-slate-900 mb-2">
                    Project Notes
                  </h4>
                  <p className="text-slate-700 whitespace-pre-wrap">
                    {project.notes}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="space-y-4">
            {/* Financial Summary Card */}
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5" />
                  Financial Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">
                      Contract Sum:
                    </span>
                    <span className="font-semibold text-slate-900">
                      {financialSummary.formatted.contract_sum}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">
                      Cash Received:
                    </span>
                    <span className="font-semibold text-green-700">
                      {financialSummary.formatted.cash_received}
                    </span>
                  </div>
                  <div className="flex items-center justify-between border-t pt-3">
                    <span className="text-sm font-medium text-slate-600">
                      Balance:
                    </span>
                    <span
                      className={`font-bold ${
                        financialSummary.balance > 0
                          ? "text-red-600"
                          : "text-green-600"
                      }`}
                    >
                      {financialSummary.formatted.balance}
                    </span>
                  </div>
                </div>

                {financialSummary.contract_sum > 0 && (
                  <div className="mt-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-slate-600">
                        Payment Progress
                      </span>
                      <span className="text-sm text-slate-600">
                        {financialSummary.progress_percentage}%
                      </span>
                    </div>
                    <Progress
                      value={financialSummary.progress_percentage}
                      className="h-2"
                    />
                    {financialSummary.is_fully_paid && (
                      <div className="flex items-center gap-2 mt-2 text-green-700">
                        <CheckCircle className="h-4 w-4" />
                        <span className="text-sm font-medium">Fully Paid</span>
                      </div>
                    )}
                  </div>
                )}

                <div className="pt-2">
                  <Link href={`/admin/projects/${id}/financials`}>
                    <Button variant="outline" size="sm" className="w-full">
                      <DollarSign className="h-4 w-4 mr-2" />
                      Update Financials
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Client Info Card */}
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle>Client Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <Mail className="h-4 w-4 text-slate-400" />
                  <span className="text-xs sm:text-sm text-slate-900 truncate">
                    {project.client.email}
                  </span>
                </div>
                {project.client.phone && (
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <Phone className="h-4 w-4 text-slate-400" />
                    <span className="text-xs sm:text-sm text-slate-900 truncate">
                      {project.client.phone}
                    </span>
                  </div>
                )}
                {project.client.address && (
                  <div className="flex items-start gap-3">
                    <MapPin className="h-4 w-4 text-slate-400 mt-1" />
                    <span className="text-xs sm:text-sm text-slate-900 truncate">
                      {project.client.address}
                    </span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{project.client.tier}</Badge>
                  {project.client.has_portal_access && (
                    <Badge
                      variant="outline"
                      className="bg-green-50 text-green-700"
                    >
                      Portal Access
                    </Badge>
                  )}
                </div>
                <div className="pt-2">
                  <Link href={`/admin/clients/${project.client.id}`}>
                    <Button variant="outline" size="sm" className="w-full">
                      <Eye className="h-4 w-4 mr-2" />
                      View Client Details
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  className="w-full justify-start"
                  variant="outline"
                  asChild
                >
                  <Link
                    href={`/admin/messages?clientId=${project.client_id}&projectId=${project.id}`}
                  >
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Send Message
                  </Link>
                </Button>
                <Button
                  className="w-full justify-start"
                  variant="outline"
                  asChild
                >
                  <Link
                    href={`/admin/documents?clientId=${project.client_id}&projectId=${project.id}`}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Document
                  </Link>
                </Button>
                <Button
                  className="w-full justify-start"
                  variant="outline"
                  asChild
                >
                  <Link href={`/admin/projects/${project.id}/phases`}>
                    <Target className="h-4 w-4 mr-2" />
                    Manage Phases
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Detailed Tabs */}
        <Tabs defaultValue="phases" className="space-y-6">
          <TabsList className="flex sm:grid w-full sm:grid-cols-4 overflow-x-auto">
            <TabsTrigger
              className="whitespace-nowrap text-xs sm:text-sm flex-shrink-0"
              value="phases"
            >
              <span className="hidden sm:inline">Phases ({phases.length})</span>
              <span className="sm:hidden">Phases</span>
            </TabsTrigger>
            <TabsTrigger
              className="whitespace-nowrap text-xs sm:text-sm flex-shrink-0"
              value="documents"
            >
              <span className="hidden sm:inline">
                Documents ({documents.length})
              </span>
              <span className="sm:hidden">Documents</span>
            </TabsTrigger>
            <TabsTrigger
              className="whitespace-nowrap text-xs sm:text-sm flex-shrink-0"
              value="messages"
            >
              <span className="hidden sm:inline">
                Messages ({messages.length})
              </span>
              <span className="sm:hidden">Messages</span>
            </TabsTrigger>
            <TabsTrigger
              className="whitespace-nowrap text-xs sm:text-sm flex-shrink-0"
              value="activity"
            >
              <span className="hidden sm:inline">Activity</span>
              <span className="sm:hidden">Activity</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="phases" className="space-y-6">
            <Card className="border-0 shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Project Phases</CardTitle>
                <Button size="sm" asChild>
                  <Link href={`/admin/projects/${project.id}/phases`}>
                    <Plus className="h-4 w-4 mr-2" />
                    Manage Phases
                  </Link>
                </Button>
              </CardHeader>
              <CardContent>
                {phases.length > 0 ? (
                  <div className="space-y-3">
                    {/* Filter to show only parent phases */}
                    {phases
                      .filter((phase) => !phase.parent_phase_id)
                      .map((parentPhase) => {
                        // Get children for this parent
                        const children = phases.filter(
                          (p) => p.parent_phase_id === parentPhase.id
                        );
                        const parentStatus = getPhaseStatus(
                          parentPhase,
                          children
                        );
                        const hasChildren = children.length > 0;

                        return (
                          <div
                            key={parentPhase.id}
                            className="border border-slate-200 rounded-lg"
                          >
                            {/* Parent Phase */}
                            <div className="p-4 bg-slate-50">
                              <div className="flex items-start gap-3">
                                <div className="flex items-center gap-2 mt-1">
                                  <Checkbox
                                    id={`phase-${parentPhase.id}`}
                                    checked={parentPhase.is_completed}
                                    onCheckedChange={() =>
                                      handlePhaseToggle(parentPhase)
                                    }
                                    disabled={hasChildren} // Disable if has children
                                  />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 mb-1">
                                    <h4
                                      className={`font-semibold text-base ${
                                        parentPhase.is_completed
                                          ? "line-through text-slate-500"
                                          : "text-slate-900"
                                      }`}
                                    >
                                      {parentPhase.phase_name}
                                    </h4>
                                    <Badge
                                      variant="outline"
                                      className={getStatusColorClasses(
                                        parentStatus
                                      )}
                                    >
                                      {parentStatus}
                                    </Badge>
                                  </div>
                                  {parentPhase.phase_description && (
                                    <p className="text-sm text-slate-600 mb-2">
                                      {parentPhase.phase_description}
                                    </p>
                                  )}
                                  <div className="flex items-center gap-4 text-xs text-slate-500">
                                    {parentPhase.estimated_duration && (
                                      <span className="flex items-center gap-1">
                                        <Clock className="h-3 w-3" />
                                        {parentPhase.estimated_duration}
                                      </span>
                                    )}
                                    {hasChildren && (
                                      <span className="flex items-center gap-1">
                                        <Target className="h-3 w-3" />
                                        {
                                          children.filter((c) => c.is_completed)
                                            .length
                                        }{" "}
                                        / {children.length} subtasks completed
                                      </span>
                                    )}
                                    {parentPhase.completed_date && (
                                      <span>
                                        Completed:{" "}
                                        {new Date(
                                          parentPhase.completed_date
                                        ).toLocaleDateString()}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Child Phases */}
                            {hasChildren && (
                              <div className="border-t border-slate-200">
                                {children.map((childPhase, index) => {
                                  const childStatus = getPhaseStatus(
                                    childPhase,
                                    undefined,
                                    parentStatus
                                  );
                                  const isLast = index === children.length - 1;

                                  return (
                                    <div
                                      key={childPhase.id}
                                      className={`p-3 pl-8 bg-white ${
                                        !isLast
                                          ? "border-b border-slate-100"
                                          : ""
                                      }`}
                                    >
                                      <div className="flex items-start gap-3">
                                        <div className="flex items-center gap-2 mt-1">
                                          <Checkbox
                                            id={`phase-${childPhase.id}`}
                                            checked={childPhase.is_completed}
                                            onCheckedChange={() =>
                                              handlePhaseToggle(childPhase)
                                            }
                                          />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                          <div className="flex items-center gap-2 mb-1">
                                            <h5
                                              className={`font-medium text-sm ${
                                                childPhase.is_completed
                                                  ? "line-through text-slate-500"
                                                  : "text-slate-900"
                                              }`}
                                            >
                                              {childPhase.phase_name}
                                            </h5>
                                            <Badge
                                              variant="outline"
                                              className={`text-xs ${getStatusColorClasses(
                                                childStatus
                                              )}`}
                                            >
                                              {childStatus}
                                            </Badge>
                                          </div>
                                          {childPhase.phase_description && (
                                            <p className="text-xs text-slate-600 mb-1">
                                              {childPhase.phase_description}
                                            </p>
                                          )}
                                          <div className="flex items-center gap-3 text-xs text-slate-500">
                                            {childPhase.estimated_duration && (
                                              <span className="flex items-center gap-1">
                                                <Clock className="h-3 w-3" />
                                                {childPhase.estimated_duration}
                                              </span>
                                            )}
                                            {childPhase.completed_date && (
                                              <span>
                                                Completed:{" "}
                                                {new Date(
                                                  childPhase.completed_date
                                                ).toLocaleDateString()}
                                              </span>
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        );
                      })}
                  </div>
                ) : (
                  <div className="text-center py-8 sm:py-12">
                    <Target className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">
                      No phases defined
                    </h3>
                    <p className="text-slate-600 mb-4">
                      Break down this project into phases to track progress
                    </p>
                    <Button asChild>
                      <Link href={`/admin/projects/${project.id}/phases`}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add First Phase
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
                <CardTitle>Project Documents</CardTitle>
                <Button size="sm" asChild>
                  <Link
                    href={`/admin/documents?clientId=${project.client_id}&projectId=${project.id}`}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Documents
                  </Link>
                </Button>
              </CardHeader>
              <CardContent>
                <DocumentList
                  documents={documents}
                  onDelete={handleDeleteDocument}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="messages" className="space-y-6">
            <Card className="border-0 shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Project Messages</CardTitle>
                <Button size="sm" asChild>
                  <Link
                    href={`/admin/messages?clientId=${project.client_id}&projectId=${project.id}`}
                  >
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
                        className={`p-3 sm:p-4 rounded-lg border ${
                          msg.sender_type === "admin"
                            ? "bg-indigo-50 border-indigo-200 sm:ml-8"
                            : "bg-slate-50 border-slate-200 sm:mr-8"
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
                  <div className="text-center py-8 sm:py-12">
                    <MessageSquare className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">
                      No messages yet
                    </h3>
                    <p className="text-slate-600 mb-4">
                      Start a conversation about this project
                    </p>
                    <Button asChild>
                      <Link
                        href={`/admin/messages?clientId=${project.client_id}&projectId=${project.id}`}
                      >
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Send First Message
                      </Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activity" className="space-y-6">
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle>Project Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 sm:py-12">
                  <TrendingUp className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">
                    Activity tracking coming soon
                  </h3>
                  <p className="text-slate-600">
                    Project timeline and activity log will be displayed here
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
