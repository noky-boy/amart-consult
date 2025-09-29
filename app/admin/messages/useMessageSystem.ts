"use client";

import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { clientService, projectService, messageService } from "@/lib/supabase";
import type { Client, Project, ClientMessage } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";

// Define the shape of the data and functions returned by the hook
export interface UseMessageSystemReturn {
  clients: Client[];
  projects: Project[];
  messages: ClientMessage[];
  selectedClient: string;
  setSelectedClient: (value: string) => void;
  selectedProject: string;
  setSelectedProject: (value: string) => void;
  loading: boolean;
  sending: boolean;
  error: string;
  messageData: {
    subject: string;
    message: string;
    priority: "low" | "normal" | "high";
    sendEmail: boolean;
    template: string;
  };
  setMessageData: React.Dispatch<
    React.SetStateAction<UseMessageSystemReturn["messageData"]>
  >;
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  statusFilter: string;
  setStatusFilter: (value: string) => void;
  levelFilter: "all" | "client" | "project";
  setLevelFilter: (value: "all" | "client" | "project") => void;
  messageTemplates: {
    id: string;
    name: string;
    subject: string;
    message: string;
  }[];
  filteredMessages: ClientMessage[];
  handleSendMessage: () => Promise<void>;
  handleTemplateSelect: (templateId: string) => void;
  clearFilters: () => void;
}

