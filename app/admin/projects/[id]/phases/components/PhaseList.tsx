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
  Copy,
} from "lucide-react";
import { PhaseItem } from "./PhaseItem";
import type { PhaseWithChildren } from "@/lib/supabase";

interface PhaseListProps {
  phases: PhaseWithChildren[];
  onToggle: (
    phaseId: string,
    currentStatus: boolean,
    parentPhaseId?: string | null
  ) => void;
  onGenerate: () => void;
  onDuplicate: (phaseId: string, newName: string) => void;
  isSaving: boolean;
}

export function PhaseList({
  phases,
  onToggle,
  onGenerate,
  onDuplicate,
  isSaving,
}: PhaseListProps) {
  const [expandedPhases, setExpandedPhases] = useState<Set<string>>(new Set());

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

  const handleDuplicate = (phaseId: string, phaseName: string) => {
    const newName = prompt(
      `Enter new name for duplicated phase:`,
      `${phaseName} (Copy)`
    );
    if (newName && newName.trim()) {
      onDuplicate(phaseId, newName.trim());
    }
  };

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader>
        <CardTitle>Phase Checklist</CardTitle>
        <CardDescription>
          Mark each phase as complete as the project progresses. Parent phases
          automatically update based on subtasks.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {phases.length > 0 ? (
          <div className="space-y-2">
            {phases.map((phase) => {
              const isExpanded = expandedPhases.has(phase.id);
              const hasChildren = phase.children && phase.children.length > 0;

              return (
                <div key={phase.id} className="space-y-2">
                  {/* Parent Phase */}
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

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        handleDuplicate(phase.id, phase.phase_name)
                      }
                      disabled={isSaving}
                      title="Duplicate this phase"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Child Phases */}
                  {hasChildren && isExpanded && (
                    <div className="ml-8 space-y-2 border-l-2 border-slate-200 pl-4">
                      {phase.children!.map((child) => (
                        <div
                          key={child.id}
                          className="p-3 border rounded-lg bg-white"
                        >
                          <PhaseItem
                            phase={child}
                            onToggle={(id, status) =>
                              onToggle(id, status, phase.id)
                            }
                            isSaving={isSaving}
                            isParent={false}
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
              checklist with weighted progress tracking.
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
