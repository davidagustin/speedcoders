import React, { useEffect, useState, useCallback, useMemo, memo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { allProblems as allLeetcodeProblems } from "@/lib/data/all-batches-index";
import { 
  QuizConfig, 
  QuizAnswer, 
  QuizResult, 
  Problem, 
  User, 
  DailyChallenge 
} from "@/types/quiz";
import { LoadingState, ErrorState } from "@/types/performance";
import { PerformanceMonitor, usePerformanceMonitor } from "@/lib/PerformanceMonitor";
import ErrorBoundary from "./ErrorBoundary";
import { QuizSkeleton } from "./LoadingSkeletons";

interface QuizProps {
  user: User;
  onComplete: (result: QuizResult) => void;
}

interface CompanyTags {
  [key: string]: string[];
}

const companyTags: CompanyTags = { 
  Google: [], 
  Facebook: [], 
  Amazon: [], 
  Microsoft: [], 
  Apple: [] 
};

// Memoized components for performance
const QuizTimer = memo<{
  timeLeft: number;
  timeLimit: number;
  onTimeUp: () => void;
}>(({ timeLeft, timeLimit, onTimeUp }) => {
  const getTimeColor = useCallback(() => {
    const percentage = (timeLeft / timeLimit) * 100;
    if (percentage > 50) return "#4CAF50";
    if (percentage > 25) return "#FF9800";
    return "#F44336";
  }, [timeLeft, timeLimit]);

  const formatTime = useCallback((seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  }, []);

  useEffect(() => {
    if (timeLeft <= 0) {
      onTimeUp();
    }
  }, [timeLeft, onTimeUp]);

  return (
    <div className="quiz-timer" style={{ color: getTimeColor() }}>
      <span className="timer-icon">⏱️</span>
      <span className="timer-text">{formatTime(timeLeft)}</span>
      <div className="timer-bar">
        <div
          className="timer-fill"
          style={{
            width: `${(timeLeft / timeLimit) * 100}%`,
            backgroundColor: getTimeColor(),
          }}
        />
      </div>
    </div>
  );
});

QuizTimer.displayName = "QuizTimer";

const QuestionProgress = memo<{
  currentQuestion: number;
  totalQuestions: number;
  difficulty: string;
}>(({ currentQuestion, totalQuestions, difficulty }) => {
  const progress = useMemo(
    () => ((currentQuestion + 1) / totalQuestions) * 100,
    [currentQuestion, totalQuestions]
  );

  return (
    <div className="quiz-progress">
      <div className="progress-info">
        <span>
          Question {currentQuestion + 1} of {totalQuestions}
        </span>
        <span className={`difficulty-badge ${difficulty.toLowerCase()}`}>
          {difficulty}
        </span>
      </div>
      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${progress}%` }} />
      </div>
    </div>
  );
});

QuestionProgress.displayName = "QuestionProgress";

const QuestionCard = memo<{
  question: Problem;
  answers: string[];
  onAlgorithmToggle: (algorithm: string) => void;
}>(({ question, answers, onAlgorithmToggle }) => (
  <div className="question-content">
    <div className="problem-card">
      <div className="problem-header">
        <h2>
          #{question.id}. {question.title}
        </h2>
        <a
          href={question.url}
          target="_blank"
          rel="noopener noreferrer"
          className="leetcode-link"
        >
          View on LeetCode →
        </a>
      </div>
      <p className="problem-description">{question.description}</p>
    </div>

    <div className="algorithm-selection">
      <h3>Select ALL applicable algorithms/techniques:</h3>
      <div className="algorithm-grid">
        {question.algorithms.map((algorithm) => (
          <label
            key={algorithm}
            className={`algorithm-option ${
              answers.includes(algorithm) ? "selected" : ""
            }`}
          >
            <input
              type="checkbox"
              checked={answers.includes(algorithm)}
              onChange={() => onAlgorithmToggle(algorithm)}
            />
            <span className="algorithm-text">{algorithm}</span>
          </label>
        ))}
      </div>
    </div>
  </div>
));

QuestionCard.displayName = "QuestionCard";

const QuestionNavigation = memo<{
  currentQuestion: number;
  totalQuestions: number;
  onPrevious: () => void;
  onNext: () => void;
  onQuestionSelect: (index: number) => void;
  onSubmit: () => void;
  answers: QuizAnswer;
  questions: Problem[];
}>(({ currentQuestion, totalQuestions, onPrevious, onNext, onQuestionSelect, onSubmit, answers, questions }) => (
  <div className="quiz-navigation">
    <button
      onClick={onPrevious}
      disabled={currentQuestion === 0}
      className="nav-btn prev-btn"
    >
      ← Previous
    </button>

    <div className="question-indicators">
      {questions.map((question, index) => (
        <button
          key={index}
          onClick={() => onQuestionSelect(index)}
          className={`question-indicator ${
            index === currentQuestion ? "current" : ""
          } ${answers[question.id]?.length > 0 ? "answered" : ""}`}
        >
          {index + 1}
        </button>
      ))}
    </div>

    {currentQuestion === totalQuestions - 1 ? (
      <button className="nav-btn submit-btn" onClick={onSubmit}>
        Submit Quiz 📤
      </button>
    ) : (
      <button onClick={onNext} className="nav-btn next-btn">
        Next →
      </button>
    )}
  </div>
));

QuestionNavigation.displayName = "QuestionNavigation";

const QuizStats = memo<{
  answeredCount: number;
  totalQuestions: number;
  mode: string;
  timeUsed: number;
}>(({ answeredCount, totalQuestions, mode, timeUsed }) => {
  const formatTime = useCallback((seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  }, []);

  return (
    <div className="quiz-stats-sidebar">
      <h4>📊 Progress</h4>
      <div className="stat">
        <span>Answered:</span>
        <span>{answeredCount}/{totalQuestions}</span>
      </div>
      <div className="stat">
        <span>Mode:</span>
        <span>{mode}</span>
      </div>
      <div className="stat">
        <span>Time Used:</span>
        <span>{formatTime(timeUsed)}</span>
      </div>
    </div>
  );
});

QuizStats.displayName = "QuizStats";

const QuizSetup = memo<{
  config: QuizConfig;
  questionsCount: number;
  challenge?: DailyChallenge;
  onStart: () => void;
  onBack: () => void;
}>(({ config, questionsCount, challenge, onStart, onBack }) => {
  const formatTime = useCallback((seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  }, []);

  return (
    <div className="quiz-setup">
      <div className="setup-container">
        <h1>🎯 Quiz Setup</h1>

        <div className="quiz-info">
          <div className="info-card">
            <h3>📊 Quiz Details</h3>
            <div className="quiz-stats">
              <div className="stat">
                <span className="label">Mode:</span>
                <span className="value">
                  {config.mode.charAt(0).toUpperCase() + config.mode.slice(1)}
                </span>
              </div>
              <div className="stat">
                <span className="label">Questions:</span>
                <span className="value">{questionsCount}</span>
              </div>
              <div className="stat">
                <span className="label">Time Limit:</span>
                <span className="value">{formatTime(config.timeLimit)}</span>
              </div>
              <div className="stat">
                <span className="label">Difficulty:</span>
                <span className="value">{config.difficulty}</span>
              </div>
            </div>
          </div>

          {challenge && (
            <div className="challenge-info">
              <h3>🎯 Daily Challenge</h3>
              <div className="challenge-details">
                <span className="challenge-icon">{challenge.icon}</span>
                <div>
                  <h4>{challenge.title}</h4>
                  <p>{challenge.description}</p>
                  <span className="challenge-reward">Reward: {challenge.reward}</span>
                </div>
              </div>
            </div>
          )}

          <div className="instructions">
            <h3>📝 Instructions</h3>
            <ul>
              <li>Select ALL algorithms that can solve each problem</li>
              <li>Multiple selections are usually required</li>
              <li>Navigate between questions using Previous/Next</li>
              <li>Submit when ready or timer expires</li>
              <li>Earn XP based on accuracy and difficulty</li>
            </ul>
          </div>
        </div>

        <div className="setup-actions">
          <button className="start-btn" onClick={onStart}>
            🚀 Start Quiz
          </button>
          <button className="back-btn" onClick={onBack}>
            ← Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
});

QuizSetup.displayName = "QuizSetup";

const Quiz: React.FC<QuizProps> = memo(({ user, onComplete }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { measureAsync, measureComponent } = usePerformanceMonitor();
  const quizMeasure = measureComponent('Quiz');
  
  const [questions, setQuestions] = useState<Problem[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswer>({});
  const [timeLeft, setTimeLeft] = useState(600);
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizConfig, setQuizConfig] = useState<QuizConfig>({
    mode: "smart",
    difficulty: "Mixed",
    timeLimit: 600,
    questionCount: 10,
    algorithms: [],
    company: null,
  });
  const [loadingState, setLoadingState] = useState<LoadingState>({ 
    isLoading: true, 
    loadingText: "Generating quiz..." 
  });
  const [errorState, setErrorState] = useState<ErrorState>({ hasError: false });

  const quizOptions = useMemo(
    () => Object.fromEntries(searchParams.entries()),
    [searchParams]
  );

  const challenge = useMemo(
    () => quizOptions.challenge ? JSON.parse(quizOptions.challenge) : null,
    [quizOptions.challenge]
  );

  const answeredCount = useMemo(
    () => Object.values(answers).filter((ans) => ans.length > 0).length,
    [answers]
  );

  const timeUsed = useMemo(
    () => quizConfig.timeLimit - timeLeft,
    [quizConfig.timeLimit, timeLeft]
  );

  // Memoized functions
  const generateSmartQuiz = useCallback((user: User): Problem[] => {
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const currentUser = users.find((u: User) => u.id === user.id);

    if (!currentUser?.scores || currentUser.scores.length === 0) {
      return getBalancedMix();
    }

    // Analyze weak algorithms
    const algorithmPerformance: Record<string, { correct: number; total: number }> = {};
    currentUser.scores.forEach((score: QuizResult) => {
      if (score.details) {
        score.details.forEach((detail) => {
          detail.correctAnswer.forEach((algo) => {
            if (!algorithmPerformance[algo]) {
              algorithmPerformance[algo] = { correct: 0, total: 0 };
            }
            algorithmPerformance[algo].total++;
            if (detail.isCorrect) {
              algorithmPerformance[algo].correct++;
            }
          });
        });
      }
    });

    // Find algorithms with <70% accuracy
    const weakAlgorithms = Object.entries(algorithmPerformance)
      .filter(([_, stats]) => stats.correct / stats.total < 0.7)
      .map(([algo]) => algo);

    if (weakAlgorithms.length === 0) {
      return getBalancedMix();
    }

    // Select problems focusing on weak algorithms
    return allLeetcodeProblems.filter((p: Problem) =>
      p.correctAlgorithms.some((algo) => weakAlgorithms.includes(algo))
    );
  }, []);

  const getBalancedMix = useCallback((): Problem[] => {
    const easy = allLeetcodeProblems
      .filter((p: Problem) => p.difficulty === "Easy")
      .slice(0, 1000);
    const medium = allLeetcodeProblems
      .filter((p: Problem) => p.difficulty === "Medium")
      .slice(0, 1000);
    const hard = allLeetcodeProblems
      .filter((p: Problem) => p.difficulty === "Hard")
      .slice(0, 500);
    return [...easy, ...medium, ...hard];
  }, []);

  const adaptForChallenge = useCallback((challenge: DailyChallenge, config: QuizConfig): QuizConfig => {
    switch (challenge.type) {
      case "speed":
        return {
          ...config,
          timeLimit: 600,
          difficulty: "Medium",
          questionCount: 8,
        };
      case "accuracy":
        return {
          ...config,
          questionCount: 5,
          timeLimit: 900,
        };
      case "variety":
        return {
          ...config,
          questionCount: 12,
          timeLimit: 1200,
        };
      default:
        return config;
    }
  }, []);

  const generateQuiz = useCallback(async () => {
    try {
      setLoadingState({ isLoading: true, loadingText: "Generating quiz questions..." });
      
      await measureAsync('generateQuiz', async () => {
        let selectedProblems = [...allLeetcodeProblems] as Problem[];
        let config: QuizConfig = {
          mode: (quizOptions.mode as QuizConfig['mode']) || "smart",
          difficulty: (quizOptions.difficulty as QuizConfig['difficulty']) || "Mixed",
          timeLimit: parseInt(quizOptions.timeLimit) || 600,
          questionCount: parseInt(quizOptions.questionCount) || 10,
          algorithms: quizOptions.algorithms ? quizOptions.algorithms.split(',') : [],
          company: quizOptions.company || null,
        };

        // Handle custom quiz mode
        if (config.mode === "custom" && quizOptions.customProblems) {
          const customProblems = JSON.parse(quizOptions.customProblems) as Problem[];
          const finalQuestions = customProblems.map((q) => ({
            ...q,
            selectedAlgorithms: [],
          }));

          setQuestions(finalQuestions);
          setQuizConfig(config);
          setTimeLeft(config.timeLimit);

          const initialAnswers: QuizAnswer = {};
          finalQuestions.forEach((q) => {
            initialAnswers[q.id] = [];
          });
          setAnswers(initialAnswers);
          setLoadingState({ isLoading: false });
          return;
        }

        // Apply filters based on quiz mode
        switch (config.mode) {
          case "company":
            if (config.company && companyTags[config.company]) {
              selectedProblems = selectedProblems.filter((p) =>
                companyTags[config.company!].includes(p.id)
              );
              config.questionCount = Math.min(15, selectedProblems.length);
              config.timeLimit = 900;
            }
            break;

          case "algorithm":
            if (config.algorithms.length > 0) {
              selectedProblems = selectedProblems.filter((p) =>
                p.correctAlgorithms.some((algo) =>
                  config.algorithms.includes(algo)
                )
              );
              config.questionCount = Math.min(12, selectedProblems.length);
            }
            break;

          case "difficulty":
            if (config.difficulty !== "Mixed") {
              selectedProblems = selectedProblems.filter(
                (p) => p.difficulty === config.difficulty
              );
            }
            break;

          case "smart":
            selectedProblems = generateSmartQuiz(user);
            config.questionCount = 15;
            config.timeLimit = 1200;
            break;

          case "speed":
            config.timeLimit = 300; // 5 minutes
            config.questionCount = 8;
            selectedProblems = selectedProblems.filter(
              (p) => p.difficulty === "Easy"
            );
            break;

          case "challenge":
            if (challenge) {
              config = adaptForChallenge(challenge, config);
            }
            break;
        }

        // Apply difficulty filter if specified
        if (config.difficulty !== "Mixed" && config.mode !== "difficulty") {
          selectedProblems = selectedProblems.filter(
            (p) => p.difficulty === config.difficulty
          );
        }

        // Shuffle and select questions
        const finalQuestions = selectedProblems
          .sort(() => 0.5 - Math.random())
          .slice(0, config.questionCount)
          .map((q) => ({
            ...q,
            selectedAlgorithms: [],
          }));

        setQuestions(finalQuestions);
        setQuizConfig(config);
        setTimeLeft(config.timeLimit);

        // Initialize answers
        const initialAnswers: QuizAnswer = {};
        finalQuestions.forEach((q) => {
          initialAnswers[q.id] = [];
        });
        setAnswers(initialAnswers);
        setLoadingState({ isLoading: false });
      });
    } catch (error) {
      console.error("Error generating quiz:", error);
      setErrorState({ 
        hasError: true, 
        error: error instanceof Error ? error : new Error("Failed to generate quiz") 
      });
      setLoadingState({ isLoading: false });
    }
  }, [quizOptions, user, generateSmartQuiz, adaptForChallenge, challenge, measureAsync]);

  const handleAlgorithmToggle = useCallback((questionId: string, algorithm: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: prev[questionId]?.includes(algorithm)
        ? prev[questionId].filter((a) => a !== algorithm)
        : [...(prev[questionId] || []), algorithm],
    }));
  }, []);

  const handleSubmit = useCallback(async () => {
    try {
      await measureAsync('handleSubmit', async () => {
        let correct = 0;
        const detailedResults = questions.map((q) => {
          const userAnswer = answers[q.id] || [];
          const isCorrect =
            userAnswer.length === q.correctAlgorithms.length &&
            userAnswer.every((a) => q.correctAlgorithms.includes(a));

          if (isCorrect) correct++;

          return {
            question: q.title,
            questionId: q.id,
            difficulty: q.difficulty,
            userAnswer,
            correctAnswer: q.correctAlgorithms,
            allAlgorithms: q.algorithms,
            isCorrect,
            url: q.url,
          };
        });

        const percentage = Math.round((correct / questions.length) * 100);
        const timeSpent = quizConfig.timeLimit - timeLeft;

        // Calculate XP earned
        let xpEarned = percentage * 10; // Base XP
        if (quizConfig.difficulty === "Hard") xpEarned *= 2;
        else if (quizConfig.difficulty === "Medium") xpEarned *= 1.5;

        // Bonus XP for challenges
        if (challenge) {
          if (challenge.type === "speed" && timeSpent < 600) {
            xpEarned += 200;
          }
          if (challenge.type === "accuracy" && percentage === 100) {
            xpEarned += 300;
          }
        }

        const result: QuizResult = {
          date: new Date().toISOString(),
          mode: quizConfig.mode,
          difficulty: quizConfig.difficulty,
          correct,
          totalQuestions: questions.length,
          percentage,
          timeSpent,
          timeLimit: quizConfig.timeLimit,
          xpEarned: Math.round(xpEarned),
          details: detailedResults,
          challenge: challenge || undefined,
        };

        // Update user XP and stats
        const users = JSON.parse(localStorage.getItem("users") || "[]");
        const userIndex = users.findIndex((u: User) => u.id === user.id);
        if (userIndex !== -1) {
          if (!users[userIndex].scores) users[userIndex].scores = [];
          if (!users[userIndex].totalXP) users[userIndex].totalXP = 0;

          users[userIndex].scores.push(result);
          users[userIndex].totalXP += result.xpEarned;
          localStorage.setItem("users", JSON.stringify(users));
        }

        onComplete(result);
        router.push("/results");
      });
    } catch (error) {
      console.error("Error submitting quiz:", error);
      setErrorState({ 
        hasError: true, 
        error: error instanceof Error ? error : new Error("Failed to submit quiz") 
      });
    }
  }, [questions, answers, quizConfig, timeLeft, challenge, user, onComplete, router, measureAsync]);

  const handleNext = useCallback(() => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  }, [currentQuestion, questions.length]);

  const handlePrevious = useCallback(() => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  }, [currentQuestion]);

  const handleQuestionSelect = useCallback((index: number) => {
    setCurrentQuestion(index);
  }, []);

  const handleTimeUp = useCallback(() => {
    handleSubmit();
  }, [handleSubmit]);

  const handleStartQuiz = useCallback(() => {
    quizMeasure.start();
    setQuizStarted(true);
  }, [quizMeasure]);

  const handleBackToDashboard = useCallback(() => {
    router.push("/dashboard");
  }, [router]);

  // Timer effect
  useEffect(() => {
    if (!quizStarted || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [quizStarted, timeLeft, handleTimeUp]);

  // Initialize quiz
  useEffect(() => {
    generateQuiz();
  }, [generateQuiz]);

  // Cleanup effect
  useEffect(() => {
    return () => {
      if (quizStarted) {
        quizMeasure.end();
      }
    };
  }, [quizStarted, quizMeasure]);

  if (loadingState.isLoading) {
    return <QuizSkeleton />;
  }

  if (errorState.hasError) {
    return (
      <ErrorBoundary level="section">
        <div className="error-container">
          <h2>Failed to Load Quiz</h2>
          <p>There was an error generating your quiz. Please try again.</p>
          <button onClick={generateQuiz} className="retry-btn">
            Retry
          </button>
          <button onClick={handleBackToDashboard} className="back-btn">
            Back to Dashboard
          </button>
        </div>
      </ErrorBoundary>
    );
  }

  if (!quizStarted) {
    return (
      <QuizSetup
        config={quizConfig}
        questionsCount={questions.length}
        challenge={challenge}
        onStart={handleStartQuiz}
        onBack={handleBackToDashboard}
      />
    );
  }

  if (questions.length === 0) {
    return <div className="loading">No questions available...</div>;
  }

  const question = questions[currentQuestion];

  return (
    <ErrorBoundary level="section">
      <div className="enhanced-quiz">
        {/* Quiz Header */}
        <div className="quiz-header">
          <QuestionProgress
            currentQuestion={currentQuestion}
            totalQuestions={questions.length}
            difficulty={question.difficulty}
          />
          <QuizTimer
            timeLeft={timeLeft}
            timeLimit={quizConfig.timeLimit}
            onTimeUp={handleTimeUp}
          />
        </div>

        {/* Question Content */}
        <QuestionCard
          question={question}
          answers={answers[question.id] || []}
          onAlgorithmToggle={(algorithm) => handleAlgorithmToggle(question.id, algorithm)}
        />

        {/* Navigation */}
        <QuestionNavigation
          currentQuestion={currentQuestion}
          totalQuestions={questions.length}
          onPrevious={handlePrevious}
          onNext={handleNext}
          onQuestionSelect={handleQuestionSelect}
          onSubmit={handleSubmit}
          answers={answers}
          questions={questions}
        />

        {/* Quiz Stats */}
        <QuizStats
          answeredCount={answeredCount}
          totalQuestions={questions.length}
          mode={quizConfig.mode}
          timeUsed={timeUsed}
        />
      </div>
    </ErrorBoundary>
  );
});

Quiz.displayName = "Quiz";

export default Quiz;