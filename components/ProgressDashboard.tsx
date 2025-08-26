'use client'

import { useState, useEffect } from 'react'
import {
  ChartBarIcon,
  TrophyIcon,
  FireIcon,
  ClockIcon,
  AcademicCapIcon,
  ArrowTrendingUpIcon,
  StarIcon,
  CalendarDaysIcon
} from '@heroicons/react/24/outline'
import { UserProgress, SkillLevel } from '@/lib/ProgressTracker'
import { LoadingSpinner } from './LoadingSpinner'

interface ProgressDashboardProps {
  userId: string
  showDetailed?: boolean
}

export function ProgressDashboard({ userId, showDetailed = false }: ProgressDashboardProps) {
  const [progress, setProgress] = useState<UserProgress | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedTab, setSelectedTab] = useState<'overview' | 'skills' | 'achievements' | 'activity'>('overview')

  useEffect(() => {
    loadProgress()
  }, [userId])

  const loadProgress = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/progress/${userId}`)
      if (response.ok) {
        const data = await response.json()
        setProgress(data.progress)
      }
    } catch (error) {
      console.error('Failed to load progress:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (!progress) {
    return (
      <div className="text-center p-12">
        <p className="text-gray-500">Failed to load progress data</p>
      </div>
    )
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: ChartBarIcon },
    { id: 'skills', label: 'Skills', icon: AcademicCapIcon },
    { id: 'achievements', label: 'Achievements', icon: TrophyIcon },
    { id: 'activity', label: 'Activity', icon: ClockIcon }
  ]

  return (
    <div className="bg-white rounded-lg shadow">
      {showDetailed && (
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setSelectedTab(tab.id as any)}
                className={`flex items-center gap-2 py-4 border-b-2 font-medium text-sm ${
                  selectedTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      )}

      <div className="p-6">
        {(!showDetailed || selectedTab === 'overview') && (
          <OverviewSection progress={progress} />
        )}
        
        {showDetailed && selectedTab === 'skills' && (
          <SkillsSection skillLevels={progress.skillLevels} />
        )}
        
        {showDetailed && selectedTab === 'achievements' && (
          <AchievementsSection achievements={progress.achievements} />
        )}
        
        {showDetailed && selectedTab === 'activity' && (
          <ActivitySection activities={progress.recentActivity} />
        )}
      </div>
    </div>
  )
}

