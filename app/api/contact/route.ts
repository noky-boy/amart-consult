import { type NextRequest, NextResponse } from "next/server";
import { sendContactFormEmail } from "@/lib/email";
import { saveContactSubmission } from "@/lib/supabase";
import {
  validateRecaptcha,
  sanitizeInput,
  isValidEmail,
  isValidGhanaPhone,
} from "@/lib/security";
import { saveContactSubmissionAdmin } from "@/lib/supabase-admin";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate reCAPTCHA Enterprise - pass request for IP address
    // const recaptchaToken = body.recaptchaToken;
    // // Add this right before: const isRecaptchaValid = await validateRecaptcha(recaptchaToken, request);
    // console.log("=== DEBUG: Environment variables ===");
    // console.log("RECAPTCHA_PROJECT_ID:", process.env.RECAPTCHA_PROJECT_ID);
    // console.log("RECAPTCHA_API_KEY:", process.env.RECAPTCHA_API_KEY);
    // console.log(
    //   "NEXT_PUBLIC_RECAPTCHA_SITE_KEY:",
    //   process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY
    // );
    // console.log("Received token:", recaptchaToken);
    // console.log("=== END DEBUG ===");
    // const isRecaptchaValid = await validateRecaptcha(recaptchaToken, request);

    // if (!isRecaptchaValid) {
    //   return NextResponse.json(
    //     { error: "Security verification failed. Please try again." },
    //     { status: 400 }
    //   );
    // }

    // Sanitize inputs
    const sanitizedData = {
      name: sanitizeInput(body.name),
      email: sanitizeInput(body.email),
      phone: sanitizeInput(body.phone),
      projectType: sanitizeInput(body.projectType),
      location: sanitizeInput(body.location),
      budgetRange: body.budgetRange ? sanitizeInput(body.budgetRange) : "",
      serviceInterest: Array.isArray(body.serviceInterest)
        ? body.serviceInterest.map(sanitizeInput)
        : [],
      message: sanitizeInput(body.message || ""),
    };

    // Validate required fields
    const requiredFields = [
      "name",
      "email",
      "phone",
      "projectType",
      "location",
    ];
    const missingFields = requiredFields.filter(
      (field) => !sanitizedData[field as keyof typeof sanitizedData]
    );

    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(", ")}` },
        { status: 400 }
      );
    }

    // Validate email format
    if (!isValidEmail(sanitizedData.email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Validate phone format (optional but recommended)
    if (!isValidGhanaPhone(sanitizedData.phone)) {
      console.warn(`Invalid phone format: ${sanitizedData.phone}`);
    }

    // Additional spam detection
    const spamKeywords = [
      "viagra",
      "casino",
      "lottery",
      "winner",
      "congratulations",
      "click here",
      "free money",
    ];
    const messageText =
      `${sanitizedData.name} ${sanitizedData.message}`.toLowerCase();
    const hasSpamKeywords = spamKeywords.some((keyword) =>
      messageText.includes(keyword)
    );

    if (hasSpamKeywords) {
      console.warn(`Potential spam detected from ${sanitizedData.email}`);
      return NextResponse.json(
        { success: true, message: "Contact form submitted successfully" },
        { status: 200 }
      );
    }

    // Prepare data for database
    const contactData = {
      name: sanitizedData.name,
      email: sanitizedData.email,
      phone: sanitizedData.phone,
      project_type: sanitizedData.projectType,
      location: sanitizedData.location,
      budget_range: sanitizedData.budgetRange || null,
      service_interest: sanitizedData.serviceInterest,
      message: sanitizedData.message,
    };

    // Save to database using ADMIN client (change this line)
    const dbResult = await saveContactSubmissionAdmin(contactData);

    if (!dbResult.success) {
      console.error(
        "Failed to save contact submission to database:",
        dbResult.error
      );
      return NextResponse.json(
        { error: "Failed to save contact submission" },
        { status: 500 }
      );
    }

    // Send emails (keep existing functionality)
    const emailSent = await sendContactFormEmail(sanitizedData);

    if (!emailSent) {
      console.warn(
        "Database saved but email failed for contact from:",
        sanitizedData.email
      );
      // Don't fail the request - data is saved, email issue can be handled separately
    }

    return NextResponse.json(
      {
        success: true,
        message: "Contact form submitted successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Contact form submission error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
