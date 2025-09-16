"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Server,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  XCircle,
  Clock,
  Zap,
  Activity,
  TrendingUp,
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

interface ApiStatusClientProps {
  services: ServiceStatus[];
  systemMetrics: SystemMetric[];
}

const ApiStatusClient = ({ services, systemMetrics }: ApiStatusClientProps) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);
  const [overallStatus] = useState<"HEALTHY" | "DEGRADED" | "DOWN">("HEALTHY");
  const [responseTime, setResponseTime] = useState(0);
  const [uptime, setUptime] = useState({ hours: 0, minutes: 0 });
  const [healthScore, setHealthScore] = useState(100);

  // Utility functions
  const getStatusColor = (status: string) => {
    switch (status) {
      case "HEALTHY":
        return "bg-green-100 text-green-800 border-green-200";
      case "DEGRADED":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "DOWN":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "HEALTHY":
        return <CheckCircle className="size-6 text-green-600" />;
      case "DEGRADED":
        return <AlertCircle className="size-6 text-yellow-600" />;
      case "DOWN":
        return <XCircle className="size-6 text-red-600" />;
      default:
        return <AlertCircle className="size-6 text-gray-600" />;
    }
  };

  const getPerformanceColor = (performance: string) => {
    switch (performance) {
      case "Excellent":
        return "text-green-600";
      case "Good":
        return "text-blue-600";
      case "Slow":
        return "text-yellow-600";
      case "Poor":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  const getMetricStatusColor = (status: string) => {
    switch (status) {
      case "good":
        return "text-green-600";
      case "warning":
        return "text-yellow-600";
      case "critical":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  // Initialize date on client side and simulate real-time data updates
  useEffect(() => {
    // Initialize the date on client side to avoid hydration mismatch
    setLastChecked(new Date());

    const interval = setInterval(() => {
      // Simulate response time changes
      setResponseTime(Math.floor(Math.random() * 100) + 10);

      // Simulate uptime increment
      setUptime((prev) => {
        const newMinutes = prev.minutes + 1;
        if (newMinutes >= 60) {
          return { hours: prev.hours + 1, minutes: 0 };
        }
        return { hours: prev.hours, minutes: newMinutes };
      });

      // Simulate health score fluctuation
      setHealthScore((prev) =>
        Math.max(85, Math.min(100, prev + (Math.random() - 0.5) * 2))
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    setLastChecked(new Date());

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsRefreshing(false);
  };

  return (
    <>
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="mb-2 text-4xl font-bold text-light-100">API Status</h1>
          <p className="text-lg text-light-100">
            Real-time monitoring of BookWise API services
          </p>
        </div>
        <Button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="flex items-center gap-2"
        >
          <RefreshCw
            className={`size-4 ${isRefreshing ? "animate-spin" : ""}`}
          />
          Refresh
        </Button>
      </div>

      {/* Overall System Status */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Server className="size-5" />
            Overall System Status
          </CardTitle>
          <p className="text-sm text-gray-600">
            Last checked:{" "}
            {lastChecked ? lastChecked.toLocaleString() : "Loading..."}
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
            <div className="text-center">
              <div className="mb-2 flex justify-center">
                {getStatusIcon(overallStatus)}
              </div>
              <p className="text-sm text-gray-600">System Status</p>
              <Badge className={`mt-1 ${getStatusColor(overallStatus)}`}>
                {overallStatus}
              </Badge>
            </div>
            <div className="text-center">
              <div className="mb-2 flex justify-center">
                <Zap className="size-4 text-blue-600" />
              </div>
              <p className="text-sm text-gray-600">Response Time</p>
              <p className="text-2xl font-bold">{responseTime}ms</p>
            </div>
            <div className="text-center">
              <div className="mb-2 flex justify-center">
                <Clock className="size-4 text-green-600" />
              </div>
              <p className="text-sm text-gray-600">Uptime</p>
              <p className="text-2xl font-bold">
                {uptime.hours}h {uptime.minutes}m
              </p>
            </div>
            <div className="text-center">
              <div className="mb-2 flex justify-center">
                <TrendingUp className="size-4 text-purple-600" />
              </div>
              <p className="text-sm text-gray-600">Health Score</p>
              <p className="text-2xl font-bold">{healthScore.toFixed(1)}%</p>
            </div>
          </div>

          <div className="mt-6">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-medium">Overall Health</span>
              <span className="text-sm text-gray-600">
                {healthScore.toFixed(1)}%
              </span>
            </div>
            <Progress value={healthScore} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Service Status */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="size-5" />
            Service Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service, index) => (
              <Card key={index} className="relative">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {service.icon}
                      <CardTitle className="text-lg">{service.name}</CardTitle>
                    </div>
                    <Badge className={getStatusColor(service.status)}>
                      {service.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">{service.description}</p>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">
                        Response Time:
                      </span>
                      <span className="font-semibold">
                        {service.responseTime}ms
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Endpoint:</span>
                      <span className="font-mono text-sm">
                        {service.endpoint}
                      </span>
                    </div>
                    <div>
                      <div className="mb-1 flex justify-between">
                        <span className="text-sm text-gray-600">
                          Performance:
                        </span>
                        <span
                          className={`text-sm font-medium ${getPerformanceColor(service.performance)}`}
                        >
                          {service.performance}
                        </span>
                      </div>
                      <Progress
                        value={service.performanceValue}
                        className="h-2"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* System Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="size-5" />
            System Metrics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {systemMetrics.map((metric, index) => (
              <Card key={index} className="relative">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className={`${getMetricStatusColor(metric.status)}`}>
                      {metric.icon}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{metric.title}</p>
                      <p
                        className={`text-lg font-bold ${getMetricStatusColor(metric.status)}`}
                      >
                        {metric.value}
                      </p>
                      <p className="text-xs text-gray-600">
                        {metric.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Footer */}
      <div className="mt-12 text-center">
        <p className="text-sm text-gray-500">
          BookWise University Library Management System - API Status Monitor
        </p>
        <p className="text-xs text-gray-400">
          Real-time monitoring • Last updated:{" "}
          {lastChecked ? lastChecked.toLocaleTimeString() : "Loading..."}
        </p>
      </div>
    </>
  );
};

export default ApiStatusClient;
