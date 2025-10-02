"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  ChevronDown,
  ChevronRight,
  GripVertical,
  Plus,
  Clock,
  Target,
} from "lucide-react";
import { PhaseActions } from "./PhaseActions";
import type { PhaseWithChildren, ProjectPhase } from "@/lib/supabase";
import { getPhaseStatus, getStatusColorClasses } from "@/lib/phase-helpers";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface SortablePhaseItemProps {
  phase: PhaseWithChildren;
  isExpanded: boolean;
  onToggle: (id: string, status: boolean, parentId?: string | null) => void;
  onToggleExpand: (id: string) => void;
  onEdit: (phase: ProjectPhase) => void;
  onDelete: (id: string, name: string) => void;
  onDuplicate: (id: string, name: string) => void;
  onAddSubTask: (id: string, name: string) => void;
  isSaving: boolean;
  children: ProjectPhase[];
}

export function SortablePhaseItem({
  phase,
  isExpanded,
  onToggle,
  onToggleExpand,
  onEdit,
  onDelete,
  onDuplicate,
  onAddSubTask,
  isSaving,
  children,
}: SortablePhaseItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: phase.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const hasChildren = children.length > 0;
  const parentStatus = getPhaseStatus(phase, children);

  return (
    <div ref={setNodeRef} style={style} className="space-y-2">
      {/* Parent Phase Card */}
      <div className="flex flex-col sm:flex-row sm:items-start gap-2 p-3 sm:p-4 border rounded-lg bg-slate-50">
        {/* Mobile: Top row with drag handle, expand, and actions */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          {/* Drag Handle */}
          <button
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing hover:bg-slate-200 rounded p-1 transition-colors flex-shrink-0"
            aria-label="Drag to reorder"
          >
            <GripVertical className="h-4 w-4 text-slate-400" />
          </button>

          {/* Expand/Collapse Button */}
          {hasChildren && (
            <button
              onClick={() => onToggleExpand(phase.id)}
              className="hover:bg-slate-200 rounded p-1 transition-colors flex-shrink-0"
            >
              {isExpanded ? (
                <ChevronDown className="h-4 w-4 text-slate-600" />
              ) : (
                <ChevronRight className="h-4 w-4 text-slate-600" />
              )}
            </button>
          )}

          <div className="flex-1 sm:hidden" />

          {/* Mobile Actions */}
          <div className="flex gap-1 sm:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onAddSubTask(phase.id, phase.phase_name)}
              disabled={isSaving}
              title="Add sub-task"
            >
              <Plus className="h-4 w-4" />
            </Button>
            <PhaseActions
              phaseId={phase.id}
              phaseName={phase.phase_name}
              onEdit={() => onEdit(phase)}
              onDelete={() => onDelete(phase.id, phase.phase_name)}
              onDuplicate={() => onDuplicate(phase.id, phase.phase_name)}
              disabled={isSaving}
            />
          </div>
        </div>

        {/* Phase Content */}
        <div className="flex-1 min-w-0 w-full">
          <div className="flex items-start gap-3">
            <Checkbox
              id={`phase-${phase.id}`}
              checked={phase.is_completed}
              onCheckedChange={() =>
                onToggle(phase.id, phase.is_completed, null)
              }
              disabled={isSaving || hasChildren}
              className="mt-1 flex-shrink-0"
            />

            <div className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                <h4
                  className={`font-semibold text-sm sm:text-base ${
                    phase.is_completed
                      ? "line-through text-slate-500"
                      : "text-slate-900"
                  }`}
                >
                  {phase.phase_name}
                </h4>
                <Badge
                  variant="outline"
                  className={`text-xs w-fit ${getStatusColorClasses(
                    parentStatus
                  )}`}
                >
                  {parentStatus}
                </Badge>
              </div>

              {phase.phase_description && (
                <p className="text-xs sm:text-sm text-slate-600 mb-2">
                  {phase.phase_description}
                </p>
              )}

              <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs text-slate-500">
                {phase.estimated_duration && (
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {phase.estimated_duration}
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <Target className="h-3 w-3" />
                  Weight: {phase.phase_weight}
                </span>
                {hasChildren && (
                  <span className="font-medium">
                    {children.filter((c) => c.is_completed).length} /{" "}
                    {children.length} subtasks
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Desktop Actions */}
        <div className="hidden sm:flex gap-1 flex-shrink-0">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onAddSubTask(phase.id, phase.phase_name)}
            disabled={isSaving}
            title="Add sub-task"
          >
            <Plus className="h-4 w-4" />
          </Button>
          <PhaseActions
            phaseId={phase.id}
            phaseName={phase.phase_name}
            onEdit={() => onEdit(phase)}
            onDelete={() => onDelete(phase.id, phase.phase_name)}
            onDuplicate={() => onDuplicate(phase.id, phase.phase_name)}
            disabled={isSaving}
          />
        </div>
      </div>

      {/* Child Phases */}
      {hasChildren && isExpanded && (
        <div className="ml-6 sm:ml-8 space-y-2 border-l-2 border-slate-200 pl-3 sm:pl-4">
          {children.map((child) => {
            const childStatus = getPhaseStatus(child, undefined, parentStatus);

            return (
              <div
                key={child.id}
                className="flex flex-col sm:flex-row sm:items-start gap-2 p-3 border rounded-lg bg-white"
              >
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <Checkbox
                    id={`phase-${child.id}`}
                    checked={child.is_completed}
                    onCheckedChange={() =>
                      onToggle(child.id, child.is_completed, phase.id)
                    }
                    disabled={isSaving}
                    className="mt-1 flex-shrink-0"
                  />

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-1">
                      <h5
                        className={`font-medium text-xs sm:text-sm ${
                          child.is_completed
                            ? "line-through text-slate-500"
                            : "text-slate-900"
                        }`}
                      >
                        {child.phase_name}
                      </h5>
                      <Badge
                        variant="outline"
                        className={`text-xs w-fit ${getStatusColorClasses(
                          childStatus
                        )}`}
                      >
                        {childStatus}
                      </Badge>
                    </div>

                    {child.phase_description && (
                      <p className="text-xs text-slate-600 mb-1">
                        {child.phase_description}
                      </p>
                    )}

                    <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs text-slate-500">
                      {child.estimated_duration && (
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {child.estimated_duration}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Target className="h-3 w-3" />
                        Weight: {child.phase_weight}
                      </span>
                      {child.completed_date && (
                        <span className="text-green-600">
                          Completed:{" "}
                          {new Date(child.completed_date).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex gap-1 sm:flex-shrink-0 justify-end sm:justify-start">
                  <PhaseActions
                    phaseId={child.id}
                    phaseName={child.phase_name}
                    onEdit={() => onEdit(child)}
                    onDelete={() => onDelete(child.id, child.phase_name)}
                    onDuplicate={() => onDuplicate(child.id, child.phase_name)}
                    disabled={isSaving}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
