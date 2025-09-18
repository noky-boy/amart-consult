import { type NextRequest, NextResponse } from "next/server";
import { saveContactSubmission } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    const requiredFields = ["name", "email", "phone", "message"];
    const missingFields = requiredFields.filter((field) => !body[field]);

    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(", ")}` },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Prepare data for database
    const contactData = {
      name: body.name,
      email: body.email,
      phone: body.phone,
      project_type: body.projectType || "consultation",
      location: "WhatsApp Form",
      budget_range: null,
      service_interest: ["WhatsApp Consultation"],
      message: body.message,
    };

    // Save to database
    const dbResult = await saveContactSubmission(contactData);

    if (!dbResult.success) {
      console.error(
        "Failed to save WhatsApp consultation to database:",
        dbResult.error
      );
      return NextResponse.json(
        { error: "Failed to save consultation request" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "WhatsApp consultation saved successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("WhatsApp consultation error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
