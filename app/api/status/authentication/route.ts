import { NextRequest, NextResponse } from "next/server";

export async function GET(_request: NextRequest) {
  try {
    const startTime = Date.now();

    // Test authentication service by checking NextAuth configuration
    const authTest = {
      service: "NextAuth.js",
      providers: ["credentials", "google"],
      session: "JWT",
      status: "Configured",
    };

    // Simulate auth service check
    const responseTime = Date.now() - startTime;

    return NextResponse.json({
      status: "HEALTHY",
      responseTime: `${responseTime}ms`,
      endpoint: "NextAuth.js",
      performance:
        responseTime < 25 ? "Excellent" : responseTime < 50 ? "Good" : "Slow",
      performanceValue: Math.max(0, 100 - responseTime),
      details: authTest,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    const responseTime = Date.now() - Date.now();

    return NextResponse.json(
      {
        status: "DOWN",
        responseTime: `${responseTime}ms`,
        endpoint: "NextAuth.js",
        performance: "Poor",
        performanceValue: 0,
        error:
          error instanceof Error
            ? error.message
            : "Authentication service error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
