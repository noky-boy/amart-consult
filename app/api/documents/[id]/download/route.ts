import { type NextRequest, NextResponse } from "next/server";
import { documentService, supabase } from "@/lib/supabase";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: documentId } = await params;

    if (!documentId) {
      return NextResponse.json(
        { error: "Document ID is required" },
        { status: 400 }
      );
    }

    // Get the authorization header from the request
    const authHeader = request.headers.get("authorization");

    if (!authHeader) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Verify the JWT token
    const token = authHeader.replace("Bearer ", "");
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Get document from database first
    const { data: document, error: docError } = await supabase
      .from("client_documents")
      .select("*")
      .eq("id", documentId)
      .single();

    if (docError || !document) {
      return NextResponse.json(
        { error: "Document not found" },
        { status: 404 }
      );
    }

    // Check if user has access to this document
    // For clients: check if the document belongs to their client record
    const { data: client, error: clientError } = await supabase
      .from("clients")
      .select("id")
      .eq("auth_user_id", user.id)
      .single();

    if (client && document.client_id !== client.id) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    // Generate signed URL using service role (server-side)
    const { data: signedUrlData, error: urlError } = await supabaseAdmin.storage
      .from("client-files")
      .createSignedUrl(document.file_path, 3600, {
        download: true,
      });

    if (urlError || !signedUrlData) {
      console.error("Signed URL error:", urlError);
      return NextResponse.json(
        { error: "Failed to generate download URL" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      downloadUrl: signedUrlData.signedUrl,
      filename: document.file_name,
    });
  } catch (error) {
    console.error("Document download error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to process download",
      },
      { status: 500 }
    );
  }
}
