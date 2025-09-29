import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  SelectGroup,
  SelectLabel,
} from "@/components/ui/select";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { documentService } from "@/lib/supabase";
import type { Client, Project } from "@/lib/supabase";
import { Upload, X, Loader2, FolderOpen } from "lucide-react";
import { groupedCategories } from "./constants"; // Import from our new constants file

interface DocumentUploaderProps {
  clients: Client[];
  projects: Project[];
  selectedClient: string;
  setSelectedClient: (id: string) => void;
  selectedProject: string;
  setSelectedProject: (id: string) => void;
  onUploadComplete: () => void;
}

export const DocumentUploader = ({
  clients,
  projects,
  selectedClient,
  setSelectedClient,
  selectedProject,
  setSelectedProject,
  onUploadComplete,
}: DocumentUploaderProps) => {
  const [files, setFiles] = useState<File[]>([]);
  const [metadata, setMetadata] = useState({
    category: "",
    description: "",
    tags: "",
  });
  const [isUploading, setIsUploading] = useState(false);

  const formatFileSize = (bytes: number) => {
    if (!bytes) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      const oversized = newFiles.filter((f) => f.size > 50 * 1024 * 1024); // 50MB limit
      if (oversized.length > 0) {
        alert(
          `Error: The following files exceed the 50MB size limit: ${oversized
            .map((f) => f.name)
            .join(", ")}`
        );
        return;
      }
      setFiles((prev) => [...prev, ...newFiles]);
    }
  };

  const removeFile = (index: number) =>
    setFiles((prev) => prev.filter((_, i) => i !== index));

  const handleUpload = async () => {
    if (!selectedClient || files.length === 0 || !metadata.category) {
      alert("Please select a client, a category, and at least one file.");
      return;
    }
    setIsUploading(true);

    const uploadPromises = files.map((file) =>
      documentService.upload(file, selectedClient, {
        title: file.name,
        description: metadata.description,
        category: metadata.category,
        tags: metadata.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean),
        projectId: selectedProject || undefined,
      })
    );

    try {
      await Promise.all(uploadPromises);
      alert(`${files.length} file(s) uploaded successfully!`);
      setFiles([]);
      setMetadata({ category: "", description: "", tags: "" });
      onUploadComplete();
    } catch (err: any) {
      alert("Upload failed: " + err.message);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>1. Select Destination</CardTitle>
          <CardDescription>
            Choose a client and, optionally, a specific project.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Client *</Label>
            <Select
              value={selectedClient}
              onValueChange={(val) => {
                setSelectedClient(val);
                setSelectedProject("");
              }}
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
          </div>
          <div className="space-y-2">
            <Label>Project (Optional)</Label>
            <Select
              value={selectedProject || "none"}
              onValueChange={(val) =>
                setSelectedProject(val === "none" ? "" : val)
              }
              disabled={!selectedClient || projects.length === 0}
            >
              <SelectTrigger>
                <SelectValue placeholder="Client-level (no specific project)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">
                  <div className="flex items-center gap-2">
                    <FolderOpen className="h-4 w-4" /> Client-level
                  </div>
                </SelectItem>
                {projects.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.project_title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedClient && projects.length === 0 && (
              <p className="text-sm text-slate-500 mt-1">
                No projects found for this client.
              </p>
            )}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>2. Add Document Details</CardTitle>
          <CardDescription>
            Provide a category and other details for the files.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Category *</Label>
            <Select
              value={metadata.category}
              onValueChange={(val) =>
                setMetadata((p) => ({ ...p, category: val }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a document category..." />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(groupedCategories).map(([group, cats]) => (
                  <SelectGroup key={group}>
                    <SelectLabel>{group}</SelectLabel>
                    {cats.map((c) => (
                      <SelectItem key={c.value} value={c.value}>
                        {c.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea
              placeholder="Briefly describe the purpose of these files..."
              value={metadata.description}
              onChange={(e) =>
                setMetadata((p) => ({ ...p, description: e.target.value }))
              }
            />
          </div>
          <div className="space-y-2">
            <Label>Tags (comma-separated)</Label>
            <Input
              placeholder="e.g. final, approved, for-review"
              value={metadata.tags}
              onChange={(e) =>
                setMetadata((p) => ({ ...p, tags: e.target.value }))
              }
            />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>3. Upload Files</CardTitle>
          <CardDescription>
            Select one or more files (max 50MB each).
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center hover:border-indigo-500 transition-colors">
            <input
              type="file"
              multiple
              onChange={handleFileSelect}
              className="hidden"
              id="file-upload"
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => document.getElementById("file-upload")?.click()}
            >
              <Upload className="h-4 w-4 mr-2" />
              Select Files
            </Button>
            <p className="text-xs text-slate-500 mt-2">
              PDF, JPG, PNG, DOCX, etc.
            </p>
          </div>
          {files.length > 0 && (
            <div className="space-y-2 max-h-60 overflow-y-auto p-1">
              <h4 className="font-medium text-slate-800">
                {files.length} File(s) Selected
              </h4>
              {files.map((file, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-2 bg-slate-50 rounded-lg"
                >
                  <div className="flex flex-col text-sm min-w-0">
                    <span className="font-medium text-slate-900 truncate">
                      {file.name}
                    </span>
                    <span className="text-slate-600">
                      {formatFileSize(file.size)}
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-red-500 hover:text-red-600"
                    onClick={() => removeFile(i)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
          <div className="flex justify-end">
            <Button
              onClick={handleUpload}
              disabled={
                isUploading ||
                files.length === 0 ||
                !selectedClient ||
                !metadata.category
              }
            >
              {isUploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                "Upload Files"
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
