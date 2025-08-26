'use client';

import { useState, useEffect } from 'react';
import { comprehensiveProblems, algorithmsList } from '@/lib/data/comprehensive-problems';
import QuizTimer from '@/app/components/QuizTimer';
import { ClockIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

interface QuizQuestion {
  problem: any;
  userAnswers: string[];
  timeSpent: number;
}

export default function QuizPage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [selectedAlgorithms, setSelectedAlgorithms] = useState<string[]>([]);
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizEnded, setQuizEnded] = useState(false);
  const [score, setScore] = useState(0);
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());

  useEffect(() => {
    // Initialize quiz with random problems
    const shuffled = [...comprehensiveProblems].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 10);
    setQuestions(selected.map(problem => ({
      problem,
      userAnswers: [],
      timeSpent: 0
    })));
  }, []);

  const handleStartQuiz = () => {
    setQuizStarted(true);
    setQuestionStartTime(Date.now());
  };

  const handleAlgorithmToggle = (algorithm: string) => {
    setSelectedAlgorithms(prev => 
      prev.includes(algorithm) 
        ? prev.filter(a => a !== algorithm)
        : [...prev, algorithm]
    );
  };

  const handleNextQuestion = () => {
    const timeSpent = Math.floor((Date.now() - questionStartTime) / 1000);
    
    // Save current answer
    const updatedQuestions = [...questions];
    updatedQuestions[currentIndex] = {
      ...updatedQuestions[currentIndex],
      userAnswers: selectedAlgorithms,
      timeSpent
    };
    setQuestions(updatedQuestions);

    // Check if answer is correct
    const correctAlgorithms = questions[currentIndex].problem.algorithms;
    const isCorrect = selectedAlgorithms.some(algo => 
      correctAlgorithms.some((correct: string) => 
        correct.toLowerCase().includes(algo.toLowerCase()) || 
        algo.toLowerCase().includes(correct.toLowerCase())
      )
    );

    if (isCorrect) {
      setScore(prev => prev + 1);
    }

    // Move to next question or end quiz
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedAlgorithms([]);
      setQuestionStartTime(Date.now());
    } else {
      handleEndQuiz();
    }
  };

  const handleEndQuiz = () => {
    setQuizEnded(true);
  };

  if (quizEnded) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h1 className="text-3xl font-bold mb-6">Quiz Complete!</h1>
            <div className="text-2xl mb-4">
              Your Score: <span className="text-green-600 font-bold">{score}</span> / {questions.length}
            </div>
            
            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-4">Review:</h2>
              <div className="space-y-4">
                {questions.map((q, idx) => {
                  const correctAnswers = q.problem.algorithms;
                  const isCorrect = q.userAnswers.some(ans => 
                    correctAnswers.some((correct: string) => 
                      correct.toLowerCase().includes(ans.toLowerCase()) || 
                      ans.toLowerCase().includes(correct.toLowerCase())
                    )
                  );
                  
                  return (
                    <div key={idx} className="border rounded p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold">{q.problem.title}</h3>
                          <p className="text-sm text-gray-600">Difficulty: {q.problem.difficulty}</p>
                          <p className="text-sm">Your answers: {q.userAnswers.join(', ') || 'None'}</p>
                          <p className="text-sm text-green-600">
                            Correct algorithms: {q.problem.algorithms.join(', ')}
                          </p>
                        </div>
                        <div className={`px-3 py-1 rounded ${isCorrect ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {isCorrect ? 'Correct' : 'Incorrect'}
                        </div>
                      </div>
                      <p className="text-sm text-gray-500 mt-2">Time spent: {q.timeSpent}s</p>
                    </div>
                  );
                })}
              </div>
            </div>
            
            <button
              onClick={() => window.location.reload()}
              className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
            >
              Start New Quiz
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!quizStarted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
          <h1 className="text-3xl font-bold mb-4">LeetCode Algorithm Quiz</h1>
          <p className="text-gray-600 mb-6">
            Test your knowledge of algorithms and data structures! You'll be presented with {questions.length} LeetCode problems.
            For each problem, select the algorithms or approaches that can be used to solve it.
          </p>
          <button
            onClick={handleStartQuiz}
            className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
          >
            Start Quiz
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];
  if (!currentQuestion) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-6">
          <QuizTimer 
            duration={1800} // 30 minutes
            onTimeUp={handleEndQuiz}
          />
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Question {currentIndex + 1} of {questions.length}</h2>
            <span className={`px-3 py-1 rounded text-white ${
              currentQuestion.problem.difficulty === 'Easy' ? 'bg-green-500' : 
              currentQuestion.problem.difficulty === 'Medium' ? 'bg-yellow-500' : 
              'bg-red-500'
            }`}>
              {currentQuestion.problem.difficulty}
            </span>
          </div>

          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-3">{currentQuestion.problem.title}</h3>
            <p className="text-gray-700 mb-4">{currentQuestion.problem.description}</p>
            <a 
              href={currentQuestion.problem.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline text-sm"
            >
              View on LeetCode →
            </a>
          </div>

          <div className="mb-8">
            <h4 className="text-lg font-semibold mb-4">
              Select all algorithms/approaches that can solve this problem:
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {algorithmsList.map((algorithm) => (
                <label
                  key={algorithm}
                  className="flex items-center space-x-2 p-2 border rounded hover:bg-gray-50 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selectedAlgorithms.includes(algorithm)}
                    onChange={() => handleAlgorithmToggle(algorithm)}
                    className="w-4 h-4 text-blue-600"
                  />
                  <span className="text-sm">{algorithm}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-600">
              Score: {score} / {currentIndex}
            </div>
            <button
              onClick={handleNextQuestion}
              disabled={selectedAlgorithms.length === 0}
              className={`px-6 py-3 rounded-lg font-semibold ${
                selectedAlgorithms.length === 0 
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {currentIndex === questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}