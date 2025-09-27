// amart-consult/components/dashboard/ProjectTimeline.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";
import { getMilestoneStatusColor } from "@/lib/dashboardUtils";
import type { ProjectMilestone } from "@/lib/supabase";

type ProjectTimelineProps = {
  milestones: ProjectMilestone[];
};

export default function ProjectTimeline({ milestones }: ProjectTimelineProps) {
  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Clock className="h-5 w-5 text-indigo-600" />
          <span>Project Timeline</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {milestones.length > 0 ? (
          <div className="relative">
            <div className="absolute left-2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-indigo-500 to-purple-500"></div>
            <div className="space-y-8 ml-6">
              {milestones.map((milestone) => (
                <div key={milestone.id} className="relative flex items-start">
                  <div
                    className={`absolute -left-8 top-1 h-4 w-4 rounded-full border-4 border-white shadow-lg z-10 ${getMilestoneStatusColor(
                      milestone.status
                    )} ${
                      milestone.status === "in-progress" ? "animate-pulse" : ""
                    }`}
                  ></div>
                  <div
                    className={`flex-1 p-4 rounded-lg border w-full ${
                      milestone.status === "completed"
                        ? "bg-green-50 border-green-200"
                        : "bg-slate-50 border-slate-200"
                    }`}
                  >
                    <h3 className="font-semibold text-slate-800">
                      {milestone.title}
                    </h3>
                    {milestone.description && (
                      <p className="text-sm mt-1 text-slate-600">
                        {milestone.description}
                      </p>
                    )}
                    <div className="flex items-center justify-between mt-2">
                      <Badge
                        variant={
                          milestone.status === "completed"
                            ? "default"
                            : "outline"
                        }
                        className="text-xs capitalize"
                      >
                        {milestone.status.replace("-", " ")}
                      </Badge>
                      {milestone.due_date && (
                        <p className="text-xs text-slate-500">
                          Due:{" "}
                          {new Date(milestone.due_date).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <Clock className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              No Timeline Available
            </h3>
            <p className="text-slate-600">
              Your project timeline will appear here once milestones are
              defined.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
