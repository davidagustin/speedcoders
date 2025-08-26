"use client";

import React, { useState } from 'react';
import Link from 'next/link';

interface RoadmapStage {
  id: string;
  title: string;
  description: string;
  topics: string[];
  problems: { title: string; difficulty: string; mustDo: boolean }[];
  estimatedTime: string;
  prerequisites: string[];
  color: string;
  icon: string;
}

export default function ProblemRoadmap() {
  const [selectedTrack, setSelectedTrack] = useState('beginner');
  const [completedStages, setCompletedStages] = useState<Set<string>>(new Set());

  const roadmapTracks = {
    beginner: {
      title: "Beginner to Intermediate",
      description: "Perfect for those starting their DSA journey",
      stages: [
        {
          id: 'basics',
          title: 'Programming Fundamentals',
          description: 'Master the basics of programming and problem solving',
          topics: ['Variables', 'Loops', 'Functions', 'Basic I/O'],
          problems: [
            { title: 'Hello World', difficulty: 'Easy', mustDo: true },
            { title: 'Sum of Two Numbers', difficulty: 'Easy', mustDo: true },
            { title: 'FizzBuzz', difficulty: 'Easy', mustDo: true },
            { title: 'Palindrome Check', difficulty: 'Easy', mustDo: true },
          ],
          estimatedTime: '1 week',
          prerequisites: [],
          color: 'from-green-400 to-green-600',
          icon: '🌱',
        },
        {
          id: 'arrays',
          title: 'Arrays & Strings',
          description: 'Learn to manipulate arrays and strings efficiently',
          topics: ['Array Operations', 'String Manipulation', 'Two Pointers'],
          problems: [
            { title: 'Two Sum', difficulty: 'Easy', mustDo: true },
            { title: 'Best Time to Buy and Sell Stock', difficulty: 'Easy', mustDo: true },
            { title: 'Valid Anagram', difficulty: 'Easy', mustDo: false },
            { title: 'Maximum Subarray', difficulty: 'Medium', mustDo: true },
            { title: '3Sum', difficulty: 'Medium', mustDo: true },
          ],
          estimatedTime: '2 weeks',
          prerequisites: ['basics'],
          color: 'from-blue-400 to-blue-600',
          icon: '📚',
        },
        {
          id: 'hashmaps',
          title: 'Hash Tables & Sets',
          description: 'Master hash-based data structures',
          topics: ['HashMap', 'HashSet', 'Frequency Counting'],
          problems: [
            { title: 'Contains Duplicate', difficulty: 'Easy', mustDo: true },
            { title: 'Group Anagrams', difficulty: 'Medium', mustDo: true },
            { title: 'Longest Consecutive Sequence', difficulty: 'Medium', mustDo: true },
            { title: 'Subarray Sum Equals K', difficulty: 'Medium', mustDo: false },
          ],
          estimatedTime: '1.5 weeks',
          prerequisites: ['arrays'],
          color: 'from-purple-400 to-purple-600',
          icon: '🗂️',
        },
        {
          id: 'linkedlists',
          title: 'Linked Lists',
          description: 'Understand pointer manipulation and linked structures',
          topics: ['Singly Linked List', 'Doubly Linked List', 'Cycle Detection'],
          problems: [
            { title: 'Reverse Linked List', difficulty: 'Easy', mustDo: true },
            { title: 'Merge Two Sorted Lists', difficulty: 'Easy', mustDo: true },
            { title: 'Linked List Cycle', difficulty: 'Easy', mustDo: true },
            { title: 'Add Two Numbers', difficulty: 'Medium', mustDo: true },
            { title: 'Remove Nth Node From End', difficulty: 'Medium', mustDo: false },
          ],
          estimatedTime: '1.5 weeks',
          prerequisites: ['arrays'],
          color: 'from-yellow-400 to-yellow-600',
          icon: '🔗',
        },
      ],
    },
    intermediate: {
      title: "Intermediate to Advanced",
      description: "Level up your problem-solving skills",
      stages: [
        {
          id: 'trees',
          title: 'Trees & Binary Search Trees',
          description: 'Master tree traversals and BST operations',
          topics: ['Tree Traversal', 'BST', 'Tree Construction'],
          problems: [
            { title: 'Maximum Depth of Binary Tree', difficulty: 'Easy', mustDo: true },
            { title: 'Invert Binary Tree', difficulty: 'Easy', mustDo: true },
            { title: 'Validate Binary Search Tree', difficulty: 'Medium', mustDo: true },
            { title: 'Lowest Common Ancestor', difficulty: 'Medium', mustDo: true },
            { title: 'Binary Tree Level Order Traversal', difficulty: 'Medium', mustDo: true },
          ],
          estimatedTime: '2 weeks',
          prerequisites: [],
          color: 'from-green-500 to-green-700',
          icon: '🌳',
        },
        {
          id: 'graphs',
          title: 'Graphs',
          description: 'Explore graph algorithms and traversals',
          topics: ['BFS', 'DFS', 'Dijkstra', 'Union Find'],
          problems: [
            { title: 'Number of Islands', difficulty: 'Medium', mustDo: true },
            { title: 'Clone Graph', difficulty: 'Medium', mustDo: true },
            { title: 'Course Schedule', difficulty: 'Medium', mustDo: true },
            { title: 'Pacific Atlantic Water Flow', difficulty: 'Medium', mustDo: false },
            { title: 'Word Ladder', difficulty: 'Hard', mustDo: false },
          ],
          estimatedTime: '3 weeks',
          prerequisites: ['trees'],
          color: 'from-indigo-500 to-indigo-700',
          icon: '🕸️',
        },
        {
          id: 'dp',
          title: 'Dynamic Programming',
          description: 'Master the art of optimization',
          topics: ['Memoization', 'Tabulation', 'State Transition'],
          problems: [
            { title: 'Climbing Stairs', difficulty: 'Easy', mustDo: true },
            { title: 'House Robber', difficulty: 'Medium', mustDo: true },
            { title: 'Longest Palindromic Substring', difficulty: 'Medium', mustDo: true },
            { title: 'Coin Change', difficulty: 'Medium', mustDo: true },
            { title: 'Edit Distance', difficulty: 'Hard', mustDo: false },
          ],
          estimatedTime: '4 weeks',
          prerequisites: ['trees'],
          color: 'from-red-500 to-red-700',
          icon: '🎯',
        },
      ],
    },
    interview: {
      title: "Interview Preparation",
      description: "Focus on the most common interview patterns",
      stages: [
        {
          id: 'patterns',
          title: 'Common Patterns',
          description: 'Master frequently asked patterns',
          topics: ['Sliding Window', 'Two Pointers', 'Fast & Slow'],
          problems: [
            { title: 'Longest Substring Without Repeating', difficulty: 'Medium', mustDo: true },
            { title: 'Container With Most Water', difficulty: 'Medium', mustDo: true },
            { title: 'Trapping Rain Water', difficulty: 'Hard', mustDo: true },
            { title: 'Minimum Window Substring', difficulty: 'Hard', mustDo: false },
          ],
          estimatedTime: '2 weeks',
          prerequisites: [],
          color: 'from-orange-500 to-orange-700',
          icon: '🎨',
        },
        {
          id: 'system',
          title: 'System Design Basics',
          description: 'Introduction to scalable systems',
          topics: ['Load Balancing', 'Caching', 'Database Design'],
          problems: [
            { title: 'Design URL Shortener', difficulty: 'Medium', mustDo: true },
            { title: 'Design Twitter', difficulty: 'Hard', mustDo: true },
            { title: 'Design Instagram', difficulty: 'Hard', mustDo: false },
          ],
          estimatedTime: '3 weeks',
          prerequisites: ['patterns'],
          color: 'from-pink-500 to-pink-700',
          icon: '🏗️',
        },
      ],
    },
  };

  const currentTrack = roadmapTracks[selectedTrack as keyof typeof roadmapTracks];

  const toggleStageCompletion = (stageId: string) => {
    const newCompleted = new Set(completedStages);
    if (newCompleted.has(stageId)) {
      newCompleted.delete(stageId);
    } else {
      newCompleted.add(stageId);
    }
    setCompletedStages(newCompleted);
  };

  const getProgress = () => {
    const totalStages = currentTrack.stages.length;
    const completed = currentTrack.stages.filter(s => completedStages.has(s.id)).length;
    return (completed / totalStages) * 100;
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          🗺️ Learning Roadmap
        </h2>
        <p className="text-gray-600 mb-6">Follow a structured path to master data structures and algorithms</p>

        {/* Track Selection */}
        <div className="flex gap-4 mb-6">
          {Object.entries(roadmapTracks).map(([key, track]) => (
            <button
              key={key}
              onClick={() => setSelectedTrack(key)}
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                selectedTrack === key
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <div className="text-sm font-bold">{track.title}</div>
              <div className="text-xs opacity-90">{track.description}</div>
            </button>
          ))}
        </div>

        {/* Progress Bar */}
        <div className="bg-gray-200 rounded-full h-4 mb-2 overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-500"
            style={{ width: `${getProgress()}%` }}
          />
        </div>
        <div className="text-sm text-gray-600 text-right">
          {completedStages.size} / {currentTrack.stages.length} stages completed
        </div>
      </div>

      {/* Roadmap Stages */}
      <div className="space-y-6">
        {currentTrack.stages.map((stage, index) => {
          const isCompleted = completedStages.has(stage.id);
          const isLocked = stage.prerequisites.length > 0 && 
            !stage.prerequisites.every(p => completedStages.has(p));

          return (
            <div
              key={stage.id}
              className={`relative rounded-xl p-6 transition-all ${
                isLocked ? 'opacity-50 bg-gray-50' : 'bg-gradient-to-r ' + stage.color + ' bg-opacity-10'
              } ${isCompleted ? 'ring-2 ring-green-500' : ''}`}
            >
              {/* Connection Line */}
              {index < currentTrack.stages.length - 1 && (
                <div className="absolute left-10 top-full w-0.5 h-6 bg-gray-300" />
              )}

              <div className="flex items-start gap-4">
                {/* Stage Icon */}
                <div className={`text-4xl p-3 rounded-xl bg-gradient-to-r ${stage.color} text-white shadow-lg`}>
                  {stage.icon}
                </div>

                {/* Stage Content */}
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-bold text-gray-800">{stage.title}</h3>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500">{stage.estimatedTime}</span>
                      <button
                        onClick={() => toggleStageCompletion(stage.id)}
                        disabled={isLocked}
                        className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                          isCompleted
                            ? 'bg-green-500 text-white'
                            : isLocked
                            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                      >
                        {isCompleted ? '✓ Completed' : isLocked ? '🔒 Locked' : 'Mark Complete'}
                      </button>
                    </div>
                  </div>

                  <p className="text-gray-600 mb-4">{stage.description}</p>

                  {/* Topics */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {stage.topics.map(topic => (
                      <span key={topic} className="px-3 py-1 bg-white bg-opacity-80 rounded-full text-xs font-medium">
                        {topic}
                      </span>
                    ))}
                  </div>

                  {/* Problems */}
                  <div className="space-y-2">
                    <div className="text-sm font-semibold text-gray-700">Practice Problems:</div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {stage.problems.map(problem => (
                        <div
                          key={problem.title}
                          className={`px-3 py-2 rounded-lg text-sm ${
                            problem.mustDo ? 'bg-yellow-50 border border-yellow-300' : 'bg-white bg-opacity-60'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-medium">{problem.title}</span>
                            {problem.mustDo && <span className="text-xs text-yellow-600 font-bold">MUST DO</span>}
                          </div>
                          <span className={`text-xs ${
                            problem.difficulty === 'Easy' ? 'text-green-600' :
                            problem.difficulty === 'Medium' ? 'text-yellow-600' : 'text-red-600'
                          }`}>
                            {problem.difficulty}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Prerequisites */}
                  {stage.prerequisites.length > 0 && (
                    <div className="mt-4 text-sm text-gray-500">
                      Prerequisites: {stage.prerequisites.join(', ')}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Study Tips */}
      <div className="mt-8 p-6 bg-blue-50 rounded-xl">
        <h3 className="font-bold text-lg mb-3">💡 Study Tips</h3>
        <ul className="space-y-2 text-sm text-gray-700">
          <li>• Complete stages in order for the best learning experience</li>
          <li>• Focus on "MUST DO" problems first</li>
          <li>• Review completed stages periodically</li>
          <li>• Join study groups for collaborative learning</li>
          <li>• Track your progress daily for consistency</li>
        </ul>
      </div>
    </div>
  );
}