import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Check if quizzes already exist
    const { data: existingQuizzes } = await supabase
      .from('quizzes')
      .select('title')
      .limit(1)
    
    if (existingQuizzes && existingQuizzes.length > 0) {
      return NextResponse.json({ 
        message: 'Quizzes already exist in database',
        count: existingQuizzes.length 
      })
    }

    // Get all problems and algorithms for quiz creation
    const { data: problems } = await supabase
      .from('problems')
      .select('id, title, difficulty, category')
      .order('difficulty')
      .order('title')

    const { data: algorithms } = await supabase
      .from('algorithms')
      .select('id, name, category')
      .order('name')

    if (!problems || !algorithms) {
      return NextResponse.json({ error: 'Failed to fetch problems or algorithms' }, { status: 500 })
    }

    // Create quizzes
    const quizzes = [
      {
        title: "Array Fundamentals",
        description: "Master basic array operations and common patterns",
        timeLimit: 15,
        difficulty: "Easy",
        category: "Array",
        createdBy: "system"
      },
      {
        title: "String Manipulation",
        description: "Learn string processing techniques and algorithms",
        timeLimit: 20,
        difficulty: "Medium",
        category: "String",
        createdBy: "system"
      },
      {
        title: "Linked List Basics",
        description: "Practice linked list operations and traversal",
        timeLimit: 18,
        difficulty: "Medium",
        category: "Linked List",
        createdBy: "system"
      },
      {
        title: "Advanced Array Problems",
        description: "Tackle complex array problems with multiple techniques",
        timeLimit: 25,
        difficulty: "Hard",
        category: "Array",
        createdBy: "system"
      },
      {
        title: "Data Structures Mix",
        description: "Mixed problems covering various data structures",
        timeLimit: 30,
        difficulty: "Mixed",
        category: null,
        createdBy: "system"
      },
      {
        title: "Algorithm Techniques",
        description: "Practice different algorithmic techniques",
        timeLimit: 22,
        difficulty: "Medium",
        category: null,
        createdBy: "system"
      }
    ]

    // Insert quizzes
    const { data: quizData, error: quizError } = await supabase
      .from('quizzes')
      .insert(quizzes)
      .select()

    if (quizError) {
      console.error('Error seeding quizzes:', quizError)
      return NextResponse.json({ error: quizError.message }, { status: 500 })
    }

    // Create quiz questions
    const quizQuestions = []

    // Array Fundamentals Quiz
    const arrayProblems = problems.filter(p => p.category === 'Array' && p.difficulty === 'Easy').slice(0, 3)
    arrayProblems.forEach((problem, index) => {
      quizQuestions.push({
        quizId: quizData[0].id,
        problemId: problem.id,
        order: index + 1
      })
    })

    // String Manipulation Quiz
    const stringProblems = problems.filter(p => p.category === 'String').slice(0, 3)
    stringProblems.forEach((problem, index) => {
      quizQuestions.push({
        quizId: quizData[1].id,
        problemId: problem.id,
        order: index + 1
      })
    })

    // Linked List Basics Quiz
    const linkedListProblems = problems.filter(p => p.category === 'Linked List').slice(0, 3)
    linkedListProblems.forEach((problem, index) => {
      quizQuestions.push({
        quizId: quizData[2].id,
        problemId: problem.id,
        order: index + 1
      })
    })

    // Advanced Array Problems Quiz
    const advancedArrayProblems = problems.filter(p => p.category === 'Array' && p.difficulty === 'Hard').slice(0, 3)
    advancedArrayProblems.forEach((problem, index) => {
      quizQuestions.push({
        quizId: quizData[3].id,
        problemId: problem.id,
        order: index + 1
      })
    })

    // Data Structures Mix Quiz
    const mixedProblems = problems.slice(0, 4)
    mixedProblems.forEach((problem, index) => {
      quizQuestions.push({
        quizId: quizData[4].id,
        problemId: problem.id,
        order: index + 1
      })
    })

    // Algorithm Techniques Quiz
    const techniqueProblems = problems.filter(p => ['Medium', 'Hard'].includes(p.difficulty)).slice(0, 4)
    techniqueProblems.forEach((problem, index) => {
      quizQuestions.push({
        quizId: quizData[5].id,
        problemId: problem.id,
        order: index + 1
      })
    })

    // Insert quiz questions
    const { error: questionError } = await supabase
      .from('quiz_questions')
      .insert(quizQuestions)

    if (questionError) {
      console.error('Error seeding quiz questions:', questionError)
      return NextResponse.json({ error: questionError.message }, { status: 500 })
    }

    return NextResponse.json({ 
      message: 'Quizzes and questions seeded successfully',
      quizzesCount: quizData.length,
      questionsCount: quizQuestions.length
    })
  } catch (error) {
    console.error('Error in seed quizzes route:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