export function useMessageSystem(): UseMessageSystemReturn {
  const searchParams = useSearchParams();
  const preSelectedClientId = searchParams.get("clientId");
  const preSelectedProjectId = searchParams.get("projectId");

  const [clients, setClients] = useState<Client[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [messages, setMessages] = useState<ClientMessage[]>([]);

  const [selectedClient, setSelectedClient] = useState<string>(
    preSelectedClientId || ""
  );
  const [selectedProject, setSelectedProject] = useState<string>(
    preSelectedProjectId || ""
  );

  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  const { user } = useAuth();

  const [messageData, setMessageData] = useState({
    subject: "",
    message: "",
    priority: "normal" as "low" | "normal" | "high",
    sendEmail: true,
    template: "",
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [levelFilter, setLevelFilter] = useState<"all" | "client" | "project">(
    "all"
  );

  const messageTemplates = [
    {
      id: "project-update",
      name: "Project Update",
      subject: "Update on Your {project_title} Project",
      message:
        "Dear {client_name},\n\nI wanted to provide you with an update on your {project_title} project.\n\n{custom_content}\n\nPlease don't hesitate to reach out if you have any questions.\n\nBest regards,\nAmart Consult Team",
    },
    {
      id: "milestone-complete",
      name: "Milestone Completed",
      subject: "Milestone Completed: {milestone_name}",
      message:
        "Dear {client_name},\n\nWe're pleased to inform you that we have completed the {milestone_name} phase of your {project_title} project.\n\n{custom_content}\n\nNext steps: {next_steps}\n\nBest regards,\nAmart Consult Team",
    },
    {
      id: "document-ready",
      name: "Documents Ready",
      subject: "Your Project Documents Are Ready",
      message:
        "Dear {client_name},\n\nYour project documents are now ready for review. You can access them through your client portal.\n\nDocuments included:\n{document_list}\n\nPlease review and let us know if you have any feedback.\n\nBest regards,\nAmart Consult Team",
    },
    {
      id: "meeting-request",
      name: "Meeting Request",
      subject: "Let's Schedule a Meeting",
      message:
        "Dear {client_name},\n\nI would like to schedule a meeting to discuss your {project_title} project.\n\nProposed times:\n- {time_option_1}\n- {time_option_2}\n- {time_option_3}\n\nPlease let me know which time works best for you.\n\nBest regards,\nAmart Consult Team",
    },
    {
      id: "payment-reminder",
      name: "Payment Reminder",
      subject: "Payment Reminder for {project_title}",
      message:
        "Dear {client_name},\n\nThis is a friendly reminder regarding the outstanding balance on your {project_title} project.\n\nOutstanding Amount: {balance_amount}\nDue Date: {due_date}\n\nPlease let us know if you have any questions.\n\nBest regards,\nAmart Consult Team",
    },
  ];

  const fetchMessages = async (clientId: string, projectId?: string) => {
    try {
      const msgs = projectId
        ? await messageService.getByProjectId(projectId)
        : await messageService.getByClientId(clientId);

      setMessages(msgs);

      const unreadClientMessages = msgs.filter(
        (msg) => !msg.is_read && msg.sender_type === "client"
      );

      if (unreadClientMessages.length > 0) {
        const unreadIds = unreadClientMessages.map((msg) => msg.id);
        await messageService.markAsRead(unreadIds);

        setMessages((prev) =>
          prev.map((msg) =>
            unreadIds.includes(msg.id) ? { ...msg, is_read: true } : msg
          )
        );
      }
    } catch (err) {
      console.error("Failed to fetch messages:", err);
      setError("Failed to load messages. Please try refreshing.");
    }
  };

  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      try {
        const clientsData = await clientService.getAll();
        setClients(clientsData);

        if (preSelectedClientId) {
          const projectsData = await projectService.getByClientId(
            preSelectedClientId
          );
          setProjects(projectsData);
          await fetchMessages(
            preSelectedClientId,
            preSelectedProjectId || undefined
          );
        }
      } catch (err) {
        console.error("Failed to fetch data:", err);
        setError("Failed to load initial data. Please try refreshing.");
      } finally {
        setLoading(false);
      }
    };
    fetchInitialData();
  }, [preSelectedClientId, preSelectedProjectId]);

  useEffect(() => {
    const fetchClientSpecificData = async () => {
      if (!selectedClient) {
        setProjects([]);
        setMessages([]);
        return;
      }
      try {
        const projectsData = await projectService.getByClientId(selectedClient);
        setProjects(projectsData);
        await fetchMessages(selectedClient, selectedProject);
      } catch (err) {
        console.error("Failed to fetch client data:", err);
        setError("Failed to load data for the selected client.");
      }
    };
    fetchClientSpecificData();
  }, [selectedClient, selectedProject]);

  const handleSendMessage = async () => {
    if (!selectedClient || !messageData.message.trim()) {
      alert("Please select a client and enter a message.");
      return;
    }
    setSending(true);
    setError("");
    try {
      const client = clients.find((c) => c.id === selectedClient);
      if (!client) throw new Error("Client not found");

      const project = selectedProject
        ? projects.find((p) => p.id === selectedProject)
        : null;

      let processedMessage = messageData.message;
      let processedSubject = messageData.subject;

      const replacements: Record<string, string> = {
        "{client_name}": `${client.first_name} ${client.last_name}`,
        "{company}": client.company || "",
        "{project_title}": project?.project_title || "this project",
      };

      Object.entries(replacements).forEach(([placeholder, value]) => {
        processedMessage = processedMessage.replace(
          new RegExp(placeholder, "g"),
          value
        );
        processedSubject = processedSubject.replace(
          new RegExp(placeholder, "g"),
          value
        );
      });

      await messageService.create({
        client_id: selectedClient,
        project_id: selectedProject || undefined,
        sender_type: "admin",
        sender_name: user?.email || "Admin",
        message: processedMessage,
        is_read: false,
      });

      if (messageData.sendEmail) {
        console.log("Email would be sent to:", client.email);
        console.log("Subject:", processedSubject);
        console.log("Message:", processedMessage);
      }

      setMessageData((prev) => ({
        ...prev,
        message: "",
        subject: project ? prev.subject : "",
      }));
      alert("Message sent successfully!");

      await fetchMessages(selectedClient, selectedProject);
    } catch (err: any) {
      console.error("Failed to send message:", err);
      setError("Failed to send message: " + err.message);
    } finally {
      setSending(false);
    }
  };

  const handleTemplateSelect = (templateId: string) => {
    if (templateId === "none") {
      setMessageData((prev) => ({
        ...prev,
        subject: "",
        message: "",
        template: "",
      }));
      return;
    }
    const template = messageTemplates.find((t) => t.id === templateId);
    if (template) {
      setMessageData((prev) => ({
        ...prev,
        subject: template.subject,
        message: template.message,
        template: templateId,
      }));
    }
  };

  const filteredMessages = useMemo(
    () =>
      messages.filter((msg) => {
        const matchesSearch =
          msg.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
          msg.sender_name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus =
          statusFilter === "all" ||
          (statusFilter === "read" && msg.is_read) ||
          (statusFilter === "unread" && !msg.is_read);
        const matchesLevel =
          levelFilter === "all" ||
          (levelFilter === "client" && !msg.project_id) ||
          (levelFilter === "project" && !!msg.project_id);
        return matchesSearch && matchesStatus && matchesLevel;
      }),
    [messages, searchTerm, statusFilter, levelFilter]
  );

  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setLevelFilter("all");
  };

  return {
    clients,
    projects,
    messages,
    selectedClient,
    setSelectedClient,
    selectedProject,
    setSelectedProject,
    loading,
    sending,
    error,
    messageData,
    setMessageData,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    levelFilter,
    setLevelFilter,
    messageTemplates,
    filteredMessages,
    handleSendMessage,
    handleTemplateSelect,
    clearFilters,
  };
}
