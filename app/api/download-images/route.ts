// app/api/download-images/route.ts
import { NextRequest, NextResponse } from "next/server";
import JSZip from "jszip";

export async function POST(request: NextRequest) {
  try {
    const { images, projectSlug } = await request.json();

    if (!images || images.length === 0) {
      return NextResponse.json(
        { error: "No images provided" },
        { status: 400 }
      );
    }

    const zip = new JSZip();

    // Fetch all images from Sanity CDN (server-side, no CORS issues)
    const imagePromises = images.map(
      async (imageUrl: string, index: number) => {
        try {
          const response = await fetch(imageUrl);

          if (!response.ok) {
            console.error(`Failed to fetch image ${index + 1}`);
            return null;
          }

          const arrayBuffer = await response.arrayBuffer();
          const buffer = Buffer.from(arrayBuffer);

          zip.file(`${projectSlug}-${index + 1}.jpg`, buffer);
        } catch (error) {
          console.error(`Error fetching image ${index + 1}:`, error);
          return null;
        }
      }
    );

    await Promise.all(imagePromises);

    // Generate ZIP file
    const zipBuffer = await zip.generateAsync({ type: "nodebuffer" });

    // Return ZIP file
    return new NextResponse(zipBuffer, {
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename="${projectSlug}-images.zip"`,
      },
    });
  } catch (error) {
    console.error("Error creating ZIP:", error);
    return NextResponse.json(
      { error: "Failed to create ZIP file" },
      { status: 500 }
    );
  }
}
