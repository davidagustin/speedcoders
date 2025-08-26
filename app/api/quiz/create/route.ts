import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/next-auth';
import { prisma } from '@/app/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { problemIds, timeLimit } = await request.json();

    if (!problemIds || !Array.isArray(problemIds) || problemIds.length === 0) {
      return NextResponse.json({ error: 'Problem IDs are required' }, { status: 400 });
    }

    if (!timeLimit || typeof timeLimit !== 'number') {
      return NextResponse.json({ error: 'Valid time limit is required' }, { status: 400 });
    }

    const quiz = await prisma.quiz.create({
      data: {
        userId: session.user.id,
        problemIds: problemIds,
        timeLimit: timeLimit,
        status: 'active',
        startedAt: new Date(),
      },
    });

    return NextResponse.json(quiz);
  } catch (error) {
    console.error('Error creating quiz:', error);
    return NextResponse.json(
      { error: 'Failed to create quiz' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const quizzes = await prisma.quiz.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 10,
    });

    return NextResponse.json({ quizzes });
  } catch (error) {
    console.error('Error fetching quizzes:', error);
    return NextResponse.json(
      { error: 'Failed to fetch quizzes' },
      { status: 500 }
    );
  }
}