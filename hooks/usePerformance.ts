"use client";

import { useEffect } from "react";
import { usePerformanceStore } from "@/lib/stores/performance";

export const usePerformanceMonitor = (pageName: string) => {
  const { updatePageLoadTime } = usePerformanceStore();

  useEffect(() => {
    // Measure client-side hydration and interaction time
    const startTime = performance.now();

    // Use requestAnimationFrame to measure after initial render
    requestAnimationFrame(() => {
      const endTime = performance.now();
      const hydrationTime = endTime - startTime;
      updatePageLoadTime(`${pageName}-hydration`, hydrationTime);
    });

    // Monitor page visibility changes for better metrics
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        const endTime = performance.now();
        const visibleTime = endTime - startTime;
        updatePageLoadTime(`${pageName}-visible`, visibleTime);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [pageName, updatePageLoadTime]);
};

export const useQueryPerformance = () => {
  const {
    updateQueryTime,
    incrementCacheHit,
    incrementCacheMiss,
    incrementTotalRequests,
  } = usePerformanceStore();

  const trackQuery = async <T>(
    queryName: string,
    queryFn: () => Promise<T>,
    isFromCache = false
  ): Promise<T> => {
    const startTime = performance.now();
    incrementTotalRequests();

    if (isFromCache) {
      incrementCacheHit();
    } else {
      incrementCacheMiss();
    }

    try {
      const result = await queryFn();
      const endTime = performance.now();
      const queryTime = endTime - startTime;
      updateQueryTime(queryName, queryTime);
      return result;
    } catch (error) {
      const endTime = performance.now();
      const queryTime = endTime - startTime;
      updateQueryTime(`${queryName}-error`, queryTime);
      throw error;
    }
  };

  return { trackQuery };
};

// New hook for SSR performance monitoring
export const useSSRPerformance = () => {
  const { updatePageLoadTime } = usePerformanceStore();

  useEffect(() => {
    // Measure navigation timing if available
    if (typeof window !== "undefined" && "performance" in window) {
      const navigation = performance.getEntriesByType(
        "navigation"
      )[0] as PerformanceNavigationTiming;

      if (navigation) {
        const metrics = {
          "ssr-dom-content-loaded":
            navigation.domContentLoadedEventEnd -
            navigation.domContentLoadedEventStart,
          "ssr-first-paint": navigation.responseEnd - navigation.requestStart,
          "ssr-total-load": navigation.loadEventEnd - navigation.fetchStart,
        };

        Object.entries(metrics).forEach(([key, value]) => {
          if (value > 0) {
            updatePageLoadTime(key, value);
          }
        });
      }
    }
  }, [updatePageLoadTime]);
};
