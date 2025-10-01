"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp } from "lucide-react";
import { getStatusColor } from "@/lib/utils";

interface ProjectStatusBreakdownProps {
  statusCounts: Record<string, number>;
  totalProjects: number;
}

export function ProjectStatusBreakdown({
  statusCounts,
  totalProjects,
}: ProjectStatusBreakdownProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
          <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5" />
          <span>Project Status Breakdown</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {Object.keys(statusCounts).length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {Object.entries(statusCounts).map(([status, count]) => (
              <div
                key={status}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 sm:p-4 border border-slate-200 rounded-lg gap-2 sm:gap-0"
              >
                <div className="flex items-center gap-2 sm:gap-3">
                  <Badge className={`${getStatusColor(status)} text-xs`}>
                    {status}
                  </Badge>
                  <span className="text-xs sm:text-sm text-slate-600">
                    {count} project{count !== 1 ? "s" : ""}
                  </span>
                </div>
                <div className="w-full sm:w-16 bg-slate-200 rounded-full h-2">
                  <div
                    className="bg-indigo-600 h-2 rounded-full transition-all"
                    style={{
                      width:
                        totalProjects > 0
                          ? `${(count / totalProjects) * 100}%`
                          : "0%",
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 sm:py-8">
            <TrendingUp className="h-10 w-10 sm:h-12 sm:w-12 text-slate-400 mx-auto mb-3" />
            <p className="text-sm text-slate-600">No project data available</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
