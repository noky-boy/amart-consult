"use client";

import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import CopyToClipboard from "@/components/CopyToClipboard";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  ArrowLeft,
  Save,
  User,
  Building2,
  Mail,
  Phone,
  MapPin,
  Calendar,
  CheckCircle,
  Eye,
  AlertCircle,
  Plus,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { clientService, projectService } from "@/lib/supabase";
import type { Client, Project } from "@/lib/supabase";

export default function EnhancedAddClient() {
  // Client data (no more project fields)
  const [clientData, setClientData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    company: "",
    address: "",
    tier: "Tier 3" as "Tier 1" | "Tier 2" | "Tier 3",
    client_status: "Active" as "Active" | "Inactive" | "Archived",
    notes: "",
  });

  // Project data (now separate)
  const [projectData, setProjectData] = useState({
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

  const [portalSettings, setPortalSettings] = useState({
    enablePortalAccess: true,
    sendWelcomeEmail: true,
    customWelcomeMessage: "",
  });

  const [createProject, setCreateProject] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<{
    client: Client;
    project?: Project;
    temporaryPassword?: string;
  } | null>(null);

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Validation
    if (!clientData.first_name || !clientData.last_name || !clientData.email) {
      setError("Please fill in required client fields");
      setIsLoading(false);
      return;
    }

    if (
      createProject &&
      (!projectData.project_title || !projectData.project_type)
    ) {
      setError("Please fill in required project fields");
      setIsLoading(false);
      return;
    }

    try {
      // Step 1: Create the client
      const clientResult = await clientService.create(
        clientData,
        portalSettings.enablePortalAccess
      );

      let project: Project | undefined;

      // Step 2: Create the project if requested
      if (createProject) {
        project = await projectService.create({
          client_id: clientResult.client.id,
          ...projectData,
        });
      }

      setResult({
        client: clientResult.client,
        project,
        temporaryPassword: clientResult.temporaryPassword,
      });

      setShowSuccess(true);

      // Send welcome email if requested
      if (portalSettings.sendWelcomeEmail && clientResult.temporaryPassword) {
        await sendWelcomeEmail(
          clientResult.client,
          clientResult.temporaryPassword,
          project
        );
      }
    } catch (error: any) {
      console.error("Error adding client:", error);
      setError(error.message || "Failed to add client. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const sendWelcomeEmail = async (
    client: Client,
    password: string,
    project?: Project
  ) => {
    try {
      const response = await fetch("/api/send-welcome-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: client.email,
          firstName: client.first_name,
          lastName: client.last_name,
          projectTitle: project?.project_title || "Your Project",
          temporaryPassword: password,
          customMessage: portalSettings.customWelcomeMessage || undefined,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        console.error("Failed to send welcome email:", result.error);
        return false;
      } else {
        console.log("Welcome email sent successfully to:", client.email);
        return true;
      }
    } catch (error) {
      console.error("Error sending welcome email:", error);
      return false;
    }
  };

  const handleClientInputChange = (
    field: keyof typeof clientData,
    value: string
  ) => {
    setClientData((prev) => ({ ...prev, [field]: value }));
  };

  const handleProjectInputChange = (
    field: keyof typeof projectData,
    value: string
  ) => {
    setProjectData((prev) => ({ ...prev, [field]: value }));
  };

  if (showSuccess && result) {
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
                Client {result.project ? "and Project " : ""}Added Successfully
              </h1>
            </div>
          </div>
        </header>

        <div className="max-w-2xl mx-auto p-6">
          <Card className="border-0 shadow-lg">
            <CardContent className="pt-6">
              <div className="text-center space-y-6">
                <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />

                <div>
                  <h2 className="text-2xl font-semibold text-slate-900 mb-2">
                    Successfully Created!
                  </h2>
                  <p className="text-slate-600">
                    {result.client.first_name} {result.client.last_name} has
                    been added
                    {result.project &&
                      ` with project "${result.project.project_title}"`}
                  </p>
                </div>

                {result.temporaryPassword && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-left">
                    <h3 className="text-lg font-semibold text-blue-900 mb-4">
                      Portal Access Credentials
                    </h3>

                    <div className="space-y-3">
                      <div>
                        <Label className="text-sm text-blue-700">Email</Label>
                        <div className="flex items-center gap-2 mt-1">
                          <code className="flex-1 bg-white px-3 py-2 rounded border text-sm">
                            {result.client.email}
                          </code>
                          <CopyToClipboard text={result.client.email} />
                        </div>
                      </div>

                      <div>
                        <Label className="text-sm text-blue-700">
                          Temporary Password
                        </Label>
                        <div className="flex items-center gap-2 mt-1">
                          <code className="flex-1 bg-white px-3 py-2 rounded border text-sm font-mono">
                            {result.temporaryPassword}
                          </code>
                          <CopyToClipboard text={result.temporaryPassword} />
                        </div>
                      </div>

                      <div>
                        <Label className="text-sm text-blue-700">
                          Portal URL
                        </Label>
                        <div className="flex items-center gap-2 mt-1">
                          <code className="flex-1 bg-white px-3 py-2 rounded border text-sm">
                            {window.location.origin}/portal/login
                          </code>
                          <CopyToClipboard
                            text={`${window.location.origin}/portal/login`}
                          />
                        </div>
                      </div>
                    </div>

                    <Alert className="mt-4">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription className="text-sm">
                        {portalSettings.sendWelcomeEmail
                          ? "A welcome email with these credentials has been sent to the client."
                          : "Make sure to securely share these credentials with your client."}
                        The client should update their password on first login.
                      </AlertDescription>
                    </Alert>
                  </div>
                )}

                <div className="flex gap-4 justify-center">
                  <Link href="/admin/dashboard">
                    <Button variant="outline">Back to Dashboard</Button>
                  </Link>
                  <Link href={`/admin/clients/${result.client.id}`}>
                    <Button>
                      <Eye className="h-4 w-4 mr-2" />
                      View Client
                    </Button>
                  </Link>
                  {result.project && (
                    <Link href={`/admin/projects/${result.project.id}`}>
                      <Button variant="outline">
                        <Eye className="h-4 w-4 mr-2" />
                        View Project
                      </Button>
                    </Link>
                  )}
                  <Link href="/admin/clients/add">
                    <Button variant="outline">Add Another Client</Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
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
              Add New Client
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

          {/* Client Information */}
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-indigo-600" />
                Client Information
              </CardTitle>
              <CardDescription>
                Basic information about the client
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="first_name">First Name *</Label>
                  <Input
                    id="first_name"
                    value={clientData.first_name}
                    onChange={(e) =>
                      handleClientInputChange("first_name", e.target.value)
                    }
                    placeholder="John"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="last_name">Last Name *</Label>
                  <Input
                    id="last_name"
                    value={clientData.last_name}
                    onChange={(e) =>
                      handleClientInputChange("last_name", e.target.value)
                    }
                    placeholder="Smith"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      id="email"
                      type="email"
                      value={clientData.email}
                      onChange={(e) =>
                        handleClientInputChange("email", e.target.value)
                      }
                      placeholder="john.smith@email.com"
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      id="phone"
                      value={clientData.phone}
                      onChange={(e) =>
                        handleClientInputChange("phone", e.target.value)
                      }
                      placeholder="+233 XX XXX XXXX"
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="company">Company (Optional)</Label>
                <Input
                  id="company"
                  value={clientData.company}
                  onChange={(e) =>
                    handleClientInputChange("company", e.target.value)
                  }
                  placeholder="Company Name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Textarea
                    id="address"
                    value={clientData.address}
                    onChange={(e) =>
                      handleClientInputChange("address", e.target.value)
                    }
                    placeholder="Full address including city and region"
                    className="pl-10 min-h-[80px]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="tier">Tier Assignment</Label>
                  <Select
                    value={clientData.tier}
                    onValueChange={(value) =>
                      handleClientInputChange("tier", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Tier 1">
                        Tier 1 - Basic Consultation
                      </SelectItem>
                      <SelectItem value="Tier 2">
                        Tier 2 - Design Development
                      </SelectItem>
                      <SelectItem value="Tier 3">
                        Tier 3 - Full Service (Portal Access)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="client_status">Client Status</Label>
                  <Select
                    value={clientData.client_status}
                    onValueChange={(value) =>
                      handleClientInputChange("client_status", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Inactive">Inactive</SelectItem>
                      <SelectItem value="Archived">Archived</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="client_notes">Client Notes</Label>
                <Textarea
                  id="client_notes"
                  value={clientData.notes}
                  onChange={(e) =>
                    handleClientInputChange("notes", e.target.value)
                  }
                  placeholder="General notes about this client"
                  className="min-h-[80px]"
                />
              </div>
            </CardContent>
          </Card>

          {/* Project Creation Toggle */}
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-indigo-600" />
                Project Information
              </CardTitle>
              <CardDescription>
                Optionally create an initial project for this client
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="createProject"
                  checked={createProject}
                  onCheckedChange={(checked: any) =>
                    setCreateProject(!!checked)
                  }
                />
                <Label
                  htmlFor="createProject"
                  className="text-sm font-medium cursor-pointer"
                >
                  Create initial project for this client
                </Label>
              </div>
              <p className="text-sm text-slate-600">
                You can always add projects later from the client details page
              </p>

              {createProject && (
                <div className="space-y-4 pt-4 border-t">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="project_type">Project Type *</Label>
                      <Select
                        value={projectData.project_type}
                        onValueChange={(value) =>
                          handleProjectInputChange("project_type", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select project type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="residential">
                            Residential
                          </SelectItem>
                          <SelectItem value="commercial">Commercial</SelectItem>
                          <SelectItem value="renovation">Renovation</SelectItem>
                          <SelectItem value="interior">
                            Interior Design
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="status">Project Status</Label>
                      <Select
                        value={projectData.status}
                        onValueChange={(value) =>
                          handleProjectInputChange("status", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Planning">Planning</SelectItem>
                          <SelectItem value="In Progress">
                            In Progress
                          </SelectItem>
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
                        handleProjectInputChange(
                          "project_title",
                          e.target.value
                        )
                      }
                      placeholder="Modern Villa Design"
                      required={createProject}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="project_description">
                      Project Description
                    </Label>
                    <Textarea
                      id="project_description"
                      value={projectData.project_description}
                      onChange={(e) =>
                        handleProjectInputChange(
                          "project_description",
                          e.target.value
                        )
                      }
                      placeholder="Detailed description of the project requirements and scope"
                      className="min-h-[100px]"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="budget_range">Budget Range</Label>
                      <Select
                        value={projectData.budget_range}
                        onValueChange={(value) =>
                          handleProjectInputChange("budget_range", value)
                        }
                      >
                        <SelectTrigger>
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
                    <div className="space-y-2">
                      <Label htmlFor="timeline">Timeline</Label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input
                          id="timeline"
                          value={projectData.timeline}
                          onChange={(e) =>
                            handleProjectInputChange("timeline", e.target.value)
                          }
                          placeholder="6-8 months"
                          className="pl-10"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="project_notes">Project Notes</Label>
                    <Textarea
                      id="project_notes"
                      value={projectData.notes}
                      onChange={(e) =>
                        handleProjectInputChange("notes", e.target.value)
                      }
                      placeholder="Specific notes about this project"
                      className="min-h-[80px]"
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Portal Access Settings */}
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle>Client Portal Access</CardTitle>
              <CardDescription>
                Configure portal access and welcome email settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="enablePortalAccess"
                  checked={portalSettings.enablePortalAccess}
                  onCheckedChange={(checked: any) =>
                    setPortalSettings((prev) => ({
                      ...prev,
                      enablePortalAccess: !!checked,
                    }))
                  }
                />
                <Label
                  htmlFor="enablePortalAccess"
                  className="text-sm font-medium cursor-pointer"
                >
                  Enable client portal access
                </Label>
              </div>
              <p className="text-sm text-slate-600 ml-6">
                Creates login credentials and allows client to access their
                project dashboard
              </p>

              {portalSettings.enablePortalAccess && (
                <div className="ml-6 space-y-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="sendWelcomeEmail"
                      checked={portalSettings.sendWelcomeEmail}
                      onCheckedChange={(checked: any) =>
                        setPortalSettings((prev) => ({
                          ...prev,
                          sendWelcomeEmail: !!checked,
                        }))
                      }
                    />
                    <Label
                      htmlFor="sendWelcomeEmail"
                      className="text-sm font-medium cursor-pointer"
                    >
                      Send welcome email with login credentials
                    </Label>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="customWelcomeMessage">
                      Custom Welcome Message (Optional)
                    </Label>
                    <Textarea
                      id="customWelcomeMessage"
                      value={portalSettings.customWelcomeMessage}
                      onChange={(e) =>
                        setPortalSettings((prev) => ({
                          ...prev,
                          customWelcomeMessage: e.target.value,
                        }))
                      }
                      placeholder="Add a personal message to the welcome email..."
                      className="min-h-[80px]"
                    />
                  </div>

                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription className="text-sm">
                      A temporary password will be generated. The client will be
                      prompted to change it on first login.
                    </AlertDescription>
                  </Alert>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-4 pt-6">
            <Link href="/admin/dashboard">
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
              {isLoading
                ? "Creating..."
                : `Create Client${createProject ? " & Project" : ""}`}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
