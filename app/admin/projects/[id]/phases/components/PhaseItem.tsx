"use client";

import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Clock, CheckCircle } from "lucide-react";
import type { ProjectPhase } from "@/lib/supabase";

interface PhaseItemProps {
  phase: ProjectPhase;
  onToggle: (phaseId: string, currentStatus: boolean) => void;
  isSaving: boolean;
}

export function PhaseItem({ phase, onToggle, isSaving }: PhaseItemProps) {
  return (
    <div
      className={`flex items-start gap-4 p-4 border rounded-lg transition-colors ${
        phase.is_completed ? "bg-slate-50" : "bg-white"
      }`}
    >
      <Checkbox
        id={`phase-${phase.id}`}
        checked={phase.is_completed}
        onCheckedChange={() => onToggle(phase.id, phase.is_completed)}
        disabled={isSaving}
        className="mt-1"
      />
      <div className="grid gap-1.5 flex-1">
        <label
          htmlFor={`phase-${phase.id}`}
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          {phase.phase_name}
        </label>
        {phase.phase_description && (
          <p className="text-sm text-slate-500">{phase.phase_description}</p>
        )}
      </div>
      <div className="flex items-center gap-2 text-sm">
        {phase.is_completed ? (
          <CheckCircle className="h-4 w-4 text-green-600" />
        ) : (
          <Clock className="h-4 w-4 text-slate-500" />
        )}
        <span>{phase.is_completed ? "Completed" : "Pending"}</span>
      </div>
    </div>
  );
}
