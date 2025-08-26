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
    
    if (!session?.user?.id) {
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

    if (quiz.userId !== session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    if (quiz.status !== 'completed') {
      return NextResponse.json({ error: 'Quiz not completed yet' }, { status: 400 });
    }

    const result = await prisma.quizResult.findFirst({
      where: {
        quizId: id,
        userId: session.user.id,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    if (!result) {
      return NextResponse.json({ error: 'Results not found' }, { status: 404 });
    }

    // Parse stored JSON data
    const problemResults = JSON.parse(result.problemResults as string);

    return NextResponse.json({
      quiz,
      results: {
        id: result.id,
        scorePercentage: result.score,
        correctAnswers: result.correctAnswers,
        totalQuestions: result.totalQuestions,
        timeSpent: result.timeSpent,
        accuracy: result.accuracy,
        problemResults,
        createdAt: result.createdAt,
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