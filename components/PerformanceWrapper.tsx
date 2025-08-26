"use client";

import { useEffect } from "react";
import { usePerformanceMonitor } from "@/lib/PerformanceMonitor";

interface PerformanceWrapperProps {
	name: string;
	children: React.ReactNode;
}

export function PerformanceWrapper({
	name,
	children,
}: PerformanceWrapperProps) {
	const { measureComponent } = usePerformanceMonitor();

	useEffect(() => {
		const { start, end } = measureComponent(name);
		start();

		return () => {
			end();
		};
	}, [name, measureComponent]);

	return <>{children}</>;
}

export function withPerformanceTracking<T extends object>(
	Component: React.ComponentType<T>,
	name?: string,
) {
	const WrappedComponent = (props: T) => {
		const componentName =
			name || Component.displayName || Component.name || "Component";

		return (
			<PerformanceWrapper name={componentName}>
				<Component {...props} />
			</PerformanceWrapper>
		);
	};

	WrappedComponent.displayName = `withPerformanceTracking(${Component.displayName || Component.name})`;

	return WrappedComponent;
}
