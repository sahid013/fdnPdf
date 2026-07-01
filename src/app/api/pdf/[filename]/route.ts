import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  try {
    const { filename } = await params;
    if (!filename) {
      return new NextResponse("Filename is required", { status: 400 });
    }

    // Decode the URL encoded filename
    const decodedFilename = decodeURIComponent(filename);

    // Resolve directories safely
    const pdfsDir = path.resolve(process.cwd(), "src", "app", "RE CHECKED WORD VERISON POLICES");
    const filePath = path.resolve(pdfsDir, decodedFilename);

    // Prevent directory traversal
    if (!filePath.startsWith(pdfsDir)) {
      return new NextResponse("Forbidden", { status: 403 });
    }

    // Check if the file exists and is indeed a file
    if (!fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) {
      return new NextResponse("File not found", { status: 404 });
    }

    // Read the file buffer
    const fileBuffer = fs.readFileSync(filePath);

    // Return the file stream with correct headers for inline browser display
    return new NextResponse(fileBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="${encodeURIComponent(decodedFilename)}"`,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    console.error("Error serving PDF:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
