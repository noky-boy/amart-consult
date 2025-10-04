// app/admin/projects/[id]/useProjectDetails.ts
"use client";

import { useState, useEffect, useCallback } from "react";
import {
  projectService,
  documentService,
  messageService,
  phaseService,
  getFinancialSummary,
} from "@/lib/supabase";
import type {
  ProjectWithProgress,
  Client,
  ClientDocument,
  ClientMessage,
  ProjectPhase,
} from "@/lib/supabase";

// Define a more specific type for the project data used in this hook
type ProjectWithClientAndProgress = ProjectWithProgress & { client: Client };

export function useProjectDetails(projectId: string) {
  const [project, setProject] = useState<ProjectWithClientAndProgress | null>(
    null
  );
  const [phases, setPhases] = useState<ProjectPhase[]>([]);
  const [documents, setDocuments] = useState<ClientDocument[]>([]);
  const [messages, setMessages] = useState<ClientMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchProjectData = useCallback(async () => {
    if (!projectId) return;
    try {
      setLoading(true);
      setError("");

      // Fetch all data in parallel
      const [projectData, phasesData, documentsData, messagesData] =
        await Promise.all([
          projectService.getWithClientAndProgress(projectId),
          phaseService.getByProjectId(projectId),
          documentService.getByProjectId(projectId),
          messageService.getByProjectId(projectId),
        ]);

      setProject(projectData);
      setPhases(phasesData);
      setDocuments(documentsData);
      setMessages(messagesData);
    } catch (err: any) {
      console.error("Failed to fetch project:", err);
      setError("Failed to load project data. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    fetchProjectData();
  }, [fetchProjectData]);

  const handlePhaseToggle = async (phase: ProjectPhase) => {
    try {
      const updatedPhase = phase.is_completed
        ? await phaseService.markIncomplete(phase.id)
        : await phaseService.markCompleted(phase.id);

      // Update the phases list optimistically
      setPhases((currentPhases) =>
        currentPhases.map((p) => (p.id === phase.id ? updatedPhase : p))
      );

      // Refresh project progress in the background
      const updatedProject = await projectService.getWithClientAndProgress(
        projectId
      );
      setProject(updatedProject);
    } catch (err: any) {
      console.error("Failed to update phase:", err);
      alert("Failed to update phase: " + err.message);
    }
  };

  const handleDeleteDocument = async (docToDelete: ClientDocument) => {
    if (!confirm(`Are you sure you want to delete "${docToDelete.title}"?`)) {
      return;
    }
    try {
      await documentService.delete(docToDelete.id);
      setDocuments((prevDocs) =>
        prevDocs.filter((doc) => doc.id !== docToDelete.id)
      );
    } catch (error: any) {
      console.error("Failed to delete document:", error);
      alert("Failed to delete document: " + error.message);
    }
  };

  return {
    project,
    phases,
    documents,
    messages,
    loading,
    error,
    financialSummary: project ? getFinancialSummary(project) : null,
    handlePhaseToggle,
    handleDeleteDocument,
  };
}
