// amart-consult/components/dashboard/ProjectTimeline.tsx

"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Clock,
  CheckCircle,
  Circle,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  FileText,
  Download,
  Eye,
} from "lucide-react";
import type { ProjectPhase, ClientDocument } from "@/lib/supabase";
import { getPhaseStatus, getStatusColorClasses } from "@/lib/phase-helpers";
import { documentService } from "@/lib/supabase";

type ProjectTimelineProps = {
  phases: ProjectPhase[];
  timelineDocuments?: ClientDocument[];
};

export default function ProjectTimeline({
  phases,
  timelineDocuments = [],
}: ProjectTimelineProps) {
  const [expandedPhases, setExpandedPhases] = useState<Set<string>>(new Set());
  const [expandAll, setExpandAll] = useState(false);

  // Separate parent and child phases
  const parentPhases = phases
    .filter((p) => !p.parent_phase_id)
    .sort((a, b) => a.phase_order - b.phase_order);

  const getChildren = (parentId: string) => {
    return phases
      .filter((p) => p.parent_phase_id === parentId)
      .sort((a, b) => a.phase_order - b.phase_order);
  };

  const togglePhase = (phaseId: string) => {
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

  const toggleExpandAll = () => {
    if (expandAll) {
      setExpandedPhases(new Set());
    } else {
      const allParentIds = parentPhases
        .filter((p) => getChildren(p.id).length > 0)
        .map((p) => p.id);
      setExpandedPhases(new Set(allParentIds));
    }
    setExpandAll(!expandAll);
  };

  const handleDownload = async (doc: ClientDocument) => {
    try {
      const url = await documentService.getDownloadUrl(doc.file_path);
      if (url) {
        const a = document.createElement("a");
        a.href = url;
        a.download = doc.title;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }
    } catch (error) {
      console.error("Failed to download document:", error);
      alert("Failed to download document.");
    }
  };

  const handleView = async (doc: ClientDocument) => {
    try {
      const url = await documentService.getViewUrl(doc.file_path);
      if (url) window.open(url, "_blank");
    } catch (error) {
      console.error("Failed to view document:", error);
      alert("Failed to view document.");
    }
  };

  return (
    <div className="space-y-4">
      {/* Timeline Documents Section */}
      {timelineDocuments.length > 0 && (
        <Card className="border-0 shadow-lg bg-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-base sm:text-lg">
              <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
              <span>Timeline Documents</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {timelineDocuments.map((doc) => (
                <div
                  key={doc.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 bg-white rounded-lg border border-blue-200 hover:border-blue-300 transition-colors gap-3"
                >
                  <div className="flex items-center space-x-3 min-w-0 flex-1">
                    <div className="p-2 bg-blue-100 rounded-lg flex-shrink-0">
                      <FileText className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-slate-900 text-sm sm:text-base truncate">
                        {doc.title}
                      </p>
                      {doc.description && (
                        <p className="text-xs sm:text-sm text-slate-600 mt-1 line-clamp-1">
                          {doc.description}
                        </p>
                      )}
                      {doc.uploaded_at && (
                        <p className="text-xs text-slate-500 mt-1">
                          Uploaded:{" "}
                          {new Date(doc.uploaded_at).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex space-x-2 sm:ml-4 flex-shrink-0">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleView(doc)}
                      className="flex-1 sm:flex-none"
                    >
                      <Eye className="h-4 w-4 sm:mr-2" />
                      <span className="hidden sm:inline">View</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDownload(doc)}
                      className="flex-1 sm:flex-none"
                    >
                      <Download className="h-4 w-4 sm:mr-2" />
                      <span className="hidden sm:inline">Download</span>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Phases Timeline Section */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2 text-base sm:text-lg">
              <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-indigo-600" />
              <span>Project Phases</span>
            </CardTitle>
            {parentPhases.some((p) => getChildren(p.id).length > 0) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleExpandAll}
                className="text-xs"
              >
                {expandAll ? (
                  <>
                    <ChevronUp className="h-3 w-3 mr-1" />
                    Collapse All
                  </>
                ) : (
                  <>
                    <ChevronDown className="h-3 w-3 mr-1" />
                    Expand All
                  </>
                )}
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {parentPhases.length > 0 ? (
            <div className="space-y-3">
              {parentPhases.map((parentPhase) => {
                const children = getChildren(parentPhase.id);
                const parentStatus = getPhaseStatus(parentPhase, children);
                const hasChildren = children.length > 0;
                const isExpanded = expandedPhases.has(parentPhase.id);

                return (
                  <div key={parentPhase.id} className="relative">
                    {/* Parent Phase Card */}
                    <div
                      className={`p-3 sm:p-4 rounded-lg border transition-colors ${
                        parentStatus === "Completed"
                          ? "bg-green-50 border-green-200"
                          : parentStatus === "In Progress"
                          ? "bg-blue-50 border-blue-200"
                          : "bg-slate-50 border-slate-200"
                      }`}
                    >
                      {/* Parent Header */}
                      <div className="flex items-start gap-2">
                        {/* Expand/Collapse Button */}
                        {hasChildren && (
                          <button
                            onClick={() => togglePhase(parentPhase.id)}
                            className="mt-0.5 hover:bg-slate-200 rounded p-1 transition-colors flex-shrink-0"
                          >
                            {isExpanded ? (
                              <ChevronDown className="h-4 w-4 text-slate-600" />
                            ) : (
                              <ChevronRight className="h-4 w-4 text-slate-600" />
                            )}
                          </button>
                        )}

                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-2">
                            <h3 className="font-semibold text-slate-800 flex items-start text-sm sm:text-base min-w-0 flex-1">
                              {parentStatus === "Completed" ? (
                                <CheckCircle className="h-4 w-4 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                              ) : parentStatus === "In Progress" ? (
                                <Circle className="h-4 w-4 text-blue-500 mr-2 flex-shrink-0 mt-0.5 animate-pulse" />
                              ) : (
                                <Circle className="h-4 w-4 text-slate-400 mr-2 flex-shrink-0 mt-0.5" />
                              )}
                              <span className="break-words">
                                Phase {parentPhase.phase_order}:{" "}
                                {parentPhase.phase_name}
                              </span>
                            </h3>

                            {/* Parent Status Badge */}
                            <Badge
                              variant="outline"
                              className={`text-xs capitalize flex-shrink-0 whitespace-nowrap ${getStatusColorClasses(
                                parentStatus
                              )}`}
                            >
                              {parentStatus}
                            </Badge>
                          </div>

                          {/* Parent Description */}
                          {parentPhase.phase_description && (
                            <p className="text-xs sm:text-sm mt-2 text-slate-600 break-words">
                              {parentPhase.phase_description}
                            </p>
                          )}

                          {/* Parent Footer */}
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mt-3 pt-3 border-t border-slate-200">
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs text-slate-500">
                              {parentPhase.estimated_duration && (
                                <span className="flex-shrink-0">
                                  Duration: {parentPhase.estimated_duration}
                                </span>
                              )}
                              {hasChildren && (
                                <span className="flex-shrink-0 font-medium">
                                  {
                                    children.filter((c) => c.is_completed)
                                      .length
                                  }{" "}
                                  / {children.length} subtasks completed
                                </span>
                              )}
                              {parentPhase.completed_date && (
                                <span className="flex-shrink-0">
                                  Completed:{" "}
                                  {new Date(
                                    parentPhase.completed_date
                                  ).toLocaleDateString()}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Child Phases (Collapsible) */}
                    {hasChildren && isExpanded && (
                      <div className="mt-2 ml-6 sm:ml-10 space-y-2 border-l-2 border-slate-200 pl-3 sm:pl-4">
                        {children.map((childPhase) => {
                          const childStatus = getPhaseStatus(
                            childPhase,
                            undefined,
                            parentStatus
                          );

                          return (
                            <div
                              key={childPhase.id}
                              className={`p-2 sm:p-3 rounded-lg border ${
                                childStatus === "Completed"
                                  ? "bg-green-50 border-green-200"
                                  : "bg-white border-slate-200"
                              }`}
                            >
                              {/* Child Header */}
                              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                                <h4 className="font-medium text-slate-700 flex items-start text-xs sm:text-sm min-w-0 flex-1">
                                  <ChevronRight className="h-3 w-3 text-slate-400 mr-1 flex-shrink-0 mt-0.5" />
                                  <span className="break-words">
                                    {childPhase.phase_name}
                                  </span>
                                </h4>

                                {/* Child Status Badge */}
                                <Badge
                                  variant="outline"
                                  className={`text-xs capitalize flex-shrink-0 whitespace-nowrap ${getStatusColorClasses(
                                    childStatus
                                  )}`}
                                >
                                  {childStatus}
                                </Badge>
                              </div>

                              {/* Child Description */}
                              {childPhase.phase_description && (
                                <p className="text-xs mt-1 ml-4 text-slate-600 break-words">
                                  {childPhase.phase_description}
                                </p>
                              )}

                              {/* Child Footer */}
                              <div className="flex flex-wrap items-center gap-2 sm:gap-4 mt-2 ml-4 text-xs text-slate-500">
                                {childPhase.estimated_duration && (
                                  <span className="flex-shrink-0">
                                    Duration: {childPhase.estimated_duration}
                                  </span>
                                )}
                                {childPhase.completed_date && (
                                  <span className="flex items-center text-green-600 flex-shrink-0">
                                    <CheckCircle className="h-3 w-3 mr-1" />
                                    Completed:{" "}
                                    {new Date(
                                      childPhase.completed_date
                                    ).toLocaleDateString()}
                                  </span>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
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
    </div>
  );
}
