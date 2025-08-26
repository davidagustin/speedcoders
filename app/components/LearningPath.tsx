'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { comprehensiveProblems } from '@/lib/data/comprehensive-problems'
import Link from 'next/link'

interface LearningPathProblem {
  title: string
  difficulty: string
  category: string
  description: string
  leetcodeUrl: string
  isCompleted: boolean
  isRecommended: boolean
}

export default function LearningPath() {
  const [learningPath, setLearningPath] = useState<LearningPathProblem[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const supabase = createClient()

  useEffect(() => {
    generateLearningPath()
  }, [selectedCategory])

  const generateLearningPath = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // Get user's completed problems
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

      const completedProblems = new Set<string>(
        attempts ? attempts.map((attempt: any) => attempt.problemTitle).filter(Boolean) : []
      );
      const userLevel = getUserLevel(attempts || []);
      const recommendedProblems = getRecommendedProblems(userLevel, selectedCategory, completedProblems as Set<string>)

      setLearningPath(recommendedProblems)
    } catch (error) {
      console.error('Error generating learning path:', error)
    } finally {
      setLoading(false)
    }
  }

  const getUserLevel = (attempts: any[]): 'beginner' | 'intermediate' | 'advanced' => {
    if (attempts.length === 0) return 'beginner'
    
    const averageScore = attempts.reduce((sum, attempt) => sum + attempt.score, 0) / attempts.length
    const totalProblems = attempts.length

    if (totalProblems < 5 || averageScore < 60) return 'beginner'
    if (totalProblems < 20 || averageScore < 80) return 'intermediate'
    return 'advanced'
  }

  const getRecommendedProblems = (
    userLevel: string, 
    category: string, 
    completedProblems: Set<string>
  ): LearningPathProblem[] => {
    let filteredProblems = comprehensiveProblems

    // Filter by category if specified
    if (category !== 'all') {
      filteredProblems = filteredProblems.filter(problem => 
        problem.algorithms.includes(category)
      )
    }

    // Filter by user level
    const difficultyOrder = userLevel === 'beginner' 
      ? ['Easy', 'Medium', 'Hard']
      : userLevel === 'intermediate'
      ? ['Medium', 'Easy', 'Hard']
      : ['Hard', 'Medium', 'Easy']

    // Sort problems by difficulty order and add metadata
    const problemsWithMetadata = filteredProblems
      .filter(problem => !completedProblems.has(problem.title))
      .map(problem => ({
        ...problem,
        isCompleted: completedProblems.has(problem.title),
        isRecommended: false
      }))
      .sort((a, b) => {
        const aIndex = difficultyOrder.indexOf(a.difficulty)
        const bIndex = difficultyOrder.indexOf(b.difficulty)
        return aIndex - bIndex
      })

    // Mark first few problems as recommended
    const recommendedProblems = problemsWithMetadata.slice(0, 10).map((problem, index) => ({
      ...problem,
      isRecommended: index < 3
    }))

    return recommendedProblems
  }

  const categories = [
    { id: 'all', name: 'All Categories' },
    { id: 'Array', name: 'Array' },
    { id: 'String', name: 'String' },
    { id: 'Hash Table', name: 'Hash Table' },
    { id: 'Dynamic Programming', name: 'Dynamic Programming' },
    { id: 'Tree', name: 'Tree' },
    { id: 'Graph', name: 'Graph' },
    { id: 'Two Pointers', name: 'Two Pointers' },
    { id: 'Binary Search', name: 'Binary Search' },
    { id: 'Stack', name: 'Stack' },
    { id: 'Linked List', name: 'Linked List' }
  ]

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            <div className="h-4 bg-gray-200 rounded w-4/6"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Your Learning Path</h2>
      
      {/* Category Filter */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Filter by Category
        </label>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {categories.map(category => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      {/* Learning Path */}
      <div className="space-y-4">
        {learningPath.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-gray-500 mb-2">🎉</div>
            <p className="text-gray-600">Great job! You've completed all problems in this category.</p>
            <p className="text-sm text-gray-500 mt-1">Try a different category or increase the difficulty.</p>
          </div>
        ) : (
          learningPath.map((problem, index) => (
            <div
              key={problem.title}
              className={`p-4 border rounded-lg ${
                problem.isRecommended 
                  ? 'border-blue-300 bg-blue-50' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="font-medium text-gray-900">{problem.title}</h3>
                    {problem.isRecommended && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        Recommended
                      </span>
                    )}
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      problem.difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
                      problem.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {problem.difficulty}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{problem.description}</p>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-gray-500">{problem.category}</span>
                    <span className="text-xs text-gray-400">•</span>
                    <span className="text-xs text-gray-500">Step {index + 1}</span>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <a
                    href={problem.leetcodeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-500 text-sm"
                  >
                    View →
                  </a>
                  <button
                    onClick={() => {
                      // Create a quiz with this specific problem
                      createQuizWithProblem(problem.title)
                    }}
                    className="text-green-600 hover:text-green-500 text-sm"
                  >
                    Practice
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Progress Indicator */}
      {learningPath.length > 0 && (
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>Learning Progress</span>
            <span>{learningPath.filter(p => p.isCompleted).length} / {learningPath.length} completed</span>
          </div>
          <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
              style={{ 
                width: `${learningPath.length > 0 ? (learningPath.filter(p => p.isCompleted).length / learningPath.length) * 100 : 0}%` 
              }}
            ></div>
          </div>
        </div>
      )}
    </div>
  )

  async function createQuizWithProblem(problemTitle: string) {
    try {
      const response = await fetch('/api/quiz/start', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: 'current-user',
          problemCount: 1,
          difficulty: 'Mixed',
          category: null,
          specificProblem: problemTitle
        }),
      })

      if (response.ok) {
        const data = await response.json()
        window.location.href = `/quiz/${data.attempt.quiz.id}`
      }
    } catch (error) {
      console.error('Error creating quiz:', error)
    }
  }
}
