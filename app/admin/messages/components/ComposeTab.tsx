"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Send, Loader2, FolderOpen } from "lucide-react";
import type { UseMessageSystemReturn } from "../useMessageSystem";

type ComposeTabProps = Omit<
  UseMessageSystemReturn,
  | "filteredMessages"
  | "messages"
  | "searchTerm"
  | "setSearchTerm"
  | "statusFilter"
  | "setStatusFilter"
  | "levelFilter"
  | "setLevelFilter"
  | "clearFilters"
>;

export function ComposeTab({
  clients,
  projects,
  selectedClient,
  setSelectedClient,
  selectedProject,
  setSelectedProject,
  sending,
  messageData,
  setMessageData,
  messageTemplates,
  handleSendMessage,
  handleTemplateSelect,
}: ComposeTabProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Send Message</CardTitle>
          <CardDescription>
            Compose and send a message to a client at the client or project
            level.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Select Client *</Label>
              <Select
                value={selectedClient}
                onValueChange={(value) => {
                  setSelectedClient(value);
                  setSelectedProject("");
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose a client..." />
                </SelectTrigger>
                <SelectContent>
                  {clients.map((client) => (
                    <SelectItem key={client.id} value={client.id}>
                      {client.first_name} {client.last_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Project (Optional)</Label>
              <Select
                value={selectedProject}
                onValueChange={setSelectedProject}
                disabled={!selectedClient || projects.length === 0}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All projects (Client-level)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">
                    <div className="flex items-center gap-2">
                      <FolderOpen className="h-4 w-4" />
                      All Projects (Client-level)
                    </div>
                  </SelectItem>
                  {projects.map((project) => (
                    <SelectItem key={project.id} value={project.id}>
                      {project.project_title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedClient && projects.length === 0 && (
                <p className="text-sm text-slate-500">
                  No projects for this client yet.
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Use Template</Label>
            <Select
              value={messageData.template}
              onValueChange={handleTemplateSelect}
            >
              <SelectTrigger>
                <SelectValue placeholder="Choose a template..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No Template</SelectItem>
                {messageTemplates.map((template) => (
                  <SelectItem key={template.id} value={template.id}>
                    {template.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Subject (for email)</Label>
            <Input
              placeholder="Enter email subject..."
              value={messageData.subject}
              onChange={(e) =>
                setMessageData((prev) => ({ ...prev, subject: e.target.value }))
              }
            />
          </div>

          <div className="space-y-2">
            <Label>Message *</Label>
            <Textarea
              placeholder="Type your message here..."
              value={messageData.message}
              onChange={(e) =>
                setMessageData((prev) => ({ ...prev, message: e.target.value }))
              }
              className="min-h-[200px]"
            />
            <p className="text-sm text-slate-500">
              You can use placeholders:{" "}
              {"{client_name}, {project_title}, {company}"}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Priority</Label>
              <Select
                value={messageData.priority}
                onValueChange={(value: "low" | "normal" | "high") =>
                  setMessageData((prev) => ({ ...prev, priority: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low Priority</SelectItem>
                  <SelectItem value="normal">Normal Priority</SelectItem>
                  <SelectItem value="high">High Priority</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2 pt-6">
              <input
                type="checkbox"
                id="sendEmail"
                checked={messageData.sendEmail}
                onChange={(e) =>
                  setMessageData((prev) => ({
                    ...prev,
                    sendEmail: e.target.checked,
                  }))
                }
                className="rounded"
              />
              <Label htmlFor="sendEmail">Also send as email</Label>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <Button
              onClick={handleSendMessage}
              disabled={
                !selectedClient || !messageData.message.trim() || sending
              }
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              {sending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Send Message
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
