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
  Upload,
  File,
  X,
  Check,
  Download,
  Eye,
  Trash2,
  Search,
  Filter,
  Folder,
  FileText,
  Image as ImageIcon,
  Video,
  Archive,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { clientService, documentService } from "@/lib/supabase";
import type { Client, ClientDocument } from "@/lib/supabase";

export default function FileUploadSystem() {
  const [clients, setClients] = useState<Client[]>([]);
  const [documents, setDocuments] = useState<ClientDocument[]>([]);
  const [selectedClient, setSelectedClient] = useState<string>("");
  const [files, setFiles] = useState<File[]>([]);
  const [uploadMetadata, setUploadMetadata] = useState({
    title: "",
    description: "",
    category: "",
    tags: "",
  });
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>(
    {}
  );
  const [activeTab, setActiveTab] = useState<"upload" | "manage">("upload");
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      const [clientsData] = await Promise.all([clientService.getAll()]);
      setClients(clientsData);
      if (clientsData.length > 0) {
        await fetchDocuments(clientsData[0].id);
      }
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDocuments = async (clientId?: string) => {
    if (!clientId && !selectedClient) return;

    try {
      const docs = await documentService.getByClientId(
        clientId || selectedClient
      );
      setDocuments(docs);
    } catch (error) {
      console.error("Failed to fetch documents:", error);
    }
  };

  useEffect(() => {
    if (selectedClient) {
      fetchDocuments(selectedClient);
    }
  }, [selectedClient]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles((prev) => [...prev, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (!selectedClient || files.length === 0) {
      alert("Please select a client and at least one file");
      return;
    }

    setIsUploading(true);

    try {
      const uploadPromises = files.map(async (file, index) => {
        const fileKey = `${file.name}-${index}`;
        setUploadProgress((prev) => ({ ...prev, [fileKey]: 0 }));

        // Simulate progress for better UX
        const progressInterval = setInterval(() => {
          setUploadProgress((prev) => ({
            ...prev,
            [fileKey]: Math.min((prev[fileKey] || 0) + 10, 90),
          }));
        }, 100);

        try {
          await documentService.upload(file, selectedClient, {
            title: uploadMetadata.title || file.name,
            description: uploadMetadata.description,
            category: uploadMetadata.category,
            tags: uploadMetadata.tags
              .split(",")
              .map((tag) => tag.trim())
              .filter(Boolean),
          });

          clearInterval(progressInterval);
          setUploadProgress((prev) => ({ ...prev, [fileKey]: 100 }));
        } catch (error) {
          clearInterval(progressInterval);
          throw error;
        }
      });

      await Promise.all(uploadPromises);

      // Reset form
      setFiles([]);
      setUploadMetadata({ title: "", description: "", category: "", tags: "" });

      // Refresh documents list
      await fetchDocuments();

      alert("Files uploaded successfully!");
    } catch (error: any) {
      console.error("Upload failed:", error);
      alert("Upload failed: " + error.message);
    } finally {
      setIsUploading(false);
      setUploadProgress({});
    }
  };

  const handleDeleteDocument = async (docId: string) => {
    if (!confirm("Are you sure you want to delete this document?")) return;

    try {
      // Note: You'll need to add a delete method to documentService
      await documentService.delete(docId);
      setDocuments((docs) => docs.filter((doc) => doc.id !== docId));
    } catch (error) {
      console.error("Failed to delete document:", error);
    }
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith("image/")) return <ImageIcon className="h-5 w-5" />;
    if (fileType.startsWith("video/")) return <Video className="h-5 w-5" />;
    if (fileType.includes("pdf")) return <FileText className="h-5 w-5" />;
    if (fileType.includes("zip") || fileType.includes("rar"))
      return <Archive className="h-5 w-5" />;
    return <File className="h-5 w-5" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch =
      doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (doc.description &&
        doc.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory =
      categoryFilter === "all" || doc.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const categories = Array.from(
    new Set(documents.map((doc) => doc.category).filter(Boolean))
  );

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
              <h1 className="text-xl font-semibold text-slate-900">
                Document Management
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant={activeTab === "upload" ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveTab("upload")}
              >
                <Upload className="h-4 w-4 mr-2" />
                Upload Files
              </Button>
              <Button
                variant={activeTab === "manage" ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveTab("manage")}
              >
                <Folder className="h-4 w-4 mr-2" />
                Manage Files
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6">
        {activeTab === "upload" ? (
          // Upload Tab
          <div className="space-y-6">
            {/* Client Selection */}
            <Card>
              <CardHeader>
                <CardTitle>Select Client</CardTitle>
                <CardDescription>
                  Choose which client these files belong to
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Select
                  value={selectedClient}
                  onValueChange={setSelectedClient}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a client..." />
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
              </CardContent>
            </Card>

            {/* File Upload */}
            <Card>
              <CardHeader>
                <CardTitle>Upload Files</CardTitle>
                <CardDescription>
                  Upload documents, images, or other files for the selected
                  client
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* File Metadata */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Document Title (Optional)</Label>
                    <Input
                      placeholder="Leave empty to use filename"
                      value={uploadMetadata.title}
                      onChange={(e) =>
                        setUploadMetadata((prev) => ({
                          ...prev,
                          title: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Category</Label>
                    <Select
                      value={uploadMetadata.category}
                      onValueChange={(value) =>
                        setUploadMetadata((prev) => ({
                          ...prev,
                          category: value,
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="plans">Project Plans</SelectItem>
                        <SelectItem value="contracts">Contracts</SelectItem>
                        <SelectItem value="specifications">
                          Specifications
                        </SelectItem>
                        <SelectItem value="photos">Photos</SelectItem>
                        <SelectItem value="reports">Reports</SelectItem>
                        <SelectItem value="presentations">
                          Presentations
                        </SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea
                    placeholder="Brief description of the files"
                    value={uploadMetadata.description}
                    onChange={(e) =>
                      setUploadMetadata((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    className="min-h-[80px]"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Tags (comma separated)</Label>
                  <Input
                    placeholder="e.g. architectural, final, approved"
                    value={uploadMetadata.tags}
                    onChange={(e) =>
                      setUploadMetadata((prev) => ({
                        ...prev,
                        tags: e.target.value,
                      }))
                    }
                  />
                </div>

                {/* File Drop Zone */}
                <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center hover:border-indigo-400 transition-colors">
                  <Upload className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-slate-900 mb-2">
                    Drop files here or click to browse
                  </h3>
                  <p className="text-slate-600 mb-4">
                    Support for PDF, DOC, DWG, JPG, PNG files up to 50MB each
                  </p>
                  <input
                    type="file"
                    multiple
                    onChange={handleFileSelect}
                    className="hidden"
                    id="file-upload"
                    accept=".pdf,.doc,.docx,.dwg,.jpg,.jpeg,.png,.xlsx,.xls,.zip,.rar"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() =>
                      document.getElementById("file-upload")?.click()
                    }
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Select Files
                  </Button>
                </div>

                {/* Selected Files */}
                {files.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="font-medium text-slate-900">
                      Selected Files ({files.length})
                    </h4>
                    {files.map((file, index) => {
                      const fileKey = `${file.name}-${index}`;
                      const progress = uploadProgress[fileKey] || 0;
                      return (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            {getFileIcon(file.type)}
                            <div>
                              <p className="font-medium text-slate-900">
                                {file.name}
                              </p>
                              <p className="text-sm text-slate-600">
                                {formatFileSize(file.size)}
                              </p>
                              {isUploading && progress > 0 && (
                                <div className="w-48 bg-slate-200 rounded-full h-2 mt-1">
                                  <div
                                    className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                                    style={{ width: `${progress}%` }}
                                  ></div>
                                </div>
                              )}
                            </div>
                          </div>
                          {!isUploading && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeFile(index)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          )}
                          {isUploading && progress === 100 && (
                            <Check className="h-5 w-5 text-green-600" />
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Upload Button */}
                <div className="flex justify-end pt-4">
                  <Button
                    onClick={handleUpload}
                    disabled={
                      files.length === 0 || !selectedClient || isUploading
                    }
                    className="bg-indigo-600 hover:bg-indigo-700"
                  >
                    {isUploading ? (
                      <>
                        <Upload className="h-4 w-4 mr-2 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Check className="h-4 w-4 mr-2" />
                        Upload Files
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          // Manage Tab
          <div className="space-y-6">
            {/* Client and Search Filters */}
            <Card>
              <CardHeader>
                <CardTitle>File Management</CardTitle>
                <CardDescription>
                  View and manage uploaded files
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
                      placeholder="Search files..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>

                  <Select
                    value={categoryFilter}
                    onValueChange={setCategoryFilter}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Button
                    variant="outline"
                    onClick={() => {
                      setSearchTerm("");
                      setCategoryFilter("all");
                    }}
                  >
                    Clear Filters
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Files List */}
            <Card>
              <CardHeader>
                <CardTitle>
                  Files{" "}
                  {selectedClient &&
                    `for ${
                      clients.find((c) => c.id === selectedClient)?.first_name
                    } ${
                      clients.find((c) => c.id === selectedClient)?.last_name
                    }`}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {selectedClient ? (
                  filteredDocuments.length > 0 ? (
                    <div className="space-y-3">
                      {filteredDocuments.map((doc) => (
                        <div
                          key={doc.id}
                          className="flex items-center justify-between p-4 border border-slate-200 rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            {getFileIcon(doc.file_type || "")}
                            <div className="flex-1">
                              <h4 className="font-medium text-slate-900">
                                {doc.title}
                              </h4>
                              <p className="text-sm text-slate-600">
                                {doc.description}
                              </p>
                              <div className="flex items-center gap-2 mt-1">
                                {doc.category && (
                                  <Badge variant="secondary">
                                    {doc.category}
                                  </Badge>
                                )}
                                <span className="text-xs text-slate-500">
                                  {doc.file_size &&
                                    formatFileSize(doc.file_size)}{" "}
                                  •{" "}
                                  {new Date(
                                    doc.created_at
                                  ).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={async () => {
                                const url =
                                  await documentService.getDownloadUrl(
                                    doc.file_path
                                  );
                                if (url) window.open(url, "_blank");
                              }}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={async () => {
                                const url =
                                  await documentService.getDownloadUrl(
                                    doc.file_path
                                  );
                                if (url) {
                                  const a = document.createElement("a");
                                  a.href = url;
                                  a.download = doc.file_name;
                                  a.click();
                                }
                              }}
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteDocument(doc.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Folder className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-slate-900 mb-2">
                        No files found
                      </h3>
                      <p className="text-slate-600 mb-4">
                        {documents.length === 0
                          ? "No files have been uploaded for this client yet"
                          : "No files match your current filters"}
                      </p>
                      <Button onClick={() => setActiveTab("upload")}>
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Files
                      </Button>
                    </div>
                  )
                ) : (
                  <div className="text-center py-12">
                    <Folder className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">
                      Select a Client
                    </h3>
                    <p className="text-slate-600">
                      Choose a client to view their files
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
