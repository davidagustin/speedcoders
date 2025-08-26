import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);
    const timeRange = searchParams.get('timeRange') || 'week';

    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Calculate date range
    const now = new Date();
    let startDate = new Date();
    switch (timeRange) {
      case 'week':
        startDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(now.getMonth() - 1);
        break;
      case 'year':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        startDate.setDate(now.getDate() - 7);
    }

    // Fetch quiz attempts
    const { data: attempts, error: attemptsError } = await supabase
      .from('QuizAttempt')
      .select(`
        *,
        quiz:Quiz(title, difficulty, category)
      `)
      .eq('userId', user.id)
      .gte('startedAt', startDate.toISOString())
      .order('startedAt', { ascending: false });

    if (attemptsError) {
      console.error('Error fetching attempts:', attemptsError);
      return NextResponse.json({ error: 'Failed to fetch progress data' }, { status: 500 });
    }

    // Fetch all problems for statistics
    const { data: problems, error: problemsError } = await supabase
      .from('Problem')
      .select('difficulty, category');

    if (problemsError) {
      console.error('Error fetching problems:', problemsError);
      return NextResponse.json({ error: 'Failed to fetch problems data' }, { status: 500 });
    }

    // Calculate statistics
    const totalAttempts = attempts?.length || 0;
    const completedAttempts = attempts?.filter(a => a.completed).length || 0;
    const averageScore = completedAttempts > 0 
      ? Math.round(attempts?.filter(a => a.completed).reduce((sum, a) => sum + a.score, 0) / completedAttempts)
      : 0;
    const totalTimeSpent = attempts?.reduce((sum, a) => sum + a.timeSpent, 0) || 0;

    // Calculate difficulty breakdown
    const difficultyBreakdown = {
      easy: { solved: 0, total: problems?.filter(p => p.difficulty === 'Easy').length || 0 },
      medium: { solved: 0, total: problems?.filter(p => p.difficulty === 'Medium').length || 0 },
      hard: { solved: 0, total: problems?.filter(p => p.difficulty === 'Hard').length || 0 }
    };

    // Calculate category progress
    const categoryMap = new Map<string, { solved: number; total: number }>();
    problems?.forEach(problem => {
      const category = problem.category;
      if (!categoryMap.has(category)) {
        categoryMap.set(category, { solved: 0, total: 0 });
      }
      categoryMap.get(category)!.total++;
    });

    // Process recent activity
    const recentActivity = attempts?.slice(0, 10).map(attempt => ({
      id: attempt.id,
      quizTitle: attempt.quiz?.title || 'Unknown Quiz',
      score: attempt.score,
      timeSpent: attempt.timeSpent,
      completedAt: attempt.completedAt || attempt.startedAt,
      difficulty: attempt.quiz?.difficulty || 'Unknown'
    })) || [];

    // Calculate category progress
    const categoryProgress = Array.from(categoryMap.entries()).map(([category, data]) => ({
      category,
      solved: data.solved,
      total: data.total,
      percentage: data.total > 0 ? Math.round((data.solved / data.total) * 100) : 0
    })).sort((a, b) => b.percentage - a.percentage);

    // Mock data for demonstration (in real app, these would be calculated from actual data)
    const mockProgressData = {
      totalAttempts,
      completedAttempts,
      averageScore,
      totalTimeSpent,
      currentStreak: 5, // Mock data
      bestStreak: 12, // Mock data
      problemsSolved: completedAttempts, // Simplified
      accuracyRate: completedAttempts > 0 ? Math.round((completedAttempts / totalAttempts) * 100) : 0,
      recentActivity,
      difficultyBreakdown,
      categoryProgress
    };

    return NextResponse.json(mockProgressData);
  } catch (error) {
    console.error('Error in progress API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
