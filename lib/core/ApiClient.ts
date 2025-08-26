/**
 * Centralized API client with comprehensive error handling,
 * request/response interceptors, and type safety
 */

interface ApiResponse<T = any> {
  data: T;
  success: boolean;
  error?: string;
  meta?: {
    pagination?: {
      page: number;
      limit: number;
      total: number;
      hasMore: boolean;
    };
    timing?: {
      duration: number;
      timestamp: string;
    };
  };
}

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers?: Record<string, string>;
  body?: any;
  timeout?: number;
  retry?: number;
  retryDelay?: number;
  cache?: RequestCache;
  signal?: AbortSignal;
}

interface ApiError extends Error {
  status: number;
  code: string;
  details?: any;
  timestamp: string;
}

export class ApiClient {
  private baseUrl: string;
  private defaultHeaders: Record<string, string>;
  private requestInterceptors: Array<(config: RequestOptions) => RequestOptions | Promise<RequestOptions>> = [];
  private responseInterceptors: Array<(response: any) => any> = [];
  private errorInterceptors: Array<(error: ApiError) => ApiError | void> = [];

  constructor(baseUrl: string = '') {
    this.baseUrl = baseUrl;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      'X-Client-Version': '2.0.0',
      'X-Timestamp': Date.now().toString()
    };