function OverviewSection({ progress }: { progress: UserProgress }) {
  const stats = [
    {
      name: 'Problems Solved',
      value: progress.solvedProblems,
      total: progress.totalProblems,
      icon: ChartBarIcon,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      name: 'Quizzes Completed',
      value: progress.completedQuizzes,
      total: progress.totalQuizzes,
      icon: AcademicCapIcon,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      name: 'Current Streak',
      value: progress.studyStreak,
      total: progress.longestStreak,
      icon: FireIcon,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    },
    {
      name: 'Average Score',
      value: `${progress.averageScore}%`,
      icon: StarIcon,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    }
  ]

  const difficultyStats = [
    { name: 'Easy', count: progress.easyProblems, color: 'bg-green-500' },
    { name: 'Medium', count: progress.mediumProblems, color: 'bg-yellow-500' },
    { name: 'Hard', count: progress.hardProblems, color: 'bg-red-500' }
  ]

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center">
              <div className={`${stat.bgColor} p-2 rounded-lg`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                <div className="flex items-center">
                  <p className="text-2xl font-semibold text-gray-900">
                    {stat.value}
                  </p>
                  {stat.total && typeof stat.value === 'number' && (
                    <p className="text-sm text-gray-500 ml-2">/ {stat.total}</p>
                  )}
                </div>
                {stat.total && typeof stat.value === 'number' && (
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${Math.min(100, (stat.value / stat.total) * 100)}%` }}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Problem Difficulty Distribution */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Problems by Difficulty</h3>
          <div className="space-y-3">
            {difficultyStats.map((difficulty) => (
              <div key={difficulty.name} className="flex items-center">
                <div className="flex-1 flex items-center">
                  <div className={`w-3 h-3 rounded-full ${difficulty.color} mr-3`} />
                  <span className="text-sm font-medium text-gray-700">{difficulty.name}</span>
                </div>
                <span className="text-lg font-semibold">{difficulty.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Achievements Preview */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Achievements</h3>
          <div className="space-y-3">
            {progress.achievements.slice(0, 3).map((achievement) => (
              <div key={achievement.id} className="flex items-center">
                <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center mr-3">
                  <span className="text-lg">{achievement.icon}</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{achievement.name}</p>
                  <p className="text-xs text-gray-500">{achievement.description}</p>
                </div>
                <div className="text-xs text-gray-400">
                  {new Date(achievement.unlockedAt).toLocaleDateString()}
                </div>
              </div>
            ))}
            {progress.achievements.length === 0 && (
              <p className="text-gray-500 text-sm text-center py-4">
                No achievements yet. Keep learning to unlock your first achievement!
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function SkillsSection({ skillLevels }: { skillLevels: Record<string, SkillLevel> }) {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Skill Levels</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.values(skillLevels).map((skill) => (
          <div key={skill.category} className="bg-gray-50 rounded-lg p-6">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium text-gray-900">{skill.category}</h4>
              <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                Level {skill.level}
              </span>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Progress</span>
                <span>{skill.experience} / {skill.maxExperience} XP</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(skill.experience / skill.maxExperience) * 100}%` }}
                />
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-600">Problems</p>
                <p className="font-semibold">{skill.problems}</p>
              </div>
              <div>
                <p className="text-gray-600">Accuracy</p>
                <p className="font-semibold">{skill.accuracy.toFixed(1)}%</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function AchievementsSection({ achievements }: { achievements: any[] }) {
  const rarityColors = {
    common: 'bg-gray-100 text-gray-800',
    rare: 'bg-blue-100 text-blue-800',
    epic: 'bg-purple-100 text-purple-800',
    legendary: 'bg-yellow-100 text-yellow-800'
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Achievements ({achievements.length})</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {achievements.map((achievement) => (
          <div key={achievement.id} className="bg-gray-50 rounded-lg p-6">
            <div className="flex items-start">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mr-4">
                <span className="text-xl">{achievement.icon}</span>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="font-medium text-gray-900">{achievement.name}</h4>
                  <span className={`text-xs px-2 py-1 rounded ${rarityColors[achievement.rarity as keyof typeof rarityColors]}`}>
                    {achievement.rarity}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-3">{achievement.description}</p>
                <p className="text-xs text-gray-500">
                  Unlocked {new Date(achievement.unlockedAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function ActivitySection({ activities }: { activities: any[] }) {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'problem_solved':
        return ChartBarIcon
      case 'quiz_completed':
        return AcademicCapIcon
      case 'achievement_unlocked':
        return TrophyIcon
      case 'streak_milestone':
        return FireIcon
      default:
        return CalendarDaysIcon
    }
  }

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'problem_solved':
        return 'text-blue-600 bg-blue-50'
      case 'quiz_completed':
        return 'text-green-600 bg-green-50'
      case 'achievement_unlocked':
        return 'text-yellow-600 bg-yellow-50'
      case 'streak_milestone':
        return 'text-orange-600 bg-orange-50'
      default:
        return 'text-gray-600 bg-gray-50'
    }
  }

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Recent Activity</h3>
      
      <div className="space-y-4">
        {activities.map((activity) => {
          const Icon = getActivityIcon(activity.type)
          const colorClasses = getActivityColor(activity.type)
          
          return (
            <div key={activity.id} className="flex items-start p-4 bg-gray-50 rounded-lg">
              <div className={`p-2 rounded-lg ${colorClasses} mr-4`}>
                <Icon className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-gray-900">{activity.title}</h4>
                  {activity.points && (
                    <span className="text-sm text-blue-600 font-medium">
                      +{activity.points} XP
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                <p className="text-xs text-gray-500 mt-2">
                  {new Date(activity.timestamp).toLocaleString()}
                </p>
              </div>
            </div>
          )
        })}
        
        {activities.length === 0 && (
          <div className="text-center py-12">
            <ClockIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No recent activity</p>
          </div>
        )}
      </div>
    </div>
  )
}