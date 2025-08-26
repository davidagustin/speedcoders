import { NextRequest, NextResponse } from 'next/server';
import { PerformanceMonitor } from '@/lib/monitoring/PerformanceMonitor';

const monitor = PerformanceMonitor.getInstance();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { metrics, errors, interactions } = body;

    let processed = {
      metrics: 0,
      errors: 0,
      interactions: 0
    };

    // Process metrics
    if (metrics && Array.isArray(metrics)) {
      metrics.forEach((metric: any) => {
        monitor.trackMetric({
          name: metric.name,
          value: metric.value,
          category: metric.category,
          tags: metric.tags || {}
        });
        processed.metrics++;
      });
    }

    // Process errors
    if (errors && Array.isArray(errors)) {
      errors.forEach((error: any) => {
        monitor.trackError(
          new Error(error.error),
          error.context || {},
          error.severity || 'medium'
        );
        processed.errors++;
      });
    }

    // Process interactions
    if (interactions && Array.isArray(interactions)) {
      interactions.forEach((interaction: any) => {
        monitor.trackMetric({
          name: `interaction.${interaction.type}`,
          value: interaction.duration || 0,
          category: 'user-interaction',
          tags: {
            component: interaction.component,
            action: interaction.action
          }
        });
        processed.interactions++;
      });
    }

    return NextResponse.json({
      success: true,
      processed
    });
  } catch (error) {
    console.error('Monitoring API error:', error);
    return NextResponse.json(
      { error: 'Failed to process monitoring data' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const stats = monitor.getStats();
    const memoryUsage = process.memoryUsage();
    
    const health = {
      status: 'healthy' as 'healthy' | 'degraded' | 'critical',
      uptime: process.uptime(),
      memory: {
        heap: memoryUsage.heapUsed,
        external: memoryUsage.external,
        total: memoryUsage.rss
      },
      performance: {
        apiLatency: stats.averages.apiCalls || 0,
        dbLatency: 0, // Would come from database monitoring
        cacheHitRate: 0.85, // Would come from cache monitoring
        errorRate: stats.totalErrors / Math.max(stats.totalCalls, 1)
      },
      recommendations: [] as string[]
    };

    // Determine health status
    if (stats.totalErrors > 100 || health.performance.errorRate > 0.1) {
      health.status = 'critical';
      health.recommendations.push('High error rate detected. Check error logs.');
    } else if (stats.totalErrors > 50 || health.performance.errorRate > 0.05) {
      health.status = 'degraded';
      health.recommendations.push('Elevated error rate detected.');
    }

    if (health.performance.apiLatency > 1000) {
      health.status = health.status === 'healthy' ? 'degraded' : health.status;
      health.recommendations.push('High API latency detected. Consider optimization.');
    }

    if (memoryUsage.heapUsed / memoryUsage.heapTotal > 0.9) {
      health.recommendations.push('High memory usage detected. Consider scaling.');
    }

    return NextResponse.json({
      success: true,
      health
    });
  } catch (error) {
    console.error('Health check error:', error);
    return NextResponse.json(
      { error: 'Failed to get health status' },
      { status: 500 }
    );
  }
}