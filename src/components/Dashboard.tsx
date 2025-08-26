'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface QuickStats {
  totalSolved: number;
  currentStreak: number;
  averageTime: number;
  accuracy: number;
  recentActivity: Array<{
    type: 'quiz' | 'contest' | 'battle' | 'interview';
    name: string;
    score: number;
    date: string;
  }>;
  todaysGoal: {
    target: number;
    completed: number;
    type: 'problems' | 'minutes' | 'contests';
  };
}

const MOCK_STATS: QuickStats = {
  totalSolved: 347,
  currentStreak: 12,
  averageTime: 18.5,
  accuracy: 79.2,
  recentActivity: [
    { type: 'battle', name: 'Algorithm Masters Arena', score: 1450, date: '2 hours ago' },
    { type: 'quiz', name: 'Dynamic Programming Challenge', score: 92, date: '5 hours ago' },
    { type: 'contest', name: 'Weekly Contest #127', score: 1876, date: '1 day ago' },
    { type: 'interview', name: 'Mock Technical Interview', score: 85, date: '2 days ago' },
    { type: 'quiz', name: 'Array & String Mastery', score: 88, date: '3 days ago' }
  ],
  todaysGoal: {
    target: 5,
    completed: 3,
    type: 'problems'
  }
};

const FEATURES = [
  {
    id: 'quiz',
    title: '🎯 Ultra Quiz',
    description: '3500+ problems with adaptive difficulty',
    path: '/quiz',
    color: 'from-blue-500 to-cyan-500',
    stats: '3,500+ problems',
    icon: '🎯'
  },
  {
    id: 'contest',
    title: '🏆 Contest Mode',
    description: 'Real-time competitions with leaderboards',
    path: '/contest',
    color: 'from-purple-500 to-pink-500',
    stats: 'Live contests',
    icon: '🏆'
  },
  {
    id: 'battle',
    title: '⚔️ Battle Mode',
    description: 'Head-to-head coding duels',
    path: '/battle',
    color: 'from-red-500 to-orange-500',
    stats: 'PvP battles',
    icon: '⚔️'
  },
  {
    id: 'interview',
    title: '🎤 Interview Simulator',
    description: 'Practice with real interview scenarios',
    path: '/interview',
    color: 'from-green-500 to-teal-500',
    stats: 'Mock interviews',
    icon: '🎤'
  },
  {
    id: 'ai-recommender',
    title: '🤖 AI Recommender',
    description: 'Personalized problem recommendations',
    path: '/ai-recommender',
    color: 'from-indigo-500 to-blue-500',
    stats: 'Smart suggestions',
    icon: '🤖'
  },
  {
    id: 'performance',
    title: '📊 Performance Analytics',
    description: 'Deep insights into your progress',
    path: '/performance',
    color: 'from-yellow-500 to-orange-500',
    stats: 'Detailed metrics',
    icon: '📊'
  },
  {
    id: 'achievements',
    title: '🏅 Achievements',
    description: 'Unlock badges and track milestones',
    path: '/achievements',
    color: 'from-purple-500 to-indigo-500',
    stats: '50+ achievements',
    icon: '🏅'
  },
  {
    id: 'study-plans',
    title: '📚 Study Plans',
    description: 'Structured learning paths',
    path: '/study-plans',
    color: 'from-emerald-500 to-green-500',
    stats: 'Guided learning',
    icon: '📚'
  }
];

const QUICK_ACTIONS = [
  { name: 'Random Problem', path: '/quiz?mode=random', icon: '🎲' },
  { name: 'Daily Challenge', path: '/quiz?mode=daily', icon: '📅' },
  { name: 'Weak Topics', path: '/ai-recommender', icon: '🎯' },
  { name: 'Join Contest', path: '/contest', icon: '🏃' },
];

