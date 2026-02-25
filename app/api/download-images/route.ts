// app/api/download-images/route.ts
import { NextRequest, NextResponse } from "next/server";
import JSZip from "jszip";

export async function POST(request: NextRequest) {
  try {
    const { images, projectSlug } = await request.json();

    if (!images || images.length === 0) {
      return NextResponse.json(
        { error: "No images provided" },
        { status: 400 },
      );
    }

    console.log(
      `[ZIP] Starting download of ${images.length} images for "${projectSlug}"`,
    );

    const zip = new JSZip();
    let addedCount = 0;

    await Promise.all(
      images.map(async (imageUrl: string, index: number) => {
        try {
          console.log(`[ZIP] Fetching image ${index + 1}: ${imageUrl}`);

          const response = await fetch(imageUrl, {
            // Some CDNs require a browser-like User-Agent
            headers: {
              "User-Agent":
                "Mozilla/5.0 (compatible; AmarConsult/1.0; +https://amart-consult.vercel.app)",
            },
          });

          if (!response.ok) {
            console.error(
              `[ZIP] Failed to fetch image ${index + 1}: HTTP ${response.status} ${response.statusText} — ${imageUrl}`,
            );
            return;
          }

          const contentType = response.headers.get("content-type") ?? "";
          const ext = contentType.includes("png")
            ? "png"
            : contentType.includes("webp")
              ? "webp"
              : "jpg";

          const arrayBuffer = await response.arrayBuffer();

          if (arrayBuffer.byteLength === 0) {
            console.error(
              `[ZIP] Image ${index + 1} returned 0 bytes — ${imageUrl}`,
            );
            return;
          }

          const buffer = Buffer.from(arrayBuffer);
          const filename = `${projectSlug}-${String(index + 1).padStart(2, "0")}.${ext}`;
          zip.file(filename, buffer);
          addedCount++;
          console.log(
            `[ZIP] Added ${filename} (${(buffer.byteLength / 1024).toFixed(1)} KB)`,
          );
        } catch (err) {
          console.error(`[ZIP] Error fetching image ${index + 1}:`, err);
        }
      }),
    );

    console.log(
      `[ZIP] Generating ZIP with ${addedCount}/${images.length} images`,
    );

    if (addedCount === 0) {
      return NextResponse.json(
        {
          error: "All image downloads failed",
          detail:
            "Check server logs for details — likely a CORS or network issue fetching from Sanity CDN",
        },
        { status: 500 },
      );
    }

    const zipBuffer = await zip.generateAsync({ type: "nodebuffer" });

    console.log(
      `[ZIP] Done — ZIP size: ${(zipBuffer.byteLength / 1024).toFixed(1)} KB`,
    );

    return new NextResponse(zipBuffer, {
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename="${projectSlug}-images.zip"`,
        "Content-Length": String(zipBuffer.byteLength),
      },
    });
  } catch (error) {
    console.error("[ZIP] Unexpected error:", error);
    return NextResponse.json(
      { error: "Failed to create ZIP file" },
      { status: 500 },
    );
  }
}
