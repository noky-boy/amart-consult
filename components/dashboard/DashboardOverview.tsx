// amart-consult/components/dashboard/DashboardOverview.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  TrendingUp,
  MessageSquare,
  Clock,
  FileText,
  Eye,
  DollarSign,
  CreditCard,
  Wallet,
  ClipboardList,
} from "lucide-react";
import { documentService, getFinancialSummary } from "@/lib/supabase";
import type {
  Client,
  Project,
  ProjectPhase,
  ClientDocument,
  ClientMessage,
} from "@/lib/supabase";

function getStatusColor(status: string) {
  switch (status) {
    case "Planning":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "In Progress":
      return "bg-blue-100 text-blue-800 border-blue-200";
    case "Review":
      return "bg-purple-100 text-purple-800 border-purple-200";
    case "Completed":
      return "bg-green-100 text-green-800 border-green-200";
    case "On Hold":
      return "bg-orange-100 text-orange-800 border-orange-200";
    case "Cancelled":
      return "bg-red-100 text-red-800 border-red-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
}

function calculateProjectProgress(phases: ProjectPhase[]): number {
  if (phases.length === 0) return 0;
  const completedPhases = phases.filter((phase) => phase.is_completed).length;
  return Math.round((completedPhases / phases.length) * 100);
}

function getPhaseStatusColor(isCompleted: boolean) {
  return isCompleted ? "bg-green-500" : "bg-slate-300";
}

type DashboardOverviewProps = {
  client: Client;
  project: Project;
  phases: ProjectPhase[];
  documents: ClientDocument[];
  messages: ClientMessage[];
  unreadMessagesCount: number;
};

export default function DashboardOverview({
  client,
  project,
  phases,
  documents,
  messages,
  unreadMessagesCount,
}: DashboardOverviewProps) {
  const projectProgress = calculateProjectProgress(phases);
  const completedPhases = phases.filter((p) => p.is_completed).length;
  const financial = getFinancialSummary(project);

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Page Header */}
      <div className="text-center">
        <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 mb-2">
          Project Overview
        </h2>
        <p className="text-sm sm:text-base text-slate-600">
          {project.project_title}
        </p>
        <Badge className={`mt-2 ${getStatusColor(project.status)}`}>
          {project.status}
        </Badge>
      </div>

      {/* Stats Cards - Responsive Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Project Type Card */}
        <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <CardContent className="p-4 sm:p-6 text-center">
            <div className="p-2.5 sm:p-3 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl mb-3 sm:mb-4 mx-auto w-fit">
              <ClipboardList className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
            </div>
            <p className="text-xs sm:text-sm font-medium text-slate-600 mb-2">
              Project Type
            </p>
            <p className="text-xl sm:text-2xl font-bold text-slate-900 mb-2 sm:mb-4 capitalize">
              {project.project_type}
            </p>
            <p className="text-xs text-slate-500">
              {project.timeline || "Timeline TBD"}
            </p>
          </CardContent>
        </Card>

        {/* Overall Progress Card */}
        <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <CardContent className="p-4 sm:p-6 text-center">
            <div className="p-2.5 sm:p-3 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl mb-3 sm:mb-4 mx-auto w-fit">
              <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
            </div>
            <p className="text-xs sm:text-sm font-medium text-slate-600 mb-2">
              Overall Progress
            </p>
            <p className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3 sm:mb-4">
              {projectProgress}%
            </p>
            <Progress value={projectProgress} className="h-2 w-full" />
            <p className="text-xs text-slate-500 mt-2">
              {completedPhases} of {phases.length} phases
            </p>
          </CardContent>
        </Card>

        {/* Financial Summary Card */}
        <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <CardContent className="p-4 sm:p-6 text-center">
            <div className="p-2.5 sm:p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-xl mb-3 sm:mb-4 mx-auto w-fit">
              <DollarSign className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
            </div>
            <p className="text-xs sm:text-sm font-medium text-slate-600 mb-2">
              Project Financials
            </p>
            <div className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm">
              <div className="flex justify-between items-center">
                <span className="text-slate-600 flex items-center">
                  <CreditCard className="h-3 w-3 mr-1" />
                  Contract:
                </span>
                <span className="font-semibold text-slate-900">
                  {financial.formatted.contract_sum}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-600 flex items-center">
                  <Wallet className="h-3 w-3 mr-1 text-green-600" />
                  Received:
                </span>
                <span className="font-semibold text-green-700">
                  {financial.formatted.cash_received}
                </span>
              </div>
              <div className="border-t pt-1.5 sm:pt-2 flex justify-between items-center">
                <span className="text-slate-600 font-medium">Balance:</span>
                <span
                  className={`font-bold ${
                    financial.balance > 0 ? "text-orange-600" : "text-green-600"
                  }`}
                >
                  {financial.formatted.balance}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Messages Card */}
        <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <CardContent className="p-4 sm:p-6 text-center">
            <div className="p-2.5 sm:p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl mb-3 sm:mb-4 mx-auto w-fit">
              <MessageSquare className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
            </div>
            <p className="text-xs sm:text-sm font-medium text-slate-600 mb-2">
              Messages
            </p>
            <p className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3 sm:mb-4">
              {messages.length}
            </p>
            <p className="text-xs text-slate-500">
              {unreadMessagesCount} unread
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Project Phases and Documents - Responsive Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
        {/* Project Phases */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-base sm:text-lg">
              <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-indigo-600" />
              <span>Project Phases</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {phases.length > 0 ? (
              <div className="space-y-3 sm:space-y-4">
                {phases.slice(0, 5).map((phase) => (
                  <div
                    key={phase.id}
                    className="flex items-start space-x-3 sm:space-x-4 p-3 rounded-lg border border-slate-200"
                  >
                    <div
                      className={`h-3 w-3 rounded-full mt-2 flex-shrink-0 ${getPhaseStatusColor(
                        phase.is_completed
                      )}`}
                    ></div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-slate-900 text-sm sm:text-base">
                        {phase.phase_name}
                      </h4>
                      {phase.phase_description && (
                        <p className="text-xs sm:text-sm text-slate-600 mt-1">
                          {phase.phase_description}
                        </p>
                      )}
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mt-2">
                        <span
                          className={`text-xs px-2 py-1 rounded-full w-fit ${
                            phase.is_completed
                              ? "bg-green-100 text-green-700"
                              : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {phase.is_completed ? "Completed" : "In Progress"}
                        </span>
                        {phase.completed_date && (
                          <span className="text-xs text-slate-500">
                            Completed:{" "}
                            {new Date(
                              phase.completed_date
                            ).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-600 text-center py-8 text-sm sm:text-base">
                No project phases defined yet.
              </p>
            )}
          </CardContent>
        </Card>

        {/* Recent Documents */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-base sm:text-lg">
              <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600" />
              <span>Recent Documents</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {documents.length > 0 ? (
              <div className="space-y-3">
                {documents.slice(0, 5).map((doc) => (
                  <div
                    key={doc.id}
                    className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200"
                  >
                    <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
                      <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-slate-900 text-sm sm:text-base truncate">
                          {doc.title}
                        </p>
                        <p className="text-xs text-slate-500">
                          {new Date(doc.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex-shrink-0 ml-2"
                      onClick={async () => {
                        const url = await documentService.getDownloadUrl(
                          doc.file_path
                        );
                        if (url) window.open(url, "_blank");
                      }}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-600 text-center py-8 text-sm sm:text-base">
                No documents available.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
