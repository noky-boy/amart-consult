"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Loader2,
  Plus,
  ListChecks,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { PhaseItem } from "./PhaseItem";
import { PhaseActions } from "./PhaseActions";
import { PhaseDialog, PhaseFormData } from "./PhaseDialog";
import { AddSubTaskDialog } from "./AddSubTaskDialog";
import type { PhaseWithChildren, ProjectPhase } from "@/lib/supabase";

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
  isSaving,
}: PhaseListProps) {
  const [expandedPhases, setExpandedPhases] = useState<Set<string>>(new Set());
  const [editingPhase, setEditingPhase] = useState<ProjectPhase | null>(null);
  const [showAddParentDialog, setShowAddParentDialog] = useState(false);
  const [addingSubTaskTo, setAddingSubTaskTo] = useState<{
    id: string;
    name: string;
  } | null>(null);

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

  return (
    <>
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Phase Checklist</CardTitle>
              <CardDescription>
                Mark each phase as complete as the project progresses. Parent
                phases automatically update based on subtasks.
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => setShowAddParentDialog(true)}
                disabled={isSaving}
                size="sm"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Phase
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {phases.length > 0 ? (
            <div className="space-y-2">
              {phases.map((phase) => {
                const isExpanded = expandedPhases.has(phase.id);
                const hasChildren = phase.children && phase.children.length > 0;

                return (
                  <div key={phase.id} className="space-y-2">
                    <div className="flex items-start gap-2 p-4 border rounded-lg bg-slate-50">
                      {hasChildren && (
                        <button
                          onClick={() => toggleExpand(phase.id)}
                          className="mt-1 hover:bg-slate-200 rounded p-1 transition-colors"
                        >
                          {isExpanded ? (
                            <ChevronDown className="h-4 w-4 text-slate-600" />
                          ) : (
                            <ChevronRight className="h-4 w-4 text-slate-600" />
                          )}
                        </button>
                      )}

                      <div className="flex-1">
                        <PhaseItem
                          phase={phase}
                          onToggle={(id, status) => onToggle(id, status, null)}
                          isSaving={isSaving}
                          isParent={true}
                          progress={phase.progress}
                        />
                      </div>

                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            setAddingSubTaskTo({
                              id: phase.id,
                              name: phase.phase_name,
                            })
                          }
                          disabled={isSaving}
                          title="Add sub-task"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                        <PhaseActions
                          phaseId={phase.id}
                          phaseName={phase.phase_name}
                          onEdit={() => handleEdit(phase)}
                          onDelete={() =>
                            handleDelete(phase.id, phase.phase_name)
                          }
                          onDuplicate={() =>
                            handleDuplicate(phase.id, phase.phase_name)
                          }
                          disabled={isSaving}
                        />
                      </div>
                    </div>

                    {hasChildren && isExpanded && (
                      <div className="ml-8 space-y-2 border-l-2 border-slate-200 pl-4">
                        {phase.children!.map((child) => (
                          <div
                            key={child.id}
                            className="flex items-start gap-2 p-3 border rounded-lg bg-white"
                          >
                            <div className="flex-1">
                              <PhaseItem
                                phase={child}
                                onToggle={(id, status) =>
                                  onToggle(id, status, phase.id)
                                }
                                isSaving={isSaving}
                                isParent={false}
                              />
                            </div>
                            <PhaseActions
                              phaseId={child.id}
                              phaseName={child.phase_name}
                              onEdit={() => handleEdit(child)}
                              onDelete={() =>
                                handleDelete(child.id, child.phase_name)
                              }
                              onDuplicate={() =>
                                handleDuplicate(child.id, child.phase_name)
                              }
                              disabled={isSaving}
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <ListChecks className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                No Phases Defined
              </h3>
              <p className="text-slate-600 mb-4">
                Get started by generating the standard construction phase
                checklist or add custom phases.
              </p>
              <div className="flex gap-2 justify-center">
                <Button onClick={onGenerate} disabled={isSaving}>
                  {isSaving ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Plus className="mr-2 h-4 w-4" />
                  )}
                  Generate Default Phases
                </Button>
                <Button
                  onClick={() => setShowAddParentDialog(true)}
                  variant="outline"
                  disabled={isSaving}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Custom Phase
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Parent Phase Dialog */}
      <PhaseDialog
        open={showAddParentDialog}
        onOpenChange={setShowAddParentDialog}
        onSave={onAddParent}
        isParentPhase={true}
      />

      {/* Edit Phase Dialog */}
      <PhaseDialog
        open={!!editingPhase}
        onOpenChange={(open) => !open && setEditingPhase(null)}
        onSave={handleSaveEdit}
        phase={editingPhase}
        isParentPhase={!editingPhase?.parent_phase_id}
      />

      {/* Add Sub-task Dialog */}
      <AddSubTaskDialog
        open={!!addingSubTaskTo}
        onOpenChange={(open) => !open && setAddingSubTaskTo(null)}
        onSave={handleAddSubTask}
        parentPhaseName={addingSubTaskTo?.name || ""}
      />
    </>
  );
}
