import { type NextRequest, NextResponse } from "next/server"
import { sendQuoteFormEmail } from "@/lib/email"
import { validateRecaptcha, sanitizeInput, isValidEmail, isValidGhanaPhone } from "@/lib/security"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate reCAPTCHA
    const recaptchaToken = body.recaptchaToken
    const isRecaptchaValid = await validateRecaptcha(recaptchaToken)

    if (!isRecaptchaValid) {
      return NextResponse.json({ error: "reCAPTCHA verification failed" }, { status: 400 })
    }

    // Sanitize inputs
    const sanitizedData = {
      name: sanitizeInput(body.name),
      email: sanitizeInput(body.email),
      phone: sanitizeInput(body.phone),
      projectType: sanitizeInput(body.projectType),
      location: sanitizeInput(body.location),
      timeline: sanitizeInput(body.timeline),
      serviceTier: sanitizeInput(body.serviceTier),
      budgetRange: sanitizeInput(body.budgetRange),
      requirements: sanitizeInput(body.requirements),
      additionalDetails: body.additionalDetails ? sanitizeInput(body.additionalDetails) : "",
    }

    // Validate required fields
    const requiredFields = [
      "name",
      "email",
      "phone",
      "projectType",
      "location",
      "timeline",
      "serviceTier",
      "budgetRange",
      "requirements",
    ]
    const missingFields = requiredFields.filter((field) => !sanitizedData[field as keyof typeof sanitizedData])

    if (missingFields.length > 0) {
      return NextResponse.json({ error: `Missing required fields: ${missingFields.join(", ")}` }, { status: 400 })
    }

    // Validate email format
    if (!isValidEmail(sanitizedData.email)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 })
    }

    // Validate phone format (optional but recommended)
    if (!isValidGhanaPhone(sanitizedData.phone)) {
      console.warn(`Invalid phone format: ${sanitizedData.phone}`)
    }

    // Send emails
    const emailSent = await sendQuoteFormEmail(sanitizedData)

    if (!emailSent) {
      return NextResponse.json({ error: "Failed to send email" }, { status: 500 })
    }

    return NextResponse.json(
      {
        success: true,
        message: "Quote request submitted successfully",
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Quote form submission error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
