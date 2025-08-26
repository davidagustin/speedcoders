"use client";

interface PerformanceMetric {
	name: string;
	value: number;
	timestamp: number;
	category: "navigation" | "paint" | "resource" | "custom";
}

interface VitalMetrics {
	fcp?: number; // First Contentful Paint
	lcp?: number; // Largest Contentful Paint
	fid?: number; // First Input Delay
	cls?: number; // Cumulative Layout Shift
	ttfb?: number; // Time to First Byte
}

export class PerformanceMonitor {
	private static instance: PerformanceMonitor;
	private metrics: PerformanceMetric[] = [];
	private vitals: VitalMetrics = {};
	private observers: PerformanceObserver[] = [];

	static getInstance(): PerformanceMonitor {
		if (!PerformanceMonitor.instance) {
			PerformanceMonitor.instance = new PerformanceMonitor();
		}
		return PerformanceMonitor.instance;
	}

	init(): void {
		if (typeof window === "undefined") return;

		this.observeWebVitals();
		this.observeNavigationTiming();
		this.observeResourceTiming();
		this.setupCustomMetrics();
	}

	private observeWebVitals(): void {
		if (!("PerformanceObserver" in window)) return;

		// First Contentful Paint
		const fcpObserver = new PerformanceObserver((entryList) => {
			for (const entry of entryList.getEntries()) {
				if (entry.name === "first-contentful-paint") {
					this.vitals.fcp = entry.startTime;
					this.addMetric("FCP", entry.startTime, "paint");
				}
			}
		});
		fcpObserver.observe({ entryTypes: ["paint"] });
		this.observers.push(fcpObserver);

		// Largest Contentful Paint
		const lcpObserver = new PerformanceObserver((entryList) => {
			const entries = entryList.getEntries();
			const lastEntry = entries[entries.length - 1] as any;
			if (lastEntry) {
				this.vitals.lcp = lastEntry.startTime;
				this.addMetric("LCP", lastEntry.startTime, "paint");
			}
		});
		lcpObserver.observe({ entryTypes: ["largest-contentful-paint"] });
		this.observers.push(lcpObserver);

		// First Input Delay
		const fidObserver = new PerformanceObserver((entryList) => {
			for (const entry of entryList.getEntries() as any[]) {
				if (entry.processingStart && entry.startTime) {
					const fid = entry.processingStart - entry.startTime;
					this.vitals.fid = fid;
					this.addMetric("FID", fid, "custom");
				}
			}
		});
		fidObserver.observe({ entryTypes: ["first-input"] });
		this.observers.push(fidObserver);

		// Cumulative Layout Shift
		let clsValue = 0;
		const clsObserver = new PerformanceObserver((entryList) => {
			for (const entry of entryList.getEntries() as any[]) {
				if (!entry.hadRecentInput) {
					clsValue += entry.value;
				}
			}
			this.vitals.cls = clsValue;
			this.addMetric("CLS", clsValue, "custom");
		});
		clsObserver.observe({ entryTypes: ["layout-shift"] });
		this.observers.push(clsObserver);
	}

	private observeNavigationTiming(): void {
		if (!performance.getEntriesByType) return;

		const navEntries = performance.getEntriesByType(
			"navigation",
		) as PerformanceNavigationTiming[];
		if (navEntries.length > 0) {
			const entry = navEntries[0];

			// Time to First Byte
			const ttfb = entry.responseStart - entry.fetchStart;
			this.vitals.ttfb = ttfb;
			this.addMetric("TTFB", ttfb, "navigation");

			// DNS Resolution Time
			const dnsTime = entry.domainLookupEnd - entry.domainLookupStart;
			this.addMetric("DNS Resolution", dnsTime, "navigation");

			// Connection Time
			const connectionTime = entry.connectEnd - entry.connectStart;
			this.addMetric("Connection Time", connectionTime, "navigation");

			// DOM Content Loaded
			const domContentLoaded =
				entry.domContentLoadedEventEnd - entry.fetchStart;
			this.addMetric("DOM Content Loaded", domContentLoaded, "navigation");

			// Page Load Complete
			const loadComplete = entry.loadEventEnd - entry.fetchStart;
			this.addMetric("Load Complete", loadComplete, "navigation");
		}
	}

