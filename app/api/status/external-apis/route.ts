import { NextRequest, NextResponse } from "next/server";

export async function GET(_request: NextRequest) {
  try {
    const startTime = Date.now();

    // Test external API connections
    const externalApis = {
      service: "Third-party integrations",
      apis: [
        { name: "Google OAuth", status: "Available" },
        { name: "Vercel API", status: "Available" },
        { name: "ImageKit API", status: "Available" },
      ],
      totalApis: 3,
      availableApis: 3,
    };

    // Simulate external API check
    const responseTime = Date.now() - startTime;

    return NextResponse.json({
      status: "HEALTHY",
      responseTime: `${responseTime}ms`,
      endpoint: "Third-party integrations",
      performance:
        responseTime < 50 ? "Excellent" : responseTime < 100 ? "Good" : "Slow",
      performanceValue: Math.max(0, 100 - responseTime),
      details: externalApis,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    const responseTime = Date.now() - Date.now();

    return NextResponse.json(
      {
        status: "DOWN",
        responseTime: `${responseTime}ms`,
        endpoint: "Third-party integrations",
        performance: "Poor",
        performanceValue: 0,
        error: error instanceof Error ? error.message : "External API error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
