import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Download,
  Trash2,
  FolderOpen,
  File as FileIcon,
  FileText,
  Image as ImageIcon,
} from "lucide-react";
import type { ClientDocument } from "@/lib/supabase";
import { documentService } from "@/lib/supabase";

interface DocumentListProps {
  documents: ClientDocument[];
  onDelete: (doc: ClientDocument) => void;
}

export const DocumentList = ({ documents, onDelete }: DocumentListProps) => {
  const getFileIcon = (fileType: string = "") => {
    if (fileType.startsWith("image/"))
      return <ImageIcon className="h-5 w-5 text-slate-500" />;
    if (fileType.includes("pdf"))
      return <FileText className="h-5 w-5 text-slate-500" />;
    return <FileIcon className="h-5 w-5 text-slate-500" />;
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return "N/A";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const handleDownload = async (doc: ClientDocument) => {
    const url = await documentService.getDownloadUrl(doc.file_path);
    if (url) {
      // This method triggers a download directly
      const a = document.createElement("a");
      a.href = url;
      a.download = doc.file_name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } else {
      alert("Could not generate download link.");
    }
  };

  if (documents.length === 0) {
    return (
      <div className="text-center py-12 bg-slate-50 rounded-lg">
        <FolderOpen className="h-12 w-12 text-slate-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-slate-800">
          No Documents Found
        </h3>
        <p className="text-slate-600">
          No documents match your current filters.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {documents.map((doc) => (
        <div
          key={doc.id}
          className="flex items-center justify-between p-3 border rounded-lg bg-white hover:border-indigo-300 transition-all"
        >
          <div className="flex items-center gap-4 flex-1 min-w-0">
            {getFileIcon(doc.file_type)}
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-slate-900 truncate">
                {doc.title}
              </h4>
              <div className="flex items-center gap-2 flex-wrap mt-1">
                <span className="text-xs text-slate-500">
                  {formatFileSize(doc.file_size)}
                </span>
                <span className="text-xs text-slate-500">•</span>
                <span className="text-xs text-slate-500">
                  {new Date(doc.created_at).toLocaleDateString()}
                </span>
                {doc.category && (
                  <Badge variant="secondary">{doc.category}</Badge>
                )}
                {!doc.project_id && (
                  <Badge variant="outline">Client-Level</Badge>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1 ml-2">
            <Button
              variant="ghost"
              size="icon"
              title="Download"
              onClick={() => handleDownload(doc)}
            >
              <Download className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              title="Delete"
              className="text-red-600 hover:text-red-700"
              onClick={() => onDelete(doc)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};
