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

    const { problemIndex, code, notes = '' } = await request.json();

    if (!sessionId || typeof problemIndex !== 'number' || !code) {
      return NextResponse.json(
        { error: 'Missing required fields: sessionId, problemIndex, and code' },
        { status: 400 }
      );
    }

    // Submit the problem solution
    const result = await interviewSimulator.submitProblemSolution(
      sessionId,
      problemIndex,
      code,
      notes
    );

    return NextResponse.json({
      success: result.success,
      feedback: result.feedback,
      score: result.score,
      message: 'Solution submitted successfully'
    });

  } catch (error) {
    console.error('Error submitting solution:', error);
    return NextResponse.json(
      { error: 'Failed to submit solution' },
      { status: 500 }
    );
  }
}