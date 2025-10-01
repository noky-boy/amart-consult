"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Building2, Plus, Eye, Edit } from "lucide-react";
import type { Project, Client } from "@/lib/supabase";
import { getStatusColor } from "@/lib/utils";

interface RecentProjectsCardProps {
  projects: (Project & { client: Client })[];
}

export function RecentProjectsCard({ projects }: RecentProjectsCardProps) {
  return (
    <Card>
      <CardHeader className="flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
        <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
          <Building2 className="h-4 w-4 sm:h-5 sm:w-5" />
          <span>Recent Projects</span>
        </CardTitle>
        <Button size="sm" asChild className="w-full sm:w-auto">
          <Link href="/admin/projects/add">
            <Plus className="h-4 w-4 mr-1" />
            Add Project
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        {projects.length > 0 ? (
          <div className="space-y-3 sm:space-y-4">
            {projects.map((project) => (
              <div
                key={project.id}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 sm:p-4 border border-slate-200 rounded-lg gap-3 sm:gap-0"
              >
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-slate-900 truncate">
                    {project.project_title}
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-600 truncate">
                    Client: {project.client.first_name}{" "}
                    {project.client.last_name}
                  </p>
                  <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mt-2">
                    <Badge
                      className={`${getStatusColor(project.status)} text-xs`}
                    >
                      {project.status}
                    </Badge>
                    <Badge variant="outline" className="capitalize text-xs">
                      {project.project_type}
                    </Badge>
                  </div>
                </div>
                <div className="flex gap-2 justify-end sm:justify-start">
                  <Button size="sm" variant="ghost" asChild>
                    <Link href={`/admin/projects/${project.id}`}>
                      <Eye className="h-4 w-4" />
                      <span className="sr-only">View</span>
                    </Link>
                  </Button>
                  <Button size="sm" variant="ghost" asChild>
                    <Link href={`/admin/projects/${project.id}/edit`}>
                      <Edit className="h-4 w-4" />
                      <span className="sr-only">Edit</span>
                    </Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 sm:py-8">
            <Building2 className="h-10 w-10 sm:h-12 sm:w-12 text-slate-400 mx-auto mb-3" />
            <h3 className="text-base sm:text-lg font-semibold text-slate-900">
              No projects yet
            </h3>
            <p className="text-sm text-slate-600 mb-4">
              Create your first project
            </p>
            <Button asChild className="w-full sm:w-auto">
              <Link href="/admin/projects/add">
                <Plus className="h-4 w-4 mr-2" />
                Add First Project
              </Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
