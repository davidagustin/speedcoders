"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ClockIcon, CheckCircleIcon, XCircleIcon, ArrowRightIcon, ArrowLeftIcon, PlayIcon, PauseIcon } from "@heroicons/react/24/outline";

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
  category: string;
  difficulty: string;
}

interface Quiz {
  id: string;
  title: string;
  description: string;
  questions: QuizQuestion[];
  timeLimit: number;
  category: string;
  difficulty: string;
}

interface QuizAttempt {
  id: string;
  quizId: string;
  userId: string;
  answers: { questionId: string; selectedAnswer: number }[];
  score: number;
  timeSpent: number;
  completedAt: string;
}

export default function EnhancedQuizPage() {
  const router = useRouter();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<{ [key: string]: number }>({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    startQuiz();
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning && !isPaused && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleSubmitQuiz();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, isPaused, timeLeft]);

  const startQuiz = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/quiz/enhanced-start", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setQuiz(data.quiz);
        setTimeLeft(data.quiz.timeLimit * 60); // Convert minutes to seconds
        setIsTimerRunning(true);
      } else {
        // Mock quiz data for demonstration
        const mockQuiz: Quiz = {
          id: "quiz-1",
          title: "Advanced Algorithm Quiz",
          description: "Test your knowledge of advanced algorithms and data structures",
          timeLimit: 30,
          category: "Algorithms",
          difficulty: "Hard",
          questions: [
            {
              id: "q1",
              question: "What is the time complexity of binary search?",
              options: ["O(1)", "O(log n)", "O(n)", "O(n²)"],
              correctAnswer: 1,
              explanation: "Binary search has O(log n) time complexity as it divides the search space in half with each iteration.",
              category: "Searching",
              difficulty: "Medium"
            },
            {
              id: "q2",
              question: "Which data structure is best for implementing a priority queue?",
              options: ["Array", "Linked List", "Heap", "Stack"],
              correctAnswer: 2,
              explanation: "A heap is the most efficient data structure for implementing a priority queue, providing O(log n) insertion and deletion.",
              category: "Data Structures",
              difficulty: "Medium"
            },
            {
              id: "q3",
              question: "What is the space complexity of merge sort?",
              options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
              correctAnswer: 2,
              explanation: "Merge sort requires O(n) additional space to store the merged subarrays.",
              category: "Sorting",
              difficulty: "Hard"
            },
            {
              id: "q4",
              question: "Which algorithm is used to find the shortest path in a weighted graph?",
              options: ["BFS", "DFS", "Dijkstra's", "Kruskal's"],
              correctAnswer: 2,
              explanation: "Dijkstra's algorithm is specifically designed to find the shortest path in weighted graphs.",
              category: "Graph Algorithms",
              difficulty: "Hard"
            },
            {
              id: "q5",
              question: "What is the time complexity of inserting an element into a hash table?",
              options: ["O(1)", "O(log n)", "O(n)", "Depends on implementation"],
              correctAnswer: 3,
              explanation: "The time complexity depends on the implementation. Average case is O(1), but worst case can be O(n) due to collisions.",
              category: "Hash Tables",
              difficulty: "Medium"
            }
          ]
        };
        setQuiz(mockQuiz);
        setTimeLeft(mockQuiz.timeLimit * 60);
        setIsTimerRunning(true);
      }
    } catch (error) {
      console.error("Error starting quiz:", error);
      setError("Failed to start quiz. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = (questionId: string, answerIndex: number) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answerIndex
    }));
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < (quiz?.questions.length || 0) - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handlePauseResume = () => {
    setIsPaused(prev => !prev);
  };

  const handleSubmitQuiz = async () => {
    if (!quiz) return;

    setIsTimerRunning(false);
    setIsPaused(false);

    const answersArray = Object.entries(answers).map(([questionId, selectedAnswer]) => ({
      questionId,
      selectedAnswer
    }));

    try {
      const response = await fetch("/api/quiz/enhanced-submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          quizId: quiz.id,
          answers: answersArray,
          timeSpent: (quiz.timeLimit * 60) - timeLeft
        }),
      });

      if (response.ok) {
        const result = await response.json();
        setShowResults(true);
      } else {
        // Mock result for demonstration
        setShowResults(true);
      }
    } catch (error) {
      console.error("Error submitting quiz:", error);
      setError("Failed to submit quiz. Please try again.");
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getCurrentQuestion = () => {
    return quiz?.questions[currentQuestionIndex];
  };

  const getProgressPercentage = () => {
    if (!quiz) return 0;
    return ((currentQuestionIndex + 1) / quiz.questions.length) * 100;
  };

  const getAnsweredCount = () => {
    return Object.keys(answers).length;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading quiz...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <XCircleIcon className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => router.push("/quiz")}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Quiz Selection
          </button>
        </div>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">No quiz available</p>
        </div>
      </div>
    );
  }

  if (showResults) {
    const correctAnswers = quiz.questions.filter(q => 
      answers[q.id] === q.correctAnswer
    ).length;
    const score = Math.round((correctAnswers / quiz.questions.length) * 100);
    const timeSpent = (quiz.timeLimit * 60) - timeLeft;

    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Quiz Results</h1>
              <div className="text-6xl font-bold text-blue-600 mb-4">{score}%</div>
              <p className="text-gray-600">
                You got {correctAnswers} out of {quiz.questions.length} questions correct
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-blue-50 rounded-lg p-6 text-center">
                <div className="text-2xl font-bold text-blue-600">{correctAnswers}</div>
                <div className="text-sm text-gray-600">Correct Answers</div>
              </div>
              <div className="bg-green-50 rounded-lg p-6 text-center">
                <div className="text-2xl font-bold text-green-600">{formatTime(timeSpent)}</div>
                <div className="text-sm text-gray-600">Time Spent</div>
              </div>
              <div className="bg-purple-50 rounded-lg p-6 text-center">
                <div className="text-2xl font-bold text-purple-600">{quiz.category}</div>
                <div className="text-sm text-gray-600">Category</div>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-900">Question Review</h2>
              {quiz.questions.map((question, index) => (
                <div key={question.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-medium text-gray-900">
                      Question {index + 1}: {question.question}
                    </h3>
                    {answers[question.id] === question.correctAnswer ? (
                      <CheckCircleIcon className="h-6 w-6 text-green-500" />
                    ) : (
                      <XCircleIcon className="h-6 w-6 text-red-500" />
                    )}
                  </div>
                  
                  <div className="space-y-2 mb-3">
                    {question.options.map((option, optionIndex) => (
                      <div
                        key={optionIndex}
                        className={`p-3 rounded-lg border ${
                          optionIndex === question.correctAnswer
                            ? 'bg-green-50 border-green-200'
                            : optionIndex === answers[question.id] && optionIndex !== question.correctAnswer
                            ? 'bg-red-50 border-red-200'
                            : 'bg-gray-50 border-gray-200'
                        }`}
                      >
                        <span className="font-medium mr-2">
                          {String.fromCharCode(65 + optionIndex)}.
                        </span>
                        {option}
                        {optionIndex === question.correctAnswer && (
                          <span className="ml-2 text-green-600 font-medium">✓ Correct</span>
                        )}
                        {optionIndex === answers[question.id] && optionIndex !== question.correctAnswer && (
                          <span className="ml-2 text-red-600 font-medium">✗ Your Answer</span>
                        )}
                      </div>
                    ))}
                  </div>

                  {question.explanation && (
                    <div className="bg-blue-50 rounded-lg p-3">
                      <p className="text-sm text-blue-800">
                        <strong>Explanation:</strong> {question.explanation}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="flex justify-center space-x-4 mt-8">
              <button
                onClick={() => router.push("/quiz")}
                className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
              >
                Back to Quizzes
              </button>
              <button
                onClick={() => router.push("/leaderboard")}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                View Leaderboard
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = getCurrentQuestion();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-semibold text-gray-900">{quiz.title}</h1>
              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                {quiz.category}
              </span>
              <span className={`px-2 py-1 text-sm rounded-full ${
                quiz.difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
                quiz.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {quiz.difficulty}
              </span>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <ClockIcon className="h-5 w-5 text-gray-500" />
                <span className={`font-mono text-lg font-semibold ${
                  timeLeft < 60 ? 'text-red-600' : 'text-gray-900'
                }`}>
                  {formatTime(timeLeft)}
                </span>
              </div>
              
              <button
                onClick={handlePauseResume}
                className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200"
              >
                {isPaused ? (
                  <PlayIcon className="h-5 w-5 text-gray-600" />
                ) : (
                  <PauseIcon className="h-5 w-5 text-gray-600" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Question {currentQuestionIndex + 1} of {quiz.questions.length}
              </span>
              <span className="text-sm text-gray-600">
                {getAnsweredCount()} answered
              </span>
            </div>
            <div className="w-64 bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${getProgressPercentage()}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Question Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentQuestion && (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                {currentQuestion.question}
              </h2>
              
              <div className="space-y-3">
                {currentQuestion.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswerSelect(currentQuestion.id, index)}
                    className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                      answers[currentQuestion.id] === index
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <span className="font-medium mr-3">
                      {String.fromCharCode(65 + index)}.
                    </span>
                    {option}
                  </button>
                ))}
              </div>
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between pt-6 border-t">
              <button
                onClick={handlePreviousQuestion}
                disabled={currentQuestionIndex === 0}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ArrowLeftIcon className="h-4 w-4" />
                <span>Previous</span>
              </button>

              <div className="flex items-center space-x-4">
                {currentQuestionIndex === quiz.questions.length - 1 ? (
                  <button
                    onClick={handleSubmitQuiz}
                    className="flex items-center space-x-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    <span>Submit Quiz</span>
                    <CheckCircleIcon className="h-4 w-4" />
                  </button>
                ) : (
                  <button
                    onClick={handleNextQuestion}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    <span>Next</span>
                    <ArrowRightIcon className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
