"use client";

import { useState, useEffect } from 'react';
import { TrophyIcon, UserIcon, ClockIcon } from '@heroicons/react/24/outline';

interface LeaderboardEntry {
  id: string;
  name: string;
  totalScore: number;
  averageScore: number;
  totalQuestions: number;
  lastPlayed: Date;
  streak: number;
  achievements: string[];
}

export default function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [sortBy, setSortBy] = useState<'totalScore' | 'averageScore' | 'streak'>('totalScore');
  const [userStats, setUserStats] = useState<LeaderboardEntry | null>(null);

  useEffect(() => {
    // Generate mock leaderboard data
    const mockData: LeaderboardEntry[] = [
      {
        id: '1',
        name: 'AlgoMaster',
        totalScore: 2850,
        averageScore: 95,
        totalQuestions: 30,
        lastPlayed: new Date(),
        streak: 15,
        achievements: ['First Steps', 'Getting Started', 'Quiz Master', 'Excellence']
      },
      {
        id: '2', 
        name: 'CodeNinja',
        totalScore: 2640,
        averageScore: 88,
        totalQuestions: 30,
        lastPlayed: new Date(),
        streak: 12,
        achievements: ['First Steps', 'Getting Started', 'Quiz Master']
      },
      {
        id: '3',
        name: 'DataStructureGuru',
        totalScore: 2420,
        averageScore: 92,
        totalQuestions: 26,
        lastPlayed: new Date(),
        streak: 8,
        achievements: ['First Steps', 'Getting Started', 'Explorer']
      },
      {
        id: '4',
        name: 'BinarySearchPro',
        totalScore: 2180,
        averageScore: 87,
        totalQuestions: 25,
        lastPlayed: new Date(),
        streak: 5,
        achievements: ['First Steps', 'Getting Started']
      },
      {
        id: '5',
        name: 'DPChampion',
        totalScore: 1950,
        averageScore: 78,
        totalQuestions: 25,
        lastPlayed: new Date(),
        streak: 3,
        achievements: ['First Steps', 'Getting Started']
      }
    ];

    // Add current user (if they have stats)
    const userStatsData = {
      id: 'user',
      name: 'You',
      totalScore: 0,
      averageScore: 0,
      totalQuestions: 0,
      lastPlayed: new Date(),
      streak: 0,
      achievements: []
    };

    // Try to get user stats from localStorage
    try {
      const stored = localStorage.getItem('leetcode-quiz-stats');
      if (stored) {
        const stats = JSON.parse(stored);
        userStatsData.totalScore = stats.totalScore || 0;
        userStatsData.averageScore = stats.averageScore || 0;
        userStatsData.totalQuestions = stats.totalQuestions || 0;
        userStatsData.streak = stats.streak || 0;
        userStatsData.achievements = stats.achievements || [];
      }
    } catch (error) {
      console.error('Error loading user stats:', error);
    }

    setUserStats(userStatsData);
    
    // Combine with mock data and sort
    const allData = [...mockData];
    if (userStatsData.totalQuestions > 0) {
      allData.push(userStatsData);
    }
    
    setLeaderboard(allData.sort((a, b) => b[sortBy] - a[sortBy]));
  }, [sortBy]);

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0: return '🥇';
      case 1: return '🥈';
      case 2: return '🥉';
      default: return `#${index + 1}`;
    }
  };

  const getAchievementEmoji = (achievement: string) => {
    const emojiMap: { [key: string]: string } = {
      'First Steps': '🎯',
      'Getting Started': '🚀',
      'Quiz Master': '🏆',
      'Centurion': '💯',
      'Excellence': '⭐',
      'Perfection': '👑',
      'Explorer': '🗺️'
    };
    return emojiMap[achievement] || '🎖️';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">🏆 Leaderboard</h1>
          <p className="text-xl text-gray-600">See how you rank among algorithm quiz masters!</p>
        </div>

        {/* Sort Controls */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Sort By:</h3>
          <div className="flex flex-wrap gap-4">
            {[
              { key: 'totalScore', label: 'Total Score', icon: TrophyIcon },
              { key: 'averageScore', label: 'Average Score', icon: UserIcon },
              { key: 'streak', label: 'Streak', icon: ClockIcon }
            ].map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setSortBy(key as any)}
                className={`flex items-center px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  sortBy === key
                    ? 'bg-blue-500 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Icon className="h-5 w-5 mr-2" />
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Leaderboard */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6">
            <h2 className="text-2xl font-bold">Global Rankings</h2>
            <p className="opacity-90">Compete with developers worldwide!</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Rank</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Player</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Total Score</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Average</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Questions</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Streak</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Achievements</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {leaderboard.map((entry, index) => {
                  const isCurrentUser = entry.id === 'user';
                  return (
                    <tr
                      key={entry.id}
                      className={`transition-all duration-200 hover:bg-gray-50 ${
                        isCurrentUser ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                      }`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-lg font-bold text-gray-900">
                          {getRankIcon(index)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className={`h-10 w-10 rounded-full flex items-center justify-center text-white font-bold ${
                              isCurrentUser ? 'bg-blue-500' : 'bg-gray-400'
                            }`}>
                              {entry.name[0].toUpperCase()}
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className={`text-sm font-medium ${
                              isCurrentUser ? 'text-blue-900' : 'text-gray-900'
                            }`}>
                              {entry.name} {isCurrentUser && '(You)'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">
                        {entry.totalScore.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {Math.round(entry.averageScore)}%
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {entry.totalQuestions}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <span className="text-sm text-gray-900 mr-1">{entry.streak}</span>
                          <span className="text-orange-500">🔥</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex space-x-1">
                          {entry.achievements.slice(0, 4).map((achievement, achIndex) => (
                            <span
                              key={achIndex}
                              className="text-lg"
                              title={achievement}
                            >
                              {getAchievementEmoji(achievement)}
                            </span>
                          ))}
                          {entry.achievements.length > 4 && (
                            <span className="text-xs text-gray-500 ml-1">
                              +{entry.achievements.length - 4}
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Call to Action */}
        {userStats && userStats.totalQuestions === 0 && (
          <div className="mt-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-lg shadow-lg p-8 text-white text-center">
            <h3 className="text-2xl font-bold mb-4">Ready to Join the Competition?</h3>
            <p className="text-lg mb-6 opacity-90">
              Take your first quiz to appear on the leaderboard and start earning achievements!
            </p>
            <a
              href="/quiz"
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-bold text-lg hover:bg-gray-100 transition-all duration-200 hover:scale-105 inline-block"
            >
              Start Your First Quiz 🚀
            </a>
          </div>
        )}

        {/* Achievement Guide */}
        <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Achievement Guide</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { name: 'First Steps', desc: 'Complete your first quiz', emoji: '🎯' },
              { name: 'Getting Started', desc: 'Answer 10 questions', emoji: '🚀' },
              { name: 'Quiz Master', desc: 'Answer 50 questions', emoji: '🏆' },
              { name: 'Centurion', desc: 'Answer 100 questions', emoji: '💯' },
              { name: 'Excellence', desc: '90%+ average (10+ questions)', emoji: '⭐' },
              { name: 'Perfection', desc: '95%+ average (25+ questions)', emoji: '👑' },
              { name: 'Explorer', desc: 'Attempt 15 different problems', emoji: '🗺️' }
            ].map((achievement, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <span className="text-2xl mr-2">{achievement.emoji}</span>
                  <h4 className="font-semibold text-gray-900">{achievement.name}</h4>
                </div>
                <p className="text-sm text-gray-600">{achievement.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}