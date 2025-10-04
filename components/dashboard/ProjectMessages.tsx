// amart-consult/components/dashboard/ProjectMessages.tsx
"use client";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MessageSquare, Send, Loader2 } from "lucide-react";
import { formatTimestamp } from "@/lib/dashboardUtils";
import { messageService } from "@/lib/supabase";
import type { ClientMessage, Client, User, Project } from "@/lib/supabase";

type ProjectMessagesProps = {
  messages: ClientMessage[];
  client: Client;
  project: Project;
  user: User;
  onNewMessage: (newMessages: ClientMessage[]) => void;
};

export default function ProjectMessages({
  messages,
  client,
  project,
  user,
  onNewMessage,
}: ProjectMessagesProps) {
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    setSending(true);
    try {
      // Create the message with project_id since this is project-specific
      await messageService.create({
        client_id: client.id,
        project_id: project.id, // ← IMPORTANT: Include project_id
        sender_type: "client",
        sender_name: `${client.first_name} ${client.last_name}`,
        message: newMessage,
        is_read: false,
      });

      setNewMessage("");

      // Fetch messages by project_id (not client_id)
      const updatedMessages = await messageService.getByProjectId(project.id);
      onNewMessage(updatedMessages);
    } catch (error: any) {
      console.error("Failed to send message:", error);
      alert(`Failed to send message: ${error.message}`);
    } finally {
      setSending(false);
    }
  };

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <MessageSquare className="h-5 w-5 text-blue-600" />
          <span>Project Communication</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-96 overflow-y-auto space-y-4 mb-4 p-4 bg-slate-50 rounded-lg border">
          {messages.length > 0 ? (
            messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${
                  msg.sender_type === "client" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl shadow-sm ${
                    msg.sender_type === "client"
                      ? "bg-gradient-to-r from-indigo-600 to-indigo-700 text-white"
                      : "bg-white text-slate-900 border"
                  }`}
                >
                  <p className="text-sm">{msg.message}</p>
                  <p
                    className={`text-xs mt-1 ${
                      msg.sender_type === "client"
                        ? "text-indigo-200"
                        : "text-slate-400"
                    }`}
                  >
                    {formatTimestamp(msg.created_at)}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <p className="text-slate-600">
                No messages yet. Start a conversation!
              </p>
            </div>
          )}
        </div>
        <div className="flex space-x-3">
          <Textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1"
            rows={2}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
          />
          <Button
            onClick={handleSendMessage}
            disabled={!newMessage.trim() || sending}
          >
            {sending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
