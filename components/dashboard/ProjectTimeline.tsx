// amart-consult/components/dashboard/ProjectTimeline.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, CheckCircle, Circle } from "lucide-react";
import type { ProjectPhase } from "@/lib/supabase";

type ProjectTimelineProps = {
  phases: ProjectPhase[];
};

export default function ProjectTimeline({ phases }: ProjectTimelineProps) {
  const sortedPhases = phases.sort((a, b) => a.phase_order - b.phase_order);

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Clock className="h-5 w-5 text-indigo-600" />
          <span>Project Timeline</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {sortedPhases.length > 0 ? (
          <div className="relative">
            <div className="absolute left-2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-indigo-500 to-purple-500"></div>
            <div className="space-y-8 ml-6">
              {sortedPhases.map((phase, index) => (
                <div key={phase.id} className="relative flex items-start">
                  <div
                    className={`absolute -left-8 top-1 h-4 w-4 rounded-full border-4 border-white shadow-lg z-10 ${
                      phase.is_completed
                        ? "bg-green-500"
                        : index === 0 || sortedPhases[index - 1]?.is_completed
                        ? "bg-blue-500 animate-pulse"
                        : "bg-slate-300"
                    }`}
                  ></div>
                  <div
                    className={`flex-1 p-4 rounded-lg border w-full ${
                      phase.is_completed
                        ? "bg-green-50 border-green-200"
                        : index === 0 || sortedPhases[index - 1]?.is_completed
                        ? "bg-blue-50 border-blue-200"
                        : "bg-slate-50 border-slate-200"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <h3 className="font-semibold text-slate-800 flex items-center">
                        {phase.is_completed ? (
                          <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                        ) : (
                          <Circle className="h-4 w-4 text-slate-400 mr-2" />
                        )}
                        Phase {phase.phase_order}: {phase.phase_name}
                      </h3>
                      <Badge
                        variant={phase.is_completed ? "default" : "outline"}
                        className={`text-xs capitalize ${
                          phase.is_completed
                            ? "bg-green-100 text-green-700 border-green-200"
                            : index === 0 ||
                              sortedPhases[index - 1]?.is_completed
                            ? "bg-blue-100 text-blue-700 border-blue-200"
                            : "bg-slate-100 text-slate-600 border-slate-200"
                        }`}
                      >
                        {phase.is_completed
                          ? "Completed"
                          : index === 0 || sortedPhases[index - 1]?.is_completed
                          ? "In Progress"
                          : "Pending"}
                      </Badge>
                    </div>

                    {phase.phase_description && (
                      <p className="text-sm mt-2 text-slate-600">
                        {phase.phase_description}
                      </p>
                    )}

                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-200">
                      <div className="flex items-center space-x-4 text-xs text-slate-500">
                        {phase.estimated_duration && (
                          <span>Duration: {phase.estimated_duration}</span>
                        )}
                        {phase.completed_date && (
                          <span>
                            Completed:{" "}
                            {new Date(
                              phase.completed_date
                            ).toLocaleDateString()}
                          </span>
                        )}
                      </div>

                      {phase.is_completed && (
                        <div className="flex items-center text-green-600 text-xs">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Phase Complete
                        </div>
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
              Your project timeline will appear here once phases are defined.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
