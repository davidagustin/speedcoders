'use client';

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

  // Load saved searches on mount
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('savedSearches') || '[]');
    setSavedSearches(saved);

    const history = JSON.parse(localStorage.getItem('searchHistory') || '[]');
    setSearchHistory(history);
  }, []);

  // Search suggestions based on query
  const searchSuggestions = useMemo(() => {
    if (!searchQuery || searchQuery.length < 2) return [];

    const query = searchQuery.toLowerCase();
    const suggestions = new Set<string>();

    // Add problem titles that match
    comprehensiveProblems
      .filter((p) => p.title.toLowerCase().includes(query))
      .slice(0, 5)
      .forEach((p) => suggestions.add(`title:${p.title}`));

    // Add algorithms that match
    Object.values(algorithmCategories)
      .flat()
      .filter((algo) => algo.toLowerCase().includes(query))
      .slice(0, 3)
      .forEach((algo) => suggestions.add(`algorithm:${algo}`));

    return Array.from(suggestions).slice(0, 8);
  }, [searchQuery]);

  // Advanced search with multiple criteria
  const performAdvancedSearch = () => {
    let results = [...comprehensiveProblems];

    // Text search in title, description, and tags
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      results = results.filter((problem) => {
        // Check for special search operators
        if (query.startsWith('title:')) {
          return problem.title.toLowerCase().includes(query.substring(6));
        }
        if (query.startsWith('id:')) {
          return problem.id.toString() === query.substring(3);
        }
        if (query.startsWith('algorithm:')) {
          const algo = query.substring(10);
          return problem.algorithms.some((a) => a.toLowerCase().includes(algo));
        }

        // Regular text search
        return (
          problem.title.toLowerCase().includes(query) ||
          problem.description.toLowerCase().includes(query) ||
          problem.algorithms.some((algo) => algo.toLowerCase().includes(query))
        );
      });
    }

    // Apply filters
    if (filters.difficulties.length > 0) {
      results = results.filter((p) => filters.difficulties.includes(p.difficulty));
    }

    if (filters.algorithms.length > 0) {
      results = results.filter((p) =>
        filters.algorithms.some((algo) => p.algorithms.includes(algo))
      );
    }

    if (filters.categories.length > 0) {
      results = results.filter((p) => filters.categories.includes(p.category));
    }

    if (filters.companies.length > 0) {
      results = results.filter((p) =>
        p.companies && filters.companies.some((company) => p.companies!.includes(company))
      );
    }

    if (filters.hasEditorial) {
      results = results.filter((p) => p.editorial);
    }

    // Sort results
    results.sort((a, b) => {
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
          comparison = a.id - b.id;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return results;
  };

  // Filtered problems based on search and filters
  const filteredProblems = useMemo(() => {
    return performAdvancedSearch();
  }, [searchQuery, filters, sortBy, sortOrder]);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      // Add to search history
      const newHistory = [searchQuery, ...searchHistory.filter(h => h !== searchQuery)].slice(0, 10);
      setSearchHistory(newHistory);
      localStorage.setItem('searchHistory', JSON.stringify(newHistory));
    }
  };

  const handleSaveSearch = () => {
    const searchString = JSON.stringify({ query: searchQuery, filters });
    if (!savedSearches.includes(searchString)) {
      const newSaved = [...savedSearches, searchString].slice(0, 5);
      setSavedSearches(newSaved);
      localStorage.setItem('savedSearches', JSON.stringify(newSaved));
    }
  };

  const handleLoadSearch = (searchString: string) => {
    try {
      const { query, filters: savedFilters } = JSON.parse(searchString);
      setSearchQuery(query);
      setFilters(savedFilters);
    } catch (error) {
      console.error('Error loading saved search:', error);
    }
  };

  const handleProblemToggle = (problemTitle: string) => {
    setSelectedProblems(prev => {
      const normalizedTitle = problemTitle.toLowerCase().replace(/\s+/g, '-');
      if (prev.includes(normalizedTitle)) {
        return prev.filter(p => p !== normalizedTitle);
      } else {
        return [...prev, normalizedTitle];
      }
    });
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
      case 'Easy': return 'bg-green-100 text-green-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const allCategories = [...new Set(comprehensiveProblems.map(p => p.category))];
  const allDifficulties = ['Easy', 'Medium', 'Hard'];
  const allAlgorithms = [...new Set(comprehensiveProblems.flatMap(p => p.algorithms))];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Advanced Problem Browser</h2>
          <p className="text-gray-600">Search and filter through {comprehensiveProblems.length} problems</p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            <FunnelIcon className="h-4 w-4 mr-2" />
            Filters
          </button>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm"
          >
            <option value="id">Sort by ID</option>
            <option value="title">Sort by Title</option>
            <option value="difficulty">Sort by Difficulty</option>
            <option value="category">Sort by Category</option>
          </select>
          <button
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm"
          >
            {sortOrder === 'asc' ? '↑' : '↓'}
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <div className="flex items-center space-x-2">
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Search problems by title, algorithm, or use advanced operators (title:, id:, algorithm:)..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {searchSuggestions.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
                {searchSuggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => setSearchQuery(suggestion)}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}
          </div>
          <button
            onClick={handleSearch}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Search
          </button>
          <button
            onClick={handleSaveSearch}
            className="px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            <StarIcon className="h-4 w-4" />
          </button>
        </div>

        {/* Search History and Saved Searches */}
        {(searchHistory.length > 0 || savedSearches.length > 0) && (
          <div className="mt-4 flex space-x-4">
            {searchHistory.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Recent Searches</h4>
                <div className="flex flex-wrap gap-2">
                  {searchHistory.slice(0, 5).map((query, index) => (
                    <button
                      key={index}
                      onClick={() => setSearchQuery(query)}
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200"
                    >
                      {query}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {savedSearches.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Saved Searches</h4>
                <div className="flex flex-wrap gap-2">
                  {savedSearches.slice(0, 3).map((search, index) => (
                    <button
                      key={index}
                      onClick={() => handleLoadSearch(search)}
                      className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm hover:bg-blue-200"
                    >
                      Saved {index + 1}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Advanced Filters</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Difficulty Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty</label>
              <div className="space-y-2">
                {allDifficulties.map((difficulty) => (
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
                      className="h-4 w-4 text-blue-600 rounded border-gray-300"
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
                {allCategories.slice(0, 10).map((category) => (
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
                      className="h-4 w-4 text-blue-600 rounded border-gray-300"
                    />
                    <span className="ml-2 text-sm text-gray-700">{category}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Algorithm Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Algorithms</label>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {allAlgorithms.slice(0, 10).map((algorithm) => (
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
                      className="h-4 w-4 text-blue-600 rounded border-gray-300"
                    />
                    <span className="ml-2 text-sm text-gray-700">{algorithm}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Additional Filters */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Options</label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.hasEditorial}
                    onChange={(e) => setFilters(prev => ({ ...prev, hasEditorial: e.target.checked }))}
                    className="h-4 w-4 text-blue-600 rounded border-gray-300"
                  />
                  <span className="ml-2 text-sm text-gray-700">Has Editorial</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Selection Actions */}
      {selectedProblems.length > 0 && (
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-blue-900">
                {selectedProblems.length} problems selected
              </span>
              <button
                onClick={clearSelection}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                Clear Selection
              </button>
            </div>
            <button
              onClick={handleCreateQuiz}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <PlayIcon className="h-4 w-4 mr-2" />
              Create Quiz
            </button>
          </div>
        </div>
      )}

      {/* Results Summary */}
      <div className="flex items-center justify-between text-sm text-gray-600">
        <span>Showing {filteredProblems.length} of {comprehensiveProblems.length} problems</span>
        {selectedProblems.length > 0 && (
          <span className="text-blue-600 font-medium">
            {selectedProblems.length} selected
          </span>
        )}
      </div>

      {/* Problems List */}
      <div className="space-y-4">
        {filteredProblems.slice(0, 50).map((problem) => (
          <div
            key={problem.id}
            className={`bg-white p-6 rounded-lg shadow-sm border cursor-pointer transition-all ${
              selectedProblems.includes(problem.title.toLowerCase().replace(/\s+/g, '-'))
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
            }`}
            onClick={() => handleProblemToggle(problem.title)}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-4">
                <input
                  type="checkbox"
                  checked={selectedProblems.includes(problem.title.toLowerCase().replace(/\s+/g, '-'))}
                  onChange={() => handleProblemToggle(problem.title)}
                  className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {problem.title}
                    </h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(problem.difficulty)}`}>
                      {problem.difficulty}
                    </span>
                    {problem.editorial && (
                      <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium">
                        Editorial
                      </span>
                    )}
                  </div>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {problem.description.slice(0, 200)}...
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {problem.algorithms.slice(0, 4).map((algorithm) => (
                      <span
                        key={algorithm}
                        className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md"
                      >
                        {algorithm}
                      </span>
                    ))}
                    {problem.algorithms.length > 4 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-500 text-xs rounded-md">
                        +{problem.algorithms.length - 4} more
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="ml-4 flex flex-col items-end text-xs text-gray-500">
                <span>#{problem.id}</span>
                {problem.leetcodeUrl && (
                  <a
                    href={problem.leetcodeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="text-blue-600 hover:text-blue-800 mt-1"
                  >
                    View on LeetCode →
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredProblems.length > 50 && (
        <div className="text-center py-4">
          <p className="text-gray-600">
            Showing first 50 results. Use filters to narrow down your search.
          </p>
        </div>
      )}

      {filteredProblems.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-600">No problems found matching your criteria.</p>
          <button
            onClick={() => {
              setSearchQuery('');
              setFilters({
                difficulties: [],
                algorithms: [],
                categories: [],
                companies: [],
                solved: 'all',
                hasEditorial: false,
                isPremium: false,
              });
            }}
            className="mt-2 text-blue-600 hover:text-blue-800"
          >
            Clear filters to show all problems
          </button>
        </div>
      )}
    </div>
  );
}
