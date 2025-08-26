import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/next-auth';
import { prisma } from '@/app/lib/prisma';

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const quiz = await prisma.quiz.findUnique({
      where: {
        id: id,
      },
    });

    if (!quiz) {
      return NextResponse.json({ error: 'Quiz not found' }, { status: 404 });
    }

    if (quiz.createdBy !== session.user.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // For mock implementation, we'll skip the status check
    // if (quiz.status !== 'completed') {
    //   return NextResponse.json({ error: 'Quiz not completed yet' }, { status: 400 });
    // }

    const attempt = await prisma.quizAttempt.findFirst({
      where: {
        quizId: id,
        userId: session.user.email as string,
      },
      include: {
        answers: {
          include: {
            question: {
              include: {
                problem: true
              }
            }
          }
        }
      },
      orderBy: {
        startedAt: 'desc',
      },
    });

    if (!attempt) {
      return NextResponse.json({ error: 'Results not found' }, { status: 404 });
    }

    // Calculate results from attempt data
    const totalQuestions = attempt.answers.length;
    const correctAnswers = attempt.answers.filter(a => a.isCorrect).length;
    const accuracy = totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0;

    return NextResponse.json({
      quiz,
      results: {
        id: attempt.id,
        scorePercentage: attempt.score,
        correctAnswers,
        totalQuestions,
        timeSpent: attempt.timeSpent,
        accuracy,
        problemResults: attempt.answers.map(answer => ({
          problemId: answer.question.problemId,
          title: answer.question.problem.title,
          isCorrect: answer.isCorrect,
          selectedAlgorithms: JSON.parse(answer.selectedAlgorithms),
          timeSpent: answer.timeSpent
        })),
        createdAt: attempt.startedAt,
        completed: attempt.completed,
        completedAt: attempt.completedAt
      }
    });
  } catch (error) {
    console.error('Error fetching quiz results:', error);
    return NextResponse.json(
      { error: 'Failed to fetch results' },
      { status: 500 }
    );
  }
}