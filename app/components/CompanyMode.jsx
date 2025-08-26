import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { allLeetcodeProblems, companyTags } from '../data/allProblems';

function CompanyMode({ user }) {
  const navigate = useNavigate();
  const [selectedCompany, setSelectedCompany] = useState(null);

  const companyInfo = {
    "Google": {
      description: "Focus on system design, algorithms, and coding efficiency",
      color: "#4285f4",
      logo: "🔍",
      difficulty: "High",
      commonTopics: ["Arrays", "Dynamic Programming", "Graph", "Tree", "System Design"],
      interviewStyle: "Technical depth with real-world applications"
    },
    "Amazon": {
      description: "Leadership principles and scalable solutions",
      color: "#ff9900",
      logo: "📦",
      difficulty: "Medium-High",
      commonTopics: ["Arrays", "String", "Tree", "Graph", "Design Patterns"],
      interviewStyle: "Behavioral + Technical with leadership scenarios"
    },
    "Microsoft": {
      description: "Problem-solving and system architecture",
      color: "#00a4ef",
      logo: "🪟",
      difficulty: "Medium",
      commonTopics: ["Dynamic Programming", "Tree", "Graph", "String", "Math"],
      interviewStyle: "Collaborative problem solving"
    },
    "Facebook": {
      description: "Product thinking and technical excellence",
      color: "#1877f2",
      logo: "👥",
      difficulty: "High",
      commonTopics: ["Graph", "Array", "Hash Table", "Dynamic Programming", "BFS/DFS"],
      interviewStyle: "Product-focused technical questions"
    },
    "Apple": {
      description: "Attention to detail and optimal solutions",
      color: "#007aff",
      logo: "🍎",
      difficulty: "Medium-High",
      commonTopics: ["Array", "String", "Tree", "Math", "Bit Manipulation"],
      interviewStyle: "Clean code and optimization focus"
    },
    "Netflix": {
      description: "Scale and performance optimization",
      color: "#e50914",
      logo: "🎬",
      difficulty: "High",
      commonTopics: ["System Design", "Distributed Systems", "Caching", "Algorithms"],
      interviewStyle: "Scale-focused technical challenges"
    }
  };

  const getCompanyStats = (company) => {
    const problemIds = companyTags[company] || [];
    const problems = allLeetcodeProblems.filter(p => problemIds.includes(p.id));
    
    const difficultyCount = problems.reduce((acc, p) => {
      acc[p.difficulty] = (acc[p.difficulty] || 0) + 1;
      return acc;
    }, {});

    const algorithmCount = {};
    problems.forEach(p => {
      p.correctAlgorithms.forEach(algo => {
        algorithmCount[algo] = (algorithmCount[algo] || 0) + 1;
      });
    });

    const topAlgorithms = Object.entries(algorithmCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([algo, count]) => ({ algorithm: algo, count }));

    return {
      total: problems.length,
      difficulty: difficultyCount,
      topAlgorithms,
      problems
    };
  };

  const getUserCompanyProgress = (company) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const currentUser = users.find(u => u.id === user.id);
    
    if (!currentUser?.scores) return { solved: 0, accuracy: 0 };

    const companyProblemIds = new Set(companyTags[company] || []);
    let solved = 0;
    let total = 0;
    let correct = 0;

    currentUser.scores.forEach(score => {
      if (score.details) {
        score.details.forEach(detail => {
          if (companyProblemIds.has(detail.questionId)) {
            total++;
            if (detail.isCorrect) {
              correct++;
              solved++;
            }
          }
        });
      }
    });

    return {
      solved,
      total,
      accuracy: total > 0 ? Math.round((correct / total) * 100) : 0
    };
  };

  const startCompanyQuiz = (company, mode = 'mixed') => {
    navigate('/quiz', { 
      state: { 
        mode: 'company', 
        company,
        difficulty: mode === 'mixed' ? 'Mixed' : mode
      } 
    });
  };

  return (
    <div className="company-mode">
      <div className="company-header">
        <h1>🏢 Company Interview Prep</h1>
        <p>Practice with problems commonly asked at top tech companies</p>
      </div>

      <div className="companies-grid">
        {Object.entries(companyInfo).map(([company, info]) => {
          const stats = getCompanyStats(company);
          const progress = getUserCompanyProgress(company);
          
          return (
            <div 
              key={company}
              className="company-card"
              style={{ borderColor: info.color }}
              onClick={() => setSelectedCompany(selectedCompany === company ? null : company)}
            >
              <div className="company-header">
                <div className="company-logo" style={{ backgroundColor: info.color }}>
                  {info.logo}
                </div>
                <div className="company-info">
                  <h3>{company}</h3>
                  <p>{info.description}</p>
                </div>
                <div className="company-difficulty">
                  <span className={`difficulty-badge ${info.difficulty.toLowerCase().replace('-', '_')}`}>
                    {info.difficulty}
                  </span>
                </div>
              </div>

              <div className="company-stats">
                <div className="stat-item">
                  <span className="stat-value">{stats.total}</span>
                  <span className="stat-label">Problems</span>
                </div>
                <div className="stat-item">
                  <span className="stat-value">{progress.solved}</span>
                  <span className="stat-label">Solved</span>
                </div>
                <div className="stat-item">
                  <span className="stat-value">{progress.accuracy}%</span>
                  <span className="stat-label">Accuracy</span>
                </div>
              </div>

              <div className="company-progress">
                <div className="progress-bar">
                  <div 
                    className="progress-fill"
                    style={{ 
                      width: `${stats.total > 0 ? (progress.solved / stats.total) * 100 : 0}%`,
                      backgroundColor: info.color 
                    }}
                  />
                </div>
                <span className="progress-text">
                  {stats.total > 0 ? Math.round((progress.solved / stats.total) * 100) : 0}% Complete
                </span>
              </div>

              {selectedCompany === company && (
                <div className="company-details">
                  <div className="interview-info">
                    <h4>Interview Style</h4>
                    <p>{info.interviewStyle}</p>
                  </div>

                  <div className="common-topics">
                    <h4>Common Topics</h4>
                    <div className="topics-list">
                      {info.commonTopics.map(topic => (
                        <span key={topic} className="topic-tag">
                          {topic}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="difficulty-breakdown">
                    <h4>Problem Difficulty</h4>
                    <div className="difficulty-chart">
                      {Object.entries(stats.difficulty).map(([diff, count]) => (
                        <div key={diff} className="difficulty-item">
                          <span className={`difficulty-label ${diff.toLowerCase()}`}>
                            {diff}
                          </span>
                          <div className="difficulty-bar-container">
                            <div 
                              className={`difficulty-bar ${diff.toLowerCase()}`}
                              style={{ 
                                width: `${(count / stats.total) * 100}%`
                              }}
                            />
                            <span className="count">{count}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="top-algorithms">
                    <h4>Most Common Algorithms</h4>
                    <div className="algorithms-list">
                      {stats.topAlgorithms.map(({ algorithm, count }) => (
                        <div key={algorithm} className="algorithm-item">
                          <span>{algorithm}</span>
                          <span className="count">{count}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="quiz-options">
                    <h4>Start Practice</h4>
                    <div className="quiz-buttons">
                      <button 
                        className="quiz-btn mixed"
                        onClick={(e) => {
                          e.stopPropagation();
                          startCompanyQuiz(company, 'mixed');
                        }}
                      >
                        Mixed Quiz
                      </button>
                      <button 
                        className="quiz-btn easy"
                        onClick={(e) => {
                          e.stopPropagation();
                          startCompanyQuiz(company, 'Easy');
                        }}
                      >
                        Easy
                      </button>
                      <button 
                        className="quiz-btn medium"
                        onClick={(e) => {
                          e.stopPropagation();
                          startCompanyQuiz(company, 'Medium');
                        }}
                      >
                        Medium
                      </button>
                      <button 
                        className="quiz-btn hard"
                        onClick={(e) => {
                          e.stopPropagation();
                          startCompanyQuiz(company, 'Hard');
                        }}
                      >
                        Hard
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="company-insights">
        <h2>💡 Interview Preparation Tips</h2>
        <div className="tips-grid">
          <div className="tip-card">
            <div className="tip-icon">🎯</div>
            <h3>Focus on Fundamentals</h3>
            <p>Master arrays, strings, and basic data structures first. They appear in 80% of interviews.</p>
          </div>
          
          <div className="tip-card">
            <div className="tip-icon">⏱️</div>
            <h3>Practice Time Management</h3>
            <p>Aim for 15-20 minutes per medium problem. Speed comes with consistent practice.</p>
          </div>
          
          <div className="tip-card">
            <div className="tip-icon">🗣️</div>
            <h3>Think Out Loud</h3>
            <p>Explain your approach before coding. Interviewers want to understand your thought process.</p>
          </div>
          
          <div className="tip-card">
            <div className="tip-icon">🔍</div>
            <h3>Ask Clarifying Questions</h3>
            <p>Understand the problem fully. Edge cases, constraints, and expected output format.</p>
          </div>
        </div>
      </div>

      <div className="study-plan">
        <h2>📚 Company-Specific Study Plans</h2>
        <div className="plan-grid">
          <div className="plan-card">
            <h3>🎯 2-Week Intensive</h3>
            <div className="plan-schedule">
              <div>Week 1: Easy + Medium problems</div>
              <div>Week 2: Hard problems + Mock interviews</div>
            </div>
            <div className="plan-stats">
              <span>14 days • 50 problems</span>
            </div>
          </div>
          
          <div className="plan-card">
            <h3>📈 1-Month Comprehensive</h3>
            <div className="plan-schedule">
              <div>Week 1-2: Foundation building</div>
              <div>Week 3-4: Company-specific practice</div>
            </div>
            <div className="plan-stats">
              <span>30 days • 120 problems</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CompanyMode;