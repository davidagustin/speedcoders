import React, { useEffect, useState, useCallback, useMemo, memo } from "react";
import { useRouter } from "next/navigation";
import { User, QuizResult, DailyChallenge, AlgorithmMastery } from "@/types/quiz";
import { LoadingState, ErrorState } from "@/types/performance";
import { PerformanceMonitor } from "@/lib/PerformanceMonitor";

// Define prop types
interface DashboardProps {
  user: User;
}

// Statistics interface
interface UserStats {
  totalQuizzes: number;
  totalProblems: number;
  averageScore: number;
  bestScore: number;
  totalXP: number;
  streak: number;
  lastQuizDate: string | null;
  difficultyBreakdown: { Easy: number; Medium: number; Hard: number };
  algorithmMastery: AlgorithmMastery;
  weeklyProgress: Array<{
    date: string;
    count: number;
    avgScore: number;
  }>;
}

// Memoized components for performance
const MetricCard = memo<{
  icon: string;
  title: string;
  value: string | number;
  subtitle?: string;
  className?: string;
}>(({ icon, title, value, subtitle, className = "" }) => (
  <div className={`metric-card ${className}`}>
    <div className="metric-icon">{icon}</div>
    <div className="metric-content">
      <h3>{title}</h3>
      <p className="metric-value">{value}</p>
      {subtitle && <p className="metric-sub">{subtitle}</p>}
    </div>
  </div>
));

MetricCard.displayName = "MetricCard";

const ActionCard = memo<{
  icon: string;
  title: string;
  description: string;
  onClick: () => void;
  className?: string;
  badge?: string;
}>(({ icon, title, description, onClick, className = "", badge }) => (
  <div className={`action-card ${className}`} onClick={onClick}>
    <div className="action-icon">{icon}</div>
    <h3>{title}</h3>
    <p>{description}</p>
    {badge && <span className="action-badge">{badge}</span>}
  </div>
));

ActionCard.displayName = "ActionCard";

const WeeklyProgressChart = memo<{
  weeklyProgress: UserStats['weeklyProgress'];
}>(({ weeklyProgress }) => (
  <div className="chart-container">
    <h3>Weekly Activity</h3>
    <div className="activity-chart">
      {weeklyProgress.map((day, index) => (
        <div key={index} className="activity-day">
          <div
            className="activity-bar"
            style={{
              height: `${Math.max(day.count * 20, 5)}px`,
              backgroundColor: day.count > 0 ? "#4CAF50" : "#E0E0E0",
            }}
          />
          <span className="day-label">
            {new Date(day.date).toLocaleDateString("en-US", {
              weekday: "short",
            })}
          </span>
        </div>
      ))}
    </div>
  </div>
));

WeeklyProgressChart.displayName = "WeeklyProgressChart";

