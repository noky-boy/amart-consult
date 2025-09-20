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
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { clientService } from "@/lib/supabase";

export default function AddClient() {
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

  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState("");
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
      await clientService.create({
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
        project_start_date: new Date().toISOString().split("T")[0], // Today's date
      });

      setShowSuccess(true);

      // Redirect after showing success message
      setTimeout(() => {
        router.push("/admin/dashboard");
      }, 2000);
    } catch (error: any) {
      console.error("Error adding client:", error);
      setError(error.message || "Failed to add client. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
              <h2 className="text-xl font-semibold text-slate-900">
                Client Added Successfully!
              </h2>
              <p className="text-slate-600">
                {formData.first_name} {formData.last_name} has been added to the
                system.
              </p>
              <p className="text-sm text-slate-500">
                Redirecting to dashboard...
              </p>
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
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
              {error}
            </div>
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

          {/* Service Tier */}
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle>Service Tier</CardTitle>
              <CardDescription>
                Assign the appropriate service tier for this client
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
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
                <p className="text-sm text-slate-600">
                  Only Tier 3 clients will have access to the client portal
                  dashboard
                </p>
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
