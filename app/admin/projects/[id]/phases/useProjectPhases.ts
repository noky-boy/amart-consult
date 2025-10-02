"use client";

import { useState, useEffect, useMemo } from "react";
import { projectService, phaseService } from "@/lib/supabase";
import type {
  Project,
  ProjectPhase,
  PhaseWithChildren,
  CreatePhaseInput,
} from "@/lib/supabase";
import { constructionPhaseTemplate } from "@/lib/phase-templates";

export function useProjectPhases(projectId: string) {
  const [project, setProject] = useState<Project | null>(null);
  const [phases, setPhases] = useState<PhaseWithChildren[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  const fetchData = async () => {
    if (!projectId) return;
    try {
      setLoading(true);
      const [projectData, phasesData] = await Promise.all([
        projectService.getById(projectId),
        phaseService.getByProjectIdHierarchical(projectId),
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

  useEffect(() => {
    fetchData();
  }, [projectId]);

  // Weighted progress calculation
  const progress = useMemo(() => {
    if (phases.length === 0) {
      return { completed: 0, total: 0, percentage: 0, weightedScore: 0 };
    }

    let totalWeight = 0;
    let completedWeight = 0;
    let totalTaskCount = 0;
    let completedTaskCount = 0;

    phases.forEach((parent) => {
      totalWeight += parent.phase_weight;

      if (parent.children && parent.children.length > 0) {
        parent.children.forEach((child) => {
          totalTaskCount++;
          if (child.is_completed) {
            completedWeight += child.phase_weight;
            completedTaskCount++;
          }
        });
      } else {
        totalTaskCount++;
        if (parent.is_completed) {
          completedWeight += parent.phase_weight;
          completedTaskCount++;
        }
      }
    });

    const percentage =
      totalWeight > 0 ? Math.round((completedWeight / totalWeight) * 100) : 0;

    return {
      completed: completedTaskCount,
      total: totalTaskCount,
      percentage,
      weightedScore: Math.round(completedWeight * 10) / 10,
    };
  }, [phases]);

  const togglePhaseCompletion = async (
    phaseId: string,
    currentStatus: boolean,
    parentPhaseId?: string | null
  ) => {
    setIsSaving(true);
    try {
      if (parentPhaseId) {
        await phaseService.toggleChildPhase(
          phaseId,
          !currentStatus,
          parentPhaseId
        );
      } else {
        await phaseService.toggleParentPhase(phaseId, !currentStatus);
      }
      await fetchData();
    } catch (err) {
      console.error("Failed to update phase:", err);
      setError("Failed to update phase status. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const generateDefaultPhases = async () => {
    if (!projectId) return;
    setIsSaving(true);
    try {
      const phasesToCreate: CreatePhaseInput[] = [];
      let orderCounter = 1;

      constructionPhaseTemplate.forEach((template) => {
        const parentOrder = orderCounter++;
        phasesToCreate.push({
          project_id: projectId,
          phase_name: template.phase_name,
          phase_description: template.description || null,
          estimated_duration: template.estimated_duration || null,
          phase_order: parentOrder,
          is_completed: false,
          parent_phase_id: null,
          phase_weight: template.phase_weight,
        });
      });

      const createdParents = await phaseService.createMultipleHierarchical(
        phasesToCreate
      );
      const childrenToCreate: CreatePhaseInput[] = [];

      constructionPhaseTemplate.forEach((template, templateIndex) => {
        const parent = createdParents[templateIndex];

        if (template.sub_tasks && template.sub_tasks.length > 0) {
          template.sub_tasks.forEach((subTask) => {
            childrenToCreate.push({
              project_id: projectId,
              phase_name: subTask.phase_name,
              phase_description: subTask.description || null,
              estimated_duration: subTask.estimated_duration || null,
              phase_order: orderCounter++,
              is_completed: false,
              parent_phase_id: parent.id,
              phase_weight: subTask.phase_weight,
            });
          });
        }
      });

      if (childrenToCreate.length > 0) {
        await phaseService.createMultipleHierarchical(childrenToCreate);
      }

      await fetchData();
    } catch (err) {
      console.error("Failed to generate phases:", err);
      setError("An error occurred while creating the default project phases.");
    } finally {
      setIsSaving(false);
    }
  };

  const addParentPhase = async (data: {
    phase_name: string;
    phase_description?: string;
    estimated_duration?: string;
    phase_weight: number;
  }) => {
    setIsSaving(true);
    try {
      await phaseService.createParentPhase(projectId, data);
      await fetchData();
    } catch (err) {
      console.error("Failed to add parent phase:", err);
      setError("Failed to add phase. Please try again.");
      throw err;
    } finally {
      setIsSaving(false);
    }
  };

  const addSubTask = async (
    parentPhaseId: string,
    data: {
      phase_name: string;
      phase_description?: string;
      estimated_duration?: string;
      phase_weight: number;
    }
  ) => {
    setIsSaving(true);
    try {
      await phaseService.createSubTask(projectId, parentPhaseId, data);
      await fetchData();
    } catch (err) {
      console.error("Failed to add sub-task:", err);
      setError("Failed to add sub-task. Please try again.");
      throw err;
    } finally {
      setIsSaving(false);
    }
  };

  const updatePhase = async (
    phaseId: string,
    data: {
      phase_name?: string;
      phase_description?: string;
      estimated_duration?: string;
      phase_weight?: number;
    }
  ) => {
    setIsSaving(true);
    try {
      await phaseService.updatePhase(phaseId, data);
      await fetchData();
    } catch (err) {
      console.error("Failed to update phase:", err);
      setError("Failed to update phase. Please try again.");
      throw err;
    } finally {
      setIsSaving(false);
    }
  };

  const deletePhase = async (phaseId: string) => {
    setIsSaving(true);
    try {
      await phaseService.deletePhase(phaseId);
      await fetchData();
    } catch (err) {
      console.error("Failed to delete phase:", err);
      setError("Failed to delete phase. Please try again.");
      throw err;
    } finally {
      setIsSaving(false);
    }
  };

  const duplicatePhase = async (phaseId: string, newPhaseName: string) => {
    setIsSaving(true);
    try {
      const maxOrder = Math.max(...phases.map((p) => p.phase_order), 0);
      await phaseService.duplicatePhase(phaseId, newPhaseName, maxOrder + 1);
      await fetchData();
    } catch (err) {
      console.error("Failed to duplicate phase:", err);
      setError("Failed to duplicate phase. Please try again.");
      throw err;
    } finally {
      setIsSaving(false);
    }
  };

  // NEW: Reorder parent phases
  const reorderPhases = async (reorderedPhases: PhaseWithChildren[]) => {
    setIsSaving(true);
    try {
      // Create update payload with new order
      const updates = reorderedPhases.map((phase, index) => ({
        id: phase.id,
        phase_order: index + 1,
      }));

      // Update in database
      await phaseService.reorderParentPhases(updates);

      // Refresh data from server
      await fetchData();
    } catch (err) {
      console.error("Failed to reorder phases:", err);
      setError("Failed to reorder phases. Please try again.");
      throw err;
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
    addParentPhase,
    addSubTask,
    updatePhase,
    deletePhase,
    duplicatePhase,
    reorderPhases, // NEW
  };
}
