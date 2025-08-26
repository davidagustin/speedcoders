'use client';

import { useState } from 'react';

interface Algorithm {
  id: string;
  name: string;
  category: string;
  description: string;
  timeComplexity: string;
  spaceComplexity: string;
}

interface Problem {
  id: number;
  title: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  examples: Array<{
    input: string;
    output: string;
    explanation: string;
  }>;
}

interface EditorialQuizProps {
  problem: Problem | null;
  algorithms: Algorithm[];
  onAlgorithmSelect: (algorithms: string[]) => void;
  selectedAlgorithms: string[];
  onNext: () => void;
  timeLeft: number;
}

export default function EditorialQuiz({
  problem,
  algorithms,
  onAlgorithmSelect,
  selectedAlgorithms,
  onNext,
  timeLeft
}: EditorialQuizProps) {
  const [showHint, setShowHint] = useState(false);

  if (!problem) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading problem...</p>
        </div>
      </div>
    );
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'text-green-600 bg-green-100';
      case 'Medium': return 'text-yellow-600 bg-yellow-100';
      case 'Hard': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const handleAlgorithmToggle = (algorithmId: string) => {
    const newSelected = selectedAlgorithms.includes(algorithmId)
      ? selectedAlgorithms.filter(id => id !== algorithmId)
      : [...selectedAlgorithms, algorithmId];
    onAlgorithmSelect(newSelected);
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold text-gray-900">{problem.title}</h1>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(problem.difficulty)}`}>
            {problem.difficulty}
          </span>
        </div>
        <div className={`text-2xl font-mono ${timeLeft < 60 ? 'text-red-600' : 'text-blue-600'}`}>
