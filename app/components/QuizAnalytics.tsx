"use client";

import React, { useState, useMemo } from 'react';

interface QuizResult {
  id: string;
  title: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  timeSpent: number;
  timeLimit: number;
  difficulty: string;
  category: string;
  completedAt: Date;
  topics: string[];
}

export default function QuizAnalytics() {
  const [timeRange, setTimeRange] = useState('week');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Mock data - in real app, this would come from API
  const quizResults: QuizResult[] = [
    {
      id: '1',
      title: 'Array Fundamentals',
      score: 85,
      totalQuestions: 15,
      correctAnswers: 13,
      timeSpent: 22,
      timeLimit: 30,
      difficulty: 'Easy',
      category: 'Data Structures',
      completedAt: new Date('2024-01-15'),
      topics: ['Arrays', 'Indexing', 'Traversal'],
    },
    {
      id: '2',
      title: 'Binary Search Mastery',
      score: 70,
      totalQuestions: 12,
      correctAnswers: 9,
      timeSpent: 28,
      timeLimit: 25,
      difficulty: 'Medium',
      category: 'Algorithms',
      completedAt: new Date('2024-01-14'),
      topics: ['Binary Search', 'Divide & Conquer'],
    },
    {
      id: '3',
      title: 'Dynamic Programming',
      score: 45,
      totalQuestions: 20,
      correctAnswers: 9,
      timeSpent: 45,
      timeLimit: 50,
      difficulty: 'Hard',
      category: 'Algorithms',
      completedAt: new Date('2024-01-13'),
      topics: ['DP', 'Memoization', 'Optimization'],
    },
    // Add more mock data...
  ];

  const analytics = useMemo(() => {
    const filteredResults = quizResults.filter(result => {
      if (selectedCategory !== 'all' && result.category !== selectedCategory) return false;
      
      const now = new Date();
      const resultDate = result.completedAt;
      
      switch (timeRange) {
        case 'week':
          return (now.getTime() - resultDate.getTime()) <= 7 * 24 * 60 * 60 * 1000;
        case 'month':
          return (now.getTime() - resultDate.getTime()) <= 30 * 24 * 60 * 60 * 1000;
        case 'year':
          return (now.getTime() - resultDate.getTime()) <= 365 * 24 * 60 * 60 * 1000;
        default:
          return true;
      }
    });

    const totalQuizzes = filteredResults.length;
    const averageScore = totalQuizzes > 0 ? 
      filteredResults.reduce((sum, result) => sum + result.score, 0) / totalQuizzes : 0;
    const averageTime = totalQuizzes > 0 ? 
      filteredResults.reduce((sum, result) => sum + result.timeSpent, 0) / totalQuizzes : 0;

    const difficultyBreakdown = filteredResults.reduce((acc, result) => {
      acc[result.difficulty] = (acc[result.difficulty] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const categoryPerformance = filteredResults.reduce((acc, result) => {
      if (!acc[result.category]) {
        acc[result.category] = { total: 0, scores: [] };
      }
      acc[result.category].total += 1;
      acc[result.category].scores.push(result.score);
      return acc;
    }, {} as Record<string, { total: number; scores: number[] }>);

    const topicMastery = filteredResults.reduce((acc, result) => {
      result.topics.forEach(topic => {
        if (!acc[topic]) {
          acc[topic] = { attempts: 0, totalScore: 0, averageScore: 0 };
        }
        acc[topic].attempts += 1;
        acc[topic].totalScore += result.score;
        acc[topic].averageScore = acc[topic].totalScore / acc[topic].attempts;
      });
      return acc;
    }, {} as Record<string, { attempts: number; totalScore: number; averageScore: number }>);

    const improvementTrend = filteredResults
      .sort((a, b) => a.completedAt.getTime() - b.completedAt.getTime())
      .map((result, index) => ({
        quiz: index + 1,
        score: result.score,
        date: result.completedAt,
      }));

    return {
      totalQuizzes,
      averageScore: Math.round(averageScore),
      averageTime: Math.round(averageTime),
      difficultyBreakdown,
      categoryPerformance,
      topicMastery,
      improvementTrend,
    };
  }, [quizResults, timeRange, selectedCategory]);

  const categories = ['all', ...Array.from(new Set(quizResults.map(r => r.category)))];

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <h2 className="text-2xl font-bold">📊 Quiz Analytics</h2>
          <div className="flex gap-4">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="week">Last Week</option>
              <option value="month">Last Month</option>
              <option value="year">Last Year</option>
              <option value="all">All Time</option>
            </select>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white">
          <div className="text-3xl font-bold">{analytics.totalQuizzes}</div>
          <div className="text-blue-100">Quizzes Completed</div>
          <div className="text-sm text-blue-200 mt-2">
            {timeRange === 'week' ? 'This week' : timeRange === 'month' ? 'This month' : 'All time'}
          </div>
        </div>
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white">
          <div className="text-3xl font-bold">{analytics.averageScore}%</div>
          <div className="text-green-100">Average Score</div>
          <div className="text-sm text-green-200 mt-2">
            {analytics.averageScore >= 80 ? 'Excellent!' : analytics.averageScore >= 60 ? 'Good progress' : 'Keep practicing!'}
          </div>
        </div>
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-6 text-white">
          <div className="text-3xl font-bold">{analytics.averageTime}m</div>
          <div className="text-purple-100">Avg. Time per Quiz</div>
          <div className="text-sm text-purple-200 mt-2">
            Average completion time
          </div>
        </div>
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg p-6 text-white">
          <div className="text-3xl font-bold">
            {Object.keys(analytics.topicMastery).length}
          </div>
          <div className="text-orange-100">Topics Covered</div>
          <div className="text-sm text-orange-200 mt-2">
            Different areas practiced
          </div>
        </div>
      </div>

      {/* Difficulty Breakdown */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-xl font-bold mb-4">📈 Performance by Difficulty</h3>
        <div className="space-y-3">
          {Object.entries(analytics.difficultyBreakdown).map(([difficulty, count]) => {
            const percentage = (count / analytics.totalQuizzes) * 100;
            const color = difficulty === 'Easy' ? 'bg-green-500' : 
                         difficulty === 'Medium' ? 'bg-yellow-500' : 'bg-red-500';
            
            return (
              <div key={difficulty} className="flex items-center gap-4">
                <div className="w-20 text-sm font-medium">{difficulty}</div>
                <div className="flex-1">
                  <div className="bg-gray-200 rounded-full h-6 relative overflow-hidden">
                    <div
                      className={`${color} h-full rounded-full transition-all duration-500`}
                      style={{ width: `${percentage}%` }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center text-xs font-medium">
                      {count} quizzes ({percentage.toFixed(0)}%)
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Category Performance */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-xl font-bold mb-4">🎯 Performance by Category</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Object.entries(analytics.categoryPerformance).map(([category, data]) => {
            const avgScore = data.scores.reduce((sum, score) => sum + score, 0) / data.scores.length;
            const improvement = data.scores.length > 1 ? 
              data.scores[data.scores.length - 1] - data.scores[0] : 0;
            
            return (
              <div key={category} className="p-4 border border-gray-200 rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold">{category}</h4>
                  <span className="text-sm text-gray-500">{data.total} quizzes</span>
                </div>
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-2xl font-bold text-blue-600">{Math.round(avgScore)}%</span>
                  <span className="text-sm text-gray-600">average score</span>
                </div>
                {improvement !== 0 && (
                  <div className={`text-sm ${improvement > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {improvement > 0 ? '↗' : '↘'} {Math.abs(improvement).toFixed(0)}% 
                    {improvement > 0 ? ' improvement' : ' decline'}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Topic Mastery */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-xl font-bold mb-4">🧠 Topic Mastery</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Object.entries(analytics.topicMastery)
            .sort((a, b) => b[1].averageScore - a[1].averageScore)
            .map(([topic, data]) => {
              const masteryLevel = data.averageScore >= 90 ? 'Master' :
                                 data.averageScore >= 75 ? 'Advanced' :
                                 data.averageScore >= 60 ? 'Intermediate' : 'Novice';
              const color = masteryLevel === 'Master' ? 'text-green-600 bg-green-50' :
                           masteryLevel === 'Advanced' ? 'text-blue-600 bg-blue-50' :
                           masteryLevel === 'Intermediate' ? 'text-yellow-600 bg-yellow-50' :
                           'text-gray-600 bg-gray-50';

              return (
                <div key={topic} className={`p-3 rounded-lg border ${color} border-opacity-50`}>
                  <div className="font-medium text-sm mb-1">{topic}</div>
                  <div className="text-xs opacity-75 mb-2">{data.attempts} attempts</div>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold">{Math.round(data.averageScore)}%</span>
                    <span className="text-xs px-2 py-1 rounded-full bg-white bg-opacity-50">
                      {masteryLevel}
                    </span>
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      {/* Improvement Trend */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-xl font-bold mb-4">📈 Improvement Trend</h3>
        <div className="h-64 flex items-end justify-between px-4">
          {analytics.improvementTrend.slice(-10).map((point, index) => (
            <div key={index} className="flex flex-col items-center">
              <div
                className="bg-blue-500 w-8 rounded-t transition-all duration-500 hover:bg-blue-600"
                style={{ height: `${(point.score / 100) * 200}px`, minHeight: '4px' }}
                title={`Quiz ${point.quiz}: ${point.score}%`}
              />
              <div className="text-xs text-gray-500 mt-2 transform -rotate-45 origin-left">
                {point.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recommendations */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6">
        <h3 className="text-xl font-bold mb-4">💡 Personalized Recommendations</h3>
        <div className="space-y-3">
          {analytics.averageScore < 60 && (
            <div className="bg-yellow-100 border border-yellow-300 rounded-lg p-3">
              <div className="font-medium text-yellow-800">Focus on Fundamentals</div>
              <div className="text-sm text-yellow-700">
                Consider starting with easier topics to build confidence before tackling harder problems.
              </div>
            </div>
          )}
          {analytics.totalQuizzes < 5 && (
            <div className="bg-blue-100 border border-blue-300 rounded-lg p-3">
              <div className="font-medium text-blue-800">Take More Quizzes</div>
              <div className="text-sm text-blue-700">
                Complete more quizzes to get better insights into your performance patterns.
              </div>
            </div>
          )}
          <div className="bg-green-100 border border-green-300 rounded-lg p-3">
            <div className="font-medium text-green-800">Suggested Next Steps</div>
            <div className="text-sm text-green-700">
              Based on your performance, try focusing on Dynamic Programming and Graph Algorithms.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}