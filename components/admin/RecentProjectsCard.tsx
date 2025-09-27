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
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center space-x-2">
            <Building2 className="h-5 w-5" />
            <span>Recent Projects</span>
          </CardTitle>
        </div>
        <Button size="sm" asChild>
          <Link href="/admin/projects/add">
            <Plus className="h-4 w-4 mr-1" />
            Add Project
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        {projects.length > 0 ? (
          <div className="space-y-4">
            {projects.map((project) => (
              <div
                key={project.id}
                className="flex items-center justify-between p-4 border border-slate-200 rounded-lg"
              >
                <div className="flex-1">
                  <h4 className="font-semibold text-slate-900">
                    {project.project_title}
                  </h4>
                  <p className="text-sm text-slate-600">
                    Client: {project.client.first_name}{" "}
                    {project.client.last_name}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge className={getStatusColor(project.status)}>
                      {project.status}
                    </Badge>
                    <Badge variant="outline" className="capitalize">
                      {project.project_type}
                    </Badge>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button size="sm" variant="ghost" asChild>
                    <Link href={`/admin/projects/${project.id}`}>
                      <Eye className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button size="sm" variant="ghost" asChild>
                    <Link href={`/admin/projects/${project.id}/edit`}>
                      <Edit className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Building2 className="h-12 w-12 text-slate-400 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-slate-900">
              No projects yet
            </h3>
            <p className="text-slate-600 mb-4">Create your first project</p>
            <Button asChild>
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
