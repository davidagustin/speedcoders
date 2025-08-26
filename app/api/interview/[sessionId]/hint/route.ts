import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/next-auth';
import { interviewSimulator } from '@/lib/InterviewSimulator';

interface RouteParams {
  params: Promise<{
    sessionId: string;
  }>;
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  const { sessionId } = await params;
  
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { problemIndex, hintIndex } = await request.json();

    if (!sessionId || typeof problemIndex !== 'number' || typeof hintIndex !== 'number') {
      return NextResponse.json(
        { error: 'Missing required fields: sessionId, problemIndex, and hintIndex' },
        { status: 400 }
      );
    }

    // Get the hint
    const hint = await interviewSimulator.getHint(sessionId, problemIndex, hintIndex);

    return NextResponse.json({
      success: true,
      hint: {
        id: hint.id,
        content: hint.content,
        type: hint.type,
        penalty: hint.penalty
      },
      message: `Hint provided (${hint.penalty} point penalty)`
    });

  } catch (error) {
    console.error('Error getting hint:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to get hint' },
      { status: 400 }
    );
  }
}