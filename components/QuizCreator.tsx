"use client";

import {
	AcademicCapIcon,
	CheckCircleIcon,
	ClockIcon,
	ExclamationTriangleIcon,
	PlusIcon,
	XMarkIcon,
} from "@heroicons/react/24/outline";
import { useState } from "react";
import type { Quiz, QuizQuestion } from "@/lib/QuizManager";
import { LoadingSpinner } from "./LoadingSpinner";

interface QuizCreatorProps {
	onQuizCreated?: (quiz: Quiz) => void;
	onCancel?: () => void;
}

export function QuizCreator({ onQuizCreated, onCancel }: QuizCreatorProps) {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string>("");

	const [quiz, setQuiz] = useState({
		title: "",
		description: "",
		timeLimit: 30,
		difficulty: "Easy" as "Easy" | "Medium" | "Hard",
		categories: [] as string[],
		isPublic: true,
	});

	const [questions, setQuestions] = useState<Partial<QuizQuestion>[]>([
		{
			questionText: "",
			options: ["", "", "", ""],
			correctAnswers: [0],
			explanation: "",
			difficulty: "Easy",
			algorithms: [],
			timeLimit: 5,
		},
	]);

	const categories = [
		"Array",
		"String",
		"Tree",
		"Graph",
		"Dynamic Programming",
		"Stack",
		"Queue",
		"Hash Table",
		"Linked List",
		"Sorting",
	];

	const algorithms = [
		"Two Pointers",
		"Sliding Window",
		"Binary Search",
		"DFS",
		"BFS",
		"Kadane's Algorithm",
		"Dijkstra",
		"Union Find",
		"Backtracking",
	];

	const addQuestion = () => {
		setQuestions([
			...questions,
			{
				questionText: "",
				options: ["", "", "", ""],
				correctAnswers: [0],
				explanation: "",
				difficulty: "Easy",
				algorithms: [],
				timeLimit: 5,
			},
		]);
	};

	const removeQuestion = (index: number) => {
		if (questions.length > 1) {
			setQuestions(questions.filter((_, i) => i !== index));
		}
	};

	const updateQuestion = (
		index: number,
		field: keyof QuizQuestion,
		value: any,
	) => {
		const updated = [...questions];
		updated[index] = { ...updated[index], [field]: value };
		setQuestions(updated);
	};

	const updateQuestionOption = (
		questionIndex: number,
		optionIndex: number,
		value: string,
	) => {
		const updated = [...questions];
		const options = [...(updated[questionIndex].options || ["", "", "", ""])];
		options[optionIndex] = value;
		updated[questionIndex] = { ...updated[questionIndex], options };
		setQuestions(updated);
	};

	const toggleCorrectAnswer = (questionIndex: number, optionIndex: number) => {
		const updated = [...questions];
		const correctAnswers = [...(updated[questionIndex].correctAnswers || [0])];

		if (correctAnswers.includes(optionIndex)) {
			const filtered = correctAnswers.filter((i) => i !== optionIndex);
			updated[questionIndex] = {
				...updated[questionIndex],
				correctAnswers: filtered.length > 0 ? filtered : [optionIndex],
			};
		} else {
			updated[questionIndex] = {
				...updated[questionIndex],
				correctAnswers: [...correctAnswers, optionIndex],
			};
		}
		setQuestions(updated);
	};

	const validateQuiz = (): string[] => {
		const errors: string[] = [];

		if (!quiz.title.trim()) errors.push("Quiz title is required");
		if (!quiz.description.trim()) errors.push("Quiz description is required");
		if (quiz.categories.length === 0)
			errors.push("At least one category is required");
		if (quiz.timeLimit < 5)
			errors.push("Time limit must be at least 5 minutes");

		questions.forEach((question, index) => {
			if (!question.questionText?.trim()) {
				errors.push(`Question ${index + 1}: Question text is required`);
			}
			if (question.options?.some((opt) => !opt.trim())) {
				errors.push(`Question ${index + 1}: All options must be filled`);
			}
			if (!question.correctAnswers?.length) {
				errors.push(
					`Question ${index + 1}: At least one correct answer is required`,
				);
			}
			if (!question.explanation?.trim()) {
				errors.push(`Question ${index + 1}: Explanation is required`);
			}
		});

		return errors;
	};

	const handleSubmit = async () => {
		setError("");
		const errors = validateQuiz();

		if (errors.length > 0) {
			setError(errors.join(", "));
			return;
		}

		setLoading(true);

		try {
			const response = await fetch("/api/quiz/create", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					...quiz,
					questions: questions.map((q, index) => ({
						...q,
						id: `q${index + 1}`,
						problemId: `generated-${Date.now()}-${index}`,
					})),
				}),
			});

			if (!response.ok) {
				throw new Error("Failed to create quiz");
			}

			const createdQuiz = await response.json();
			onQuizCreated?.(createdQuiz);
		} catch (err) {
			setError(err instanceof Error ? err.message : "Failed to create quiz");
		} finally {
			setLoading(false);
		}
	};

	const generateQuiz = async () => {
		if (quiz.categories.length === 0) {
			setError("Please select at least one category to generate a quiz");
			return;
		}

		setLoading(true);
		setError("");

		try {
			const response = await fetch("/api/quiz/generate", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					difficulty: quiz.difficulty,
					categories: quiz.categories,
					questionCount: Math.min(questions.length, 10),
					timeLimit: quiz.timeLimit,
				}),
			});

			if (!response.ok) {
				throw new Error("Failed to generate quiz");
			}

			const generatedQuiz = await response.json();
			setQuestions(generatedQuiz.questions);
		} catch (err) {
			setError(err instanceof Error ? err.message : "Failed to generate quiz");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="max-w-4xl mx-auto p-6 space-y-8">
			<div className="flex items-center justify-between">
				<h2 className="text-2xl font-bold text-gray-900">Create New Quiz</h2>
				<div className="flex gap-3">
					<button
						onClick={generateQuiz}
						disabled={loading}
						className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center gap-2"
					>
						<AcademicCapIcon className="w-4 h-4" />
						Generate Quiz
					</button>
					{onCancel && (
						<button
							onClick={onCancel}
							className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
						>
							Cancel
						</button>
					)}
				</div>
			</div>

			{error && (
				<div className="bg-red-50 border border-red-200 rounded-lg p-4">
					<div className="flex items-start">
						<ExclamationTriangleIcon className="w-5 h-5 text-red-400 mt-0.5 mr-3" />
						<p className="text-red-800 text-sm">{error}</p>
					</div>
				</div>
			)}

			{/* Quiz Settings */}
			<div className="bg-white p-6 rounded-lg shadow border">
				<h3 className="text-lg font-semibold mb-4">Quiz Settings</h3>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							Quiz Title
						</label>
						<input
							type="text"
							value={quiz.title}
							onChange={(e) => setQuiz({ ...quiz, title: e.target.value })}
							className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
							placeholder="Enter quiz title"
						/>
					</div>

					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							Difficulty
						</label>
						<select
							value={quiz.difficulty}
							onChange={(e) =>
								setQuiz({
									...quiz,
									difficulty: e.target.value as "Easy" | "Medium" | "Hard",
								})
							}
							className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
						>
							<option value="Easy">Easy</option>
							<option value="Medium">Medium</option>
							<option value="Hard">Hard</option>
						</select>
					</div>

					<div className="md:col-span-2">
						<label className="block text-sm font-medium text-gray-700 mb-2">
							Description
						</label>
						<textarea
							value={quiz.description}
							onChange={(e) =>
								setQuiz({ ...quiz, description: e.target.value })
							}
							rows={3}
							className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
							placeholder="Enter quiz description"
						/>
					</div>

					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							Time Limit (minutes)
						</label>
						<input
							type="number"
							value={quiz.timeLimit}
							onChange={(e) =>
								setQuiz({ ...quiz, timeLimit: parseInt(e.target.value) })
							}
							min="5"
							max="180"
							className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
						/>
					</div>

					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							Categories
						</label>
						<div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto p-2 border border-gray-300 rounded-lg">
							{categories.map((category) => (
								<label
									key={category}
									className="flex items-center gap-1 text-sm"
								>
									<input
										type="checkbox"
										checked={quiz.categories.includes(category)}
										onChange={(e) => {
											if (e.target.checked) {
												setQuiz({
													...quiz,
													categories: [...quiz.categories, category],
												});
											} else {
												setQuiz({
													...quiz,
													categories: quiz.categories.filter(
														(c) => c !== category,
													),
												});
											}
										}}
										className="rounded"
									/>
									{category}
								</label>
							))}
						</div>
					</div>
				</div>

				<div className="mt-4">
					<label className="flex items-center gap-2">
						<input
							type="checkbox"
							checked={quiz.isPublic}
							onChange={(e) => setQuiz({ ...quiz, isPublic: e.target.checked })}
							className="rounded"
						/>
						<span className="text-sm text-gray-700">Make this quiz public</span>
					</label>
				</div>
			</div>

			{/* Questions */}
			<div className="space-y-6">
				<div className="flex items-center justify-between">
					<h3 className="text-lg font-semibold">
						Questions ({questions.length})
					</h3>
					<button
						onClick={addQuestion}
						className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
					>
						<PlusIcon className="w-4 h-4" />
						Add Question
					</button>
				</div>

				{questions.map((question, questionIndex) => (
					<div
						key={questionIndex}
						className="bg-white p-6 rounded-lg shadow border"
					>
						<div className="flex items-center justify-between mb-4">
							<h4 className="text-md font-semibold">
								Question {questionIndex + 1}
							</h4>
							{questions.length > 1 && (
								<button
									onClick={() => removeQuestion(questionIndex)}
									className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
								>
									<XMarkIcon className="w-4 h-4" />
								</button>
							)}
						</div>

						<div className="space-y-4">
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">
									Question Text
								</label>
								<textarea
									value={question.questionText || ""}
									onChange={(e) =>
										updateQuestion(
											questionIndex,
											"questionText",
											e.target.value,
										)
									}
									rows={2}
									className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
									placeholder="Enter your question"
								/>
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">
									Options (check correct answers)
								</label>
								<div className="space-y-2">
									{question.options?.map((option, optionIndex) => (
										<div key={optionIndex} className="flex items-center gap-3">
											<input
												type="checkbox"
												checked={question.correctAnswers?.includes(optionIndex)}
												onChange={() =>
													toggleCorrectAnswer(questionIndex, optionIndex)
												}
												className="rounded text-green-600"
											/>
											<input
												type="text"
												value={option}
												onChange={(e) =>
													updateQuestionOption(
														questionIndex,
														optionIndex,
														e.target.value,
													)
												}
												className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
												placeholder={`Option ${optionIndex + 1}`}
											/>
										</div>
									))}
								</div>
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">
									Explanation
								</label>
								<textarea
									value={question.explanation || ""}
									onChange={(e) =>
										updateQuestion(questionIndex, "explanation", e.target.value)
									}
									rows={2}
									className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
									placeholder="Explain why the correct answer(s) are correct"
								/>
							</div>

							<div className="flex gap-4">
								<div className="flex-1">
									<label className="block text-sm font-medium text-gray-700 mb-2">
										Algorithms
									</label>
									<select
										multiple
										value={question.algorithms || []}
										onChange={(e) =>
											updateQuestion(
												questionIndex,
												"algorithms",
												Array.from(
													e.target.selectedOptions,
													(option) => option.value,
												),
											)
										}
										className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
										size={3}
									>
										{algorithms.map((alg) => (
											<option key={alg} value={alg}>
												{alg}
											</option>
										))}
									</select>
								</div>

								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">
										Time (min)
									</label>
									<input
										type="number"
										value={question.timeLimit || 5}
										onChange={(e) =>
											updateQuestion(
												questionIndex,
												"timeLimit",
												parseInt(e.target.value),
											)
										}
										min="1"
										max="30"
										className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
									/>
								</div>
							</div>
						</div>
					</div>
				))}
			</div>

			{/* Submit Button */}
			<div className="flex justify-center">
				<button
					onClick={handleSubmit}
					disabled={loading}
					className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2 text-lg font-semibold"
				>
					{loading ? (
						<>
							<LoadingSpinner size="sm" />
							Creating Quiz...
						</>
					) : (
						<>
							<CheckCircleIcon className="w-5 h-5" />
							Create Quiz
						</>
					)}
				</button>
			</div>
		</div>
	);
}
