"use client";

import { useState } from "react";
import { 
  TrophyIcon, 
  ChartBarIcon, 
  ClockIcon, 
  CheckCircleIcon,
  XCircleIcon,
  ArrowPathIcon,
  PlusIcon
} from "@heroicons/react/24/outline";

interface QuizResult {
  totalQuestions: number;
  correctAnswers: number;
  timeSpent: number;
  score: number;
  maxScore: number;
  accuracy: number;
  questions: Array<{
    id: string;
    title: string;
    userAnswer: string[];
    correctAnswer: string[];
    isCorrect: boolean;
    timeSpent: number;
  }>;
}

interface QuizResultsProps {
  results: QuizResult;
  onRetry: () => void;
  onNewQuiz: () => void;
  onViewDetails: () => void;
}

export default function QuizResults({
  results,
  onRetry,
  onNewQuiz,
  onViewDetails
}: QuizResultsProps) {
  const [showDetails, setShowDetails] = useState(false);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreMessage = (score: number) => {
    if (score >= 90) return "Excellent! You're a coding master! 🚀";
    if (score >= 80) return "Great job! You're getting really good at this! 💪";
    if (score >= 70) return "Good work! Keep practicing to improve! 👍";
    if (score >= 60) return "Not bad! A bit more practice and you'll be great! 📚";
    return "Keep practicing! Every attempt makes you better! 💪";
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border p-8 mb-6 text-center">
        <div className="flex justify-center mb-4">
          <div className="relative">
            <TrophyIcon className="w-16 h-16 text-yellow-500" />
            {results.score >= 80 && (
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">🔥</span>
              </div>
            )}
          </div>
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Quiz Complete!
        </h1>
        
        <p className="text-lg text-gray-600 mb-6">
          {getScoreMessage(results.score)}
        </p>

        {/* Score Display */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <svg className="w-32 h-32 transform -rotate-90">
              <circle
                cx="64"
                cy="64"
                r="56"
                stroke="currentColor"
                strokeWidth="8"
                fill="transparent"
                className="text-gray-200"
              />
              <circle
                cx="64"
                cy="64"
                r="56"
                stroke="currentColor"
                strokeWidth="8"
                fill="transparent"
                strokeDasharray={`${2 * Math.PI * 56}`}
                strokeDashoffset={`${2 * Math.PI * 56 * (1 - results.score / 100)}`}
                className={`${getScoreColor(results.score)} transition-all duration-1000`}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className={`text-2xl font-bold ${getScoreColor(results.score)}`}>
                  {results.score}%
                </div>
                <div className="text-sm text-gray-500">
                  {results.correctAnswers}/{results.totalQuestions}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Accuracy</p>
              <p className="text-2xl font-bold text-gray-900">{results.accuracy}%</p>
            </div>
            <ChartBarIcon className="w-8 h-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Time Spent</p>
              <p className="text-2xl font-bold text-gray-900">{formatTime(results.timeSpent)}</p>
            </div>
            <ClockIcon className="w-8 h-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Score</p>
              <p className="text-2xl font-bold text-gray-900">{results.score}/{results.maxScore}</p>
            </div>
            <TrophyIcon className="w-8 h-8 text-yellow-500" />
          </div>
        </div>
      </div>

      {/* Question Details */}
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Question Details</h2>
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            {showDetails ? "Hide Details" : "Show Details"}
          </button>
        </div>

        {showDetails && (
          <div className="space-y-4">
            {results.questions.map((question, index) => (
              <div
                key={question.id}
                className={`p-4 rounded-lg border ${
                  question.isCorrect ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-medium text-gray-900">
                    Question {index + 1}: {question.title}
                  </h3>
                  <div className="flex items-center space-x-2">
                    {question.isCorrect ? (
                      <CheckCircleIcon className="w-5 h-5 text-green-600" />
                    ) : (
                      <XCircleIcon className="w-5 h-5 text-red-600" />
                    )}
                    <span className="text-sm text-gray-500">
                      {formatTime(question.timeSpent)}
                    </span>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="font-medium text-gray-700 mb-1">Your Answer:</p>
                    <div className="flex flex-wrap gap-1">
                      {question.userAnswer.map((answer, i) => (
                        <span
                          key={i}
                          className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
                        >
                          {answer}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <p className="font-medium text-gray-700 mb-1">Correct Answer:</p>
                    <div className="flex flex-wrap gap-1">
                      {question.correctAnswer.map((answer, i) => (
                        <span
                          key={i}
                          className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs"
                        >
                          {answer}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button
          onClick={onRetry}
          className="flex items-center justify-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <ArrowPathIcon className="w-5 h-5" />
          <span>Retry Quiz</span>
        </button>
        
        <button
          onClick={onNewQuiz}
          className="flex items-center justify-center space-x-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          <PlusIcon className="w-5 h-5" />
          <span>New Quiz</span>
        </button>
        
        <button
          onClick={onViewDetails}
          className="flex items-center justify-center space-x-2 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
        >
          <ChartBarIcon className="w-5 h-5" />
          <span>View Analytics</span>
        </button>
      </div>

      {/* Performance Insights */}
      <div className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Performance Insights</h3>
        <div className="space-y-2 text-sm text-gray-700">
          {results.score >= 80 && (
            <p>🎯 <strong>Excellent performance!</strong> You're mastering these concepts.</p>
          )}
          {results.score >= 60 && results.score < 80 && (
            <p>📈 <strong>Good progress!</strong> Keep practicing to reach the next level.</p>
          )}
          {results.score < 60 && (
            <p>💪 <strong>Keep going!</strong> Every attempt builds your skills.</p>
          )}
          <p>⏱️ <strong>Average time per question:</strong> {formatTime(Math.round(results.timeSpent / results.totalQuestions))}</p>
          <p>🎯 <strong>Focus areas:</strong> Consider reviewing the questions you missed.</p>
        </div>
      </div>
    </div>
  );
}