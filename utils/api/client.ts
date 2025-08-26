// Centralized API client
import { ApiResponse } from '@/types/api';
import { API_ROUTES } from './routes';

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string = '') {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();
      
      if (!response.ok) {
        return {
          success: false,
          error: data.error || `HTTP ${response.status}`,
          data: null,
        };
      }

      return data;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error',
        data: null,
      };
    }
  }

  // GET request
  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  // POST request
  async post<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  // PUT request
  async put<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  // DELETE request
  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }

  // Authentication methods
  async login(email: string, password: string) {
    return this.post(API_ROUTES.auth.login, { email, password });
  }

  async register(email: string, password: string, name: string) {
    return this.post(API_ROUTES.auth.register, { email, password, name });
  }

  // Quiz methods
  async getQuizzes() {
    return this.get(API_ROUTES.quiz.list);
  }

  async startQuiz(data: any) {
    return this.post(API_ROUTES.quiz.start, data);
  }

  async startEnhancedQuiz(data: any) {
    return this.post(API_ROUTES.quiz.enhancedStart, data);
  }

  async createQuiz(data: any) {
    return this.post(API_ROUTES.quiz.create, data);
  }

  async generateQuiz(data: any) {
    return this.post(API_ROUTES.quiz.generate, data);
  }

  async getQuizById(id: string) {
    return this.get(API_ROUTES.quiz.byId(id));
  }

  // Problem methods
  async getProblems(params?: Record<string, string>) {
    const searchParams = params ? `?${new URLSearchParams(params).toString()}` : '';
    return this.get(`${API_ROUTES.problems.list}${searchParams}`);
  }

  // Analytics methods
  async getAnalytics(userId?: string) {
    const searchParams = userId ? `?userId=${userId}` : '';
    return this.get(`${API_ROUTES.analytics.overview}${searchParams}`);
  }

  // Progress methods
  async getProgress(timeRange?: string) {
    const searchParams = timeRange ? `?timeRange=${timeRange}` : '';
    return this.get(`${API_ROUTES.progress.overview}${searchParams}`);
  }
}

// Default export - singleton instance
export const apiClient = new ApiClient();

// Named export for creating new instances
export { ApiClient };