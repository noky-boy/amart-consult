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
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  ArrowLeft,
  Save,
  Plus,
  Trash2,
  GripVertical,
  Target,
  CheckCircle,
  Clock,
  Edit3,
  AlertCircle,
  Building2,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { projectService, phaseService } from "@/lib/supabase";
import type { Project, Client, ProjectPhase } from "@/lib/supabase";

type ProjectWithClient = Project & { client: Client };

export default function ProjectPhasesManagement({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  const [project, setProject] = useState<ProjectWithClient | null>(null);
  const [phases, setPhases] = useState<ProjectPhase[]>([]);
  const [newPhases, setNewPhases] = useState<
    {
      phase_name: string;
      phase_description: string;
      estimated_duration: string;
    }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [editingPhase, setEditingPhase] = useState<string | null>(null);

  // Common phase templates
  const phaseTemplates = {
    residential: [
      {
        name: "Site Survey & Analysis",
        description: "Initial site assessment and measurements",
        duration: "1 week",
      },
      {
        name: "Design Development",
        description: "Architectural design and planning",
        duration: "3-4 weeks",
      },
      {
        name: "Planning Permission",
        description: "Submit and obtain planning approvals",
        duration: "8-12 weeks",
      },
      {
        name: "Construction Documentation",
        description: "Detailed construction drawings and specifications",
        duration: "2-3 weeks",
      },
      {
        name: "Foundation Works",
        description: "Excavation and foundation construction",
        duration: "2-3 weeks",
      },
      {
        name: "Structural Framework",
        description: "Main structural elements construction",
        duration: "4-6 weeks",
      },
      {
        name: "Roofing & Exterior",
        description: "Roof installation and exterior finishing",
        duration: "3-4 weeks",
      },
      {
        name: "Mechanical & Electrical",
        description: "Plumbing, electrical, and HVAC installation",
        duration: "2-3 weeks",
      },
      {
        name: "Interior Finishing",
        description: "Flooring, painting, and interior fixtures",
        duration: "4-5 weeks",
      },
      {
        name: "Final Inspection & Handover",
        description: "Quality control and project completion",
        duration: "1 week",
      },
    ],
    commercial: [
      {
        name: "Feasibility Study",
        description: "Market analysis and site evaluation",
        duration: "2-3 weeks",
      },
      {
        name: "Concept Design",
        description: "Initial design concepts and layouts",
        duration: "3-4 weeks",
      },
      {
        name: "Design Development",
        description: "Detailed design refinement",
        duration: "4-6 weeks",
      },
      {
        name: "Planning & Permits",
        description: "Regulatory approvals and permits",
        duration: "12-16 weeks",
      },
      {
        name: "Construction Documentation",
        description: "Technical drawings and specifications",
        duration: "3-4 weeks",
      },
      {
        name: "Tender Process",
        description: "Contractor selection and bidding",
        duration: "4-6 weeks",
      },
      {
        name: "Site Preparation",
        description: "Demolition and site clearing",
        duration: "2-3 weeks",
      },
      {
        name: "Foundation & Structure",
        description: "Main structural construction",
        duration: "8-12 weeks",
      },
      {
        name: "Building Services",
        description: "MEP systems installation",
        duration: "6-8 weeks",
      },
      {
        name: "Fit-out & Finishing",
        description: "Interior construction and finishing",
        duration: "8-10 weeks",
      },
      {
        name: "Testing & Commissioning",
        description: "System testing and final inspections",
        duration: "2-3 weeks",
      },
    ],
    renovation: [
      {
        name: "Site Assessment",
        description: "Existing condition survey",
        duration: "1 week",
      },
      {
        name: "Design & Planning",
        description: "Renovation design and permits",
        duration: "4-6 weeks",
      },
      {
        name: "Demolition",
        description: "Selective demolition works",
        duration: "1-2 weeks",
      },
      {
        name: "Structural Modifications",
        description: "Structural changes and reinforcement",
        duration: "2-4 weeks",
      },
      {
        name: "Services Upgrade",
        description: "Electrical, plumbing, and HVAC updates",
        duration: "2-3 weeks",
      },
      {
        name: "Interior Construction",
        description: "New walls, ceilings, and partitions",
        duration: "3-4 weeks",
      },
      {
        name: "Finishing Works",
        description: "Flooring, painting, and fixtures",
        duration: "3-4 weeks",
      },
      {
        name: "Final Inspection",
        description: "Quality check and handover",
        duration: "1 week",
      },
    ],
    interior: [
      {
        name: "Space Planning",
        description: "Layout design and space optimization",
        duration: "2 weeks",
      },
      {
        name: "Design Development",
        description: "Color schemes, materials, and finishes",
        duration: "3-4 weeks",
      },
      {
        name: "Procurement",
        description: "Furniture and materials ordering",
        duration: "4-6 weeks",
      },
      {
        name: "Preparation Works",
        description: "Painting and minor modifications",
        duration: "1-2 weeks",
      },
      {
        name: "Installation",
        description: "Furniture and fixture installation",
        duration: "2-3 weeks",
      },
      {
        name: "Styling & Finishing",
        description: "Final touches and decoration",
        duration: "1 week",
      },
    ],
  };

  useEffect(() => {
    const fetchProjectData = async () => {
      try {
        setLoading(true);
        setError("");

        const [projectData, phasesData] = await Promise.all([
          projectService.getWithClient(id),
          phaseService.getByProjectId(id),
        ]);

        setProject(projectData);
        setPhases(phasesData);
      } catch (err: any) {
        console.error("Failed to fetch project data:", err);
        setError("Failed to load project data");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProjectData();
    }
  }, [id]);

  const addNewPhase = () => {
    setNewPhases([
      ...newPhases,
      {
        phase_name: "",
        phase_description: "",
        estimated_duration: "",
      },
    ]);
  };

  const removeNewPhase = (index: number) => {
    setNewPhases(newPhases.filter((_, i) => i !== index));
  };

  const updateNewPhase = (index: number, field: string, value: string) => {
    const updated = [...newPhases];
    updated[index] = { ...updated[index], [field]: value };
    setNewPhases(updated);
  };

  const loadTemplate = (projectType: keyof typeof phaseTemplates) => {
    const template = phaseTemplates[projectType];
    const templatePhases = template.map((phase, index) => ({
      phase_name: phase.name,
      phase_description: phase.description,
      estimated_duration: phase.duration,
    }));

    setNewPhases([...newPhases, ...templatePhases]);
  };

  const handleSavePhases = async () => {
    if (newPhases.length === 0) {
      alert("Please add at least one phase");
      return;
    }

    // Validate required fields
    const invalidPhases = newPhases.some((phase) => !phase.phase_name.trim());
    if (invalidPhases) {
      alert("Please provide names for all phases");
      return;
    }

    setSaving(true);

    try {
      // Get the highest phase order from existing phases
      const maxOrder =
        phases.length > 0 ? Math.max(...phases.map((p) => p.phase_order)) : 0;

      // Create phase objects with proper ordering
      const phasesToCreate = newPhases.map((phase, index) => ({
        project_id: id,
        phase_name: phase.phase_name.trim(),
        phase_description: phase.phase_description.trim() || undefined,
        phase_order: maxOrder + index + 1,
        estimated_duration: phase.estimated_duration.trim() || undefined,
        is_completed: false,
      }));

      // Create all phases
      const createdPhases = await phaseService.createMultiple(phasesToCreate);

      // Update local state
      setPhases([...phases, ...createdPhases]);
      setNewPhases([]);

      alert("Phases saved successfully!");
    } catch (error: any) {
      console.error("Error saving phases:", error);
      setError("Failed to save phases: " + error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleTogglePhaseCompletion = async (phase: ProjectPhase) => {
    try {
      let updatedPhase: ProjectPhase;
      if (phase.is_completed) {
        updatedPhase = await phaseService.markIncomplete(phase.id);
      } else {
        updatedPhase = await phaseService.markCompleted(phase.id);
      }

      setPhases(phases.map((p) => (p.id === phase.id ? updatedPhase : p)));
    } catch (error: any) {
      console.error("Failed to update phase:", error);
      alert("Failed to update phase: " + error.message);
    }
  };

  const handleDeletePhase = async (phaseId: string) => {
    if (!confirm("Are you sure you want to delete this phase?")) return;

    try {
      await phaseService.delete(phaseId);
      setPhases(phases.filter((p) => p.id !== phaseId));
    } catch (error: any) {
      console.error("Failed to delete phase:", error);
      alert("Failed to delete phase: " + error.message);
    }
  };

  // Loading state
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
        <div className="max-w-4xl mx-auto p-6">
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
  if (error && !project) {
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
                Phase Management
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

  if (!project) return null;

  const completedPhases = phases.filter((p) => p.is_completed).length;
  const progressPercentage =
    phases.length > 0 ? Math.round((completedPhases / phases.length) * 100) : 0;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="px-6 py-4">
          <div className="flex items-center gap-4">
            <Link href={`/admin/projects/${id}`}>
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Project
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
              Phase Management
            </h1>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto p-6">
        {error && (
          <Alert className="border-red-200 bg-red-50 mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-red-700">
              {error}
            </AlertDescription>
          </Alert>
        )}

        {/* Project Overview */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>{project.project_title}</CardTitle>
                <CardDescription>
                  Client: {project.client.first_name} {project.client.last_name}
                  <span className="mx-2">•</span>
                  {phases.length} phases ({completedPhases} completed)
                </CardDescription>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-slate-900">
                  {progressPercentage}%
                </div>
                <div className="text-sm text-slate-600">Complete</div>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Existing Phases */}
        {phases.length > 0 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Current Phases
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {phases.map((phase, index) => (
                  <div
                    key={phase.id}
                    className="flex items-center gap-4 p-4 border border-slate-200 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <GripVertical className="h-4 w-4 text-slate-400" />
                      <Checkbox
                        id={`phase-${phase.id}`}
                        checked={phase.is_completed}
                        onCheckedChange={() =>
                          handleTogglePhaseCompletion(phase)
                        }
                      />
                      <span className="text-sm font-medium text-slate-600 min-w-[80px]">
                        Phase {phase.phase_order}
                      </span>
                    </div>

                    <div className="flex-1">
                      <h4
                        className={`font-medium ${
                          phase.is_completed
                            ? "line-through text-slate-500"
                            : "text-slate-900"
                        }`}
                      >
                        {phase.phase_name}
                      </h4>
                      {phase.phase_description && (
                        <p className="text-sm text-slate-600 mt-1">
                          {phase.phase_description}
                        </p>
                      )}
                      <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
                        {phase.estimated_duration && (
                          <span>Est. Duration: {phase.estimated_duration}</span>
                        )}
                        {phase.completed_date && (
                          <span>
                            Completed:{" "}
                            {new Date(
                              phase.completed_date
                            ).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {phase.is_completed ? (
                        <Badge
                          variant="default"
                          className="bg-green-100 text-green-800"
                        >
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Complete
                        </Badge>
                      ) : (
                        <Badge variant="outline">
                          <Clock className="h-3 w-3 mr-1" />
                          Pending
                        </Badge>
                      )}

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeletePhase(phase.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Add New Phases */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  Add New Phases
                </CardTitle>
                <CardDescription>
                  Create custom phases or use templates for your project type
                </CardDescription>
              </div>
              {project.project_type && (
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => loadTemplate(project.project_type)}
                    disabled={saving}
                  >
                    <Building2 className="h-4 w-4 mr-2" />
                    Load {project.project_type} Template
                  </Button>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Template Info */}
            {project.project_type && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Use the template button to automatically add typical phases
                  for {project.project_type} projects, or create custom phases
                  below.
                </AlertDescription>
              </Alert>
            )}

            {/* New Phase Forms */}
            {newPhases.map((phase, index) => (
              <div
                key={index}
                className="p-4 border border-slate-200 rounded-lg bg-slate-50"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="space-y-2">
                    <Label>Phase Name *</Label>
                    <Input
                      placeholder="e.g., Foundation Works"
                      value={phase.phase_name}
                      onChange={(e) =>
                        updateNewPhase(index, "phase_name", e.target.value)
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Estimated Duration</Label>
                    <Input
                      placeholder="e.g., 2-3 weeks"
                      value={phase.estimated_duration}
                      onChange={(e) =>
                        updateNewPhase(
                          index,
                          "estimated_duration",
                          e.target.value
                        )
                      }
                    />
                  </div>
                  <div className="flex items-end">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeNewPhase(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Description (Optional)</Label>
                  <Textarea
                    placeholder="Brief description of what happens in this phase"
                    value={phase.phase_description}
                    onChange={(e) =>
                      updateNewPhase(index, "phase_description", e.target.value)
                    }
                    className="min-h-[60px]"
                  />
                </div>
              </div>
            ))}

            {/* Add Phase Button */}
            <Button
              variant="outline"
              onClick={addNewPhase}
              disabled={saving}
              className="w-full"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Another Phase
            </Button>

            {/* Save Phases */}
            {newPhases.length > 0 && (
              <div className="flex justify-end pt-4 border-t">
                <div className="flex gap-4">
                  <Button
                    variant="outline"
                    onClick={() => setNewPhases([])}
                    disabled={saving}
                  >
                    Clear All
                  </Button>
                  <Button
                    onClick={handleSavePhases}
                    disabled={saving}
                    className="bg-indigo-600 hover:bg-indigo-700"
                  >
                    {saving ? (
                      <>
                        <Clock className="h-4 w-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Save Phases ({newPhases.length})
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}

            {/* Empty State */}
            {phases.length === 0 && newPhases.length === 0 && (
              <div className="text-center py-8">
                <Target className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  No phases defined
                </h3>
                <p className="text-slate-600 mb-4">
                  Break down this project into manageable phases to track
                  progress effectively
                </p>
                <Button onClick={addNewPhase}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add First Phase
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
