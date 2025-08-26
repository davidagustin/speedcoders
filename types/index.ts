// Centralized type definitions for SpeedCoders

export interface Problem {
  id: number
  title: string
  slug: string
  difficulty: 'Easy' | 'Medium' | 'Hard'
  url: string
  description: string
  algorithms: string[]
  category?: string[]
  examples?: Example[]
  constraints?: string[]
  hints?: string[]
  editorial?: Editorial
  timeComplexity?: string
  spaceComplexity?: string
}

export interface Example {
  input: string
  output: string
  explanation?: string
}

export interface Editorial {
  approach: string
  timeComplexity: string
  spaceComplexity: string
  solutions: Solution[]
}

export interface Solution {
  name: string
  description: string
  code: string
  language?: string
}

export interface Quiz {
  id: string
  title: string
  description?: string
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Mixed'
  timeLimit: number
  problemCount: number
  category?: string
  createdBy?: string
  createdAt?: Date
  isActive?: boolean
}

export interface QuizSession {
  id: string
  quizId: string
  userId: string
  startTime: Date
  endTime?: Date
  score?: number
  completed: boolean
  answers: QuizAnswer[]
}

export interface QuizAnswer {
  questionId: string
  selectedAlgorithms: string[]
  isCorrect?: boolean
  timeSpent?: number
}

export interface User {
  id: string
  email: string
  name?: string
  createdAt: Date
  lastActive?: Date
}

export interface UserProgress {
  userId: string
  problemsSolved: number
  totalAttempts: number
  averageScore: number
  favoriteCategories: string[]
  skillLevel: 'Beginner' | 'Intermediate' | 'Advanced'
}

export interface LearningPath {
  id: string
  title: string
  description: string
  difficulty: string
  problems: Problem[]
  estimatedTime: number
  category?: string
}

// Algorithm categories for filtering and organization
export const ALGORITHM_CATEGORIES = [
  'Array',
  'String',
  'Hash Table',
  'Linked List',
  'Stack',
  'Queue',
  'Tree',
  'Graph',
  'Heap',
  'Dynamic Programming',
  'Binary Search',
  'Two Pointers',
  'Sliding Window',
  'Greedy',
  'Backtracking',
  'Bit Manipulation',
  'Math',
  'Sorting',
  'Recursion',
  'Divide and Conquer',
] as const

export type AlgorithmCategory = typeof ALGORITHM_CATEGORIES[number]

// Difficulty levels
export const DIFFICULTY_LEVELS = ['Easy', 'Medium', 'Hard', 'Mixed'] as const
export type DifficultyLevel = typeof DIFFICULTY_LEVELS[number]

// Quiz status
export type QuizStatus = 'not_started' | 'in_progress' | 'completed' | 'abandoned'

// API Response types
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

// Filter types for searching and sorting
export interface ProblemFilters {
  difficulty?: DifficultyLevel[]
  categories?: string[]
  algorithms?: string[]
  searchTerm?: string
  sortBy?: 'title' | 'difficulty' | 'category'
  limit?: number
}

export interface QuizConfig {
  problemCount: number
  difficulty: DifficultyLevel
  category?: string | null
  timeLimit?: number
  specificProblems?: string[]
}