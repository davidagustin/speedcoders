'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function ResultsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [score, setScore] = useState(0);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const scoreParam = searchParams.get('score');
    const totalParam = searchParams.get('total');
    
    if (scoreParam && totalParam) {
      setScore(parseInt(scoreParam));
      setTotal(parseInt(totalParam));
    }
  }, [searchParams]);

  const percentage = total > 0 ? Math.round((score / total) * 100) : 0;
  
  const getGrade = (percentage: number) => {
    if (percentage >= 90) return { grade: 'A+', color: 'text-green-600', bg: 'bg-green-100' };
    if (percentage >= 80) return { grade: 'A', color: 'text-green-600', bg: 'bg-green-100' };
    if (percentage >= 70) return { grade: 'B', color: 'text-blue-600', bg: 'bg-blue-100' };
    if (percentage >= 60) return { grade: 'C', color: 'text-yellow-600', bg: 'bg-yellow-100' };
    return { grade: 'F', color: 'text-red-600', bg: 'bg-red-100' };
  };

  const gradeInfo = getGrade(percentage);

  const getMessage = (percentage: number) => {
    if (percentage >= 90) return "Excellent! You have a deep understanding of algorithms!";
    if (percentage >= 80) return "Great job! You're well on your way to mastering algorithms!";
    if (percentage >= 70) return "Good work! Keep practicing to improve your skills!";
    if (percentage >= 60) return "Not bad! Focus on the areas you missed to get better!";
    return "Keep practicing! Review the algorithms and try again!";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="mb-8">
            <div className="text-6xl mb-4">🎉</div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Quiz Complete!</h1>
            <p className="text-xl text-gray-600">{getMessage(percentage)}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-blue-50 rounded-lg p-6">
              <div className="text-3xl font-bold text-blue-600 mb-1">{score}/{total}</div>
              <div className="text-sm text-blue-700">Correct Answers</div>
            </div>
            
            <div className="bg-green-50 rounded-lg p-6">
              <div className="text-3xl font-bold text-green-600 mb-1">{percentage}%</div>
              <div className="text-sm text-green-700">Accuracy</div>
            </div>
            
            <div className={`${gradeInfo.bg} rounded-lg p-6`}>
              <div className={`text-3xl font-bold ${gradeInfo.color} mb-1`}>{gradeInfo.grade}</div>
              <div className={`text-sm ${gradeInfo.color.replace('text-', 'text-').replace('-600', '-700')}`}>Grade</div>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Performance Breakdown</h2>
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div 
                className="bg-gradient-to-r from-blue-500 to-green-500 h-4 rounded-full transition-all duration-1000"
                style={{ width: `${percentage}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              You answered {score} out of {total} questions correctly
            </p>
          </div>

          <div className="space-y-4">
            <button
              onClick={() => router.push('/quiz')}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg text-lg transition-colors mr-4"
            >
              Take Another Quiz
            </button>
            
            <button
              onClick={() => router.push('/')}
              className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-8 rounded-lg text-lg transition-colors"
            >
              Back to Home
            </button>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Tips for Improvement</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
              <div className="bg-yellow-50 rounded-lg p-4">
                <h4 className="font-semibold text-yellow-800 mb-2">📚 Study Algorithms</h4>
                <p className="text-sm text-yellow-700">
                  Review common algorithms like Hash Tables, Two Pointers, Dynamic Programming, and more.
                </p>
              </div>
              
              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="font-semibold text-blue-800 mb-2">💻 Practice Problems</h4>
                <p className="text-sm text-blue-700">
                  Solve more problems on LeetCode to understand when to use each algorithm.
                </p>
              </div>
              
              <div className="bg-green-50 rounded-lg p-4">
                <h4 className="font-semibold text-green-800 mb-2">🎯 Analyze Patterns</h4>
                <p className="text-sm text-green-700">
                  Look for patterns in problems to identify which algorithms are most suitable.
                </p>
              </div>
              
              <div className="bg-purple-50 rounded-lg p-4">
                <h4 className="font-semibold text-purple-800 mb-2">⏱️ Time Complexity</h4>
                <p className="text-sm text-purple-700">
                  Consider time and space complexity when choosing between multiple valid solutions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
