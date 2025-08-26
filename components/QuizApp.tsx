"use client";

import { useState, useEffect } from 'react';
import { 
  CheckCircleIcon, 
  XCircleIcon, 
  ClockIcon, 
  TrophyIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
  PlayIcon,
  PauseIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import { leetcodeProblems, allAlgorithms, getRandomProblems, type LeetCodeProblem } from '@/lib/data/problems';

interface QuizResult {
  problemId: number;
  selectedAlgorithms: string[];
  correctAlgorithms: string[];
  score: number;
  isCorrect: boolean;
}

export default function QuizApp() {
  const [currentProblemIndex, setCurrentProblemIndex] = useState(0);
  const [problems, setProblems] = useState<LeetCodeProblem[]>([]);
  const [selectedAlgorithms, setSelectedAlgorithms] = useState<string[]>([]);
  const [quizResults, setQuizResults] = useState<QuizResult[]>([]);
  const [quizMode, setQuizMode] = useState<'practice' | 'timed'>('practice');
  const [difficulty, setDifficulty] = useState<'Easy' | 'Medium' | 'Hard' | 'Mixed'>('Mixed');
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes for timed mode
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);

  // Initialize quiz
  const startQuiz = () => {
    const problemCount = quizMode === 'practice' ? 5 : 10;
    const selectedProblems = getRandomProblems(problemCount, difficulty === 'Mixed' ? undefined : difficulty);
    setProblems(selectedProblems);
    setCurrentProblemIndex(0);
    setSelectedAlgorithms([]);
    setQuizResults([]);
    setShowResults(false);
    setQuizStarted(true);
    
    if (quizMode === 'timed') {
      setTimeLeft(300);
      setIsTimerRunning(true);
    }
  };

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isTimerRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setIsTimerRunning(false);
            submitQuiz();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isTimerRunning, timeLeft]);

  // Handle algorithm selection
  const toggleAlgorithm = (algorithm: string) => {
    setSelectedAlgorithms(prev => 
      prev.includes(algorithm)
        ? prev.filter(alg => alg !== algorithm)
        : [...prev, algorithm]
    );
  };

  // Submit current problem answer
  const submitAnswer = () => {
    const currentProblem = problems[currentProblemIndex];
    const correctAlgorithms = currentProblem.algorithms;
    
    // Calculate F1 score
    const truePositives = selectedAlgorithms.filter(alg => correctAlgorithms.includes(alg)).length;
    const falsePositives = selectedAlgorithms.filter(alg => !correctAlgorithms.includes(alg)).length;
    const falseNegatives = correctAlgorithms.filter(alg => !selectedAlgorithms.includes(alg)).length;
    
    const precision = truePositives / (truePositives + falsePositives) || 0;
    const recall = truePositives / (truePositives + falseNegatives) || 0;
    const f1Score = precision + recall > 0 ? (2 * precision * recall) / (precision + recall) : 0;
    
    const result: QuizResult = {
      problemId: currentProblem.id,
      selectedAlgorithms: [...selectedAlgorithms],
      correctAlgorithms: correctAlgorithms,
      score: f1Score,
      isCorrect: f1Score >= 0.8 // Consider correct if F1 score >= 0.8
    };

    setQuizResults(prev => [...prev, result]);

    // Move to next problem or finish quiz
    if (currentProblemIndex < problems.length - 1) {
      setCurrentProblemIndex(prev => prev + 1);
      setSelectedAlgorithms([]);
    } else {
      finishQuiz();
    }
  };

  // Finish quiz
  const finishQuiz = () => {
    setIsTimerRunning(false);
    setShowResults(true);
  };

  // Submit quiz (for timed mode)
  const submitQuiz = () => {
    if (currentProblemIndex < problems.length) {
      submitAnswer();
    }
  };

  // Reset quiz
  const resetQuiz = () => {
    setQuizStarted(false);
    setProblems([]);
    setCurrentProblemIndex(0);
    setSelectedAlgorithms([]);
    setQuizResults([]);
    setShowResults(false);
    setTimeLeft(300);
    setIsTimerRunning(false);
  };

  // Format time
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Get difficulty color
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'text-green-600 bg-green-100';
      case 'Medium': return 'text-yellow-600 bg-yellow-100';
      case 'Hard': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (!quizStarted) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">🧠 LeetCode Algorithm Quiz</h1>
            <p className="text-xl text-gray-600">Test your algorithm identification skills with real LeetCode problems</p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Quiz Mode Selection */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Choose Quiz Mode</h2>
                <div className="space-y-4">
                  <button
                    onClick={() => setQuizMode('practice')}
                    className={`w-full p-4 rounded-lg border-2 transition-colors ${
                      quizMode === 'practice'
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="text-left">
                        <h3 className="font-semibold text-gray-900">Practice Mode</h3>
                        <p className="text-sm text-gray-600">5 problems, unlimited time</p>
                      </div>
                      <PlayIcon className="h-6 w-6 text-blue-600" />
                    </div>
                  </button>

                  <button
                    onClick={() => setQuizMode('timed')}
                    className={`w-full p-4 rounded-lg border-2 transition-colors ${
                      quizMode === 'timed'
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="text-left">
                        <h3 className="font-semibold text-gray-900">Timed Challenge</h3>
                        <p className="text-sm text-gray-600">10 problems, 5 minutes</p>
                      </div>
                      <ClockIcon className="h-6 w-6 text-blue-600" />
                    </div>
                  </button>
                </div>
              </div>

              {/* Difficulty Selection */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Choose Difficulty</h2>
                <div className="grid grid-cols-2 gap-4">
                  {(['Easy', 'Medium', 'Hard', 'Mixed'] as const).map((diff) => (
                    <button
                      key={diff}
                      onClick={() => setDifficulty(diff)}
                      className={`p-4 rounded-lg border-2 transition-colors ${
                        difficulty === diff
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="text-center">
                        <div className={`inline-block px-2 py-1 rounded text-xs font-medium ${getDifficultyColor(diff)}`}>
                          {diff}
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          {diff === 'Mixed' ? 'All difficulties' : `${diff} problems only`}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-8 text-center">
              <button
                onClick={startQuiz}
                className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Start Quiz
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (showResults) {
    const totalScore = quizResults.reduce((sum, result) => sum + result.score, 0);
    const averageScore = totalScore / quizResults.length;
    const correctAnswers = quizResults.filter(result => result.isCorrect).length;

    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Quiz Results</h1>
            <div className="flex justify-center space-x-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">{averageScore.toFixed(2)}</div>
                <div className="text-sm text-gray-600">Average F1 Score</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">{correctAnswers}/{quizResults.length}</div>
                <div className="text-sm text-gray-600">Correct Answers</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Detailed Results</h2>
            <div className="space-y-6">
              {quizResults.map((result, index) => {
                const problem = problems.find(p => p.id === result.problemId)!;
                return (
                  <div key={index} className="border border-gray-200 rounded-lg p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {index + 1}. {problem.title}
                        </h3>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${getDifficultyColor(problem.difficulty)}`}>
                            {problem.difficulty}
                          </span>
                          <span className="text-sm text-gray-600">F1 Score: {result.score.toFixed(2)}</span>
                        </div>
                      </div>
                      {result.isCorrect ? (
                        <CheckCircleIcon className="h-6 w-6 text-green-600" />
                      ) : (
                        <XCircleIcon className="h-6 w-6 text-red-600" />
                      )}
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Your Selection:</h4>
                        <div className="flex flex-wrap gap-2">
                          {result.selectedAlgorithms.map(alg => (
                            <span
                              key={alg}
                              className={`px-2 py-1 rounded text-xs ${
                                result.correctAlgorithms.includes(alg)
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-red-100 text-red-800'
                              }`}
                            >
                              {alg}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Correct Algorithms:</h4>
                        <div className="flex flex-wrap gap-2">
                          {result.correctAlgorithms.map(alg => (
                            <span key={alg} className="px-2 py-1 rounded text-xs bg-green-100 text-green-800">
                              {alg}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-8 text-center">
              <button
                onClick={resetQuiz}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors mr-4"
              >
                <ArrowPathIcon className="h-5 w-5 inline mr-2" />
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentProblem = problems[currentProblemIndex];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">LeetCode Algorithm Quiz</h1>
              <p className="text-gray-600">
                Problem {currentProblemIndex + 1} of {problems.length}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              {quizMode === 'timed' && (
                <div className="flex items-center space-x-2">
                  <ClockIcon className="h-5 w-5 text-red-600" />
                  <span className="text-lg font-mono font-semibold text-red-600">
                    {formatTime(timeLeft)}
                  </span>
                </div>
              )}
              <div className="text-right">
                <div className="text-sm text-gray-600">Mode</div>
                <div className="font-semibold text-gray-900">
                  {quizMode === 'practice' ? 'Practice' : 'Timed'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Problem */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{currentProblem.title}</h2>
              <div className="flex items-center space-x-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(currentProblem.difficulty)}`}>
                  {currentProblem.difficulty}
                </span>
                <a
                  href={currentProblem.leetcodeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  View on LeetCode →
                </a>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Problem Description</h3>
            <p className="text-gray-700 leading-relaxed">{currentProblem.description}</p>
          </div>

          {/* Examples */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Examples</h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <pre className="text-sm text-gray-700 whitespace-pre-wrap">{currentProblem.example}</pre>
            </div>
          </div>

          {/* Constraints */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Constraints</h3>
            <ul className="list-disc list-inside space-y-1 text-gray-700">
              {currentProblem.constraints.map((constraint, index) => (
                <li key={index} className="text-sm">{constraint}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Algorithm Selection */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-6">
            Select all algorithms that can solve this problem:
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {allAlgorithms.map((algorithm) => (
              <button
                key={algorithm}
                onClick={() => toggleAlgorithm(algorithm)}
                className={`p-3 rounded-lg border-2 transition-colors text-left ${
                  selectedAlgorithms.includes(algorithm)
                    ? 'border-blue-500 bg-blue-50 text-blue-900'
                    : 'border-gray-200 hover:border-gray-300 text-gray-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{algorithm}</span>
                  {selectedAlgorithms.includes(algorithm) && (
                    <CheckCircleIcon className="h-5 w-5 text-blue-600" />
                  )}
                </div>
              </button>
            ))}
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 mb-4">
              Selected: {selectedAlgorithms.length} algorithm{selectedAlgorithms.length !== 1 ? 's' : ''}
            </p>
            <button
              onClick={submitAnswer}
              disabled={selectedAlgorithms.length === 0}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {currentProblemIndex < problems.length - 1 ? 'Next Problem' : 'Finish Quiz'}
              <ArrowRightIcon className="h-5 w-5 inline ml-2" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