const DifficultyBreakdownChart = memo<{
  difficultyBreakdown: UserStats['difficultyBreakdown'];
}>(({ difficultyBreakdown }) => {
  const maxCount = useMemo(
    () => Math.max(...Object.values(difficultyBreakdown)),
    [difficultyBreakdown]
  );

  return (
    <div className="chart-container">
      <h3>Difficulty Distribution</h3>
      <div className="difficulty-chart">
        {Object.entries(difficultyBreakdown).map(([difficulty, count]) => (
          <div key={difficulty} className="difficulty-item">
            <span className={`difficulty-label ${difficulty.toLowerCase()}`}>
              {difficulty}
            </span>
            <div className="difficulty-bar-container">
              <div
                className={`difficulty-bar ${difficulty.toLowerCase()}`}
                style={{
                  width: `${Math.max((count / maxCount) * 100, 5)}%`,
                }}
              />
              <span className="difficulty-count">{count}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});

DifficultyBreakdownChart.displayName = "DifficultyBreakdownChart";

const AlgorithmMasteryPreview = memo<{
  algorithmMastery: AlgorithmMastery;
  onViewAll: () => void;
}>(({ algorithmMastery, onViewAll }) => {
  const topAlgorithms = useMemo(
    () =>
      Object.entries(algorithmMastery)
        .sort((a, b) => b[1].accuracy - a[1].accuracy)
        .slice(0, 5),
    [algorithmMastery]
  );

  return (
    <div className="algorithm-mastery-preview">
      <h3>🎯 Top Algorithm Mastery</h3>
      <div className="mastery-list">
        {topAlgorithms.map(([algorithm, stats]) => (
          <div key={algorithm} className="mastery-item">
            <div className="mastery-info">
              <span className="algorithm-name">{algorithm}</span>
              <span className="mastery-percentage">{stats.accuracy}%</span>
            </div>
            <div className="mastery-bar">
              <div
                className="mastery-fill"
                style={{ width: `${stats.accuracy}%` }}
              />
            </div>
            <span className="mastery-count">
              {stats.correct}/{stats.total}
            </span>
          </div>
        ))}
      </div>
      <button className="view-all-btn" onClick={onViewAll}>
        View All Algorithms →
      </button>
    </div>
  );
});

AlgorithmMasteryPreview.displayName = "AlgorithmMasteryPreview";

const Dashboard: React.FC<DashboardProps> = memo(({ user }) => {
  const router = useRouter();
  const [userStats, setUserStats] = useState<UserStats>({
    totalQuizzes: 0,
    totalProblems: 0,
    averageScore: 0,
    bestScore: 0,
    totalXP: 0,
    streak: 0,
    lastQuizDate: null,
    difficultyBreakdown: { Easy: 0, Medium: 0, Hard: 0 },
    algorithmMastery: {},
    weeklyProgress: [],
  });

  const [dailyChallenge, setDailyChallenge] = useState<DailyChallenge | null>(null);
  const [loadingState, setLoadingState] = useState<LoadingState>({ 
    isLoading: true, 
    loadingText: "Loading dashboard..." 
  });
  const [errorState, setErrorState] = useState<ErrorState>({ hasError: false });

  // Memoized calculations
  const userLevel = useMemo(() => Math.floor(userStats.totalXP / 1000) + 1, [userStats.totalXP]);
  const xpForNextLevel = useMemo(() => userLevel * 1000 - userStats.totalXP, [userLevel, userStats.totalXP]);
  const levelProgress = useMemo(() => ((userStats.totalXP % 1000) / 1000) * 100, [userStats.totalXP]);

  const calculateUserStats = useCallback((scores: QuizResult[]): UserStats => {
    const performanceMonitor = PerformanceMonitor.getInstance();
    performanceMonitor.markStart('calculateUserStats');

    try {
      const totalQuizzes = scores.length;
      const totalProblems = scores.reduce((acc, score) => acc + score.totalQuestions, 0);
      const averageScore = totalQuizzes > 0 
        ? scores.reduce((acc, score) => acc + score.percentage, 0) / totalQuizzes 
        : 0;
      const bestScore = totalQuizzes > 0 
        ? Math.max(...scores.map((s) => s.percentage)) 
        : 0;

      // Calculate XP (Experience Points)
      const totalXP = scores.reduce((acc, score) => {
        let xp = score.percentage * 10;
        if (score.difficulty === "Hard") xp *= 2;
        else if (score.difficulty === "Medium") xp *= 1.5;
        return acc + Math.round(xp);
      }, 0);

      // Calculate difficulty breakdown
      const difficultyBreakdown = scores.reduce(
        (acc, score) => {
          acc[score.difficulty as keyof typeof acc] = 
            (acc[score.difficulty as keyof typeof acc] || 0) + score.totalQuestions;
          return acc;
        },
        { Easy: 0, Medium: 0, Hard: 0 }
      );

      // Calculate algorithm mastery
      const algorithmMastery: AlgorithmMastery = {};
      scores.forEach((score) => {
        if (score.details) {
          score.details.forEach((detail) => {
            detail.correctAnswer.forEach((algo) => {
              if (!algorithmMastery[algo]) {
                algorithmMastery[algo] = { 
                  correct: 0, 
                  total: 0, 
                  accuracy: 0, 
                  attempts: [],
                  recentAccuracy: 0,
                  trend: 'stable'
                };
              }
              algorithmMastery[algo].total++;
              algorithmMastery[algo].attempts.push({
                date: score.date,
                correct: detail.isCorrect,
                difficulty: detail.difficulty,
              });
              if (detail.isCorrect) {
                algorithmMastery[algo].correct++;
              }
              algorithmMastery[algo].accuracy = Math.round(
                (algorithmMastery[algo].correct / algorithmMastery[algo].total) * 100
              );
              
              // Calculate recent trend
              const recentAttempts = algorithmMastery[algo].attempts.slice(-5);
              const recentCorrect = recentAttempts.filter((a) => a.correct).length;
              algorithmMastery[algo].recentAccuracy =
                recentAttempts.length > 0
                  ? Math.round((recentCorrect / recentAttempts.length) * 100)
                  : 0;
              algorithmMastery[algo].trend =
                algorithmMastery[algo].recentAccuracy > algorithmMastery[algo].accuracy
                  ? "improving"
                  : algorithmMastery[algo].recentAccuracy < algorithmMastery[algo].accuracy
                    ? "declining"
                    : "stable";
            });
          });
        }
      });

      // Calculate streak
      const sortedScores = scores.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      let streak = 0;
      let lastDate = new Date();

      for (const score of sortedScores) {
        const scoreDate = new Date(score.date);
        const daysDiff = Math.floor((lastDate.getTime() - scoreDate.getTime()) / (1000 * 60 * 60 * 24));

        if (daysDiff <= 1) {
          streak++;
          lastDate = scoreDate;
        } else {
          break;
        }
      }

      const result: UserStats = {
        totalQuizzes,
        totalProblems,
        averageScore: Math.round(averageScore * 10) / 10,
        bestScore,
        totalXP,
        streak,
        lastQuizDate: sortedScores[0]?.date || null,
        difficultyBreakdown,
        algorithmMastery,
        weeklyProgress: generateWeeklyProgress(scores),
      };

      performanceMonitor.markEnd('calculateUserStats');
      return result;
    } catch (error) {
      performanceMonitor.markEnd('calculateUserStats');
      throw error;
    }
  }, []);

  const generateWeeklyProgress = useCallback((scores: QuizResult[]) => {
    const lastWeek = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toDateString();
      const dayScores = scores.filter(
        (s) => new Date(s.date).toDateString() === dateStr
      );
      lastWeek.push({
        date: dateStr,
        count: dayScores.length,
        avgScore:
          dayScores.length > 0
            ? Math.round(
                dayScores.reduce((acc, s) => acc + s.percentage, 0) / dayScores.length
              )
            : 0,
      });
    }
    return lastWeek;
  }, []);

  const generateDailyChallenge = useCallback((): DailyChallenge => {
    const challenges: DailyChallenge[] = [
      {
        title: "Speed Demon",
        description: "Complete a Medium quiz in under 10 minutes",
        difficulty: "Medium",
        reward: "500 XP",
        icon: "⚡",
        type: "speed",
      },
      {
        title: "Perfectionist",
        description: "Score 100% on any quiz",
        difficulty: "Any",
        reward: "750 XP",
        icon: "💯",
        type: "accuracy",
      },
      {
        title: "Algorithm Explorer",
        description: "Practice 3 different algorithm categories today",
        difficulty: "Any",
        reward: "600 XP",
        icon: "🔍",
        type: "variety",
      },
    ];

    return challenges[Math.floor(Math.random() * challenges.length)];
  }, []);

  const startQuiz = useCallback((mode: string, options: Record<string, any> = {}) => {
    const params = new URLSearchParams({ mode, ...options });
    router.push(`/quiz?${params.toString()}`);
  }, [router]);

  const navigateToAlgorithms = useCallback(() => {
    router.push("/algorithms");
  }, [router]);

  useEffect(() => {
    const initializeDashboard = async () => {
      try {
        setLoadingState({ isLoading: true, loadingText: "Loading user data..." });

        const users = JSON.parse(localStorage.getItem("users") || "[]");
        const currentUser = users.find((u: User) => u.id === user.id);

        if (currentUser?.scores) {
          const stats = calculateUserStats(currentUser.scores);
          setUserStats(stats);
        }

        // Generate daily challenge
        const today = new Date().toDateString();
        const savedChallenge = localStorage.getItem(`dailyChallenge_${today}`);
        if (savedChallenge) {
          setDailyChallenge(JSON.parse(savedChallenge));
        } else {
          const challenge = generateDailyChallenge();
          setDailyChallenge(challenge);
          localStorage.setItem(`dailyChallenge_${today}`, JSON.stringify(challenge));
        }

        setLoadingState({ isLoading: false });
      } catch (error) {
        console.error("Error initializing dashboard:", error);
        setErrorState({ 
          hasError: true, 
          error: error instanceof Error ? error : new Error("Unknown error") 
        });
        setLoadingState({ isLoading: false });
      }
    };

    initializeDashboard();
  }, [user.id, calculateUserStats, generateDailyChallenge]);

  if (loadingState.isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner" />
        <p>{loadingState.loadingText}</p>
      </div>
    );
  }

  if (errorState.hasError) {
    return (
      <div className="error-container">
        <h2>Something went wrong</h2>
        <p>Failed to load dashboard data. Please try refreshing the page.</p>
        <button onClick={() => window.location.reload()}>Refresh</button>
      </div>
    );
  }

  return (
    <div className="enhanced-dashboard">
      {/* Header Stats */}
      <div className="dashboard-header">
        <div className="welcome-section">
          <h1>Welcome back, {user.username}! 👋</h1>
          <p className="subtitle">
            Ready to conquer more algorithms? You've solved {userStats.totalProblems} problems so far!
          </p>
        </div>

        <div className="level-progress">
          <div className="level-info">
            <span className="level-badge">Level {userLevel}</span>
            <span className="xp-text">{userStats.totalXP} XP</span>
          </div>
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${levelProgress}%` }}
            />
          </div>
          <span className="next-level">
            {xpForNextLevel} XP to Level {userLevel + 1}
          </span>
        </div>
      </div>

      {/* Daily Challenge */}
      {dailyChallenge && (
        <div className="daily-challenge">
          <div className="challenge-header">
            <h2>🎯 Daily Challenge</h2>
            <span className="challenge-reward">{dailyChallenge.reward}</span>
          </div>
          <div className="challenge-content">
            <div className="challenge-icon">{dailyChallenge.icon}</div>
            <div className="challenge-details">
              <h3>{dailyChallenge.title}</h3>
              <p>{dailyChallenge.description}</p>
              <span className="challenge-difficulty">{dailyChallenge.difficulty}</span>
            </div>
            <button
              className="challenge-btn"
              onClick={() => startQuiz("challenge", { challenge: dailyChallenge })}
            >
              Accept Challenge
            </button>
          </div>
        </div>
      )}

      {/* Key Metrics */}
      <div className="metrics-grid">
        <MetricCard
          icon="🔥"
          title="Current Streak"
          value={`${userStats.streak} days`}
          className="streak"
        />
        <MetricCard
          icon="🎯"
          title="Average Accuracy"
          value={`${userStats.averageScore}%`}
          className="accuracy"
        />
        <MetricCard
          icon="📝"
          title="Problems Solved"
          value={userStats.totalProblems}
          subtitle="of 3,662 total"
          className="problems"
        />
        <MetricCard
          icon="⭐"
          title="Best Score"
          value={`${userStats.bestScore}%`}
          className="best"
        />
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <h2>🚀 Quick Start</h2>
        <div className="action-grid">
          <ActionCard
            icon="🧠"
            title="Smart Quiz"
            description="AI-powered quiz based on your weak areas"
            onClick={() => startQuiz("smart")}
            className="featured"
            badge="Recommended"
          />
          <ActionCard
            icon="🏢"
            title="Company Focus"
            description="Practice problems from top tech companies"
            onClick={() => startQuiz("company", { company: "Google" })}
          />
          <ActionCard
            icon="🧮"
            title="Algorithm Deep Dive"
            description="Focus on specific algorithms"
            onClick={() => startQuiz("algorithm")}
          />
          <ActionCard
            icon="⏱️"
            title="Speed Challenge"
            description="Test your speed under pressure"
            onClick={() => startQuiz("timed")}
          />
          <ActionCard
            icon="🔥"
            title="Hard Problems"
            description="Challenge yourself with tough questions"
            onClick={() => startQuiz("difficulty", { difficulty: "Hard" })}
          />
          <ActionCard
            icon="🔄"
            title="Review Mistakes"
            description="Retry problems you got wrong"
            onClick={() => startQuiz("review")}
          />
        </div>
      </div>

      {/* Progress Analytics */}
      <div className="dashboard-analytics">
        <div className="analytics-section">
          <h2>📊 Your Progress</h2>
          <div className="progress-charts">
            <WeeklyProgressChart weeklyProgress={userStats.weeklyProgress} />
            <DifficultyBreakdownChart difficultyBreakdown={userStats.difficultyBreakdown} />
          </div>
        </div>

        <AlgorithmMasteryPreview
          algorithmMastery={userStats.algorithmMastery}
          onViewAll={navigateToAlgorithms}
        />
      </div>
    </div>
  );
});

Dashboard.displayName = "Dashboard";

export default Dashboard;