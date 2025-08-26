"use client";

import { useEffect, useState } from "react";
import { usePerformanceMonitor } from "@/lib/PerformanceMonitor";

interface PerformanceTrackerProps {
	enabled?: boolean;
	showDebugPanel?: boolean;
}

export function PerformanceTracker({
	enabled = true,
	showDebugPanel = false,
}: PerformanceTrackerProps) {
	const { getMetrics, getVitals, reportMetrics } = usePerformanceMonitor();
	const [isVisible, setIsVisible] = useState(false);
	const [metrics, setMetrics] = useState<any[]>([]);
	const [vitals, setVitals] = useState<any>({});

	useEffect(() => {
		if (!enabled) return;

		const updateMetrics = () => {
			setMetrics(getMetrics());
			setVitals(getVitals());
		};

		updateMetrics();
		const interval = setInterval(updateMetrics, 5000); // Update every 5 seconds

		// Keyboard shortcut to toggle debug panel
		const handleKeyPress = (e: KeyboardEvent) => {
			if (e.ctrlKey && e.shiftKey && e.key === "P") {
				setIsVisible(!isVisible);
			}
		};

		if (showDebugPanel) {
			document.addEventListener("keydown", handleKeyPress);
		}

		return () => {
			clearInterval(interval);
			document.removeEventListener("keydown", handleKeyPress);
		};
	}, [enabled, showDebugPanel, isVisible, getMetrics, getVitals]);

	if (!enabled || (!showDebugPanel && !isVisible)) return null;

	const formatValue = (value: number) => {
		if (value < 1000) return `${Math.round(value)}ms`;
		return `${(value / 1000).toFixed(2)}s`;
	};

	const getVitalStatus = (key: string, value: number) => {
		const thresholds = {
			fcp: { good: 1800, poor: 3000 },
			lcp: { good: 2500, poor: 4000 },
			fid: { good: 100, poor: 300 },
			cls: { good: 0.1, poor: 0.25 },
			ttfb: { good: 600, poor: 1500 },
		} as const;

		const threshold = thresholds[key as keyof typeof thresholds];
		if (!threshold) return "neutral";

		if (value <= threshold.good) return "good";
		if (value <= threshold.poor) return "needs-improvement";
		return "poor";
	};

	return (
		<div className="fixed bottom-4 right-4 z-50">
			{!isVisible && showDebugPanel && (
				<button
					onClick={() => setIsVisible(true)}
					className="bg-blue-600 text-white px-3 py-2 rounded-lg text-sm font-mono shadow-lg hover:bg-blue-700"
				>
					Perf
				</button>
			)}

			{isVisible && (
				<div className="bg-black bg-opacity-90 text-white p-4 rounded-lg max-w-md max-h-96 overflow-y-auto shadow-2xl">
					<div className="flex justify-between items-center mb-3">
						<h3 className="font-bold text-lg">Performance Monitor</h3>
						<button
							onClick={() => setIsVisible(false)}
							className="text-gray-400 hover:text-white"
						>
							×
						</button>
					</div>

					<div className="mb-4">
						<h4 className="font-semibold mb-2 text-yellow-400">
							Core Web Vitals
						</h4>
						<div className="space-y-1 text-sm">
							{Object.entries(vitals).map(([key, value]) => {
								const status = getVitalStatus(key, value as number);
								const statusColors = {
									good: "text-green-400",
									"needs-improvement": "text-yellow-400",
									poor: "text-red-400",
									neutral: "text-gray-400",
								};

								return (
									<div key={key} className="flex justify-between">
										<span className="uppercase">{key}:</span>
										<span className={statusColors[status]}>
											{key === "cls"
												? (value as number).toFixed(3)
												: formatValue(value as number)}
										</span>
									</div>
								);
							})}
						</div>
					</div>

					<div className="mb-4">
						<h4 className="font-semibold mb-2 text-blue-400">Recent Metrics</h4>
						<div className="space-y-1 text-xs max-h-32 overflow-y-auto">
							{metrics
								.slice(-10)
								.reverse()
								.map((metric, index) => (
									<div key={index} className="flex justify-between">
										<span className="truncate mr-2">{metric.name}:</span>
										<span className="text-gray-300">
											{formatValue(metric.value)}
										</span>
									</div>
								))}
						</div>
					</div>

					<div className="flex gap-2">
						<button
							onClick={() => reportMetrics()}
							className="bg-green-600 hover:bg-green-700 px-2 py-1 rounded text-xs"
						>
							Report
						</button>
						<button
							onClick={() => {
								setMetrics([]);
								setVitals({});
							}}
							className="bg-red-600 hover:bg-red-700 px-2 py-1 rounded text-xs"
						>
							Clear
						</button>
					</div>

					<div className="mt-2 text-xs text-gray-400">
						Press Ctrl+Shift+P to toggle
					</div>
				</div>
			)}
		</div>
	);
}

export default PerformanceTracker;
