import { useState, useMemo, useEffect } from 'react';
import { allLeetcodeProblems } from '../data/allProblems';

function Leaderboard({ user }) {
  const [timeframe, setTimeframe] = useState('all-time');
  const [category, setCategory] = useState('xp');
  const [showGlobal, setShowGlobal] = useState(true);

  // Simulated global leaderboard data (in a real app, this would come from a server)
  const [globalLeaderboard, setGlobalLeaderboard] = useState([
    { id: 'global-1', name: 'CodeMaster2024', xp: 15750, problemsSolved: 1247, accuracy: 89, streak: 45, level: 15 },
    { id: 'global-2', name: 'AlgoNinja', xp: 14200, problemsSolved: 1156, accuracy: 92, streak: 32, level: 14 },
    { id: 'global-3', name: 'ByteWizard', xp: 13800, problemsSolved: 1098, accuracy: 87, streak: 28, level: 13 },
    { id: 'global-4', name: 'DataStructureGod', xp: 12900, problemsSolved: 967, accuracy: 94, streak: 67, level: 12 },
    { id: 'global-5', name: 'RecursiveReaper', xp: 11750, problemsSolved: 892, accuracy: 85, streak: 21, level: 11 },
    { id: 'global-6', name: 'DynamicProgrammer', xp: 10800, problemsSolved: 743, accuracy: 88, streak: 39, level: 10 },
    { id: 'global-7', name: 'GraphExplorer', xp: 9950, problemsSolved: 678, accuracy: 91, streak: 15, level: 9 },
    { id: 'global-8', name: 'TreeTraverser', xp: 9200, problemsSolved: 612, accuracy: 86, streak: 52, level: 9 },
    { id: 'global-9', name: 'HeapMaster', xp: 8700, problemsSolved: 534, accuracy: 83, streak: 8, level: 8 },
    { id: 'global-10', name: 'BinarySearcher', xp: 8100, problemsSolved: 456, accuracy: 90, streak: 19, level: 8 }
  ]);

  // Get local users leaderboard
  const localLeaderboard = useMemo(() => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    return users.map(u => {
      let totalXP = u.totalXP || 0;
      let problemsSolved = 0;
      let totalProblems = 0;
      let currentStreak = 0;
      let lastActivityDate = null;

      if (u.scores) {
        // Calculate problems solved and accuracy
        const solvedProblems = new Set();
        u.scores.forEach(score => {
          if (score.details) {
            score.details.forEach(detail => {
              totalProblems++;
              if (detail.isCorrect) {
                solvedProblems.add(detail.questionId);
              }
            });
          }
          
          // Update last activity
          const scoreDate = new Date(score.date);
          if (!lastActivityDate || scoreDate > lastActivityDate) {
            lastActivityDate = scoreDate;
          }
        });
        
        problemsSolved = solvedProblems.size;

        // Calculate current streak
        if (u.scores.length > 0) {
          const sortedScores = u.scores.sort((a, b) => new Date(b.date) - new Date(a.date));
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          
          for (let i = 0; i < sortedScores.length; i++) {
            const scoreDate = new Date(sortedScores[i].date);
            scoreDate.setHours(0, 0, 0, 0);
            
            const daysDiff = Math.floor((today - scoreDate) / (1000 * 60 * 60 * 24));
            
            if (daysDiff === currentStreak || (currentStreak === 0 && daysDiff <= 1)) {
              currentStreak = daysDiff === 0 ? currentStreak + 1 : 1;
            } else {
              break;
            }
          }
        }
      }

      const accuracy = totalProblems > 0 ? Math.round((problemsSolved / totalProblems) * 100) : 0;
      const level = Math.floor(totalXP / 1000) + 1;

      return {
        ...u,
        xp: totalXP,
        problemsSolved,
        accuracy,
        streak: currentStreak,
        level,
        lastActivity: lastActivityDate
      };
    }).sort((a, b) => {
      switch (category) {
        case 'xp':
          return b.xp - a.xp;
        case 'problems':
          return b.problemsSolved - a.problemsSolved;
        case 'accuracy':
          return b.accuracy - a.accuracy;
        case 'streak':
          return b.streak - a.streak;
        default:
          return b.xp - a.xp;
      }
    });
  }, [category]);

  // Filter by timeframe
  const filteredLeaderboard = useMemo(() => {
    if (timeframe === 'all-time') return localLeaderboard;
    
    const cutoffDate = new Date();
    switch (timeframe) {
      case 'week':
        cutoffDate.setDate(cutoffDate.getDate() - 7);
        break;
      case 'month':
        cutoffDate.setMonth(cutoffDate.getMonth() - 1);
        break;
      default:
        return localLeaderboard;
    }

    return localLeaderboard.filter(u => 
      u.lastActivity && new Date(u.lastActivity) >= cutoffDate
    );
  }, [localLeaderboard, timeframe]);

  // Get user's rank
  const currentUserRank = filteredLeaderboard.findIndex(u => u.id === user.id) + 1;
  const currentUser = filteredLeaderboard.find(u => u.id === user.id);

  // Achievement badges
  const getAchievementBadges = (userData) => {
    const badges = [];
    
    if (userData.problemsSolved >= 1000) badges.push({ icon: '🏆', title: 'Problem Master', color: '#FFD700' });
    else if (userData.problemsSolved >= 500) badges.push({ icon: '🥇', title: 'Problem Crusher', color: '#FF6B35' });
    else if (userData.problemsSolved >= 100) badges.push({ icon: '🥈', title: 'Problem Solver', color: '#C0C0C0' });
    
    if (userData.accuracy >= 95) badges.push({ icon: '🎯', title: 'Perfectionist', color: '#4CAF50' });
    else if (userData.accuracy >= 85) badges.push({ icon: '🏹', title: 'Sharpshooter', color: '#2196F3' });
    
    if (userData.streak >= 50) badges.push({ icon: '🔥', title: 'Streak Legend', color: '#FF5722' });
    else if (userData.streak >= 20) badges.push({ icon: '⚡', title: 'Streak Master', color: '#FF9800' });
    else if (userData.streak >= 7) badges.push({ icon: '💪', title: 'Dedicated', color: '#9C27B0' });
    
    if (userData.level >= 20) badges.push({ icon: '👑', title: 'Coding Royalty', color: '#FFD700' });
    else if (userData.level >= 10) badges.push({ icon: '🌟', title: 'Rising Star', color: '#FFC107' });
    
    return badges.slice(0, 3); // Show max 3 badges
  };

  const LeaderboardRow = ({ userData, rank, isCurrentUser = false }) => {
    const badges = getAchievementBadges(userData);
    
    return (
      <div className={`leaderboard-row ${isCurrentUser ? 'current-user' : ''}`}>
        <div className="rank-section">
          <div className="rank-number">
            {rank <= 3 ? (
              <span className={`medal rank-${rank}`}>
                {rank === 1 ? '🥇' : rank === 2 ? '🥈' : '🥉'}
              </span>
            ) : (
              <span className="rank-text">#{rank}</span>
            )}
          </div>
        </div>

        <div className="user-info">
          <div className="user-details">
            <h3>{userData.name}</h3>
            <div className="user-badges">
              {badges.map((badge, index) => (
                <span 
                  key={index}
                  className="achievement-badge"
                  style={{ backgroundColor: badge.color }}
                  title={badge.title}
                >
                  {badge.icon}
                </span>
              ))}
            </div>
          </div>
          <div className="user-level">
            Level {userData.level}
          </div>
        </div>

        <div className="stats-grid">
          <div className="stat-item">
            <span className="stat-value">{userData.xp.toLocaleString()}</span>
            <span className="stat-label">XP</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{userData.problemsSolved}</span>
            <span className="stat-label">Solved</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{userData.accuracy}%</span>
            <span className="stat-label">Accuracy</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{userData.streak}</span>
            <span className="stat-label">Streak</span>
          </div>
        </div>

        <div className="progress-section">
          <div className="xp-progress">
            <div 
              className="xp-bar"
              style={{ 
                width: `${((userData.xp % 1000) / 1000) * 100}%`
              }}
            />
          </div>
          <span className="next-level">
            {1000 - (userData.xp % 1000)} XP to Level {userData.level + 1}
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="leaderboard">
      {/* Header */}
      <div className="leaderboard-header">
        <h1>🏆 Leaderboard</h1>
        <p>Compete with coders worldwide and track your progress</p>
      </div>

      {/* Current User Stats */}
      {currentUser && (
        <div className="current-user-card">
          <div className="card-header">
            <h2>Your Ranking</h2>
            <div className="user-rank">
              {currentUserRank > 0 ? `#${currentUserRank}` : 'Unranked'}
            </div>
          </div>
          <LeaderboardRow userData={currentUser} rank={currentUserRank} isCurrentUser={true} />
        </div>
      )}

      {/* Controls */}
      <div className="leaderboard-controls">
        <div className="control-group">
          <label>Leaderboard Type</label>
          <div className="toggle-buttons">
            <button 
              className={`toggle-btn ${!showGlobal ? 'active' : ''}`}
              onClick={() => setShowGlobal(false)}
            >
              Local
            </button>
            <button 
              className={`toggle-btn ${showGlobal ? 'active' : ''}`}
              onClick={() => setShowGlobal(true)}
            >
              Global
            </button>
          </div>
        </div>

        <div className="control-group">
          <label>Timeframe</label>
          <select 
            value={timeframe} 
            onChange={(e) => setTimeframe(e.target.value)}
            className="control-select"
          >
            <option value="all-time">All Time</option>
            <option value="month">This Month</option>
            <option value="week">This Week</option>
          </select>
        </div>

        <div className="control-group">
          <label>Category</label>
          <select 
            value={category} 
            onChange={(e) => setCategory(e.target.value)}
            className="control-select"
          >
            <option value="xp">Total XP</option>
            <option value="problems">Problems Solved</option>
            <option value="accuracy">Accuracy</option>
            <option value="streak">Current Streak</option>
          </select>
        </div>
      </div>

      {/* Leaderboard List */}
      <div className="leaderboard-list">
        <div className="list-header">
          <h2>
            {showGlobal ? '🌍 Global' : '📍 Local'} Leaders - {category.charAt(0).toUpperCase() + category.slice(1)}
          </h2>
          <span className="participant-count">
            {showGlobal ? globalLeaderboard.length : filteredLeaderboard.length} participants
          </span>
        </div>

        <div className="leaderboard-rows">
          {(showGlobal ? globalLeaderboard : filteredLeaderboard).map((userData, index) => (
            <LeaderboardRow
              key={userData.id}
              userData={userData}
              rank={index + 1}
              isCurrentUser={!showGlobal && userData.id === user.id}
            />
          ))}
        </div>
      </div>

      {/* Achievement Gallery */}
      <div className="achievement-gallery">
        <h2>🏅 Achievement Gallery</h2>
        <div className="achievements-grid">
          <div className="achievement-card">
            <div className="achievement-icon">🏆</div>
            <h3>Problem Master</h3>
            <p>Solve 1000+ problems</p>
            <div className="achievement-progress">
              <div className="progress-bar">
                <div 
                  className="progress-fill"
                  style={{ 
                    width: `${Math.min((currentUser?.problemsSolved || 0) / 1000 * 100, 100)}%`
                  }}
                />
              </div>
              <span>{currentUser?.problemsSolved || 0}/1000</span>
            </div>
          </div>

          <div className="achievement-card">
            <div className="achievement-icon">🎯</div>
            <h3>Perfectionist</h3>
            <p>Achieve 95%+ accuracy</p>
            <div className="achievement-progress">
              <div className="progress-bar">
                <div 
                  className="progress-fill"
                  style={{ 
                    width: `${Math.min((currentUser?.accuracy || 0) / 95 * 100, 100)}%`
                  }}
                />
              </div>
              <span>{currentUser?.accuracy || 0}%/95%</span>
            </div>
          </div>

          <div className="achievement-card">
            <div className="achievement-icon">🔥</div>
            <h3>Streak Legend</h3>
            <p>Maintain 50+ day streak</p>
            <div className="achievement-progress">
              <div className="progress-bar">
                <div 
                  className="progress-fill"
                  style={{ 
                    width: `${Math.min((currentUser?.streak || 0) / 50 * 100, 100)}%`
                  }}
                />
              </div>
              <span>{currentUser?.streak || 0}/50</span>
            </div>
          </div>

          <div className="achievement-card">
            <div className="achievement-icon">👑</div>
            <h3>Coding Royalty</h3>
            <p>Reach Level 20</p>
            <div className="achievement-progress">
              <div className="progress-bar">
                <div 
                  className="progress-fill"
                  style={{ 
                    width: `${Math.min((currentUser?.level || 0) / 20 * 100, 100)}%`
                  }}
                />
              </div>
              <span>Level {currentUser?.level || 0}/20</span>
            </div>
          </div>
        </div>
      </div>

      {/* Competition Info */}
      <div className="competition-info">
        <h2>🎮 Weekly Competition</h2>
        <div className="competition-card">
          <div className="competition-header">
            <h3>Algorithm Speed Run</h3>
            <div className="competition-time">
              <span className="time-left">3 days left</span>
            </div>
          </div>
          <p>Solve the most Dynamic Programming problems this week!</p>
          <div className="competition-stats">
            <div className="stat">
              <span className="label">Participants:</span>
              <span className="value">2,847</span>
            </div>
            <div className="stat">
              <span className="label">Your Score:</span>
              <span className="value">{currentUser?.problemsSolved || 0} problems</span>
            </div>
            <div className="stat">
              <span className="label">Leading:</span>
              <span className="value">156 problems</span>
            </div>
          </div>
          <div className="competition-rewards">
            <h4>Rewards</h4>
            <div className="rewards-list">
              <span className="reward">🥇 1st: 5000 XP + Gold Badge</span>
              <span className="reward">🥈 2nd-10th: 2000 XP + Silver Badge</span>
              <span className="reward">🥉 11th-100th: 1000 XP + Bronze Badge</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Leaderboard;