"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Plus, ListChecks } from "lucide-react";

interface EmptyPhaseStateProps {
  onGenerate: () => void;
  onAddCustom: () => void;
  isSaving: boolean;
}

export function EmptyPhaseState({
  onGenerate,
  onAddCustom,
  isSaving,
}: EmptyPhaseStateProps) {
  return (
    <div className="text-center py-12">
      <ListChecks className="h-12 w-12 text-slate-400 mx-auto mb-4" />
      <h3 className="text-lg font-semibold text-slate-900 mb-2">
        No Phases Defined
      </h3>
      <p className="text-slate-600 mb-4 text-sm sm:text-base">
        Get started by generating the standard construction phase checklist or
        add custom phases.
      </p>
      <div className="flex flex-col sm:flex-row gap-2 justify-center">
        <Button
          onClick={onGenerate}
          disabled={isSaving}
          className="w-full sm:w-auto"
        >
          {isSaving ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Plus className="mr-2 h-4 w-4" />
          )}
          Generate Default Phases
        </Button>
        <Button
          onClick={onAddCustom}
          variant="outline"
          disabled={isSaving}
          className="w-full sm:w-auto"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Custom Phase
        </Button>
      </div>
    </div>
  );
}
