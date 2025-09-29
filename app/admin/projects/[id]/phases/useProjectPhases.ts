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

  useEffect(() => {
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
        // Calculate based on children
        parent.children.forEach((child) => {
          totalTaskCount++;
          if (child.is_completed) {
            completedWeight += child.phase_weight;
            completedTaskCount++;
          }
        });
      } else {
        // Parent has no children, count it directly
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
      weightedScore: Math.round(completedWeight * 10) / 10, // Round to 1 decimal
    };
  }, [phases]);

  const togglePhaseCompletion = async (
    phaseId: string,
    currentStatus: boolean,
    parentPhaseId?: string | null
  ) => {
    setIsSaving(true);
    try {
      let updatedPhases: ProjectPhase[];

      if (parentPhaseId) {
        // It's a child phase
        updatedPhases = await phaseService.toggleChildPhase(
          phaseId,
          !currentStatus,
          parentPhaseId
        );
      } else {
        // It's a parent phase
        updatedPhases = await phaseService.toggleParentPhase(
          phaseId,
          !currentStatus
        );
      }

      // Refresh the hierarchical data
      const freshData = await phaseService.getByProjectIdHierarchical(
        projectId
      );
      setPhases(freshData);
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
        // Create parent phase
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

        // Note: We'll need to create children in a second pass after getting parent IDs
      });

      // First, create all parent phases
      const createdParents = await phaseService.createMultipleHierarchical(
        phasesToCreate
      );

      // Now create children with parent IDs
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

      // Refresh the hierarchical data
      const freshData = await phaseService.getByProjectIdHierarchical(
        projectId
      );
      setPhases(freshData);
    } catch (err) {
      console.error("Failed to generate phases:", err);
      setError("An error occurred while creating the default project phases.");
    } finally {
      setIsSaving(false);
    }
  };

  const duplicatePhase = async (phaseId: string, newPhaseName: string) => {
    setIsSaving(true);
    try {
      // Find the highest phase order to add the new phase at the end
      const maxOrder = Math.max(...phases.map((p) => p.phase_order), 0);

      await phaseService.duplicatePhase(phaseId, newPhaseName, maxOrder + 1);

      // Refresh data
      const freshData = await phaseService.getByProjectIdHierarchical(
        projectId
      );
      setPhases(freshData);
    } catch (err) {
      console.error("Failed to duplicate phase:", err);
      setError("Failed to duplicate phase. Please try again.");
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
    duplicatePhase,
  };
}
