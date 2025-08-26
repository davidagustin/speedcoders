"use client";

import { useState, useEffect } from 'react';
import { problems, Problem, allAlgorithms } from '../lib/problems';

interface QuizState {
  currentProblem: Problem | null;
  selectedAlgorithms: string[];
  score: number;
  totalQuestions: number;
  showResult: boolean;
  usedProblems: Set<number>;
}

export default function Quiz() {
  const [quizState, setQuizState] = useState<QuizState>({
    currentProblem: null,
    selectedAlgorithms: [],
    score: 0,
    totalQuestions: 0,
    showResult: false,
    usedProblems: new Set()
  });

  const getRandomProblem = (): Problem => {
    const availableProblems = problems.filter(p => !quizState.usedProblems.has(p.id));
    if (availableProblems.length === 0) {
      // Reset if all problems used
      setQuizState(prev => ({ ...prev, usedProblems: new Set() }));
      return problems[Math.floor(Math.random() * problems.length)];
    }
    return availableProblems[Math.floor(Math.random() * availableProblems.length)];
  };

  const startNewQuestion = () => {
    const newProblem = getRandomProblem();
    setQuizState(prev => ({
      ...prev,
      currentProblem: newProblem,
      selectedAlgorithms: [],
      showResult: false,
      usedProblems: new Set([...prev.usedProblems, newProblem.id])
    }));
  };

  const handleAlgorithmToggle = (algorithm: string) => {
    setQuizState(prev => ({
      ...prev,
      selectedAlgorithms: prev.selectedAlgorithms.includes(algorithm)
        ? prev.selectedAlgorithms.filter(a => a !== algorithm)
        : [...prev.selectedAlgorithms, algorithm]
    }));
  };

  const submitAnswer = () => {
    if (!quizState.currentProblem) return;

    const correctAlgorithms = quizState.currentProblem.correctAlgorithms;
    const selectedCorrect = quizState.selectedAlgorithms.filter(alg => 
      correctAlgorithms.includes(alg)
    ).length;
    const selectedIncorrect = quizState.selectedAlgorithms.filter(alg => 
      !correctAlgorithms.includes(alg)
    ).length;
    const missedCorrect = correctAlgorithms.filter(alg => 
      !quizState.selectedAlgorithms.includes(alg)
    ).length;

    // Scoring: +2 for each correct, -1 for each incorrect, -0.5 for each missed
    const questionScore = Math.max(0, (selectedCorrect * 2) - (selectedIncorrect * 1) - (missedCorrect * 0.5));
    const maxScore = correctAlgorithms.length * 2;
    const normalizedScore = (questionScore / maxScore) * 100;

    setQuizState(prev => ({
      ...prev,
      score: prev.score + normalizedScore,
      totalQuestions: prev.totalQuestions + 1,
      showResult: true
    }));
  };

  const resetQuiz = () => {
    setQuizState({
      currentProblem: null,
      selectedAlgorithms: [],
      score: 0,
      totalQuestions: 0,
      showResult: false,
      usedProblems: new Set()
    });
  };

  useEffect(() => {
    if (!quizState.currentProblem) {
      startNewQuestion();
    }
  }, []);

  if (!quizState.currentProblem) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'text-green-600 bg-green-100';
      case 'Medium': return 'text-yellow-600 bg-yellow-100';
      case 'Hard': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getAlgorithmStyle = (algorithm: string) => {
    const isSelected = quizState.selectedAlgorithms.includes(algorithm);
    const isCorrect = quizState.currentProblem?.correctAlgorithms.includes(algorithm);
    
    if (quizState.showResult) {
      if (isCorrect && isSelected) {
        return 'bg-green-500 text-white border-green-500';
      } else if (isCorrect && !isSelected) {
        return 'bg-green-100 text-green-700 border-green-300 border-dashed';
      } else if (!isCorrect && isSelected) {
        return 'bg-red-500 text-white border-red-500';
      } else {
        return 'bg-gray-100 text-gray-600 border-gray-300';
      }
    } else {
      return isSelected 
        ? 'bg-blue-500 text-white border-blue-500'
        : 'bg-white text-gray-700 border-gray-300 hover:bg-blue-50 hover:border-blue-300';
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white min-h-screen">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold text-gray-900">LeetCode Algorithm Quiz</h1>
          <div className="text-right">
            <div className="text-sm text-gray-600">Average Score</div>
            <div className="text-2xl font-bold text-blue-600">
              {quizState.totalQuestions > 0 ? Math.round(quizState.score / quizState.totalQuestions) : 0}%
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
          <span>Questions: {quizState.totalQuestions}</span>
          <span>•</span>
          <span>Total Score: {Math.round(quizState.score)}</span>
        </div>
        {quizState.totalQuestions === 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-2">How to play:</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Read each LeetCode problem carefully</li>
              <li>• Select ALL algorithms that can solve the problem</li>
              <li>• You get points for correct selections, lose points for wrong ones</li>
              <li>• Try to identify the most efficient approaches!</li>
            </ul>
          </div>
        )}
      </div>

      <div className="bg-gray-50 rounded-lg p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">
            {quizState.currentProblem.id}. {quizState.currentProblem.title}
          </h2>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(quizState.currentProblem.difficulty)}`}>
            {quizState.currentProblem.difficulty}
          </span>
        </div>
        
        <p className="text-gray-700 mb-4 leading-relaxed">
          {quizState.currentProblem.description}
        </p>

        <div className="bg-white rounded border p-4 mb-4">
          <h4 className="font-semibold text-gray-900 mb-2">Example:</h4>
          <pre className="text-sm text-gray-700 whitespace-pre-wrap font-mono">
            {quizState.currentProblem.example}
          </pre>
        </div>

        <div className="bg-white rounded border p-4">
          <h4 className="font-semibold text-gray-900 mb-2">Constraints:</h4>
          <ul className="text-sm text-gray-700 list-disc list-inside">
            {quizState.currentProblem.constraints.map((constraint, index) => (
              <li key={index}>{constraint}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Select all algorithms that can solve this problem:
        </h3>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {quizState.currentProblem.allAlgorithms.map((algorithm) => (
            <button
              key={algorithm}
              onClick={() => !quizState.showResult && handleAlgorithmToggle(algorithm)}
              disabled={quizState.showResult}
              className={`px-4 py-2 rounded-lg border-2 transition-all font-medium text-sm ${getAlgorithmStyle(algorithm)} ${
                quizState.showResult ? 'cursor-default' : 'cursor-pointer'
              }`}
            >
              {algorithm}
            </button>
          ))}
        </div>

        {quizState.showResult && (
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-semibold text-blue-900 mb-2">Results:</h4>
            <div className="text-sm text-blue-800">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <span className="font-medium">✅ Correct:</span> {quizState.currentProblem.correctAlgorithms.join(', ')}
                </div>
                <div>
                  <span className="font-medium">✅ You selected:</span> {
                    quizState.selectedAlgorithms.filter(alg => 
                      quizState.currentProblem!.correctAlgorithms.includes(alg)
                    ).join(', ') || 'None'
                  }
                </div>
                <div>
                  <span className="font-medium">❌ Incorrect selections:</span> {
                    quizState.selectedAlgorithms.filter(alg => 
                      !quizState.currentProblem!.correctAlgorithms.includes(alg)
                    ).join(', ') || 'None'
                  }
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-4">
        {!quizState.showResult ? (
          <button
            onClick={submitAnswer}
            disabled={quizState.selectedAlgorithms.length === 0}
            className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Submit Answer
          </button>
        ) : (
          <button
            onClick={startNewQuestion}
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Next Question
          </button>
        )}
        
        <button
          onClick={resetQuiz}
          className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
        >
          Reset Quiz
        </button>
      </div>
    </div>
  );
}