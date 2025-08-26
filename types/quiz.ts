// Quiz and problem related types
export interface Problem {
  id: string;
  title: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  algorithms: string[];
  correctAlgorithms: string[];
  url: string;
  tags?: string[];
  companies?: string[];
  category?: string;
  premium?: boolean;
}

export interface QuizConfig {
  mode: 'smart' | 'company' | 'algorithm' | 'difficulty' | 'speed' | 'challenge' | 'custom';
  difficulty: 'Mixed' | 'Easy' | 'Medium' | 'Hard';
  timeLimit: number;
  questionCount: number;
  algorithms: string[];
  company: string | null;
}

export interface QuizAnswer {
  [questionId: string]: string[];
}

export interface QuizResult {
  date: string;
  mode: string;
  difficulty: string;
  correct: number;
  totalQuestions: number;
  percentage: number;
  timeSpent: number;
  timeLimit: number;
  xpEarned: number;
  details: QuizDetailResult[];
  challenge?: DailyChallenge;
}

export interface QuizDetailResult {
  question: string;
  questionId: string;
  difficulty: string;
  userAnswer: string[];
  correctAnswer: string[];
  allAlgorithms: string[];
  isCorrect: boolean;
  url: string;
}

export interface DailyChallenge {
  title: string;
  description: string;
  difficulty: string;
  reward: string;
  icon: string;
  type: 'speed' | 'accuracy' | 'variety';
}

export interface User {
  id: string;
  username: string;
  email: string;
  scores: QuizResult[];
  totalXP: number;
  achievements?: Achievement[];
  preferences?: UserPreferences;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt: string;
  category: 'performance' | 'streak' | 'mastery' | 'special';
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  notifications: boolean;
  soundEffects: boolean;
  language: string;
}

export interface AlgorithmMastery {
  [algorithm: string]: {
    total: number;
    correct: number;
    accuracy: number;
    attempts: Array<{
      date: string;
      correct: boolean;
      difficulty: string;
    }>;
    recentAccuracy: number;
    trend: 'improving' | 'declining' | 'stable';
  };
}