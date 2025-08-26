"use client";

import { useState, useEffect } from 'react';
import { 
  CheckCircleIcon,
  XCircleIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
  PlayIcon,
  StopIcon,
  ClockIcon,
  ChartBarIcon,
  TrophyIcon,
  AcademicCapIcon
} from "@heroicons/react/24/outline";

import { leetcodeProblems, getRandomProblems, QuizProblem, Algorithm } from '@/lib/data/leetcode-problems';

interface QuizResult {
  problemId: number;
  selectedAlgorithms: string[];
  correctAlgorithms: string[];
  isCorrect: boolean;
  timeSpent: number;
}

export default function LeetCodeQuiz() {
  const [currentProblem, setCurrentProblem] = useState<QuizProblem | null>(null);
  const [selectedAlgorithms, setSelectedAlgorithms] = useState<string[]>([]);
  const [quizResults, setQuizResults] = useState<QuizResult[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [timeSpent, setTimeSpent] = useState(0);
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);
  const [quizConfig, setQuizConfig] = useState({
    questionCount: 5,
    difficulty: 'all' as 'all' | 'Easy' | 'Medium' | 'Hard',
    category: 'all' as string
  });

  const [availableCategories] = useState(() => {
    const categories = new Set<string>();
    leetcodeProblems.forEach(problem => {
      problem.categories.forEach(cat => categories.add(cat));
    });
    return Array.from(categories).sort();
  });

  useEffect(() => {
    if (quizStarted && !quizCompleted) {
      const interval = setInterval(() => {
        setTimeSpent(prev => prev + 1);
      }, 1000);
      setTimer(interval);
      return () => clearInterval(interval);
    }
  }, [quizStarted, quizCompleted]);

  const startQuiz = () => {
    let filteredProblems = leetcodeProblems;
    
    if (quizConfig.difficulty !== 'all') {
      filteredProblems = filteredProblems.filter(p => p.difficulty === quizConfig.difficulty);
    }
    
    if (quizConfig.category !== 'all') {
      filteredProblems = filteredProblems.filter(p => p.categories.includes(quizConfig.category));
    }
    
    const selectedProblems = getRandomProblems(quizConfig.questionCount);
    setCurrentProblem(selectedProblems[0]);
    setCurrentQuestionIndex(0);
    setQuizResults([]);
    setSelectedAlgorithms([]);
    setTimeSpent(0);
    setQuizStarted(true);
    setQuizCompleted(false);
  };

  const handleAlgorithmToggle = (algorithmName: string) => {
    setSelectedAlgorithms(prev => 
      prev.includes(algorithmName)
        ? prev.filter(alg => alg !== algorithmName)
        : [...prev, algorithmName]
    );
  };

  const submitAnswer = () => {
    if (!currentProblem) return;

    const correctAlgorithms = currentProblem.algorithms.map(alg => alg.name);
    const isCorrect = selectedAlgorithms.length === correctAlgorithms.length &&
      selectedAlgorithms.every(alg => correctAlgorithms.includes(alg));

    const result: QuizResult = {
      problemId: currentProblem.id,
      selectedAlgorithms: [...selectedAlgorithms],
      correctAlgorithms,
      isCorrect,
      timeSpent
    };

    setQuizResults(prev => [...prev, result]);
    
    // Move to next question or complete quiz
    if (currentQuestionIndex < quizConfig.questionCount - 1) {
      const nextProblems = getRandomProblems(quizConfig.questionCount);
      setCurrentProblem(nextProblems[currentQuestionIndex + 1]);
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAlgorithms([]);
      setTimeSpent(0);
    } else {
      setQuizCompleted(true);
      if (timer) clearInterval(timer);
    }
  };

  const resetQuiz = () => {
    setQuizStarted(false);
    setQuizCompleted(false);
    setCurrentProblem(null);
    setSelectedAlgorithms([]);
    setQuizResults([]);
    setCurrentQuestionIndex(0);
    setTimeSpent(0);
    if (timer) clearInterval(timer);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getScore = () => {
    const correct = quizResults.filter(r => r.isCorrect).length;
    return Math.round((correct / quizResults.length) * 100);
  };

  const getAverageTime = () => {
    const totalTime = quizResults.reduce((sum, r) => sum + r.timeSpent, 0);
    return Math.round(totalTime / quizResults.length);
  };

  if (!quizStarted) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">LeetCode Algorithm Quiz</h1>
            <p className="text-gray-600">Test your knowledge of algorithms and data structures with real LeetCode problems</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-blue-50 p-6 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{leetcodeProblems.length}</div>
              <div className="text-blue-600">Total Problems</div>
            </div>
            <div className="bg-green-50 p-6 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{availableCategories.length}</div>
              <div className="text-green-600">Categories</div>
            </div>
            <div className="bg-purple-50 p-6 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">32</div>
              <div className="text-purple-600">Algorithms</div>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Number of Questions
              </label>
              <select
                value={quizConfig.questionCount}
                onChange={(e) => setQuizConfig(prev => ({ ...prev, questionCount: parseInt(e.target.value) }))}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value={5}>5 Questions</option>
                <option value={10}>10 Questions</option>
                <option value={15}>15 Questions</option>
                <option value={20}>20 Questions</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Difficulty Level
              </label>
              <select
                value={quizConfig.difficulty}
                onChange={(e) => setQuizConfig(prev => ({ ...prev, difficulty: e.target.value as any }))}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Difficulties</option>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category (Optional)
              </label>
              <select
                value={quizConfig.category}
                onChange={(e) => setQuizConfig(prev => ({ ...prev, category: e.target.value }))}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Categories</option>
                {availableCategories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-8 text-center">
            <button
              onClick={startQuiz}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center mx-auto"
            >
              <PlayIcon className="w-5 h-5 mr-2" />
              Start Quiz
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (quizCompleted) {
    const score = getScore();
    const averageTime = getAverageTime();
    const correctAnswers = quizResults.filter(r => r.isCorrect).length;

    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Quiz Completed!</h1>
            <div className="text-6xl font-bold text-blue-600 mb-4">{score}%</div>
            <p className="text-gray-600">Your final score</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-green-50 p-6 rounded-lg text-center">
              <div className="text-2xl font-bold text-green-600">{correctAnswers}</div>
              <div className="text-green-600">Correct</div>
            </div>
            <div className="bg-red-50 p-6 rounded-lg text-center">
              <div className="text-2xl font-bold text-red-600">{quizResults.length - correctAnswers}</div>
              <div className="text-red-600">Incorrect</div>
            </div>
            <div className="bg-blue-50 p-6 rounded-lg text-center">
              <div className="text-2xl font-bold text-blue-600">{formatTime(averageTime)}</div>
              <div className="text-blue-600">Avg Time</div>
            </div>
            <div className="bg-purple-50 p-6 rounded-lg text-center">
              <div className="text-2xl font-bold text-purple-600">{quizResults.length}</div>
              <div className="text-purple-600">Total</div>
            </div>
          </div>

          <div className="space-y-4 mb-8">
            <h2 className="text-xl font-semibold text-gray-900">Question Results</h2>
            {quizResults.map((result, index) => {
              const problem = leetcodeProblems.find(p => p.id === result.problemId);
              return (
                <div key={index} className={`p-4 rounded-lg border ${result.isCorrect ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-gray-900">
                      Q{index + 1}: {problem?.title}
                    </h3>
                    {result.isCorrect ? (
                      <CheckCircleIcon className="w-5 h-5 text-green-600" />
                    ) : (
                      <XCircleIcon className="w-5 h-5 text-red-600" />
                    )}
                  </div>
                  <div className="text-sm text-gray-600">
                    <div>Selected: {result.selectedAlgorithms.join(', ') || 'None'}</div>
                    <div>Correct: {result.correctAlgorithms.join(', ')}</div>
                    <div>Time: {formatTime(result.timeSpent)}</div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="text-center">
            <button
              onClick={resetQuiz}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Take Another Quiz
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!currentProblem) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg">
        {/* Header */}
        <div className="border-b border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <ClockIcon className="w-5 h-5 text-gray-500" />
                <span className="text-lg font-mono">{formatTime(timeSpent)}</span>
              </div>
              <div className="flex items-center space-x-2">
                <ChartBarIcon className="w-5 h-5 text-gray-500" />
                <span>Question {currentQuestionIndex + 1} of {quizConfig.questionCount}</span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                currentProblem.difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
                currentProblem.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {currentProblem.difficulty}
              </span>
              <span className="text-sm text-gray-500">{currentProblem.acceptanceRate}</span>
            </div>
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{currentProblem.title}</h1>
          <div className="flex flex-wrap gap-2">
            {currentProblem.categories.map(category => (
              <span key={category} className="px-2 py-1 bg-gray-100 text-gray-700 text-sm rounded">
                {category}
              </span>
            ))}
          </div>
        </div>

        {/* Problem Description */}
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Problem Description</h2>
          <p className="text-gray-700 mb-4 whitespace-pre-line">{currentProblem.description}</p>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium text-gray-900 mb-2">Example:</h3>
            <pre className="text-sm text-gray-700 whitespace-pre-line">{currentProblem.example}</pre>
          </div>
        </div>

        {/* Algorithm Selection */}
        <div className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Select all algorithms that can solve this problem:
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {currentProblem.algorithms.map(algorithm => (
              <div
                key={algorithm.name}
                onClick={() => handleAlgorithmToggle(algorithm.name)}
                className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                  selectedAlgorithms.includes(algorithm.name)
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-900">{algorithm.name}</span>
                  {selectedAlgorithms.includes(algorithm.name) && (
                    <CheckCircleIcon className="w-5 h-5 text-blue-600" />
                  )}
                </div>
                <p className="text-sm text-gray-600 mt-1">{algorithm.description}</p>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-600">
              Selected: {selectedAlgorithms.length} algorithm{selectedAlgorithms.length !== 1 ? 's' : ''}
            </div>
            <button
              onClick={submitAnswer}
              disabled={selectedAlgorithms.length === 0}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center"
            >
              Submit Answer
              <ArrowRightIcon className="w-4 h-4 ml-2" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
