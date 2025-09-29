"use client";

import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Clock, CheckCircle, Target } from "lucide-react";
import type { ProjectPhase } from "@/lib/supabase";

interface PhaseItemProps {
  phase: ProjectPhase;
  onToggle: (phaseId: string, currentStatus: boolean) => void;
  isSaving: boolean;
  isParent?: boolean;
  progress?: number;
}

export function PhaseItem({
  phase,
  onToggle,
  isSaving,
  isParent = false,
  progress,
}: PhaseItemProps) {
  return (
    <div className="flex items-start gap-4">
      <Checkbox
        id={`phase-${phase.id}`}
        checked={phase.is_completed}
        onCheckedChange={() => onToggle(phase.id, phase.is_completed)}
        disabled={isSaving}
        className="mt-1"
      />

      <div className="grid gap-1.5 flex-1">
        <div className="flex items-center gap-2">
          <label
            htmlFor={`phase-${phase.id}`}
            className={`text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${
              isParent ? "font-bold text-base" : "font-medium"
            }`}
          >
            {phase.phase_name}
          </label>

          {isParent && progress !== undefined && (
            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
              {progress}% complete
            </span>
          )}
        </div>

        {phase.phase_description && (
          <p className="text-sm text-slate-500">{phase.phase_description}</p>
        )}

        <div className="flex items-center gap-4 text-xs text-slate-500">
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
        </div>
      </div>

      <div className="flex items-center gap-2 text-sm">
        {phase.is_completed ? (
          <CheckCircle className="h-4 w-4 text-green-600" />
        ) : (
          <Clock className="h-4 w-4 text-slate-500" />
        )}
        <span className="text-xs">
          {phase.is_completed ? "Done" : "Pending"}
        </span>
      </div>
    </div>
  );
}
