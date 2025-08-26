"use client";

import { useState, useEffect } from 'react';
import { apiClient } from "@/utils/api/client";
import { 
  MagnifyingGlassIcon,
  FunnelIcon,
  BookOpenIcon,
  ClockIcon,
  StarIcon,
  ChevronDownIcon,
  ChevronUpIcon
} from "@heroicons/react/24/outline";

interface Problem {
  id: number;
  title: string;
  difficulty: string;
  category: string;
  description: string;
  leetcodeUrl: string;
  algorithms: string[];
  tags: string[];
}

interface ProblemBrowserProps {
  onSelectProblems?: (problems: string[]) => void;
  onCreateQuiz?: (problems: string[]) => void;
}

export default function ProblemBrowser({ onSelectProblems, onCreateQuiz }: ProblemBrowserProps) {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [filteredProblems, setFilteredProblems] = useState<Problem[]>([]);
  const [selectedProblems, setSelectedProblems] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);
  const [filters, setFilters] = useState({
    difficulty: '',
    category: '',
    search: ''
  });
  const [sortBy, setSortBy] = useState('title');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    loadProblems();
  }, []);

  const loadProblems = async () => {
    try {
      setLoading(true);
      const result = await apiClient.getProblems();
      
      if (result.success) {
        setProblems(result.data.problems);
        setFilteredProblems(result.data.problems);
        setStats(result.data.stats);
      } else {
        console.error('Failed to load problems:', result.error);
      }
    } catch (error) {
      console.error('Error loading problems:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let filtered = problems;

    // Apply filters
    if (filters.difficulty) {
      filtered = filtered.filter(p => p.difficulty === filters.difficulty);
    }

    if (filters.category) {
      filtered = filtered.filter(p => p.category === filters.category);
    }

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(p => 
        p.title.toLowerCase().includes(searchLower) ||
        p.description.toLowerCase().includes(searchLower) ||
        p.algorithms.some(algo => algo.toLowerCase().includes(searchLower))
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
        case 'difficulty':
          const difficultyOrder = { 'Easy': 1, 'Medium': 2, 'Hard': 3 };
          comparison = (difficultyOrder[a.difficulty as keyof typeof difficultyOrder] || 0) - 
                      (difficultyOrder[b.difficulty as keyof typeof difficultyOrder] || 0);
          break;
        case 'category':
          comparison = a.category.localeCompare(b.category);
          break;
        default:
          comparison = a.id - b.id;
      }
      return sortOrder === 'desc' ? -comparison : comparison;
    });

    setFilteredProblems(filtered);
  }, [problems, filters, sortBy, sortOrder]);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy':
        return 'bg-green-100 text-green-800';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'Hard':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleProblemSelect = (problemId: string) => {
    setSelectedProblems(prev => 
      prev.includes(problemId) 
        ? prev.filter(id => id !== problemId)
        : [...prev, problemId]
    );
  };

  const handleCreateQuiz = () => {
    if (onCreateQuiz && selectedProblems.length > 0) {
      onCreateQuiz(selectedProblems);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Problem Browser</h2>
          <p className="text-gray-600">Browse and select problems to practice</p>
        </div>
        {selectedProblems.length > 0 && (
          <button
            onClick={handleCreateQuiz}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Create Quiz ({selectedProblems.length} selected)
          </button>
        )}
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
            <div className="text-sm text-blue-600">Total Problems</div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{stats.easy}</div>
            <div className="text-sm text-green-600">Easy</div>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-yellow-600">{stats.medium}</div>
            <div className="text-sm text-yellow-600">Medium</div>
          </div>
          <div className="bg-red-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-red-600">{stats.hard}</div>
            <div className="text-sm text-red-600">Hard</div>
          </div>
        </div>
      )}

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search problems..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            <FunnelIcon className="h-5 w-5" />
            Filters
            {showFilters ? <ChevronUpIcon className="h-4 w-4" /> : <ChevronDownIcon className="h-4 w-4" />}
          </button>
        </div>

        {/* Filter Options */}
        {showFilters && (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            <select
              value={filters.difficulty}
              onChange={(e) => setFilters({ ...filters, difficulty: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Difficulties</option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>

            <select
              value={filters.category}
              onChange={(e) => setFilters({ ...filters, category: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Categories</option>
              {stats?.categories?.map((category: string) => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="title">Sort by Title</option>
              <option value="difficulty">Sort by Difficulty</option>
              <option value="category">Sort by Category</option>
            </select>
          </div>
        )}
      </div>

      {/* Problems Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <input
                    type="checkbox"
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedProblems(filteredProblems.map(p => p.id.toString()));
                      } else {
                        setSelectedProblems([]);
                      }
                    }}
                    checked={selectedProblems.length === filteredProblems.length && filteredProblems.length > 0}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Problem
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Difficulty
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Algorithms
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredProblems.map((problem) => (
                <tr key={problem.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={selectedProblems.includes(problem.id.toString())}
                      onChange={() => handleProblemSelect(problem.id.toString())}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{problem.title}</div>
                      <div className="text-sm text-gray-500 truncate max-w-xs">{problem.description}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getDifficultyColor(problem.difficulty)}`}>
                      {problem.difficulty}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {problem.category}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {problem.algorithms.slice(0, 2).map((algo) => (
                        <span key={algo} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                          {algo}
                        </span>
                      ))}
                      {problem.algorithms.length > 2 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                          +{problem.algorithms.length - 2}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <a
                      href={problem.leetcodeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-900 mr-3"
                    >
                      LeetCode
                    </a>
                    <button
                      onClick={() => handleProblemSelect(problem.id.toString())}
                      className="text-green-600 hover:text-green-900"
                    >
                      Practice
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Results Summary */}
      <div className="text-sm text-gray-600">
        Showing {filteredProblems.length} of {problems.length} problems
        {selectedProblems.length > 0 && ` • ${selectedProblems.length} selected`}
      </div>
    </div>
  );
}