	private observeResourceTiming(): void {
		if (!("PerformanceObserver" in window)) return;

		const resourceObserver = new PerformanceObserver((entryList) => {
			for (const entry of entryList.getEntries()) {
				const resourceEntry = entry as PerformanceResourceTiming;

				// Track slow resources
				if (resourceEntry.duration > 1000) {
					// > 1 second
					this.addMetric(
						`Slow Resource: ${resourceEntry.name}`,
						resourceEntry.duration,
						"resource",
					);
				}
			}
		});
		resourceObserver.observe({ entryTypes: ["resource"] });
		this.observers.push(resourceObserver);
	}

	private setupCustomMetrics(): void {
		// Track memory usage if available
		if ("memory" in performance) {
			const memory = (performance as any).memory;
			this.addMetric("JS Heap Used", memory.usedJSHeapSize, "custom");
			this.addMetric("JS Heap Total", memory.totalJSHeapSize, "custom");
			this.addMetric("JS Heap Limit", memory.jsHeapSizeLimit, "custom");
		}
	}

	private addMetric(
		name: string,
		value: number,
		category: PerformanceMetric["category"],
	): void {
		this.metrics.push({
			name,
			value,
			timestamp: Date.now(),
			category,
		});

		// Keep only last 100 metrics
		if (this.metrics.length > 100) {
			this.metrics = this.metrics.slice(-100);
		}
	}

	// Public API
	markStart(name: string): void {
		if (typeof window !== "undefined" && performance.mark) {
			performance.mark(`${name}-start`);
		}
	}

	markEnd(name: string): number {
		if (
			typeof window !== "undefined" &&
			performance.mark &&
			performance.measure
		) {
			performance.mark(`${name}-end`);
			performance.measure(name, `${name}-start`, `${name}-end`);

			const measures = performance.getEntriesByName(name, "measure");
			if (measures.length > 0) {
				const duration = measures[measures.length - 1].duration;
				this.addMetric(name, duration, "custom");
				return duration;
			}
		}
		return 0;
	}

	getMetrics(): PerformanceMetric[] {
		return [...this.metrics];
	}

	getVitals(): VitalMetrics {
		return { ...this.vitals };
	}

	getMetricsByCategory(
		category: PerformanceMetric["category"],
	): PerformanceMetric[] {
		return this.metrics.filter((metric) => metric.category === category);
	}

	async reportMetrics(): Promise<void> {
		const data = {
			vitals: this.vitals,
			metrics: this.metrics,
			url: window.location.href,
			userAgent: navigator.userAgent,
			timestamp: Date.now(),
		};

		try {
			await fetch("/api/performance", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(data),
			});
		} catch (error) {
			console.warn("Failed to report performance metrics:", error);
		}
	}

	cleanup(): void {
		this.observers.forEach((observer) => observer.disconnect());
		this.observers = [];
		this.metrics = [];
		this.vitals = {};
	}
}

// Hook for React components
export function usePerformanceMonitor() {
	const monitor = PerformanceMonitor.getInstance();

	const measureComponent = (componentName: string) => {
		return {
			start: () => monitor.markStart(componentName),
			end: () => monitor.markEnd(componentName),
		};
	};

	const measureAsync = async <T>(
		name: string,
		fn: () => Promise<T>,
	): Promise<T> => {
		monitor.markStart(name);
		try {
			const result = await fn();
			monitor.markEnd(name);
			return result;
		} catch (error) {
			monitor.markEnd(name);
			throw error;
		}
	};

	return {
		measureComponent,
		measureAsync,
		getMetrics: () => monitor.getMetrics(),
		getVitals: () => monitor.getVitals(),
		reportMetrics: () => monitor.reportMetrics(),
	};
}

// Initialize performance monitoring
export const initPerformanceMonitoring = () => {
	if (typeof window !== "undefined") {
		const monitor = PerformanceMonitor.getInstance();
		monitor.init();

		// Report metrics on page unload
		window.addEventListener("beforeunload", () => {
			monitor.reportMetrics();
		});

		// Report metrics periodically
		setInterval(() => {
			monitor.reportMetrics();
		}, 30000); // Every 30 seconds
	}
};
