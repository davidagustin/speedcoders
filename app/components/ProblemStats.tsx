'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'

interface ProblemStats {
  totalProblems: number
  easyProblems: number
  mediumProblems: number
  hardProblems: number
  completedProblems: number
  averageScore: number
  favoriteCategories: string[]
  recentActivity: Array<{
    problemTitle: string
    score: number
    date: string
  }>
}

export default function ProblemStats() {
  const [stats, setStats] = useState<ProblemStats | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // Get user's quiz attempts
      const { data: attempts } = await supabase
        .from('quiz_attempts')
        .select(`
          *,
          quiz:quizzes(
            questions:quiz_questions(
              problem:problems(title, difficulty, category)
            )
          )
        `)
        .eq('user_id', user.id)
        .eq('completed', true)

      if (attempts) {
        const totalProblems = attempts.reduce((sum, attempt) => {
          return sum + (attempt.quiz?.questions?.length || 0)
        }, 0)

        const completedProblems = attempts.length
        const averageScore = attempts.length > 0 
          ? Math.round(attempts.reduce((sum, attempt) => sum + attempt.score, 0) / attempts.length)
          : 0

        // Calculate difficulty breakdown
        const difficultyCounts = { Easy: 0, Medium: 0, Hard: 0 }
        attempts.forEach(attempt => {
          attempt.quiz?.questions?.forEach((question: any) => {
            const difficulty = question.problem?.difficulty
            if (difficulty) {
              difficultyCounts[difficulty as keyof typeof difficultyCounts]++
            }
          })
        })

        // Get recent activity
        const recentActivity = attempts
          .slice(0, 5)
          .map(attempt => ({
            problemTitle: attempt.quiz?.questions?.[0]?.problem?.title || 'Unknown',
            score: attempt.score,
            date: new Date(attempt.completed_at || attempt.started_at).toLocaleDateString()
          }))

        // Get favorite categories
        const categoryCounts: { [key: string]: number } = {}
        attempts.forEach(attempt => {
          attempt.quiz?.questions?.forEach((question: any) => {
            const category = question.problem?.category
            if (category) {
              categoryCounts[category] = (categoryCounts[category] || 0) + 1
            }
          })
        })

        const favoriteCategories = Object.entries(categoryCounts)
          .sort(([,a], [,b]) => b - a)
          .slice(0, 5)
          .map(([category]) => category)

        setStats({
          totalProblems,
          easyProblems: difficultyCounts.Easy,
          mediumProblems: difficultyCounts.Medium,
          hardProblems: difficultyCounts.Hard,
          completedProblems,
          averageScore,
          favoriteCategories,
          recentActivity
        })
      }
    } catch (error) {
      console.error('Error loading stats:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            <div className="h-4 bg-gray-200 rounded w-4/6"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Problem Statistics</h2>
        <p className="text-gray-600">No data available. Start solving problems to see your statistics!</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Your Problem Statistics</h2>
      
      {/* Overall Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">{stats.totalProblems}</div>
          <div className="text-sm text-gray-600">Total Problems</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">{stats.completedProblems}</div>
          <div className="text-sm text-gray-600">Completed</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-600">{stats.averageScore}%</div>
          <div className="text-sm text-gray-600">Avg Score</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-orange-600">
            {stats.totalProblems > 0 ? Math.round((stats.completedProblems / stats.totalProblems) * 100) : 0}%
          </div>
          <div className="text-sm text-gray-600">Completion Rate</div>
        </div>
      </div>

      {/* Difficulty Breakdown */}
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-900 mb-3">Difficulty Breakdown</h3>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Easy</span>
            <div className="flex items-center space-x-2">
              <div className="w-24 bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full" 
                  style={{ width: `${stats.totalProblems > 0 ? (stats.easyProblems / stats.totalProblems) * 100 : 0}%` }}
                ></div>
              </div>
              <span className="text-sm font-medium text-gray-900">{stats.easyProblems}</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Medium</span>
            <div className="flex items-center space-x-2">
              <div className="w-24 bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-yellow-500 h-2 rounded-full" 
                  style={{ width: `${stats.totalProblems > 0 ? (stats.mediumProblems / stats.totalProblems) * 100 : 0}%` }}
                ></div>
              </div>
              <span className="text-sm font-medium text-gray-900">{stats.mediumProblems}</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Hard</span>
            <div className="flex items-center space-x-2">
              <div className="w-24 bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-red-500 h-2 rounded-full" 
                  style={{ width: `${stats.totalProblems > 0 ? (stats.hardProblems / stats.totalProblems) * 100 : 0}%` }}
                ></div>
              </div>
              <span className="text-sm font-medium text-gray-900">{stats.hardProblems}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Favorite Categories */}
      {stats.favoriteCategories.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-3">Favorite Categories</h3>
          <div className="flex flex-wrap gap-2">
            {stats.favoriteCategories.map((category, index) => (
              <span
                key={index}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
              >
                {category}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Recent Activity */}
      {stats.recentActivity.length > 0 && (
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-3">Recent Activity</h3>
          <div className="space-y-2">
            {stats.recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <div>
                  <div className="font-medium text-sm text-gray-900">{activity.problemTitle}</div>
                  <div className="text-xs text-gray-500">{activity.date}</div>
                </div>
                <div className="text-sm font-semibold text-gray-900">{activity.score}%</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
