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

    const { message } = await request.json();

    if (!sessionId || !message) {
      return NextResponse.json(
        { error: 'Missing required fields: sessionId and message' },
        { status: 400 }
      );
    }

    // Get AI interviewer response
    const response = await interviewSimulator.simulateInterviewer(sessionId, message);

    return NextResponse.json({
      success: true,
      response,
      timestamp: Date.now()
    });

  } catch (error) {
    console.error('Error in interview chat:', error);
    return NextResponse.json(
      { error: 'Failed to get interviewer response' },
      { status: 500 }
    );
  }
}