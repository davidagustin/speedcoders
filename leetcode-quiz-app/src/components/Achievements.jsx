import { useState, useMemo } from 'react';
import { allLeetcodeProblems, algorithmCategories } from '../data/allProblems';

function Achievements({ user }) {
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Calculate user achievements
  const userAchievements = useMemo(() => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const currentUser = users.find(u => u.id === user.id);
    
    if (!currentUser) return { earned: [], progress: {} };

    const totalXP = currentUser.totalXP || 0;
    const level = Math.floor(totalXP / 1000) + 1;
    const scores = currentUser.scores || [];
    
    // Calculate stats
    let totalQuizzes = scores.length;
    let totalCorrect = 0;
    let totalProblems = 0;
    let solvedProblems = new Set();
    let perfectScores = 0;
    let currentStreak = 0;
    let longestStreak = 0;
    let algorithmCounts = {};
    let difficultyCounts = { Easy: 0, Medium: 0, Hard: 0 };

    scores.forEach(score => {
      if (score.percentage === 100) perfectScores++;
      
      if (score.details) {
        score.details.forEach(detail => {
          totalProblems++;
          if (detail.isCorrect) {
            totalCorrect++;
            solvedProblems.add(detail.questionId);
          }
          
          difficultyCounts[detail.difficulty]++;
          
          detail.correctAnswer.forEach(algo => {
            algorithmCounts[algo] = (algorithmCounts[algo] || 0) + 1;
          });
        });
      }
    });

    // Calculate streak
    if (scores.length > 0) {
      const sortedScores = scores.sort((a, b) => new Date(b.date) - new Date(a.date));
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      let tempStreak = 0;
      for (let i = 0; i < sortedScores.length; i++) {
        const scoreDate = new Date(sortedScores[i].date);
        scoreDate.setHours(0, 0, 0, 0);
        
        const daysDiff = Math.floor((today - scoreDate) / (1000 * 60 * 60 * 24));
        
        if (daysDiff === tempStreak || (tempStreak === 0 && daysDiff <= 1)) {
          tempStreak = daysDiff === 0 ? tempStreak + 1 : 1;
          if (tempStreak > longestStreak) longestStreak = tempStreak;
        } else {
          break;
        }
      }
      currentStreak = tempStreak;
    }

    const accuracy = totalProblems > 0 ? Math.round((totalCorrect / totalProblems) * 100) : 0;

    // Define all achievements
    const allAchievements = [
      // Problem Solving Achievements
      {
        id: 'first_solve',
        category: 'problems',
        title: 'First Steps',
        description: 'Solve your first problem',
        icon: '🎯',
        color: '#4CAF50',
        requirement: 1,
        current: solvedProblems.size,
        type: 'problems_solved'
      },
      {
        id: 'problem_crusher_10',
        category: 'problems',
        title: 'Problem Crusher',
        description: 'Solve 10 problems',
        icon: '🥈',
        color: '#2196F3',
        requirement: 10,
        current: solvedProblems.size,
        type: 'problems_solved'
      },
      {
        id: 'problem_master_50',
        category: 'problems',
        title: 'Problem Master',
        description: 'Solve 50 problems',
        icon: '🏆',
        color: '#FF9800',
        requirement: 50,
        current: solvedProblems.size,
        type: 'problems_solved'
      },
      {
        id: 'centurion',
        category: 'problems',
        title: 'Centurion',
        description: 'Solve 100 problems',
        icon: '⚔️',
        color: '#9C27B0',
        requirement: 100,
        current: solvedProblems.size,
        type: 'problems_solved'
      },
      {
        id: 'legend',
        category: 'problems',
        title: 'Coding Legend',
        description: 'Solve 500 problems',
        icon: '👑',
        color: '#FFD700',
        requirement: 500,
        current: solvedProblems.size,
        type: 'problems_solved'
      },

      // Accuracy Achievements
      {
        id: 'accurate_archer',
        category: 'accuracy',
        title: 'Accurate Archer',
        description: 'Achieve 70% overall accuracy',
        icon: '🏹',
        color: '#4CAF50',
        requirement: 70,
        current: accuracy,
        type: 'accuracy'
      },
      {
        id: 'sharpshooter',
        category: 'accuracy',
        title: 'Sharpshooter',
        description: 'Achieve 85% overall accuracy',
        icon: '🎯',
        color: '#2196F3',
        requirement: 85,
        current: accuracy,
        type: 'accuracy'
      },
      {
        id: 'perfectionist',
        category: 'accuracy',
        title: 'Perfectionist',
        description: 'Achieve 95% overall accuracy',
        icon: '🌟',
        color: '#FFD700',
        requirement: 95,
        current: accuracy,
        type: 'accuracy'
      },

      // Quiz Performance Achievements
      {
        id: 'perfect_score',
        category: 'quiz',
        title: 'Perfect Score',
        description: 'Get 100% on a quiz',
        icon: '💯',
        color: '#4CAF50',
        requirement: 1,
        current: perfectScores,
        type: 'perfect_scores'
      },
      {
        id: 'consistent_performer',
        category: 'quiz',
        title: 'Consistent Performer',
        description: 'Get 100% on 5 quizzes',
        icon: '🎪',
        color: '#FF9800',
        requirement: 5,
        current: perfectScores,
        type: 'perfect_scores'
      },
      {
        id: 'quiz_master',
        category: 'quiz',
        title: 'Quiz Master',
        description: 'Complete 25 quizzes',
        icon: '🎓',
        color: '#9C27B0',
        requirement: 25,
        current: totalQuizzes,
        type: 'total_quizzes'
      },

      // Streak Achievements
      {
        id: 'getting_started',
        category: 'streak',
        title: 'Getting Started',
        description: 'Maintain a 3-day streak',
        icon: '🔥',
        color: '#FF5722',
        requirement: 3,
        current: Math.max(currentStreak, longestStreak),
        type: 'streak'
      },
      {
        id: 'on_fire',
        category: 'streak',
        title: 'On Fire',
        description: 'Maintain a 7-day streak',
        icon: '🚀',
        color: '#FF9800',
        requirement: 7,
        current: Math.max(currentStreak, longestStreak),
        type: 'streak'
      },
      {
        id: 'unstoppable',
        category: 'streak',
        title: 'Unstoppable',
        description: 'Maintain a 30-day streak',
        icon: '⚡',
        color: '#FFD700',
        requirement: 30,
        current: Math.max(currentStreak, longestStreak),
        type: 'streak'
      },

      // Level Achievements
      {
        id: 'novice',
        category: 'level',
        title: 'Novice',
        description: 'Reach Level 5',
        icon: '🌱',
        color: '#8BC34A',
        requirement: 5,
        current: level,
        type: 'level'
      },
      {
        id: 'intermediate',
        category: 'level',
        title: 'Intermediate',
        description: 'Reach Level 10',
        icon: '🌟',
        color: '#2196F3',
        requirement: 10,
        current: level,
        type: 'level'
      },
      {
        id: 'expert',
        category: 'level',
        title: 'Expert',
        description: 'Reach Level 20',
        icon: '💎',
        color: '#9C27B0',
        requirement: 20,
        current: level,
        type: 'level'
      },

      // Difficulty Achievements
      {
        id: 'easy_explorer',
        category: 'difficulty',
        title: 'Easy Explorer',
        description: 'Solve 25 Easy problems',
        icon: '🟢',
        color: '#4CAF50',
        requirement: 25,
        current: difficultyCounts.Easy,
        type: 'difficulty_easy'
      },
      {
        id: 'medium_challenger',
        category: 'difficulty',
        title: 'Medium Challenger',
        description: 'Solve 25 Medium problems',
        icon: '🟡',
        color: '#FF9800',
        requirement: 25,
        current: difficultyCounts.Medium,
        type: 'difficulty_medium'
      },
      {
        id: 'hard_warrior',
        category: 'difficulty',
        title: 'Hard Warrior',
        description: 'Solve 10 Hard problems',
        icon: '🔴',
        color: '#F44336',
        requirement: 10,
        current: difficultyCounts.Hard,
        type: 'difficulty_hard'
      },

      // Special Achievements
      {
        id: 'algorithm_enthusiast',
        category: 'special',
        title: 'Algorithm Enthusiast',
        description: 'Practice 20 different algorithms',
        icon: '🧠',
        color: '#607D8B',
        requirement: 20,
        current: Object.keys(algorithmCounts).length,
        type: 'algorithms_practiced'
      },
      {
        id: 'early_bird',
        category: 'special',
        title: 'Early Bird',
        description: 'Complete a quiz before 8 AM',
        icon: '🌅',
        color: '#FF9800',
        requirement: 1,
        current: 0, // This would need time-based tracking
        type: 'early_morning_quiz'
      },
      {
        id: 'night_owl',
        category: 'special',
        title: 'Night Owl',
        description: 'Complete a quiz after 10 PM',
        icon: '🦉',
        color: '#3F51B5',
        requirement: 1,
        current: 0, // This would need time-based tracking
        type: 'late_night_quiz'
      }
    ];

    // Determine earned and progress
    const earned = [];
    const progress = {};

    allAchievements.forEach(achievement => {
      const isEarned = achievement.current >= achievement.requirement;
      
      if (isEarned) {
        earned.push(achievement);
      }
      
      progress[achievement.id] = {
        ...achievement,
        earned: isEarned,
        progress: Math.min(100, Math.round((achievement.current / achievement.requirement) * 100))
      };
    });

    return { earned, progress, allAchievements };
  }, [user]);

  const filteredAchievements = useMemo(() => {
    const achievements = Object.values(userAchievements.progress);
    if (selectedCategory === 'all') return achievements;
    return achievements.filter(a => a.category === selectedCategory);
  }, [userAchievements.progress, selectedCategory]);

  const categoryStats = useMemo(() => {
    const stats = {};
    Object.values(userAchievements.progress).forEach(achievement => {
      if (!stats[achievement.category]) {
        stats[achievement.category] = { earned: 0, total: 0 };
      }
      stats[achievement.category].total++;
      if (achievement.earned) {
        stats[achievement.category].earned++;
      }
    });
    return stats;
  }, [userAchievements.progress]);

  const AchievementCard = ({ achievement }) => {
    const { earned, progress } = achievement;
    
    return (
      <div className={`achievement-card ${earned ? 'earned' : 'locked'}`}>
        <div className="achievement-icon" style={{ backgroundColor: achievement.color }}>
          {achievement.icon}
          {earned && <div className="earned-indicator">✓</div>}
        </div>
        
        <div className="achievement-info">
          <h3>{achievement.title}</h3>
          <p>{achievement.description}</p>
          
          <div className="achievement-progress">
            <div className="progress-bar">
              <div 
                className="progress-fill"
                style={{ 
                  width: `${progress}%`,
                  backgroundColor: achievement.color
                }}
              />
            </div>
            <div className="progress-text">
              {achievement.current}/{achievement.requirement}
              {!earned && ` (${progress}%)`}
            </div>
          </div>
        </div>
        
        {earned && (
          <div className="achievement-date">
            Earned: Recently
          </div>
        )}
      </div>
    );
  };

  const categories = [
    { id: 'all', name: 'All Categories', icon: '🏆' },
    { id: 'problems', name: 'Problem Solving', icon: '🎯' },
    { id: 'accuracy', name: 'Accuracy', icon: '🏹' },
    { id: 'quiz', name: 'Quiz Performance', icon: '🎪' },
    { id: 'streak', name: 'Streaks', icon: '🔥' },
    { id: 'level', name: 'Level Progress', icon: '⭐' },
    { id: 'difficulty', name: 'Difficulty', icon: '⚡' },
    { id: 'special', name: 'Special', icon: '✨' }
  ];

  return (
    <div className="achievements">
      {/* Header */}
      <div className="achievements-header">
        <h1>🏆 Achievements</h1>
        <p>Track your coding journey and celebrate your progress</p>
      </div>

      {/* Overview Stats */}
      <div className="achievements-overview">
        <div className="overview-stats">
          <div className="overview-item">
            <span className="overview-number">{userAchievements.earned.length}</span>
            <span className="overview-label">Earned</span>
          </div>
          <div className="overview-item">
            <span className="overview-number">{userAchievements.allAchievements.length}</span>
            <span className="overview-label">Total</span>
          </div>
          <div className="overview-item">
            <span className="overview-number">
              {Math.round((userAchievements.earned.length / userAchievements.allAchievements.length) * 100)}%
            </span>
            <span className="overview-label">Completion</span>
          </div>
        </div>

        <div className="recent-achievements">
          <h3>🎉 Recent Achievements</h3>
          <div className="recent-list">
            {userAchievements.earned.slice(-3).map(achievement => (
              <div key={achievement.id} className="recent-achievement">
                <div className="recent-icon" style={{ backgroundColor: achievement.color }}>
                  {achievement.icon}
                </div>
                <div className="recent-info">
                  <h4>{achievement.title}</h4>
                  <p>{achievement.description}</p>
                </div>
              </div>
            ))}
            {userAchievements.earned.length === 0 && (
              <p className="no-achievements">Complete your first quiz to start earning achievements!</p>
            )}
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="achievements-filter">
        <div className="category-tabs">
          {categories.map(category => (
            <button
              key={category.id}
              className={`category-tab ${selectedCategory === category.id ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category.id)}
            >
              <span className="tab-icon">{category.icon}</span>
              <span className="tab-name">{category.name}</span>
              {category.id !== 'all' && categoryStats[category.id] && (
                <span className="tab-count">
                  {categoryStats[category.id].earned}/{categoryStats[category.id].total}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Achievements Grid */}
      <div className="achievements-grid">
        {filteredAchievements
          .sort((a, b) => {
            // Sort: earned first, then by progress
            if (a.earned !== b.earned) {
              return a.earned ? -1 : 1;
            }
            return b.progress - a.progress;
          })
          .map(achievement => (
            <AchievementCard key={achievement.id} achievement={achievement} />
          ))}
      </div>

      {/* Achievement Suggestions */}
      <div className="achievement-suggestions">
        <h2>🎯 Close to Earning</h2>
        <div className="suggestions-grid">
          {filteredAchievements
            .filter(a => !a.earned && a.progress >= 50)
            .slice(0, 6)
            .map(achievement => (
              <div key={achievement.id} className="suggestion-card">
                <div className="suggestion-icon" style={{ backgroundColor: achievement.color }}>
                  {achievement.icon}
                </div>
                <div className="suggestion-info">
                  <h3>{achievement.title}</h3>
                  <div className="suggestion-progress">
                    <div className="progress-bar small">
                      <div 
                        className="progress-fill"
                        style={{ 
                          width: `${achievement.progress}%`,
                          backgroundColor: achievement.color
                        }}
                      />
                    </div>
                    <span>
                      {achievement.requirement - achievement.current} more to go!
                    </span>
                  </div>
                </div>
              </div>
            ))}
        </div>
        
        {filteredAchievements.filter(a => !a.earned && a.progress >= 50).length === 0 && (
          <p className="no-suggestions">
            Keep practicing to get closer to earning new achievements!
          </p>
        )}
      </div>

      {/* Achievement Tips */}
      <div className="achievement-tips">
        <h2>💡 Tips for Earning More Achievements</h2>
        <div className="tips-grid">
          <div className="tip-card">
            <div className="tip-icon">🎯</div>
            <h3>Daily Practice</h3>
            <p>Solve at least one problem daily to build streaks and earn consistency achievements.</p>
          </div>
          
          <div className="tip-card">
            <div className="tip-icon">📚</div>
            <h3>Try Different Difficulties</h3>
            <p>Challenge yourself with Medium and Hard problems to unlock difficulty-based achievements.</p>
          </div>
          
          <div className="tip-card">
            <div className="tip-icon">🧠</div>
            <h3>Explore New Algorithms</h3>
            <p>Practice diverse algorithm types to earn the Algorithm Enthusiast achievement.</p>
          </div>
          
          <div className="tip-card">
            <div className="tip-icon">🎪</div>
            <h3>Perfect Your Scores</h3>
            <p>Aim for 100% accuracy on quizzes to earn performance-based achievements.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Achievements;