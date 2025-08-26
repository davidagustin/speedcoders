"use client";

import { useEffect } from "react";
import { initPerformanceMonitoring } from "@/lib/PerformanceMonitor";

export function PerformanceProvider({ children }: { children: React.ReactNode }) {
	useEffect(() => {
		initPerformanceMonitoring();
	}, []);

	return <>{children}</>;
}