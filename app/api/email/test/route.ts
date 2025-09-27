// app/api/email/test/route.ts
import { NextRequest, NextResponse } from "next/server";
import {
  sendTestEmail,
  sendWelcomeEmail,
  sendNewsletterEmail,
  sendProjectUpdateEmail,
} from "@/lib/email";

export async function POST(request: NextRequest) {
  try {
    const { to, template, props } = await request.json();

    if (!to || !template) {
      return NextResponse.json(
        { success: false, error: "Missing required fields: to, template" },
        { status: 400 }
      );
    }

    let result;

    switch (template) {
      case "welcome-1":
        result = await sendWelcomeEmail({
          to,
          firstName: props?.firstName || "Test User",
          websiteUrl: props?.websiteUrl,
          logoUrl: props?.logoUrl,
        });
        break;

      case "newsletter-1":
        result = await sendNewsletterEmail({
          to,
          month: props?.month || "March",
          year: props?.year || "2024",
          featuredProject: props?.featuredProject,
          websiteUrl: props?.websiteUrl,
          logoUrl: props?.logoUrl,
        });
        break;

      case "project-1":
        result = await sendProjectUpdateEmail({
          to,
          clientName: props?.clientName || "Test Client",
          projectName: props?.projectName || "Test Project",
          weekNumber: props?.weekNumber || 1,
          status: props?.status || "on-track",
          progress: props?.progress || 50,
          timeRemaining: props?.timeRemaining || "2 weeks",
          websiteUrl: props?.websiteUrl,
          logoUrl: props?.logoUrl,
        });
        break;

      default:
        // Send generic test email
        result = await sendTestEmail(to);
        break;
    }

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: "Test email sent successfully",
        messageId: result.messageId,
      });
    } else {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error("Email test API error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

// Optional: Add a GET endpoint to verify email service configuration
export async function GET() {
  try {
    const { verifyEmailConnection } = await import("@/lib/email");
    const isConnected = await verifyEmailConnection();

    return NextResponse.json({
      success: true,
      connected: isConnected,
      message: isConnected
        ? "Email service is ready"
        : "Email service configuration issue",
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
