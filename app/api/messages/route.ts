import { type NextRequest, NextResponse } from "next/server";
import { messageService } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  try {
    const messageData = await request.json();

    // Validate required fields
    if (
      !messageData.client_id ||
      !messageData.message ||
      !messageData.sender_name
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create the message
    const message = await messageService.create({
      client_id: messageData.client_id,
      sender_type: messageData.sender_type || "client",
      sender_name: messageData.sender_name,
      message: messageData.message,
      is_read: false,
    });

    return NextResponse.json({
      success: true,
      message: message,
    });
  } catch (error: any) {
    console.error("Message creation error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to send message" },
      { status: 500 }
    );
  }
}
