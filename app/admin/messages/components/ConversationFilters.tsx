"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { Search } from "lucide-react";
import type { UseMessageSystemReturn } from "../useMessageSystem";

type ConversationFiltersProps = Pick<
  UseMessageSystemReturn,
  | "clients"
  | "projects"
  | "selectedClient"
  | "setSelectedClient"
  | "selectedProject"
  | "setSelectedProject"
  | "searchTerm"
  | "setSearchTerm"
  | "statusFilter"
  | "setStatusFilter"
  | "levelFilter"
  | "setLevelFilter"
  | "clearFilters"
>;

export function ConversationFilters({
  clients,
  projects,
  selectedClient,
  setSelectedClient,
  selectedProject,
  setSelectedProject,
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  levelFilter,
  setLevelFilter,
  clearFilters,
}: ConversationFiltersProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Message Conversations</CardTitle>
        <CardDescription>View and manage client communications</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
          <Select
            value={selectedClient}
            onValueChange={(value) => {
              setSelectedClient(value);
              setSelectedProject("");
            }}
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

          <Select
            value={selectedProject || "all"}
            onValueChange={(val) =>
              setSelectedProject(val === "all" ? "" : val)
            }
            disabled={!selectedClient}
          >
            <SelectTrigger>
              <SelectValue placeholder="All projects" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Projects</SelectItem>
              {projects.map((project) => (
                <SelectItem key={project.id} value={project.id}>
                  {project.project_title}
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

          <Select
            value={levelFilter}
            onValueChange={(value: any) => setLevelFilter(value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="All levels" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Levels</SelectItem>
              <SelectItem value="client">Client-level Only</SelectItem>
              <SelectItem value="project">Project-specific Only</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" onClick={clearFilters}>
            Clear
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
