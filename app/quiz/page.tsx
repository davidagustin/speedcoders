"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Quiz {
	id: number;
	title: string;
	description: string;
	difficulty: string;
	questionCount: number;
	timeLimit: number;
	category: string;
}

export default function QuizPage() {
	const router = useRouter();
	const [quizzes, setQuizzes] = useState<Quiz[]>([]);
	const [loading, setLoading] = useState(true);
	const [selectedDifficulty, setSelectedDifficulty] = useState("all");
	const [selectedCategory, setSelectedCategory] = useState("all");

	useEffect(() => {
		fetchQuizzes();
	}, []);

	const fetchQuizzes = async () => {
		try {
			const response = await fetch("/api/quiz");
			if (response.ok) {
				const data = await response.json();
				setQuizzes(data.quizzes || []);
			}
		} catch (error) {
			console.error("Error fetching quizzes:", error);
		} finally {
			setLoading(false);
		}
	};

	const startQuiz = (quizId: number) => {
		router.push(`/quiz/${quizId}`);
	};

	const filteredQuizzes = quizzes.filter(quiz => {
		const difficultyMatch = selectedDifficulty === "all" || quiz.difficulty === selectedDifficulty;
		const categoryMatch = selectedCategory === "all" || quiz.category === selectedCategory;
		return difficultyMatch && categoryMatch;
	});

	const categories = Array.from(new Set(quizzes.map(q => q.category)));
	const difficulties = ["Easy", "Medium", "Hard"];

	return (
		<div className="min-h-screen bg-gray-50">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				<div className="mb-8">
					<h1 className="text-3xl font-bold text-gray-900 mb-2">Coding Quizzes</h1>
					<p className="text-gray-600">Test your programming knowledge with our interactive quizzes</p>
				</div>

				{/* Action Buttons */}
				<div className="mb-6 flex gap-4">
					<Link
						href="/quiz/create"
						className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
					>
						Create New Quiz
					</Link>
					<button
						onClick={() => router.push("/quiz/enhanced")}
						className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
					>
						Quick Practice
					</button>
				</div>

				{/* Filters */}
				<div className="bg-white rounded-lg shadow p-4 mb-6">
					<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">
								Difficulty
							</label>
							<select
								value={selectedDifficulty}
								onChange={(e) => setSelectedDifficulty(e.target.value)}
								className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
							>
								<option value="all">All Difficulties</option>
								{difficulties.map(diff => (
									<option key={diff} value={diff}>{diff}</option>
								))}
							</select>
						</div>
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">
								Category
							</label>
							<select
								value={selectedCategory}
								onChange={(e) => setSelectedCategory(e.target.value)}
								className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
							>
								<option value="all">All Categories</option>
								{categories.map(cat => (
									<option key={cat} value={cat}>{cat}</option>
								))}
							</select>
						</div>
						<div className="flex items-end">
							<button
								onClick={() => {
									setSelectedDifficulty("all");
									setSelectedCategory("all");
								}}
								className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
							>
								Clear Filters
							</button>
						</div>
					</div>
				</div>

				{/* Quiz List */}
				{loading ? (
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{[...Array(6)].map((_, i) => (
							<div key={i} className="bg-white rounded-lg shadow p-6 animate-pulse">
								<div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
								<div className="h-3 bg-gray-200 rounded w-full mb-4"></div>
								<div className="h-3 bg-gray-200 rounded w-1/2"></div>
							</div>
						))}
					</div>
				) : filteredQuizzes.length === 0 ? (
					<div className="text-center py-12 bg-white rounded-lg shadow">
						<svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
						</svg>
						<h3 className="text-lg font-medium text-gray-900 mb-2">No quizzes available</h3>
						<p className="text-gray-600 mb-4">Create your first quiz or try adjusting the filters</p>
						<Link
							href="/quiz/create"
							className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
						>
							Create Quiz
						</Link>
					</div>
				) : (
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{filteredQuizzes.map((quiz) => (
							<div key={quiz.id} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
								<div className="p-6">
									<div className="flex justify-between items-start mb-3">
										<h3 className="text-lg font-semibold text-gray-900">
											{quiz.title}
										</h3>
										<span className={`px-2 py-1 text-xs font-medium rounded-full ${
											quiz.difficulty === "Easy" ? "bg-green-100 text-green-800" :
											quiz.difficulty === "Medium" ? "bg-yellow-100 text-yellow-800" :
											"bg-red-100 text-red-800"
										}`}>
											{quiz.difficulty}
										</span>
									</div>
									<p className="text-gray-600 text-sm mb-4 line-clamp-2">
										{quiz.description}
									</p>
									<div className="flex items-center justify-between text-sm text-gray-500 mb-4">
										<span className="flex items-center">
											<svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
											</svg>
											{quiz.timeLimit} mins
										</span>
										<span className="flex items-center">
											<svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
											</svg>
											{quiz.questionCount} questions
										</span>
									</div>
									<div className="flex items-center justify-between">
										<span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
											{quiz.category}
										</span>
										<button
											onClick={() => startQuiz(quiz.id)}
											className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
										>
											Start Quiz
										</button>
									</div>
								</div>
							</div>
						))}
					</div>
				)}

				{/* Default Quizzes for Demo */}
				{!loading && quizzes.length === 0 && (
					<div className="mt-8">
						<h2 className="text-xl font-bold text-gray-900 mb-4">Sample Quizzes</h2>
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
							{[
								{ id: 1, title: "Arrays & Strings", difficulty: "Easy", category: "Data Structures", timeLimit: 30, questionCount: 10, description: "Test your knowledge of array and string manipulation techniques" },
								{ id: 2, title: "Dynamic Programming", difficulty: "Hard", category: "Algorithms", timeLimit: 45, questionCount: 15, description: "Challenge yourself with dynamic programming problems" },
								{ id: 3, title: "Tree Traversal", difficulty: "Medium", category: "Data Structures", timeLimit: 35, questionCount: 12, description: "Master different tree traversal algorithms" },
								{ id: 4, title: "Graph Algorithms", difficulty: "Hard", category: "Algorithms", timeLimit: 50, questionCount: 20, description: "Explore BFS, DFS, and shortest path algorithms" },
								{ id: 5, title: "Sorting & Searching", difficulty: "Easy", category: "Algorithms", timeLimit: 25, questionCount: 8, description: "Practice fundamental sorting and searching techniques" },
								{ id: 6, title: "System Design Basics", difficulty: "Medium", category: "System Design", timeLimit: 40, questionCount: 10, description: "Learn the fundamentals of system design" }
							].map((quiz) => (
								<div key={quiz.id} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
									<div className="p-6">
										<div className="flex justify-between items-start mb-3">
											<h3 className="text-lg font-semibold text-gray-900">
												{quiz.title}
											</h3>
											<span className={`px-2 py-1 text-xs font-medium rounded-full ${
												quiz.difficulty === "Easy" ? "bg-green-100 text-green-800" :
												quiz.difficulty === "Medium" ? "bg-yellow-100 text-yellow-800" :
												"bg-red-100 text-red-800"
											}`}>
												{quiz.difficulty}
											</span>
										</div>
										<p className="text-gray-600 text-sm mb-4 line-clamp-2">
											{quiz.description}
										</p>
										<div className="flex items-center justify-between text-sm text-gray-500 mb-4">
											<span className="flex items-center">
												<svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
													<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
												</svg>
												{quiz.timeLimit} mins
											</span>
											<span className="flex items-center">
												<svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
													<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
												</svg>
												{quiz.questionCount} questions
											</span>
										</div>
										<div className="flex items-center justify-between">
											<span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
												{quiz.category}
											</span>
											<button
												onClick={() => startQuiz(quiz.id)}
												className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
											>
												Start Quiz
											</button>
										</div>
									</div>
								</div>
							))}
						</div>
					</div>
				)}
			</div>
		</div>
	);
}