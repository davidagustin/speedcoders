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
          {formatTime(timeLeft)}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Problem Description */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-lg font-semibold mb-4">Problem Description</h2>
          <div className="prose max-w-none">
            <p className="text-gray-700 mb-4">{problem.description}</p>
            
            {problem.examples.map((example, index) => (
              <div key={index} className="bg-gray-50 p-4 rounded-lg mb-4">
                <h4 className="font-semibold text-gray-900 mb-2">Example {index + 1}:</h4>
                <div className="font-mono text-sm">
                  <div><strong>Input:</strong> {example.input}</div>
                  <div><strong>Output:</strong> {example.output}</div>
                  {example.explanation && (
                    <div className="text-gray-600 mt-2"><strong>Explanation:</strong> {example.explanation}</div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6">
            <button
              onClick={() => setShowHint(!showHint)}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              {showHint ? '=H Hide Hint' : '=� Show Hint'}
            </button>
            {showHint && (
              <div className="mt-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-blue-800 text-sm">
                  Think about what data structures and algorithms would be most efficient for this problem. 
                  Consider the time and space complexity requirements.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Algorithm Selection */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-lg font-semibold mb-4">Select Algorithm(s)</h2>
          <p className="text-gray-600 mb-6">
            Choose the best algorithm(s) to solve this problem. You can select multiple approaches.
          </p>

          <div className="space-y-4">
            {algorithms.map((algorithm) => (
              <div
                key={algorithm.id}
                className={`border rounded-lg p-4 cursor-pointer transition-all ${
                  selectedAlgorithms.includes(algorithm.id)
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
                onClick={() => handleAlgorithmToggle(algorithm.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={selectedAlgorithms.includes(algorithm.id)}
                      onChange={() => handleAlgorithmToggle(algorithm.id)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <div>
                      <h3 className="font-medium text-gray-900">{algorithm.name}</h3>
                      <p className="text-sm text-gray-600">{algorithm.category}</p>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500">
                    <div>Time: {algorithm.timeComplexity}</div>
                    <div>Space: {algorithm.spaceComplexity}</div>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mt-2 ml-7">
                  {algorithm.description}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-8 flex justify-between items-center">
            <div className="text-sm text-gray-600">
              Selected: {selectedAlgorithms.length} algorithm(s)
            </div>
            <button
              onClick={onNext}
              disabled={selectedAlgorithms.length === 0}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                selectedAlgorithms.length > 0
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              Next Problem �
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}