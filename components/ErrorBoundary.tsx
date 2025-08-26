"use client";

import { AlertTriangle, Home, RefreshCw } from "lucide-react";
import Link from "next/link";
import type React from "react";
import { ErrorBoundary as ReactErrorBoundary } from "react-error-boundary";

interface ErrorFallbackProps {
	error: Error;
	resetErrorBoundary: () => void;
}

function ErrorFallback({ error, resetErrorBoundary }: ErrorFallbackProps) {
	const isDevelopment = process.env.NODE_ENV === "development";

	return (
		<div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
			<div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
				<div className="flex justify-center mb-4">
					<div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
						<AlertTriangle className="w-8 h-8 text-red-600" />
					</div>
				</div>

				<h1 className="text-xl font-semibold text-gray-900 mb-2">
					Something went wrong
				</h1>

				<p className="text-gray-600 mb-6">
					We apologize for the inconvenience. An unexpected error occurred.
				</p>

				{isDevelopment && (
					<div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-left">
						<h3 className="text-sm font-medium text-red-800 mb-2">
							Error Details:
						</h3>
						<pre className="text-xs text-red-700 whitespace-pre-wrap overflow-auto max-h-32">
							{error.message}
						</pre>
					</div>
				)}

				<div className="flex flex-col sm:flex-row gap-3 justify-center">
					<button
						onClick={resetErrorBoundary}
						className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
					>
						<RefreshCw className="w-4 h-4 mr-2" />
						Try Again
					</button>

					<Link
						href="/"
						className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
					>
						<Home className="w-4 h-4 mr-2" />
						Go Home
					</Link>
				</div>
			</div>
		</div>
	);
}

interface ErrorBoundaryProps {
	children: React.ReactNode;
	fallback?: React.ComponentType<ErrorFallbackProps>;
}

export function ErrorBoundary({ children, fallback }: ErrorBoundaryProps) {
	return (
		<ReactErrorBoundary
			FallbackComponent={fallback || ErrorFallback}
			onError={(error, errorInfo) => {
				// Log error to monitoring service
				console.error("Error Boundary caught an error:", error, errorInfo);

				// In production, send to error tracking service
				if (process.env.NODE_ENV === "production") {
					// Example: Sentry.captureException(error, { contexts: { errorBoundary: errorInfo } })
				}
			}}
		>
			{children}
		</ReactErrorBoundary>
	);
}

export default ErrorBoundary;
