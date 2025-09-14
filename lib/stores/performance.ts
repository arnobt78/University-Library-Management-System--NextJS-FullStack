import { create } from "zustand";

interface PerformanceMetrics {
  pageLoadTimes: Record<string, number>;
  queryTimes: Record<string, number>;
  cacheHits: number;
  cacheMisses: number;
  totalRequests: number;
}

interface PerformanceStore {
  metrics: PerformanceMetrics;
  updatePageLoadTime: (page: string, time: number) => void;
  updateQueryTime: (query: string, time: number) => void;
  incrementCacheHit: () => void;
  incrementCacheMiss: () => void;
  incrementTotalRequests: () => void;
  resetMetrics: () => void;
}

export const usePerformanceStore = create<PerformanceStore>((set) => ({
  metrics: {
    pageLoadTimes: {},
    queryTimes: {},
    cacheHits: 0,
    cacheMisses: 0,
    totalRequests: 0,
  },
  updatePageLoadTime: (page: string, time: number) =>
    set((state) => ({
      metrics: {
        ...state.metrics,
        pageLoadTimes: {
          ...state.metrics.pageLoadTimes,
          [page]: time,
        },
      },
    })),
  updateQueryTime: (query: string, time: number) =>
    set((state) => ({
      metrics: {
        ...state.metrics,
        queryTimes: {
          ...state.metrics.queryTimes,
          [query]: time,
        },
      },
    })),
  incrementCacheHit: () =>
    set((state) => ({
      metrics: {
        ...state.metrics,
        cacheHits: state.metrics.cacheHits + 1,
      },
    })),
  incrementCacheMiss: () =>
    set((state) => ({
      metrics: {
        ...state.metrics,
        cacheMisses: state.metrics.cacheMisses + 1,
      },
    })),
  incrementTotalRequests: () =>
    set((state) => ({
      metrics: {
        ...state.metrics,
        totalRequests: state.metrics.totalRequests + 1,
      },
    })),
  resetMetrics: () =>
    set({
      metrics: {
        pageLoadTimes: {},
        queryTimes: {},
        cacheHits: 0,
        cacheMisses: 0,
        totalRequests: 0,
      },
    }),
}));
