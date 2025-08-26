"use client";

import React, { useState, useEffect } from "react";
import { StarIcon, TrophyIcon, FireIcon, AcademicCapIcon, PuzzlePieceIcon, ClockIcon, ChartBarIcon, UserGroupIcon, CogIcon } from "@heroicons/react/24/outline";

interface Achievement {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: string;
  icon: string;
  progress: number;
  maxProgress: number;
  unlocked: boolean;
  unlockedAt?: string;
  points: number;
  rarity: string;
}

export default function AchievementsPage() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAchievements();
  }, []);

  const fetchAchievements = async () => {
    try {
      const response = await fetch("/api/achievements");
      if (response.ok) {
        const data = await response.json();
        setAchievements(data.achievements || []);
      } else {
        // Mock data for demonstration
        setAchievements([
          {
            id: "1",
            title: "First Steps",
            description: "Complete your first coding problem",
            category: "Learning",
            difficulty: "Easy",
            icon: "🎯",
            progress: 1,
            maxProgress: 1,
            unlocked: true,
            unlockedAt: "2024-01-10",
            points: 10,
            rarity: "Common"
          },
          {
            id: "2",
            title: "Streak Master",
            description: "Maintain a 7-day practice streak",
            category: "Consistency",
            difficulty: "Medium",
            icon: "🔥",
            progress: 5,
            maxProgress: 7,
            unlocked: false,
            points: 50,
            rarity: "Rare"
          },
          {
            id: "3",
            title: "Perfect Score",
            description: "Get 100% on any quiz",
            category: "Performance",
            difficulty: "Hard",
            icon: "⭐",
            progress: 0,
            maxProgress: 1,
            unlocked: false,
            points: 100,
            rarity: "Epic"
          },
          {
            id: "4",
            title: "Problem Solver",
            description: "Solve 50 problems",
            category: "Progress",
            difficulty: "Medium",
            icon: "🧩",
            progress: 32,
            maxProgress: 50,
            unlocked: false,
            points: 75,
            rarity: "Rare"
          },
          {
            id: "5",
            title: "Speed Demon",
            description: "Complete 10 problems in under 5 minutes each",
            category: "Speed",
            difficulty: "Hard",
            icon: "⚡",
            progress: 3,
            maxProgress: 10,
            unlocked: false,
            points: 150,
            rarity: "Legendary"
          },
          {
            id: "6",
            title: "Algorithm Expert",
            description: "Master all basic algorithms",
            category: "Knowledge",
            difficulty: "Hard",
            icon: "🧠",
            progress: 8,
            maxProgress: 12,
            unlocked: false,
            points: 200,
            rarity: "Legendary"
          },
          {
            id: "7",
            title: "Social Butterfly",
            description: "Participate in 5 tournaments",
            category: "Social",
            difficulty: "Medium",
            icon: "👥",
            progress: 2,
            maxProgress: 5,
            unlocked: false,
            points: 60,
            rarity: "Rare"
          },
          {
            id: "8",
            title: "Early Bird",
            description: "Practice for 5 consecutive days before 8 AM",
            category: "Consistency",
            difficulty: "Medium",
            icon: "🌅",
            progress: 3,
            maxProgress: 5,
            unlocked: false,
            points: 80,
            rarity: "Rare"
          },
          {
            id: "9",
            title: "Top Performer",
            description: "Reach the top 10% of the leaderboard",
            category: "Competition",
            difficulty: "Hard",
            icon: "🏆",
            progress: 0,
            maxProgress: 1,
            unlocked: false,
            points: 300,
            rarity: "Legendary"
          },
          {
            id: "10",
            title: "Weekend Warrior",
            description: "Solve problems on 4 consecutive weekends",
            category: "Consistency",
            difficulty: "Medium",
            icon: "📅",
            progress: 2,
            maxProgress: 4,
            unlocked: false,
            points: 90,
            rarity: "Rare"
          }
        ]);
      }
    } catch (error) {
      console.error("Error fetching achievements:", error);
    } finally {
      setLoading(false);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy": return "text-green-600 bg-green-100";
      case "Medium": return "text-yellow-600 bg-yellow-100";
      case "Hard": return "text-red-600 bg-red-100";
      default: return "text-gray-600 bg-gray-100";
    }
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "Common": return "text-gray-600 bg-gray-100";
      case "Rare": return "text-blue-600 bg-blue-100";
      case "Epic": return "text-purple-600 bg-purple-100";
      case "Legendary": return "text-orange-600 bg-orange-100";
      default: return "text-gray-600 bg-gray-100";
    }
  };

  const getProgressColor = (progress: number, maxProgress: number) => {
    const percentage = (progress / maxProgress) * 100;
    if (percentage >= 80) return "bg-green-500";
    if (percentage >= 60) return "bg-yellow-500";
    if (percentage >= 40) return "bg-orange-500";
    return "bg-red-500";
  };

  const getFilteredAchievements = () => {
    return achievements.filter(achievement => {
      const categoryMatch = selectedCategory === "All" || achievement.category === selectedCategory;
      const difficultyMatch = selectedDifficulty === "All" || achievement.difficulty === selectedDifficulty;
      return categoryMatch && difficultyMatch;
    });
  };

  const getStats = () => {
    const total = achievements.length;
    const unlocked = achievements.filter(a => a.unlocked).length;
    const totalPoints = achievements.filter(a => a.unlocked).reduce((sum, a) => sum + a.points, 0);
    const completionRate = total > 0 ? Math.round((unlocked / total) * 100) : 0;
    return { total, unlocked, totalPoints, completionRate };
  };

  const stats = getStats();
  const categories = Array.from(new Set(achievements.map(a => a.category))).sort();
  const difficulties = ["Easy", "Medium", "Hard"];
  const filteredAchievements = getFilteredAchievements();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(9)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow p-6">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
                  <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <TrophyIcon className="h-8 w-8 text-yellow-600" />
            <h1 className="text-3xl font-bold text-gray-900">Achievements</h1>
          </div>
          <p className="text-gray-600">Unlock achievements and track your progress</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <TrophyIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Unlocked</p>
                <p className="text-2xl font-bold text-gray-900">{stats.unlocked}/{stats.total}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <StarIcon className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Points</p>
                <p className="text-2xl font-bold text-green-600">{stats.totalPoints}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <ChartBarIcon className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Completion</p>
                <p className="text-2xl font-bold text-purple-600">{stats.completionRate}%</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <FireIcon className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Next Goal</p>
                <p className="text-2xl font-bold text-orange-600">5 more</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="All">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>

            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="All">All Difficulties</option>
              {difficulties.map(difficulty => (
                <option key={difficulty} value={difficulty}>{difficulty}</option>
              ))}
            </select>

            <button
              onClick={() => {
                setSelectedCategory("All");
                setSelectedDifficulty("All");
              }}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* Achievements Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAchievements.map((achievement) => (
            <div key={achievement.id} className={`bg-white rounded-lg shadow p-6 border-2 transition-all ${
              achievement.unlocked ? 'border-green-200 bg-green-50' : 'border-gray-200 hover:border-blue-200'
            }`}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="text-3xl">{achievement.icon}</div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{achievement.title}</h3>
                    <p className="text-sm text-gray-600">{achievement.description}</p>
                  </div>
                </div>
                {achievement.unlocked && (
                  <div className="text-green-600">
                    <StarIcon className="h-6 w-6" />
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Progress</span>
                  <span className="font-medium">{achievement.progress}/{achievement.maxProgress}</span>
                </div>

                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${getProgressColor(achievement.progress, achievement.maxProgress)}`}
                    style={{ width: `${(achievement.progress / achievement.maxProgress) * 100}%` }}
                  ></div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(achievement.difficulty)}`}>
                      {achievement.difficulty}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRarityColor(achievement.rarity)}`}>
                      {achievement.rarity}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-gray-900">{achievement.points}</div>
                    <div className="text-xs text-gray-600">points</div>
                  </div>
                </div>

                {achievement.unlocked && achievement.unlockedAt && (
                  <div className="text-xs text-gray-500 text-center pt-2 border-t border-gray-200">
                    Unlocked on {new Date(achievement.unlockedAt).toLocaleDateString()}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {filteredAchievements.length === 0 && (
          <div className="text-center py-12">
            <TrophyIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No achievements found</h3>
            <p className="text-gray-600">Try adjusting your filters or start solving problems to unlock achievements!</p>
          </div>
        )}
      </div>
    </div>
  );
}
