'use client';

import { useState, useEffect } from 'react';
import { comprehensiveProblems } from '@/lib/data/problems';
import { LeetCodeProblem } from '@/lib/data/comprehensive-problems';

interface ProblemBrowserProps {
  onSelectProblems?: (problems: string[]) => void;
  onCreateQuiz?: (problems: string[]) => void;
}

export default function ProblemBrowser({ onSelectProblems, onCreateQuiz }: ProblemBrowserProps) {
  const [problems] = useState<any[]>(comprehensiveProblems);
  const [filteredProblems, setFilteredProblems] = useState<any[]>(problems);
  const [selectedProblems, setSelectedProblems] = useState<string[]>([]);
  const [filters, setFilters] = useState({
    difficulty: 'all',
    topic: 'all',
    search: ''
  });

  const difficulties = ['all', 'Easy', 'Medium', 'Hard'];
  const topics = ['all', ...Array.from(new Set(problems.flatMap(p => p.algorithms || [])))];

  useEffect(() => {
    let filtered = problems;

    if (filters.difficulty !== 'all') {
      filtered = filtered.filter(p => p.difficulty === filters.difficulty);
    }

    if (filters.topic !== 'all') {
      filtered = filtered.filter(p => p.algorithms.includes(filters.topic));
    }

    if (filters.search) {
      filtered = filtered.filter(p => 
        p.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        p.description.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    setFilteredProblems(filtered);
  }, [filters, problems]);

  const handleProblemSelect = (problemSlug: string) => {
    const newSelected = selectedProblems.includes(problemSlug)
      ? selectedProblems.filter(id => id !== problemSlug)
      : [...selectedProblems, problemSlug];
    
    setSelectedProblems(newSelected);
    onSelectProblems?.(newSelected);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'text-green-600 bg-green-100';
      case 'Medium': return 'text-yellow-600 bg-yellow-100';
      case 'Hard': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const handleCreateQuiz = () => {
    if (selectedProblems.length > 0 && onCreateQuiz) {
      onCreateQuiz(selectedProblems);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Problem Browser</h1>
          <p className="text-gray-600">Browse and select problems for your custom quiz</p>
        </div>
        {selectedProblems.length > 0 && (
          <button
            onClick={handleCreateQuiz}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Create Quiz ({selectedProblems.length})
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search
            </label>
            <input
              type="text"
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              placeholder="Search problems..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Difficulty
            </label>
            <select
              value={filters.difficulty}
              onChange={(e) => setFilters({ ...filters, difficulty: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {difficulties.map(difficulty => (
                <option key={difficulty} value={difficulty}>
                  {difficulty === 'all' ? 'All Difficulties' : difficulty}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Topic
            </label>
            <select
              value={filters.topic}
              onChange={(e) => setFilters({ ...filters, topic: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {topics.slice(0, 20).map(topic => (
                <option key={topic} value={topic}>
                  {topic === 'all' ? 'All Topics' : topic}
                </option>
              ))}
            </select>
          </div>
          
          <div className="flex items-end">
            <button
              onClick={() => setFilters({ difficulty: 'all', topic: 'all', search: '' })}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md transition-colors"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Results Summary */}
      <div className="flex items-center justify-between text-sm text-gray-600">
        <span>Showing {filteredProblems.length} of {problems.length} problems</span>
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
            onClick={() => handleProblemSelect(problem.title.toLowerCase().replace(/\s+/g, '-'))}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-4">
                <input
                  type="checkbox"
                  checked={selectedProblems.includes(problem.title.toLowerCase().replace(/\s+/g, '-'))}
                  onChange={() => handleProblemSelect(problem.title.toLowerCase().replace(/\s+/g, '-'))}
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
                  </div>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {problem.description.slice(0, 200)}...
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {problem.algorithms.slice(0, 4).map((topic: string) => (
                      <span
                        key={topic}
                        className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md"
                      >
                        {topic}
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
                    View on LeetCode �
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
            onClick={() => setFilters({ difficulty: 'all', topic: 'all', search: '' })}
            className="mt-2 text-blue-600 hover:text-blue-800"
          >
            Clear filters to show all problems
          </button>
        </div>
      )}
    </div>
  );
}