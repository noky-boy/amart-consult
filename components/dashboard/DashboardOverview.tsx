// amart-consult/components/dashboard/DashboardOverview.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  TrendingUp,
  Calendar,
  CheckCircle,
  MessageSquare,
  Clock,
  FileText,
  Eye,
} from "lucide-react";
import {
  getStatusColor,
  calculateProjectProgress,
  getMilestoneStatusColor,
} from "@/lib/dashboardUtils";
import { documentService } from "@/lib/supabase";
import type {
  Client,
  ProjectMilestone,
  ClientDocument,
  ClientMessage,
} from "@/lib/supabase";

type DashboardOverviewProps = {
  client: Client;
  milestones: ProjectMilestone[];
  documents: ClientDocument[];
  messages: ClientMessage[];
  unreadMessagesCount: number;
};

export default function DashboardOverview({
  client,
  milestones,
  documents,
  messages,
  unreadMessagesCount,
}: DashboardOverviewProps) {
  const projectProgress = calculateProjectProgress(milestones);
  const completedMilestones = milestones.filter(
    (m) => m.status === "completed"
  ).length;

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-serif font-bold text-slate-900 mb-2">
          Project Overview
        </h2>
        <p className="text-slate-600">{client.project_title}</p>
        <Badge className={`mt-2 ${getStatusColor(client.status)}`}>
          {client.status}
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Stats Cards */}
        <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <CardContent className="p-6 text-center">
            <div className="p-3 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl mb-4 mx-auto w-fit">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
            <p className="text-sm font-medium text-slate-600 mb-2">
              Overall Progress
            </p>
            <p className="text-3xl font-bold text-slate-900 mb-4">
              {projectProgress}%
            </p>
            <Progress value={projectProgress} className="h-2 w-full" />
            <p className="text-xs text-slate-500 mt-2">
              {completedMilestones} of {milestones.length} milestones
            </p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <CardContent className="p-6 text-center">
            <div className="p-3 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl mb-4 mx-auto w-fit">
              <Calendar className="h-6 w-6 text-white" />
            </div>
            <p className="text-sm font-medium text-slate-600 mb-2">
              Project Type
            </p>
            <p className="text-2xl font-bold text-slate-900 mb-4 capitalize">
              {client.project_type}
            </p>
            <p className="text-xs text-slate-500">
              {client.timeline || "Timeline TBD"}
            </p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <CardContent className="p-6 text-center">
            <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-xl mb-4 mx-auto w-fit">
              <CheckCircle className="h-6 w-6 text-white" />
            </div>
            <p className="text-sm font-medium text-slate-600 mb-2">
              Completed Tasks
            </p>
            <p className="text-3xl font-bold text-slate-900 mb-4">
              {completedMilestones}
            </p>
            <p className="text-xs text-slate-500">
              {milestones.length - completedMilestones} remaining
            </p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <CardContent className="p-6 text-center">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl mb-4 mx-auto w-fit">
              <MessageSquare className="h-6 w-6 text-white" />
            </div>
            <p className="text-sm font-medium text-slate-600 mb-2">Messages</p>
            <p className="text-3xl font-bold text-slate-900 mb-4">
              {messages.length}
            </p>
            <p className="text-xs text-slate-500">
              {unreadMessagesCount} unread
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Milestones */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-indigo-600" />
              <span>Project Milestones</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {milestones.length > 0 ? (
              <div className="space-y-4">
                {milestones.slice(0, 5).map((milestone) => (
                  <div
                    key={milestone.id}
                    className="flex items-start space-x-4 p-3 rounded-lg border border-slate-200"
                  >
                    <div
                      className={`h-3 w-3 rounded-full mt-2 ${getMilestoneStatusColor(
                        milestone.status
                      )}`}
                    ></div>
                    <div className="flex-1">
                      <h4 className="font-medium text-slate-900">
                        {milestone.title}
                      </h4>
                      {milestone.description && (
                        <p className="text-sm text-slate-600 mt-1">
                          {milestone.description}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-600 text-center py-8">
                No milestones defined yet.
              </p>
            )}
          </CardContent>
        </Card>
        {/* Recent Documents */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="h-5 w-5 text-purple-600" />
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
                    <div className="flex items-center space-x-3">
                      <FileText className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="font-medium text-slate-900">
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
              <p className="text-slate-600 text-center py-8">
                No documents available.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
