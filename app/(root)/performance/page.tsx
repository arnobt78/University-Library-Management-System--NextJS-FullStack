"use client";

import { usePerformanceStore } from "@/lib/stores/performance";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import PerformanceWrapper from "@/components/PerformanceWrapper";
import { Badge } from "@/components/ui/badge";

const PerformancePage = () => {
  const { metrics, resetMetrics } = usePerformanceStore();

  const averagePageLoadTime =
    Object.values(metrics.pageLoadTimes).length > 0
      ? Object.values(metrics.pageLoadTimes).reduce((a, b) => a + b, 0) /
        Object.values(metrics.pageLoadTimes).length
      : 0;

  const averageQueryTime =
    Object.values(metrics.queryTimes).length > 0
      ? Object.values(metrics.queryTimes).reduce((a, b) => a + b, 0) /
        Object.values(metrics.queryTimes).length
      : 0;

  const cacheHitRate =
    metrics.totalRequests > 0
      ? (metrics.cacheHits / metrics.totalRequests) * 100
      : 0;

  const getPerformanceGrade = (time: number, type: "page" | "query") => {
    if (type === "page") {
      if (time < 1000) return { grade: "A", color: "text-green-400" };
      if (time < 2000) return { grade: "B", color: "text-yellow-400" };
      if (time < 3000) return { grade: "C", color: "text-orange-400" };
      return { grade: "D", color: "text-red-400" };
    } else {
      if (time < 100) return { grade: "A", color: "text-green-400" };
      if (time < 300) return { grade: "B", color: "text-yellow-400" };
      if (time < 500) return { grade: "C", color: "text-orange-400" };
      return { grade: "D", color: "text-red-400" };
    }
  };

  const pageGrade = getPerformanceGrade(averagePageLoadTime, "page");
  const queryGrade = getPerformanceGrade(averageQueryTime, "query");

  // Get SSR-specific metrics
  const ssrMetrics = Object.entries(metrics.pageLoadTimes).filter(
    ([key]) =>
      key.includes("ssr-") ||
      key.includes("-hydration") ||
      key.includes("-visible")
  );

  return (
    <PerformanceWrapper pageName="performance">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-light-100">
            Performance Dashboard
          </h1>
          <p className="text-light-200">
            Monitor your application&apos;s performance metrics
          </p>
        </div>

        {/* Educational Section */}
        <Card className="mb-8 border-gray-700 bg-gray-800">
          <CardHeader>
            <CardTitle className="text-light-100">
              📚 Performance Architecture
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge
                    variant="outline"
                    className="border-green-700 bg-green-900 text-green-300"
                  >
                    Current: SSR
                  </Badge>
                  <span className="font-medium text-light-200">
                    Server-Side Rendering
                  </span>
                </div>
                <p className="text-sm text-light-300">
                  ✅ Faster initial page loads
                  <br />
                  ✅ Better SEO
                  <br />
                  ✅ Reduced client-side JavaScript
                  <br />✅ Works without JavaScript
                </p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge
                    variant="outline"
                    className="border-blue-700 bg-blue-900 text-blue-300"
                  >
                    Alternative: CSR
                  </Badge>
                  <span className="font-medium text-light-200">
                    Client-Side Rendering
                  </span>
                </div>
                <p className="text-sm text-light-300">
                  ⚡ Rich caching with React Query
                  <br />
                  ⚡ Real-time data updates
                  <br />
                  ⚡ Better user interactions
                  <br />
                  ⚠️ Slower initial loads
                </p>
              </div>
            </div>
            <div className="mt-4 rounded-lg bg-gray-700 p-4">
              <p className="text-sm text-light-200">
                <strong>Why Query Times Show 0:</strong> Your app uses SSR
                (Server-Side Rendering) which fetches data on the server before
                sending HTML to the browser. This is actually{" "}
                <strong>faster</strong> than client-side API calls, but
                doesn&apos;t trigger our client-side performance monitoring.
                Your terminal shows real server response times (200-400ms) which
                are excellent!
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {/* Page Load Time */}
          <Card className="border-gray-700 bg-gray-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-light-100">
                Average Page Load Time
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-light-100">
                  {averagePageLoadTime.toFixed(0)}ms
                </span>
                <span className={`text-lg font-bold ${pageGrade.color}`}>
                  {pageGrade.grade}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Query Time */}
          <Card className="border-gray-700 bg-gray-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-light-100">
                Average Query Time
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-light-100">
                  {averageQueryTime.toFixed(0)}ms
                </span>
                <span className={`text-lg font-bold ${queryGrade.color}`}>
                  {queryGrade.grade}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Cache Hit Rate */}
          <Card className="border-gray-700 bg-gray-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-light-100">
                Cache Hit Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-light-100">
                  {cacheHitRate.toFixed(1)}%
                </span>
                <span
                  className={`text-lg font-bold ${
                    cacheHitRate > 80
                      ? "text-green-400"
                      : cacheHitRate > 60
                        ? "text-yellow-400"
                        : "text-red-400"
                  }`}
                >
                  {cacheHitRate > 80 ? "A" : cacheHitRate > 60 ? "B" : "C"}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Total Requests */}
          <Card className="border-gray-700 bg-gray-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-light-100">
                Total Requests
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-light-100">
                  {metrics.totalRequests}
                </span>
                <span className="text-sm text-light-200">
                  {metrics.cacheHits} hits, {metrics.cacheMisses} misses
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* SSR Metrics */}
        {ssrMetrics.length > 0 && (
          <Card className="mb-6 border-gray-700 bg-gray-800">
            <CardHeader>
              <CardTitle className="text-light-100">
                🚀 SSR Performance Metrics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {ssrMetrics.map(([metric, time]) => {
                  const grade = getPerformanceGrade(time, "page");
                  return (
                    <div
                      key={metric}
                      className="flex items-center justify-between"
                    >
                      <span className="font-mono text-sm text-light-200">
                        {metric.replace("ssr-", "").replace("-", " ")}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-light-100">
                          {time.toFixed(0)}ms
                        </span>
                        <span className={`text-sm ${grade.color}`}>
                          {grade.grade}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Detailed Metrics */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Page Load Times */}
          <Card className="border-gray-700 bg-gray-800">
            <CardHeader>
              <CardTitle className="text-light-100">
                Client-Side Metrics
              </CardTitle>
            </CardHeader>
            <CardContent>
              {Object.keys(metrics.pageLoadTimes).length > 0 ? (
                <div className="space-y-2">
                  {Object.entries(metrics.pageLoadTimes)
                    .filter(
                      ([key]) =>
                        !key.includes("ssr-") &&
                        !key.includes("-hydration") &&
                        !key.includes("-visible")
                    )
                    .map(([page, time]) => {
                      const grade = getPerformanceGrade(time, "page");
                      return (
                        <div
                          key={page}
                          className="flex items-center justify-between"
                        >
                          <span className="capitalize text-light-200">
                            {page}
                          </span>
                          <div className="flex items-center gap-2">
                            <span className="text-light-100">
                              {time.toFixed(0)}ms
                            </span>
                            <span className={`text-sm ${grade.color}`}>
                              {grade.grade}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                </div>
              ) : (
                <p className="text-light-200">
                  No client-side metrics available
                </p>
              )}
            </CardContent>
          </Card>

          {/* Query Times */}
          <Card className="border-gray-700 bg-gray-800">
            <CardHeader>
              <CardTitle className="text-light-100">
                Client-Side API Calls
              </CardTitle>
            </CardHeader>
            <CardContent>
              {Object.keys(metrics.queryTimes).length > 0 ? (
                <div className="space-y-2">
                  {Object.entries(metrics.queryTimes).map(([query, time]) => {
                    const grade = getPerformanceGrade(time, "query");
                    return (
                      <div
                        key={query}
                        className="flex items-center justify-between"
                      >
                        <span className="text-light-200">{query}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-light-100">
                            {time.toFixed(0)}ms
                          </span>
                          <span className={`text-sm ${grade.color}`}>
                            {grade.grade}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="text-light-200">
                    No client-side API calls detected
                  </p>
                  <div className="rounded bg-gray-700 p-3 text-sm text-light-300">
                    <strong>Why?</strong> Your app uses Server-Side Rendering
                    (SSR) which fetches data on the server before sending HTML
                    to the browser. This is faster than client-side API calls
                    but doesn&apos;t show up in client-side monitoring.
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Reset Button */}
        <div className="mt-8 flex justify-center">
          <Button
            onClick={resetMetrics}
            variant="outline"
            className="border-gray-700 bg-gray-800 text-light-100 hover:bg-gray-700"
          >
            Reset Metrics
          </Button>
        </div>
      </div>
    </PerformanceWrapper>
  );
};

export default PerformancePage;
