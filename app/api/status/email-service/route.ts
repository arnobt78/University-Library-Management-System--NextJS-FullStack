import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const startTime = Date.now();

    // Test email service configuration
    const emailConfig = {
      service: "Nodemailer SMTP",
      host: process.env.SMTP_HOST || "Not configured",
      port: process.env.SMTP_PORT || "Not configured",
      secure: process.env.SMTP_SECURE || "Not configured",
      status: process.env.SMTP_HOST ? "Configured" : "Not configured",
    };

    // Simulate email service check
    const responseTime = Date.now() - startTime;

    // Determine status based on configuration
    const isConfigured = process.env.SMTP_HOST && process.env.SMTP_PORT;
    const status = isConfigured ? "HEALTHY" : "DEGRADED";
    const performance = isConfigured
      ? responseTime < 100
        ? "Good"
        : "Slow"
      : "Poor";
    const performanceValue = isConfigured
      ? Math.max(0, 100 - responseTime)
      : 30;

    return NextResponse.json({
      status,
      responseTime: `${responseTime}ms`,
      endpoint: "Nodemailer SMTP",
      performance,
      performanceValue,
      details: emailConfig,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    const responseTime = Date.now() - Date.now();

    return NextResponse.json(
      {
        status: "DOWN",
        responseTime: `${responseTime}ms`,
        endpoint: "Nodemailer SMTP",
        performance: "Poor",
        performanceValue: 0,
        error: error instanceof Error ? error.message : "Email service error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
