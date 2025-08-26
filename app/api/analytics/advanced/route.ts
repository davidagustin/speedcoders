import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/next-auth';
import { prisma } from '@/app/lib/prisma';

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const userId = session.user.email;
    const period = parseInt(searchParams.get('period') || '30'); // days

    // Calculate date range
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - period);

    // Get all quiz attempts for the user in the period
    const attempts = await prisma.quizAttempt.findMany({
      where: {
        userId,
        completedAt: {
          gte: startDate,
          lte: endDate
        }
      },
      include: {
        quiz: true
      },
      orderBy: {
        completedAt: 'asc'
      }
    });

    // Calculate advanced metrics
    const analytics = calculateAdvancedAnalytics(attempts, period);

    return NextResponse.json(analytics);

  } catch (error) {
    console.error('Advanced analytics error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch advanced analytics' },
      { status: 500 }
    );
  }
}

function calculateAdvancedAnalytics(attempts: any[], period: number) {
  const now = new Date();
  const totalAttempts = attempts.length;

  // Performance trends
  const performanceTrend = attempts.map((attempt, index) => ({
    date: attempt.completedAt,
    score: attempt.score,
    timeEfficiency: attempt.timeSpent > 0 ? (attempt.score / attempt.timeSpent) * 100 : 0,
    attempt: index + 1
  }));

  // Difficulty progression
  const difficultyStats = attempts.reduce((acc, attempt) => {
    const difficulty = attempt.quiz?.difficulty || 'Unknown';
    if (!acc[difficulty]) {
      acc[difficulty] = { count: 0, totalScore: 0, averageScore: 0 };
    }
    acc[difficulty].count++;
    acc[difficulty].totalScore += attempt.score;
    acc[difficulty].averageScore = acc[difficulty].totalScore / acc[difficulty].count;
    return acc;
  }, {} as Record<string, any>);

  // Time analysis
  const timeAnalysis = {
    averageTimePerQuiz: attempts.length > 0 ? 
      attempts.reduce((sum, a) => sum + a.timeSpent, 0) / attempts.length : 0,
    fastestCompletion: attempts.length > 0 ? 
      Math.min(...attempts.map(a => a.timeSpent)) : 0,
    longestSession: attempts.length > 0 ? 
      Math.max(...attempts.map(a => a.timeSpent)) : 0,
    optimalTimeRange: calculateOptimalTimeRange(attempts)
  };

  // Consistency metrics
  const scores = attempts.map(a => a.score);
  const consistency = {
    scoreVariance: calculateVariance(scores),
    improvementTrend: calculateImprovementTrend(performanceTrend),
    streakAnalysis: calculateStreakAnalysis(attempts)
  };

  // Learning velocity
  const learningVelocity = {
    weeklyProgress: calculateWeeklyProgress(attempts),
    skillGrowthRate: calculateSkillGrowthRate(performanceTrend),
    masteryLevel: calculateMasteryLevel(difficultyStats)
  };

  // Predictive insights
  const predictions = {
    nextWeekScore: predictNextScore(performanceTrend),
    readinessForHarder: assessDifficultyReadiness(difficultyStats),
    burnoutRisk: assessBurnoutRisk(attempts),
    recommendedStudyTime: calculateRecommendedStudyTime(timeAnalysis, consistency)
  };

  return {
    summary: {
      totalAttempts,
      period,
      averageScore: scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0,
      bestScore: scores.length > 0 ? Math.max(...scores) : 0,
      improvementRate: consistency.improvementTrend
    },
    performanceTrend,
    difficultyStats,
    timeAnalysis,
    consistency,
    learningVelocity,
    predictions,
    insights: generateInsights(attempts, consistency, learningVelocity, predictions)
  };
}

function calculateVariance(scores: number[]): number {
  if (scores.length === 0) return 0;
  const mean = scores.reduce((a, b) => a + b, 0) / scores.length;
  return scores.reduce((sum, score) => sum + Math.pow(score - mean, 2), 0) / scores.length;
}

function calculateImprovementTrend(trend: any[]): number {
  if (trend.length < 2) return 0;
  const first = trend.slice(0, Math.ceil(trend.length / 3));
  const last = trend.slice(-Math.ceil(trend.length / 3));
  
  const firstAvg = first.reduce((sum, t) => sum + t.score, 0) / first.length;
  const lastAvg = last.reduce((sum, t) => sum + t.score, 0) / last.length;
  
  return ((lastAvg - firstAvg) / firstAvg) * 100;
}

function calculateStreakAnalysis(attempts: any[]) {
  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 0;
  
  for (let i = 0; i < attempts.length; i++) {
    if (attempts[i].score >= 70) { // Consider 70+ as good performance
      tempStreak++;
      if (i === attempts.length - 1 || attempts[i + 1]?.score < 70) {
        longestStreak = Math.max(longestStreak, tempStreak);
        if (i === attempts.length - 1) currentStreak = tempStreak;
        tempStreak = 0;
      }
    } else {
      tempStreak = 0;
      if (i === attempts.length - 1) currentStreak = 0;
    }
  }
  
  return { currentStreak, longestStreak };
}

