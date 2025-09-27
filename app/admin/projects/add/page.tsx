"use client";

import type React from "react";
import { useState, useEffect } from "react";
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
  Eye,
  AlertCircle,
  User,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { clientService, projectService } from "@/lib/supabase";
import type { Client, Project } from "@/lib/supabase";

export default function AddProject() {
  const [projectData, setProjectData] = useState({
    client_id: "",
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

  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState("");
  const [createdProject, setCreatedProject] = useState<Project | null>(null);

  const router = useRouter();
  const searchParams = useSearchParams();
  const clientIdParam = searchParams.get("clientId");

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const clientData = await clientService.getAll();
        setClients(clientData);

        // If clientId is provided in URL, pre-select that client
        if (clientIdParam) {
          const preSelectedClient = clientData.find(
            (c) => c.id === clientIdParam
          );
          if (preSelectedClient) {
            setSelectedClient(preSelectedClient);
            setProjectData((prev) => ({ ...prev, client_id: clientIdParam }));
          }
        }
      } catch (err: any) {
        console.error("Failed to fetch clients:", err);
        setError("Failed to load clients");
      }
    };

    fetchClients();
  }, [clientIdParam]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Validation
    if (
      !projectData.client_id ||
      !projectData.project_title ||
      !projectData.project_type
    ) {
      setError("Please fill in all required fields");
      setIsLoading(false);
      return;
    }

    const dataToSubmit = {
      ...projectData,
      // Fix for the required project_type field
      project_type: projectData.project_type as Project["project_type"],

      // ✅ NEW: Fix for the optional budget_range field
      // If it's an empty string, convert to undefined; otherwise, use the value.
      budget_range: (projectData.budget_range === ""
        ? undefined
        : projectData.budget_range) as Project["budget_range"],

      project_start_date: projectData.project_start_date || undefined,
      project_end_date: projectData.project_end_date || undefined,
    };

    try {
      const project = await projectService.create(dataToSubmit);

      setCreatedProject(project);
      setShowSuccess(true);

      setTimeout(() => {
        router.push(`/admin/projects/${project.id}`);
      }, 2000);
    } catch (error: any) {
      console.error("Error creating project:", error);
      setError(error.message || "Failed to create project. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (
    field: keyof typeof projectData,
    value: string
  ) => {
    setProjectData((prev) => ({ ...prev, [field]: value }));
  };

  const handleClientSelect = (clientId: string) => {
    const client = clients.find((c) => c.id === clientId);
    setSelectedClient(client || null);
    setProjectData((prev) => ({ ...prev, client_id: clientId }));
  };

  // Success state
  if (showSuccess && createdProject && selectedClient) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
              <h2 className="text-xl font-semibold text-slate-900">
                Project Created Successfully!
              </h2>
              <p className="text-slate-600">
                "{createdProject.project_title}" has been created for{" "}
                {selectedClient.first_name} {selectedClient.last_name}.
              </p>
              <div className="flex gap-4 justify-center">
                <Link href="/admin/projects">
                  <Button variant="outline">All Projects</Button>
                </Link>
                <Link href={`/admin/projects/${createdProject.id}`}>
                  <Button>
                    <Eye className="h-4 w-4 mr-2" />
                    View Project
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
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
              Add New Project
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

          {/* Client Selection */}
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-indigo-600" />
                Client Selection
              </CardTitle>
              <CardDescription>
                Select the client this project belongs to
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="client_id">Client *</Label>
                <Select
                  value={projectData.client_id}
                  onValueChange={handleClientSelect}
                  disabled={!!clientIdParam} // Disable if client is pre-selected
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a client" />
                  </SelectTrigger>
                  <SelectContent>
                    {clients.map((client) => (
                      <SelectItem key={client.id} value={client.id}>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">
                            {client.first_name} {client.last_name}
                          </span>
                          <span className="text-sm text-slate-500">
                            ({client.email})
                          </span>
                          {client.company && (
                            <span className="text-sm text-slate-400">
                              • {client.company}
                            </span>
                          )}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {clientIdParam && (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="text-sm">
                    Creating project for pre-selected client. You can change
                    this by going to the projects list.
                  </AlertDescription>
                </Alert>
              )}

              {selectedClient && (
                <div className="p-4 bg-slate-50 rounded-lg border">
                  <h4 className="font-medium text-slate-900 mb-2">
                    Selected Client
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-slate-600">Name:</span>{" "}
                      <span className="font-medium">
                        {selectedClient.first_name} {selectedClient.last_name}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-600">Email:</span>{" "}
                      <span>{selectedClient.email}</span>
                    </div>
                    {selectedClient.company && (
                      <div>
                        <span className="text-slate-600">Company:</span>{" "}
                        <span>{selectedClient.company}</span>
                      </div>
                    )}
                    <div>
                      <span className="text-slate-600">Tier:</span>{" "}
                      <span>{selectedClient.tier}</span>
                    </div>
                  </div>
                  <div className="mt-3">
                    <Link href={`/admin/clients/${selectedClient.id}`}>
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        View Client Details
                      </Button>
                    </Link>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Project Information */}
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-indigo-600" />
                Project Information
              </CardTitle>
              <CardDescription>Details about the project</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="project_type">Project Type *</Label>
                  <Select
                    value={projectData.project_type}
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
                    value={projectData.status}
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
                  value={projectData.project_title}
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
                  value={projectData.project_description}
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
                      value={projectData.budget_range}
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
                      value={projectData.timeline}
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
                    value={projectData.project_start_date}
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
                    value={projectData.project_end_date}
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
                  value={projectData.notes}
                  onChange={(e) => handleInputChange("notes", e.target.value)}
                  placeholder="Additional notes about this project"
                  className="min-h-[80px]"
                />
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-4 pt-6">
            <Link href="/admin/projects">
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
              {isLoading ? "Creating Project..." : "Create Project"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
