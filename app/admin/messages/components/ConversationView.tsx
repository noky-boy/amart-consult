"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Users, MessageSquare, Plus, Send, Loader2 } from "lucide-react";
import { MessageItem } from "./MessageItem";
import type { UseMessageSystemReturn } from "../useMessageSystem";

type ConversationViewProps = Pick<
  UseMessageSystemReturn,
  | "clients"
  | "projects"
  | "selectedClient"
  | "selectedProject"
  | "filteredMessages"
  | "messages"
  | "sending"
  | "messageData"
  | "setMessageData"
  | "handleSendMessage"
> & {
  setActiveTab: (tab: "compose") => void;
};

export function ConversationView({
  clients,
  projects,
  selectedClient,
  selectedProject,
  filteredMessages,
  messages,
  sending,
  messageData,
  setMessageData,
  handleSendMessage,
  setActiveTab,
}: ConversationViewProps) {
  const client = clients.find((c) => c.id === selectedClient);
  const project = projects.find((p) => p.id === selectedProject);

  const getTitle = () => {
    if (!client) return "Messages";
    let title = `with ${client.first_name} ${client.last_name}`;
    if (project) {
      title += ` - ${project.project_title}`;
    }
    return title;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Messages
          {selectedClient && (
            <span className="text-slate-600 font-normal ml-2">
              {getTitle()}
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!selectedClient ? (
          <div className="text-center py-12">
            <Users className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              Select a Client
            </h3>
            <p className="text-slate-600">
              Choose a client to view conversation history.
            </p>
          </div>
        ) : filteredMessages.length > 0 ? (
          <div className="space-y-4">
            {filteredMessages.map((msg) => (
              <MessageItem key={msg.id} msg={msg} />
            ))}
            <div className="pt-4">
              <Card>
                <CardContent className="pt-6 flex items-end gap-2">
                  <Textarea
                    placeholder="Type your reply here..."
                    value={messageData.message}
                    onChange={(e) =>
                      setMessageData((prev) => ({
                        ...prev,
                        message: e.target.value,
                      }))
                    }
                    className="flex-grow min-h-[50px]"
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!messageData.message.trim() || sending}
                    size="icon"
                    className="flex-shrink-0"
                  >
                    {sending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <MessageSquare className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              No Messages
            </h3>
            <p className="text-slate-600 mb-4">
              {messages.length === 0
                ? "No messages found for this client."
                : "No messages match your current filters."}
            </p>
            <Button onClick={() => setActiveTab("compose")}>
              <Plus className="h-4 w-4 mr-2" />
              Send First Message
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
