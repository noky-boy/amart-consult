"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import type { Project } from "@/lib/supabase";

interface PhaseHeaderProps {
  project: Project | null;
}

export function PhaseHeader({ project }: PhaseHeaderProps) {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
      <div className="px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href={`/admin/projects/${project?.id}`}>
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Project
            </Button>
          </Link>
          <div className="h-6 w-px bg-slate-300" />
          <div>
            <h1 className="text-xl font-semibold text-slate-900">
              Project Phases
            </h1>
            <p className="text-sm text-slate-500">{project?.project_title}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
