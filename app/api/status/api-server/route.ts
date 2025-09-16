import { NextRequest, NextResponse } from "next/server";

export async function GET(_request: NextRequest) {
  try {
    const startTime = Date.now();

    // Test API server health with a simple operation
    const testData = {
      message: "API Server is healthy",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      nodeVersion: process.version,
      platform: process.platform,
    };

    const responseTime = Date.now() - startTime;

    return NextResponse.json({
      status: "HEALTHY",
      responseTime: `${responseTime}ms`,
      endpoint: "https://university-library-managment.vercel.app/api",
      performance:
        responseTime < 20 ? "Excellent" : responseTime < 50 ? "Good" : "Slow",
      performanceValue: Math.max(0, 100 - responseTime),
      details: testData,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    const responseTime = Date.now() - Date.now();

    return NextResponse.json(
      {
        status: "DOWN",
        responseTime: `${responseTime}ms`,
        endpoint: "https://university-library-managment.vercel.app/api",
        performance: "Poor",
        performanceValue: 0,
        error: error instanceof Error ? error.message : "API Server error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
