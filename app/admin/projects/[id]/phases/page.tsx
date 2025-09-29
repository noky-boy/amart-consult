"use client";

import type React from "react";
import { use } from "react";
import { useProjectPhases } from "./useProjectPhases";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Loader2 } from "lucide-react";
import { PhaseHeader } from "./components/PhaseHeader";
import { ProgressTracker } from "./components/ProgressTracker";
import { PhaseList } from "./components/PhaseList";

export default function ProjectPhasesPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const {
    project,
    phases,
    loading,
    isSaving,
    error,
    progress,
    togglePhaseCompletion,
    generateDefaultPhases,
    duplicatePhase,
  } = useProjectPhases(id);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="h-12 w-12 text-indigo-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <PhaseHeader project={project} />

      <main className="max-w-4xl mx-auto p-6 space-y-6">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <ProgressTracker progress={progress} />

        <PhaseList
          phases={phases}
          onToggle={togglePhaseCompletion}
          onGenerate={generateDefaultPhases}
          onDuplicate={duplicatePhase}
          isSaving={isSaving}
        />
      </main>
    </div>
  );
}
