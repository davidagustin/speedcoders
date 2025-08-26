"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { 
  ClockIcon, 
  CheckIcon,
  XMarkIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  PauseIcon,
  PlayIcon
} from "@heroicons/react/24/outline";
import { comprehensiveProblems as allProblems } from "@/lib/data/comprehensive-problems";
import EditorialView from "@/app/components/EditorialView";

interface QuizPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function QuizPage({ params }: QuizPageProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [quiz, setQuiz] = useState<any>(null);
  const [problems, setProblems] = useState<any[]>([]);
  const [currentProblemIndex, setCurrentProblemIndex] = useState(0);
  const [selectedAlgorithms, setSelectedAlgorithms] = useState<{ [key: string]: string[] }>({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showEditorial, setShowEditorial] = useState(false);
  const [currentEditorial, setCurrentEditorial] = useState<any>(null);
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

    const fetchQuiz = async () => {
      try {
        const response = await fetch(`/api/quiz/${quizId}`);
        if (response.ok) {
          const quizData = await response.json();
          setQuiz(quizData);
          
          const quizProblems = quizData.problemIds.map((id: string) => 
            allProblems.find(p => p.id === parseInt(id))
          ).filter(Boolean);
          
          setProblems(quizProblems);
          setTimeLeft(quizData.timeLimit * 60);
        } else {
          console.error("Failed to fetch quiz");
          router.push("/dashboard");
        }
      } catch (error) {
        console.error("Error fetching quiz:", error);
        router.push("/dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [quizId, session, router]);

  useEffect(() => {
    if (timeLeft > 0 && !isPaused && !isSubmitted) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !isSubmitted) {
      handleSubmitQuiz();
    }
  }, [timeLeft, isPaused, isSubmitted]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleAlgorithmSelection = (problemId: string, algorithm: string) => {
    setSelectedAlgorithms(prev => {
      const current = prev[problemId] || [];
      const updated = current.includes(algorithm)
        ? current.filter(a => a !== algorithm)
        : [...current, algorithm];
      return { ...prev, [problemId]: updated };
    });
  };

  const handleShowEditorial = () => {
    if (currentProblem?.editorial) {
      setCurrentEditorial(currentProblem.editorial);
      setShowEditorial(true);
    }
  };

  const handleSubmitQuiz = async () => {
    if (isSubmitted) return;

    setIsSubmitted(true);
    setIsPaused(true);

    try {
      const response = await fetch(`/api/quiz/${quizId}/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          selectedAlgorithms,
          timeSpent: quiz.timeLimit * 60 - timeLeft
        }),
      });

      if (response.ok) {
        const result = await response.json();
        router.push(`/quiz/${quizId}/results`);
      } else {
        console.error("Failed to submit quiz");
      }
    } catch (error) {
      console.error("Error submitting quiz:", error);
    }
  };

  const currentProblem = problems[currentProblemIndex];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!currentProblem) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Problem not found</h1>
          <Link href="/dashboard" className="text-blue-600 hover:underline">
            Return to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link
                href="/dashboard"
                className="inline-flex items-center text-gray-600 hover:text-gray-900"
              >
                <ArrowLeftIcon className="h-5 w-5 mr-2" />
                Back to Dashboard
              </Link>
              <div className="h-6 w-px bg-gray-300" />
              <h1 className="text-lg font-semibold text-gray-900">
                {quiz?.title || 'Quiz'}
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsPaused(!isPaused)}
                className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg"
              >
                {isPaused ? (
                  <>
                    <PlayIcon className="h-4 w-4 mr-2" />
                    Resume
                  </>
                ) : (
                  <>
                    <PauseIcon className="h-4 w-4 mr-2" />
                    Pause
                  </>
                )}
              </button>
              
              <div className="flex items-center space-x-2">
                <ClockIcon className="h-5 w-5 text-gray-400" />
                <span className={`font-mono text-lg ${timeLeft < 300 ? 'text-red-600' : 'text-gray-900'}`}>
                  {formatTime(timeLeft)}
                </span>
              </div>
              <button
                onClick={handleSubmitQuiz}
                disabled={isSubmitted}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                Submit Quiz
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Problem Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-gray-900">{currentProblem?.title}</h2>
                  <div className="flex items-center space-x-2">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      currentProblem?.difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
                      currentProblem?.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {currentProblem?.difficulty}
                    </span>
                    <button
                      onClick={handleShowEditorial}
                      className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                    >
                      📖 Editorial
                    </button>
                  </div>
                </div>
                <p className="text-gray-700 mb-6 whitespace-pre-wrap">
                  {currentProblem?.description}
                </p>
                
                {currentProblem?.examples && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Examples:</h3>
                    <div className="space-y-4">
                      {currentProblem.examples.map((example: any, idx: number) => (
                        <div key={idx} className="bg-gray-50 p-4 rounded-lg">
                          <div className="font-mono text-sm">
                            <div><strong>Input:</strong> {example.input}</div>
                            <div><strong>Output:</strong> {example.output}</div>
                            {example.explanation && (
                              <div className="mt-2"><strong>Explanation:</strong> {example.explanation}</div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Algorithm Selection */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Select Applicable Algorithms
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Choose all algorithms that could be used to solve this problem.
              </p>
              
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {currentProblem?.algorithms.map((algorithm: string) => (
                  <label
                    key={algorithm}
                    className="flex items-center p-3 rounded-lg border hover:bg-gray-50 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={selectedAlgorithms[currentProblem.id]?.includes(algorithm) || false}
                      onChange={() => handleAlgorithmSelection(currentProblem.id, algorithm)}
                      className="h-4 w-4 text-blue-600 rounded border-gray-300"
                    />
                    <span className="ml-3 text-sm text-gray-900">{algorithm}</span>
                  </label>
                ))}
              </div>

              <div className="mt-6 pt-4 border-t">
                <div className="flex justify-between items-center">
                  <button
                    onClick={() => setCurrentProblemIndex(Math.max(0, currentProblemIndex - 1))}
                    disabled={currentProblemIndex === 0}
                    className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ArrowLeftIcon className="h-4 w-4 mr-2" />
                    Previous
                  </button>
                  
                  <span className="text-sm text-gray-600">
                    {currentProblemIndex + 1} / {problems.length}
                  </span>
                  
                  <button
                    onClick={() => setCurrentProblemIndex(Math.min(problems.length - 1, currentProblemIndex + 1))}
                    disabled={currentProblemIndex === problems.length - 1}
                    className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                    <ArrowRightIcon className="h-4 w-4 ml-2" />
                  </button>
                </div>
              </div>
            </div>

            {/* Progress Indicator */}
            <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Progress</h3>
              <div className="space-y-2">
                {problems.map((problem, index) => (
                  <div
                    key={problem.id}
                    className={`flex items-center justify-between p-2 rounded-lg cursor-pointer ${
                      index === currentProblemIndex ? 'bg-blue-50 border border-blue-200' : 'hover:bg-gray-50'
                    }`}
                    onClick={() => setCurrentProblemIndex(index)}
                  >
                    <span className="text-sm font-medium">
                      {index + 1}. {problem.title}
                    </span>
                    <div className="flex items-center">
                      {selectedAlgorithms[problem.id]?.length > 0 ? (
                        <CheckIcon className="h-4 w-4 text-green-600" />
                      ) : (
                        <div className="h-4 w-4 rounded-full border-2 border-gray-300" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Editorial Modal */}
      {currentEditorial && (
        <EditorialView
          editorial={currentEditorial}
          isVisible={showEditorial}
          onClose={() => setShowEditorial(false)}
        />
      )}
    </div>
  );
}