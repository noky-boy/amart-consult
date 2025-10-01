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
        <CardTitle className="flex items-center space-x-2 text-base sm:text-lg">
          <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-indigo-600" />
          <span>Project Timeline</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {sortedPhases.length > 0 ? (
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-indigo-500 to-purple-500 hidden sm:block"></div>

            <div className="space-y-6 sm:space-y-8 sm:ml-6">
              {sortedPhases.map((phase, index) => (
                <div key={phase.id} className="relative">
                  {/* Timeline Dot - Hidden on mobile */}
                  <div
                    className={`hidden sm:block absolute -left-8 top-1 h-4 w-4 rounded-full border-4 border-white shadow-lg z-10 ${
                      phase.is_completed
                        ? "bg-green-500"
                        : index === 0 || sortedPhases[index - 1]?.is_completed
                        ? "bg-blue-500 animate-pulse"
                        : "bg-slate-300"
                    }`}
                  ></div>

                  {/* Phase Card */}
                  <div
                    className={`p-3 sm:p-4 rounded-lg border w-full ${
                      phase.is_completed
                        ? "bg-green-50 border-green-200"
                        : index === 0 || sortedPhases[index - 1]?.is_completed
                        ? "bg-blue-50 border-blue-200"
                        : "bg-slate-50 border-slate-200"
                    }`}
                  >
                    {/* Header Section */}
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-4 mb-2">
                      <h3 className="font-semibold text-slate-800 flex items-start text-sm sm:text-base min-w-0 flex-1">
                        {phase.is_completed ? (
                          <CheckCircle className="h-4 w-4 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                        ) : (
                          <Circle className="h-4 w-4 text-slate-400 mr-2 flex-shrink-0 mt-0.5" />
                        )}
                        <span className="break-words">
                          Phase {phase.phase_order}: {phase.phase_name}
                        </span>
                      </h3>

                      {/* Status Badge */}
                      <Badge
                        variant={phase.is_completed ? "default" : "outline"}
                        className={`text-xs capitalize flex-shrink-0 whitespace-nowrap ${
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

                    {/* Description */}
                    {phase.phase_description && (
                      <p className="text-xs sm:text-sm mt-2 text-slate-600 break-words">
                        {phase.phase_description}
                      </p>
                    )}

                    {/* Footer Section */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4 mt-3 pt-3 border-t border-slate-200">
                      {/* Duration and Date Info */}
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs text-slate-500">
                        {phase.estimated_duration && (
                          <span className="flex-shrink-0">
                            Duration: {phase.estimated_duration}
                          </span>
                        )}
                        {phase.completed_date && (
                          <span className="flex-shrink-0">
                            Completed:{" "}
                            {new Date(
                              phase.completed_date
                            ).toLocaleDateString()}
                          </span>
                        )}
                      </div>

                      {/* Completion Indicator */}
                      {phase.is_completed && (
                        <div className="flex items-center text-green-600 text-xs flex-shrink-0">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          <span className="whitespace-nowrap">
                            Phase Complete
                          </span>
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
            <h3 className="text-base sm:text-lg font-semibold text-slate-900 mb-2">
              No Timeline Available
            </h3>
            <p className="text-sm sm:text-base text-slate-600">
              Your project timeline will appear here once phases are defined.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
