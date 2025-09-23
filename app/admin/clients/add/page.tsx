// Update to your existing Add Client component
"use client";

import type React from "react";
import { useState } from "react";
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
  Copy,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { clientService } from "@/lib/supabase";
import { sendClientWelcomeEmail } from "@/lib/email";

export default function EnhancedAddClient() {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    company: "",
    project_type: "" as
      | "residential"
      | "commercial"
      | "renovation"
      | "interior"
      | "",
    project_title: "",
    project_description: "",
    budget_range: "" as
      | "50000-100000"
      | "100000-250000"
      | "250000-500000"
      | "500000+"
      | "",
    timeline: "",
    address: "",
    tier: "Tier 3" as "Tier 1" | "Tier 2" | "Tier 3",
    status: "Planning" as
      | "Planning"
      | "In Progress"
      | "Review"
      | "Completed"
      | "On Hold"
      | "Cancelled",
    client_status: "Active" as "Active" | "Inactive" | "Archived",
    notes: "",
  });

  const [portalSettings, setPortalSettings] = useState({
    enablePortalAccess: true,
    sendWelcomeEmail: true,
    customWelcomeMessage: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState("");
  const [clientResult, setClientResult] = useState<{
    client: any;
    temporaryPassword?: string;
  } | null>(null);

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Validation
    if (
      !formData.first_name ||
      !formData.last_name ||
      !formData.email ||
      !formData.project_title ||
      !formData.project_type
    ) {
      setError("Please fill in all required fields");
      setIsLoading(false);
      return;
    }

    try {
      const result = await clientService.create(
        {
          first_name: formData.first_name,
          last_name: formData.last_name,
          email: formData.email,
          phone: formData.phone || undefined,
          company: formData.company || undefined,
          address: formData.address || undefined,
          project_title: formData.project_title,
          project_type: formData.project_type as
            | "residential"
            | "commercial"
            | "renovation"
            | "interior",
          project_description: formData.project_description || undefined,
          budget_range: formData.budget_range || undefined,
          timeline: formData.timeline || undefined,
          tier: formData.tier,
          status: formData.status,
          client_status: formData.client_status,
          notes: formData.notes || undefined,
          project_start_date: new Date().toISOString().split("T")[0],
        },
        portalSettings.enablePortalAccess
      );

      setClientResult(result);
      setShowSuccess(true);

      // Send welcome email if requested
      if (portalSettings.sendWelcomeEmail && result.temporaryPassword) {
        await sendWelcomeEmail(result.client, result.temporaryPassword);
      }
    } catch (error: any) {
      console.error("Error adding client:", error);
      setError(error.message || "Failed to add client. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const sendWelcomeEmail = async (client: any, password: string) => {
    try {
      const success = await sendClientWelcomeEmail({
        email: client.email,
        firstName: client.first_name,
        lastName: client.last_name,
        projectTitle: client.project_title,
        temporaryPassword: password,
        portalUrl: `${window.location.origin}/portal/login`,
        customMessage: portalSettings.customWelcomeMessage || undefined,
      });

      if (!success) {
        console.error("Failed to send welcome email to:", client.email);
        // You could show a warning to the admin here
      } else {
        console.log("Welcome email sent successfully to:", client.email);
      }
    } catch (error) {
      console.error("Error sending welcome email:", error);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
  };

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  if (showSuccess && clientResult) {
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
                Client Added Successfully
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
                    Client Added Successfully!
                  </h2>
                  <p className="text-slate-600">
                    {clientResult.client.first_name}{" "}
                    {clientResult.client.last_name} has been added to the
                    system.
                  </p>
                </div>

                {clientResult.temporaryPassword && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-left">
                    <h3 className="text-lg font-semibold text-blue-900 mb-4">
                      Portal Access Credentials
                    </h3>

                    <div className="space-y-3">
                      <div>
                        <Label className="text-sm text-blue-700">Email</Label>
                        <div className="flex items-center gap-2 mt-1">
                          <code className="flex-1 bg-white px-3 py-2 rounded border text-sm">
                            {clientResult.client.email}
                          </code>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              copyToClipboard(clientResult.client.email)
                            }
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      <div>
                        <Label className="text-sm text-blue-700">
                          Temporary Password
                        </Label>
                        <div className="flex items-center gap-2 mt-1">
                          <code className="flex-1 bg-white px-3 py-2 rounded border text-sm font-mono">
                            {clientResult.temporaryPassword}
                          </code>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              copyToClipboard(clientResult.temporaryPassword!)
                            }
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
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
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              copyToClipboard(
                                `${window.location.origin}/portal/login`
                              )
                            }
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
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
                  <Link href={`/admin/clients/${clientResult.client.id}`}>
                    <Button>
                      <Eye className="h-4 w-4 mr-2" />
                      View Client
                    </Button>
                  </Link>
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
                    value={formData.first_name}
                    onChange={(e) =>
                      handleInputChange("first_name", e.target.value)
                    }
                    placeholder="John"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="last_name">Last Name *</Label>
                  <Input
                    id="last_name"
                    value={formData.last_name}
                    onChange={(e) =>
                      handleInputChange("last_name", e.target.value)
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
                      value={formData.email}
                      onChange={(e) =>
                        handleInputChange("email", e.target.value)
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
                      value={formData.phone}
                      onChange={(e) =>
                        handleInputChange("phone", e.target.value)
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
                  value={formData.company}
                  onChange={(e) => handleInputChange("company", e.target.value)}
                  placeholder="Company Name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Textarea
                    id="address"
                    value={formData.address}
                    onChange={(e) =>
                      handleInputChange("address", e.target.value)
                    }
                    placeholder="Full address including city and region"
                    className="pl-10 min-h-[80px]"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Project Information */}
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-indigo-600" />
                Project Information
              </CardTitle>
              <CardDescription>
                Details about the client's project
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
                  <Select
                    value={formData.budget_range}
                    onValueChange={(value) =>
                      handleInputChange("budget_range", value)
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

          {/* Service Tier */}
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle>Service Tier & Status</CardTitle>
              <CardDescription>
                Assign the appropriate service tier for this client
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="tier">Tier Assignment</Label>
                  <Select
                    value={formData.tier}
                    onValueChange={(value) => handleInputChange("tier", value)}
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
                    value={formData.client_status}
                    onValueChange={(value) =>
                      handleInputChange("client_status", value)
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
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => handleInputChange("notes", e.target.value)}
                  placeholder="Additional notes about this client"
                  className="min-h-[80px]"
                />
              </div>
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
              {isLoading ? "Adding Client..." : "Add Client"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
