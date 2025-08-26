import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { allLeetcodeProblems, algorithmCategories, companyTags, difficultyStats } from '../data/allProblems';

function ProblemBrowser({ user }) {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    difficulty: 'all',
    algorithm: 'all',
    company: 'all',
    category: 'all',
    solved: 'all'
  });
  const [sortBy, setSortBy] = useState('id');
  const [viewMode, setViewMode] = useState('grid'); // grid, list, detailed
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProblems, setSelectedProblems] = useState(new Set());
  const problemsPerPage = viewMode === 'detailed' ? 10 : 20;

  // Get user's solved problems
  const solvedProblems = useMemo(() => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const currentUser = users.find(u => u.id === user.id);
    const solved = new Set();
    
    if (currentUser?.scores) {
      currentUser.scores.forEach(score => {
        if (score.details) {
          score.details.forEach(detail => {
            if (detail.isCorrect) {
              solved.add(detail.questionId);
            }
          });
        }
      });
    }
    return solved;
  }, [user]);

  // Get all unique algorithms
  const allAlgorithms = useMemo(() => {
    const algorithms = new Set();
    allLeetcodeProblems.forEach(problem => {
      problem.correctAlgorithms.forEach(algo => algorithms.add(algo));
    });
    return Array.from(algorithms).sort();
  }, []);

  // Filter and sort problems
  const filteredProblems = useMemo(() => {
    let filtered = allLeetcodeProblems.filter(problem => {
      // Search filter
      const matchesSearch = problem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           problem.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           problem.id.toString().includes(searchTerm);
      
      // Difficulty filter
      const matchesDifficulty = filters.difficulty === 'all' || problem.difficulty === filters.difficulty;
      
      // Algorithm filter
      const matchesAlgorithm = filters.algorithm === 'all' || 
                              problem.correctAlgorithms.includes(filters.algorithm);
      
      // Company filter
      const matchesCompany = filters.company === 'all' || 
                            (companyTags[filters.company] && companyTags[filters.company].includes(problem.id));
      
      // Category filter
      const matchesCategory = filters.category === 'all' || 
                             (algorithmCategories[filters.category] && 
                              problem.correctAlgorithms.some(algo => 
                                algorithmCategories[filters.category].includes(algo)));
      
      // Solved filter
      const isSolved = solvedProblems.has(problem.id);
      const matchesSolved = filters.solved === 'all' || 
                           (filters.solved === 'solved' && isSolved) ||
                           (filters.solved === 'unsolved' && !isSolved);
      
      return matchesSearch && matchesDifficulty && matchesAlgorithm && 
             matchesCompany && matchesCategory && matchesSolved;
    });

    // Sort problems
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'title':
          return a.title.localeCompare(b.title);
        case 'difficulty':
          const diffOrder = { 'Easy': 1, 'Medium': 2, 'Hard': 3 };
          return diffOrder[a.difficulty] - diffOrder[b.difficulty];
        case 'id':
        default:
          return a.id - b.id;
      }
    });

    return filtered;
  }, [searchTerm, filters, sortBy, solvedProblems]);

  // Pagination
  const totalPages = Math.ceil(filteredProblems.length / problemsPerPage);
  const startIndex = (currentPage - 1) * problemsPerPage;
  const currentProblems = filteredProblems.slice(startIndex, startIndex + problemsPerPage);

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({ ...prev, [filterType]: value }));
    setCurrentPage(1);
  };

  const toggleProblemSelection = (problemId) => {
    setSelectedProblems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(problemId)) {
        newSet.delete(problemId);
      } else {
        newSet.add(problemId);
      }
      return newSet;
    });
  };

  const createCustomQuiz = () => {
    if (selectedProblems.size === 0) {
      alert('Please select at least one problem for your custom quiz.');
      return;
    }
    
    const selectedProblemsList = Array.from(selectedProblems);
    const selectedProblemsData = allLeetcodeProblems.filter(p => 
      selectedProblems.has(p.id)
    );
    
    // Navigate to quiz with custom problems
    navigate('/quiz', { 
      state: { 
        mode: 'custom', 
        customProblems: selectedProblemsData,
        questionCount: selectedProblems.size,
        timeLimit: selectedProblems.size * 60 // 1 minute per problem
      } 
    });
  };

  const ProblemCard = ({ problem, isSelected, onToggleSelect }) => {
    const isSolved = solvedProblems.has(problem.id);
    
    return (
      <div className={`problem-card ${viewMode} ${isSolved ? 'solved' : ''}`}>
        {viewMode !== 'list' && (
          <div className="problem-header">
            <input
              type="checkbox"
              checked={isSelected}
              onChange={() => onToggleSelect(problem.id)}
              className="problem-checkbox"
            />
            <span className="problem-id">#{problem.id}</span>
            <span className={`difficulty-badge ${problem.difficulty.toLowerCase()}`}>
              {problem.difficulty}
            </span>
            {isSolved && <span className="solved-badge">✓</span>}
          </div>
        )}
        
        <h3 className="problem-title">{problem.title}</h3>
        
        {viewMode === 'detailed' && (
          <p className="problem-description">{problem.description}</p>
        )}
        
        <div className="problem-algorithms">
          {problem.correctAlgorithms.slice(0, viewMode === 'detailed' ? 10 : 3).map(algo => (
            <span key={algo} className="algorithm-tag">
              {algo}
            </span>
          ))}
          {problem.correctAlgorithms.length > (viewMode === 'detailed' ? 10 : 3) && (
            <span className="more-algorithms">
              +{problem.correctAlgorithms.length - (viewMode === 'detailed' ? 10 : 3)} more
            </span>
          )}
        </div>
        
        <div className="problem-actions">
          <a 
            href={problem.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="leetcode-btn"
          >
            LeetCode →
          </a>
          {viewMode === 'detailed' && (
            <button className="practice-btn">
              Practice
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="problem-browser">
      {/* Header Stats */}
      <div className="browser-header">
        <div className="header-info">
          <h1>🔍 Problem Browser</h1>
          <div className="quick-stats">
            <div className="stat-item">
              <span className="stat-value">{filteredProblems.length}</span>
              <span className="stat-label">Problems Found</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{solvedProblems.size}</span>
              <span className="stat-label">Solved</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{selectedProblems.size}</span>
              <span className="stat-label">Selected</span>
            </div>
          </div>
        </div>
        
        <div className="header-actions">
          <button 
            className="custom-quiz-btn"
            onClick={createCustomQuiz}
            disabled={selectedProblems.size === 0}
          >
            Create Quiz ({selectedProblems.size})
          </button>
        </div>
      </div>

      {/* Database Overview */}
      <div className="database-overview">
        <div className="overview-stats">
          <div className="overview-item">
            <span className="overview-number">{difficultyStats.total}</span>
            <span className="overview-label">Total Problems</span>
          </div>
          <div className="overview-item easy">
            <span className="overview-number">{difficultyStats.easy}</span>
            <span className="overview-label">Easy</span>
          </div>
          <div className="overview-item medium">
            <span className="overview-number">{difficultyStats.medium}</span>
            <span className="overview-label">Medium</span>
          </div>
          <div className="overview-item hard">
            <span className="overview-number">{difficultyStats.hard}</span>
            <span className="overview-label">Hard</span>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="browser-controls">
        <div className="search-section">
          <input
            type="text"
            placeholder="Search by title, description, or ID..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="search-input"
          />
        </div>
        
        <div className="filters-section">
          <select
            value={filters.difficulty}
            onChange={(e) => handleFilterChange('difficulty', e.target.value)}
            className="filter-select"
          >
            <option value="all">All Difficulties</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>

          <select
            value={filters.algorithm}
            onChange={(e) => handleFilterChange('algorithm', e.target.value)}
            className="filter-select"
          >
            <option value="all">All Algorithms</option>
            {allAlgorithms.map(algo => (
              <option key={algo} value={algo}>{algo}</option>
            ))}
          </select>

          <select
            value={filters.company}
            onChange={(e) => handleFilterChange('company', e.target.value)}
            className="filter-select"
          >
            <option value="all">All Companies</option>
            {Object.keys(companyTags).map(company => (
              <option key={company} value={company}>{company}</option>
            ))}
          </select>

          <select
            value={filters.category}
            onChange={(e) => handleFilterChange('category', e.target.value)}
            className="filter-select"
          >
            <option value="all">All Categories</option>
            {Object.keys(algorithmCategories).map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>

          <select
            value={filters.solved}
            onChange={(e) => handleFilterChange('solved', e.target.value)}
            className="filter-select"
          >
            <option value="all">All Problems</option>
            <option value="solved">Solved</option>
            <option value="unsolved">Unsolved</option>
          </select>
        </div>

        <div className="view-controls">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="sort-select"
          >
            <option value="id">Sort by ID</option>
            <option value="title">Sort by Title</option>
            <option value="difficulty">Sort by Difficulty</option>
          </select>

          <div className="view-mode-toggle">
            <button 
              className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
            >
              Grid
            </button>
            <button 
              className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
            >
              List
            </button>
            <button 
              className={`view-btn ${viewMode === 'detailed' ? 'active' : ''}`}
              onClick={() => setViewMode('detailed')}
            >
              Detailed
            </button>
          </div>
        </div>
      </div>

      {/* Results Info */}
      <div className="results-info">
        <span>
          Showing {startIndex + 1}-{Math.min(startIndex + problemsPerPage, filteredProblems.length)} 
          of {filteredProblems.length} problems
        </span>
        <span>
          Solved: {Array.from(solvedProblems).filter(id => 
            filteredProblems.some(p => p.id === id)
          ).length}
        </span>
      </div>

      {/* Problems Grid/List */}
      <div className={`problems-container ${viewMode}`}>
        {currentProblems.map(problem => (
          <ProblemCard
            key={problem.id}
            problem={problem}
            isSelected={selectedProblems.has(problem.id)}
            onToggleSelect={toggleProblemSelection}
          />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination">
          <button
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="page-btn"
          >
            ← Previous
          </button>
          
          <div className="page-numbers">
            {[...Array(Math.min(5, totalPages))].map((_, index) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = index + 1;
              } else if (currentPage <= 3) {
                pageNum = index + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + index;
              } else {
                pageNum = currentPage - 2 + index;
              }
              
              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`page-btn ${currentPage === pageNum ? 'active' : ''}`}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>
          
          <button
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
            className="page-btn"
          >
            Next →
          </button>
        </div>
      )}

      {/* Quick Actions */}
      <div className="quick-actions-bar">
        <button onClick={() => setSelectedProblems(new Set())}>
          Clear Selection
        </button>
        <button onClick={() => {
          const allIds = new Set(currentProblems.map(p => p.id));
          setSelectedProblems(allIds);
        }}>
          Select All on Page
        </button>
        <button onClick={() => {
          const unsolvedIds = new Set(
            currentProblems.filter(p => !solvedProblems.has(p.id)).map(p => p.id)
          );
          setSelectedProblems(unsolvedIds);
        }}>
          Select Unsolved
        </button>
      </div>
    </div>
  );
}

export default ProblemBrowser;