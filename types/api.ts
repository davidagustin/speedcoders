import { User, Problem, Quiz, QuizAttempt, Achievement, UserStats } from './models';

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Auth API types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  token: string;
  success: boolean;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

export interface RegisterResponse {
  user: User;
  token: string;
  success: boolean;
  message: string;
}

// Quiz API types
export interface CreateQuizRequest {
  userId?: string;
  problemCount?: number;
  difficulty?: 'Easy' | 'Medium' | 'Hard' | 'Mixed';
  category?: string;
  specificProblem?: string;
  specificProblems?: string[];
}

export interface CreateQuizResponse {
  success: boolean;
  attempt: QuizAttempt;
  quiz: Quiz;
}

export interface SubmitQuizRequest {
  attemptId: string;
  answers: Record<string, any>;
  timeSpent: number;
}

export interface SubmitQuizResponse {
  success: boolean;
  score: number;
  results: {
    correct: number;
    total: number;
    timeSpent: number;
    accuracy: number;
  };
}

// Analytics API types
export interface AnalyticsResponse {
  userStats: UserStats;
  problemBreakdown: {
    easy: { total: number; solved: number; accuracy: number };
    medium: { total: number; solved: number; accuracy: number };
    hard: { total: number; solved: number; accuracy: number };
  };
  categoryPerformance: Array<{
    name: string;
    solved: number;
    total: number;
    accuracy: number;
  }>;
  recentActivity: Array<{
    date: string;
    problem: string;
    difficulty: string;
    solved: boolean;
    time: number;
  }>;
  weeklyProgress: Array<{
    day: string;
    problems: number;
    time: number;
  }>;
}

// Problems API types
export interface ProblemsRequest {
  page?: number;
  limit?: number;
  difficulty?: string;
  category?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface ProblemsResponse {
  success: boolean;
  data: {
    problems: Problem[];
    stats: {
      total: number;
      easy: number;
      medium: number;
      hard: number;
      categories: string[];
      algorithms: string[];
      filtered: number;
      returned: number;
    };
    pagination: {
      limit: number;
      offset: number;
      total: number;
      hasMore: boolean;
    };
  };
}