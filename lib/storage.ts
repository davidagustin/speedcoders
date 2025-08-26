"use client";

export interface QuizStats {
  totalQuestions: number;
  totalScore: number;
  averageScore: number;
  bestScore: number;
  problemsAttempted: Set<number>;
  difficultyStats: {
    Easy: { attempted: number; totalScore: number };
    Medium: { attempted: number; totalScore: number };
    Hard: { attempted: number; totalScore: number };
  };
  lastPlayed: Date;
  streak: number;
  achievements: string[];
}

const STORAGE_KEY = 'leetcode-quiz-stats';

export const getStoredStats = (): QuizStats => {
  if (typeof window === 'undefined') {
    return getDefaultStats();
  }
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return getDefaultStats();
    
    const parsed = JSON.parse(stored);
    return {
      ...parsed,
      problemsAttempted: new Set(parsed.problemsAttempted || []),
      lastPlayed: new Date(parsed.lastPlayed),
    };
  } catch (error) {
    return getDefaultStats();
  }
};

export const saveStats = (stats: QuizStats): void => {
  if (typeof window === 'undefined') return;
  
  try {
    const toStore = {
      ...stats,
      problemsAttempted: Array.from(stats.problemsAttempted),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toStore));
  } catch (error) {
    console.error('Failed to save stats:', error);
  }
};

export const getDefaultStats = (): QuizStats => ({
  totalQuestions: 0,
  totalScore: 0,
  averageScore: 0,
  bestScore: 0,
  problemsAttempted: new Set(),
  difficultyStats: {
    Easy: { attempted: 0, totalScore: 0 },
    Medium: { attempted: 0, totalScore: 0 },
    Hard: { attempted: 0, totalScore: 0 },
  },
  lastPlayed: new Date(),
  streak: 0,
  achievements: [],
});

export const updateStats = (
  currentStats: QuizStats,
  questionScore: number,
  problemId: number,
  difficulty: 'Easy' | 'Medium' | 'Hard'
): QuizStats => {
  const newTotalQuestions = currentStats.totalQuestions + 1;
  const newTotalScore = currentStats.totalScore + questionScore;
  const newAverageScore = newTotalScore / newTotalQuestions;
  
  const newDifficultyStats = {
    ...currentStats.difficultyStats,
    [difficulty]: {
      attempted: currentStats.difficultyStats[difficulty].attempted + 1,
      totalScore: currentStats.difficultyStats[difficulty].totalScore + questionScore,
    },
  };

  const newProblemsAttempted = new Set([...currentStats.problemsAttempted, problemId]);
  
  // Check for new achievements
  const newAchievements = [...currentStats.achievements];
  const achievements = checkAchievements(newTotalQuestions, newAverageScore, newProblemsAttempted.size, currentStats.achievements);
  achievements.forEach(achievement => {
    if (!newAchievements.includes(achievement)) {
      newAchievements.push(achievement);
    }
  });

  const today = new Date().toDateString();
  const lastPlayedString = currentStats.lastPlayed.toDateString();
  const newStreak = today === lastPlayedString ? currentStats.streak : 
                   (new Date().getTime() - currentStats.lastPlayed.getTime() <= 86400000) ? currentStats.streak + 1 : 1;

  return {
    totalQuestions: newTotalQuestions,
    totalScore: newTotalScore,
    averageScore: newAverageScore,
    bestScore: Math.max(currentStats.bestScore, questionScore),
    problemsAttempted: newProblemsAttempted,
    difficultyStats: newDifficultyStats,
    lastPlayed: new Date(),
    streak: newStreak,
    achievements: newAchievements,
  };
};

const checkAchievements = (
  totalQuestions: number,
  averageScore: number,
  uniqueProblems: number,
  currentAchievements: string[]
): string[] => {
  const achievements = [];
  
  if (totalQuestions >= 1 && !currentAchievements.includes('First Steps')) {
    achievements.push('First Steps');
  }
  if (totalQuestions >= 10 && !currentAchievements.includes('Getting Started')) {
    achievements.push('Getting Started');
  }
  if (totalQuestions >= 50 && !currentAchievements.includes('Quiz Master')) {
    achievements.push('Quiz Master');
  }
  if (totalQuestions >= 100 && !currentAchievements.includes('Centurion')) {
    achievements.push('Centurion');
  }
  if (averageScore >= 90 && totalQuestions >= 10 && !currentAchievements.includes('Excellence')) {
    achievements.push('Excellence');
  }
  if (averageScore >= 95 && totalQuestions >= 25 && !currentAchievements.includes('Perfection')) {
    achievements.push('Perfection');
  }
  if (uniqueProblems >= 15 && !currentAchievements.includes('Explorer')) {
    achievements.push('Explorer');
  }
  
  return achievements;
};