    // Add CSRF token if available
    if (typeof window !== 'undefined') {
      const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
      if (csrfToken) {
        this.defaultHeaders['X-CSRF-Token'] = csrfToken;
      }
    }
  }

  // Request interceptor
  addRequestInterceptor(
    interceptor: (config: RequestOptions) => RequestOptions | Promise<RequestOptions>
  ): void {
    this.requestInterceptors.push(interceptor);
  }

  // Response interceptor
  addResponseInterceptor(interceptor: (response: any) => any): void {
    this.responseInterceptors.push(interceptor);
  }

  // Error interceptor
  addErrorInterceptor(interceptor: (error: ApiError) => ApiError | void): void {
    this.errorInterceptors.push(interceptor);
  }

  // Core request method
  async request<T = any>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<ApiResponse<T>> {
    const url = this.buildUrl(endpoint);
    let config = await this.processRequestInterceptors({
      method: 'GET',
      timeout: 10000,
      retry: 3,
      retryDelay: 1000,
      ...options
    });

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), config.timeout);

    try {
      const startTime = Date.now();
      let response: Response;
      let attempt = 0;

      while (attempt <= (config.retry || 0)) {
        try {
          response = await fetch(url, {
            method: config.method,
            headers: {
              ...this.defaultHeaders,
              ...config.headers
            },
            body: config.body ? JSON.stringify(config.body) : undefined,
            cache: config.cache,
            signal: config.signal || controller.signal
          });

          if (response.ok) {
            break;
          } else if (response.status >= 500 && attempt < (config.retry || 0)) {
            // Retry on server errors
            await this.delay(config.retryDelay! * (attempt + 1));
            attempt++;
            continue;
          } else {
            throw await this.createApiError(response);
          }
        } catch (error) {
          if (attempt === (config.retry || 0)) {
            throw error;
          }
          await this.delay(config.retryDelay! * (attempt + 1));
          attempt++;
        }
      }

      const responseData = await this.parseResponse(response!);
      const duration = Date.now() - startTime;

      const apiResponse: ApiResponse<T> = {
        ...responseData,
        meta: {
          ...responseData.meta,
          timing: {
            duration,
            timestamp: new Date().toISOString()
          }
        }
      };

      return this.processResponseInterceptors(apiResponse);
    } catch (error) {
      const apiError = error instanceof Error 
        ? await this.createApiError(null, error)
        : error as ApiError;
      
      this.processErrorInterceptors(apiError);
      throw apiError;
    } finally {
      clearTimeout(timeoutId);
    }
  }

  // Convenience methods
  async get<T = any>(endpoint: string, options: Omit<RequestOptions, 'method'> = {}): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }

  async post<T = any>(endpoint: string, body?: any, options: Omit<RequestOptions, 'method' | 'body'> = {}): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: 'POST', body });
  }

  async put<T = any>(endpoint: string, body?: any, options: Omit<RequestOptions, 'method' | 'body'> = {}): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: 'PUT', body });
  }

  async patch<T = any>(endpoint: string, body?: any, options: Omit<RequestOptions, 'method' | 'body'> = {}): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: 'PATCH', body });
  }

  async delete<T = any>(endpoint: string, options: Omit<RequestOptions, 'method'> = {}): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }

  // Batch requests
  async batch<T = any>(requests: Array<{ endpoint: string; options?: RequestOptions }>): Promise<ApiResponse<T>[]> {
    const promises = requests.map(req => this.request<T>(req.endpoint, req.options));
    return Promise.all(promises);
  }

  // Upload file
  async uploadFile<T = any>(
    endpoint: string,
    file: File,
    options: Omit<RequestOptions, 'method' | 'body'> = {}
  ): Promise<ApiResponse<T>> {
    const formData = new FormData();
    formData.append('file', file);

    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      headers: {
        ...options.headers,
        // Remove Content-Type to let browser set it with boundary
      },
      body: formData as any
    });
  }

  // Stream data
  async *stream<T = any>(
    endpoint: string,
    options: RequestOptions = {}
  ): AsyncGenerator<T, void, unknown> {
    const response = await fetch(this.buildUrl(endpoint), {
      method: options.method || 'GET',
      headers: {
        ...this.defaultHeaders,
        ...options.headers,
        'Accept': 'text/event-stream'
      },
      body: options.body ? JSON.stringify(options.body) : undefined
    });

    if (!response.body) {
      throw new Error('No response body for streaming');
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    try {
      while (true) {
        const { done, value } = await reader.read();
        
        if (done) break;
        
        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));
              yield data as T;
            } catch (error) {
              console.warn('Failed to parse SSE data:', line);
            }
          }
        }
      }
    } finally {
      reader.releaseLock();
    }
  }

  // Helper methods
  private buildUrl(endpoint: string): string {
    if (endpoint.startsWith('http')) {
      return endpoint;
    }
    return `${this.baseUrl}${endpoint.startsWith('/') ? endpoint : '/' + endpoint}`;
  }

  private async processRequestInterceptors(config: RequestOptions): Promise<RequestOptions> {
    let processedConfig = config;
    
    for (const interceptor of this.requestInterceptors) {
      processedConfig = await interceptor(processedConfig);
    }
    
    return processedConfig;
  }

  private processResponseInterceptors<T>(response: ApiResponse<T>): ApiResponse<T> {
    let processedResponse = response;
    
    for (const interceptor of this.responseInterceptors) {
      processedResponse = interceptor(processedResponse);
    }
    
    return processedResponse;
  }

  private processErrorInterceptors(error: ApiError): void {
    for (const interceptor of this.errorInterceptors) {
      const result = interceptor(error);
      if (result) {
        Object.assign(error, result);
      }
    }
  }

  private async parseResponse(response: Response): Promise<any> {
    const contentType = response.headers.get('content-type');
    
    if (contentType?.includes('application/json')) {
      return await response.json();
    } else if (contentType?.includes('text/')) {
      const text = await response.text();
      return { data: text, success: true };
    } else {
      const blob = await response.blob();
      return { data: blob, success: true };
    }
  }

  private async createApiError(response: Response | null, originalError?: Error): Promise<ApiError> {
    const error = new Error() as ApiError;
    error.timestamp = new Date().toISOString();

    if (response) {
      error.status = response.status;
      error.message = response.statusText;
      
      try {
        const errorData = await response.json();
        error.message = errorData.message || errorData.error || response.statusText;
        error.code = errorData.code || `HTTP_${response.status}`;
        error.details = errorData.details;
      } catch {
        error.code = `HTTP_${response.status}`;
      }
    } else if (originalError) {
      error.message = originalError.message;
      error.status = 0;
      error.code = originalError.name;
      
      if (originalError.name === 'AbortError') {
        error.code = 'TIMEOUT';
        error.message = 'Request timed out';
      }
    }

    return error;
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Configuration methods
  setDefaultHeader(key: string, value: string): void {
    this.defaultHeaders[key] = value;
  }

  removeDefaultHeader(key: string): void {
    delete this.defaultHeaders[key];
  }

  setAuthToken(token: string): void {
    this.setDefaultHeader('Authorization', `Bearer ${token}`);
  }

  clearAuthToken(): void {
    this.removeDefaultHeader('Authorization');
  }
}

// Create singleton instance
export const apiClient = new ApiClient('/api');

// Add common interceptors
apiClient.addRequestInterceptor((config) => {
  // Add user session info if available
  if (typeof window !== 'undefined') {
    const sessionId = localStorage.getItem('sessionId');
    if (sessionId) {
      config.headers = { ...config.headers, 'X-Session-ID': sessionId };
    }
  }
  
  return config;
});

apiClient.addResponseInterceptor((response) => {
  // Log slow requests
  if (response.meta?.timing?.duration && response.meta.timing.duration > 2000) {
    console.warn(`Slow API request detected: ${response.meta.timing.duration}ms`);
  }
  
  return response;
});

apiClient.addErrorInterceptor((error) => {
  // Handle authentication errors
  if (error.status === 401) {
    if (typeof window !== 'undefined') {
      window.location.href = '/auth/login';
    }
  }
  
  // Log errors in development
  if (process.env.NODE_ENV === 'development') {
    console.error('API Error:', error);
  }
  
  return error;
});

export type { ApiResponse, ApiError, RequestOptions };