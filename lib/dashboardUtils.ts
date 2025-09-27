// amart-consult/lib/dashboardUtils.ts
import type { ProjectMilestone } from "@/lib/supabase";

export const calculateProjectProgress = (milestones: ProjectMilestone[]) => {
  if (milestones.length === 0) return 0;
  const completed = milestones.filter((m) => m.status === "completed").length;
  return Math.round((completed / milestones.length) * 100);
};

export const getStatusColor = (status: string) => {
  switch (status) {
    case "Planning":
      return "bg-yellow-100 text-yellow-800";
    case "In Progress":
      return "bg-blue-100 text-blue-800";
    case "Review":
      return "bg-purple-100 text-purple-800";
    case "Completed":
      return "bg-green-100 text-green-800";
    case "On Hold":
      return "bg-orange-100 text-orange-800";
    case "Cancelled":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export const getMilestoneStatusColor = (status: string) => {
  switch (status) {
    case "completed":
      return "bg-green-500";
    case "in-progress":
      return "bg-blue-500";
    case "pending":
      return "bg-slate-300";
    case "cancelled":
      return "bg-red-500";
    default:
      return "bg-slate-300";
  }
};

export const formatTimestamp = (timestamp: string) => {
  return new Date(timestamp).toLocaleString();
};
