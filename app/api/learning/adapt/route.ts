import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/next-auth';
import { adaptiveLearningEngine } from '@/lib/AdaptiveLearningEngine';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { pathId, forceAdaptation } = await request.json();

    if (!pathId) {
      return NextResponse.json(
        { error: 'Path ID is required' },
        { status: 400 }
      );
    }

    // Adapt the learning path based on recent performance
    const adaptedPath = await adaptiveLearningEngine.adaptLearningPath(pathId);

    return NextResponse.json({
      success: true,
      adaptedPath,
      message: adaptedPath.adaptations.length > 0 
        ? `Applied ${adaptedPath.adaptations.length} adaptations to your learning path`
        : 'Your learning path is already optimized for your current performance'
    });

  } catch (error) {
    console.error('Error adapting learning path:', error);
    return NextResponse.json(
      { error: 'Failed to adapt learning path' },
      { status: 500 }
    );
  }
}