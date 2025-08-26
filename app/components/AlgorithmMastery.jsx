import { useState, useMemo } from 'react';
import { allLeetcodeProblems, algorithmCategories } from '../data/allProblems';

function AlgorithmMastery({ user }) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('mastery');

  // Calculate algorithm mastery for the user
  const algorithmMastery = useMemo(() => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const currentUser = users.find(u => u.id === user.id);
    
    if (!currentUser?.scores) return {};

    const algorithmStats = {};
    
    currentUser.scores.forEach(score => {
      if (score.details) {
        score.details.forEach(detail => {
          detail.correctAnswer.forEach(algo => {
            if (!algorithmStats[algo]) {
              algorithmStats[algo] = {
                total: 0,
                correct: 0,
                accuracy: 0,
                lastPracticed: null,
                difficulty: { Easy: 0, Medium: 0, Hard: 0 },
                totalProblems: 0
              };
            }
            
            algorithmStats[algo].total++;
            if (detail.isCorrect) {
              algorithmStats[algo].correct++;
            }
            
            algorithmStats[algo].accuracy = Math.round(
              (algorithmStats[algo].correct / algorithmStats[algo].total) * 100
            );
            
            algorithmStats[algo].lastPracticed = new Date(score.date);
            algorithmStats[algo].difficulty[detail.difficulty]++;
          });
        });
      }
    });

    // Add total problems available for each algorithm
    Object.keys(algorithmStats).forEach(algo => {
      algorithmStats[algo].totalProblems = allLeetcodeProblems.filter(
        p => p.correctAlgorithms.includes(algo)
      ).length;
    });

    return algorithmStats;
  }, [user]);

  // Get mastery level for an algorithm
  const getMasteryLevel = (stats) => {
    if (!stats || stats.total === 0) return { level: 'Beginner', color: '#9E9E9E', progress: 0 };
    
    const accuracy = stats.accuracy;
    const problemCount = stats.total;
    
    if (accuracy >= 90 && problemCount >= 20) return { level: 'Master', color: '#4CAF50', progress: 100 };
    if (accuracy >= 80 && problemCount >= 15) return { level: 'Advanced', color: '#2196F3', progress: 80 };
    if (accuracy >= 70 && problemCount >= 10) return { level: 'Intermediate', color: '#FF9800', progress: 60 };
    if (accuracy >= 60 && problemCount >= 5) return { level: 'Novice', color: '#9C27B0', progress: 40 };
    return { level: 'Beginner', color: '#9E9E9E', progress: 20 };
  };

  // Filter and sort algorithms
  const filteredAlgorithms = useMemo(() => {
    let algorithms = Object.entries(algorithmMastery);
    
    // Add algorithms user hasn't practiced yet
    const allAlgorithms = new Set();
    allLeetcodeProblems.forEach(p => {
      p.correctAlgorithms.forEach(algo => allAlgorithms.add(algo));
    });
    
    Array.from(allAlgorithms).forEach(algo => {
      if (!algorithmMastery[algo]) {
        algorithms.push([algo, {
          total: 0,
          correct: 0,
          accuracy: 0,
          lastPracticed: null,
          difficulty: { Easy: 0, Medium: 0, Hard: 0 },
          totalProblems: allLeetcodeProblems.filter(p => p.correctAlgorithms.includes(algo)).length
        }]);
      }
    });

    // Filter by category
    if (selectedCategory !== 'all') {
      const categoryAlgorithms = algorithmCategories[selectedCategory] || [];
      algorithms = algorithms.filter(([algo]) => categoryAlgorithms.includes(algo));
    }

    // Sort algorithms
    algorithms.sort((a, b) => {
      const [algoA, statsA] = a;
      const [algoB, statsB] = b;
      
      switch (sortBy) {
        case 'mastery':
          return getMasteryLevel(statsB).progress - getMasteryLevel(statsA).progress;
        case 'accuracy':
          return statsB.accuracy - statsA.accuracy;
        case 'problems':
          return statsB.total - statsA.total;
        case 'name':
          return algoA.localeCompare(algoB);
        default:
          return 0;
      }
    });

    return algorithms;
  }, [algorithmMastery, selectedCategory, sortBy]);

  const overallStats = useMemo(() => {
    const practiced = Object.keys(algorithmMastery).length;
    const totalAlgorithms = new Set();
    allLeetcodeProblems.forEach(p => {
      p.correctAlgorithms.forEach(algo => totalAlgorithms.add(algo));
    });
    
    const masteryLevels = { Master: 0, Advanced: 0, Intermediate: 0, Novice: 0, Beginner: 0 };
    Object.values(algorithmMastery).forEach(stats => {
      const level = getMasteryLevel(stats).level;
      masteryLevels[level]++;
    });

    return {
      practiced,
      total: totalAlgorithms.size,
      coverage: Math.round((practiced / totalAlgorithms.size) * 100),
      masteryLevels
    };
  }, [algorithmMastery]);

  const AlgorithmCard = ({ algorithm, stats }) => {
    const mastery = getMasteryLevel(stats);
    const daysSinceLastPractice = stats.lastPracticed 
      ? Math.floor((new Date() - stats.lastPracticed) / (1000 * 60 * 60 * 24))
      : null;

    return (
      <div className={`algorithm-card ${viewMode}`}>
        <div className="algorithm-header">
          <h3>{algorithm}</h3>
          <div className="mastery-badge" style={{ backgroundColor: mastery.color }}>
            {mastery.level}
          </div>
        </div>

        <div className="algorithm-stats">
          <div className="stat-row">
            <span>Accuracy:</span>
            <span className="stat-value">{stats.accuracy}%</span>
          </div>
          <div className="stat-row">
            <span>Problems Solved:</span>
            <span className="stat-value">{stats.correct}/{stats.total}</span>
          </div>
          <div className="stat-row">
            <span>Available Problems:</span>
            <span className="stat-value">{stats.totalProblems}</span>
          </div>
          {stats.lastPracticed && (
            <div className="stat-row">
              <span>Last Practiced:</span>
              <span className="stat-value">{daysSinceLastPractice} days ago</span>
            </div>
          )}
        </div>

        <div className="mastery-progress">
          <div className="progress-bar">
            <div 
              className="progress-fill"
              style={{ 
                width: `${mastery.progress}%`,
                backgroundColor: mastery.color
              }}
            />
          </div>
          <span className="progress-text">{mastery.progress}%</span>
        </div>

        {viewMode === 'detailed' && (
          <div className="difficulty-breakdown">
            <h4>Problem Difficulty Distribution</h4>
            <div className="difficulty-bars">
              {Object.entries(stats.difficulty).map(([diff, count]) => (
                <div key={diff} className="difficulty-item">
                  <span className={`difficulty-label ${diff.toLowerCase()}`}>{diff}</span>
                  <div className="difficulty-bar-container">
                    <div 
                      className={`difficulty-bar ${diff.toLowerCase()}`}
                      style={{ width: `${stats.total > 0 ? (count / stats.total) * 100 : 0}%` }}
                    />
                    <span className="count">{count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="algorithm-actions">
          <button className="practice-btn">
            Practice ({stats.totalProblems} problems)
          </button>
          {stats.total === 0 && (
            <button className="learn-btn">
              Learn Algorithm
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="algorithm-mastery">
      {/* Header */}
      <div className="mastery-header">
        <h1>🎯 Algorithm Mastery</h1>
        <p>Track your progress across all algorithms and data structures</p>
      </div>

      {/* Overall Stats */}
      <div className="mastery-overview">
        <div className="overview-stats">
          <div className="overview-item">
            <span className="overview-number">{overallStats.practiced}</span>
            <span className="overview-label">Algorithms Practiced</span>
          </div>
          <div className="overview-item">
            <span className="overview-number">{overallStats.total}</span>
            <span className="overview-label">Total Algorithms</span>
          </div>
          <div className="overview-item">
            <span className="overview-number">{overallStats.coverage}%</span>
            <span className="overview-label">Coverage</span>
          </div>
        </div>

        <div className="mastery-distribution">
          <h3>Mastery Distribution</h3>
          <div className="mastery-chart">
            {Object.entries(overallStats.masteryLevels).map(([level, count]) => {
              const colors = {
                Master: '#4CAF50',
                Advanced: '#2196F3',
                Intermediate: '#FF9800',
                Novice: '#9C27B0',
                Beginner: '#9E9E9E'
              };
              
              return (
                <div key={level} className="mastery-bar-item">
                  <span className="mastery-label">{level}</span>
                  <div className="mastery-bar-container">
                    <div 
                      className="mastery-bar"
                      style={{ 
                        width: `${overallStats.practiced > 0 ? (count / overallStats.practiced) * 100 : 0}%`,
                        backgroundColor: colors[level]
                      }}
                    />
                    <span className="mastery-count">{count}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="mastery-controls">
        <div className="filter-section">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="category-select"
          >
            <option value="all">All Categories</option>
            {Object.keys(algorithmCategories).map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>

        <div className="sort-section">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="sort-select"
          >
            <option value="mastery">Sort by Mastery</option>
            <option value="accuracy">Sort by Accuracy</option>
            <option value="problems">Sort by Problems Solved</option>
            <option value="name">Sort by Name</option>
          </select>
        </div>

        <div className="view-controls">
          <button 
            className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
            onClick={() => setViewMode('grid')}
          >
            Grid
          </button>
          <button 
            className={`view-btn ${viewMode === 'detailed' ? 'active' : ''}`}
            onClick={() => setViewMode('detailed')}
          >
            Detailed
          </button>
        </div>
      </div>

      {/* Algorithms Grid */}
      <div className={`algorithms-container ${viewMode}`}>
        {filteredAlgorithms.map(([algorithm, stats]) => (
          <AlgorithmCard
            key={algorithm}
            algorithm={algorithm}
            stats={stats}
          />
        ))}
      </div>

      {/* Study Recommendations */}
      <div className="study-recommendations">
        <h2>📈 Study Recommendations</h2>
        <div className="recommendations-grid">
          {/* Weak Algorithms */}
          {Object.entries(algorithmMastery)
            .filter(([_, stats]) => stats.accuracy < 70 && stats.total >= 3)
            .slice(0, 3)
            .map(([algo, stats]) => (
              <div key={algo} className="recommendation-card weakness">
                <div className="recommendation-header">
                  <h3>⚠️ Needs Improvement</h3>
                  <span className="algorithm-name">{algo}</span>
                </div>
                <div className="recommendation-stats">
                  <span>Accuracy: {stats.accuracy}%</span>
                  <span>Problems: {stats.total}</span>
                </div>
                <button className="recommendation-action">
                  Practice More
                </button>
              </div>
            ))}

          {/* Strong Algorithms */}
          {Object.entries(algorithmMastery)
            .filter(([_, stats]) => stats.accuracy >= 90 && stats.total >= 10)
            .slice(0, 2)
            .map(([algo, stats]) => (
              <div key={algo} className="recommendation-card strength">
                <div className="recommendation-header">
                  <h3>💪 Mastered</h3>
                  <span className="algorithm-name">{algo}</span>
                </div>
                <div className="recommendation-stats">
                  <span>Accuracy: {stats.accuracy}%</span>
                  <span>Problems: {stats.total}</span>
                </div>
                <button className="recommendation-action">
                  Advanced Practice
                </button>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

export default AlgorithmMastery;