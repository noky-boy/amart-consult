// amart-consult/hooks/useClientData.ts
import { useState, useEffect, useCallback } from "react";
import { useRequireAuth } from "@/hooks/useClientAuth";
import {
  projectService,
  phaseService,
  documentService,
  messageService,
} from "@/lib/supabase";
import type {
  Project,
  ProjectPhase,
  ClientDocument,
  ClientMessage,
} from "@/lib/supabase";

export const useClientData = () => {
  const { user, client, loading: authLoading } = useRequireAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Client-level data
  const [projects, setProjects] = useState<Project[]>([]);

  const fetchClientProjects = useCallback(async (clientId: string) => {
    try {
      setLoading(true);
      setError("");

      const projectsData = await projectService.getByClientId(clientId);
      setProjects(projectsData);
    } catch (err) {
      console.error("Failed to fetch client projects:", err);
      setError("Failed to load projects");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (client?.id) {
      fetchClientProjects(client.id);
    }
  }, [client?.id, fetchClientProjects]);

  return {
    user,
    client,
    authLoading,
    loading,
    error,
    projects,
    refreshData: () => client?.id && fetchClientProjects(client.id),
  };
};

// New hook for project-specific data
export const useProjectData = (projectId: string | null) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [project, setProject] = useState<Project | null>(null);
  const [phases, setPhases] = useState<ProjectPhase[]>([]);
  const [documents, setDocuments] = useState<ClientDocument[]>([]);
  const [messages, setMessages] = useState<ClientMessage[]>([]);

  const fetchProjectData = useCallback(async (projectId: string) => {
    try {
      setLoading(true);
      setError("");

      const [projectData, phasesData, documentsData, messagesData] =
        await Promise.all([
          projectService.getById(projectId),
          phaseService.getByProjectId(projectId),
          documentService.getByProjectId(projectId),
          messageService.getByProjectId(projectId),
        ]);

      setProject(projectData);
      setPhases(phasesData);
      setDocuments(documentsData);
      setMessages(messagesData);
    } catch (err) {
      console.error("Failed to fetch project data:", err);
      setError("Failed to load project data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (projectId) {
      fetchProjectData(projectId);
    }
  }, [projectId, fetchProjectData]);

  const markAdminMessagesAsRead = async () => {
    if (!projectId) return;

    const unreadAdminMessages = messages.filter(
      (msg) => msg.sender_type === "admin" && !msg.is_read
    );

    if (unreadAdminMessages.length > 0) {
      const messageIds = unreadAdminMessages.map((msg) => msg.id);
      try {
        await messageService.markAsRead(messageIds);
        setMessages((prevMessages) =>
          prevMessages.map((msg) =>
            messageIds.includes(msg.id) ? { ...msg, is_read: true } : msg
          )
        );
      } catch (error) {
        console.error("Failed to mark messages as read:", error);
      }
    }
  };

  // Derived state
  const photos = documents.filter(
    (doc) => doc.file_type?.startsWith("image/") || doc.category === "photos"
  );
  const unreadMessagesCount = messages.filter(
    (m) => m.sender_type === "admin" && !m.is_read
  ).length;

  return {
    loading,
    error,
    project,
    phases,
    documents,
    messages,
    photos,
    unreadMessagesCount,
    setMessages,
    refreshData: () => projectId && fetchProjectData(projectId),
    markAdminMessagesAsRead,
  };
};
