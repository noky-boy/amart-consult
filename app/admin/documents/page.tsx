"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowLeft, Upload, Folder, Loader2, AlertCircle } from "lucide-react";
import { useDocumentManagement } from "./useDocumentManagement";
import { DocumentUploader } from "./components/DocumentUploader";
import { DocumentManager } from "./components/DocumentManager";

function DocumentManagementContent() {
  const [activeTab, setActiveTab] = useState<"upload" | "manage">("upload");
  const {
    clients,
    projects,
    filteredDocuments,
    availableCategories,
    loading,
    error,
    selectedClient,
    setSelectedClient,
    selectedProject,
    setSelectedProject,
    searchTerm,
    setSearchTerm,
    categoryFilter,
    setCategoryFilter,
    levelFilter,
    setLevelFilter,
    handleDeleteDocument,
    refreshDocuments,
  } = useDocumentManagement();

  const handleUploadComplete = () => {
    refreshDocuments();
    setActiveTab("manage");
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-12 w-12 text-indigo-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="px-4 sm:px-6 py-3 sm:py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-2 sm:gap-4 flex-1 min-w-0">
            <Link href="/admin/dashboard">
              <Button variant="ghost" size="sm" className="text-xs sm:text-sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Back to Dashboard</span>
                <span className="sm:hidden">Back</span>
              </Button>
            </Link>
            <div className="h-6 w-px bg-slate-300 hidden sm:block" />
            <Image
              src="/images/amart-logo.png"
              alt="Amart Consult"
              width={120}
              height={40}
              className="h-6 sm:h-8 w-auto hidden sm:block"
            />
            <h1 className="text-base sm:text-xl font-semibold text-slate-900 truncate">
              Document Management
            </h1>
          </div>
          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            <Button
              variant={activeTab === "upload" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveTab("upload")}
              className="flex-1 sm:flex-none"
            >
              <Upload className="h-4 w-4 mr-2" />
              Upload Files
            </Button>
            <Button
              variant={activeTab === "manage" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveTab("manage")}
              className="flex-1 sm:flex-none"
            >
              <Folder className="h-4 w-4 mr-2" />
              Manage Files
            </Button>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto p-6">
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {activeTab === "upload" ? (
          <DocumentUploader
            clients={clients}
            projects={projects}
            selectedClient={selectedClient}
            setSelectedClient={setSelectedClient}
            selectedProject={selectedProject}
            setSelectedProject={setSelectedProject}
            onUploadComplete={handleUploadComplete}
          />
        ) : (
          <DocumentManager
            clients={clients}
            documents={filteredDocuments}
            availableCategories={availableCategories}
            selectedClient={selectedClient}
            setSelectedClient={setSelectedClient}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            categoryFilter={categoryFilter}
            setCategoryFilter={setCategoryFilter}
            levelFilter={levelFilter}
            setLevelFilter={setLevelFilter}
            onDelete={handleDeleteDocument}
          />
        )}
      </main>
    </div>
  );
}

export default function DocumentManagementPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center">
          <Loader2 className="h-12 w-12 text-indigo-600 animate-spin" />
        </div>
      }
    >
      <DocumentManagementContent />
    </Suspense>
  );
}
