import { type NextRequest, NextResponse } from "next/server"
import { addToNewsletterList } from "@/lib/email"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate required fields
    if (!body.email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(body.email)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 })
    }

    // Add to newsletter list
    const success = await addToNewsletterList({
      email: body.email,
      name: body.name,
      source: body.source || "website",
    })

    if (!success) {
      return NextResponse.json({ error: "Failed to subscribe to newsletter" }, { status: 500 })
    }

    return NextResponse.json(
      {
        success: true,
        message: "Successfully subscribed to newsletter",
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Newsletter subscription error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
