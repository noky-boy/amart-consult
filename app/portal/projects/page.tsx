// amart-consult/app/portal/projects/page.tsx
"use client";

import React from "react";
import Link from "next/link";
import { useClientData } from "@/hooks/useClientData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import ClientHeader from "@/components/portal/ClientHeader";
import ChangePasswordModal from "@/components/portal/ChangePasswordModal";
import {
  Loader2,
  AlertCircle,
  Building2,
  Calendar,
  DollarSign,
  ArrowRight,
  ClipboardList,
  MessageSquare,
  RefreshCw,
} from "lucide-react";
import { useClientAuth } from "@/hooks/useClientAuth";
import { useState } from "react";
import { getFinancialSummary } from "@/lib/supabase";

export default function ClientProjectsPage() {
  const [showSettings, setShowSettings] = useState(false);
  const { signOut } = useClientAuth();

  const { user, client, authLoading, loading, error, projects } =
    useClientData();

  const getStatusColor = (status: string) => {
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
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-indigo-600 mx-auto mb-4" />
          <p className="text-slate-600">Loading your projects...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <Card className="w-full max-w-md text-center p-6">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Error Loading Projects</h2>
          <p className="text-slate-600 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </Card>
      </div>
    );
  }

  if (!client || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <Card className="w-full max-w-md text-center p-6">
          <AlertCircle className="h-12 w-12 text-orange-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Account Setup Required</h2>
          <p className="text-slate-600 mb-4">
            Your account needs to be linked to a client profile. Please contact
            support.
          </p>
          <Link href="/contact">
            <Button>Contact Support</Button>
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <ClientHeader
        client={client}
        unreadMessagesCount={0} // Will be calculated per project
        onShowSettings={() => setShowSettings(true)}
        onLogout={signOut}
      />

      {showSettings && (
        <ChangePasswordModal onClose={() => setShowSettings(false)} />
      )}

      <main className="max-w-6xl mx-auto p-6">
        <div className="mb-8">
          <div className="text-center">
            <h1 className="text-3xl font-serif font-bold text-slate-900 mb-2">
              Welcome back, {client.first_name}!
            </h1>
            <p className="text-slate-600">
              Select a project to view its details and progress
            </p>
          </div>
        </div>

        {projects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => {
              const financial = getFinancialSummary(project);
              return (
                <Card
                  key={project.id}
                  className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer group"
                >
                  <Link href={`/portal/dashboard?project=${project.id}`}>
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center mb-3">
                          <Building2 className="h-6 w-6 text-white" />
                        </div>
                        <Badge className={getStatusColor(project.status)}>
                          {project.status}
                        </Badge>
                      </div>
                      <CardTitle className="text-xl font-serif text-slate-900 group-hover:text-indigo-700 transition-colors">
                        {project.project_title}
                      </CardTitle>
                      {project.project_description && (
                        <p className="text-sm text-slate-600 line-clamp-2">
                          {project.project_description}
                        </p>
                      )}
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center text-sm text-slate-600">
                          <ClipboardList className="h-4 w-4 mr-2" />
                          <span className="capitalize">
                            {project.project_type}
                          </span>
                        </div>

                        {project.timeline && (
                          <div className="flex items-center text-sm text-slate-600">
                            <Calendar className="h-4 w-4 mr-2" />
                            <span>{project.timeline}</span>
                          </div>
                        )}

                        {financial.contract_sum > 0 && (
                          <div className="flex items-center text-sm text-slate-600">
                            <DollarSign className="h-4 w-4 mr-2" />
                            <span>{financial.formatted.contract_sum}</span>
                          </div>
                        )}

                        <div className="pt-3 border-t border-slate-100">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-slate-500">
                              Started{" "}
                              {new Date(
                                project.created_at
                              ).toLocaleDateString()}
                            </span>
                            <div className="flex items-center text-indigo-600 group-hover:text-indigo-700 font-medium">
                              View Details
                              <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Link>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card className="text-center p-12">
            <div className="w-24 h-24 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center mx-auto mb-6">
              <Building2 className="h-10 w-10 text-slate-400" />
            </div>
            <h3 className="text-2xl font-semibold text-slate-900 mb-3">
              No Projects Assigned Yet
            </h3>
            <div className="max-w-md mx-auto space-y-4">
              <p className="text-slate-600">
                Your projects will appear here once they're created by your
                project team. This usually happens within 24-48 hours of your
                initial consultation.
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  <strong>Need help?</strong> If you were expecting to see a
                  project here, or if it's been more than 2 business days since
                  your consultation, please contact our team.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link href="/contact">
                  <Button>
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Contact Support
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  onClick={() => window.location.reload()}
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh Page
                </Button>
              </div>
            </div>
          </Card>
        )}
      </main>
    </div>
  );
}
