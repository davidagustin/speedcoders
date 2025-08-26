import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { allLeetcodeProblems } from '../data/allProblems';

function Results({ user, quizResult }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [showDetailedView, setShowDetailedView] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  
  // Get result from props or location state
  const result = quizResult || location.state?.result;
  
  if (!result) {
    return (
      <div className="results-error">
        <h2>No Results Available</h2>
        <p>Quiz results could not be loaded.</p>
        <button onClick={() => navigate('/dashboard')} className="back-btn">
          Back to Dashboard
        </button>
      </div>
    );
  }

  const getPerformanceLevel = (percentage) => {
    if (percentage >= 90) return { level: 'Excellent', color: '#4CAF50', icon: '🏆' };
    if (percentage >= 80) return { level: 'Good', color: '#2196F3', icon: '👏' };
    if (percentage >= 70) return { level: 'Fair', color: '#FF9800', icon: '👍' };
    if (percentage >= 60) return { level: 'Needs Work', color: '#FF5722', icon: '📚' };
    return { level: 'Keep Trying', color: '#F44336', icon: '💪' };
  };

  const getTimePerformance = () => {
    const timeUsedPercentage = (result.timeSpent / result.timeLimit) * 100;
    if (timeUsedPercentage <= 50) return { rating: 'Fast', color: '#4CAF50', icon: '⚡' };
    if (timeUsedPercentage <= 75) return { rating: 'Good Pace', color: '#2196F3', icon: '⏱️' };
    if (timeUsedPercentage <= 90) return { rating: 'Steady', color: '#FF9800', icon: '🐢' };
    return { rating: 'Time Pressure', color: '#F44336', icon: '⏰' };
  };

  const performance = getPerformanceLevel(result.percentage);
  const timePerformance = getTimePerformance();

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getAlgorithmAccuracy = () => {
    const algorithmStats = {};
    
    result.details.forEach(detail => {
      detail.correctAnswer.forEach(algo => {
        if (!algorithmStats[algo]) {
          algorithmStats[algo] = { total: 0, correct: 0 };
        }
        algorithmStats[algo].total++;
        if (detail.isCorrect) {
          algorithmStats[algo].correct++;
        }
      });
    });

    return Object.entries(algorithmStats).map(([algo, stats]) => ({
      algorithm: algo,
      accuracy: Math.round((stats.correct / stats.total) * 100),
      correct: stats.correct,
      total: stats.total
    })).sort((a, b) => b.accuracy - a.accuracy);
  };

  const algorithmAccuracy = getAlgorithmAccuracy();

  const getDifficultyBreakdown = () => {
    const breakdown = { Easy: { correct: 0, total: 0 }, Medium: { correct: 0, total: 0 }, Hard: { correct: 0, total: 0 } };
    
    result.details.forEach(detail => {
      breakdown[detail.difficulty].total++;
      if (detail.isCorrect) {
        breakdown[detail.difficulty].correct++;
      }
    });

    return breakdown;
  };

  const difficultyBreakdown = getDifficultyBreakdown();

  const getWeakAreas = () => {
    return algorithmAccuracy
      .filter(item => item.accuracy < 70 && item.total >= 2)
      .slice(0, 5);
  };

  const getStrongAreas = () => {
    return algorithmAccuracy
      .filter(item => item.accuracy >= 90 && item.total >= 2)
      .slice(0, 5);
  };

  const shareResults = () => {
    const shareText = `🎯 Just completed a LeetCode Quiz!\n\n` +
      `📊 Score: ${result.correct}/${result.totalQuestions} (${result.percentage}%)\n` +
      `⏱️ Time: ${formatTime(result.timeSpent)}\n` +
      `🏆 XP Earned: ${result.xpEarned}\n\n` +
      `#LeetCode #CodingPractice #AlgorithmMastery`;

    if (navigator.share) {
      navigator.share({
        title: 'My LeetCode Quiz Results',
        text: shareText,
        url: window.location.origin
      });
    } else {
      navigator.clipboard.writeText(shareText);
      alert('Results copied to clipboard!');
    }
  };

  const retakeQuiz = () => {
    navigate('/quiz', { 
      state: { 
        mode: result.mode,
        difficulty: result.difficulty,
        retake: true
      } 
    });
  };

  const QuestionDetail = ({ detail, index }) => {
    const isCorrect = detail.isCorrect;
    
    return (
      <div className={`question-detail ${isCorrect ? 'correct' : 'incorrect'}`}>
        <div className="question-header">
          <div className="question-number">#{detail.questionId}</div>
          <h3>{detail.question}</h3>
          <div className={`result-icon ${isCorrect ? 'correct' : 'incorrect'}`}>
            {isCorrect ? '✓' : '✗'}
          </div>
        </div>

        <div className="question-info">
          <span className={`difficulty-badge ${detail.difficulty.toLowerCase()}`}>
            {detail.difficulty}
          </span>
          <a 
            href={detail.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="leetcode-link"
          >
            View on LeetCode →
          </a>
        </div>

        <div className="answer-comparison">
          <div className="user-answer">
            <h4>Your Answer:</h4>
            <div className="algorithm-tags">
              {detail.userAnswer.length > 0 ? (
                detail.userAnswer.map(algo => (
                  <span 
                    key={algo} 
                    className={`algorithm-tag ${
                      detail.correctAnswer.includes(algo) ? 'correct' : 'incorrect'
                    }`}
                  >
                    {algo}
                  </span>
                ))
              ) : (
                <span className="no-answer">No answer selected</span>
              )}
            </div>
          </div>

          <div className="correct-answer">
            <h4>Correct Answer:</h4>
            <div className="algorithm-tags">
              {detail.correctAnswer.map(algo => (
                <span key={algo} className="algorithm-tag correct">
                  {algo}
                </span>
              ))}
            </div>
          </div>
        </div>

        {!isCorrect && (
          <div className="explanation">
            <h4>💡 Why this is correct:</h4>
            <p>
              The correct algorithms for this problem are optimal because they provide
              the best time/space complexity trade-offs for the given constraints.
            </p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="results">
      {/* Header with main results */}
      <div className="results-header">
        <div className="performance-card">
          <div className="performance-icon" style={{ color: performance.color }}>
            {performance.icon}
          </div>
          <div className="performance-info">
            <h1>{performance.level}</h1>
            <div className="score-display">
              <span className="score-main">{result.percentage}%</span>
              <span className="score-detail">
                {result.correct} of {result.totalQuestions} correct
              </span>
            </div>
          </div>
          <div className="xp-earned">
            <div className="xp-amount">+{result.xpEarned} XP</div>
            <div className="xp-label">Earned</div>
          </div>
        </div>

        <div className="quiz-meta">
          <div className="meta-item">
            <span className="meta-label">Mode:</span>
            <span className="meta-value">{result.mode}</span>
          </div>
          <div className="meta-item">
            <span className="meta-label">Difficulty:</span>
            <span className="meta-value">{result.difficulty}</span>
          </div>
          <div className="meta-item">
            <span className="meta-label">Time:</span>
            <span className="meta-value">{formatTime(result.timeSpent)}</span>
          </div>
          <div className="meta-item">
            <span className="meta-label">Date:</span>
            <span className="meta-value">
              {new Date(result.date).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="results-actions">
        <button className="action-btn primary" onClick={() => navigate('/dashboard')}>
          Back to Dashboard
        </button>
        <button className="action-btn secondary" onClick={retakeQuiz}>
          Retake Quiz
        </button>
        <button className="action-btn secondary" onClick={shareResults}>
          Share Results
        </button>
        <button 
          className="action-btn secondary"
          onClick={() => setShowDetailedView(!showDetailedView)}
        >
          {showDetailedView ? 'Hide Details' : 'View Details'}
        </button>
      </div>

      {/* Performance breakdown */}
      <div className="performance-breakdown">
        <div className="breakdown-section">
          <h2>📊 Performance Analysis</h2>
          
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon" style={{ color: timePerformance.color }}>
                {timePerformance.icon}
              </div>
              <div className="stat-info">
                <h3>{timePerformance.rating}</h3>
                <p>{formatTime(result.timeSpent)} / {formatTime(result.timeLimit)}</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">🎯</div>
              <div className="stat-info">
                <h3>Accuracy</h3>
                <p>{result.percentage}%</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">⚡</div>
              <div className="stat-info">
                <h3>Avg. Time/Question</h3>
                <p>{formatTime(Math.floor(result.timeSpent / result.totalQuestions))}</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">🏆</div>
              <div className="stat-info">
                <h3>XP Earned</h3>
                <p>{result.xpEarned} points</p>
              </div>
            </div>
          </div>
        </div>

        {/* Difficulty breakdown */}
        <div className="breakdown-section">
          <h3>🎚️ Difficulty Breakdown</h3>
          <div className="difficulty-stats">
            {Object.entries(difficultyBreakdown).map(([diff, stats]) => {
              const percentage = stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0;
              return (
                <div key={diff} className="difficulty-stat">
                  <div className="difficulty-info">
                    <span className={`difficulty-label ${diff.toLowerCase()}`}>{diff}</span>
                    <span className="difficulty-score">{stats.correct}/{stats.total}</span>
                  </div>
                  <div className="difficulty-bar">
                    <div 
                      className={`difficulty-fill ${diff.toLowerCase()}`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="difficulty-percentage">{percentage}%</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Algorithm performance */}
        <div className="breakdown-section">
          <h3>🧠 Algorithm Performance</h3>
          <div className="algorithm-performance">
            {algorithmAccuracy.slice(0, 8).map(item => (
              <div key={item.algorithm} className="algorithm-stat">
                <div className="algorithm-info">
                  <span className="algorithm-name">{item.algorithm}</span>
                  <span className="algorithm-score">{item.correct}/{item.total}</span>
                </div>
                <div className="algorithm-bar">
                  <div 
                    className="algorithm-fill"
                    style={{ 
                      width: `${item.accuracy}%`,
                      backgroundColor: item.accuracy >= 70 ? '#4CAF50' : item.accuracy >= 50 ? '#FF9800' : '#F44336'
                    }}
                  />
                </div>
                <span className="algorithm-percentage">{item.accuracy}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recommendations */}
        <div className="breakdown-section">
          <h3>💡 Recommendations</h3>
          <div className="recommendations">
            {getWeakAreas().length > 0 && (
              <div className="recommendation-card weak-areas">
                <h4>🎯 Focus Areas</h4>
                <p>Consider practicing these algorithms more:</p>
                <div className="algorithm-list">
                  {getWeakAreas().map(item => (
                    <span key={item.algorithm} className="algorithm-tag weak">
                      {item.algorithm} ({item.accuracy}%)
                    </span>
                  ))}
                </div>
              </div>
            )}

            {getStrongAreas().length > 0 && (
              <div className="recommendation-card strong-areas">
                <h4>💪 Strengths</h4>
                <p>You're performing well in these areas:</p>
                <div className="algorithm-list">
                  {getStrongAreas().map(item => (
                    <span key={item.algorithm} className="algorithm-tag strong">
                      {item.algorithm} ({item.accuracy}%)
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="recommendation-card next-steps">
              <h4>🚀 Next Steps</h4>
              <ul>
                <li>Try a {result.difficulty === 'Easy' ? 'Medium' : result.difficulty === 'Medium' ? 'Hard' : 'Mixed'} difficulty quiz</li>
                <li>Focus on your weak algorithm areas</li>
                <li>Practice company-specific problems</li>
                <li>Join a study plan for structured learning</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed question results */}
      {showDetailedView && (
        <div className="detailed-results">
          <h2>🔍 Detailed Question Analysis</h2>
          <div className="questions-list">
            {result.details.map((detail, index) => (
              <QuestionDetail key={index} detail={detail} index={index} />
            ))}
          </div>
        </div>
      )}

      {/* Challenge completion (if applicable) */}
      {result.challenge && (
        <div className="challenge-completion">
          <h2>🎯 Challenge Completed!</h2>
          <div className="challenge-card">
            <div className="challenge-icon">{result.challenge.icon}</div>
            <div className="challenge-info">
              <h3>{result.challenge.title}</h3>
              <p>{result.challenge.description}</p>
              <div className="challenge-reward">
                Bonus Reward: {result.challenge.reward}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Progress celebration */}
      <div className="progress-celebration">
        <h2>🎉 Keep up the great work!</h2>
        <div className="celebration-stats">
          <div className="celebration-item">
            <span className="celebration-number">{user?.totalXP || 0}</span>
            <span className="celebration-label">Total XP</span>
          </div>
          <div className="celebration-item">
            <span className="celebration-number">
              {Math.floor((user?.totalXP || 0) / 1000) + 1}
            </span>
            <span className="celebration-label">Level</span>
          </div>
          <div className="celebration-item">
            <span className="celebration-number">
              {user?.scores?.length || 0}
            </span>
            <span className="celebration-label">Quizzes Taken</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Results;