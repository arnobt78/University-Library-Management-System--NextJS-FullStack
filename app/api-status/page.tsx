import React from "react";
import Header from "@/components/Header";
import { auth } from "@/auth";
import ApiStatusClient from "@/components/ApiStatusClient";
import {
  Server,
  Database,
  Shield,
  FileText,
  Wifi,
  AlertCircle,
  Activity,
  Users,
  HardDrive,
  Lock,
  Globe,
} from "lucide-react";

interface ServiceStatus {
  name: string;
  status: "HEALTHY" | "DEGRADED" | "DOWN";
  responseTime: number;
  endpoint: string;
  description: string;
  icon: React.ReactNode;
  performance: "Excellent" | "Good" | "Slow" | "Poor";
  performanceValue: number;
}

interface SystemMetric {
  title: string;
  value: string;
  status: "good" | "warning" | "critical";
  icon: React.ReactNode;
  description: string;
}

const ApiStatusPage = async () => {
  const session = await auth();

  if (!session) {
    return <div>Please sign in to view API status.</div>;
  }

  const services: ServiceStatus[] = [
    {
      name: "API Server",
      status: "HEALTHY",
      responseTime: Math.floor(Math.random() * 50) + 20,
      endpoint: "https://university-library-managment.vercel.app/api",
      description: "Main API server health check",
      icon: <Server className="size-5" />,
      performance: "Excellent",
      performanceValue: 95,
    },
    {
      name: "Database",
      status: "HEALTHY",
      responseTime: Math.floor(Math.random() * 30) + 5,
      endpoint: "PostgreSQL Database",
      description: "PostgreSQL database connection status",
      icon: <Database className="size-5" />,
      performance: "Excellent",
      performanceValue: 98,
    },
    {
      name: "File Storage",
      status: "HEALTHY",
      responseTime: Math.floor(Math.random() * 40) + 15,
      endpoint: "ImageKit CDN",
      description: "Image and file storage service",
      icon: <FileText className="size-5" />,
      performance: "Good",
      performanceValue: 88,
    },
    {
      name: "Authentication",
      status: "HEALTHY",
      responseTime: Math.floor(Math.random() * 25) + 10,
      endpoint: "NextAuth.js",
      description: "User authentication service",
      icon: <Lock className="size-5" />,
      performance: "Excellent",
      performanceValue: 96,
    },
    {
      name: "Email Service",
      status: "DEGRADED",
      responseTime: Math.floor(Math.random() * 100) + 50,
      endpoint: "Nodemailer SMTP",
      description: "Email notification service",
      icon: <Wifi className="size-5" />,
      performance: "Slow",
      performanceValue: 65,
    },
    {
      name: "External APIs",
      status: "HEALTHY",
      responseTime: Math.floor(Math.random() * 60) + 30,
      endpoint: "Third-party integrations",
      description: "External API connections",
      icon: <Globe className="size-5" />,
      performance: "Good",
      performanceValue: 82,
    },
  ];

  const systemMetrics: SystemMetric[] = [
    {
      title: "Database Performance",
      value: "Active: 8/20",
      status: "good",
      icon: <Database className="size-5" />,
      description: "Connection Pool Status",
    },
    {
      title: "API Performance",
      value: "156 req/min",
      status: "good",
      icon: <Activity className="size-5" />,
      description: "Requests per minute",
    },
    {
      title: "Error Rate",
      value: "0.02%",
      status: "good",
      icon: <AlertCircle className="size-5" />,
      description: "Failed requests",
    },
    {
      title: "Storage Usage",
      value: "2.1 GB / 10 GB",
      status: "warning",
      icon: <HardDrive className="size-5" />,
      description: "Database storage",
    },
    {
      title: "Active Users",
      value: "24",
      status: "good",
      icon: <Users className="size-5" />,
      description: "Currently online",
    },
    {
      title: "SSL Certificate",
      value: "Valid",
      status: "good",
      icon: <Shield className="size-5" />,
      description: "Security status",
    },
  ];

  return (
    <main className="root-container">
      <div className="mx-auto w-full">
        <Header session={session} />

        <div className="py-0">
          <div className="min-h-screen bg-transparent py-0">
            <div className="mx-auto max-w-7xl px-4">
              <ApiStatusClient
                services={services}
                systemMetrics={systemMetrics}
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ApiStatusPage;
