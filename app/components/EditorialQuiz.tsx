"use client";

import { useState, useEffect } from "react";
import { 
  ClockIcon, 
  CheckCircleIcon, 
  XCircleIcon,
  ChevronRightIcon,
  ChevronLeftIcon
} from "@heroicons/react/24/outline";

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
  difficulty: string;
  category: string;
  description: string;
  examples: string[];
  constraints: string[];
  solutions: string[];
  timeComplexity: string;
  spaceComplexity: string;
  leetcodeUrl: string;
  tags: string[];
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
  const [showSolution, setShowSolution] = useState(false);
  const [showHints, setShowHints] = useState(false);

  if (!problem) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading problem...</p>
      </div>
    );
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAlgorithmToggle = (algorithmName: string) => {
    const newSelection = selectedAlgorithms.includes(algorithmName)
      ? selectedAlgorithms.filter(name => name !== algorithmName)
      : [...selectedAlgorithms, algorithmName];
    onAlgorithmSelect(newSelection);
  };

  const isCorrect = () => {
    // Mock correct algorithms - in real app, this would come from problem data
    const correctAlgorithms = ["Two Pointers", "Hash Table"];
    return selectedAlgorithms.length === correctAlgorithms.length &&
           selectedAlgorithms.every(alg => correctAlgorithms.includes(alg));
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-gray-900">{problem.title}</h1>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              problem.difficulty === "Easy" ? "bg-green-100 text-green-800" :
              problem.difficulty === "Medium" ? "bg-yellow-100 text-yellow-800" :
              "bg-red-100 text-red-800"
            }`}>
              {problem.difficulty}
            </span>
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
              {problem.category}
            </span>
          </div>
          <div className="flex items-center space-x-2 text-red-600">
            <ClockIcon className="w-5 h-5" />
            <span className="font-mono text-lg font-semibold">{formatTime(timeLeft)}</span>
          </div>
        </div>

        <p className="text-gray-700 mb-4">{problem.description}</p>

        {/* Examples */}
        <div className="mb-4">
          <h3 className="font-semibold text-gray-900 mb-2">Examples:</h3>
          <div className="space-y-2">
            {problem.examples.slice(0, 2).map((example, index) => (
              <div key={index} className="bg-gray-50 p-3 rounded text-sm font-mono">
                {example}
              </div>
            ))}
          </div>
        </div>

        {/* Constraints */}
        <div className="mb-4">
          <h3 className="font-semibold text-gray-900 mb-2">Constraints:</h3>
          <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
            {problem.constraints.slice(0, 3).map((constraint, index) => (
              <li key={index}>{constraint}</li>
            ))}
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3">
          <button
            onClick={() => setShowHints(!showHints)}
            className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
          >
            {showHints ? "Hide" : "Show"} Hints
          </button>
          <button
            onClick={() => setShowSolution(!showSolution)}
            className="px-4 py-2 text-sm font-medium text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg transition-colors"
          >
            {showSolution ? "Hide" : "Show"} Solution
          </button>
        </div>
      </div>

      {/* Hints */}
      {showHints && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-blue-900 mb-2">Hints:</h3>
          <ul className="list-disc list-inside text-blue-800 space-y-1">
            <li>Consider the time complexity requirements</li>
            <li>Think about what data structure would be most efficient</li>
            <li>Consider edge cases and boundary conditions</li>
          </ul>
        </div>
      )}

      {/* Solution */}
      {showSolution && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-green-900 mb-2">Solution:</h3>
          <div className="space-y-3">
            {problem.solutions.map((solution, index) => (
              <div key={index} className="text-green-800">
                <p className="font-medium">{solution}</p>
              </div>
            ))}
            <div className="text-sm text-green-700">
              <p><strong>Time Complexity:</strong> {problem.timeComplexity}</p>
              <p><strong>Space Complexity:</strong> {problem.spaceComplexity}</p>
            </div>
          </div>
        </div>
      )}

      {/* Algorithm Selection */}
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Select the algorithms that can solve this problem:
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {algorithms.map((algorithm) => (
            <div
              key={algorithm.id}
              className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                selectedAlgorithms.includes(algorithm.name)
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
              onClick={() => handleAlgorithmToggle(algorithm.name)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">{algorithm.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">{algorithm.description}</p>
                  <div className="flex space-x-4 mt-2 text-xs text-gray-500">
                    <span>Time: {algorithm.timeComplexity}</span>
                    <span>Space: {algorithm.spaceComplexity}</span>
                  </div>
                </div>
                {selectedAlgorithms.includes(algorithm.name) && (
                  <CheckCircleIcon className="w-5 h-5 text-blue-600 ml-2" />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Feedback */}
      {selectedAlgorithms.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {isCorrect() ? (
                <>
                  <CheckCircleIcon className="w-6 h-6 text-green-600" />
                  <span className="text-green-800 font-medium">Correct! Well done!</span>
                </>
              ) : (
                <>
                  <XCircleIcon className="w-6 h-6 text-red-600" />
                  <span className="text-red-800 font-medium">Not quite right. Try again!</span>
                </>
              )}
            </div>
            <div className="text-sm text-gray-600">
              Selected: {selectedAlgorithms.length} algorithm{selectedAlgorithms.length !== 1 ? 's' : ''}
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between">
        <button
          className="px-6 py-3 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors flex items-center space-x-2"
        >
          <ChevronLeftIcon className="w-4 h-4" />
          <span>Previous</span>
        </button>
        
        <button
          onClick={onNext}
          disabled={selectedAlgorithms.length === 0}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
        >
          <span>Next Question</span>
          <ChevronRightIcon className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}