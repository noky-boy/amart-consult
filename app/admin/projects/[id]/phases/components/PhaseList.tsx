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
import { Loader2, Plus, ListChecks } from "lucide-react";
import { PhaseItem } from "./PhaseItem";
import type { ProjectPhase } from "@/lib/supabase";

interface PhaseListProps {
  phases: ProjectPhase[];
  onToggle: (phaseId: string, currentStatus: boolean) => void;
  onGenerate: () => void;
  isSaving: boolean;
}

export function PhaseList({
  phases,
  onToggle,
  onGenerate,
  isSaving,
}: PhaseListProps) {
  return (
    <Card className="border-0 shadow-sm">
      <CardHeader>
        <CardTitle>Phase Checklist</CardTitle>
        <CardDescription>
          Mark each phase as complete as the project progresses.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {phases.length > 0 ? (
          <div className="space-y-4">
            {phases.map((phase) => (
              <PhaseItem
                key={phase.id}
                phase={phase}
                onToggle={onToggle}
                isSaving={isSaving}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <ListChecks className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              No Phases Defined
            </h3>
            <p className="text-slate-600 mb-4">
              Get started by generating the standard 10-phase construction
              checklist.
            </p>
            <Button onClick={onGenerate} disabled={isSaving}>
              {isSaving ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Plus className="mr-2 h-4 w-4" />
              )}
              Generate Default Phases
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
