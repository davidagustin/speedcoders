"use client";

import {
	ArrowLeftIcon,
	ArrowRightIcon,
	CheckCircleIcon,
	ClockIcon,
	FlagIcon,
	PauseIcon,
	PlayIcon,
	XCircleIcon,
} from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Question {
	id: string;
	question: string;
	options: string[];
	correctAnswer: number;
	explanation?: string;
	difficulty: string;
	category: string;
}

interface Quiz {
	id: string;
	title: string;
	description: string;
	difficulty: string;
	category: string;
	timeLimit: number;
	questions: Question[];
}

export default function EnhancedQuizPage() {
	const [quiz, setQuiz] = useState<Quiz | null>(null);
	const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
	const [answers, setAnswers] = useState<number[]>([]);
	const [timeLeft, setTimeLeft] = useState(0);
	const [isStarted, setIsStarted] = useState(false);
	const [isPaused, setIsPaused] = useState(false);
	const [isCompleted, setIsCompleted] = useState(false);
	const [showResults, setShowResults] = useState(false);
	const [flaggedQuestions, setFlaggedQuestions] = useState<Set<number>>(
		new Set(),
	);
	const [loading, setLoading] = useState(true);

	const router = useRouter();

	useEffect(() => {
		fetchQuiz();
	}, [fetchQuiz]);

	useEffect(() => {
		if (isStarted && !isPaused && timeLeft > 0) {
			const timer = setInterval(() => {
				setTimeLeft((prev) => {
					if (prev <= 1) {
						handleSubmit();
						return 0;
					}
					return prev - 1;
				});
			}, 1000);
			return () => clearInterval(timer);
		}
	}, [isStarted, isPaused, timeLeft, handleSubmit]);

	const fetchQuiz = async () => {
		try {
			// Mock quiz data for demonstration
			const mockQuiz: Quiz = {
				id: "1",
				title: "Advanced Algorithm Challenge",
				description:
					"Test your knowledge of advanced algorithms and data structures",
				difficulty: "Hard",
				category: "Algorithms",
				timeLimit: 1800, // 30 minutes
				questions: [
					{
						id: "1",
						question: "What is the time complexity of binary search?",
						options: ["O(1)", "O(log n)", "O(n)", "O(n²)"],
						correctAnswer: 1,
						explanation:
							"Binary search has O(log n) time complexity as it divides the search space in half with each iteration.",
						difficulty: "Medium",
						category: "Searching",
					},
					{
						id: "2",
						question:
							"Which data structure is best for implementing a priority queue?",
						options: ["Array", "Linked List", "Heap", "Stack"],
						correctAnswer: 2,
						explanation:
							"A heap is the most efficient data structure for implementing a priority queue, providing O(log n) insertion and deletion.",
						difficulty: "Medium",
						category: "Data Structures",
					},
					{
						id: "3",
						question: "What is the space complexity of merge sort?",
						options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
						correctAnswer: 2,
						explanation:
							"Merge sort requires O(n) additional space to store the merged subarrays.",
						difficulty: "Hard",
						category: "Sorting",
					},
				],
			};

			setQuiz(mockQuiz);
			setTimeLeft(mockQuiz.timeLimit);
		} catch (error) {
			console.error("Error fetching quiz:", error);
		} finally {
			setLoading(false);
		}
	};

	const startQuiz = () => {
		setIsStarted(true);
		setAnswers(new Array(quiz?.questions.length).fill(-1));
	};

	const handleAnswerSelect = (answerIndex: number) => {
		if (!isStarted || isCompleted) return;

		const newAnswers = [...answers];
		newAnswers[currentQuestionIndex] = answerIndex;
		setAnswers(newAnswers);
	};

	const handleNext = () => {
		if (currentQuestionIndex < quiz?.questions.length - 1) {
			setCurrentQuestionIndex(currentQuestionIndex + 1);
		}
	};

	const handlePrevious = () => {
		if (currentQuestionIndex > 0) {
			setCurrentQuestionIndex(currentQuestionIndex - 1);
		}
	};

	const toggleFlag = () => {
		const newFlagged = new Set(flaggedQuestions);
		if (newFlagged.has(currentQuestionIndex)) {
			newFlagged.delete(currentQuestionIndex);
		} else {
			newFlagged.add(currentQuestionIndex);
		}
		setFlaggedQuestions(newFlagged);
	};

	const handleSubmit = () => {
		setIsCompleted(true);
		setShowResults(true);
	};

	const formatTime = (seconds: number) => {
		const mins = Math.floor(seconds / 60);
		const secs = seconds % 60;
		return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
	};

	const getScore = () => {
		if (!quiz) return 0;
		let correct = 0;
		answers.forEach((answer, index) => {
			if (answer === quiz.questions[index].correctAnswer) {
				correct++;
			}
		});
		return Math.round((correct / quiz.questions.length) * 100);
	};

	if (loading) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
				<div className="lg:pl-64">
					<div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
						<div className="animate-pulse">
							<div className="h-8 bg-gray-200 dark:bg-slate-700 rounded w-1/3 mb-4"></div>
							<div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-1/2 mb-8"></div>
							<div className="card p-8">
								<div className="h-6 bg-gray-200 dark:bg-slate-700 rounded w-3/4 mb-4"></div>
								<div className="space-y-3">
									{[...Array(4)].map((_, i) => (
										<div
											key={i}
											className="h-12 bg-gray-200 dark:bg-slate-700 rounded"
										></div>
									))}
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}

	if (!quiz) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
				<div className="lg:pl-64">
					<div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
						<div className="text-center">
							<h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
								Quiz Not Found
							</h1>
							<p className="text-gray-600 dark:text-slate-300 mb-6">
								The quiz you're looking for doesn't exist or has been removed.
							</p>
							<button
								onClick={() => router.push("/quiz")}
								className="btn-primary"
							>
								Back to Quizzes
							</button>
						</div>
					</div>
				</div>
			</div>
		);
	}

	if (!isStarted) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
				<div className="lg:pl-64">
					<div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
						<div className="card p-8">
							<div className="text-center mb-8">
								<h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
									{quiz.title}
								</h1>
								<p className="text-gray-600 dark:text-slate-300 text-lg mb-6">
									{quiz.description}
								</p>
							</div>

							<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
								<div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
									<div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-2">
										{quiz.questions.length}
									</div>
									<div className="text-sm text-gray-600 dark:text-slate-300">
										Questions
									</div>
								</div>
								<div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
									<div className="text-2xl font-bold text-green-600 dark:text-green-400 mb-2">
										{formatTime(quiz.timeLimit)}
									</div>
									<div className="text-sm text-gray-600 dark:text-slate-300">
										Time Limit
									</div>
								</div>
								<div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
									<div className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-2">
										{quiz.difficulty}
									</div>
									<div className="text-sm text-gray-600 dark:text-slate-300">
										Difficulty
									</div>
								</div>
							</div>

							<div className="text-center">
								<button
									onClick={startQuiz}
									className="btn-primary text-lg px-8 py-4"
								>
									<PlayIcon className="h-6 w-6 mr-2" />
									Start Quiz
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}

	if (showResults) {
		const score = getScore();
		const correctAnswers = answers.filter(
			(answer, index) => answer === quiz.questions[index].correctAnswer,
		).length;

		return (
			<div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
				<div className="lg:pl-64">
					<div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
						<div className="card p-8">
							<div className="text-center mb-8">
								<h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
									Quiz Results
								</h1>
								<div className="text-6xl font-bold text-indigo-600 dark:text-indigo-400 mb-4">
									{score}%
								</div>
								<p className="text-gray-600 dark:text-slate-300 text-lg">
									You got {correctAnswers} out of {quiz.questions.length}{" "}
									questions correct
								</p>
							</div>

							<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
								<div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
									<div className="text-2xl font-bold text-green-600 dark:text-green-400 mb-2">
										{correctAnswers}
									</div>
									<div className="text-sm text-gray-600 dark:text-slate-300">
										Correct
									</div>
								</div>
								<div className="text-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
									<div className="text-2xl font-bold text-red-600 dark:text-red-400 mb-2">
										{quiz.questions.length - correctAnswers}
									</div>
									<div className="text-sm text-gray-600 dark:text-slate-300">
										Incorrect
									</div>
								</div>
								<div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
									<div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-2">
										{formatTime(quiz.timeLimit - timeLeft)}
									</div>
									<div className="text-sm text-gray-600 dark:text-slate-300">
										Time Used
									</div>
								</div>
							</div>

							<div className="space-y-4 mb-8">
								{quiz.questions.map((question, index) => (
									<div
										key={question.id}
										className="p-4 border border-gray-200 dark:border-slate-700 rounded-lg"
									>
										<div className="flex items-center gap-2 mb-2">
											<span className="text-sm font-medium text-gray-500 dark:text-slate-400">
												Question {index + 1}
											</span>
											{answers[index] === question.correctAnswer ? (
												<CheckCircleIcon className="h-5 w-5 text-green-500" />
											) : (
												<XCircleIcon className="h-5 w-5 text-red-500" />
											)}
										</div>
										<p className="text-gray-900 dark:text-white mb-3">
											{question.question}
										</p>
										<div className="space-y-2">
											{question.options.map((option, optionIndex) => (
												<div
													key={optionIndex}
													className={`p-3 rounded-lg border ${
														optionIndex === question.correctAnswer
															? "bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800"
															: optionIndex === answers[index] &&
																	optionIndex !== question.correctAnswer
																? "bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800"
																: "bg-gray-50 border-gray-200 dark:bg-slate-700 dark:border-slate-600"
													}`}
												>
													<span className="text-gray-900 dark:text-white">
														{option}
													</span>
												</div>
											))}
										</div>
										{question.explanation && (
											<div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
												<p className="text-sm text-blue-800 dark:text-blue-200">
													<strong>Explanation:</strong> {question.explanation}
												</p>
											</div>
										)}
									</div>
								))}
							</div>

							<div className="flex justify-center gap-4">
								<button
									onClick={() => router.push("/quiz")}
									className="btn-secondary"
								>
									Back to Quizzes
								</button>
								<button
									onClick={() => router.push("/progress")}
									className="btn-primary"
								>
									View Progress
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}

	const currentQuestion = quiz.questions[currentQuestionIndex];

	return (
		<div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
			<div className="lg:pl-64">
				<div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
					{/* Header */}
					<div className="card p-6 mb-6">
						<div className="flex items-center justify-between">
							<div>
								<h1 className="text-xl font-bold text-gray-900 dark:text-white">
									{quiz.title}
								</h1>
								<p className="text-sm text-gray-600 dark:text-slate-300">
									Question {currentQuestionIndex + 1} of {quiz.questions.length}
								</p>
							</div>
							<div className="flex items-center gap-4">
								<div className="flex items-center gap-2 text-red-600 dark:text-red-400">
									<ClockIcon className="h-5 w-5" />
									<span className="font-mono text-lg font-bold">
										{formatTime(timeLeft)}
									</span>
								</div>
								<button
									onClick={() => setIsPaused(!isPaused)}
									className="p-2 rounded-lg bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors"
								>
									{isPaused ? (
										<PlayIcon className="h-5 w-5" />
									) : (
										<PauseIcon className="h-5 w-5" />
									)}
								</button>
							</div>
						</div>
					</div>

					{/* Question */}
					<div className="card p-8 mb-6">
						<div className="flex items-center justify-between mb-6">
							<div className="flex items-center gap-2">
								<span className="text-sm font-medium text-gray-500 dark:text-slate-400">
									Question {currentQuestionIndex + 1}
								</span>
								<span
									className={`badge ${
										currentQuestion.difficulty === "Easy"
											? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300"
											: currentQuestion.difficulty === "Medium"
												? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300"
												: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300"
									}`}
								>
									{currentQuestion.difficulty}
								</span>
							</div>
							<button
								onClick={toggleFlag}
								className={`p-2 rounded-lg transition-colors ${
									flaggedQuestions.has(currentQuestionIndex)
										? "text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20"
										: "text-gray-400 hover:text-yellow-600 dark:hover:text-yellow-400"
								}`}
							>
								<FlagIcon className="h-5 w-5" />
							</button>
						</div>

						<p className="text-lg text-gray-900 dark:text-white mb-8">
							{currentQuestion.question}
						</p>

						<div className="space-y-3">
							{currentQuestion.options.map((option, index) => (
								<button
									key={index}
									onClick={() => handleAnswerSelect(index)}
									className={`w-full p-4 text-left rounded-lg border transition-all ${
										answers[currentQuestionIndex] === index
											? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20"
											: "border-gray-200 dark:border-slate-700 hover:border-gray-300 dark:hover:border-slate-600"
									}`}
								>
									<span className="text-gray-900 dark:text-white">
										{option}
									</span>
								</button>
							))}
						</div>
					</div>

					{/* Navigation */}
					<div className="flex items-center justify-between">
						<button
							onClick={handlePrevious}
							disabled={currentQuestionIndex === 0}
							className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
						>
							<ArrowLeftIcon className="h-5 w-5 mr-2" />
							Previous
						</button>

						<div className="flex items-center gap-2">
							{quiz.questions.map((_, index) => (
								<button
									key={index}
									onClick={() => setCurrentQuestionIndex(index)}
									className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
										index === currentQuestionIndex
											? "bg-indigo-600 text-white"
											: answers[index] !== -1
												? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300"
												: flaggedQuestions.has(index)
													? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300"
													: "bg-gray-100 text-gray-700 dark:bg-slate-700 dark:text-slate-300"
									}`}
								>
									{index + 1}
								</button>
							))}
						</div>

						{currentQuestionIndex === quiz.questions.length - 1 ? (
							<button onClick={handleSubmit} className="btn-primary">
								Submit Quiz
							</button>
						) : (
							<button onClick={handleNext} className="btn-secondary">
								Next
								<ArrowRightIcon className="h-5 w-5 ml-2" />
							</button>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
