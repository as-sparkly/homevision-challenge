export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: Map<string, number> = new Map();

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  startMeasure(name: string): void {
    if ('performance' in window) {
      performance.mark(`${name}-start`);
    }
  }

  endMeasure(name: string): number | null {
    if ('performance' in window) {
      performance.mark(`${name}-end`);
      try {
        performance.measure(name, `${name}-start`, `${name}-end`);
        const measure = performance.getEntriesByName(name)[0];
        const duration = measure.duration;
        this.metrics.set(name, duration);
        return duration;
      } catch (error) {
        console.warn('Performance measurement failed:', error);
        return null;
      }
    }
    return null;
  }

  measureAsyncOperation<T>(name: string, operation: () => Promise<T>): Promise<T> {
    this.startMeasure(name);
    return operation().finally(() => {
      const duration = this.endMeasure(name);
      if (duration !== null && duration > 1000) {
        console.warn(`Slow operation detected: ${name} took ${duration}ms`);
      }
    });
  }

  getMetrics(): Record<string, number> {
    return Object.fromEntries(this.metrics);
  }

  clearMetrics(): void {
    this.metrics.clear();
    if ('performance' in window) {
      performance.clearMeasures();
      performance.clearMarks();
    }
  }
}

export const performanceMonitor = PerformanceMonitor.getInstance();