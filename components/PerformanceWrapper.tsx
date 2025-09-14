"use client";

import {
  usePerformanceMonitor,
  useSSRPerformance,
} from "@/hooks/usePerformance";
import { ReactNode } from "react";

interface PerformanceWrapperProps {
  children: ReactNode;
  pageName: string;
}

const PerformanceWrapper = ({
  children,
  pageName,
}: PerformanceWrapperProps) => {
  usePerformanceMonitor(pageName);
  useSSRPerformance();

  return <>{children}</>;
};

export default PerformanceWrapper;
