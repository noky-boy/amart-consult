"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Users, Building2, TrendingUp, MessageSquare } from "lucide-react";

interface DashboardStatCardsProps {
  totalClients: number;
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
}

export function DashboardStatCards({
  totalClients,
  totalProjects,
  activeProjects,
  completedProjects,
}: DashboardStatCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">Total Clients</p>
              <p className="text-3xl font-bold">{totalClients}</p>
              <p className="text-blue-100 text-sm mt-1">Active clients</p>
            </div>
            <div className="p-3 rounded-full bg-blue-400">
              <Users className="h-6 w-6 text-white" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium">
                Total Projects
              </p>
              <p className="text-3xl font-bold">{totalProjects}</p>
              <p className="text-green-100 text-sm mt-1">All projects</p>
            </div>
            <div className="p-3 rounded-full bg-green-400">
              <Building2 className="h-6 w-6 text-white" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm font-medium">
                Active Projects
              </p>
              <p className="text-3xl font-bold">{activeProjects}</p>
              <p className="text-purple-100 text-sm mt-1">In progress</p>
            </div>
            <div className="p-3 rounded-full bg-purple-400">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm font-medium">Completed</p>
              <p className="text-3xl font-bold">{completedProjects}</p>
              <p className="text-orange-100 text-sm mt-1">Finished projects</p>
            </div>
            <div className="p-3 rounded-full bg-orange-400">
              <MessageSquare className="h-6 w-6 text-white" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
