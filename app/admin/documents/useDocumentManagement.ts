import { useState, useEffect, useMemo, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { clientService, projectService, documentService } from "@/lib/supabase";
import type { Client, Project, ClientDocument } from "@/lib/supabase";

export const useDocumentManagement = () => {
  const searchParams = useSearchParams();
  const preSelectedClientId = searchParams.get("clientId");
  const preSelectedProjectId = searchParams.get("projectId");

  // State
  const [clients, setClients] = useState<Client[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [documents, setDocuments] = useState<ClientDocument[]>([]);
  const [selectedClient, setSelectedClient] = useState<string>(
    preSelectedClientId || ""
  );
  const [selectedProject, setSelectedProject] = useState<string>(
    preSelectedProjectId || ""
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [levelFilter, setLevelFilter] = useState<"all" | "client" | "project">(
    "all"
  );

  // Fetching logic
  const fetchClientData = useCallback(async (clientId: string) => {
    try {
      const [projectsData, docsData] = await Promise.all([
        projectService.getByClientId(clientId),
        documentService.getByClientId(clientId),
      ]);
      setProjects(projectsData);
      setDocuments(docsData);
    } catch (err) {
      setError("Failed to load client projects and documents.");
    }
  }, []);

  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      try {
        const clientsData = await clientService.getAll();
        setClients(clientsData);
        if (preSelectedClientId) {
          await fetchClientData(preSelectedClientId);
        }
      } catch (err) {
        setError("Failed to load initial client data.");
      } finally {
        setLoading(false);
      }
    };
    fetchInitialData();
  }, [preSelectedClientId, fetchClientData]);

  useEffect(() => {
    if (selectedClient) {
      fetchClientData(selectedClient);
    } else {
      setProjects([]);
      setDocuments([]);
    }
  }, [selectedClient, fetchClientData]);

  // Memoized filtering
  const filteredDocuments = useMemo(() => {
    return documents.filter((doc) => {
      const matchesProject =
        !selectedProject || doc.project_id === selectedProject;
      const matchesSearch = doc.title
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesCategory =
        categoryFilter === "all" || doc.category === categoryFilter;
      const matchesLevel =
        levelFilter === "all" ||
        (levelFilter === "client" && !doc.project_id) ||
        (levelFilter === "project" && !!doc.project_id);
      return matchesProject && matchesSearch && matchesCategory && matchesLevel;
    });
  }, [documents, searchTerm, categoryFilter, levelFilter, selectedProject]);

  const availableCategories = useMemo(
    () =>
      Array.from(new Set(documents.map((doc) => doc.category).filter(Boolean))),
    [documents]
  );

  const handleDeleteDocument = async (doc: ClientDocument) => {
    if (!confirm(`Are you sure you want to delete "${doc.title}"?`)) return;
    try {
      await documentService.delete(doc.id);
      setDocuments((docs) => docs.filter((d) => d.id !== doc.id));
    } catch (err) {
      setError("Failed to delete document.");
    }
  };

  const refreshDocuments = () => {
    if (selectedClient) {
      fetchClientData(selectedClient);
    }
  };

  return {
    clients,
    projects,
    documents,
    filteredDocuments,
    availableCategories,
    loading,
    error,
    selectedClient,
    setSelectedClient,
    selectedProject,
    setSelectedProject,
    searchTerm,
    setSearchTerm,
    categoryFilter,
    setCategoryFilter,
    levelFilter,
    setLevelFilter,
    handleDeleteDocument,
    refreshDocuments,
  };
};
