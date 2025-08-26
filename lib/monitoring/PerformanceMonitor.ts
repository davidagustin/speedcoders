/**
 * Performance Monitoring System
 * Tracks application performance, user interactions, and system health
 */

interface PerformanceMetric {
  name: string;
  value: number;
  timestamp: Date;
  category: 'api' | 'render' | 'database' | 'cache' | 'compute';
  tags?: Record<string, string>;
}

interface ErrorLog {
  id: string;
  error: Error;
  context: Record<string, any>;
  timestamp: Date;
  userId?: string;
  sessionId?: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

interface UserInteraction {
  type: 'click' | 'navigation' | 'form_submit' | 'api_call';
  component: string;
  action: string;
  timestamp: Date;
  duration?: number;
  metadata?: Record<string, any>;
}

export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: PerformanceMetric[] = [];
  private errors: ErrorLog[] = [];
  private interactions: UserInteraction[] = [];
  private flushInterval: NodeJS.Timeout | null = null;
  private readonly MAX_BUFFER_SIZE = 1000;
  private readonly FLUSH_INTERVAL = 30000; // 30 seconds

  private constructor() {
    this.startFlushInterval();
    this.setupErrorHandlers();
    this.initializePerformanceObserver();
  }

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  // Core Monitoring Methods
  trackMetric(metric: Omit<PerformanceMetric, 'timestamp'>): void {
    this.metrics.push({
      ...metric,
      timestamp: new Date()
    });

    if (this.metrics.length >= this.MAX_BUFFER_SIZE) {
      this.flush();
    }
  }

  trackAPICall(endpoint: string, duration: number, statusCode: number): void {
    this.trackMetric({
      name: `api_${endpoint}`,
      value: duration,
      category: 'api',
      tags: {
        endpoint,
        status: statusCode.toString(),
        success: (statusCode >= 200 && statusCode < 300).toString()
      }
    });
  }

  trackDatabaseQuery(query: string, duration: number, resultCount?: number): void {
    this.trackMetric({
      name: 'database_query',
      value: duration,
      category: 'database',
      tags: {
        query: this.sanitizeQuery(query),
        resultCount: resultCount?.toString() || 'unknown'
      }
    });
  }

  trackRenderTime(component: string, duration: number): void {
    this.trackMetric({
      name: `render_${component}`,
      value: duration,
      category: 'render',
      tags: { component }
    });
  }

  trackCacheHit(key: string, hit: boolean): void {
    this.trackMetric({
      name: 'cache_access',
      value: hit ? 1 : 0,
      category: 'cache',
      tags: {
        key: this.sanitizeKey(key),
        hit: hit.toString()
      }
    });
  }

  // Error Tracking
  logError(error: Error, context: Record<string, any> = {}, severity: ErrorLog['severity'] = 'medium'): void {
    const errorLog: ErrorLog = {
      id: this.generateId(),
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack
      } as Error,
      context,
      timestamp: new Date(),
      severity
    };

    this.errors.push(errorLog);
    
    if (severity === 'critical') {
      this.alertCriticalError(errorLog);
    }

