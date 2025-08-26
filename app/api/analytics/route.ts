import { NextResponse } from 'next/server';

// Mock data for analytics when database is not available
const mockAnalytics = {
  overview: {
    totalQuizzes: 45,
    completedQuizzes: 42,
    averageScore: 78.5,
    totalStudyTime: 3240, // minutes
    problemsSolved: 156,
    activeGoals: 3,
    completedGoals: 8,
    totalAchievements: 12
  },
  dailyActivity: {
    '2024-02-12': { quizzes: 3, studyTime: 120, problemsSolved: 5 },
    '2024-02-11': { quizzes: 2, studyTime: 90, problemsSolved: 3 },
    '2024-02-10': { quizzes: 4, studyTime: 180, problemsSolved: 7 },
    '2024-02-09': { quizzes: 1, studyTime: 60, problemsSolved: 2 },
    '2024-02-08': { quizzes: 3, studyTime: 150, problemsSolved: 6 },
    '2024-02-07': { quizzes: 2, studyTime: 100, problemsSolved: 4 },
    '2024-02-06': { quizzes: 5, studyTime: 200, problemsSolved: 8 }
  },
  categoryPerformance: {
    'Array': { total: 50, correct: 42 },
    'String': { total: 30, correct: 25 },
    'Tree': { total: 25, correct: 18 },
    'Dynamic Programming': { total: 20, correct: 12 },
    'Graph': { total: 15, correct: 10 }
  },
  streaks: {
    current: 7,
    longest: 15
  },
  recentActivity: {
    lastQuiz: '2024-02-12T10:30:00Z',
    lastStudySession: '2024-02-12T14:20:00Z',
    recentAchievements: [
      { name: 'First Steps', description: 'Complete your first quiz', earnedAt: '2024-02-10T09:15:00Z' },
      { name: 'Streak Master', description: 'Maintain a 7-day streak', earnedAt: '2024-02-08T16:45:00Z' },
      { name: 'Speed Demon', description: 'Complete 10 problems in one day', earnedAt: '2024-02-06T12:30:00Z' }
    ]
  }
};

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const period = searchParams.get('period') || '30'; // days

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }

    // For now, return mock data since database setup might not be complete
    // In a real implementation, you would query the database here
    
    // Simulate some processing delay
    await new Promise(resolve => setTimeout(resolve, 100));

    // Return mock analytics data
    return NextResponse.json(mockAnalytics);

  } catch (error) {
    console.error('Analytics API error:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch analytics',
      fallback: mockAnalytics
    }, { status: 500 });
  }
}
