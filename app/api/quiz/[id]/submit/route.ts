import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/next-auth';
import { prisma } from '@/app/lib/prisma';
import { problems as allProblems } from '@/lib/data/problems';

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { selectedAlgorithms, timeSpent } = await request.json();

    if (!selectedAlgorithms || typeof timeSpent !== 'number') {
      return NextResponse.json({ error: 'Invalid submission data' }, { status: 400 });
    }

    const quiz = await prisma.quiz.findUnique({
      where: {
        id: id,
      },
    });

    if (!quiz) {
      return NextResponse.json({ error: 'Quiz not found' }, { status: 404 });
    }

    if (quiz.userId !== session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    if (quiz.status !== 'active') {
      return NextResponse.json({ error: 'Quiz is not active' }, { status: 400 });
    }

    // Calculate score based on algorithm selection accuracy
    const problems = quiz.problemIds.map((id: string) => 
      allProblems.find(p => p.id === id)
    ).filter(Boolean);

    let correctAnswers = 0;
    const problemResults = [];

    for (let i = 0; i < problems.length; i++) {
      const problem = problems[i];
      const userAlgorithms = selectedAlgorithms[problem.id] || [];
      const correctAlgorithms = problem.algorithms || [];
      
      // Simple scoring: if at least 70% of selected algorithms are correct
      const correctSelections = userAlgorithms.filter((algo: string) => 
        correctAlgorithms.includes(algo)
      ).length;
      
      const totalUserSelections = userAlgorithms.length;
      const accuracy = totalUserSelections > 0 ? correctSelections / totalUserSelections : 0;
      const isCorrect = accuracy >= 0.7 && correctSelections > 0;
      
      if (isCorrect) {
        correctAnswers++;
      }

      problemResults.push({
        problemId: problem.id,
        selectedAlgorithms: userAlgorithms,
        correctAlgorithms: correctAlgorithms,
        isCorrect,
        accuracy,
        timeSpent: Math.floor(timeSpent / problems.length)
      });
    }

    const scorePercentage = Math.round((correctAnswers / problems.length) * 100);
    const overallAccuracy = problemResults.reduce((sum, result) => sum + result.accuracy, 0) / problemResults.length * 100;

    // Update quiz status
    const updatedQuiz = await prisma.quiz.update({
      where: {
        id: id,
      },
      data: {
        status: 'completed',
        completedAt: new Date(),
        score: scorePercentage,
        timeSpent,
      },
    });

    // Create quiz result record
    const result = await prisma.quizResult.create({
      data: {
        quizId: id,
        userId: session.user.id,
        score: scorePercentage,
        correctAnswers,
        totalQuestions: problems.length,
        timeSpent,
        accuracy: Math.round(overallAccuracy),
        problemResults: JSON.stringify(problemResults),
        selectedAlgorithms: JSON.stringify(selectedAlgorithms),
      },
    });

    return NextResponse.json({
      quiz: updatedQuiz,
      result: {
        id: result.id,
        scorePercentage,
        correctAnswers,
        totalQuestions: problems.length,
        timeSpent,
        accuracy: Math.round(overallAccuracy),
        problemResults,
      }
    });
  } catch (error) {
    console.error('Error submitting quiz:', error);
    return NextResponse.json(
      { error: 'Failed to submit quiz' },
      { status: 500 }
    );
  }
}