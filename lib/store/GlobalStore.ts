/**
 * Global state management using Zustand with TypeScript
 * Comprehensive store for SpeedCoders application
 */

import { create } from 'zustand';
import { devtools, persist, subscribeWithSelector } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

// Types
interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  preferences: {
    theme: 'light' | 'dark' | 'system';
    fontSize: 'small' | 'medium' | 'large';
    autoSave: boolean;
    notifications: boolean;
    language: string;
  };
  stats: {
    problemsSolved: number;
    totalTime: number;
    streak: number;
    accuracy: number;
    rank: string;
  };
}

interface Problem {
  id: number;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: string;
  description: string;
  algorithms: string[];
  solved?: boolean;
  bookmarked?: boolean;
  attempts?: number;
  bestTime?: number;
}

interface Quiz {
  id: string;
  title: string;
  problems: Problem[];
  timeLimit: number;
  currentProblem: number;
  startedAt?: Date;
  completedAt?: Date;
  score: number;
  answers: Record<number, any>;
}

interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  actions?: Array<{
    label: string;
    action: () => void;
  }>;
}

interface AppState {
  // User state
  user: User | null;
  isAuthenticated: boolean;
  
  // UI state
  theme: 'light' | 'dark' | 'system';
  sidebarCollapsed: boolean;
  loading: Record<string, boolean>;
  modals: Record<string, { open: boolean; data?: any }>;
  
  // Problems state
  problems: Problem[];
  filteredProblems: Problem[];
  selectedProblem: Problem | null;
  searchQuery: string;
  filters: {
    difficulty: string[];
    category: string[];
    algorithms: string[];
    status: 'all' | 'solved' | 'unsolved' | 'bookmarked';
  };
  
  // Quiz state
  activeQuiz: Quiz | null;
  quizHistory: Quiz[];
  
  // Performance state
  performance: {
    metrics: Record<string, number>;
    trends: Array<{ date: string; value: number }>;
    recommendations: string[];
  };
  
  // Notifications
  notifications: Notification[];
  unreadCount: number;
  
  // Collaboration state
  collaborationSession: {
    id: string | null;
    participants: Array<{ id: string; name: string; color: string }>;
    isHost: boolean;
  };
  
  // Cache
  cache: Record<string, { data: any; timestamp: number; ttl: number }>;
}

interface AppActions {
  // User actions
  setUser: (user: User | null) => void;
  updateUserPreferences: (preferences: Partial<User['preferences']>) => void;
  updateUserStats: (stats: Partial<User['stats']>) => void;
  login: (user: User) => void;
  logout: () => void;
  
  // UI actions
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  toggleSidebar: () => void;
  setLoading: (key: string, loading: boolean) => void;
  openModal: (key: string, data?: any) => void;
  closeModal: (key: string) => void;
  
  // Problems actions
  setProblems: (problems: Problem[]) => void;
  updateProblem: (id: number, updates: Partial<Problem>) => void;
  setSelectedProblem: (problem: Problem | null) => void;
  setSearchQuery: (query: string) => void;
  updateFilters: (filters: Partial<AppState['filters']>) => void;
  toggleBookmark: (problemId: number) => void;
  markSolved: (problemId: number, time?: number) => void;
  
  // Quiz actions
  startQuiz: (quiz: Omit<Quiz, 'id' | 'startedAt' | 'answers'>) => void;
  updateQuizAnswer: (problemId: number, answer: any) => void;
  nextProblem: () => void;
  previousProblem: () => void;
  completeQuiz: () => void;
  abandonQuiz: () => void;
  
  // Notifications actions
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  markNotificationRead: (id: string) => void;
  removeNotification: (id: string) => void;
  clearAllNotifications: () => void;
  
  // Performance actions
  updatePerformanceMetrics: (metrics: Record<string, number>) => void;
  addPerformanceTrend: (trend: { date: string; value: number }) => void;
  
  // Collaboration actions
  joinCollaborationSession: (sessionId: string, participants: any[]) => void;
  leaveCollaborationSession: () => void;
  
