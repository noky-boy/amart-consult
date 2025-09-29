"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Target } from "lucide-react";

interface ProgressTrackerProps {
  progress: {
    completed: number;
    total: number;
    percentage: number;
    weightedScore: number;
  };
}

export function ProgressTracker({ progress }: ProgressTrackerProps) {
  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Project Progress</CardTitle>
        <span className="text-sm font-bold text-slate-900">
          {progress.percentage}%
        </span>
      </CardHeader>
      <CardContent>
        <Progress value={progress.percentage} className="w-full" />

        <div className="flex items-center justify-between mt-3 text-xs text-slate-500">
          <p>
            Completed{" "}
            <strong className="text-slate-900">{progress.completed}</strong> of{" "}
            <strong className="text-slate-900">{progress.total}</strong> tasks
          </p>

          <div className="flex items-center gap-1 bg-slate-100 px-2 py-1 rounded">
            <Target className="h-3 w-3" />
            <span>
              Score:{" "}
              <strong className="text-slate-900">
                {progress.weightedScore}
              </strong>{" "}
              / 70
            </span>
          </div>
        </div>

        <div className="mt-2 text-xs text-slate-400">
          Progress calculated based on weighted task completion
        </div>
      </CardContent>
    </Card>
  );
}
