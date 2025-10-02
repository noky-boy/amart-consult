// components/phases/PhaseList.tsx
"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Plus } from "lucide-react";
import { PhaseDialog, PhaseFormData } from "./PhaseDialog";
import { AddSubTaskDialog } from "./AddSubTaskDialog";
import { SortablePhaseItem } from "./SortablePhaseItem";
import { EmptyPhaseState } from "./EmptyPhaseState";
import { usePhaseListState } from "@/hooks/usePhaseListState";
import type { PhaseWithChildren } from "@/lib/supabase";

// DnD Kit imports
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

interface PhaseListProps {
  phases: PhaseWithChildren[];
  onToggle: (
    phaseId: string,
    currentStatus: boolean,
    parentPhaseId?: string | null
  ) => void;
  onGenerate: () => void;
  onAddParent: (data: PhaseFormData) => Promise<void>;
  onAddSubTask: (parentPhaseId: string, data: any) => Promise<void>;
  onUpdate: (phaseId: string, data: PhaseFormData) => Promise<void>;
  onDelete: (phaseId: string) => Promise<void>;
  onDuplicate: (phaseId: string, newName: string) => void;
  onReorder: (reorderedPhases: PhaseWithChildren[]) => Promise<void>;
  isSaving: boolean;
}

export function PhaseList({
  phases,
  onToggle,
  onGenerate,
  onAddParent,
  onAddSubTask,
  onUpdate,
  onDelete,
  onDuplicate,
  onReorder,
  isSaving,
}: PhaseListProps) {
  const {
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
  } = usePhaseListState({
    phases,
    onUpdate,
    onDelete,
    onDuplicate,
    onAddSubTask,
  });

  // DnD sensors configuration
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    const oldIndex = localPhases.findIndex((p) => p.id === active.id);
    const newIndex = localPhases.findIndex((p) => p.id === over.id);

    // Optimistically update UI
    const reordered = arrayMove(localPhases, oldIndex, newIndex);
    setLocalPhases(reordered);

    // Persist to database
    try {
      await onReorder(reordered);
    } catch (error) {
      console.error("Failed to reorder phases:", error);
      // Revert on error
      setLocalPhases(phases);
    }
  };

  return (
    <>
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <CardTitle className="text-lg sm:text-xl">
                Phase Checklist
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                Mark each phase as complete as the project progresses. Drag
                phases to reorder them.
              </CardDescription>
            </div>
            <Button
              onClick={() => setShowAddParentDialog(true)}
              disabled={isSaving}
              size="sm"
              className="w-full sm:w-auto"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Phase
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          {localPhases.length > 0 ? (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={localPhases.map((p) => p.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-2">
                  {localPhases.map((phase) => (
                    <SortablePhaseItem
                      key={phase.id}
                      phase={phase}
                      isExpanded={expandedPhases.has(phase.id)}
                      onToggle={onToggle}
                      onToggleExpand={toggleExpand}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                      onDuplicate={handleDuplicate}
                      onAddSubTask={(id, name) =>
                        setAddingSubTaskTo({ id, name })
                      }
                      isSaving={isSaving}
                      children={phase.children || []}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          ) : (
            <EmptyPhaseState
              onGenerate={onGenerate}
              onAddCustom={() => setShowAddParentDialog(true)}
              isSaving={isSaving}
            />
          )}
        </CardContent>
      </Card>

      {/* Dialogs */}
      <PhaseDialog
        open={showAddParentDialog}
        onOpenChange={setShowAddParentDialog}
        onSave={onAddParent}
        isParentPhase={true}
      />

      <PhaseDialog
        open={!!editingPhase}
        onOpenChange={(open) => !open && setEditingPhase(null)}
        onSave={handleSaveEdit}
        phase={editingPhase}
        isParentPhase={!editingPhase?.parent_phase_id}
      />

      <AddSubTaskDialog
        open={!!addingSubTaskTo}
        onOpenChange={(open) => !open && setAddingSubTaskTo(null)}
        onSave={handleAddSubTask}
        parentPhaseName={addingSubTaskTo?.name || ""}
      />
    </>
  );
}
