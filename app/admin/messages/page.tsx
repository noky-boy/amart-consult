"use client";

import React, { useState, useEffect } from "react";
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
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Send,
  MessageSquare,
  Search,
  Filter,
  Plus,
  Eye,
  Clock,
  CheckCircle,
  Mail,
  Users,
  FileText,
  Paperclip,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { clientService, messageService } from "@/lib/supabase";
import type { Client, ClientMessage } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";

export default function MessagesSystem() {
  const [clients, setClients] = useState<Client[]>([]);
  const [messages, setMessages] = useState<ClientMessage[]>([]);
  const [selectedClient, setSelectedClient] = useState<string>("");
  const [activeTab, setActiveTab] = useState<
    "compose" | "conversations" | "templates"
  >("compose");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  const { user } = useAuth();

  // Compose message state
  const [messageData, setMessageData] = useState({
    subject: "",
    message: "",
    priority: "normal" as "low" | "normal" | "high",
    sendEmail: true,
    template: "",
  });

  // Conversation filters
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Message templates
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
  ];

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      const [clientsData] = await Promise.all([clientService.getAll()]);
      setClients(clientsData);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchClientMessages = async (clientId: string) => {
    try {
      const clientMessages = await messageService.getByClientId(clientId);
      setMessages(clientMessages);
      // Filter for unread messages sent by the client
      const unreadClientMessages = clientMessages.filter(
        (msg) => !msg.is_read && msg.sender_type === "client"
      );

      // Get the IDs of the unread messages
      const unreadClientMessageIds = unreadClientMessages.map((msg) => msg.id);

      // If there are unread messages, mark them as read
      if (unreadClientMessageIds.length > 0) {
        await messageService.markAsRead(unreadClientMessageIds);
      }

      // A better way is to update the state directly to avoid re-fetching
      // Update the local state to immediately reflect the change
      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          unreadClientMessageIds.includes(msg.id)
            ? { ...msg, is_read: true }
            : msg
        )
      );
    } catch (error) {
      console.error("Failed to fetch messages:", error);
    }
  };

  useEffect(() => {
    if (selectedClient && activeTab === "conversations") {
      fetchClientMessages(selectedClient);
    }
  }, [selectedClient, activeTab]);

  const handleSendMessage = async () => {
    if (!selectedClient || !messageData.message.trim()) {
      alert("Please select a client and enter a message");
      return;
    }

    setSending(true);

    try {
      const client = clients.find((c) => c.id === selectedClient);
      if (!client) throw new Error("Client not found");

      // Replace template variables
      let processedMessage = messageData.message;
      let processedSubject = messageData.subject;

      const replacements = {
        "{client_name}": `${client.first_name} ${client.last_name}`,
        "{project_title}": client.project_title,
        "{company}": client.company || "",
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

      // Save message to database
      await messageService.create({
        client_id: selectedClient,
        sender_type: "admin",
        sender_name: user?.email || "Admin",
        message: processedMessage,
        is_read: false,
      });

      // TODO: Send email if sendEmail is true
      if (messageData.sendEmail) {
        // Email sending logic would go here
        console.log("Email would be sent to:", client.email);
        console.log("Subject:", processedSubject);
        console.log("Message:", processedMessage);
      }

      // Reset form
      setMessageData({
        subject: "",
        message: "",
        priority: "normal",
        sendEmail: true,
        template: "",
      });

      alert("Message sent successfully!");

      // Refresh messages if viewing conversations
      if (activeTab === "conversations") {
        fetchClientMessages(selectedClient);
      }
    } catch (error: any) {
      console.error("Failed to send message:", error);
      alert("Failed to send message: " + error.message);
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

  const filteredMessages = messages.filter((msg) => {
    const matchesSearch =
      msg.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      msg.sender_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "read" && msg.is_read) ||
      (statusFilter === "unread" && !msg.is_read);
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/admin/dashboard">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <div className="h-6 w-px bg-slate-300" />
              <Image
                src="/images/amart-logo.png"
                alt="Amart Consult"
                width={120}
                height={40}
                className="h-8 w-auto"
              />
              <h1 className="text-xl font-semibold text-slate-900">Messages</h1>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant={activeTab === "compose" ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveTab("compose")}
              >
                <Send className="h-4 w-4 mr-2" />
                Compose
              </Button>
              <Button
                variant={activeTab === "conversations" ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveTab("conversations")}
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                Conversations
              </Button>
              <Button
                variant={activeTab === "templates" ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveTab("templates")}
              >
                <FileText className="h-4 w-4 mr-2" />
                Templates
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6">
        {activeTab === "compose" && (
          <div className="space-y-6">
            {/* Client Selection */}
            <Card>
              <CardHeader>
                <CardTitle>Send Message</CardTitle>
                <CardDescription>
                  Compose and send a message to a client
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Select Client</Label>
                    <Select
                      value={selectedClient}
                      onValueChange={setSelectedClient}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a client..." />
                      </SelectTrigger>
                      <SelectContent>
                        {clients.map((client) => (
                          <SelectItem key={client.id} value={client.id}>
                            {client.first_name} {client.last_name} -{" "}
                            {client.project_title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
                </div>

                <div className="space-y-2">
                  <Label>Subject (for email)</Label>
                  <Input
                    placeholder="Enter email subject..."
                    value={messageData.subject}
                    onChange={(e) =>
                      setMessageData((prev) => ({
                        ...prev,
                        subject: e.target.value,
                      }))
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label>Message</Label>
                  <Textarea
                    placeholder="Type your message here..."
                    value={messageData.message}
                    onChange={(e) =>
                      setMessageData((prev) => ({
                        ...prev,
                        message: e.target.value,
                      }))
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
                        <Clock className="h-4 w-4 mr-2 animate-spin" />
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
        )}

        {activeTab === "conversations" && (
          <div className="space-y-6">
            {/* Filters */}
            <Card>
              <CardHeader>
                <CardTitle>Message Conversations</CardTitle>
                <CardDescription>
                  View and manage client communications
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Select
                    value={selectedClient}
                    onValueChange={setSelectedClient}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select client..." />
                    </SelectTrigger>
                    <SelectContent>
                      {clients.map((client) => (
                        <SelectItem key={client.id} value={client.id}>
                          {client.first_name} {client.last_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      placeholder="Search messages..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>

                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="All messages" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Messages</SelectItem>
                      <SelectItem value="read">Read</SelectItem>
                      <SelectItem value="unread">Unread</SelectItem>
                    </SelectContent>
                  </Select>

                  <Button
                    variant="outline"
                    onClick={() => {
                      setSearchTerm("");
                      setStatusFilter("all");
                    }}
                  >
                    Clear Filters
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Messages List */}
            <Card>
              <CardHeader>
                <CardTitle>
                  Messages{" "}
                  {selectedClient &&
                    `with ${
                      clients.find((c) => c.id === selectedClient)?.first_name
                    } ${
                      clients.find((c) => c.id === selectedClient)?.last_name
                    }`}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {selectedClient ? (
                  filteredMessages.length > 0 ? (
                    <div className="space-y-4">
                      {filteredMessages.map((msg) => (
                        <div
                          key={msg.id}
                          className={`p-4 rounded-lg border ${
                            msg.sender_type === "admin"
                              ? "bg-indigo-50 border-indigo-200 ml-8"
                              : "bg-slate-50 border-slate-200 mr-8"
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <Badge
                                variant={
                                  msg.sender_type === "admin"
                                    ? "default"
                                    : "secondary"
                                }
                              >
                                {msg.sender_name}
                              </Badge>
                              {!msg.is_read && msg.sender_type === "client" && (
                                <Badge variant="destructive">Unread</Badge>
                              )}
                            </div>
                            <span className="text-sm text-slate-500">
                              {new Date(msg.created_at).toLocaleDateString()}{" "}
                              {new Date(msg.created_at).toLocaleTimeString()}
                            </span>
                          </div>
                          <p className="text-slate-900 whitespace-pre-wrap">
                            {msg.message}
                          </p>
                        </div>
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
                                <Clock className="h-4 w-4 animate-spin" />
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
                        No messages
                      </h3>
                      <p className="text-slate-600 mb-4">
                        No messages found for this client
                      </p>
                      <Button onClick={() => setActiveTab("compose")}>
                        <Plus className="h-4 w-4 mr-2" />
                        Send First Message
                      </Button>
                    </div>
                  )
                ) : (
                  <div className="text-center py-12">
                    <Users className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">
                      Select a Client
                    </h3>
                    <p className="text-slate-600">
                      Choose a client to view your conversation history
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "templates" && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Message Templates</CardTitle>
                <CardDescription>
                  Pre-written message templates for common communications
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {messageTemplates.map((template) => (
                    <Card key={template.id} className="border-slate-200">
                      <CardHeader>
                        <CardTitle className="text-lg">
                          {template.name}
                        </CardTitle>
                        <CardDescription>
                          Subject: {template.subject}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="bg-slate-50 p-4 rounded-lg">
                            <p className="text-sm text-slate-900 whitespace-pre-wrap">
                              {template.message.substring(0, 200)}...
                            </p>
                          </div>
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              onClick={() => {
                                handleTemplateSelect(template.id);
                                setActiveTab("compose");
                              }}
                            >
                              <Plus className="h-4 w-4 mr-2" />
                              Use Template
                            </Button>
                            <Button size="sm" variant="outline">
                              <Eye className="h-4 w-4 mr-2" />
                              Preview
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
