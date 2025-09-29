"use client";

import React, { useState, useEffect, Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft,
  Search,
  Filter,
  Plus,
  Eye,
  Edit,
  Trash2,
  Download,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Building2,
  User,
  Calendar,
  DollarSign,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { projectService } from "@/lib/supabase";
import type { Project, Client } from "@/lib/supabase";

type ProjectWithClient = Project & { client: Client };

function ProjectListing() {
  const [projects, setProjects] = useState<ProjectWithClient[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<ProjectWithClient[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Filter and search states
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [clientFilter, setClientFilter] = useState<string>("all");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const projectData = await projectService.getAllWithClients();
        setProjects(projectData);
        setFilteredProjects(projectData);
      } catch (err: any) {
        console.error("Failed to fetch projects:", err);
        setError("Failed to load projects");
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // Filter and search logic
  useEffect(() => {
    let filtered = [...projects];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (project) =>
          project.project_title
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          project.project_description
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          `${project.client.first_name} ${project.client.last_name}`
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          project.client.email
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          (project.client.company &&
            project.client.company
              .toLowerCase()
              .includes(searchTerm.toLowerCase()))
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((project) => project.status === statusFilter);
    }

    // Type filter
    if (typeFilter !== "all") {
      filtered = filtered.filter(
        (project) => project.project_type === typeFilter
      );
    }

    // Client filter (by client name)
    if (clientFilter !== "all") {
      filtered = filtered.filter((project) =>
        `${project.client.first_name} ${project.client.last_name}`
          .toLowerCase()
          .includes(clientFilter.toLowerCase())
      );
    }

    setFilteredProjects(filtered);
    setCurrentPage(1); // Reset to first page when filtering
  }, [projects, searchTerm, statusFilter, typeFilter, clientFilter]);

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

  const handleDeleteProject = async (projectId: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this project? This action cannot be undone and will also delete related documents, messages, and milestones."
      )
    ) {
      return;
    }

    try {
      await projectService.delete(projectId);
      setProjects(projects.filter((p) => p.id !== projectId));
    } catch (err: any) {
      alert("Failed to delete project: " + err.message);
    }
  };

  const exportToCSV = () => {
    const headers = [
      "Project Title",
      "Client Name",
      "Client Email",
      "Status",
      "Type",
      "Budget Range",
      "Timeline",
      "Created",
    ];
    const csvData = filteredProjects.map((project) => [
      project.project_title,
      `${project.client.first_name} ${project.client.last_name}`,
      project.client.email,
      project.status,
      project.project_type,
      project.budget_range || "",
      project.timeline || "",
      new Date(project.created_at).toLocaleDateString(),
    ]);

    const csvContent = [headers, ...csvData]
      .map((row) => row.map((field) => `"${field}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `projects-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Get unique clients for client filter
  const uniqueClients = Array.from(
    new Set(projects.map((p) => `${p.client.first_name} ${p.client.last_name}`))
  ).sort();

  // Pagination logic
  const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProjects = filteredProjects.slice(startIndex, endIndex);

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
        <div className="max-w-7xl mx-auto p-6">
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="h-16 bg-gray-200 rounded animate-pulse"
              ></div>
            ))}
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
                All Projects
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" onClick={exportToCSV}>
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
              <Button size="sm" asChild>
                <Link href="/admin/projects/add">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Project
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6">
        {/* Filters and Search */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filters & Search
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search projects or clients..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Status Filter */}
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="Planning">Planning</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Review">Review</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                  <SelectItem value="On Hold">On Hold</SelectItem>
                  <SelectItem value="Cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>

              {/* Type Filter */}
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="residential">Residential</SelectItem>
                  <SelectItem value="commercial">Commercial</SelectItem>
                  <SelectItem value="renovation">Renovation</SelectItem>
                  <SelectItem value="interior">Interior Design</SelectItem>
                </SelectContent>
              </Select>

              {/* Client Filter */}
              <Select value={clientFilter} onValueChange={setClientFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Clients" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Clients</SelectItem>
                  {uniqueClients.map((client) => (
                    <SelectItem key={client} value={client.toLowerCase()}>
                      {client}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Clear Filters */}
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm("");
                  setStatusFilter("all");
                  setTypeFilter("all");
                  setClientFilter("all");
                }}
              >
                Clear Filters
              </Button>
            </div>

            {/* Results count */}
            <div className="mt-4 text-sm text-slate-600">
              Showing {currentProjects.length} of {filteredProjects.length}{" "}
              projects
              {filteredProjects.length !== projects.length && (
                <span> (filtered from {projects.length} total)</span>
              )}
            </div>
          </CardContent>
        </Card>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
            {error}
          </div>
        )}

        {/* Project List */}
        <Card>
          <CardHeader>
            <CardTitle>Projects</CardTitle>
          </CardHeader>
          <CardContent>
            {currentProjects.length > 0 ? (
              <div className="space-y-4">
                {currentProjects.map((project) => (
                  <div
                    key={project.id}
                    className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                        <Building2 className="h-6 w-6 text-indigo-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-slate-900">
                          {project.project_title}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          <User className="h-3 w-3 text-slate-400" />
                          <span className="text-sm text-slate-600">
                            {project.client.first_name}{" "}
                            {project.client.last_name}
                          </span>
                          {project.client.company && (
                            <>
                              <span className="text-slate-400">•</span>
                              <span className="text-sm text-slate-500">
                                {project.client.company}
                              </span>
                            </>
                          )}
                        </div>
                        {project.project_description && (
                          <p className="text-sm text-slate-500 mt-1 line-clamp-1">
                            {project.project_description}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center space-x-6">
                      <div className="text-right">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge className={getStatusColor(project.status)}>
                            {project.status}
                          </Badge>
                          <Badge variant="outline" className="capitalize">
                            {project.project_type}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-slate-500">
                          {project.budget_range && (
                            <div className="flex items-center gap-1">
                              <DollarSign className="h-3 w-3" />
                              <span>{project.budget_range}</span>
                            </div>
                          )}
                          {project.timeline && (
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              <span>{project.timeline}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="text-sm text-slate-600">
                        {new Date(project.created_at).toLocaleDateString()}
                      </div>

                      <div className="flex space-x-1">
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
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteProject(project.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Building2 className="h-8 w-8 text-slate-400" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  {projects.length === 0
                    ? "No projects yet"
                    : "No projects match your filters"}
                </h3>
                <p className="text-slate-600 mb-4">
                  {projects.length === 0
                    ? "Get started by creating your first project"
                    : "Try adjusting your search or filter criteria"}
                </p>
                {projects.length === 0 && (
                  <Button asChild>
                    <Link href="/admin/projects/add">
                      <Plus className="h-4 w-4 mr-2" />
                      Create First Project
                    </Link>
                  </Button>
                )}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-6 pt-6 border-t">
                <div className="text-sm text-slate-600">
                  Page {currentPage} of {totalPages}
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(1, prev - 1))
                    }
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                    }
                    disabled={currentPage === totalPages}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function ProjectListingsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50">
          <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
            <div className="px-6 py-4">
              <div className="flex items-center gap-4">
                <div className="h-8 w-8 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-6 w-32 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>
          </header>
          <div className="max-w-7xl mx-auto p-6">
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="h-16 bg-gray-200 rounded animate-pulse"
                ></div>
              ))}
            </div>
          </div>
        </div>
      }
    >
      <ProjectListing />
    </Suspense>
  );
}
