"use client";

import React, { useState } from 'react';
import Link from 'next/link';

interface QuizTemplate {
  id: string;
  title: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  category: string;
  timeLimit: number;
  questionCount: number;
  topics: string[];
  estimatedScore: number;
  popularity: number;
  tags: string[];
  createdBy: string;
  isOfficial: boolean;
  icon: string;
  color: string;
}

export default function QuizTemplates() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');

  const templates: QuizTemplate[] = [
    // Beginner Templates
    {
      id: 'array-basics',
      title: 'Array Fundamentals',
      description: 'Master the basics of array manipulation and traversal',
      difficulty: 'Beginner',
      category: 'Data Structures',
      timeLimit: 30,
      questionCount: 15,
      topics: ['Array Traversal', 'Index Manipulation', 'Basic Operations'],
      estimatedScore: 85,
      popularity: 95,
      tags: ['beginner-friendly', 'foundation', 'essential'],
      createdBy: 'SpeedCoders Team',
      isOfficial: true,
      icon: '📚',
      color: 'from-green-400 to-green-600',
    },
    {
      id: 'string-basics',
      title: 'String Processing Essentials',
      description: 'Learn fundamental string operations and manipulations',
      difficulty: 'Beginner',
      category: 'Data Structures',
      timeLimit: 25,
      questionCount: 12,
      topics: ['String Methods', 'Character Operations', 'Pattern Matching'],
      estimatedScore: 80,
      popularity: 88,
      tags: ['strings', 'text-processing', 'beginner'],
      createdBy: 'SpeedCoders Team',
      isOfficial: true,
      icon: '🔤',
      color: 'from-blue-400 to-blue-600',
    },

    // Intermediate Templates
    {
      id: 'two-pointers',
      title: 'Two Pointers Technique',
      description: 'Master the two pointers approach for efficient problem solving',
      difficulty: 'Intermediate',
      category: 'Algorithms',
      timeLimit: 45,
      questionCount: 20,
      topics: ['Two Pointers', 'Array Problems', 'Optimization'],
      estimatedScore: 70,
      popularity: 92,
      tags: ['technique', 'optimization', 'arrays'],
      createdBy: 'Algorithm Expert',
      isOfficial: true,
      icon: '👆',
      color: 'from-purple-400 to-purple-600',
    },
    {
      id: 'hash-tables',
      title: 'Hash Table Mastery',
      description: 'Deep dive into hash table applications and optimizations',
      difficulty: 'Intermediate',
      category: 'Data Structures',
      timeLimit: 40,
      questionCount: 18,
      topics: ['HashMap', 'HashSet', 'Frequency Counting', 'Collision Handling'],
      estimatedScore: 65,
      popularity: 89,
      tags: ['hash-tables', 'optimization', 'frequency'],
      createdBy: 'Data Structure Pro',
      isOfficial: true,
      icon: '🗂️',
      color: 'from-orange-400 to-orange-600',
    },
    {
      id: 'tree-traversal',
      title: 'Tree Traversal Techniques',
      description: 'Explore different ways to traverse and manipulate trees',
      difficulty: 'Intermediate',
      category: 'Data Structures',
      timeLimit: 50,
      questionCount: 22,
      topics: ['BFS', 'DFS', 'Inorder', 'Preorder', 'Postorder'],
      estimatedScore: 68,
      popularity: 85,
      tags: ['trees', 'traversal', 'recursion'],
      createdBy: 'Tree Master',
      isOfficial: true,
      icon: '🌳',
      color: 'from-green-500 to-green-700',
    },

    // Advanced Templates
    {
      id: 'dynamic-programming',
      title: 'Dynamic Programming Deep Dive',
      description: 'Tackle complex optimization problems with DP',
      difficulty: 'Advanced',
      category: 'Algorithms',
      timeLimit: 75,
      questionCount: 25,
      topics: ['Memoization', 'Tabulation', 'State Transition', 'Optimization'],
      estimatedScore: 55,
      popularity: 78,
      tags: ['dp', 'optimization', 'advanced'],
      createdBy: 'DP Specialist',
      isOfficial: true,
      icon: '🎯',
      color: 'from-red-500 to-red-700',
    },
    {
      id: 'graph-algorithms',
      title: 'Graph Algorithm Challenges',
      description: 'Master graph traversal and shortest path algorithms',
      difficulty: 'Advanced',
      category: 'Algorithms',
      timeLimit: 60,
      questionCount: 20,
      topics: ['BFS', 'DFS', 'Dijkstra', 'Union-Find', 'MST'],
      estimatedScore: 60,
      popularity: 82,
      tags: ['graphs', 'shortest-path', 'traversal'],
      createdBy: 'Graph Expert',
      isOfficial: true,
      icon: '🕸️',
      color: 'from-indigo-500 to-indigo-700',
    },

    // Company-specific Templates
    {
      id: 'google-prep',
      title: 'Google Interview Prep',
      description: 'Practice with Google-style algorithm problems',
      difficulty: 'Advanced',
      category: 'Interview Prep',
      timeLimit: 90,
      questionCount: 30,
      topics: ['System Design', 'Algorithms', 'Data Structures', 'Optimization'],
      estimatedScore: 50,
      popularity: 96,
      tags: ['google', 'faang', 'interview'],
      createdBy: 'Ex-Google Engineer',
      isOfficial: false,
      icon: '🔍',
      color: 'from-blue-600 to-blue-800',
    },
    {
      id: 'amazon-focus',
      title: 'Amazon LP + Technical',
      description: 'Combined technical and leadership principles questions',
      difficulty: 'Advanced',
      category: 'Interview Prep',
      timeLimit: 80,
      questionCount: 25,
      topics: ['Leadership', 'Scalability', 'System Design', 'Algorithms'],
      estimatedScore: 55,
      popularity: 89,
      tags: ['amazon', 'leadership', 'scalability'],
      createdBy: 'Amazon Veteran',
      isOfficial: false,
      icon: '📦',
      color: 'from-yellow-600 to-orange-600',
    },

    // Specialized Templates
    {
      id: 'competitive-programming',
      title: 'Competitive Programming',
      description: 'High-speed problem solving under pressure',
      difficulty: 'Expert',
      category: 'Competitive',
      timeLimit: 120,
      questionCount: 12,
      topics: ['Advanced Algorithms', 'Math', 'Geometry', 'Number Theory'],
      estimatedScore: 40,
      popularity: 65,
      tags: ['competitive', 'math', 'advanced'],
      createdBy: 'ICPC Champion',
      isOfficial: false,
      icon: '🏆',
      color: 'from-yellow-400 to-yellow-600',
    },
    {
      id: 'system-design',
      title: 'System Design Fundamentals',
      description: 'Learn to design scalable distributed systems',
      difficulty: 'Advanced',
      category: 'System Design',
      timeLimit: 60,
      questionCount: 15,
      topics: ['Scalability', 'Database Design', 'Caching', 'Load Balancing'],
      estimatedScore: 65,
      popularity: 87,
      tags: ['system-design', 'scalability', 'architecture'],
      createdBy: 'Systems Architect',
      isOfficial: true,
      icon: '🏗️',
      color: 'from-gray-600 to-gray-800',
    },
  ];

  const categories = ['all', ...Array.from(new Set(templates.map(t => t.category)))];
  const difficulties = ['all', 'Beginner', 'Intermediate', 'Advanced', 'Expert'];

  const filteredTemplates = templates.filter(template => {
    const categoryMatch = selectedCategory === 'all' || template.category === selectedCategory;
    const difficultyMatch = selectedDifficulty === 'all' || template.difficulty === selectedDifficulty;
    return categoryMatch && difficultyMatch;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'text-green-600 bg-green-100';
      case 'Intermediate': return 'text-blue-600 bg-blue-100';
      case 'Advanced': return 'text-orange-600 bg-orange-100';
      case 'Expert': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getPopularityStars = (popularity: number) => {
    const stars = Math.floor(popularity / 20);
    return '⭐'.repeat(stars);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-2xl font-bold mb-4">🧪 Quiz Templates</h2>
        <p className="text-gray-600 mb-6">
          Choose from our curated collection of quiz templates designed by experts and the community.
          Each template focuses on specific skills and provides a structured learning experience.
        </p>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">Difficulty</label>
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {difficulties.map(difficulty => (
                <option key={difficulty} value={difficulty}>
                  {difficulty === 'all' ? 'All Difficulties' : difficulty}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map(template => (
            <div
              key={template.id}
              className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300 hover:scale-105"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className={`text-3xl p-3 rounded-lg bg-gradient-to-r ${template.color} text-white`}>
                  {template.icon}
                </div>
                <div className="flex flex-col items-end">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(template.difficulty)}`}>
                    {template.difficulty}
                  </span>
                  {template.isOfficial && (
                    <span className="mt-1 px-2 py-0.5 bg-blue-500 text-white text-xs rounded-full">
                      Official
                    </span>
                  )}
                </div>
              </div>

              {/* Content */}
              <div className="mb-4">
                <h3 className="text-lg font-bold text-gray-900 mb-2">{template.title}</h3>
                <p className="text-sm text-gray-600 mb-3">{template.description}</p>

                {/* Stats */}
                <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                  <span>⏱️ {template.timeLimit} mins</span>
                  <span>📝 {template.questionCount} questions</span>
                  <span>🎯 ~{template.estimatedScore}% avg</span>
                </div>

                {/* Topics */}
                <div className="flex flex-wrap gap-1 mb-3">
                  {template.topics.slice(0, 3).map(topic => (
                    <span key={topic} className="px-2 py-1 bg-gray-100 text-xs rounded-md">
                      {topic}
                    </span>
                  ))}
                  {template.topics.length > 3 && (
                    <span className="px-2 py-1 bg-gray-100 text-xs rounded-md">
                      +{template.topics.length - 3} more
                    </span>
                  )}
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {template.tags.map(tag => (
                    <span key={tag} className="px-2 py-0.5 bg-blue-50 text-blue-700 text-xs rounded">
                      #{tag}
                    </span>
                  ))}
                </div>

                {/* Popularity & Creator */}
                <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                  <span>{getPopularityStars(template.popularity)} ({template.popularity}%)</span>
                  <span>by {template.createdBy}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <Link
                  href={`/quiz/template/${template.id}`}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 px-4 rounded-lg text-center text-sm font-medium hover:from-blue-700 hover:to-purple-700 transition-colors"
                >
                  Start Quiz
                </Link>
                <button className="px-3 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors">
                  👁️
                </button>
                <button className="px-3 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors">
                  🔖
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredTemplates.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No templates found</h3>
            <p className="text-gray-600">Try adjusting your filters to see more templates.</p>
          </div>
        )}
      </div>

      {/* Template Stats */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-xl font-bold mb-4">📈 Template Statistics</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">{templates.length}</div>
            <div className="text-sm text-gray-600">Total Templates</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">
              {templates.filter(t => t.isOfficial).length}
            </div>
            <div className="text-sm text-gray-600">Official Templates</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600">{categories.length - 1}</div>
            <div className="text-sm text-gray-600">Categories</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-600">
              {Math.round(templates.reduce((acc, t) => acc + t.popularity, 0) / templates.length)}%
            </div>
            <div className="text-sm text-gray-600">Avg Popularity</div>
          </div>
        </div>
      </div>
    </div>
  );
}