import React, { Component, ErrorInfo, ReactNode } from 'react';
import { PerformanceMonitor } from '@/lib/PerformanceMonitor';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  level?: 'page' | 'section' | 'component';
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  eventId?: string;
}

class ErrorBoundary extends Component<Props, State> {
  private performanceMonitor = PerformanceMonitor.getInstance();

  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      error,
      errorInfo,
    });

    // Log to performance monitor
    this.performanceMonitor.markStart('error-boundary-catch');
    this.performanceMonitor.markEnd('error-boundary-catch');

    // Custom error handling
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // Log error details
    console.error('ErrorBoundary caught an error:', error);
    console.error('Error info:', errorInfo);

    // In production, send to error reporting service
    if (process.env.NODE_ENV === 'production') {
      this.reportError(error, errorInfo);
    }
  }

  private async reportError(error: Error, errorInfo: ErrorInfo) {
    try {
      const errorData = {
        message: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
        level: this.props.level || 'component',
        url: window.location.href,
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString(),
        vitals: this.performanceMonitor.getVitals(),
      };

      await fetch('/api/errors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(errorData),
      });
    } catch (reportingError) {
      console.error('Failed to report error:', reportingError);
    }
  }

  private handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  private handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI based on level
      const { level = 'component' } = this.props;
      const { error, errorInfo } = this.state;

      if (level === 'page') {
        return (
          <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6">
              <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
                <svg
                  className="w-6 h-6 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 text-center mb-2">
                Something went wrong
              </h1>
              <p className="text-gray-600 text-center mb-6">
                We're sorry for the inconvenience. The page encountered an error and couldn't load properly.
              </p>
              <div className="space-y-3">
                <button
                  onClick={this.handleRetry}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
                >
                  Try Again
                </button>
                <button
                  onClick={this.handleReload}
                  className="w-full bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
                >
                  Reload Page
                </button>
              </div>
              {process.env.NODE_ENV === 'development' && error && (
                <details className="mt-4 text-sm">
                  <summary className="cursor-pointer text-gray-500 hover:text-gray-700">
                    Error Details (Development)
                  </summary>
                  <div className="mt-2 p-3 bg-gray-100 rounded text-xs font-mono overflow-auto">
                    <div className="text-red-600 font-semibold">{error.message}</div>
                    {error.stack && (
                      <pre className="mt-2 text-gray-600 whitespace-pre-wrap">
                        {error.stack}
                      </pre>
                    )}
                    {errorInfo?.componentStack && (
                      <details className="mt-2">
                        <summary className="cursor-pointer text-gray-600">
                          Component Stack
                        </summary>
                        <pre className="mt-1 text-gray-500 whitespace-pre-wrap">
                          {errorInfo.componentStack}
                        </pre>
                      </details>
                    )}
                  </div>
                </details>
              )}
            </div>
          </div>
        );
      }

      if (level === 'section') {
        return (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>
              <div className="ml-3 flex-1">
                <h3 className="text-sm font-medium text-red-800">
                  Section Error
                </h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>This section encountered an error and couldn't load.</p>
                </div>
                <div className="mt-4">
                  <button
                    onClick={this.handleRetry}
                    className="bg-red-600 hover:bg-red-700 text-white text-sm font-medium py-1 px-3 rounded-md transition-colors"
                  >
                    Retry
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      }

      // Component level (default)
      return (
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-yellow-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">
                Component Error
              </h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>This component couldn't load properly.</p>
              </div>
              <div className="mt-4">
                <button
                  onClick={this.handleRetry}
                  className="bg-yellow-600 hover:bg-yellow-700 text-white text-xs font-medium py-1 px-2 rounded transition-colors"
                >
                  Retry
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;