import { type NextRequest, NextResponse } from "next/server";
import { sendClientWelcomeEmail } from "@/lib/email";

export async function POST(request: NextRequest) {
  try {
    const {
      email,
      firstName,
      lastName,
      projectTitle,
      temporaryPassword,
      customMessage,
    } = await request.json();

    if (
      !email ||
      !firstName ||
      !lastName ||
      !projectTitle ||
      !temporaryPassword
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const emailSent = await sendClientWelcomeEmail({
      email,
      firstName,
      lastName,
      projectTitle,
      temporaryPassword,
      portalUrl: `${
        process.env.NEXT_PUBLIC_SITE_URL || request.nextUrl.origin
      }/portal/login`,
      customMessage,
    });

    return NextResponse.json({
      success: emailSent,
      message: emailSent
        ? "Welcome email sent successfully"
        : "Failed to send welcome email",
    });
  } catch (error: any) {
    console.error("Welcome email API error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to send welcome email" },
      { status: 500 }
    );
  }
}
