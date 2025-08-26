"use client";

import { useState, useEffect, useMemo, useRef } from 'react';
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  CheckIcon,
  PlayIcon,
  StarIcon,
  ClockIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';
import { comprehensiveProblems, algorithmCategories } from '@/lib/data/comprehensive-problems';

interface EnhancedProblemBrowserProps {
  onSelectProblems: (problems: string[]) => void;
  onCreateQuiz: (problems: string[]) => void;
}

interface Problem {
  id: number;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: string;
  algorithms: string[];
  description: string;
  examples?: Array<{ input: string; output: string; explanation?: string }>;
  constraints?: string[];
  companies?: string[];
  editorial?: any;
  leetcodeUrl: string;
}

export default function EnhancedProblemBrowser({ onSelectProblems, onCreateQuiz }: EnhancedProblemBrowserProps) {
  const [problems, setProblems] = useState<Problem[]>(comprehensiveProblems);
  const [selectedProblems, setSelectedProblems] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    difficulties: [] as string[],
    algorithms: [] as string[],
    categories: [] as string[],
    companies: [] as string[],
    solved: 'all' as string,
    hasEditorial: false,
    isPremium: false,
  });
  const [showFilters, setShowFilters] = useState(false);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [savedSearches, setSavedSearches] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('id');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Filtered problems based on search and filters
  const filteredProblems = useMemo(() => {
    let filtered = problems;

    // Search filter
    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase();
      filtered = filtered.filter(problem =>
        problem.title.toLowerCase().includes(searchLower) ||
        problem.description.toLowerCase().includes(searchLower) ||
        problem.algorithms.some(alg => alg.toLowerCase().includes(searchLower)) ||
        problem.category.toLowerCase().includes(searchLower)
      );
    }

    // Difficulty filter
    if (filters.difficulties.length > 0) {
      filtered = filtered.filter(problem => filters.difficulties.includes(problem.difficulty));
    }

    // Category filter
    if (filters.categories.length > 0) {
      filtered = filtered.filter(problem => filters.categories.includes(problem.category));
    }

    // Algorithm filter
    if (filters.algorithms.length > 0) {
      filtered = filtered.filter(problem =>
        problem.algorithms.some(alg => filters.algorithms.includes(alg))
      );
    }

    // Company filter
    if (filters.companies.length > 0) {
      filtered = filtered.filter(problem =>
        problem.companies?.some(company => filters.companies.includes(company))
      );
    }

    // Editorial filter
    if (filters.hasEditorial) {
      filtered = filtered.filter(problem => problem.editorial);
    }

    return filtered;
  }, [problems, searchQuery, filters]);

  // Sorted problems
  const sortedProblems = useMemo(() => {
    return [...filteredProblems].sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'id':
          comparison = a.id - b.id;
          break;
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
        case 'difficulty':
          const difficultyOrder = { 'Easy': 1, 'Medium': 2, 'Hard': 3 };
          comparison = difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty];
          break;
        case 'category':
          comparison = a.category.localeCompare(b.category);
          break;
        default:
          comparison = 0;
      }
      return sortOrder === 'desc' ? -comparison : comparison;
    });
  }, [filteredProblems, sortBy, sortOrder]);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      setSearchHistory(prev => {
        const newHistory = [searchQuery, ...prev.filter(item => item !== searchQuery)].slice(0, 10);
        return newHistory;
      });
    }
  };

  const handleSaveSearch = () => {
    if (searchQuery.trim() && !savedSearches.includes(searchQuery)) {
      setSavedSearches(prev => [...prev, searchQuery]);
    }
  };

  const handleLoadSearch = (search: string) => {
    setSearchQuery(search);
    searchInputRef.current?.focus();
  };

  const handleProblemToggle = (problemId: string) => {
    setSelectedProblems(prev => 
      prev.includes(problemId) 
        ? prev.filter(id => id !== problemId)
        : [...prev, problemId]
    );
  };

  const handleCreateQuiz = () => {
    if (selectedProblems.length > 0) {
      onCreateQuiz(selectedProblems);
    }
  };

  const clearSelection = () => {
    setSelectedProblems([]);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'text-green-600 bg-green-100';
      case 'Medium': return 'text-yellow-600 bg-yellow-100';
      case 'Hard': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const allCategories = Array.from(new Set(problems.map(p => p.category))).sort();
  const allDifficulties = ['Easy', 'Medium', 'Hard'];
  const allAlgorithms = Array.from(new Set(problems.flatMap(p => p.algorithms))).sort();
  const allCompanies = Array.from(new Set(problems.flatMap(p => p.companies || []))).sort();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Enhanced Problem Browser</h2>
          <p className="text-gray-600">Advanced search and filtering for algorithm problems</p>
        </div>
        {selectedProblems.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">{selectedProblems.length} selected</span>
            <button
              onClick={clearSelection}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Clear
            </button>
            <button
              onClick={handleCreateQuiz}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <PlayIcon className="h-4 w-4 mr-2" />
              Create Quiz
            </button>
          </div>
        )}
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search problems by title, description, algorithm, or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleSearch}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Search
            </button>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <FunnelIcon className="h-5 w-5 mr-2" />
              Filters
            </button>
            <button
              onClick={handleSaveSearch}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Save Search
            </button>
          </div>
        </div>
      </div>

      {/* Search History and Saved Searches */}
      {(searchHistory.length > 0 || savedSearches.length > 0) && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {searchHistory.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-3">Recent Searches</h3>
                <div className="flex flex-wrap gap-2">
                  {searchHistory.slice(0, 5).map((search, index) => (
                    <button
                      key={index}
                      onClick={() => handleLoadSearch(search)}
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors"
                    >
                      {search}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {savedSearches.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-3">Saved Searches</h3>
                <div className="flex flex-wrap gap-2">
                  {savedSearches.slice(0, 5).map((search, index) => (
                    <button
                      key={index}
                      onClick={() => handleLoadSearch(search)}
                      className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm hover:bg-blue-200 transition-colors"
                    >
                      {search}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Filters */}
      {showFilters && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Advanced Filters</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Difficulty Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty</label>
              <div className="space-y-2">
                {allDifficulties.map(difficulty => (
                  <label key={difficulty} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.difficulties.includes(difficulty)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFilters(prev => ({
                            ...prev,
                            difficulties: [...prev.difficulties, difficulty]
                          }));
                        } else {
                          setFilters(prev => ({
                            ...prev,
                            difficulties: prev.difficulties.filter(d => d !== difficulty)
                          }));
                        }
                      }}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">{difficulty}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {allCategories.map(category => (
                  <label key={category} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.categories.includes(category)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFilters(prev => ({
                            ...prev,
                            categories: [...prev.categories, category]
                          }));
                        } else {
                          setFilters(prev => ({
                            ...prev,
                            categories: prev.categories.filter(c => c !== category)
                          }));
                        }
                      }}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">{category}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Algorithm Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Algorithm</label>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {allAlgorithms.slice(0, 20).map(algorithm => (
                  <label key={algorithm} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.algorithms.includes(algorithm)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFilters(prev => ({
                            ...prev,
                            algorithms: [...prev.algorithms, algorithm]
                          }));
                        } else {
                          setFilters(prev => ({
                            ...prev,
                            algorithms: prev.algorithms.filter(a => a !== algorithm)
                          }));
                        }
                      }}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">{algorithm}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Sort Options */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex items-center gap-4">
              <label className="text-sm font-medium text-gray-700">Sort by:</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="id">ID</option>
                <option value="title">Title</option>
                <option value="difficulty">Difficulty</option>
                <option value="category">Category</option>
              </select>
              <button
                onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
                className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                {sortOrder === 'asc' ? '↑' : '↓'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Results Summary */}
      <div className="flex justify-between items-center">
        <p className="text-gray-600">
          Showing {sortedProblems.length} of {problems.length} problems
        </p>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <ChartBarIcon className="h-4 w-4" />
            <span>Easy: {problems.filter(p => p.difficulty === 'Easy').length}</span>
            <span>Medium: {problems.filter(p => p.difficulty === 'Medium').length}</span>
            <span>Hard: {problems.filter(p => p.difficulty === 'Hard').length}</span>
          </div>
        </div>
      </div>

      {/* Problems List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedProblems.map((problem) => (
          <div
            key={problem.id}
            className={`bg-white rounded-lg shadow-sm border-2 transition-all cursor-pointer ${
              selectedProblems.includes(problem.id.toString())
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
            }`}
            onClick={() => handleProblemToggle(problem.id.toString())}
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                  {problem.title}
                </h3>
                <input
                  type="checkbox"
                  checked={selectedProblems.includes(problem.id.toString())}
                  onChange={() => handleProblemToggle(problem.id.toString())}
                  className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
              
              <div className="flex items-center gap-2 mb-3">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(problem.difficulty)}`}>
                  {problem.difficulty}
                </span>
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                  {problem.category}
                </span>
                {problem.editorial && (
                  <span className="text-xs text-purple-600 bg-purple-100 px-2 py-1 rounded">
                    Editorial
                  </span>
                )}
              </div>

              <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                {problem.description}
              </p>

              <div className="flex flex-wrap gap-1 mb-4">
                {problem.algorithms.slice(0, 4).map((algorithm) => (
                  <span
                    key={algorithm}
                    className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded"
                  >
                    {algorithm}
                  </span>
                ))}
                {problem.algorithms.length > 4 && (
                  <span className="text-xs text-gray-500">
                    +{problem.algorithms.length - 4} more
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between">
                <a
                  href={problem.leetcodeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  onClick={(e) => e.stopPropagation()}
                >
                  View on LeetCode →
                </a>
                <div className="flex items-center gap-2">
                  {problem.companies && problem.companies.length > 0 && (
                    <span className="text-xs text-gray-500">
                      {problem.companies[0]}
                    </span>
                  )}
                  <StarIcon className="h-4 w-4 text-gray-400" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {sortedProblems.length === 0 && (
        <div className="text-center py-12">
          <MagnifyingGlassIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No problems found</h3>
          <p className="text-gray-600">Try adjusting your search criteria or filters.</p>
        </div>
      )}
    </div>
  );
}
