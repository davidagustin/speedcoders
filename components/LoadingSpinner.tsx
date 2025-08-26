"use client";

import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
	size?: "sm" | "md" | "lg" | "xl";
	className?: string;
}

export function LoadingSpinner({
	size = "md",
	className,
}: LoadingSpinnerProps = {}) {
	const sizeClasses = {
		sm: "h-4 w-4",
		md: "h-8 w-8",
		lg: "h-12 w-12",
		xl: "h-16 w-16",
	};

	return (
		<div className={cn("flex items-center justify-center", className)}>
			<div
				className={cn(
					"animate-spin rounded-full border-b-2 border-blue-600",
					sizeClasses[size],
				)}
			></div>
		</div>
	);
}

interface LoadingStateProps {
	loading?: boolean;
	children: React.ReactNode;
	fallback?: React.ReactNode;
	className?: string;
}

export function LoadingState({
	loading,
	children,
	fallback,
	className,
}: LoadingStateProps) {
	if (loading) {
		return (
			<div className={cn("flex items-center justify-center p-8", className)}>
				{fallback || <LoadingSpinner size="lg" />}
			</div>
		);
	}

	return <>{children}</>;
}

interface AsyncButtonProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	loading?: boolean;
	loadingText?: string;
	children: React.ReactNode;
}

export function AsyncButton({
	loading,
	loadingText = "Loading...",
	disabled,
	children,
	className,
	...props
}: AsyncButtonProps) {
	return (
		<button
			disabled={disabled || loading}
			className={cn(
				"inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-lg transition-colors",
				"bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed",
				className,
			)}
			{...props}
		>
			{loading && <LoadingSpinner size="sm" className="mr-2" />}
			{loading ? loadingText : children}
		</button>
	);
}

export default LoadingSpinner;
