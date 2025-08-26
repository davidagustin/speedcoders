"use client";

import { useState } from "react";
import { 
  ChartBarIcon, 
  ClockIcon, 
  TrophyIcon, 
  FireIcon,
  ArrowTrendingUpIcon,
  AcademicCapIcon,
  BookOpenIcon,
  CheckCircleIcon
} from "@heroicons/react/24/outline";

interface ProgressData {
  totalProblems: number;
  solvedProblems: number;
  streakDays: number;
  totalTimeSpent: number;
  accuracy: number;
  level: string;
  experience: number;
  nextLevelExp: number;
  categories: Array<{
    name: string;
    progress: number;
    total: number;
    solved: number;
  }>;
  recentActivity: Array<{
    id: string;
    type: "problem" | "quiz" | "study";
    title: string;
    difficulty: string;
    status: "completed" | "attempted" | "failed";
    timestamp: string;
    timeSpent: number;
  }>;
  achievements: Array<{
    id: string;
    title: string;
    description: string;
    icon: string;
    unlocked: boolean;
    progress: number;
    maxProgress: number;
  }>;
}

interface LearningProgressProps {
  data: ProgressData;
}

export default function LearningProgress({ data }: LearningProgressProps) {
  const [selectedTimeframe, setSelectedTimeframe] = useState<"week" | "month" | "all">("week");

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const getLevelColor = (level: string) => {
    switch (level.toLowerCase()) {
      case "beginner": return "text-green-600";
      case "intermediate": return "text-blue-600";
      case "advanced": return "text-purple-600";
      case "expert": return "text-red-600";
      default: return "text-gray-600";
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "easy": return "text-green-600";
      case "medium": return "text-yellow-600";
      case "hard": return "text-red-600";
      default: return "text-gray-600";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "text-green-600";
      case "attempted": return "text-yellow-600";
      case "failed": return "text-red-600";
      default: return "text-gray-600";
    }
  };

  const progressPercentage = (data.experience / data.nextLevelExp) * 100;

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Problems Solved</p>
              <p className="text-2xl font-bold text-gray-900">
                {data.solvedProblems}/{data.totalProblems}
              </p>
            </div>
            <BookOpenIcon className="w-8 h-8 text-blue-500" />
          </div>
          <div className="mt-2">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(data.solvedProblems / data.totalProblems) * 100}%` }}
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Current Streak</p>
              <p className="text-2xl font-bold text-gray-900">{data.streakDays} days</p>
            </div>
            <FireIcon className="w-8 h-8 text-orange-500" />
          </div>
          <p className="text-sm text-gray-500 mt-1">Keep it up! 🔥</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Time</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatTime(data.totalTimeSpent)}
              </p>
            </div>
            <ClockIcon className="w-8 h-8 text-green-500" />
          </div>
          <p className="text-sm text-gray-500 mt-1">Time invested</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Accuracy</p>
              <p className="text-2xl font-bold text-gray-900">{data.accuracy}%</p>
            </div>
            <ChartBarIcon className="w-8 h-8 text-purple-500" />
          </div>
          <p className="text-sm text-gray-500 mt-1">Problem solving</p>
        </div>
      </div>

      {/* Level Progress */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <AcademicCapIcon className="w-6 h-6 text-blue-500" />
            <h2 className="text-xl font-semibold text-gray-900">Level Progress</h2>
          </div>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getLevelColor(data.level)}`}>
            {data.level}
          </span>
        </div>
        
        <div className="mb-4">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Experience: {data.experience} XP</span>
            <span>Next Level: {data.nextLevelExp} XP</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="text-center">
            <p className="text-gray-600">Problems Solved</p>
            <p className="font-semibold text-gray-900">{data.solvedProblems}</p>
          </div>
          <div className="text-center">
            <p className="text-gray-600">Streak Bonus</p>
            <p className="font-semibold text-gray-900">+{data.streakDays * 5} XP</p>
          </div>
          <div className="text-center">
            <p className="text-gray-600">Accuracy Bonus</p>
            <p className="font-semibold text-gray-900">+{Math.floor(data.accuracy / 10)} XP</p>
          </div>
        </div>
      </div>

      {/* Category Progress */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Category Progress</h2>
          <div className="flex space-x-2">
            {(["week", "month", "all"] as const).map((timeframe) => (
              <button
                key={timeframe}
                onClick={() => setSelectedTimeframe(timeframe)}
                className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                  selectedTimeframe === timeframe
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                {timeframe.charAt(0).toUpperCase() + timeframe.slice(1)}
              </button>
            ))}
          </div>
        </div>
        
        <div className="space-y-4">
          {data.categories.map((category) => (
            <div key={category.name} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span className="text-blue-600 font-semibold text-sm">
                    {category.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">{category.name}</h3>
                  <p className="text-sm text-gray-600">
                    {category.solved} of {category.total} problems
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-24 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(category.solved / category.total) * 100}%` }}
                  />
                </div>
                <span className="text-sm font-medium text-gray-900 w-12 text-right">
                  {Math.round((category.solved / category.total) * 100)}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Recent Activity</h2>
          <ArrowTrendingUpIcon className="w-6 h-6 text-green-500" />
        </div>
        
        <div className="space-y-3">
          {data.recentActivity.map((activity) => (
            <div key={activity.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  activity.type === "problem" ? "bg-blue-100" :
                  activity.type === "quiz" ? "bg-purple-100" :
                  "bg-green-100"
                }`}>
                  {activity.type === "problem" && <BookOpenIcon className="w-4 h-4 text-blue-600" />}
                  {activity.type === "quiz" && <TrophyIcon className="w-4 h-4 text-purple-600" />}
                  {activity.type === "study" && <AcademicCapIcon className="w-4 h-4 text-green-600" />}
                </div>
                <div>
                  <p className="font-medium text-gray-900">{activity.title}</p>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <span className={getDifficultyColor(activity.difficulty)}>
                      {activity.difficulty}
                    </span>
                    <span>•</span>
                    <span className={getStatusColor(activity.status)}>
                      {activity.status}
                    </span>
                    <span>•</span>
                    <span>{formatTime(activity.timeSpent)}</span>
                  </div>
                </div>
              </div>
              <span className="text-sm text-gray-500">
                {new Date(activity.timestamp).toLocaleDateString()}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Achievements */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Achievements</h2>
          <TrophyIcon className="w-6 h-6 text-yellow-500" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.achievements.map((achievement) => (
            <div
              key={achievement.id}
              className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                achievement.unlocked
                  ? "border-yellow-300 bg-yellow-50"
                  : "border-gray-200 bg-gray-50"
              }`}
            >
              <div className="flex items-start space-x-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  achievement.unlocked ? "bg-yellow-100" : "bg-gray-200"
                }`}>
                  <span className="text-lg">{achievement.icon}</span>
                </div>
                <div className="flex-1">
                  <h3 className={`font-medium ${
                    achievement.unlocked ? "text-yellow-800" : "text-gray-600"
                  }`}>
                    {achievement.title}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {achievement.description}
                  </p>
                  {!achievement.unlocked && (
                    <div className="mt-2">
                      <div className="flex justify-between text-xs text-gray-500 mb-1">
                        <span>Progress</span>
                        <span>{achievement.progress}/{achievement.maxProgress}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1">
                        <div 
                          className="bg-yellow-400 h-1 rounded-full"
                          style={{ width: `${(achievement.progress / achievement.maxProgress) * 100}%` }}
                        />
                      </div>
                    </div>
                  )}
                  {achievement.unlocked && (
                    <div className="flex items-center mt-2">
                      <CheckCircleIcon className="w-4 h-4 text-yellow-600 mr-1" />
                      <span className="text-xs text-yellow-700 font-medium">Unlocked!</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}