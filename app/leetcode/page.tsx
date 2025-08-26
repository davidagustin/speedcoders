"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { useState, useEffect } from "react";

interface QuizAttempt {
	id: string;
	score: number;
	completed: boolean;
	started_at: string;
	quiz?: {
		title: string;
		difficulty: string;
	};
}

interface Quiz {
	id: string;
	title: string;
	difficulty: string;
	time_limit: number;
}

export default function LeetCodePage() {
	const { data: session } = useSession();
	const [availableQuizzes, setAvailableQuizzes] = useState<Quiz[]>([]);
	const [userProgress, setUserProgress] = useState<QuizAttempt[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		if (session) {
			fetchData();
		}
	}, [session]);

	const fetchData = async () => {
		try {
			// Fetch available quizzes
			const quizzesResponse = await fetch('/api/quiz/enhanced-start');
			if (quizzesResponse.ok) {
				const quizzesData = await quizzesResponse.json();
				setAvailableQuizzes(quizzesData.quizzes || []);
			}

			// Fetch user progress
			const progressResponse = await fetch('/api/analytics');
			if (progressResponse.ok) {
				const progressData = await progressResponse.json();
				setUserProgress(progressData.recentAttempts || []);
			}
		} catch (error) {
			console.error('Error fetching data:', error);
		} finally {
			setLoading(false);
		}
	};

	if (!session) {
		return (
			<div className="min-h-screen bg-gray-50 flex items-center justify-center">
				<div className="text-center">
					<h1 className="text-2xl font-bold text-gray-900 mb-4">
						Please sign in to access LeetCode practice
					</h1>
					<Link
						href="/auth/login"
						className="bg-blue-600 text-white px-6 py-2 rounded-lg cursor-pointer"
					>
						Sign In
					</Link>
				</div>
			</div>
		);
	}

	if (loading) {
		return (
			<div className="min-h-screen bg-gray-50 flex items-center justify-center">
				<div className="text-center">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
					<p className="text-gray-600">Loading...</p>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-50">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				{/* Header */}
				<div className="mb-8">
					<h1 className="text-3xl font-bold text-gray-900 mb-2">
						LeetCode Practice
					</h1>
					<p className="text-gray-600">
						Master algorithms and data structures with our enhanced quiz system
					</p>
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
					{/* Quiz Creator */}
					<div className="lg:col-span-1">
						<div className="bg-white rounded-lg shadow p-6">
							<h3 className="text-lg font-semibold mb-4">Quiz Creator</h3>
							<p className="text-gray-600">
								Quiz creation functionality coming soon!
							</p>
						</div>
					</div>

					{/* Recent Activity & Stats */}
					<div className="lg:col-span-2 space-y-6">
						{/* User Stats */}
						<div className="bg-white rounded-lg shadow-md p-6">
							<h2 className="text-xl font-semibold text-gray-900 mb-4">
								Your Progress
							</h2>
							<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
								<div className="text-center">
									<div className="text-2xl font-bold text-blue-600">
										{userProgress.length}
									</div>
									<div className="text-sm text-gray-600">Total Attempts</div>
								</div>
								<div className="text-center">
									<div className="text-2xl font-bold text-green-600">
										{userProgress.filter((attempt) => attempt.completed).length}
									</div>
									<div className="text-sm text-gray-600">Completed</div>
								</div>
								<div className="text-center">
									<div className="text-2xl font-bold text-purple-600">
										{userProgress.length > 0
											? Math.round(
													userProgress.reduce(
														(sum, attempt) => sum + attempt.score,
														0,
													) / userProgress.length,
												)
											: 0}
										%
									</div>
									<div className="text-sm text-gray-600">Average Score</div>
								</div>
							</div>
						</div>

						{/* Recent Attempts */}
						<div className="bg-white rounded-lg shadow-md p-6">
							<h2 className="text-xl font-semibold text-gray-900 mb-4">
								Recent Attempts
							</h2>
							{userProgress.length > 0 ? (
								<div className="space-y-3">
									{userProgress.slice(0, 5).map((attempt) => (
										<div
											key={attempt.id}
											className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
										>
											<div>
												<h3 className="font-medium text-gray-900">
													{attempt.quiz?.title || "Quiz"}
												</h3>
												<p className="text-sm text-gray-600">
													{new Date(attempt.started_at).toLocaleDateString()}
												</p>
											</div>
											<div className="text-right">
												<div className="font-semibold text-gray-900">
													{attempt.score}%
												</div>
												<div className="text-sm text-gray-600">
													{attempt.completed ? "Completed" : "In Progress"}
												</div>
											</div>
										</div>
									))}
								</div>
							) : (
								<p className="text-gray-600 text-center py-4">
									No attempts yet. Start your first quiz!
								</p>
							)}
						</div>

						{/* Available Quizzes */}
						<div className="bg-white rounded-lg shadow-md p-6">
							<h2 className="text-xl font-semibold text-gray-900 mb-4">
								Available Quizzes
							</h2>
							{availableQuizzes.length > 0 ? (
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									{availableQuizzes.slice(0, 4).map((quiz) => (
										<div
											key={quiz.id}
											className="border border-gray-200 rounded-lg p-4"
										>
											<h3 className="font-medium text-gray-900 mb-2">
												{quiz.title}
											</h3>
											<div className="flex items-center justify-between text-sm text-gray-600">
												<span
													className={`px-2 py-1 rounded-full text-xs font-medium ${
														quiz.difficulty === "Easy"
															? "bg-green-100 text-green-800"
															: quiz.difficulty === "Medium"
																? "bg-yellow-100 text-yellow-800"
																: "bg-red-100 text-red-800"
													}`}
												>
													{quiz.difficulty}
												</span>
												<span>{quiz.time_limit} min</span>
											</div>
											<Link
												href={`/quiz/${quiz.id}`}
												className="mt-3 inline-block bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors"
											>
												Start Quiz
											</Link>
										</div>
									))}
								</div>
							) : (
								<p className="text-gray-600 text-center py-4">
									No quizzes available. Create your own!
								</p>
							)}
						</div>
					</div>
				</div>

				{/* Features Section */}
				<div className="mt-12 bg-white rounded-lg shadow-md p-8">
					<h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
						Enhanced Features
					</h2>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
						<div className="text-center">
							<div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
								<svg
									className="w-6 h-6 text-blue-600"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
									/>
								</svg>
							</div>
							<h3 className="text-lg font-semibold text-gray-900 mb-2">
								Editorial System
							</h3>
							<p className="text-gray-600">
								Detailed explanations and multiple solution approaches for each
								problem
							</p>
						</div>
						<div className="text-center">
							<div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
								<svg
									className="w-6 h-6 text-green-600"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
									/>
								</svg>
							</div>
							<h3 className="text-lg font-semibold text-gray-900 mb-2">
								Progress Tracking
							</h3>
							<p className="text-gray-600">
								Track your performance and identify areas for improvement
							</p>
						</div>
						<div className="text-center">
							<div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
								<svg
									className="w-6 h-6 text-purple-600"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
									/>
								</svg>
							</div>
							<h3 className="text-lg font-semibold text-gray-900 mb-2">
								Learning Paths
							</h3>
							<p className="text-gray-600">
								Structured learning paths to master algorithms systematically
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
