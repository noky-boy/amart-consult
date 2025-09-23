import { type NextRequest, NextResponse } from "next/server";
import { documentService } from "@/lib/supabase";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const documentId = params.id;

    if (!documentId) {
      return NextResponse.json(
        { error: "Document ID is required" },
        { status: 400 }
      );
    }

    // Get document info from database
    const documents = await documentService.getByClientId(""); // This needs to be improved
    const document = documents.find((doc) => doc.id === documentId);

    if (!document) {
      return NextResponse.json(
        { error: "Document not found" },
        { status: 404 }
      );
    }

    // Get signed URL from Supabase
    const downloadUrl = await documentService.getDownloadUrl(
      document.file_path
    );

    if (!downloadUrl) {
      return NextResponse.json(
        { error: "Failed to generate download URL" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      downloadUrl: downloadUrl,
      filename: document.file_name,
    });
  } catch (error: any) {
    console.error("Document download error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to process download" },
      { status: 500 }
    );
  }
}
