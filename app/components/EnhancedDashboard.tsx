'use client';

import { useState, useEffect } from 'react';
import {
  ChartBarIcon,
  UserGroupIcon,
  TrophyIcon,
  LightBulbIcon,
  FireIcon,
  PlayIcon,
  CalendarDaysIcon,
  BoltIcon,
  AcademicCapIcon,
  PuzzlePieceIcon,
  RocketLaunchIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';

interface DashboardStats {
  totalQuizzes: number;
  averageScore: number;
  currentStreak: number;
  skillLevel: string;
  weeklyGoal: number;
  weeklyProgress: number;
  achievements: number;
  studyGroups: number;
  activeBattles: number;
}

interface RecommendationCard {
  type: 'quiz' | 'skill' | 'challenge' | 'study';
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  action: string;
  estimatedTime?: string;
  difficulty?: string;
  icon: any;
}

interface ActivityFeed {
  id: string;
  type: 'achievement' | 'quiz' | 'battle' | 'group' | 'milestone';
  title: string;
  description: string;
  timestamp: Date;
  icon: any;
  color: string;
}

export default function EnhancedDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalQuizzes: 0,
    averageScore: 0,
    currentStreak: 0,
    skillLevel: 'Beginner',
    weeklyGoal: 15,
    weeklyProgress: 0,
    achievements: 0,
    studyGroups: 0,
    activeBattles: 0
  });

  const [recommendations, setRecommendations] = useState<RecommendationCard[]>([]);
  const [activityFeed, setActivityFeed] = useState<ActivityFeed[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'recommendations' | 'activity' | 'social'>('overview');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch multiple data sources in parallel
      const [analyticsRes, recommendationsRes, progressRes] = await Promise.all([
        fetch('/api/analytics/advanced?period=30'),
        fetch('/api/recommendations/smart', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'personalizedQuiz' })
        }),
        fetch('/api/progress/detailed')
      ]);

      // Process analytics data
      if (analyticsRes.ok) {
        const analytics = await analyticsRes.json();
        setStats(prev => ({
          ...prev,
          totalQuizzes: analytics.summary?.totalAttempts || 0,
          averageScore: Math.round(analytics.summary?.averageScore || 0),
          currentStreak: analytics.consistency?.streakAnalysis?.currentStreak || 0,
          skillLevel: analytics.learningVelocity?.masteryLevel || 'Beginner'
        }));
      }

      // Process recommendations
      if (recommendationsRes.ok) {
        const recData = await recommendationsRes.json();
        generateRecommendationCards(recData);
      }

      // Generate activity feed
      generateActivityFeed();

    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateRecommendationCards = (data: any) => {
    const cards: RecommendationCard[] = [
      {
        type: 'quiz',
        title: 'Personalized Quiz Ready',
        description: 'AI-generated quiz targeting your weak areas',
        priority: 'high',
        action: 'Take Quiz',
        estimatedTime: '30 minutes',
        difficulty: 'Mixed',
        icon: PuzzlePieceIcon
      },
      {
        type: 'skill',
        title: 'Focus on Dynamic Programming',
        description: 'Your weakest area needs attention',
        priority: 'high',
        action: 'Study',
        estimatedTime: '45 minutes',
        icon: AcademicCapIcon
      },
      {
        type: 'challenge',
        title: 'Weekly Challenge Available',
        description: 'Join this week\'s coding challenge',
        priority: 'medium',
        action: 'Join Challenge',
        estimatedTime: '2 hours',
        icon: TrophyIcon
      },
      {
        type: 'study',
        title: 'Join Study Group',
        description: 'Active group studying your focus areas',
        priority: 'low',
        action: 'Join Group',
        icon: UserGroupIcon
      }
    ];

    setRecommendations(cards);
  };

  const generateActivityFeed = () => {
    const feed: ActivityFeed[] = [
      {
        id: '1',
        type: 'achievement',
        title: 'New Achievement Unlocked!',
        description: 'Completed 10 consecutive problems correctly',
        timestamp: new Date(Date.now() - 1000 * 60 * 30),
        icon: TrophyIcon,
        color: 'text-yellow-600 bg-yellow-100'
      },
      {
        id: '2',
        type: 'quiz',
        title: 'Quiz Completed',
        description: 'Scored 85% on Arrays & Strings quiz',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
        icon: ChartBarIcon,
        color: 'text-blue-600 bg-blue-100'
      },
      {
        id: '3',
        type: 'battle',
        title: 'Battle Victory',
        description: 'Won multiplayer battle against 3 opponents',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4),
        icon: BoltIcon,
        color: 'text-green-600 bg-green-100'
      },
      {
        id: '4',
        type: 'group',
        title: 'Study Group Activity',
        description: 'New discussion in "Advanced Algorithms" group',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6),
        icon: ChatBubbleLeftRightIcon,
        color: 'text-purple-600 bg-purple-100'
      }
    ];

    setActivityFeed(feed);
  };

  const handleQuickAction = async (action: string) => {
    try {
      switch (action) {
        case 'personalizedQuiz':
          // Navigate to personalized quiz
          window.location.href = '/quiz/enhanced';
          break;
        case 'joinBattle':
          // Navigate to battle selection
          window.location.href = '/arena';
          break;
        case 'studyGroup':
          // Navigate to study groups
          window.location.href = '/study-groups';
          break;
        case 'viewAnalytics':
          // Navigate to detailed analytics
          window.location.href = '/analytics';
          break;
        default:
          console.log('Action not implemented:', action);
      }
    } catch (error) {
      console.error('Quick action failed:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white p-6 rounded-xl shadow-sm">
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/3"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome back, Coder! 👋
            </h1>
            <p className="text-gray-600">
              Ready to level up your coding skills today?
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-lg shadow-sm">
              <FireIcon className="h-5 w-5 text-orange-500" />
              <span className="font-semibold text-gray-900">{stats.currentStreak}</span>
              <span className="text-gray-600">day streak</span>
            </div>
            
            <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-lg shadow-sm">
              <TrophyIcon className="h-5 w-5 text-yellow-500" />
              <span className="font-semibold text-gray-900">{stats.skillLevel}</span>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={ChartBarIcon}
            title="Quizzes Completed"
            value={stats.totalQuizzes.toString()}
            subtitle={`${stats.averageScore}% avg score`}
            color="blue"
          />
          
          <StatCard
            icon={TrophyIcon}
            title="Achievements"
            value={stats.achievements.toString()}
            subtitle="Unlocked this month"
            color="yellow"
          />
          
          <StatCard
            icon={UserGroupIcon}
            title="Study Groups"
            value={stats.studyGroups.toString()}
            subtitle="Active memberships"
            color="purple"
          />
          
          <StatCard
            icon={BoltIcon}
            title="Battle Rating"
            value="1247"
            subtitle="+23 this week"
            color="green"
          />
        </div>

        {/* Weekly Progress */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Weekly Goal Progress</h3>
            <span className="text-sm text-gray-600">{stats.weeklyProgress}/{stats.weeklyGoal} problems</span>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-300"
              style={{ width: `${Math.min((stats.weeklyProgress / stats.weeklyGoal) * 100, 100)}%` }}
            ></div>
          </div>
          
          <p className="text-sm text-gray-600 mt-2">
            {Math.max(0, stats.weeklyGoal - stats.weeklyProgress)} problems remaining to reach your weekly goal
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-white p-1 rounded-lg shadow-sm mb-6">
          {[
            { id: 'overview', label: 'Overview', icon: ChartBarIcon },
            { id: 'recommendations', label: 'AI Recommendations', icon: LightBulbIcon },
            { id: 'activity', label: 'Recent Activity', icon: CalendarDaysIcon },
            { id: 'social', label: 'Social Hub', icon: UserGroupIcon }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-md font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="min-h-96">
          {activeTab === 'overview' && <OverviewTab onQuickAction={handleQuickAction} />}
          {activeTab === 'recommendations' && <RecommendationsTab recommendations={recommendations} />}
          {activeTab === 'activity' && <ActivityTab feed={activityFeed} />}
          {activeTab === 'social' && <SocialTab />}
        </div>
      </div>
    </div>
  );
}

// Sub-components
function StatCard({ icon: Icon, title, value, subtitle, color }: any) {
  const colorClasses: Record<string, string> = {
    blue: 'text-blue-600 bg-blue-100',
    yellow: 'text-yellow-600 bg-yellow-100',
    purple: 'text-purple-600 bg-purple-100',
    green: 'text-green-600 bg-green-100'
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center">
        <div className={`p-2 rounded-lg ${colorClasses[color] || colorClasses.blue}`}>
          <Icon className="h-6 w-6" />
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          <p className="text-xs text-gray-500">{subtitle}</p>
        </div>
      </div>
    </div>
  );
}

function OverviewTab({ onQuickAction }: { onQuickAction: (action: string) => void }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="space-y-3">
          {[
            {
              action: 'personalizedQuiz',
              title: 'Take AI-Powered Quiz',
              description: 'Personalized to your skill level',
              icon: PuzzlePieceIcon,
              color: 'blue'
            },
            {
              action: 'joinBattle',
              title: 'Join Coding Battle',
              description: 'Real-time multiplayer challenge',
              icon: BoltIcon,
              color: 'green'
            },
            {
              action: 'studyGroup',
              title: 'Browse Study Groups',
              description: 'Learn with peers',
              icon: UserGroupIcon,
              color: 'purple'
            },
            {
              action: 'viewAnalytics',
              title: 'View Detailed Analytics',
              description: 'Track your progress',
              icon: ChartBarIcon,
              color: 'yellow'
            }
          ].map((item) => (
            <button
              key={item.action}
              onClick={() => onQuickAction(item.action)}
              className="w-full flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors text-left"
            >
              <div className={`p-2 rounded-lg ${{
                blue: 'text-blue-600 bg-blue-100',
                green: 'text-green-600 bg-green-100',
                purple: 'text-purple-600 bg-purple-100',
                yellow: 'text-yellow-600 bg-yellow-100'
              }[item.color]}`}>
                <item.icon className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">{item.title}</p>
                <p className="text-sm text-gray-600">{item.description}</p>
              </div>
              <PlayIcon className="h-4 w-4 text-gray-400" />
            </button>
          ))}
        </div>
      </div>

      {/* Learning Streak */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Learning Journey</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <FireIcon className="h-8 w-8 text-orange-500" />
              <div>
                <p className="font-semibold text-gray-900">7 Day Streak!</p>
                <p className="text-sm text-gray-600">Keep it up!</p>
              </div>
            </div>
            <div className="text-2xl font-bold text-orange-500">🔥</div>
          </div>

          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <RocketLaunchIcon className="h-8 w-8 text-blue-500" />
              <div>
                <p className="font-semibold text-gray-900">Level Up Soon!</p>
                <p className="text-sm text-gray-600">85% to Intermediate</p>
              </div>
            </div>
            <div className="w-16 h-2 bg-gray-200 rounded-full">
              <div className="w-14 h-2 bg-blue-500 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function RecommendationsTab({ recommendations }: { recommendations: RecommendationCard[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {recommendations.map((rec, index) => (
        <div key={index} className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
          <div className="flex items-start space-x-4">
            <div className={`p-2 rounded-lg ${
              rec.priority === 'high' ? 'text-red-600 bg-red-100' :
              rec.priority === 'medium' ? 'text-yellow-600 bg-yellow-100' :
              'text-green-600 bg-green-100'
            }`}>
              <rec.icon className="h-6 w-6" />
            </div>
            
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <h4 className="font-semibold text-gray-900">{rec.title}</h4>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  rec.priority === 'high' ? 'text-red-700 bg-red-100' :
                  rec.priority === 'medium' ? 'text-yellow-700 bg-yellow-100' :
                  'text-green-700 bg-green-100'
                }`}>
                  {rec.priority}
                </span>
              </div>
              
              <p className="text-gray-600 mb-3">{rec.description}</p>
              
              {rec.estimatedTime && (
                <p className="text-sm text-gray-500 mb-3">
                  ⏱️ {rec.estimatedTime}
                  {rec.difficulty && ` • ${rec.difficulty}`}
                </p>
              )}
              
              <button className="text-blue-600 hover:text-blue-800 font-medium text-sm">
                {rec.action} →
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function ActivityTab({ feed }: { feed: ActivityFeed[] }) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
      <div className="space-y-4">
        {feed.map((item) => (
          <div key={item.id} className="flex items-start space-x-4 p-3 rounded-lg hover:bg-gray-50">
            <div className={`p-2 rounded-lg ${item.color}`}>
              <item.icon className="h-5 w-5" />
            </div>
            
            <div className="flex-1">
              <h4 className="font-medium text-gray-900">{item.title}</h4>
              <p className="text-sm text-gray-600">{item.description}</p>
              <p className="text-xs text-gray-500 mt-1">
                {formatTimeAgo(item.timestamp)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SocialTab() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Active Study Groups</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">Dynamic Programming Masters</p>
              <p className="text-sm text-gray-600">15 members • 3 active challenges</p>
            </div>
            <button className="text-blue-600 text-sm font-medium">Join</button>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">Graph Algorithms Study</p>
              <p className="text-sm text-gray-600">22 members • Study session in 2h</p>
            </div>
            <button className="text-green-600 text-sm font-medium">Attend</button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Live Battles</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">Array Masters Battle</p>
              <p className="text-sm text-gray-600">3/4 players • Starting soon</p>
            </div>
            <button className="text-blue-600 text-sm font-medium">Join</button>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">Quick Fire Round</p>
              <p className="text-sm text-gray-600">2/8 players • Easy level</p>
            </div>
            <button className="text-green-600 text-sm font-medium">Join</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Utility function
function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  return `${Math.floor(diffInSeconds / 86400)}d ago`;
}