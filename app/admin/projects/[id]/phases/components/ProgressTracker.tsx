"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface ProgressTrackerProps {
  progress: {
    completed: number;
    total: number;
    percentage: number;
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
        <p className="text-xs text-slate-500 mt-2">
          Completed <strong>{progress.completed}</strong> of{" "}
          <strong>{progress.total}</strong> phases.
        </p>
      </CardContent>
    </Card>
  );
}
