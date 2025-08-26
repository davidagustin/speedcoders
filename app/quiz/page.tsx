'use client';

import { useState, useEffect, useMemo, useCallback, memo, lazy, Suspense } from 'react';
import { useRouter } from 'next/navigation';
// Import complete problems data 
import { ALL_3662_PROBLEMS as ALL_3662_LEETCODE_PROBLEMS, type LeetCodeProblem } from '@/data/complete3662Problems';

// Lazy load heavy components
const VirtualizedTopicSelector = lazy(() => import('@/components/VirtualizedTopicSelector'));
const VirtualizedProblemList = lazy(() => import('@/components/VirtualizedProblemList'));

// Memoized conversion with lazy initialization
let convertedProblemsCache: LeetCodeProblem[] | null = null;

const getConvertedProblems = (): LeetCodeProblem[] => {
  if (convertedProblemsCache) return convertedProblemsCache;
  
  convertedProblemsCache = ALL_3662_LEETCODE_PROBLEMS.map(problem => ({
    ...problem,
    topics: problem.algorithms,
    algorithms: problem.algorithms,
    algorithmSolutions: problem.algorithms.map(alg => ({
      algorithm: alg,
      timeComplexity: "O(n)",
      spaceComplexity: "O(1)",
      optimal: true,
      difficulty: "Intermediate" as const,
      description: `${alg} approach to solve this problem`
    })),
    companies: [],
    examples: [],
    constraints: []
  }));
  
  return convertedProblemsCache;
};

// Debounce utility
const useDebounce = <T>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

export interface AlgorithmSolution {
  algorithm: string;
  timeComplexity: string;
  spaceComplexity: string;
  optimal: boolean;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  description: string;
}

interface QuizSettings {
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Mixed';
  questionCount: number;
  topics: string[];
}

interface SearchFilters {
  searchTerm: string;
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Mixed';
  topics: string[];
  sortBy: 'title' | 'difficulty' | 'id';
  sortOrder: 'asc' | 'desc';
}

// Virtual scrolling component for topics
const VirtualTopicList = memo(({ topics, selectedTopics, onTopicToggle }: {
  topics: string[];
  selectedTopics: string[];
  onTopicToggle: (topic: string) => void;
}) => {
  const [visibleStart, setVisibleStart] = useState(0);
  const [visibleEnd, setVisibleEnd] = useState(20);
  const itemHeight = 40;
  const containerHeight = 200;
  const visibleItems = Math.ceil(containerHeight / itemHeight);

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const scrollTop = e.currentTarget.scrollTop;
    const start = Math.floor(scrollTop / itemHeight);
    const end = Math.min(start + visibleItems + 5, topics.length);
    
    setVisibleStart(start);
    setVisibleEnd(end);
  }, [topics.length, itemHeight, visibleItems]);

  const visibleTopics = useMemo(() => 
    topics.slice(visibleStart, visibleEnd),
    [topics, visibleStart, visibleEnd]
  );

  return (
    <div 
      className="h-48 overflow-y-auto border border-gray-300 rounded-lg p-2"
      onScroll={handleScroll}
    >
      <div style={{ height: topics.length * itemHeight, position: 'relative' }}>
        <div 
          style={{ 
            transform: `translateY(${visibleStart * itemHeight}px)`,
            position: 'absolute',
            width: '100%'
          }}
        >
          {visibleTopics.map((topic, index) => {
            const actualIndex = visibleStart + index;
            return (
              <label 
                key={`${topic}-${actualIndex}`} 
                className="flex items-center space-x-2 cursor-pointer p-1 hover:bg-gray-50 rounded"
                style={{ height: itemHeight }}
              >
                <input
                  type="checkbox"
                  checked={selectedTopics.includes(topic)}
                  onChange={() => onTopicToggle(topic)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700 truncate">{topic}</span>
              </label>
            );
          })}
        </div>
      </div>
    </div>
  );
});

VirtualTopicList.displayName = 'VirtualTopicList';

