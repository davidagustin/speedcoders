// Core data models
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
  createdAt: string;
  updatedAt?: string;
}

export interface Problem {
  id: number;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: string;
  algorithms: string[];
  description: string;
  editorial: {
    approach: string;
    complexity: {
      time: string;
      space: string;
    };
    solution: string;
  }[];
  leetcodeUrl?: string;
  tags?: string[];
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Mixed';
  category?: string;
  timeLimit: number;
  problemCount: number;
  problems: Problem[];
  createdAt: string;
  updatedAt?: string;
}

export interface QuizAttempt {
  id: string;
  userId: string;
  quizId: string;
  score: number;
  timeSpent: number;
  completed: boolean;
  startedAt: string;
  completedAt?: string;
  answers?: Record<string, any>;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'problem_solving' | 'streak' | 'quiz' | 'speed' | 'accuracy';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  unlockedAt?: string;
}

export interface UserStats {
  totalProblems: number;
  solvedProblems: number;
  accuracy: number;
  averageTime: number;
  currentStreak: number;
  longestStreak: number;
  categoriesCompleted: string[];
  recentActivity: ActivityEntry[];
}

export interface ActivityEntry {
  id: string;
  type: 'problem' | 'quiz' | 'study' | 'achievement';
  title: string;
  difficulty?: 'Easy' | 'Medium' | 'Hard';
  status: 'completed' | 'in_progress' | 'failed';
  timestamp: string;
  timeSpent: number;
  metadata?: Record<string, any>;
}