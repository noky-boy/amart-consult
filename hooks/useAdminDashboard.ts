"use client";

import { useState, useEffect, useCallback } from "react";
import { clientService, projectService } from "@/lib/supabase";
import type { Client, Project } from "@/lib/supabase";

// Define the interface for the dashboard's state
interface DashboardStats {
  totalClients: number;
  totalProjects: number;
  activeProjects: number;
  statusCounts: Record<string, number>;
  recentClients: Client[];
  recentProjects: (Project & { client: Client })[];
}

export const useAdminDashboard = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalClients: 0,
    totalProjects: 0,
    activeProjects: 0,
    statusCounts: {},
    recentClients: [],
    recentProjects: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [enablingPortal, setEnablingPortal] = useState<string | null>(null);

  const fetchDashboardData = useCallback(async () => {
    try {
      // Don't set loading to true here to avoid a full page flash on refresh
      setError("");

      const [clientStats, projectStats] = await Promise.all([
        clientService.getDashboardStats(),
        projectService.getDashboardStats(),
      ]);

      setStats({
        totalClients: clientStats.totalClients,
        totalProjects: projectStats.totalProjects,
        activeProjects: projectStats.activeProjects,
        statusCounts: projectStats.statusCounts,
        recentClients: clientStats.recentClients,
        recentProjects: projectStats.recentProjects,
      });
    } catch (err: any) {
      console.error("Failed to fetch dashboard data:", err);
      setError("Failed to load dashboard data. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    fetchDashboardData();
  }, [fetchDashboardData]);

  const handleEnablePortalAccess = async (client: Client) => {
    if (client.has_portal_access) {
      alert("This client already has portal access");
      return;
    }

    const confirmed = window.confirm(
      `Enable portal access for ${client.first_name} ${client.last_name}?\n\nThis will:\n- Create login credentials\n- Send a welcome email with temporary password`
    );

    if (!confirmed) return;

    setEnablingPortal(client.id);

    try {
      const response = await fetch("/api/enable-portal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clientId: client.id }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to enable portal access");
      }

      alert(
        `${result.message}\n${
          result.emailSent
            ? "Welcome email sent successfully!"
            : "Note: Welcome email failed to send."
        }`
      );

      await fetchDashboardData();
    } catch (error: any) {
      console.error("Failed to enable portal access:", error);
      alert(`Failed to enable portal access: ${error.message}`);
    } finally {
      setEnablingPortal(null);
    }
  };

  return {
    stats,
    loading,
    error,
    enablingPortal,
    handleEnablePortalAccess,
    refreshDashboard: fetchDashboardData,
  };
};
