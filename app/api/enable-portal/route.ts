import { type NextRequest, NextResponse } from "next/server";
import { clientService } from "@/lib/supabase";
import { sendClientWelcomeEmail } from "@/lib/email";

export async function POST(request: NextRequest) {
  try {
    const { clientId } = await request.json();

    if (!clientId) {
      return NextResponse.json(
        { error: "Client ID is required" },
        { status: 400 }
      );
    }

    // Get client data first
    const client = await clientService.getById(clientId);

    if (client.has_portal_access) {
      return NextResponse.json(
        { error: "Client already has portal access" },
        { status: 400 }
      );
    }

    // Enable portal access
    const result = await clientService.enablePortalAccess(clientId);

    // Send welcome email
    const emailSent = await sendClientWelcomeEmail({
      email: client.email,
      firstName: client.first_name,
      lastName: client.last_name,
      projectTitle: client.project_title,
      temporaryPassword: result.temporaryPassword,
      portalUrl: `${
        process.env.NEXT_PUBLIC_SITE_URL || request.nextUrl.origin
      }/portal/login`,
    });

    if (!emailSent) {
      console.warn(
        "Portal enabled but welcome email failed for:",
        client.email
      );
    }

    return NextResponse.json({
      success: true,
      message: `Portal access enabled for ${client.first_name} ${client.last_name}`,
      emailSent,
    });
  } catch (error: any) {
    console.error("Enable portal access error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to enable portal access" },
      { status: 500 }
    );
  }
}