function calculateWeeklyProgress(attempts: any[]) {
  const weeks = Math.ceil(attempts.length / 7);
  const weeklyData = [];
  
  for (let i = 0; i < weeks; i++) {
    const weekAttempts = attempts.slice(i * 7, (i + 1) * 7);
    if (weekAttempts.length > 0) {
      weeklyData.push({
        week: i + 1,
        attempts: weekAttempts.length,
        averageScore: weekAttempts.reduce((sum, a) => sum + a.score, 0) / weekAttempts.length,
        totalTime: weekAttempts.reduce((sum, a) => sum + a.timeSpent, 0)
      });
    }
  }
  
  return weeklyData;
}

function calculateSkillGrowthRate(trend: any[]): number {
  if (trend.length < 3) return 0;
  
  // Calculate linear regression slope
  const n = trend.length;
  const sumX = trend.reduce((sum, _, i) => sum + i, 0);
  const sumY = trend.reduce((sum, t) => sum + t.score, 0);
  const sumXY = trend.reduce((sum, t, i) => sum + i * t.score, 0);
  const sumXX = trend.reduce((sum, _, i) => sum + i * i, 0);
  
  return (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
}

function calculateMasteryLevel(difficultyStats: Record<string, any>): string {
  const easyMastery = (difficultyStats.Easy?.averageScore || 0) >= 80;
  const mediumMastery = (difficultyStats.Medium?.averageScore || 0) >= 70;
  const hardMastery = (difficultyStats.Hard?.averageScore || 0) >= 60;
  
  if (hardMastery) return 'Expert';
  if (mediumMastery) return 'Advanced';
  if (easyMastery) return 'Intermediate';
  return 'Beginner';
}

function calculateOptimalTimeRange(attempts: any[]) {
  const goodAttempts = attempts.filter(a => a.score >= 75);
  if (goodAttempts.length === 0) return { min: 0, max: 0 };
  
  const times = goodAttempts.map(a => a.timeSpent);
  return {
    min: Math.min(...times),
    max: Math.max(...times),
    average: times.reduce((a, b) => a + b, 0) / times.length
  };
}

function predictNextScore(trend: any[]): number {
  if (trend.length < 3) return trend[trend.length - 1]?.score || 0;
  
  const recent = trend.slice(-5); // Last 5 attempts
  const weights = [0.1, 0.15, 0.2, 0.25, 0.3]; // More weight to recent
  
  return recent.reduce((sum, t, i) => sum + t.score * weights[i], 0);
}

function assessDifficultyReadiness(difficultyStats: Record<string, any>): string {
  const easyScore = difficultyStats.Easy?.averageScore || 0;
  const mediumScore = difficultyStats.Medium?.averageScore || 0;
  
  if (easyScore >= 85 && mediumScore < 70) return 'Ready for Medium';
  if (mediumScore >= 80) return 'Ready for Hard';
  return 'Continue Current Level';
}

function assessBurnoutRisk(attempts: any[]): string {
  if (attempts.length === 0) return 'Low';
  
  const recentAttempts = attempts.slice(-7); // Last 7 attempts
  if (recentAttempts.length < 3) return 'Low';
  
  const scoreDecline = recentAttempts.every((attempt, i) => 
    i === 0 || attempt.score <= recentAttempts[i - 1].score
  );
  
  const highVolume = recentAttempts.length >= 5;
  
  if (scoreDecline && highVolume) return 'High';
  if (scoreDecline || highVolume) return 'Medium';
  return 'Low';
}

function calculateRecommendedStudyTime(timeAnalysis: any, consistency: any): number {
  const baseTime = timeAnalysis.averageTimePerQuiz || 30;
  const varianceFactor = consistency.scoreVariance > 100 ? 1.2 : 1.0;
  
  return Math.round(baseTime * varianceFactor);
}

function generateInsights(attempts: any[], consistency: any, learningVelocity: any, predictions: any) {
  const insights = [];
  
  if (consistency.improvementTrend > 10) {
    insights.push({
      type: 'positive',
      title: 'Strong Improvement',
      description: `You've improved by ${consistency.improvementTrend.toFixed(1)}% over time!`,
      action: 'Consider increasing difficulty level'
    });
  }
  
  if (predictions.burnoutRisk === 'High') {
    insights.push({
      type: 'warning',
      title: 'Burnout Risk Detected',
      description: 'Your recent performance shows signs of fatigue',
      action: 'Take a break and focus on review'
    });
  }
  
  if (learningVelocity.masteryLevel === 'Expert') {
    insights.push({
      type: 'achievement',
      title: 'Expert Level Achieved!',
      description: 'You have mastered multiple difficulty levels',
      action: 'Consider mentoring others or tackling system design'
    });
  }
  
  return insights;
}