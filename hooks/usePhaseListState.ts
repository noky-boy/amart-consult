// hooks/usePhaseListState.ts
"use client";

import { useState, useEffect } from "react";
import type { PhaseWithChildren, ProjectPhase } from "@/lib/supabase";
import { PhaseFormData } from "@/app/admin/projects/[id]/phases/components/PhaseDialog";

interface UsePhaseListStateProps {
  phases: PhaseWithChildren[];
  onUpdate: (phaseId: string, data: PhaseFormData) => Promise<void>;
  onDelete: (phaseId: string) => Promise<void>;
  onDuplicate: (phaseId: string, newName: string) => void;
  onAddSubTask: (parentPhaseId: string, data: any) => Promise<void>;
}

export function usePhaseListState({
  phases,
  onUpdate,
  onDelete,
  onDuplicate,
  onAddSubTask,
}: UsePhaseListStateProps) {
  const [expandedPhases, setExpandedPhases] = useState<Set<string>>(new Set());
  const [editingPhase, setEditingPhase] = useState<ProjectPhase | null>(null);
  const [showAddParentDialog, setShowAddParentDialog] = useState(false);
  const [addingSubTaskTo, setAddingSubTaskTo] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [localPhases, setLocalPhases] = useState<PhaseWithChildren[]>(phases);

  // Update local state when props change
  useEffect(() => {
    setLocalPhases(phases);
  }, [phases]);

  const toggleExpand = (phaseId: string) => {
    setExpandedPhases((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(phaseId)) {
        newSet.delete(phaseId);
      } else {
        newSet.add(phaseId);
      }
      return newSet;
    });
  };

  const handleEdit = (phase: ProjectPhase) => {
    setEditingPhase(phase);
  };

  const handleDelete = async (phaseId: string, phaseName: string) => {
    if (
      confirm(
        `Are you sure you want to delete "${phaseName}"? This will also delete all sub-tasks.`
      )
    ) {
      await onDelete(phaseId);
    }
  };

  const handleDuplicate = (phaseId: string, phaseName: string) => {
    const newName = prompt(
      `Enter new name for duplicated phase:`,
      `${phaseName} (Copy)`
    );
    if (newName && newName.trim()) {
      onDuplicate(phaseId, newName.trim());
    }
  };

  const handleSaveEdit = async (data: PhaseFormData) => {
    if (editingPhase) {
      await onUpdate(editingPhase.id, data);
      setEditingPhase(null);
    }
  };

  const handleAddSubTask = async (data: any) => {
    if (addingSubTaskTo) {
      await onAddSubTask(addingSubTaskTo.id, data);
      setAddingSubTaskTo(null);
    }
  };

  return {
    expandedPhases,
    editingPhase,
    showAddParentDialog,
    addingSubTaskTo,
    localPhases,
    setLocalPhases,
    toggleExpand,
    handleEdit,
    handleDelete,
    handleDuplicate,
    handleSaveEdit,
    handleAddSubTask,
    setEditingPhase,
    setShowAddParentDialog,
    setAddingSubTaskTo,
  };
}
