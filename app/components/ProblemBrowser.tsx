'use client';

import { useState, useEffect } from 'react';
import { 
  MagnifyingGlassIcon, 
  FunnelIcon, 
  CheckIcon,
  PlayIcon
} from '@heroicons/react/24/outline';
import { comprehensiveProblems } from '@/lib/data/comprehensive-problems';

interface ProblemBrowserProps {
  onSelectProblems: (problems: string[]) => void;
  onCreateQuiz: (problems: string[]) => void;
}

export default function ProblemBrowser({ onSelectProblems, onCreateQuiz }: ProblemBrowserProps) {
  const [problems, setProblems] = useState(comprehensiveProblems);
  const [selectedProblems, setSelectedProblems] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [showFilters, setShowFilters] = useState(false);

  const categories = [...new Set(problems.map(p => p.category))];
  const difficulties = ['All', 'Easy', 'Medium', 'Hard'];

  useEffect(() => {
    let filtered = comprehensiveProblems;

    if (searchTerm) {
      filtered = filtered.filter(p => 
        p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.algorithms.some(a => a.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (difficultyFilter !== 'All') {
      filtered = filtered.filter(p => p.difficulty === difficultyFilter);
    }

    if (categoryFilter !== 'All') {
      filtered = filtered.filter(p => p.category === categoryFilter);
    }

    setProblems(filtered);
  }, [searchTerm, difficultyFilter, categoryFilter]);

  const handleProblemToggle = (problemTitle: string) => {
    const newSelection = selectedProblems.includes(problemTitle)
      ? selectedProblems.filter(p => p !== problemTitle)
      : [...selectedProblems, problemTitle];
    
    setSelectedProblems(newSelection);
    onSelectProblems(newSelection);
  };

  const handleCreateQuiz = () => {
    if (selectedProblems.length > 0) {
      onCreateQuiz(selectedProblems);
    }
  };

  const clearSelection = () => {
    setSelectedProblems([]);
    onSelectProblems([]);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-900">Problem Browser</h1>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <FunnelIcon className="h-5 w-5" />
            Filters
          </button>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search problems..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Difficulty
              </label>
              <select
                value={difficultyFilter}
                onChange={(e) => setDifficultyFilter(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              >
                {difficulties.map(diff => (
                  <option key={diff} value={diff}>{diff}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              >
                <option value="All">All Categories</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* Selection Actions */}
        {selectedProblems.length > 0 && (
          <div className="flex items-center justify-between mt-4 p-4 bg-blue-50 rounded-lg">
            <span className="text-sm text-blue-800">
              {selectedProblems.length} problem{selectedProblems.length !== 1 ? 's' : ''} selected
            </span>
            <div className="flex gap-2">
              <button
                onClick={clearSelection}
                className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
              >
                Clear
              </button>
              <button
                onClick={handleCreateQuiz}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
              >
                <PlayIcon className="h-4 w-4" />
                Create Quiz ({selectedProblems.length})
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Problems List */}
      <div className="grid grid-cols-1 gap-4">
        {problems.map((problem) => (
          <div
            key={problem.id}
            className={`bg-white border rounded-lg p-6 cursor-pointer transition-colors ${
              selectedProblems.includes(problem.title)
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => handleProblemToggle(problem.title)}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <div className={`flex items-center justify-center w-6 h-6 rounded border-2 ${
                    selectedProblems.includes(problem.title)
                      ? 'border-blue-500 bg-blue-500'
                      : 'border-gray-300'
                  }`}>
                    {selectedProblems.includes(problem.title) && (
                      <CheckIcon className="h-4 w-4 text-white" />
                    )}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">{problem.title}</h3>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getDifficultyColor(problem.difficulty)}`}>
                    {problem.difficulty}
                  </span>
                  <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                    {problem.category}
                  </span>
                </div>

                <p className="text-gray-600 text-sm mb-3">{problem.description}</p>

                <div className="flex flex-wrap gap-2 mb-2">
                  {problem.algorithms.slice(0, 4).map((algorithm) => (
                    <span
                      key={algorithm}
                      className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full"
                    >
                      {algorithm}
                    </span>
                  ))}
                  {problem.algorithms.length > 4 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                      +{problem.algorithms.length - 4} more
                    </span>
                  )}
                </div>

                {problem.companies && (
                  <div className="flex flex-wrap gap-2">
                    <span className="text-xs text-gray-500">Asked by:</span>
                    {problem.companies.slice(0, 3).map((company) => (
                      <span
                        key={company}
                        className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded"
                      >
                        {company}
                      </span>
                    ))}
                    {problem.companies.length > 3 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                        +{problem.companies.length - 3} more
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {problems.length === 0 && (
        <div className="bg-white p-12 text-center rounded-lg shadow">
          <p className="text-gray-500">No problems match your current filters.</p>
          <button
            onClick={() => {
              setSearchTerm('');
              setDifficultyFilter('All');
              setCategoryFilter('All');
            }}
            className="mt-4 px-4 py-2 text-blue-600 hover:text-blue-700 transition-colors"
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
}