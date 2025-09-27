"use client";

import type React from "react";
import { useState, useEffect, use } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  ArrowLeft,
  Save,
  Building2,
  Calendar,
  DollarSign,
  CheckCircle,
  AlertCircle,
  User,
  Eye,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { projectService } from "@/lib/supabase";
import type { Project, Client } from "@/lib/supabase";

type ProjectWithClient = Project & { client: Client };

export default function EditProject({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // Unwrap params using React.use()
  const { id } = use(params);

  const [formData, setFormData] = useState({
    project_title: "",
    project_type: "" as
      | "residential"
      | "commercial"
      | "renovation"
      | "interior"
      | "",
    project_description: "",
    budget_range: "" as
      | "50000-100000"
      | "100000-250000"
      | "250000-500000"
      | "500000+"
      | "",
    timeline: "",
    status: "Planning" as
      | "Planning"
      | "In Progress"
      | "Review"
      | "Completed"
      | "On Hold"
      | "Cancelled",
    project_start_date: "",
    project_end_date: "",
    notes: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingProject, setIsLoadingProject] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState("");
  const [originalProject, setOriginalProject] =
    useState<ProjectWithClient | null>(null);

  const router = useRouter();

  // Load existing project data
  useEffect(() => {
    const fetchProject = async () => {
      try {
        console.log("Fetching project for edit with ID:", id);
        setIsLoadingProject(true);
        setError("");

        const project = await projectService.getWithClient(id);
        console.log("Loaded project data for edit:", project);
        setOriginalProject(project);

        // Map project data to form data
        setFormData({
          project_title: project.project_title,
          project_type: project.project_type,
          project_description: project.project_description || "",
          budget_range: project.budget_range || "",
          timeline: project.timeline || "",
          status: project.status,
          project_start_date: project.project_start_date || "",
          project_end_date: project.project_end_date || "",
          notes: project.notes || "",
        });
      } catch (err: any) {
        console.error("Failed to fetch project for edit:", err);
        setError(
          "Failed to load project data: " + (err.message || "Unknown error")
        );
      } finally {
        setIsLoadingProject(false);
      }
    };

    if (id) {
      fetchProject();
    }
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Validation
    if (!formData.project_title || !formData.project_type) {
      setError("Please fill in all required fields");
      setIsLoading(false);
      return;
    }

    try {
      // Prepare update data
      const updateData: Partial<Project> = {
        project_title: formData.project_title,
        project_type: formData.project_type,
        project_description: formData.project_description || undefined,
        budget_range: formData.budget_range || undefined,
        timeline: formData.timeline || undefined,
        status: formData.status,
        project_start_date: formData.project_start_date || undefined,
        project_end_date: formData.project_end_date || undefined,
        notes: formData.notes || undefined,
        updated_at: new Date().toISOString(),
      };

      console.log("Updating project with data:", updateData);
      await projectService.update(id, updateData);

      setShowSuccess(true);

      // Redirect after showing success message
      setTimeout(() => {
        router.push(`/admin/projects/${id}`);
      }, 2000);
    } catch (error: any) {
      console.error("Error updating project:", error);
      setError(error.message || "Failed to update project. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Loading state while fetching project data
  if (isLoadingProject) {
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
        <div className="max-w-4xl mx-auto p-6">
          <div className="space-y-6">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="border-0 shadow-sm">
                <CardHeader>
                  <div className="h-6 w-48 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 w-64 bg-gray-200 rounded animate-pulse"></div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[...Array(4)].map((_, j) => (
                      <div
                        key={j}
                        className="h-10 bg-gray-200 rounded animate-pulse"
                      ></div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Success state
  if (showSuccess) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
              <h2 className="text-xl font-semibold text-slate-900">
                Project Updated Successfully!
              </h2>
              <p className="text-slate-600">
                "{formData.project_title}" has been updated.
              </p>
              <p className="text-sm text-slate-500">
                Redirecting to project details...
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Error state (if project not found)
  if (error && !originalProject) {
    return (
      <div className="min-h-screen bg-slate-50">
        <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
          <div className="px-6 py-4">
            <div className="flex items-center gap-4">
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
                className="h-8 w-auto"
              />
              <h1 className="text-xl font-semibold text-slate-900">
                Edit Project
              </h1>
            </div>
          </div>
        </header>
        <div className="max-w-4xl mx-auto p-6">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
            {error}
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
          <div className="flex items-center gap-4">
            <Link href={`/admin/projects/${id}`}>
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Project Details
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
              Edit Project: {originalProject?.project_title}
            </h1>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <Alert className="border-red-200 bg-red-50">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-red-700">
                {error}
              </AlertDescription>
            </Alert>
          )}

          {/* Client Information (Read-only) */}
          {originalProject && (
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-indigo-600" />
                  Client Information
                </CardTitle>
                <CardDescription>
                  This project belongs to the following client
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-slate-50 rounded-lg border">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-slate-600">Client Name:</span>{" "}
                      <span className="font-medium">
                        {originalProject.client.first_name}{" "}
                        {originalProject.client.last_name}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-600">Email:</span>{" "}
                      <span>{originalProject.client.email}</span>
                    </div>
                    {originalProject.client.company && (
                      <div>
                        <span className="text-slate-600">Company:</span>{" "}
                        <span>{originalProject.client.company}</span>
                      </div>
                    )}
                    <div>
                      <span className="text-slate-600">Tier:</span>{" "}
                      <span>{originalProject.client.tier}</span>
                    </div>
                  </div>
                  <div className="mt-3">
                    <Link href={`/admin/clients/${originalProject.client.id}`}>
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        View Client Details
                      </Button>
                    </Link>
                  </div>
                </div>
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="text-sm">
                    To change the client for this project, you'll need to create
                    a new project.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          )}

          {/* Project Information */}
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-indigo-600" />
                Project Information
              </CardTitle>
              <CardDescription>
                Update project details and specifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="project_type">Project Type *</Label>
                  <Select
                    value={formData.project_type}
                    onValueChange={(value) =>
                      handleInputChange("project_type", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select project type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="residential">Residential</SelectItem>
                      <SelectItem value="commercial">Commercial</SelectItem>
                      <SelectItem value="renovation">Renovation</SelectItem>
                      <SelectItem value="interior">Interior Design</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Project Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) =>
                      handleInputChange("status", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Planning">Planning</SelectItem>
                      <SelectItem value="In Progress">In Progress</SelectItem>
                      <SelectItem value="Review">Review</SelectItem>
                      <SelectItem value="Completed">Completed</SelectItem>
                      <SelectItem value="On Hold">On Hold</SelectItem>
                      <SelectItem value="Cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="project_title">Project Title *</Label>
                <Input
                  id="project_title"
                  value={formData.project_title}
                  onChange={(e) =>
                    handleInputChange("project_title", e.target.value)
                  }
                  placeholder="Modern Villa Design"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="project_description">Project Description</Label>
                <Textarea
                  id="project_description"
                  value={formData.project_description}
                  onChange={(e) =>
                    handleInputChange("project_description", e.target.value)
                  }
                  placeholder="Detailed description of the project requirements and scope"
                  className="min-h-[100px]"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="budget_range">Budget Range</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Select
                      value={formData.budget_range}
                      onValueChange={(value) =>
                        handleInputChange("budget_range", value)
                      }
                    >
                      <SelectTrigger className="pl-10">
                        <SelectValue placeholder="Select budget range" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="50000-100000">
                          GHS 50,000 - 100,000
                        </SelectItem>
                        <SelectItem value="100000-250000">
                          GHS 100,000 - 250,000
                        </SelectItem>
                        <SelectItem value="250000-500000">
                          GHS 250,000 - 500,000
                        </SelectItem>
                        <SelectItem value="500000+">GHS 500,000+</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timeline">Timeline</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      id="timeline"
                      value={formData.timeline}
                      onChange={(e) =>
                        handleInputChange("timeline", e.target.value)
                      }
                      placeholder="6-8 months"
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="project_start_date">Start Date</Label>
                  <Input
                    id="project_start_date"
                    type="date"
                    value={formData.project_start_date}
                    onChange={(e) =>
                      handleInputChange("project_start_date", e.target.value)
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="project_end_date">End Date (Optional)</Label>
                  <Input
                    id="project_end_date"
                    type="date"
                    value={formData.project_end_date}
                    onChange={(e) =>
                      handleInputChange("project_end_date", e.target.value)
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Project Notes</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => handleInputChange("notes", e.target.value)}
                  placeholder="Additional notes about this project"
                  className="min-h-[80px]"
                />
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-4 pt-6">
            <Link href={`/admin/projects/${id}`}>
              <Button variant="outline" disabled={isLoading}>
                Cancel
              </Button>
            </Link>
            <Button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700"
              disabled={isLoading}
            >
              <Save className="h-4 w-4 mr-2" />
              {isLoading ? "Updating Project..." : "Update Project"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
