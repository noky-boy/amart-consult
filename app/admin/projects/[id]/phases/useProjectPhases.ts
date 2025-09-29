"use client";

import { useState, useEffect, useMemo } from "react";
import { projectService, phaseService } from "@/lib/supabase";
import type { Project, ProjectPhase } from "@/lib/supabase";
import { constructionPhaseTemplate } from "@/lib/phase-templates";

export function useProjectPhases(projectId: string) {
  const [project, setProject] = useState<Project | null>(null);
  const [phases, setPhases] = useState<ProjectPhase[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      if (!projectId) return;
      try {
        setLoading(true);
        const [projectData, phasesData] = await Promise.all([
          projectService.getById(projectId),
          phaseService.getByProjectId(projectId),
        ]);
        setProject(projectData);
        setPhases(phasesData);
      } catch (err) {
        console.error("Failed to fetch project data:", err);
        setError("Could not load project information. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [projectId]);

  const progress = useMemo(() => {
    const totalPhases = phases.length;
    if (totalPhases === 0) {
      return { completed: 0, total: 0, percentage: 0 };
    }
    const completedPhases = phases.filter((p) => p.is_completed).length;
    const percentage = Math.round((completedPhases / totalPhases) * 100);
    return { completed: completedPhases, total: totalPhases, percentage };
  }, [phases]);

  const togglePhaseCompletion = async (
    phaseId: string,
    currentStatus: boolean
  ) => {
    setIsSaving(true);
    try {
      const updatedPhase = currentStatus
        ? await phaseService.markIncomplete(phaseId)
        : await phaseService.markCompleted(phaseId);

      // Update local state for an immediate UI response
      setPhases((prevPhases) =>
        prevPhases.map((p) => (p.id === phaseId ? updatedPhase : p))
      );
    } catch (err) {
      console.error("Failed to update phase:", err);
      // Optionally revert state on error
    } finally {
      setIsSaving(false);
    }
  };

  const generateDefaultPhases = async () => {
    if (!projectId) return;
    setIsSaving(true);
    try {
      const phasesToCreate = constructionPhaseTemplate.map(
        (template, index) => ({
          project_id: projectId,
          phase_name: template.phase_name,
          phase_description: template.description,
          estimated_duration: template.estimated_duration,
          phase_order: index + 1,
          is_completed: false, // Ensure this is explicitly set
        })
      );

      const newPhases = await phaseService.createMultiple(phasesToCreate);
      setPhases(newPhases);
    } catch (err) {
      console.error("Failed to generate phases:", err);
      setError("An error occurred while creating the default project phases.");
    } finally {
      setIsSaving(false);
    }
  };

  return {
    project,
    phases,
    loading,
    isSaving,
    error,
    progress,
    togglePhaseCompletion,
    generateDefaultPhases,
  };
}
