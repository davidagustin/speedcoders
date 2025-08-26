import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { redis } from '@/utils/redis';

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const period = searchParams.get('period') || '30'; // days

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }

    // Build cache key
    const cacheKey = `analytics:${userId}:${period}`;
    
    // Try to get from cache first
    const cached = await redis.get(cacheKey);
    if (cached) {
      return NextResponse.json(JSON.parse(cached));
    }

    // Get user's quiz attempts
    const { data: quizAttempts, error: attemptsError } = await supabase
      .from('quiz_attempts')
      .select('*')
      .eq('userId', userId)
      .gte('createdAt', new Date(Date.now() - parseInt(period) * 24 * 60 * 60 * 1000).toISOString());

    if (attemptsError) throw attemptsError;

    // Get user's study sessions
    const { data: studySessions, error: sessionsError } = await supabase
      .from('study_sessions')
      .select('*')
      .eq('userId', userId)
      .gte('startTime', new Date(Date.now() - parseInt(period) * 24 * 60 * 60 * 1000).toISOString());

    if (sessionsError) throw sessionsError;

    // Get user's study goals
    const { data: studyGoals, error: goalsError } = await supabase
      .from('study_goals')
      .select('*')
      .eq('userId', userId);

    if (goalsError) throw goalsError;

    // Get user's achievements
    const { data: achievements, error: achievementsError } = await supabase
      .from('achievements')
      .select('*')
      .eq('userId', userId);

    if (achievementsError) throw achievementsError;

    // Calculate statistics
    const totalQuizzes = quizAttempts?.length || 0;
    const completedQuizzes = quizAttempts?.filter(a => a.completed).length || 0;
    const averageScore = quizAttempts?.length > 0 
      ? quizAttempts.reduce((sum, a) => sum + (a.score / a.maxScore * 100), 0) / quizAttempts.length 
      : 0;
    const totalStudyTime = studySessions?.reduce((sum, s) => sum + (s.duration || 0), 0) || 0;
    const problemsSolved = studySessions?.reduce((sum, s) => sum + (s.problemsSolved || 0), 0) || 0;
    const activeGoals = studyGoals?.filter(g => !g.isCompleted).length || 0;
    const completedGoals = studyGoals?.filter(g => g.isCompleted).length || 0;
    const totalAchievements = achievements?.length || 0;

    // Calculate daily activity
    const dailyActivity = {};
    const now = new Date();
    for (let i = 0; i < parseInt(period); i++) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const dateStr = date.toISOString().split('T')[0];
      dailyActivity[dateStr] = {
        quizzes: 0,
        studyTime: 0,
        problemsSolved: 0
      };
    }

    // Populate daily activity
    quizAttempts?.forEach(attempt => {
      const dateStr = new Date(attempt.createdAt).toISOString().split('T')[0];
      if (dailyActivity[dateStr]) {
        dailyActivity[dateStr].quizzes++;
      }
    });

    studySessions?.forEach(session => {
      const dateStr = new Date(session.startTime).toISOString().split('T')[0];
      if (dailyActivity[dateStr]) {
        dailyActivity[dateStr].studyTime += session.duration || 0;
        dailyActivity[dateStr].problemsSolved += session.problemsSolved || 0;
      }
    });

    // Calculate category performance
    const categoryPerformance = {};
    quizAttempts?.forEach(attempt => {
      // This would need to be enhanced with actual category data from quiz questions
      // For now, using a simplified approach
      if (!categoryPerformance['Overall']) {
        categoryPerformance['Overall'] = { total: 0, correct: 0 };
      }
      categoryPerformance['Overall'].total += attempt.maxScore;
      categoryPerformance['Overall'].correct += attempt.score;
    });

    // Calculate streaks
    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;
    
    const sortedDates = Object.keys(dailyActivity).sort();
    for (const date of sortedDates) {
      if (dailyActivity[date].quizzes > 0 || dailyActivity[date].studyTime > 0) {
        tempStreak++;
        longestStreak = Math.max(longestStreak, tempStreak);
      } else {
        if (tempStreak > 0) {
          currentStreak = tempStreak;
        }
        tempStreak = 0;
      }
    }
    if (tempStreak > 0) {
      currentStreak = tempStreak;
    }

    const analytics = {
      overview: {
        totalQuizzes,
        completedQuizzes,
        averageScore: Math.round(averageScore * 100) / 100,
        totalStudyTime,
        problemsSolved,
        activeGoals,
        completedGoals,
        totalAchievements
      },
      dailyActivity,
      categoryPerformance,
      streaks: {
        current: currentStreak,
        longest: longestStreak
      },
      recentActivity: {
        lastQuiz: quizAttempts?.[0]?.createdAt,
        lastStudySession: studySessions?.[0]?.startTime,
        recentAchievements: achievements?.slice(0, 5)
      }
    };

    // Cache the result for 10 minutes
    await redis.setex(cacheKey, 600, JSON.stringify(analytics));

    return NextResponse.json(analytics);

  } catch (error) {
    console.error('Analytics API error:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch analytics' 
    }, { status: 500 });
  }
}
