import { NextRequest, NextResponse } from "next/server";
import {
  exportBooks,
  exportUsers,
  exportBorrows,
  exportAnalytics,
} from "@/lib/admin/actions/data-export";

export async function POST(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const segments = url.pathname.split("/");
    const exportType = segments[segments.length - 2]; // 'books', 'users', 'borrows', 'analytics'

    const formData = await request.formData();
    const format = (formData.get("format") as "csv" | "json") || "csv";

    let result;

    switch (exportType) {
      case "books":
        result = await exportBooks(format);
        break;
      case "users":
        result = await exportUsers(format);
        break;
      case "borrows":
        result = await exportBorrows(format);
        break;
      case "analytics":
        result = await exportAnalytics(format);
        break;
      default:
        return NextResponse.json(
          {
            success: false,
            message: "Invalid export type",
          },
          { status: 400 }
        );
    }

    // Return the file as a download
    return new NextResponse(result.data, {
      status: 200,
      headers: {
        "Content-Type": result.contentType,
        "Content-Disposition": `attachment; filename="${result.filename}"`,
      },
    });
  } catch (error) {
    console.error("Export API error:", error);
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