    if (this.errors.length >= this.MAX_BUFFER_SIZE) {
      this.flush();
    }
  }

  // User Interaction Tracking
  trackInteraction(interaction: Omit<UserInteraction, 'timestamp'>): void {
    this.interactions.push({
      ...interaction,
      timestamp: new Date()
    });

    if (this.interactions.length >= this.MAX_BUFFER_SIZE) {
      this.flush();
    }
  }

  // Performance Analysis
  async analyzePerformance(): Promise<{
    apiPerformance: Record<string, number>;
    renderPerformance: Record<string, number>;
    databasePerformance: number;
    cacheHitRate: number;
    errorRate: number;
    recommendations: string[];
  }> {
    const now = Date.now();
    const oneHourAgo = now - 3600000;

    const recentMetrics = this.metrics.filter(m => 
      m.timestamp.getTime() > oneHourAgo
    );

    const apiMetrics = recentMetrics.filter(m => m.category === 'api');
    const renderMetrics = recentMetrics.filter(m => m.category === 'render');
    const dbMetrics = recentMetrics.filter(m => m.category === 'database');
    const cacheMetrics = recentMetrics.filter(m => m.category === 'cache');

    const apiPerformance = this.calculateAverageByTag(apiMetrics, 'endpoint');
    const renderPerformance = this.calculateAverageByTag(renderMetrics, 'component');
    const databasePerformance = this.calculateAverage(dbMetrics);
    const cacheHitRate = this.calculateCacheHitRate(cacheMetrics);
    const errorRate = this.calculateErrorRate();

    const recommendations = this.generateRecommendations({
      apiPerformance,
      renderPerformance,
      databasePerformance,
      cacheHitRate,
      errorRate
    });

    return {
      apiPerformance,
      renderPerformance,
      databasePerformance,
      cacheHitRate,
      errorRate,
      recommendations
    };
  }

  // Memory and Resource Monitoring
  getMemoryUsage(): {
    heap: number;
    external: number;
    total: number;
  } {
    if (typeof window === 'undefined' && typeof process !== 'undefined') {
      const usage = process.memoryUsage();
      return {
        heap: usage.heapUsed,
        external: usage.external,
        total: usage.rss
      };
    }

    // Browser environment
    if (typeof window !== 'undefined' && (performance as any).memory) {
      const memory = (performance as any).memory;
      return {
        heap: memory.usedJSHeapSize,
        external: 0,
        total: memory.totalJSHeapSize
      };
    }

    return { heap: 0, external: 0, total: 0 };
  }

  // Real User Monitoring (RUM)
  trackPageLoad(): void {
    if (typeof window === 'undefined') return;

    window.addEventListener('load', () => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      
      if (navigation) {
        this.trackMetric({
          name: 'page_load_time',
          value: navigation.loadEventEnd - navigation.fetchStart,
          category: 'render',
          tags: {
            dns: (navigation.domainLookupEnd - navigation.domainLookupStart).toString(),
            tcp: (navigation.connectEnd - navigation.connectStart).toString(),
            request: (navigation.responseStart - navigation.requestStart).toString(),
            response: (navigation.responseEnd - navigation.responseStart).toString(),
            dom: (navigation.domComplete - navigation.responseEnd).toString(),
            load: (navigation.loadEventEnd - navigation.loadEventStart).toString()
          }
        });
      }
    });
  }

  trackVitals(): void {
    if (typeof window === 'undefined') return;

    // Track Core Web Vitals
    try {
      // Largest Contentful Paint (LCP)
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          this.trackMetric({
            name: 'lcp',
            value: entry.startTime,
            category: 'render',
            tags: { element: (entry as any).element?.tagName || 'unknown' }
          });
        }
      }).observe({ type: 'largest-contentful-paint', buffered: true });

      // First Input Delay (FID)
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          const fidEntry = entry as PerformanceEventTiming;
          this.trackMetric({
            name: 'fid',
            value: fidEntry.processingStart - fidEntry.startTime,
            category: 'render'
          });
        }
      }).observe({ type: 'first-input', buffered: true });

      // Cumulative Layout Shift (CLS)
      let clsValue = 0;
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!(entry as any).hadRecentInput) {
            clsValue += (entry as any).value;
            this.trackMetric({
              name: 'cls',
              value: clsValue,
              category: 'render'
            });
          }
        }
      }).observe({ type: 'layout-shift', buffered: true });
    } catch (error) {
      console.warn('Web Vitals tracking not supported:', error);
    }
  }

  // Private Helper Methods
  private startFlushInterval(): void {
    this.flushInterval = setInterval(() => {
      this.flush();
    }, this.FLUSH_INTERVAL);
  }

  private setupErrorHandlers(): void {
    if (typeof window !== 'undefined') {
      window.addEventListener('error', (event) => {
        this.logError(
          new Error(event.message),
          {
            filename: event.filename,
            lineno: event.lineno,
            colno: event.colno
          },
          'high'
        );
      });

      window.addEventListener('unhandledrejection', (event) => {
        this.logError(
          new Error(event.reason?.toString() || 'Unhandled Promise Rejection'),
          { promise: event.promise },
          'high'
        );
      });
    }
  }

  private initializePerformanceObserver(): void {
    if (typeof window !== 'undefined') {
      this.trackPageLoad();
      this.trackVitals();
    }
  }

  private async flush(): Promise<void> {
    if (this.metrics.length === 0 && this.errors.length === 0 && this.interactions.length === 0) {
      return;
    }

    const payload = {
      metrics: [...this.metrics],
      errors: [...this.errors],
      interactions: [...this.interactions],
      timestamp: new Date()
    };

    // Clear buffers
    this.metrics = [];
    this.errors = [];
    this.interactions = [];

    // Send to monitoring service
    try {
      await this.sendToMonitoringService(payload);
    } catch (error) {
      console.error('Failed to send monitoring data:', error);
      // Re-add critical data back to buffers
      if (payload.errors.some(e => e.severity === 'critical')) {
        this.errors.push(...payload.errors.filter(e => e.severity === 'critical'));
      }
    }
  }

  private async sendToMonitoringService(payload: any): Promise<void> {
    // In production, send to monitoring service like DataDog, New Relic, or custom endpoint
    if (process.env.NODE_ENV === 'production') {
      try {
        await fetch('/api/monitoring', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      } catch (error) {
        console.error('Monitoring service error:', error);
      }
    } else {
      // Development: Log to console
      console.log('[Performance Monitor]', payload);
    }
  }

  private calculateAverage(metrics: PerformanceMetric[]): number {
    if (metrics.length === 0) return 0;
    return metrics.reduce((sum, m) => sum + m.value, 0) / metrics.length;
  }

  private calculateAverageByTag(metrics: PerformanceMetric[], tagName: string): Record<string, number> {
    const grouped: Record<string, number[]> = {};
    
    metrics.forEach(m => {
      const tag = m.tags?.[tagName];
      if (tag) {
        if (!grouped[tag]) grouped[tag] = [];
        grouped[tag].push(m.value);
      }
    });

    const averages: Record<string, number> = {};
    Object.entries(grouped).forEach(([key, values]) => {
      averages[key] = values.reduce((sum, v) => sum + v, 0) / values.length;
    });

    return averages;
  }

  private calculateCacheHitRate(metrics: PerformanceMetric[]): number {
    if (metrics.length === 0) return 0;
    const hits = metrics.filter(m => m.tags?.hit === 'true').length;
    return (hits / metrics.length) * 100;
  }

  private calculateErrorRate(): number {
    const now = Date.now();
    const oneHourAgo = now - 3600000;
    const recentErrors = this.errors.filter(e => e.timestamp.getTime() > oneHourAgo);
    const recentInteractions = this.interactions.filter(i => i.timestamp.getTime() > oneHourAgo);
    
    if (recentInteractions.length === 0) return 0;
    return (recentErrors.length / recentInteractions.length) * 100;
  }

  private generateRecommendations(analysis: any): string[] {
    const recommendations: string[] = [];

    // API Performance
    Object.entries(analysis.apiPerformance).forEach(([endpoint, avgTime]) => {
      if (avgTime as number > 1000) {
        recommendations.push(`Optimize API endpoint "${endpoint}" - average response time ${avgTime}ms exceeds 1s threshold`);
      }
    });

    // Database Performance
    if (analysis.databasePerformance > 100) {
      recommendations.push(`Database queries are slow (avg ${analysis.databasePerformance}ms). Consider adding indexes or query optimization.`);
    }

    // Cache Hit Rate
    if (analysis.cacheHitRate < 80) {
      recommendations.push(`Low cache hit rate (${analysis.cacheHitRate}%). Review caching strategy and TTL settings.`);
    }

    // Error Rate
    if (analysis.errorRate > 1) {
      recommendations.push(`High error rate detected (${analysis.errorRate}%). Investigate error logs for patterns.`);
    }

    // Memory Usage
    const memory = this.getMemoryUsage();
    const heapUsageMB = memory.heap / 1024 / 1024;
    if (heapUsageMB > 500) {
      recommendations.push(`High memory usage detected (${heapUsageMB.toFixed(2)}MB). Check for memory leaks.`);
    }

    return recommendations;
  }

  private sanitizeQuery(query: string): string {
    // Remove sensitive data from queries
    return query.substring(0, 100).replace(/\b\d{4,}\b/g, '[REDACTED]');
  }

  private sanitizeKey(key: string): string {
    // Remove sensitive data from cache keys
    return key.replace(/user_\d+/, 'user_[ID]').replace(/token_.*/, 'token_[REDACTED]');
  }

  private alertCriticalError(error: ErrorLog): void {
    // In production, send immediate alert (email, Slack, PagerDuty, etc.)
    console.error('[CRITICAL ERROR]', error);
    // Implement alerting service integration
  }

  private generateId(): string {
    return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Cleanup
  destroy(): void {
    if (this.flushInterval) {
      clearInterval(this.flushInterval);
      this.flushInterval = null;
    }
    this.flush(); // Final flush
  }
}

export const performanceMonitor = PerformanceMonitor.getInstance();