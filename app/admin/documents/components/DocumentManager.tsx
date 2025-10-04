import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Search, Folder } from "lucide-react";
import type { Client, ClientDocument } from "@/lib/supabase";
import { DocumentList } from "./DocumentList";

interface DocumentManagerProps {
  clients: Client[];
  documents: ClientDocument[];
  availableCategories: string[];
  selectedClient: string;
  setSelectedClient: (id: string) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  categoryFilter: string;
  setCategoryFilter: (cat: string) => void;
  levelFilter: string;
  setLevelFilter: (level: any) => void;
  onDelete: (doc: ClientDocument) => void;
}

export const DocumentManager = ({
  clients,
  documents,
  availableCategories,
  selectedClient,
  setSelectedClient,
  searchTerm,
  setSearchTerm,
  categoryFilter,
  setCategoryFilter,
  levelFilter,
  setLevelFilter,
  onDelete,
}: DocumentManagerProps) => {
  if (!selectedClient) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <Folder className="h-12 w-12 text-slate-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-800">
            Select a Client
          </h3>
          <p className="text-slate-600">
            Choose a client from the dropdown to view their documents.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Filter Documents</CardTitle>
          <CardDescription>
            Find specific documents for the selected client.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          <Select
            value={selectedClient}
            onValueChange={(val) => setSelectedClient(val)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a client..." />
            </SelectTrigger>
            <SelectContent>
              {clients.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.first_name} {c.last_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search by title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger>
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {availableCategories.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={levelFilter}
            onValueChange={(val: any) => setLevelFilter(val)}
          >
            <SelectTrigger>
              <SelectValue placeholder="All Levels" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Levels</SelectItem>
              <SelectItem value="client">Client-Level Only</SelectItem>
              <SelectItem value="project">Project-Specific Only</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Document List</CardTitle>
        </CardHeader>
        <CardContent>
          <DocumentList documents={documents} onDelete={onDelete} />
        </CardContent>
      </Card>
    </div>
  );
};
