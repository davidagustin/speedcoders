import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';
import { comprehensiveProblems } from '@/lib/data/problems';

export async function POST(request: Request) {
  try {
    const { userId, problemCount = 10, difficulty = 'Mixed', category = null, specificProblem = null, specificProblems = null } = await request.json();

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }

    // Filter problems based on difficulty and category
    let filteredProblems = comprehensiveProblems;
    let selectedProblems = [];
    
    // Handle specific problems
    if (specificProblems && Array.isArray(specificProblems)) {
      selectedProblems = comprehensiveProblems.filter(problem => 
        specificProblems.includes(problem.title)
      );
    } else if (specificProblem) {
      const problem = comprehensiveProblems.find(p => p.title === specificProblem);
      if (problem) {
        selectedProblems = [problem];
      }
    } else {
      // Filter by difficulty and category
      if (difficulty !== 'Mixed') {
        filteredProblems = filteredProblems.filter(problem => problem.difficulty === difficulty);
      }
      
      if (category) {
        filteredProblems = filteredProblems.filter(problem => 
          problem.algorithms.includes(category)
        );
      }

      // Get random problems
      const shuffled = [...filteredProblems].sort(() => 0.5 - Math.random());
      selectedProblems = shuffled.slice(0, Math.min(problemCount, shuffled.length));
    }

    // Store problems in DB if not exists
    for (const problem of selectedProblems) {
      await prisma.problem.upsert({
        where: { title: problem.title },
        update: {
          description: problem.description,
          solutions: JSON.stringify(problem.editorial),
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

    // Create quiz with enhanced title
    const quizTitle = category 
      ? `${category} Practice Quiz - ${new Date().toLocaleDateString()}`
      : difficulty !== 'Mixed'
      ? `${difficulty} Level Quiz - ${new Date().toLocaleDateString()}`
      : `Mixed Difficulty Quiz - ${new Date().toLocaleDateString()}`;

    const quiz = await prisma.quiz.create({
      data: {
        title: quizTitle,
        description: `LeetCode Algorithm Quiz with ${selectedProblems.length} problems`,
        timeLimit: Math.max(15, selectedProblems.length * 2), // 2 minutes per problem minimum
        difficulty: difficulty,
        category: category,
        createdBy: userId,
      },
    });

    // Add questions to quiz
    for (let i = 0; i < selectedProblems.length; i++) {
      const problem = await prisma.problem.findFirst({
        where: { title: selectedProblems[i].title }
      });
      
      if (problem) {
        await prisma.quizQuestion.create({
          data: {
            quizId: quiz.id,
            problemId: problem.id,
            order: i + 1,
          },
        });
      }
    }

    // Create quiz attempt
    const attempt = await prisma.quizAttempt.create({
      data: {
        quizId: quiz.id,
        userId,
        score: 0,
        timeSpent: 0,
      },
      include: {
        quiz: {
          include: {
            questions: {
              include: {
                problem: true,
              },
              orderBy: {
                order: 'asc',
              },
            },
          },
        },
      },
    });

    return NextResponse.json({ attempt });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to start quiz' }, { status: 500 });
  }
}