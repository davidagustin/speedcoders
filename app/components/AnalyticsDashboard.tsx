"use client";

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  ChartBarIcon, 
  TrendingUpIcon, 
  ClockIcon, 
  AcademicCapIcon,
  FireIcon,
  LightBulbIcon,
  TrophyIcon,
  ArrowUpIcon,
  ArrowDownIcon
} from '@heroicons/react/24/outline';
import { useLocalStorage } from '@/lib/hooks/useLocalStorage';
import { recommendationEngine } from '@/lib/recommendation/RecommendationEngine';
import { comprehensiveProblems } from '@/lib/data/comprehensive-problems';

interface AnalyticsData {
  totalSolved: number;
  totalTime: number;
  accuracy: number;
  streak: number;
  categoriesProgress: Map<string, { solved: number; total: number }>;
  difficultyBreakdown: { Easy: number; Medium: number; Hard: number };
  recentActivity: Array<{ date: string; count: number }>;
  strongestCategories: string[];
  weakestCategories: string[];
  averageTimePerProblem: number;
  improvementRate: number;
}

const AnalyticsDashboard: React.FC = () => {
  const [userData] = useLocalStorage('userData', {
    solvedProblems: [],
    createdAt: new Date().toISOString()
  });
  
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('month');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showRecommendations, setShowRecommendations] = useState(false);

  const analytics = useMemo<AnalyticsData>(() => {
    const solved = userData.solvedProblems || [];
    const categoriesMap = new Map<string, { solved: number; total: number }>();
    const difficultyCount = { Easy: 0, Medium: 0, Hard: 0 };
    let totalTime = 0;
    let correctCount = 0;

    // Initialize categories
    comprehensiveProblems.forEach(problem => {
      if (!categoriesMap.has(problem.category)) {
        categoriesMap.set(problem.category, { solved: 0, total: 0 });
      }
      categoriesMap.get(problem.category)!.total++;
    });

    // Process solved problems
    solved.forEach((problemData: any) => {
      const problem = comprehensiveProblems.find(p => p.id === problemData.id);
      if (problem) {
        categoriesMap.get(problem.category)!.solved++;
        difficultyCount[problem.difficulty as keyof typeof difficultyCount]++;
        totalTime += problemData.time || 1800;
        if (problemData.correct) correctCount++;
      }
    });

    // Calculate recent activity
    const now = new Date();
    const recentActivity: Array<{ date: string; count: number }> = [];
    const daysToShow = timeRange === 'week' ? 7 : timeRange === 'month' ? 30 : 365;
    
    for (let i = daysToShow - 1; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const count = solved.filter((p: any) => 
        p.solvedAt && p.solvedAt.startsWith(dateStr)
      ).length;
      
      recentActivity.push({ date: dateStr, count });
    }

    // Identify strengths and weaknesses
    const categoryStats = Array.from(categoriesMap.entries())
      .map(([category, stats]) => ({
        category,
        percentage: stats.total > 0 ? (stats.solved / stats.total) * 100 : 0
      }))
      .sort((a, b) => b.percentage - a.percentage);

    const strongestCategories = categoryStats
      .filter(c => c.percentage >= 70)
      .slice(0, 3)
      .map(c => c.category);

    const weakestCategories = categoryStats
      .filter(c => c.percentage < 40 && c.percentage > 0)
      .slice(-3)
      .map(c => c.category);

    // Calculate improvement rate (problems solved per week)
    const weeksActive = Math.max(
      1,
      Math.ceil((Date.now() - new Date(userData.createdAt).getTime()) / (1000 * 60 * 60 * 24 * 7))
    );
    const improvementRate = solved.length / weeksActive;

    return {
      totalSolved: solved.length,
      totalTime,
      accuracy: solved.length > 0 ? (correctCount / solved.length) * 100 : 0,
      streak: calculateStreak(solved),
      categoriesProgress: categoriesMap,
      difficultyBreakdown: difficultyCount,
      recentActivity,
      strongestCategories,
      weakestCategories,
      averageTimePerProblem: solved.length > 0 ? totalTime / solved.length : 0,
      improvementRate
    };
  }, [userData, timeRange]);

  const recommendations = useMemo(() => {
    if (!showRecommendations) return [];
    
    const userProfile = recommendationEngine.analyzeUserProfile(userData);
    return recommendationEngine.getRecommendations(userProfile, 5);
  }, [userData, showRecommendations]);

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  const calculateStreak = (solved: any[]): number => {
    if (solved.length === 0) return 0;
    
    const sortedDates = solved
      .filter(p => p.solvedAt)
      .map(p => p.solvedAt.split('T')[0])
      .sort()
      .reverse();
    
    if (sortedDates.length === 0) return 0;
    
    let streak = 1;
    const today = new Date().toISOString().split('T')[0];
    
    if (sortedDates[0] !== today) return 0;
    
    for (let i = 1; i < sortedDates.length; i++) {
      const prevDate = new Date(sortedDates[i - 1]);
      const currDate = new Date(sortedDates[i]);
      const dayDiff = Math.floor((prevDate.getTime() - currDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (dayDiff === 1) {
        streak++;
      } else {
        break;
      }
    }
    
    return streak;
  };

  const getProgressColor = (percentage: number): string => {
    if (percentage >= 70) return 'text-green-600';
    if (percentage >= 40) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics Dashboard</h1>
            <p className="text-gray-600">Track your progress and identify areas for improvement</p>
          </div>
          <div className="flex space-x-2">
            {(['week', 'month', 'year'] as const).map(range => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  timeRange === range
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {range.charAt(0).toUpperCase() + range.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <ChartBarIcon className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">{analytics.totalSolved}</span>
          </div>
          <h3 className="text-gray-600 font-medium">Problems Solved</h3>
          <div className="mt-2 flex items-center text-sm">
            <ArrowUpIcon className="h-4 w-4 text-green-600 mr-1" />
            <span className="text-green-600">
              {analytics.improvementRate.toFixed(1)} per week
            </span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <ClockIcon className="h-8 w-8 text-purple-600" />
            <span className="text-2xl font-bold text-gray-900">
              {formatTime(analytics.averageTimePerProblem)}
            </span>
          </div>
          <h3 className="text-gray-600 font-medium">Avg Time per Problem</h3>
          <div className="mt-2 flex items-center text-sm">
            <span className="text-gray-500">
              Total: {formatTime(analytics.totalTime)}
            </span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <TrophyIcon className="h-8 w-8 text-yellow-600" />
            <span className="text-2xl font-bold text-gray-900">
              {analytics.accuracy.toFixed(1)}%
            </span>
          </div>
          <h3 className="text-gray-600 font-medium">Accuracy Rate</h3>
          <div className="mt-2">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-yellow-600 h-2 rounded-full transition-all"
                style={{ width: `${analytics.accuracy}%` }}
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <FireIcon className="h-8 w-8 text-orange-600" />
            <span className="text-2xl font-bold text-gray-900">{analytics.streak}</span>
          </div>
          <h3 className="text-gray-600 font-medium">Day Streak</h3>
          <div className="mt-2 flex items-center text-sm">
            <span className={analytics.streak > 0 ? 'text-orange-600' : 'text-gray-500'}>
              {analytics.streak > 0 ? 'Keep it up!' : 'Start today!'}
            </span>
          </div>
        </div>
      </div>

      {/* Category Progress */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Category Progress</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from(analytics.categoriesProgress.entries()).map(([category, stats]) => {
            const percentage = stats.total > 0 ? (stats.solved / stats.total) * 100 : 0;
            return (
              <div 
                key={category}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  selectedCategory === category 
                    ? 'border-blue-600 bg-blue-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setSelectedCategory(category === selectedCategory ? null : category)}
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-gray-900">{category}</span>
                  <span className={`font-bold ${getProgressColor(percentage)}`}>
                    {percentage.toFixed(0)}%
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm text-gray-600 mb-2">
                  <span>{stats.solved} solved</span>
                  <span>{stats.total} total</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all ${
                      percentage >= 70 ? 'bg-green-600' :
                      percentage >= 40 ? 'bg-yellow-600' : 'bg-red-600'
                    }`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Difficulty Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Difficulty Distribution</h2>
          <div className="space-y-4">
            {Object.entries(analytics.difficultyBreakdown).map(([difficulty, count]) => {
              const total = Object.values(analytics.difficultyBreakdown).reduce((a, b) => a + b, 0);
              const percentage = total > 0 ? (count / total) * 100 : 0;
              const colors = {
                Easy: 'bg-green-600',
                Medium: 'bg-yellow-600',
                Hard: 'bg-red-600'
              };
              
              return (
                <div key={difficulty}>
                  <div className="flex justify-between mb-1">
                    <span className="font-medium text-gray-700">{difficulty}</span>
                    <span className="text-gray-600">{count} problems</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className={`h-3 rounded-full transition-all ${colors[difficulty as keyof typeof colors]}`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Strengths & Weaknesses</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-green-600 mb-2">Strongest Areas</h3>
              {analytics.strongestCategories.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {analytics.strongestCategories.map(cat => (
                    <span key={cat} className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                      {cat}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">Keep solving to identify strengths</p>
              )}
            </div>
            
            <div>
              <h3 className="font-medium text-red-600 mb-2">Areas to Improve</h3>
              {analytics.weakestCategories.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {analytics.weakestCategories.map(cat => (
                    <span key={cat} className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm">
                      {cat}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">Great progress across all areas!</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg p-6 text-white">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-xl font-bold flex items-center">
              <LightBulbIcon className="h-6 w-6 mr-2" />
              Personalized Recommendations
            </h2>
            <p className="text-blue-100">AI-powered suggestions based on your progress</p>
          </div>
          <button
            onClick={() => setShowRecommendations(!showRecommendations)}
            className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
          >
            {showRecommendations ? 'Hide' : 'Show'} Recommendations
          </button>
        </div>
        
        {showRecommendations && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            {recommendations.map((rec, index) => (
              <div key={rec.problemId} className="bg-white/10 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-lg font-medium">Problem #{rec.problemId}</span>
                  <span className="px-2 py-1 bg-white/20 rounded text-xs">
                    {rec.difficulty}
                  </span>
                </div>
                <p className="text-sm text-blue-100 mb-2">{rec.category}</p>
                <p className="text-xs text-white/80">{rec.reason}</p>
                <div className="mt-2 text-xs text-blue-100">
                  Est. time: {Math.round(rec.estimatedTime / 60)} min
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default React.memo(AnalyticsDashboard);