  // Cache actions
  setCache: (key: string, data: any, ttl?: number) => void;
  getCache: (key: string) => any | null;
  clearCache: (key?: string) => void;
  
  // Computed getters
  getFilteredProblems: () => Problem[];
  getUnreadNotifications: () => Notification[];
  getPerformanceSummary: () => any;
}

type Store = AppState & AppActions;

const initialState: AppState = {
  // User state
  user: null,
  isAuthenticated: false,
  
  // UI state
  theme: 'system',
  sidebarCollapsed: false,
  loading: {},
  modals: {},
  
  // Problems state
  problems: [],
  filteredProblems: [],
  selectedProblem: null,
  searchQuery: '',
  filters: {
    difficulty: [],
    category: [],
    algorithms: [],
    status: 'all'
  },
  
  // Quiz state
  activeQuiz: null,
  quizHistory: [],
  
  // Performance state
  performance: {
    metrics: {},
    trends: [],
    recommendations: []
  },
  
  // Notifications
  notifications: [],
  unreadCount: 0,
  
  // Collaboration state
  collaborationSession: {
    id: null,
    participants: [],
    isHost: false
  },
  
  // Cache
  cache: {}
};

export const useGlobalStore = create<Store>()(
  devtools(
    persist(
      subscribeWithSelector(
        immer((set, get) => ({
          ...initialState,
          
          // User actions
          setUser: (user) => set((state) => {
            state.user = user;
            state.isAuthenticated = !!user;
          }),
          
          updateUserPreferences: (preferences) => set((state) => {
            if (state.user) {
              Object.assign(state.user.preferences, preferences);
            }
          }),
          
          updateUserStats: (stats) => set((state) => {
            if (state.user) {
              Object.assign(state.user.stats, stats);
            }
          }),
          
          login: (user) => set((state) => {
            state.user = user;
            state.isAuthenticated = true;
            state.notifications.push({
              id: `login-${Date.now()}`,
              type: 'success',
              title: 'Welcome back!',
              message: `Hello ${user.name}, ready to code?`,
              timestamp: new Date(),
              read: false
            });
          }),
          
          logout: () => set((state) => {
            state.user = null;
            state.isAuthenticated = false;
            state.activeQuiz = null;
            state.collaborationSession = initialState.collaborationSession;
          }),
          
          // UI actions
          setTheme: (theme) => set((state) => {
            state.theme = theme;
          }),
          
          toggleSidebar: () => set((state) => {
            state.sidebarCollapsed = !state.sidebarCollapsed;
          }),
          
          setLoading: (key, loading) => set((state) => {
            if (loading) {
              state.loading[key] = true;
            } else {
              delete state.loading[key];
            }
          }),
          
          openModal: (key, data) => set((state) => {
            state.modals[key] = { open: true, data };
          }),
          
          closeModal: (key) => set((state) => {
            delete state.modals[key];
          }),
          
          // Problems actions
          setProblems: (problems) => set((state) => {
            state.problems = problems;
            state.filteredProblems = get().getFilteredProblems();
          }),
          
          updateProblem: (id, updates) => set((state) => {
            const index = state.problems.findIndex(p => p.id === id);
            if (index !== -1) {
              Object.assign(state.problems[index], updates);
              state.filteredProblems = get().getFilteredProblems();
            }
          }),
          
          setSelectedProblem: (problem) => set((state) => {
            state.selectedProblem = problem;
          }),
          
          setSearchQuery: (query) => set((state) => {
            state.searchQuery = query;
            state.filteredProblems = get().getFilteredProblems();
          }),
          
          updateFilters: (filters) => set((state) => {
            Object.assign(state.filters, filters);
            state.filteredProblems = get().getFilteredProblems();
          }),
          
          toggleBookmark: (problemId) => set((state) => {
            const problem = state.problems.find(p => p.id === problemId);
            if (problem) {
              problem.bookmarked = !problem.bookmarked;
              state.filteredProblems = get().getFilteredProblems();
            }
          }),
          
          markSolved: (problemId, time) => set((state) => {
            const problem = state.problems.find(p => p.id === problemId);
            if (problem) {
              problem.solved = true;
              if (time && (!problem.bestTime || time < problem.bestTime)) {
                problem.bestTime = time;
              }
              
              // Update user stats
              if (state.user) {
                state.user.stats.problemsSolved += 1;
                if (time) {
                  state.user.stats.totalTime += time;
                }
              }
              
              state.filteredProblems = get().getFilteredProblems();
            }
          }),
          
          // Quiz actions
          startQuiz: (quizData) => set((state) => {
            const quiz: Quiz = {
              id: `quiz-${Date.now()}`,
              ...quizData,
              startedAt: new Date(),
              answers: {}
            };
            state.activeQuiz = quiz;
          }),
          
          updateQuizAnswer: (problemId, answer) => set((state) => {
            if (state.activeQuiz) {
              state.activeQuiz.answers[problemId] = answer;
            }
          }),
          
          nextProblem: () => set((state) => {
            if (state.activeQuiz && state.activeQuiz.currentProblem < state.activeQuiz.problems.length - 1) {
              state.activeQuiz.currentProblem += 1;
            }
          }),
          
          previousProblem: () => set((state) => {
            if (state.activeQuiz && state.activeQuiz.currentProblem > 0) {
              state.activeQuiz.currentProblem -= 1;
            }
          }),
          
          completeQuiz: () => set((state) => {
            if (state.activeQuiz) {
              state.activeQuiz.completedAt = new Date();
              state.quizHistory.unshift(state.activeQuiz);
              
              // Keep last 50 quizzes
              if (state.quizHistory.length > 50) {
                state.quizHistory = state.quizHistory.slice(0, 50);
              }
              
              state.activeQuiz = null;
              
              // Add completion notification
              state.notifications.push({
                id: `quiz-complete-${Date.now()}`,
                type: 'success',
                title: 'Quiz Completed!',
                message: 'Great job! Check your results.',
                timestamp: new Date(),
                read: false
              });
            }
          }),
          
          abandonQuiz: () => set((state) => {
            state.activeQuiz = null;
          }),
          
          // Notifications actions
          addNotification: (notification) => set((state) => {
            const newNotification: Notification = {
              ...notification,
              id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
              timestamp: new Date(),
              read: false
            };
            
            state.notifications.unshift(newNotification);
            state.unreadCount += 1;
            
            // Keep last 100 notifications
            if (state.notifications.length > 100) {
              state.notifications = state.notifications.slice(0, 100);
            }
          }),
          
          markNotificationRead: (id) => set((state) => {
            const notification = state.notifications.find(n => n.id === id);
            if (notification && !notification.read) {
              notification.read = true;
              state.unreadCount = Math.max(0, state.unreadCount - 1);
            }
          }),
          
          removeNotification: (id) => set((state) => {
            const index = state.notifications.findIndex(n => n.id === id);
            if (index !== -1) {
              const notification = state.notifications[index];
              if (!notification.read) {
                state.unreadCount = Math.max(0, state.unreadCount - 1);
              }
              state.notifications.splice(index, 1);
            }
          }),
          
          clearAllNotifications: () => set((state) => {
            state.notifications = [];
            state.unreadCount = 0;
          }),
          
          // Performance actions
          updatePerformanceMetrics: (metrics) => set((state) => {
            Object.assign(state.performance.metrics, metrics);
          }),
          
          addPerformanceTrend: (trend) => set((state) => {
            state.performance.trends.push(trend);
            // Keep last 30 data points
            if (state.performance.trends.length > 30) {
              state.performance.trends.shift();
            }
          }),
          
          // Collaboration actions
          joinCollaborationSession: (sessionId, participants) => set((state) => {
            state.collaborationSession = {
              id: sessionId,
              participants,
              isHost: false
            };
          }),
          
          leaveCollaborationSession: () => set((state) => {
            state.collaborationSession = initialState.collaborationSession;
          }),
          
          // Cache actions
          setCache: (key, data, ttl = 300000) => set((state) => {
            state.cache[key] = {
              data,
              timestamp: Date.now(),
              ttl
            };
          }),
          
          getCache: (key) => {
            const cached = get().cache[key];
            if (!cached) return null;
            
            const isExpired = Date.now() - cached.timestamp > cached.ttl;
            if (isExpired) {
              set((state) => {
                delete state.cache[key];
              });
              return null;
            }
            
            return cached.data;
          },
          
          clearCache: (key) => set((state) => {
            if (key) {
              delete state.cache[key];
            } else {
              state.cache = {};
            }
          }),
          
          // Computed getters
          getFilteredProblems: () => {
            const { problems, searchQuery, filters } = get();
            
            return problems.filter(problem => {
              // Search query
              if (searchQuery) {
                const query = searchQuery.toLowerCase();
                const matchesQuery = 
                  problem.title.toLowerCase().includes(query) ||
                  problem.description.toLowerCase().includes(query) ||
                  problem.algorithms.some(alg => alg.toLowerCase().includes(query));
                
                if (!matchesQuery) return false;
              }
              
              // Difficulty filter
              if (filters.difficulty.length > 0 && !filters.difficulty.includes(problem.difficulty)) {
                return false;
              }
              
              // Category filter
              if (filters.category.length > 0 && !filters.category.includes(problem.category)) {
                return false;
              }
              
              // Algorithms filter
              if (filters.algorithms.length > 0) {
                const hasAlgorithm = filters.algorithms.some(alg => 
                  problem.algorithms.includes(alg)
                );
                if (!hasAlgorithm) return false;
              }
              
              // Status filter
              switch (filters.status) {
                case 'solved':
                  return problem.solved === true;
                case 'unsolved':
                  return problem.solved !== true;
                case 'bookmarked':
                  return problem.bookmarked === true;
                default:
                  return true;
              }
            });
          },
          
          getUnreadNotifications: () => {
            return get().notifications.filter(n => !n.read);
          },
          
          getPerformanceSummary: () => {
            const { user, performance } = get();
            
            return {
              totalSolved: user?.stats.problemsSolved || 0,
              accuracy: user?.stats.accuracy || 0,
              streak: user?.stats.streak || 0,
              averageTime: user?.stats.totalTime && user?.stats.problemsSolved 
                ? user.stats.totalTime / user.stats.problemsSolved 
                : 0,
              trends: performance.trends,
              recommendations: performance.recommendations
            };
          }
        }))
      ),
      {
        name: 'speedcoders-store',
        partialize: (state) => ({
          user: state.user,
          theme: state.theme,
          sidebarCollapsed: state.sidebarCollapsed,
          quizHistory: state.quizHistory,
          notifications: state.notifications.slice(0, 20), // Persist only recent notifications
          cache: {} // Don't persist cache
        })
      }
    ),
    {
      name: 'SpeedCoders Store'
    }
  )
);

// Selectors for better performance
export const useUser = () => useGlobalStore(state => state.user);
export const useIsAuthenticated = () => useGlobalStore(state => state.isAuthenticated);
export const useTheme = () => useGlobalStore(state => state.theme);
export const useProblems = () => useGlobalStore(state => state.filteredProblems);
export const useActiveQuiz = () => useGlobalStore(state => state.activeQuiz);
export const useNotifications = () => useGlobalStore(state => ({
  notifications: state.notifications,
  unreadCount: state.unreadCount
}));
export const usePerformance = () => useGlobalStore(state => state.getPerformanceSummary());

// Subscribe to store changes for side effects
useGlobalStore.subscribe(
  (state) => state.theme,
  (theme) => {
    // Update document theme
    if (typeof window !== 'undefined') {
      document.documentElement.className = theme === 'system' 
        ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
        : theme;
    }
  }
);

export type { Store, AppState, AppActions };