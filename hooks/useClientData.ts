// amart-consult/hooks/useClientData.ts
import { useState, useEffect, useCallback } from "react";
import { useRequireAuth } from "@/hooks/useClientAuth";
import { phaseService, documentService, messageService } from "@/lib/supabase";
import type {
  ProjectPhase,
  ClientDocument,
  ClientMessage,
} from "@/lib/supabase";

export const useClientData = () => {
  const { user, client, loading: authLoading } = useRequireAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [milestones, setMilestones] = useState<ProjectPhase[]>([]);
  const [documents, setDocuments] = useState<ClientDocument[]>([]);
  const [messages, setMessages] = useState<ClientMessage[]>([]);

  const fetchClientData = useCallback(async (clientId: string) => {
    try {
      setLoading(true);
      setError("");

      const [milestonesData, documentsData, messagesData] = await Promise.all([
        phaseService.getByProjectId(clientId).catch(() => []),
        documentService.getByClientId(clientId).catch(() => []),
        messageService.getByClientId(clientId).catch(() => []),
      ]);

      setMilestones(milestonesData);
      setDocuments(documentsData);
      setMessages(messagesData);
    } catch (err) {
      console.error("Failed to fetch client data:", err);
      setError("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (client?.id) {
      fetchClientData(client.id);
    }
  }, [client?.id, fetchClientData]);

  const markAdminMessagesAsRead = async () => {
    if (!client?.id) return;

    const unreadAdminMessages = messages.filter(
      (msg) => msg.sender_type === "admin" && !msg.is_read
    );

    if (unreadAdminMessages.length > 0) {
      const messageIds = unreadAdminMessages.map((msg) => msg.id);
      try {
        await messageService.markAsRead(messageIds);
        // Update local state to reflect the change immediately
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
    user,
    client,
    authLoading,
    loading,
    error,
    milestones,
    documents,
    messages,
    photos,
    unreadMessagesCount,
    setMessages,
    refreshData: () => client?.id && fetchClientData(client.id),
    markAdminMessagesAsRead,
  };
};
