import { NextResponse } from 'next/server'
import { comprehensiveProblems } from '@/lib/data/comprehensive-problems'

interface QuizConfig {
  userId: string
  difficulty?: 'Easy' | 'Medium' | 'Hard' | 'Mixed'
  category?: string
  problemCount?: number
  timeLimit?: number
  specificProblems?: string[]
  includeHints?: boolean
  includeSolutions?: boolean
}

interface Quiz {
  id: string
  userId: string
  problems: any[]
  timeLimit: number
  startTime: string
  status: 'active' | 'completed' | 'abandoned'
}

export async function POST(request: Request) {
  try {
    const body: QuizConfig = await request.json()
    const { 
      userId, 
      difficulty = 'Mixed', 
      category, 
      problemCount = 10, 
      timeLimit = 30,
      specificProblems,
      includeHints = true,
      includeSolutions = true
    } = body

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    let selectedProblems = comprehensiveProblems

    // Filter by specific problems if provided
    if (specificProblems && specificProblems.length > 0) {
      selectedProblems = comprehensiveProblems.filter(p => 
        specificProblems.includes(p.title)
      )
    } else {
      // Filter by difficulty
      if (difficulty !== 'Mixed') {
        selectedProblems = selectedProblems.filter(p => p.difficulty === difficulty)
      }

      // Filter by category
      if (category) {
        selectedProblems = selectedProblems.filter(p => p.category === category || p.algorithms.includes(category))
      }
    }

    // Ensure we have enough problems
    if (selectedProblems.length === 0) {
      return NextResponse.json(
        { error: 'No problems found with the specified criteria' },
        { status: 404 }
      )
    }

    // Randomly select problems
    const shuffled = [...selectedProblems].sort(() => Math.random() - 0.5)
    const quizProblems = shuffled.slice(0, Math.min(problemCount, selectedProblems.length))

    // Create quiz object
    const quiz: Quiz = {
      id: `quiz_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId,
      problems: quizProblems.map(p => ({
        id: p.title.toLowerCase().replace(/\s+/g, '-'),
        title: p.title,
        difficulty: p.difficulty,
        category: p.category,
        description: p.description,
        examples: p.examples,
        constraints: p.constraints,
        solutions: includeSolutions ? p.solutions : [],
        hints: includeHints ? (p.hints || []) : [],
        keyInsights: p.keyInsights || [],
        leetcodeUrl: p.leetcodeUrl
      })),
      timeLimit: timeLimit * 60, // Convert to seconds
      startTime: new Date().toISOString(),
      status: 'active'
    }

    return NextResponse.json({
      success: true,
      quiz,
      stats: {
        totalProblems: quizProblems.length,
        difficultyBreakdown: {
          easy: quizProblems.filter(p => p.difficulty === 'Easy').length,
          medium: quizProblems.filter(p => p.difficulty === 'Medium').length,
          hard: quizProblems.filter(p => p.difficulty === 'Hard').length
        },
        categories: [...new Set(quizProblems.map(p => p.category))]
      }
    })

  } catch (error) {
    console.error('Error starting quiz:', error)
    return NextResponse.json(
      { error: 'Failed to start quiz' },
      { status: 500 }
    )
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const difficulty = searchParams.get('difficulty')
    const category = searchParams.get('category')

    // Get available quiz configurations
    const configurations = [
      {
        name: 'Quick Practice',
        difficulty: 'Easy' as const,
        problemCount: 5,
        timeLimit: 15,
        description: '5 easy problems, 15 minutes'
      },
      {
        name: 'Study Session',
        difficulty: 'Mixed' as const,
        problemCount: 10,
        timeLimit: 25,
        description: '10 mixed problems, 25 minutes'
      },
      {
        name: 'Challenge Mode',
        difficulty: 'Hard' as const,
        problemCount: 8,
        timeLimit: 40,
        description: '8 hard problems, 40 minutes'
      },
      {
        name: 'Category Focus',
        difficulty: 'Mixed' as const,
        problemCount: 12,
        timeLimit: 30,
        description: '12 problems from specific category'
      }
    ]

    // Get available difficulties and categories
    const difficulties = ['Easy', 'Medium', 'Hard', 'Mixed']
    const categories = [...new Set(comprehensiveProblems.map(p => p.category))].sort()

    // Get problem counts
    const problemCounts = {
      total: comprehensiveProblems.length,
      easy: comprehensiveProblems.filter(p => p.difficulty === 'Easy').length,
      medium: comprehensiveProblems.filter(p => p.difficulty === 'Medium').length,
      hard: comprehensiveProblems.filter(p => p.difficulty === 'Hard').length,
      byCategory: categories.reduce((acc, cat) => {
        acc[cat] = comprehensiveProblems.filter(p => p.category === cat).length
        return acc
      }, {} as Record<string, number>)
    }

    return NextResponse.json({
      success: true,
      data: {
        configurations,
        difficulties,
        categories,
        problemCounts
      }
    })

  } catch (error) {
    console.error('Error fetching quiz configurations:', error)
    return NextResponse.json(
      { error: 'Failed to fetch quiz configurations' },
      { status: 500 }
    )
  }
}
