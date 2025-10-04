import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function POST(request: NextRequest) {
  try {
    const { filePath, download } = await request.json();

    if (!filePath) {
      return NextResponse.json(
        { error: "File path is required" },
        { status: 400 }
      );
    }

    // Generate signed URL with optional download parameter
    const { data, error } = await supabaseAdmin.storage
      .from("client-files")
      .createSignedUrl(filePath, 3600, {
        download: download || false, // Only force download if explicitly requested
      });

    if (error) {
      console.error("Signed URL error:", error);
      return NextResponse.json(
        { error: "Failed to generate signed URL", details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ signedUrl: data.signedUrl });
  } catch (error) {
    console.error("Exception in signed-url route:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
