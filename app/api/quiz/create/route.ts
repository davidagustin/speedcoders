import { NextRequest, NextResponse } from 'next/server'
import { quizManager } from '@/lib/QuizManager'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, description, questions, timeLimit, difficulty, categories, isPublic } = body

    // Validate required fields
    if (!title || !description || !questions || !Array.isArray(questions)) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Validate questions
    for (const question of questions) {
      if (!question.questionText || !question.options || question.options.length !== 4) {
        return NextResponse.json(
          { error: 'Each question must have text and exactly 4 options' },
          { status: 400 }
        )
      }
      
      if (!question.correctAnswers || question.correctAnswers.length === 0) {
        return NextResponse.json(
          { error: 'Each question must have at least one correct answer' },
          { status: 400 }
        )
      }
    }

    // Get user ID from session/auth header
    const userId = request.headers.get('x-user-id') || 'anonymous'

    const quiz = await quizManager.createQuiz({
      title,
      description,
      createdBy: userId,
      questions,
      timeLimit: timeLimit || 30,
      difficulty: difficulty || 'Easy',
      categories: categories || [],
      isPublic: isPublic !== false
    })

    return NextResponse.json({ 
      success: true, 
      quiz,
      message: 'Quiz created successfully' 
    })

  } catch (error) {
    console.error('Quiz creation error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to create quiz',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}