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

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID is required' },
        { status: 400 }
      );
    }

    // Complete the interview session
    const completedSession = await interviewSimulator.completeInterview(sessionId);

    return NextResponse.json({
      success: true,
      session: {
        id: completedSession.id,
        status: completedSession.status,
        endTime: completedSession.endTime,
        score: completedSession.score,
        feedback: completedSession.feedback
      },
      message: 'Interview completed successfully'
    });

  } catch (error) {
    console.error('Error completing interview:', error);
    return NextResponse.json(
      { error: 'Failed to complete interview' },
      { status: 500 }
    );
  }
}