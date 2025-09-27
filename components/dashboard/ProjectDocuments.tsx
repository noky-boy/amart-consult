// amart-consult/components/dashboard/ProjectDocuments.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Eye, Download } from "lucide-react";
import { documentService } from "@/lib/supabase";
import type { ClientDocument } from "@/lib/supabase";

type ProjectDocumentsProps = {
  documents: ClientDocument[];
};

export default function ProjectDocuments({ documents }: ProjectDocumentsProps) {
  const handleDownload = async (doc: ClientDocument) => {
    try {
      const url = await documentService.getDownloadUrl(doc.file_path);
      if (url) {
        const a = document.createElement("a");
        a.href = url;
        a.download = doc.title;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }
    } catch (error) {
      console.error("Failed to download document:", error);
      alert("Failed to download document.");
    }
  };

  const handleView = async (doc: ClientDocument) => {
    try {
      const url = await documentService.getDownloadUrl(doc.file_path);
      if (url) window.open(url, "_blank");
    } catch (error) {
      console.error("Failed to view document:", error);
      alert("Failed to view document.");
    }
  };

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <FileText className="h-5 w-5 text-green-600" />
          <span>Project Documents</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {documents.length > 0 ? (
          <div className="space-y-4">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200 hover:bg-slate-100 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <FileText className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">{doc.title}</p>
                    {doc.category && (
                      <Badge variant="secondary" className="text-xs mt-1">
                        {doc.category}
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleView(doc)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDownload(doc)}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              No Documents Available
            </h3>
            <p className="text-slate-600">
              Project documents will appear here when they're ready for review.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