export default function QuizPage() {
  const [currentProblemIndex, setCurrentProblemIndex] = useState(0);
  const [selectedAlgorithms, setSelectedAlgorithms] = useState<string[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [quizStarted, setQuizStarted] = useState(false);
  const [settings, setSettings] = useState<QuizSettings>({
    difficulty: 'Mixed',
    questionCount: 10,
    topics: []
  });
  const [filteredProblems, setFilteredProblems] = useState<LeetCodeProblem[]>([]);
  const [usedProblemIds, setUsedProblemIds] = useState<Set<number>>(new Set());
  const router = useRouter();

  // Get all available topics
  const allTopics = Array.from(new Set(
    convertedProblems.flatMap(problem => problem.topics)
  )).sort();

  // Filter problems based on settings
  useEffect(() => {
    let filtered = convertedProblems;
    
    // Filter by difficulty
    if (settings.difficulty !== 'Mixed') {
      filtered = filtered.filter(problem => problem.difficulty === settings.difficulty);
    }
    
    // Filter by topics
    if (settings.topics.length > 0) {
      filtered = filtered.filter(problem => 
        settings.topics.some(topic => problem.topics.includes(topic))
      );
    }
    
    // Remove used problems
    filtered = filtered.filter(problem => !usedProblemIds.has(problem.id));
    
    setFilteredProblems(filtered);
  }, [settings, usedProblemIds]);

  const currentProblem = filteredProblems[currentProblemIndex];

  const handleAlgorithmToggle = (algorithm: string) => {
    setSelectedAlgorithms(prev => 
      prev.includes(algorithm)
        ? prev.filter(alg => alg !== algorithm)
        : [...prev, algorithm]
    );
  };

  const checkAnswer = () => {
    if (!currentProblem) return false;
    
    const correctAlgorithms = currentProblem.algorithms;
    const selected = selectedAlgorithms;
    
    // Check if all correct algorithms are selected and no incorrect ones
    const allCorrectSelected = correctAlgorithms.every(alg => selected.includes(alg));
    const noIncorrectSelected = selected.every(alg => correctAlgorithms.includes(alg));
    
    return allCorrectSelected && noIncorrectSelected;
  };

  const handleSubmit = () => {
    const isCorrect = checkAnswer();
    if (isCorrect) {
      setScore(prev => prev + 1);
    }
    setTotalQuestions(prev => prev + 1);
    setShowResults(true);
  };

  const handleNext = () => {
    if (currentProblem) {
      setUsedProblemIds(prev => new Set([...prev, currentProblem.id]));
    }
    
    if (currentProblemIndex < Math.min(settings.questionCount - 1, filteredProblems.length - 1)) {
      setCurrentProblemIndex(prev => prev + 1);
      setSelectedAlgorithms([]);
      setShowResults(false);
    } else {
      // Quiz completed
      router.push(`/results?score=${score}&total=${totalQuestions + 1}`);
    }
  };

  const startQuiz = () => {
    if (filteredProblems.length === 0) {
      alert('No problems available with the selected filters. Please adjust your settings.');
      return;
    }
    
    setQuizStarted(true);
    setCurrentProblemIndex(0);
    setSelectedAlgorithms([]);
    setShowResults(false);
    setScore(0);
    setTotalQuestions(0);
    setUsedProblemIds(new Set());
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Quiz Settings Screen
  if (!quizStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">LeetCode Algorithm Quiz</h1>
              <p className="text-xl text-gray-600">
                Test your knowledge of algorithms with {convertedProblems.length} real LeetCode problems!
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Difficulty Selection */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Difficulty Level</h3>
                <div className="space-y-3">
                  {(['Mixed', 'Easy', 'Medium', 'Hard'] as const).map((diff) => (
                    <label key={diff} className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="radio"
                        name="difficulty"
                        value={diff}
                        checked={settings.difficulty === diff}
                        onChange={(e) => setSettings(prev => ({ ...prev, difficulty: e.target.value as any }))}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-gray-700">{diff}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Question Count */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Number of Questions</h3>
                <select
                  value={settings.questionCount}
                  onChange={(e) => setSettings(prev => ({ ...prev, questionCount: parseInt(e.target.value) }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value={5}>5 Questions</option>
                  <option value={10}>10 Questions</option>
                  <option value={15}>15 Questions</option>
                  <option value={20}>20 Questions</option>
                  <option value={30}>30 Questions</option>
                </select>
              </div>
            </div>

            {/* Topic Selection */}
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Topics (Optional)</h3>
              <p className="text-sm text-gray-600 mb-4">Select specific topics to focus on, or leave empty for all topics</p>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 max-h-48 overflow-y-auto">
                {allTopics.map((topic) => (
                  <label key={topic} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.topics.includes(topic)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSettings(prev => ({ ...prev, topics: [...prev.topics, topic] }));
                        } else {
                          setSettings(prev => ({ ...prev, topics: prev.topics.filter(t => t !== topic) }));
                        }
                      }}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">{topic}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Available Problems Count */}
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>{filteredProblems.length}</strong> problems available with current filters
              </p>
            </div>

            <div className="mt-8 text-center">
              <button
                onClick={startQuiz}
                disabled={filteredProblems.length === 0}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 px-8 rounded-lg text-lg transition-colors disabled:cursor-not-allowed"
              >
                Start Quiz
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Quiz Interface
  if (!currentProblem) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">No More Problems Available</h2>
            <p className="text-gray-600 mb-6">
              You've completed all available problems with the current filters.
            </p>
            <button
              onClick={() => {
                setQuizStarted(false);
                setUsedProblemIds(new Set());
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors"
            >
              Change Settings
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-gray-900">LeetCode Algorithm Quiz</h1>
            <div className="text-sm text-gray-600">
              Question {currentProblemIndex + 1} of {Math.min(settings.questionCount, filteredProblems.length)}
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentProblemIndex + 1) / Math.min(settings.questionCount, filteredProblems.length)) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Problem Card */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <h2 className="text-2xl font-semibold text-gray-900">{currentProblem.title}</h2>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(currentProblem.difficulty)}`}>
                {currentProblem.difficulty}
              </span>
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                #{currentProblem.id}
              </span>
            </div>
            <a 
              href={currentProblem.leetcodeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 text-sm"
            >
              View on LeetCode →
            </a>
          </div>
          
          <p className="text-gray-700 mb-6 leading-relaxed">
            {currentProblem.description}
          </p>

          {/* Topics */}
          <div className="mb-6">
            <h4 className="font-semibold text-gray-900 mb-2">Topics:</h4>
            <div className="flex flex-wrap gap-2">
              {currentProblem.topics.map((topic) => (
                <span key={topic} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm">
                  {topic}
                </span>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Select all algorithms that can solve this problem:
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentProblem.algorithmSolutions.map((solution) => (
                <div
                  key={solution.algorithm}
                  className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                    selectedAlgorithms.includes(solution.algorithm)
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => handleAlgorithmToggle(solution.algorithm)}
                >
                  <div className="flex items-start space-x-3">
                    <input
                      type="checkbox"
                      checked={selectedAlgorithms.includes(solution.algorithm)}
                      onChange={() => handleAlgorithmToggle(solution.algorithm)}
                      className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-semibold text-gray-900">{solution.algorithm}</h4>
                        {solution.optimal && (
                          <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-medium">
                            Optimal
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{solution.description}</p>
                      <div className="flex space-x-4 text-xs text-gray-500">
                        <span>Time: {solution.timeComplexity}</span>
                        <span>Space: {solution.spaceComplexity}</span>
                        <span className={`px-1 rounded ${
                          solution.difficulty === 'Beginner' ? 'bg-green-100 text-green-700' :
                          solution.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {solution.difficulty}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Results */}
          {showResults && (
            <div className={`p-4 rounded-lg mb-4 ${
              checkAnswer() 
                ? 'bg-green-50 border border-green-200' 
                : 'bg-red-50 border border-red-200'
            }`}>
              <div className="flex items-center space-x-2">
                <span className={`text-lg ${checkAnswer() ? 'text-green-600' : 'text-red-600'}`}>
                  {checkAnswer() ? '✅' : '❌'}
                </span>
                <span className={`font-semibold ${checkAnswer() ? 'text-green-800' : 'text-red-800'}`}>
                  {checkAnswer() ? 'Correct!' : 'Incorrect'}
                </span>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                {checkAnswer() 
                  ? 'Great job! You selected all the correct algorithms.'
                  : 'The correct algorithms were: ' + currentProblem.algorithms.join(', ')
                }
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-between">
            <button
              onClick={() => {
                setQuizStarted(false);
                setUsedProblemIds(new Set());
              }}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              ← Back to Settings
            </button>
            
            <div className="space-x-3">
              {!showResults ? (
                <button
                  onClick={handleSubmit}
                  disabled={selectedAlgorithms.length === 0}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Submit Answer
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  {currentProblemIndex < Math.min(settings.questionCount - 1, filteredProblems.length - 1) ? 'Next Question' : 'Finish Quiz'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}