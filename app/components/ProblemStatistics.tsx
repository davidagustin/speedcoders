"use client";

import React, { useState, useMemo } from 'react';
import { allProblems } from '@/lib/data/all-batches-index';

interface ProblemStatisticsProps {
  selectedProblems?: typeof allProblems;
}

export default function ProblemStatistics({ selectedProblems = allProblems }: ProblemStatisticsProps) {
  const [activeTab, setActiveTab] = useState('overview');

  const statistics = useMemo(() => {
    const stats = {
      total: selectedProblems.length,
      byDifficulty: { Easy: 0, Medium: 0, Hard: 0 },
      byCategory: {} as Record<string, number>,
      byCompany: {} as Record<string, number>,
      byAlgorithm: {} as Record<string, number>,
      acceptanceRates: {
        high: 0, // > 60%
        medium: 0, // 40-60%
        low: 0, // < 40%
      },
      premiumCount: 0,
      freeCount: 0,
    };

    selectedProblems.forEach(problem => {
      // Difficulty
      stats.byDifficulty[problem.difficulty as keyof typeof stats.byDifficulty]++;

      // Category
      if (problem.category) {
        stats.byCategory[problem.category] = (stats.byCategory[problem.category] || 0) + 1;
      }

      // Companies
      if (problem.companies && Array.isArray(problem.companies)) {
        problem.companies.forEach(company => {
          stats.byCompany[company] = (stats.byCompany[company] || 0) + 1;
        });
      }

      // Algorithms
      const algorithms = problem.algorithms || problem.correctAlgorithms || [];
      algorithms.forEach((algo: string) => {
        stats.byAlgorithm[algo] = (stats.byAlgorithm[algo] || 0) + 1;
      });

      // Acceptance rate
      const acceptance = problem.acceptanceRate || 50;
      if (acceptance > 60) stats.acceptanceRates.high++;
      else if (acceptance >= 40) stats.acceptanceRates.medium++;
      else stats.acceptanceRates.low++;

      // Premium vs Free
      if (problem.isPremium) stats.premiumCount++;
      else stats.freeCount++;
    });

    return stats;
  }, [selectedProblems]);

  const topPatterns = useMemo(() => {
    const patterns = [
      { name: "Two Pointers", count: 0, problems: [] as any[], color: "bg-blue-500" },
      { name: "Sliding Window", count: 0, problems: [] as any[], color: "bg-green-500" },
      { name: "Fast & Slow Pointers", count: 0, problems: [] as any[], color: "bg-purple-500" },
      { name: "Merge Intervals", count: 0, problems: [] as any[], color: "bg-yellow-500" },
      { name: "Cyclic Sort", count: 0, problems: [] as any[], color: "bg-red-500" },
      { name: "In-place Reversal", count: 0, problems: [] as any[], color: "bg-indigo-500" },
      { name: "Tree BFS", count: 0, problems: [] as any[], color: "bg-pink-500" },
      { name: "Tree DFS", count: 0, problems: [] as any[], color: "bg-orange-500" },
      { name: "Two Heaps", count: 0, problems: [] as any[], color: "bg-teal-500" },
      { name: "Subsets", count: 0, problems: [] as any[], color: "bg-cyan-500" },
      { name: "Modified Binary Search", count: 0, problems: [] as any[], color: "bg-lime-500" },
      { name: "Top K Elements", count: 0, problems: [] as any[], color: "bg-emerald-500" },
    ];

    selectedProblems.forEach(problem => {
      const title = problem.title.toLowerCase();
      const algorithms = problem.algorithms || problem.correctAlgorithms || [];
      
      patterns.forEach(pattern => {
        const patternName = pattern.name.toLowerCase();
        if (title.includes(patternName) || algorithms.some((a: string) => a.toLowerCase().includes(patternName))) {
          pattern.count++;
          pattern.problems.push(problem);
        }
      });
    });

    return patterns.filter(p => p.count > 0).sort((a, b) => b.count - a.count);
  }, [selectedProblems]);

  const difficultyDistribution = [
    { name: 'Easy', value: statistics.byDifficulty.Easy, color: 'bg-green-500', percentage: (statistics.byDifficulty.Easy / statistics.total) * 100 },
    { name: 'Medium', value: statistics.byDifficulty.Medium, color: 'bg-yellow-500', percentage: (statistics.byDifficulty.Medium / statistics.total) * 100 },
    { name: 'Hard', value: statistics.byDifficulty.Hard, color: 'bg-red-500', percentage: (statistics.byDifficulty.Hard / statistics.total) * 100 },
  ];

  const topCompanies = Object.entries(statistics.byCompany)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);

  const topAlgorithms = Object.entries(statistics.byAlgorithm)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 15);

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">📊 Problem Statistics</h2>
        <div className="flex gap-2">
          {['overview', 'patterns', 'companies', 'algorithms'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg capitalize transition-colors ${
                activeTab === tab
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-4 text-white">
              <div className="text-3xl font-bold">{statistics.total}</div>
              <div className="text-blue-100">Total Problems</div>
            </div>
            <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-4 text-white">
              <div className="text-3xl font-bold">{statistics.freeCount}</div>
              <div className="text-green-100">Free Problems</div>
            </div>
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-4 text-white">
              <div className="text-3xl font-bold">{Object.keys(statistics.byCategory).length}</div>
              <div className="text-purple-100">Categories</div>
            </div>
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg p-4 text-white">
              <div className="text-3xl font-bold">{Object.keys(statistics.byCompany).length}</div>
              <div className="text-orange-100">Companies</div>
            </div>
          </div>

          {/* Difficulty Distribution */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Difficulty Distribution</h3>
            <div className="space-y-3">
              {difficultyDistribution.map(item => (
                <div key={item.name} className="flex items-center gap-4">
                  <div className="w-20 text-sm font-medium">{item.name}</div>
                  <div className="flex-1">
                    <div className="bg-gray-200 rounded-full h-6 relative overflow-hidden">
                      <div
                        className={`${item.color} h-full rounded-full transition-all duration-500`}
                        style={{ width: `${item.percentage}%` }}
                      />
                      <div className="absolute inset-0 flex items-center justify-center text-xs font-medium">
                        {item.value} ({item.percentage.toFixed(1)}%)
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Acceptance Rate Distribution */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Acceptance Rate Distribution</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                <div className="text-2xl font-bold text-green-600">{statistics.acceptanceRates.high}</div>
                <div className="text-sm text-green-700">High (&gt;60%)</div>
              </div>
              <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                <div className="text-2xl font-bold text-yellow-600">{statistics.acceptanceRates.medium}</div>
                <div className="text-sm text-yellow-700">Medium (40-60%)</div>
              </div>
              <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                <div className="text-2xl font-bold text-red-600">{statistics.acceptanceRates.low}</div>
                <div className="text-sm text-red-700">Low (&lt;40%)</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'patterns' && (
        <div className="space-y-6">
          <h3 className="text-lg font-semibold">Problem Patterns</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {topPatterns.map(pattern => (
              <div key={pattern.name} className="bg-gray-50 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">{pattern.name}</span>
                  <span className={`${pattern.color} text-white px-2 py-1 rounded text-xs font-bold`}>
                    {pattern.count}
                  </span>
                </div>
                <div className="text-xs text-gray-600">
                  {pattern.problems.slice(0, 3).map(p => p.title).join(', ')}
                  {pattern.problems.length > 3 && ` +${pattern.problems.length - 3} more`}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'companies' && (
        <div className="space-y-6">
          <h3 className="text-lg font-semibold">Top Companies</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {topCompanies.map(([company, count], index) => (
              <div key={company} className="relative">
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-4 hover:shadow-lg transition-all">
                  <div className="absolute -top-2 -right-2 bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">
                    {index + 1}
                  </div>
                  <div className="font-semibold text-gray-800">{company}</div>
                  <div className="text-2xl font-bold text-blue-600">{count}</div>
                  <div className="text-xs text-gray-500">problems</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'algorithms' && (
        <div className="space-y-6">
          <h3 className="text-lg font-semibold">Top Algorithms & Techniques</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {topAlgorithms.map(([algo, count]) => (
              <div key={algo} className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-3 border border-indigo-200">
                <div className="text-sm font-medium text-gray-800 mb-1">{algo}</div>
                <div className="flex items-baseline gap-1">
                  <span className="text-xl font-bold text-indigo-600">{count}</span>
                  <span className="text-xs text-gray-500">problems</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}