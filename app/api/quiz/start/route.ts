import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';
import { comprehensiveProblems } from '@/lib/data/comprehensive-problems';

export async function POST(request: Request) {
  try {
    const { userId, problemCount = 10, difficulty = 'Mixed', category = null, specificProblem = null, specificProblems = null } = await request.json();

    // Type the selectedProblems array properly
    let selectedProblems: typeof comprehensiveProblems = [];

    if (specificProblems && Array.isArray(specificProblems)) {
      // Use specific problems if provided
      selectedProblems = comprehensiveProblems.filter(p => 
        specificProblems.includes(p.title)
      );
    } else if (specificProblem) {
      // Use single specific problem if provided
      const problem = comprehensiveProblems.find(p => p.title === specificProblem);
      if (problem) {
        selectedProblems = [problem];
      }
    } else {
      // Filter problems based on criteria
      let filteredProblems = comprehensiveProblems;

      if (difficulty !== 'Mixed') {
        filteredProblems = filteredProblems.filter(p => p.difficulty === difficulty);
      }

      if (category) {
        filteredProblems = filteredProblems.filter(p => 
          p.algorithms.includes(category)
        );
      }

      // Shuffle and select problems
      const shuffled = filteredProblems.sort(() => Math.random() - 0.5);
      selectedProblems = shuffled.slice(0, Math.min(problemCount, shuffled.length));
    }

    if (selectedProblems.length === 0) {
      return NextResponse.json({ error: 'No problems found matching criteria' }, { status: 400 });
    }

    // Create or update problems in database
    for (const problem of selectedProblems) {
      await prisma.problem.upsert({
        where: { title: problem.title },
        update: {
          difficulty: problem.difficulty,
          category: problem.algorithms[0] || 'General',
          description: problem.description,
          solutions: JSON.stringify(problem.editorial),
          leetcodeUrl: problem.leetcodeUrl,
        },
        create: {
          title: problem.title,
          difficulty: problem.difficulty,
          category: problem.algorithms[0] || 'General',
          description: problem.description,
          examples: JSON.stringify([]),
          constraints: JSON.stringify([]),
          solutions: JSON.stringify(problem.editorial),
          leetcodeUrl: problem.leetcodeUrl,
        },
      });
    }

    // Create quiz
    const quiz = await prisma.quiz.create({
      data: {
        title: `Quiz - ${selectedProblems.length} problems`,
        description: `Quiz with ${selectedProblems.length} problems`,
        difficulty: difficulty,
        category: category,
        timeLimit: selectedProblems.length * 5 * 60, // 5 minutes per problem
        createdBy: userId,
        isActive: true,
      },
    });

    // Create quiz questions
    for (let i = 0; i < selectedProblems.length; i++) {
      await prisma.quizQuestion.create({
        data: {
          quizId: quiz.id,
          problemId: (await prisma.problem.findUnique({
            where: { title: selectedProblems[i].title }
          }))?.id || 1,
          order: i + 1,
        },
      });
    }

    // Create quiz attempt
    const attempt = await prisma.quizAttempt.create({
      data: {
        userId: userId,
        quizId: quiz.id,
        score: 0,
        timeSpent: 0,
        completed: false,
        startedAt: new Date(),
        completedAt: null,
      },
    });

    return NextResponse.json({
      success: true,
      attempt: {
        id: attempt.id,
        quiz: {
          id: quiz.id,
          title: quiz.title,
          problemCount: selectedProblems.length,
        },
      },
    });

  } catch (error) {
    console.error('Error creating quiz:', error);
    return NextResponse.json({ error: 'Failed to create quiz' }, { status: 500 });
  }
}