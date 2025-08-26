import { useState, useEffect, useMemo } from 'react';
import { allLeetcodeProblems, topAlgorithms, algorithmCategories } from '../data/allProblems';

function Analytics({ user }) {
  const [timeRange, setTimeRange] = useState('month'); // week, month, all
  const [analytics, setAnalytics] = useState({
    totalStats: {},
    difficultyProgress: {},
    algorithmMastery: {},
    timeAnalysis: {},
    streakData: {},
    performanceTrends: [],
    weaknessAnalysis: {},
    strengthAnalysis: {},
    recommendations: []
  });

  useEffect(() => {
    calculateAnalytics();
  }, [user, timeRange]);

  const calculateAnalytics = () => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const currentUser = users.find(u => u.id === user.id);
    
    if (!currentUser?.scores || currentUser.scores.length === 0) {
      return;
    }

    const scores = filterScoresByTimeRange(currentUser.scores);
    
    const totalStats = calculateTotalStats(scores);
    const difficultyProgress = calculateDifficultyProgress(scores);
    const algorithmMastery = calculateAlgorithmMastery(scores);
    const timeAnalysis = calculateTimeAnalysis(scores);
    const streakData = calculateStreakData(currentUser.scores); // Use all scores for streak
    const performanceTrends = calculatePerformanceTrends(scores);
    const weaknessAnalysis = calculateWeaknessAnalysis(scores);
    const strengthAnalysis = calculateStrengthAnalysis(scores);
    const recommendations = generateRecommendations(weaknessAnalysis, strengthAnalysis, algorithmMastery);

    setAnalytics({
      totalStats,
      difficultyProgress,
      algorithmMastery,
      timeAnalysis,
      streakData,
      performanceTrends,
      weaknessAnalysis,
      strengthAnalysis,
      recommendations
    });
  };

  const filterScoresByTimeRange = (scores) => {
    const now = new Date();
    const cutoff = new Date();
    
    switch (timeRange) {
      case 'week':
        cutoff.setDate(now.getDate() - 7);
        break;
      case 'month':
        cutoff.setDate(now.getDate() - 30);
        break;
      default:
        return scores;
    }
    
    return scores.filter(score => new Date(score.date) >= cutoff);
  };

  const calculateTotalStats = (scores) => {
    const totalQuizzes = scores.length;
    const totalProblems = scores.reduce((sum, score) => sum + score.totalQuestions, 0);
    const totalCorrect = scores.reduce((sum, score) => sum + score.correct, 0);
    const avgAccuracy = totalProblems > 0 ? (totalCorrect / totalProblems) * 100 : 0;
    const totalTime = scores.reduce((sum, score) => sum + (score.timeSpent || 0), 0);
    const avgTimePerProblem = totalProblems > 0 ? totalTime / totalProblems : 0;
    const totalXP = scores.reduce((sum, score) => sum + (score.xpEarned || 0), 0);

    return {
      totalQuizzes,
      totalProblems,
      totalCorrect,
      avgAccuracy: Math.round(avgAccuracy * 10) / 10,
      totalTime,
      avgTimePerProblem: Math.round(avgTimePerProblem),
      totalXP
    };
  };

  const calculateDifficultyProgress = (scores) => {
    const progress = { Easy: { total: 0, correct: 0 }, Medium: { total: 0, correct: 0 }, Hard: { total: 0, correct: 0 } };
    
    scores.forEach(score => {
      if (!progress[score.difficulty]) {
        progress[score.difficulty] = { total: 0, correct: 0 };
      }
      progress[score.difficulty].total += score.totalQuestions;
      progress[score.difficulty].correct += score.correct;
    });

    // Calculate accuracy for each difficulty
    Object.keys(progress).forEach(difficulty => {
      const data = progress[difficulty];
      data.accuracy = data.total > 0 ? Math.round((data.correct / data.total) * 100) : 0;
    });

    return progress;
  };

  const calculateAlgorithmMastery = (scores) => {
    const mastery = {};
    
    scores.forEach(score => {
      if (score.details) {
        score.details.forEach(detail => {
          detail.correctAnswer.forEach(algorithm => {
            if (!mastery[algorithm]) {
              mastery[algorithm] = { total: 0, correct: 0, accuracy: 0, attempts: [] };
            }
            mastery[algorithm].total++;
            mastery[algorithm].attempts.push({
              date: score.date,
              correct: detail.isCorrect,
              difficulty: detail.difficulty
            });
            if (detail.isCorrect) {
              mastery[algorithm].correct++;
            }
          });
        });
      }
    });

    // Calculate accuracy and trends
    Object.keys(mastery).forEach(algorithm => {
      const data = mastery[algorithm];
      data.accuracy = data.total > 0 ? Math.round((data.correct / data.total) * 100) : 0;
      
      // Calculate recent trend (last 5 attempts)
      const recentAttempts = data.attempts.slice(-5);
      const recentCorrect = recentAttempts.filter(a => a.correct).length;
      data.recentAccuracy = recentAttempts.length > 0 ? Math.round((recentCorrect / recentAttempts.length) * 100) : 0;
      data.trend = data.recentAccuracy > data.accuracy ? 'improving' : 
                   data.recentAccuracy < data.accuracy ? 'declining' : 'stable';
    });

    return mastery;
  };

  const calculateTimeAnalysis = (scores) => {
    const timeByDifficulty = { Easy: [], Medium: [], Hard: [] };
    const timeByAccuracy = { high: [], medium: [], low: [] }; // >80%, 50-80%, <50%
    
    scores.forEach(score => {
      const avgTimePerQ = score.timeSpent / score.totalQuestions;
      timeByDifficulty[score.difficulty]?.push(avgTimePerQ);
      
      const accuracyRange = score.percentage > 80 ? 'high' : 
                           score.percentage >= 50 ? 'medium' : 'low';
      timeByAccuracy[accuracyRange].push(avgTimePerQ);
    });

    const avgTimeByDifficulty = {};
    Object.keys(timeByDifficulty).forEach(diff => {
      const times = timeByDifficulty[diff];
      avgTimeByDifficulty[diff] = times.length > 0 ? 
        Math.round(times.reduce((sum, time) => sum + time, 0) / times.length) : 0;
    });

    return {
      avgTimeByDifficulty,
      timeByAccuracy,
      fastestSolve: Math.min(...scores.map(s => s.timeSpent / s.totalQuestions).filter(t => t > 0)),
      slowestSolve: Math.max(...scores.map(s => s.timeSpent / s.totalQuestions))
    };
  };

  const calculateStreakData = (allScores) => {
    if (!allScores || allScores.length === 0) return { current: 0, longest: 0 };
    
    const sortedScores = allScores.sort((a, b) => new Date(a.date) - new Date(b.date));
    let currentStreak = 0;
    let longestStreak = 0;
    let lastDate = null;

    sortedScores.forEach(score => {
      const scoreDate = new Date(score.date);
      if (lastDate) {
        const daysDiff = Math.floor((scoreDate - lastDate) / (1000 * 60 * 60 * 24));
        if (daysDiff === 1) {
          currentStreak++;
        } else if (daysDiff > 1) {
          longestStreak = Math.max(longestStreak, currentStreak);
          currentStreak = 1;
        }
      } else {
        currentStreak = 1;
      }
      lastDate = scoreDate;
    });
    
    longestStreak = Math.max(longestStreak, currentStreak);
    
    return { current: currentStreak, longest: longestStreak };
  };

  const calculatePerformanceTrends = (scores) => {
    if (scores.length < 2) return [];
    
    const sortedScores = scores.sort((a, b) => new Date(a.date) - new Date(b.date));
    const trends = [];
    
    // Group by week
    const weeklyData = {};
    sortedScores.forEach(score => {
      const date = new Date(score.date);
      const weekStart = new Date(date.getFullYear(), date.getMonth(), date.getDate() - date.getDay());
      const weekKey = weekStart.toISOString().split('T')[0];
      
      if (!weeklyData[weekKey]) {
        weeklyData[weekKey] = { scores: [], totalQuestions: 0, totalCorrect: 0 };
      }
      weeklyData[weekKey].scores.push(score);
      weeklyData[weekKey].totalQuestions += score.totalQuestions;
      weeklyData[weekKey].totalCorrect += score.correct;
    });
    
    Object.keys(weeklyData).forEach(week => {
      const data = weeklyData[week];
      trends.push({
        week,
        avgAccuracy: Math.round((data.totalCorrect / data.totalQuestions) * 100),
        quizCount: data.scores.length,
        totalProblems: data.totalQuestions
      });
    });
    
    return trends.sort((a, b) => new Date(a.week) - new Date(b.week));
  };

  const calculateWeaknessAnalysis = (scores) => {
    const weaknesses = {};
    const difficultyWeakness = { Easy: 0, Medium: 0, Hard: 0 };
    
    scores.forEach(score => {
      if (score.details) {
        score.details.forEach(detail => {
          if (!detail.isCorrect) {
            detail.correctAnswer.forEach(algorithm => {
              if (!weaknesses[algorithm]) {
                weaknesses[algorithm] = 0;
              }
              weaknesses[algorithm]++;
            });
            difficultyWeakness[detail.difficulty]++;
          }
        });
      }
    });

    const topWeaknesses = Object.entries(weaknesses)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([algorithm, count]) => ({ algorithm, count }));

    return { algorithms: topWeaknesses, difficulty: difficultyWeakness };
  };

  const calculateStrengthAnalysis = (scores) => {
    const strengths = {};
    
    scores.forEach(score => {
      if (score.details) {
        score.details.forEach(detail => {
          if (detail.isCorrect) {
            detail.correctAnswer.forEach(algorithm => {
              if (!strengths[algorithm]) {
                strengths[algorithm] = 0;
              }
              strengths[algorithm]++;
            });
          }
        });
      }
    });

    return Object.entries(strengths)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([algorithm, count]) => ({ algorithm, count }));
  };

  const generateRecommendations = (weaknesses, strengths, mastery) => {
    const recommendations = [];
    
    // Weakness-based recommendations
    if (weaknesses.algorithms.length > 0) {
      const topWeakness = weaknesses.algorithms[0];
      recommendations.push({
        type: 'weakness',
        title: `Improve ${topWeakness.algorithm}`,
        description: `You've missed ${topWeakness.count} questions involving ${topWeakness.algorithm}. Focus on this algorithm.`,
        action: 'Practice',
        priority: 'high'
      });
    }

    // Difficulty-based recommendations
    const difficultyAccuracy = analytics.difficultyProgress;
    Object.keys(difficultyAccuracy).forEach(difficulty => {
      const accuracy = difficultyAccuracy[difficulty]?.accuracy || 0;
      if (accuracy < 60) {
        recommendations.push({
          type: 'difficulty',
          title: `${difficulty} Problems Need Work`,
          description: `Your accuracy on ${difficulty} problems is ${accuracy}%. Consider more practice.`,
          action: 'Practice',
          priority: accuracy < 40 ? 'high' : 'medium'
        });
      }
    });

    // Time-based recommendations
    if (analytics.timeAnalysis.avgTimeByDifficulty?.Easy > 120) {
      recommendations.push({
        type: 'speed',
        title: 'Speed Up Easy Problems',
        description: 'You\'re taking too long on Easy problems. Practice for speed.',
        action: 'Speed Practice',
        priority: 'medium'
      });
    }

    return recommendations.slice(0, 5); // Top 5 recommendations
  };

  return (
    <div className="analytics-dashboard">
      {/* Header */}
      <div className="analytics-header">
        <h1>📊 Performance Analytics</h1>
        <div className="time-range-selector">
          <button 
            className={timeRange === 'week' ? 'active' : ''}
            onClick={() => setTimeRange('week')}
          >
            Last Week
          </button>
          <button 
            className={timeRange === 'month' ? 'active' : ''}
            onClick={() => setTimeRange('month')}
          >
            Last Month
          </button>
          <button 
            className={timeRange === 'all' ? 'active' : ''}
            onClick={() => setTimeRange('all')}
          >
            All Time
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="key-metrics">
        <div className="metric-card">
          <div className="metric-icon">📈</div>
          <div className="metric-content">
            <h3>Overall Accuracy</h3>
            <div className="metric-value">{analytics.totalStats.avgAccuracy}%</div>
            <div className="metric-detail">
              {analytics.totalStats.totalCorrect}/{analytics.totalStats.totalProblems} correct
            </div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">🔥</div>
          <div className="metric-content">
            <h3>Current Streak</h3>
            <div className="metric-value">{analytics.streakData.current}</div>
            <div className="metric-detail">
              Best: {analytics.streakData.longest} days
            </div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">⏱️</div>
          <div className="metric-content">
            <h3>Avg Time/Problem</h3>
            <div className="metric-value">{analytics.totalStats.avgTimePerProblem}s</div>
            <div className="metric-detail">
              Total: {Math.round(analytics.totalStats.totalTime / 60)}min
            </div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">⭐</div>
          <div className="metric-content">
            <h3>XP Earned</h3>
            <div className="metric-value">{analytics.totalStats.totalXP}</div>
            <div className="metric-detail">
              {timeRange !== 'all' ? `in ${timeRange}` : 'all time'}
            </div>
          </div>
        </div>
      </div>

      {/* Performance Trends */}
      {analytics.performanceTrends.length > 0 && (
        <div className="performance-trends">
          <h2>📈 Performance Trends</h2>
          <div className="trend-chart">
            {analytics.performanceTrends.map((trend, index) => (
              <div key={trend.week} className="trend-point">
                <div className="trend-bar">
                  <div 
                    className="trend-fill"
                    style={{ height: `${trend.avgAccuracy}%` }}
                    title={`Week of ${new Date(trend.week).toLocaleDateString()}: ${trend.avgAccuracy}%`}
                  />
                </div>
                <div className="trend-label">
                  {new Date(trend.week).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Difficulty Analysis */}
      <div className="difficulty-analysis">
        <h2>🎯 Difficulty Breakdown</h2>
        <div className="difficulty-grid">
          {Object.entries(analytics.difficultyProgress).map(([difficulty, data]) => (
            <div key={difficulty} className={`difficulty-card ${difficulty.toLowerCase()}`}>
              <h3>{difficulty}</h3>
              <div className="accuracy-circle">
                <div className="circle-progress">
                  <svg viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke="var(--bg-color)"
                      strokeWidth="8"
                      fill="none"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke="var(--primary-color)"
                      strokeWidth="8"
                      fill="none"
                      strokeDasharray={`${data.accuracy * 2.51}, 251`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="circle-text">{data.accuracy}%</div>
                </div>
              </div>
              <div className="difficulty-stats">
                <div>✅ {data.correct} correct</div>
                <div>📊 {data.total} total</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Algorithm Mastery */}
      <div className="algorithm-mastery">
        <h2>🧮 Algorithm Mastery</h2>
        <div className="mastery-grid">
          {Object.entries(analytics.algorithmMastery)
            .sort((a, b) => b[1].accuracy - a[1].accuracy)
            .slice(0, 12)
            .map(([algorithm, data]) => (
              <div key={algorithm} className="mastery-card">
                <div className="mastery-header">
                  <h4>{algorithm}</h4>
                  <span className={`trend-indicator ${data.trend}`}>
                    {data.trend === 'improving' ? '📈' : 
                     data.trend === 'declining' ? '📉' : '➡️'}
                  </span>
                </div>
                <div className="mastery-progress">
                  <div 
                    className="mastery-bar"
                    style={{ width: `${data.accuracy}%` }}
                  />
                </div>
                <div className="mastery-stats">
                  <span>{data.accuracy}% accuracy</span>
                  <span>{data.correct}/{data.total}</span>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Weaknesses & Recommendations */}
      <div className="insights-section">
        <div className="weaknesses">
          <h2>🎯 Areas for Improvement</h2>
          <div className="weakness-list">
            {analytics.weaknesses.algorithms.slice(0, 5).map(weakness => (
              <div key={weakness.algorithm} className="weakness-item">
                <div className="weakness-info">
                  <span className="algorithm-name">{weakness.algorithm}</span>
                  <span className="weakness-count">{weakness.count} missed</span>
                </div>
                <button className="practice-btn">Practice Now</button>
              </div>
            ))}
          </div>
        </div>

        <div className="recommendations">
          <h2>💡 Recommendations</h2>
          <div className="recommendation-list">
            {analytics.recommendations.map((rec, index) => (
              <div key={index} className={`recommendation ${rec.priority}`}>
                <div className="rec-header">
                  <h4>{rec.title}</h4>
                  <span className={`priority-badge ${rec.priority}`}>
                    {rec.priority}
                  </span>
                </div>
                <p>{rec.description}</p>
                <button className="action-btn">{rec.action}</button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Time Analysis */}
      <div className="time-analysis">
        <h2>⏱️ Time Analysis</h2>
        <div className="time-grid">
          <div className="time-card">
            <h3>Average Time by Difficulty</h3>
            <div className="time-breakdown">
              {Object.entries(analytics.timeAnalysis.avgTimeByDifficulty || {}).map(([diff, time]) => (
                <div key={diff} className="time-item">
                  <span className={`diff-label ${diff.toLowerCase()}`}>{diff}</span>
                  <span className="time-value">{time}s</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="time-card">
            <h3>Speed Records</h3>
            <div className="speed-records">
              <div className="record-item">
                <span>⚡ Fastest Solve</span>
                <span>{Math.round(analytics.timeAnalysis.fastestSolve)}s</span>
              </div>
              <div className="record-item">
                <span>🐌 Slowest Solve</span>
                <span>{Math.round(analytics.timeAnalysis.slowestSolve)}s</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Analytics;