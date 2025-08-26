// Performance monitoring types
export interface PerformanceMetrics {
  componentName: string;
  renderTime: number;
  updateCount: number;
  timestamp: number;
  props?: Record<string, any>;
}

export interface LoadingState {
  isLoading: boolean;
  loadingText?: string;
  progress?: number;
}

export interface ErrorState {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
}

export interface ComponentPerformanceData {
  averageRenderTime: number;
  slowestRender: number;
  fastestRender: number;
  totalRenders: number;
  memoryUsage?: number;
}