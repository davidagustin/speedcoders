'use client';

import { CheckCircleIcon, XCircleIcon, TrophyIcon, ClockIcon } from '@heroicons/react/24/outline';

interface QuizResult {
  score: number;
  totalQuestions: number;
  timeSpent: number;
  correctAnswers: number;
  incorrectAnswers: number;
  averageTimePerQuestion: number;
  difficultyBreakdown: {
    easy: { correct: number; total: number };
    medium: { correct: number; total: number };
    hard: { correct: number; total: number };
  };
  categoryPerformance: Array<{
    category: string;
    correct: number;
    total: number;
    percentage: number;
  }>;
  algorithmAccuracy: Array<{
    algorithm: string;
    correct: number;
    total: number;
    percentage: number;
  }>;
  recommendations: Array<{
    type: 'strength' | 'weakness';
    title: string;
    description: string;
    action: string;
  }>;
}

interface QuizResultsProps {
  result: QuizResult;
  onRetry: () => void;
  onNewQuiz: () => void;
}

export default function QuizResults({ result, onRetry, onNewQuiz }: QuizResultsProps) {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-blue-600';
    if (score >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBadge = (score: number) => {
    if (score >= 90) return { text: 'Excellent!', color: 'bg-green-100 text-green-800', icon: '<Æ' };
    if (score >= 70) return { text: 'Good Job!', color: 'bg-blue-100 text-blue-800', icon: '=M' };
    if (score >= 50) return { text: 'Keep Trying!', color: 'bg-yellow-100 text-yellow-800', icon: '=ª' };
    return { text: 'Practice More!', color: 'bg-red-100 text-red-800', icon: '=Ú' };
  };

  const badge = getScoreBadge(result.score);

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <div className={`inline-flex items-center px-4 py-2 rounded-full text-lg font-semibold ${badge.color} mb-4`}>
          <span className="mr-2">{badge.icon}</span>
          {badge.text}
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Quiz Complete!</h1>
        <p className="text-gray-600">Here's how you performed</p>
      </div>

      {/* Score Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border text-center">
          <div className={`text-3xl font-bold ${getScoreColor(result.score)}`}>
            {result.score}%
          </div>
          <p className="text-sm text-gray-600">Overall Score</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border text-center">
          <div className="text-3xl font-bold text-blue-600">
            {result.correctAnswers}/{result.totalQuestions}
          </div>
          <p className="text-sm text-gray-600">Correct Answers</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border text-center">
          <div className="text-3xl font-bold text-purple-600">
            {formatTime(result.timeSpent)}
          </div>
          <p className="text-sm text-gray-600">Total Time</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border text-center">
          <div className="text-3xl font-bold text-orange-600">
            {formatTime(result.averageTimePerQuestion)}
          </div>
          <p className="text-sm text-gray-600">Avg per Question</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Difficulty Breakdown */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <TrophyIcon className="h-5 w-5 mr-2" />
            Difficulty Breakdown
          </h2>
          <div className="space-y-4">
            {Object.entries(result.difficultyBreakdown).map(([difficulty, stats]) => (
              <div key={difficulty} className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className={`px-2 py-1 rounded text-xs font-medium mr-3 ${
                    difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                    difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                  </span>
                  <span className="text-sm text-gray-600">
                    {stats.correct}/{stats.total}
                  </span>
                </div>
                <div className="flex items-center">
                  <div className="w-24 bg-gray-200 rounded-full h-2 mr-2">
                    <div
                      className={`h-2 rounded-full ${
                        difficulty === 'easy' ? 'bg-green-500' :
                        difficulty === 'medium' ? 'bg-yellow-500' :
                        'bg-red-500'
                      }`}
                      style={{ width: `${(stats.correct / stats.total) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium">
                    {Math.round((stats.correct / stats.total) * 100)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Category Performance */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <ClockIcon className="h-5 w-5 mr-2" />
            Category Performance
          </h2>
          <div className="space-y-4">
            {result.categoryPerformance.map((category, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className="font-medium text-sm mr-3">
                    {category.category}
                  </span>
                  <span className="text-sm text-gray-600">
                    {category.correct}/{category.total}
                  </span>
                </div>
                <div className="flex items-center">
                  <div className="w-24 bg-gray-200 rounded-full h-2 mr-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ width: `${category.percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium">
                    {category.percentage}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Algorithm Accuracy */}
      <div className="bg-white p-6 rounded-lg shadow-sm border mb-8">
        <h2 className="text-lg font-semibold mb-4">Algorithm Accuracy</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {result.algorithmAccuracy.map((algo, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <span className="font-medium text-sm">{algo.algorithm}</span>
                <div className="text-xs text-gray-600">{algo.correct}/{algo.total} correct</div>
              </div>
              <div className={`text-sm font-semibold ${getScoreColor(algo.percentage)}`}>
                {algo.percentage}%
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recommendations */}
      <div className="bg-white p-6 rounded-lg shadow-sm border mb-8">
        <h2 className="text-lg font-semibold mb-4">Recommendations</h2>
        <div className="space-y-4">
          {result.recommendations.map((rec, index) => (
            <div key={index} className={`p-4 rounded-lg border ${
              rec.type === 'strength' ? 'bg-green-50 border-green-200' : 'bg-yellow-50 border-yellow-200'
            }`}>
              <div className="flex items-start">
                {rec.type === 'strength' ? (
                  <CheckCircleIcon className="h-5 w-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                ) : (
                  <XCircleIcon className="h-5 w-5 text-yellow-600 mr-3 mt-0.5 flex-shrink-0" />
                )}
                <div>
                  <h3 className={`font-semibold text-sm ${
                    rec.type === 'strength' ? 'text-green-800' : 'text-yellow-800'
                  }`}>
                    {rec.title}
                  </h3>
                  <p className={`text-sm mt-1 ${
                    rec.type === 'strength' ? 'text-green-700' : 'text-yellow-700'
                  }`}>
                    {rec.description}
                  </p>
                  <p className={`text-xs mt-2 font-medium ${
                    rec.type === 'strength' ? 'text-green-600' : 'text-yellow-600'
                  }`}>
                    =¡ {rec.action}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button
          onClick={onRetry}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          = Retry Same Quiz
        </button>
        <button
          onClick={onNewQuiz}
          className="px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
        >
          =€ Start New Quiz
        </button>
      </div>
    </div>
  );
}