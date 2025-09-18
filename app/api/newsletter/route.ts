import { type NextRequest, NextResponse } from "next/server";
import { addToNewsletterList } from "@/lib/email";
import { saveSubscriber } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    const subscriberData = {
      email: body.email,
      name: body.name,
      source: body.source || "website",
    };

    // Save to database first
    const dbResult = await saveSubscriber(subscriberData);

    if (!dbResult.success) {
      // Check if it's a duplicate email error
      if (dbResult.error?.code === "23505") {
        // PostgreSQL unique constraint violation
        return NextResponse.json(
          { error: "Email already subscribed" },
          { status: 400 }
        );
      }
      console.error("Failed to save subscriber to database:", dbResult.error);
      return NextResponse.json(
        { error: "Failed to save subscription" },
        { status: 500 }
      );
    }

    // Send welcome email (keep existing functionality)
    const emailSuccess = await addToNewsletterList(subscriberData);

    if (!emailSuccess) {
      console.warn("Database saved but email failed for:", body.email);
      // Don't fail the request - subscriber is saved, email issue can be handled separately
    }

    return NextResponse.json(
      {
        success: true,
        message: "Successfully subscribed to newsletter",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Newsletter subscription error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
