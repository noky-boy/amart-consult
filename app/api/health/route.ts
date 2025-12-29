// app/api/health/route.ts
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request: Request) {
  try {
    const startTime = Date.now();

    // Perform a simple query to keep database active
    // This queries the clients table but you can use any table
    const { data, error } = await supabase
      .from("clients")
      .select("id")
      .limit(1);

    if (error) {
      console.error("Health check failed:", error);
      return NextResponse.json(
        {
          status: "error",
          message: error.message,
          timestamp: new Date().toISOString(),
        },
        { status: 500 }
      );
    }

    const duration = Date.now() - startTime;

    return NextResponse.json({
      status: "healthy",
      message: "Supabase connection successful",
      timestamp: new Date().toISOString(),
      responseTime: `${duration}ms`,
      recordsChecked: data?.length || 0,
    });
  } catch (error) {
    console.error("Health check error:", error);
    return NextResponse.json(
      {
        status: "error",
        message: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

// Also support POST for more flexibility
export async function POST(request: Request) {
  return GET(request);
}
