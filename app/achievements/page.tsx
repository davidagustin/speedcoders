'use client';

import { useState, useEffect } from 'react';
import { 
  TrophyIcon, 
  StarIcon,
  FireIcon,
  BoltIcon as LightningBoltIcon,
  AcademicCapIcon,
  PuzzlePieceIcon,
  ClockIcon,
  ChartBarIcon,
  UserGroupIcon,
  CogIcon
} from '@heroicons/react/24/outline';

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  difficulty: 'Bronze' | 'Silver' | 'Gold' | 'Platinum' | 'Diamond';
  progress: number;
  maxProgress: number;
  unlocked: boolean;
  unlockedAt?: string;
  points: number;
  rarity: 'Common' | 'Rare' | 'Epic' | 'Legendary';
}

export default function AchievementsPage() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAchievements();
  }, []);

  const fetchAchievements = async () => {
    try {
      // Mock achievements data
      const mockAchievements: Achievement[] = [
        {
          id: '1',
          name: 'First Steps',
          description: 'Complete your first quiz',
          icon: '🎯',
          category: 'Getting Started',
          difficulty: 'Bronze',
          progress: 1,
          maxProgress: 1,
          unlocked: true,
          unlockedAt: '2024-01-15',
          points: 10,
          rarity: 'Common'
        },
        {
          id: '2',
          name: 'Speed Demon',
          description: 'Complete 10 quizzes in under 5 minutes each',
          icon: '⚡',
          category: 'Speed',
          difficulty: 'Silver',
          progress: 7,
          maxProgress: 10,
          unlocked: false,
          points: 50,
          rarity: 'Rare'
        },
        {
          id: '3',
          name: 'Perfect Score',
          description: 'Get 100% on any quiz',
          icon: '🏆',
          category: 'Accuracy',
          difficulty: 'Gold',
          progress: 1,
          maxProgress: 1,
          unlocked: true,
          unlockedAt: '2024-01-20',
          points: 100,
          rarity: 'Epic'
        },
        {
          id: '4',
          name: 'Streak Master',
          description: 'Maintain a 7-day study streak',
          icon: '🔥',
          category: 'Consistency',
          difficulty: 'Platinum',
          progress: 5,
          maxProgress: 7,
          unlocked: false,
          points: 200,
          rarity: 'Legendary'
        },
        {
          id: '5',
          name: 'Algorithm Expert',
          description: 'Solve 50 algorithm problems',
          icon: '🧮',
          category: 'Algorithms',
          difficulty: 'Gold',
          progress: 32,
          maxProgress: 50,
          unlocked: false,
          points: 150,
          rarity: 'Epic'
        },
        {
          id: '6',
          name: 'Data Structure Master',
          description: 'Complete all data structure quizzes',
          icon: '🏗️',
          category: 'Data Structures',
          difficulty: 'Diamond',
          progress: 8,
          maxProgress: 10,
          unlocked: false,
          points: 300,
          rarity: 'Legendary'
        },
        {
          id: '7',
          name: 'Quick Learner',
          description: 'Improve your average score by 20%',
          icon: '📈',
          category: 'Improvement',
          difficulty: 'Silver',
          progress: 15,
          maxProgress: 20,
          unlocked: false,
          points: 75,
          rarity: 'Rare'
        },
        {
          id: '8',
          name: 'Social Butterfly',
          description: 'Share 5 quiz results with friends',
          icon: '🦋',
          category: 'Social',
          difficulty: 'Bronze',
          progress: 3,
          maxProgress: 5,
          unlocked: false,
          points: 25,
          rarity: 'Common'
        }
      ];

      setAchievements(mockAchievements);
    } catch (error) {
      console.error('Error fetching achievements:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Bronze': return 'bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-300';
      case 'Silver': return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
      case 'Gold': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300';
      case 'Platinum': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300';
      case 'Diamond': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
    }
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'Common': return 'text-gray-600 dark:text-slate-400';
      case 'Rare': return 'text-blue-600 dark:text-blue-400';
      case 'Epic': return 'text-purple-600 dark:text-purple-400';
      case 'Legendary': return 'text-orange-600 dark:text-orange-400';
      default: return 'text-gray-600 dark:text-slate-400';
    }
  };

  const getProgressColor = (progress: number, maxProgress: number) => {
    const percentage = (progress / maxProgress) * 100;
    if (percentage >= 80) return 'bg-green-500';
    if (percentage >= 60) return 'bg-yellow-500';
    if (percentage >= 40) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const categories = ['All', 'Getting Started', 'Speed', 'Accuracy', 'Consistency', 'Algorithms', 'Data Structures', 'Improvement', 'Social'];
  const difficulties = ['All', 'Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond'];

  const filteredAchievements = achievements.filter(achievement => {
    const categoryMatch = selectedCategory === 'All' || achievement.category === selectedCategory;
    const difficultyMatch = selectedDifficulty === 'All' || achievement.difficulty === selectedDifficulty;
    return categoryMatch && difficultyMatch;
  });

  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const totalPoints = achievements.filter(a => a.unlocked).reduce((sum, a) => sum + a.points, 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <div className="lg:pl-64">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 dark:bg-slate-700 rounded w-1/4 mb-4"></div>
              <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-1/2 mb-8"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="card p-6">
                    <div className="h-6 bg-gray-200 dark:bg-slate-700 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-1/2 mb-4"></div>
                    <div className="h-3 bg-gray-200 dark:bg-slate-700 rounded w-full mb-2"></div>
                    <div className="h-3 bg-gray-200 dark:bg-slate-700 rounded w-2/3"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="lg:pl-64">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Achievements
            </h1>
            <p className="text-gray-600 dark:text-slate-300">
              Unlock badges and track your progress
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="card p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-indigo-500 rounded-xl flex items-center justify-center">
                    <TrophyIcon className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500 dark:text-slate-400">Achievements Unlocked</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {unlockedCount}/{achievements.length}
                  </p>
                </div>
              </div>
            </div>

            <div className="card p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
                    <StarIcon className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500 dark:text-slate-400">Total Points</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalPoints}</p>
                </div>
              </div>
            </div>

            <div className="card p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center">
                    <ChartBarIcon className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500 dark:text-slate-400">Completion Rate</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {Math.round((unlockedCount / achievements.length) * 100)}%
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="card p-6 mb-8">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      selectedCategory === category
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>

              <div className="flex gap-2">
                {difficulties.map((difficulty) => (
                  <button
                    key={difficulty}
                    onClick={() => setSelectedDifficulty(difficulty)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      selectedDifficulty === difficulty
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600'
                    }`}
                  >
                    {difficulty}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Achievements Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAchievements.map((achievement) => (
              <div
                key={achievement.id}
                className={`card p-6 transition-all duration-300 ${
                  achievement.unlocked
                    ? 'ring-2 ring-green-500 dark:ring-green-400'
                    : 'hover:shadow-lg'
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="text-4xl">{achievement.icon}</div>
                  <div className="flex items-center gap-2">
                    <span className={`badge ${getDifficultyColor(achievement.difficulty)}`}>
                      {achievement.difficulty}
                    </span>
                    <span className={`text-sm font-medium ${getRarityColor(achievement.rarity)}`}>
                      {achievement.rarity}
                    </span>
                  </div>
                </div>

                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {achievement.name}
                </h3>
                <p className="text-gray-600 dark:text-slate-300 text-sm mb-4">
                  {achievement.description}
                </p>

                <div className="mb-4">
                  <div className="flex items-center justify-between text-sm text-gray-500 dark:text-slate-400 mb-1">
                    <span>Progress</span>
                    <span>{achievement.progress}/{achievement.maxProgress}</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(achievement.progress, achievement.maxProgress)}`}
                      style={{ width: `${(achievement.progress / achievement.maxProgress) * 100}%` }}
                    ></div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-slate-400">
                    <StarIcon className="h-4 w-4" />
                    <span>{achievement.points} pts</span>
                  </div>
                  {achievement.unlocked ? (
                    <div className="flex items-center gap-1 text-sm text-green-600 dark:text-green-400">
                      <TrophyIcon className="h-4 w-4" />
                      <span>Unlocked</span>
                    </div>
                  ) : (
                    <div className="text-sm text-gray-500 dark:text-slate-400">
                      {Math.round((achievement.progress / achievement.maxProgress) * 100)}% complete
                    </div>
                  )}
                </div>

                {achievement.unlocked && achievement.unlockedAt && (
                  <div className="mt-3 pt-3 border-t border-gray-200 dark:border-slate-700">
                    <p className="text-xs text-gray-500 dark:text-slate-400">
                      Unlocked on {new Date(achievement.unlockedAt).toLocaleDateString()}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Empty State */}
          {filteredAchievements.length === 0 && (
            <div className="text-center py-12">
              <div className="mx-auto h-12 w-12 text-gray-400 mb-4">
                <TrophyIcon className="h-12 w-12" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No achievements found
              </h3>
              <p className="text-gray-600 dark:text-slate-300">
                Try adjusting your filter criteria
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}