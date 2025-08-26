// API Routes Configuration
export const API_ROUTES = {
  // Auth routes
  auth: {
    login: '/api/auth/login',
    register: '/api/auth/register',
    logout: '/api/auth/logout',
  },
  
  // Quiz routes
  quiz: {
    list: '/api/quiz',
    create: '/api/quiz/create',
    generate: '/api/quiz/generate',
    start: '/api/quiz/start',
    enhancedStart: '/api/quiz/enhanced-start',
    submit: '/api/quiz/submit',
    byId: (id: string) => `/api/quiz/${id}`,
    results: (id: string) => `/api/quiz/${id}/results`,
    submitAnswer: (id: string) => `/api/quiz/${id}/submit`,
  },
  
  // Problem routes
  problems: {
    list: '/api/problems',
    enhanced: '/api/problems/enhanced',
    byId: (id: string) => `/api/problems/${id}`,
  },
  
  // Analytics routes
  analytics: {
    overview: '/api/analytics',
    advanced: '/api/analytics/advanced',
    detailed: '/api/analytics/detailed',
  },
  
  // Progress routes
  progress: {
    overview: '/api/progress',
    detailed: '/api/progress/detailed',
    update: '/api/progress/update',
  },
  
  // System routes
  system: {
    health: '/api/health',
    monitoring: '/api/monitoring',
    performance: '/api/performance',
  },
} as const;

// API Base URL helper
export const getApiUrl = (path: string) => {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || '';
  return `${baseUrl}${path}`;
};