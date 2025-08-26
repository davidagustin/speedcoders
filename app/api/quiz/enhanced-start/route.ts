import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { editorialProblems } from '@/app/lib/editorial-problems'

const prisma = new PrismaClient()

interface QuizConfig {
  difficulty?: 'Easy' | 'Medium' | 'Hard' | 'Mixed'
  category?: string
  problemCount?: number
  includeHints?: boolean
  includeSolutions?: boolean
  timeLimit?: number
  specificProblems?: string[]
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, config }: { userId: string; config: QuizConfig } = body

    let selectedProblems = editorialProblems

    // Filter by specific problems if provided
    if (config.specificProblems && config.specificProblems.length > 0) {
      selectedProblems = selectedProblems.filter(problem => 
        config.specificProblems!.includes(problem.title)
      )
    } else {
      // Filter by difficulty
      if (config.difficulty && config.difficulty !== 'Mixed') {
        selectedProblems = selectedProblems.filter(problem => 
          problem.difficulty === config.difficulty
        )
      }

      // Filter by category
      if (config.category) {
        selectedProblems = selectedProblems.filter(problem => 
          problem.category === config.category
        )
      }
    }

    // Shuffle and limit problems
    const shuffled = selectedProblems.sort(() => Math.random() - 0.5)
    const problemCount = config.problemCount || Math.min(10, shuffled.length)
    const finalProblems = shuffled.slice(0, problemCount)

    // Calculate time limit if not provided
    const timeLimit = config.timeLimit || Math.max(15, problemCount * 2)

    // Create quiz in database
    const quiz = await prisma.quiz.create({
      data: {
        userId,
        title: `Quiz - ${config.difficulty || 'Mixed'} ${config.category || 'All Categories'} (${problemCount} problems)`,
        difficulty: config.difficulty || 'Mixed',
        category: config.category || 'Mixed',
        timeLimit,
        totalQuestions: problemCount,
        includeHints: config.includeHints || false,
        includeSolutions: config.includeSolutions || false,
        status: 'in_progress',
        startedAt: new Date()
      }
    })

    // Upsert problems and create quiz questions
    const quizQuestions = []
    for (const problem of finalProblems) {
      const dbProblem = await prisma.problem.upsert({
        where: { title: problem.title },
        update: {},
        create: {
          title: problem.title,
          difficulty: problem.difficulty,
          category: problem.category,
          description: problem.description,
          examples: JSON.stringify(problem.examples),
          constraints: JSON.stringify(problem.constraints),
          solutions: JSON.stringify(problem.solutions),
          hints: JSON.stringify(problem.hints),
          keyInsights: JSON.stringify(problem.keyInsights),
          relatedProblems: JSON.stringify(problem.relatedProblems),
          leetcodeUrl: problem.leetcodeUrl
        }
      })

      const quizQuestion = await prisma.quizQuestion.create({
        data: {
          quizId: quiz.id,
          problemId: dbProblem.id,
          questionNumber: quizQuestions.length + 1,
          userAnswer: null,
          isCorrect: null,
          timeSpent: 0
        }
      })

      quizQuestions.push(quizQuestion)
    }

    return NextResponse.json({
      success: true,
      quiz: {
        id: quiz.id,
        title: quiz.title,
        difficulty: quiz.difficulty,
        category: quiz.category,
        timeLimit: quiz.timeLimit,
        totalQuestions: quiz.totalQuestions,
        includeHints: quiz.includeHints,
        includeSolutions: quiz.includeSolutions,
        problems: finalProblems.map((problem, index) => ({
          ...problem,
          questionNumber: index + 1
        }))
      }
    })
  } catch (error) {
    console.error('Error creating enhanced quiz:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create quiz' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    // Get available quiz configurations
    const difficulties = ['Easy', 'Medium', 'Hard', 'Mixed']
    const categories = Array.from(new Set(editorialProblems.map(p => p.category)))
    
    const quizTemplates = [
      {
        name: 'Beginner Friendly',
        config: {
          difficulty: 'Easy',
          problemCount: 8,
          timeLimit: 25,
          includeHints: true,
          includeSolutions: true
        }
      },
      {
        name: 'Balanced Practice',
        config: {
          difficulty: 'Mixed',
          problemCount: 12,
          timeLimit: 35,
          includeHints: true,
          includeSolutions: false
        }
      },
      {
        name: 'Advanced Challenge',
        config: {
          difficulty: 'Hard',
          problemCount: 10,
          timeLimit: 40,
          includeHints: false,
          includeSolutions: false
        }
      },
      {
        name: 'Speed Practice',
        config: {
          difficulty: 'Easy',
          problemCount: 15,
          timeLimit: 20,
          includeHints: false,
          includeSolutions: false
        }
      }
    ]

    return NextResponse.json({
      success: true,
      difficulties,
      categories,
      quizTemplates,
      totalProblems: editorialProblems.length,
      problemBreakdown: {
        easy: editorialProblems.filter(p => p.difficulty === 'Easy').length,
        medium: editorialProblems.filter(p => p.difficulty === 'Medium').length,
        hard: editorialProblems.filter(p => p.difficulty === 'Hard').length
      }
    })
  } catch (error) {
    console.error('Error getting quiz configurations:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to get configurations' },
      { status: 500 }
    )
  }
}
