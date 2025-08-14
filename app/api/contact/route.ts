import { type NextRequest, NextResponse } from "next/server"
import { sendContactFormEmail } from "@/lib/email"
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
      budgetRange: body.budgetRange ? sanitizeInput(body.budgetRange) : "",
      serviceInterest: Array.isArray(body.serviceInterest) ? body.serviceInterest.map(sanitizeInput) : [],
      message: sanitizeInput(body.message || ""),
    }

    // Validate required fields
    const requiredFields = ["name", "email", "phone", "projectType", "location"]
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
      // Don't block submission for phone format issues, just log
    }

    // Additional spam detection
    const spamKeywords = ["viagra", "casino", "lottery", "winner", "congratulations", "click here", "free money"]
    const messageText = `${sanitizedData.name} ${sanitizedData.message}`.toLowerCase()
    const hasSpamKeywords = spamKeywords.some((keyword) => messageText.includes(keyword))

    if (hasSpamKeywords) {
      console.warn(`Potential spam detected from ${sanitizedData.email}`)
      // Return success to avoid revealing spam detection, but don't send email
      return NextResponse.json({ success: true, message: "Contact form submitted successfully" }, { status: 200 })
    }

    // Send emails
    const emailSent = await sendContactFormEmail(sanitizedData)

    if (!emailSent) {
      return NextResponse.json({ error: "Failed to send email" }, { status: 500 })
    }

    return NextResponse.json(
      {
        success: true,
        message: "Contact form submitted successfully",
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Contact form submission error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
