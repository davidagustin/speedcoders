"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { 
  TrophyIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowPathIcon,
  HomeIcon,
  ChartBarIcon,
  StarIcon
} from "@heroicons/react/24/outline";
import { problems as allProblems } from "@/lib/data/problems";

interface QuizResultsProps {
  params: Promise<{
    id: string;
  }>;
}

export default function QuizResultsPage({ params }: QuizResultsProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [results, setResults] = useState<any>(null);
  const [quiz, setQuiz] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [quizId, setQuizId] = useState<string>('');

  useEffect(() => {
    const getParams = async () => {
      const resolvedParams = await params;
      setQuizId(resolvedParams.id);
    };
    getParams();
  }, [params]);

  useEffect(() => {
    if (!session || !quizId) return;

    const fetchResults = async () => {
      try {
        const response = await fetch(`/api/quiz/${quizId}/results`);
        if (response.ok) {
          const data = await response.json();
          setResults(data.results || data);
          setQuiz(data.quiz);
        } else {
          console.error("Failed to fetch results");
          router.push("/dashboard");
        }
      } catch (error) {
        console.error("Error fetching results:", error);
        router.push("/dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [quizId, session, router]);

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Please sign in to view results</h1>
          <Link href="/auth/login" className="bg-blue-600 text-white px-6 py-2 rounded-lg">
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading results...</p>
        </div>
      </div>
    );
  }

  if (!results || !quiz) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Results not found</h1>
          <Link href="/dashboard" className="bg-blue-600 text-white px-6 py-2 rounded-lg">
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const getScoreColor = (percentage: number) => {
    if (percentage >= 80) return "text-green-600";
    if (percentage >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreIcon = (percentage: number) => {
    if (percentage >= 80) return TrophyIcon;
    if (percentage >= 60) return StarIcon;
    return ChartBarIcon;
  };

  const problems = quiz.problemIds.map((id: string) => 
    allProblems.find(p => p.id === parseInt(id))
  ).filter(Boolean);

  const ScoreIcon = getScoreIcon(results.scorePercentage);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Quiz Results</h1>
              <p className="text-gray-600 mt-1">
                {quiz.problemIds.length} problems completed
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/quiz/create"
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50"
              >
                <ArrowPathIcon className="mr-2 h-4 w-4" />
                Take Another Quiz
              </Link>
              <Link
                href="/dashboard"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700"
              >
                <HomeIcon className="mr-2 h-4 w-4" />
                Back to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Score Overview */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8 text-center">
          <div className="flex justify-center mb-4">
            <div className={`p-4 rounded-full ${results.scorePercentage >= 80 ? 'bg-green-100' : results.scorePercentage >= 60 ? 'bg-yellow-100' : 'bg-red-100'}`}>
              <ScoreIcon className={`h-12 w-12 ${getScoreColor(results.scorePercentage)}`} />
            </div>
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-2">
            {results.scorePercentage}%
          </h2>
          <p className="text-xl text-gray-600 mb-6">
            {results.correctAnswers} out of {quiz.problemIds.length} problems correct
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="text-2xl font-bold text-gray-900">{formatTime(results.timeSpent)}</div>
              <div className="text-sm text-gray-600">Time Spent</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{formatTime(Math.floor(results.timeSpent / quiz.problemIds.length))}</div>
              <div className="text-sm text-gray-600">Avg. per Problem</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{Math.round(results.accuracy)}%</div>
              <div className="text-sm text-gray-600">Algorithm Accuracy</div>
            </div>
          </div>
        </div>

        {/* Detailed Results */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Problem by Problem Breakdown */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Problem Breakdown</h3>
            <div className="space-y-4">
              {problems.map((problem: any, index) => {
                const result = results.problemResults[index];
                const isCorrect = result?.isCorrect || false;
                return (
                  <div key={problem.id} className="flex items-center justify-between p-4 rounded-lg border">
                    <div className="flex items-center space-x-3">
                      {isCorrect ? (
                        <CheckCircleIcon className="h-6 w-6 text-green-600" />
                      ) : (
                        <XCircleIcon className="h-6 w-6 text-red-600" />
                      )}
                      <div>
                        <h4 className="font-medium text-gray-900">{problem.title}</h4>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            problem.difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
                            problem.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {problem.difficulty}
                          </span>
                          {result?.selectedAlgorithms && (
                            <span className="text-xs text-gray-600">
                              {result.selectedAlgorithms.length} algorithms selected
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-900">
                        {result?.timeSpent ? formatTime(result.timeSpent) : 'N/A'}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Performance Analysis */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Analysis</h3>
            
            {/* Difficulty Breakdown */}
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-700 mb-3">By Difficulty</h4>
              <div className="space-y-3">
                {['Easy', 'Medium', 'Hard'].map(difficulty => {
                  const difficultyProblems = problems.filter(p => p.difficulty === difficulty);
                  const correctCount = difficultyProblems.filter((_, index) => 
                    results.problemResults[problems.indexOf(difficultyProblems[index])]?.isCorrect
                  ).length;
                  const total = difficultyProblems.length;
                  const percentage = total > 0 ? Math.round((correctCount / total) * 100) : 0;
                  
                  if (total === 0) return null;
                  
                  return (
                    <div key={difficulty} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
                          difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {difficulty}
                        </span>
                        <span className="text-sm text-gray-600">{correctCount}/{total}</span>
                      </div>
                      <span className={`text-sm font-medium ${getScoreColor(percentage)}`}>
                        {percentage}%
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Recommendations */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">Recommendations</h4>
              <div className="space-y-3">
                {results.scorePercentage >= 80 ? (
                  <div className="p-3 bg-green-50 rounded-lg">
                    <p className="text-sm text-green-700">
                      <strong>Excellent work!</strong> You're demonstrating strong algorithm recognition skills. 
                      Consider tackling more challenging problems or exploring advanced topics.
                    </p>
                  </div>
                ) : results.scorePercentage >= 60 ? (
                  <div className="p-3 bg-yellow-50 rounded-lg">
                    <p className="text-sm text-yellow-700">
                      <strong>Good progress!</strong> Focus on understanding the relationship between 
                      problem patterns and appropriate algorithms. Practice with similar problems to improve accuracy.
                    </p>
                  </div>
                ) : (
                  <div className="p-3 bg-red-50 rounded-lg">
                    <p className="text-sm text-red-700">
                      <strong>Keep practicing!</strong> Review the fundamentals of each algorithm type. 
                      Start with easier problems and gradually increase difficulty as you build confidence.
                    </p>
                  </div>
                )}
                
                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-700">
                    <strong>Next steps:</strong> Review the problems you missed and study the editorial 
                    solutions. Focus on pattern recognition and understanding when to apply specific algorithms.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex justify-center space-x-4">
          <Link
            href="/quiz/create"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700"
          >
            <ArrowPathIcon className="mr-2 h-5 w-5" />
            Practice More
          </Link>
          <Link
            href="/progress"
            className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50"
          >
            <ChartBarIcon className="mr-2 h-5 w-5" />
            View Progress
          </Link>
        </div>
      </div>
    </div>
  );
}