export default function Dashboard() {
  const [stats] = useState<QuickStats>(MOCK_STATS);
  const [currentTime, setCurrentTime] = useState(new Date());
  const router = useRouter();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'quiz': return '🎯';
      case 'contest': return '🏆';
      case 'battle': return '⚔️';
      case 'interview': return '🎤';
      default: return '📝';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-500';
    if (score >= 80) return 'text-blue-500';
    if (score >= 70) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      {/* Header */}
      <div className="bg-black/20 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                {getGreeting()}, Coder! 👋
              </h1>
              <p className="text-gray-300 mt-1">Ready to level up your coding skills?</p>
            </div>
            <div className="text-right">
              <div className="text-lg font-medium">
                {currentTime.toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </div>
              <div className="text-sm text-gray-400">
                {currentTime.toLocaleTimeString('en-US', { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-600/20 to-cyan-600/20 backdrop-blur-md rounded-lg p-6 border border-white/10">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold">Problems Solved</h3>
              <span className="text-2xl">🎯</span>
            </div>
            <div className="text-3xl font-bold text-blue-400">{stats.totalSolved}</div>
            <div className="text-sm text-gray-400 mt-1">Keep going!</div>
          </div>

          <div className="bg-gradient-to-br from-green-600/20 to-emerald-600/20 backdrop-blur-md rounded-lg p-6 border border-white/10">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold">Current Streak</h3>
              <span className="text-2xl">🔥</span>
            </div>
            <div className="text-3xl font-bold text-green-400">{stats.currentStreak}</div>
            <div className="text-sm text-gray-400 mt-1">days</div>
          </div>

          <div className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 backdrop-blur-md rounded-lg p-6 border border-white/10">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold">Accuracy</h3>
              <span className="text-2xl">🎪</span>
            </div>
            <div className="text-3xl font-bold text-purple-400">{stats.accuracy}%</div>
            <div className="text-sm text-gray-400 mt-1">avg success rate</div>
          </div>

          <div className="bg-gradient-to-br from-yellow-600/20 to-orange-600/20 backdrop-blur-md rounded-lg p-6 border border-white/10">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold">Avg Time</h3>
              <span className="text-2xl">⏱️</span>
            </div>
            <div className="text-3xl font-bold text-yellow-400">{stats.averageTime}m</div>
            <div className="text-sm text-gray-400 mt-1">per problem</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Today's Goal */}
          <div className="bg-white/5 backdrop-blur-md rounded-lg p-6 border border-white/10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">🎯 Today's Goal</h3>
              <span className="text-sm text-gray-400">
                {stats.todaysGoal.completed}/{stats.todaysGoal.target}
              </span>
            </div>
            
            <div className="mb-4">
              <div className="flex justify-between text-sm mb-2">
                <span>Progress</span>
                <span>{Math.round((stats.todaysGoal.completed / stats.todaysGoal.target) * 100)}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-green-400 to-blue-500 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min((stats.todaysGoal.completed / stats.todaysGoal.target) * 100, 100)}%` }}
                ></div>
              </div>
            </div>
            
            <p className="text-sm text-gray-400">
              {stats.todaysGoal.target - stats.todaysGoal.completed > 0 
                ? `${stats.todaysGoal.target - stats.todaysGoal.completed} more ${stats.todaysGoal.type} to reach your goal!`
                : '🎉 Goal achieved! Great job!'
              }
            </p>
          </div>

          {/* Quick Actions */}
          <div className="bg-white/5 backdrop-blur-md rounded-lg p-6 border border-white/10">
            <h3 className="text-lg font-semibold mb-4">⚡ Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3">
              {QUICK_ACTIONS.map((action) => (
                <Link
                  key={action.name}
                  href={action.path}
                  className="flex flex-col items-center p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-all duration-200 hover:scale-105"
                >
                  <span className="text-2xl mb-2">{action.icon}</span>
                  <span className="text-xs text-center">{action.name}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white/5 backdrop-blur-md rounded-lg p-6 border border-white/10">
            <h3 className="text-lg font-semibold mb-4">📈 Recent Activity</h3>
            <div className="space-y-3">
              {stats.recentActivity.slice(0, 4).map((activity, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-lg">{getActivityIcon(activity.type)}</span>
                    <div>
                      <div className="text-sm font-medium truncate max-w-32">
                        {activity.name}
                      </div>
                      <div className="text-xs text-gray-400">{activity.date}</div>
                    </div>
                  </div>
                  <div className={`text-sm font-bold ${getScoreColor(activity.score)}`}>
                    {activity.score}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Features Grid */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            🚀 Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map((feature) => (
              <Link
                key={feature.id}
                href={feature.path}
                className="group relative overflow-hidden rounded-xl p-6 bg-gradient-to-br bg-white/5 backdrop-blur-md border border-white/10 hover:border-white/20 transition-all duration-300 hover:scale-105 hover:shadow-2xl"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-10 group-hover:opacity-20 transition-opacity duration-300`}></div>
                
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-3xl">{feature.icon}</span>
                    <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                  </div>
                  
                  <h3 className="text-lg font-bold mb-2 group-hover:text-white transition-colors">
                    {feature.title}
                  </h3>
                  
                  <p className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors mb-3">
                    {feature.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500 group-hover:text-gray-400 transition-colors">
                      {feature.stats}
                    </span>
                    <div className="text-white/60 group-hover:text-white group-hover:translate-x-1 transition-all duration-200">
                      →
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Learning Progress */}
        <div className="bg-white/5 backdrop-blur-md rounded-lg p-6 border border-white/10">
          <h3 className="text-xl font-bold mb-6">📚 Learning Progress</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { topic: 'Arrays & Strings', progress: 92, total: 120, color: 'from-blue-400 to-cyan-400' },
              { topic: 'Dynamic Programming', progress: 67, total: 85, color: 'from-purple-400 to-pink-400' },
              { topic: 'Trees & Graphs', progress: 78, total: 95, color: 'from-green-400 to-emerald-400' },
              { topic: 'System Design', progress: 34, total: 60, color: 'from-orange-400 to-red-400' },
              { topic: 'Advanced Algorithms', progress: 23, total: 45, color: 'from-indigo-400 to-purple-400' },
              { topic: 'Math & Logic', progress: 56, total: 75, color: 'from-yellow-400 to-orange-400' }
            ].map((topic) => (
              <div key={topic.topic} className="bg-white/5 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-medium text-sm">{topic.topic}</h4>
                  <span className="text-xs text-gray-400">{topic.progress}/{topic.total}</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2 mb-2">
                  <div
                    className={`bg-gradient-to-r ${topic.color} h-2 rounded-full transition-all duration-500`}
                    style={{ width: `${(topic.progress / topic.total) * 100}%` }}
                  ></div>
                </div>
                <div className="text-xs text-gray-400">
                  {Math.round((topic.progress / topic.total) * 100)}% complete
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}