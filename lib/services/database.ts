// Centralized database service layer

import { prisma } from '@/app/lib/prisma'
import { createClient } from '@/utils/supabase/server'
import { Problem, Quiz, QuizSession, UserProgress } from '@/types'

export class DatabaseService {
  // Problem operations
  static async getProblems(filters?: {
    difficulty?: string
    category?: string
    limit?: number
  }): Promise<Problem[]> {
    return prisma.problem.findMany({
      where: {
        ...(filters?.difficulty && { difficulty: filters.difficulty }),
        ...(filters?.category && { 
          algorithms: {
            has: filters.category
          }
        }),
      },
      take: filters?.limit,
      orderBy: { title: 'asc' },
    })
  }

  static async getProblemBySlug(slug: string): Promise<Problem | null> {
    return prisma.problem.findUnique({
      where: { slug },
    })
  }

  static async upsertProblem(problem: Partial<Problem>): Promise<Problem> {
    return prisma.problem.upsert({
      where: { title: problem.title || '' },
      update: {
        description: problem.description,
        difficulty: problem.difficulty,
        algorithms: problem.algorithms,
      },
      create: {
        title: problem.title!,
        slug: problem.slug || problem.title!.toLowerCase().replace(/\s+/g, '-'),
        difficulty: problem.difficulty!,
        description: problem.description || '',
        algorithms: problem.algorithms || [],
        url: problem.url || '',
      },
    })
  }

  // Quiz operations
  static async createQuiz(quiz: Partial<Quiz>): Promise<Quiz> {
    return prisma.quiz.create({
      data: {
        title: quiz.title!,
        description: quiz.description,
        difficulty: quiz.difficulty || 'Mixed',
        timeLimit: quiz.timeLimit || 15,
        problemCount: quiz.problemCount || 10,
        category: quiz.category,
        isActive: true,
      },
    })
  }

  static async getQuizById(id: string): Promise<Quiz | null> {
    return prisma.quiz.findUnique({
      where: { id },
      include: {
        questions: {
          include: {
            problem: true,
          },
        },
      },
    })
  }

  static async getActiveQuizzes(): Promise<Quiz[]> {
    return prisma.quiz.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
      take: 10,
    })
  }

  // User progress operations
  static async getUserProgress(userId: string): Promise<UserProgress | null> {
    const supabase = await createClient()
    
    const attempts = await prisma.quizAttempt.findMany({
      where: { userId },
      include: {
        quiz: true,
      },
      orderBy: { startedAt: 'desc' },
    })

    if (attempts.length === 0) {
      return {
        userId,
        problemsSolved: 0,
        totalAttempts: 0,
        averageScore: 0,
        favoriteCategories: [],
        skillLevel: 'Beginner',
      }
    }

    const problemsSolved = new Set(attempts.map(a => a.quizId)).size
    const totalAttempts = attempts.length
    const averageScore = attempts.reduce((sum, a) => sum + (a.score || 0), 0) / totalAttempts
    
    // Calculate favorite categories
    const categoryCount: Record<string, number> = {}
    attempts.forEach(attempt => {
      if (attempt.quiz?.category) {
        categoryCount[attempt.quiz.category] = (categoryCount[attempt.quiz.category] || 0) + 1
      }
    })
    const favoriteCategories = Object.entries(categoryCount)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([cat]) => cat)

    // Determine skill level
    let skillLevel: 'Beginner' | 'Intermediate' | 'Advanced' = 'Beginner'
    if (averageScore >= 80 && problemsSolved >= 20) {
      skillLevel = 'Advanced'
    } else if (averageScore >= 60 && problemsSolved >= 10) {
      skillLevel = 'Intermediate'
    }

    return {
      userId,
      problemsSolved,
      totalAttempts,
      averageScore: Math.round(averageScore),
      favoriteCategories,
      skillLevel,
    }
  }

  // Quiz session operations
  static async createQuizSession(session: Partial<QuizSession>): Promise<QuizSession> {
    return prisma.quizAttempt.create({
      data: {
        quizId: session.quizId!,
        userId: session.userId!,
        startedAt: new Date(),
        score: 0,
        timeSpent: 0,
        completed: false,
      },
    })
  }

  static async updateQuizSession(
    id: string, 
    updates: Partial<QuizSession>
  ): Promise<QuizSession> {
    return prisma.quizAttempt.update({
      where: { id },
      data: {
        score: updates.score,
        timeSpent: updates.timeSpent,
        completed: updates.completed,
        completedAt: updates.completed ? new Date() : undefined,
      },
    })
  }

  // Leaderboard
  static async getLeaderboard(quizId?: string): Promise<any[]> {
    const where = quizId ? { quizId } : {}
    
    return prisma.quizAttempt.findMany({
      where: {
        ...where,
        completed: true,
      },
      orderBy: [
        { score: 'desc' },
        { timeSpent: 'asc' },
      ],
      take: 10,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
        quiz: {
          select: {
            title: true,
            difficulty: true,
          },
        },
      },
    })
  }
}