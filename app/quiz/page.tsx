"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import QuizTemplates from "@/app/components/QuizTemplates";
import QuizAnalytics from "@/app/components/QuizAnalytics";
import { apiClient } from "@/utils/api/client";

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
	const [activeTab, setActiveTab] = useState('browse');

	useEffect(() => {
		fetchQuizzes();
	}, []);

	const fetchQuizzes = async () => {
		try {
			const response = await apiClient.getQuizzes();
			if (response.success) {
				setQuizzes(response.data?.quizzes || []);
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
					<h1 className="text-4xl font-bold text-gray-900 mb-2">🧪 Quiz Center</h1>
					<p className="text-gray-600 text-lg">Test and improve your programming knowledge with our comprehensive quiz system</p>
				</div>

				{/* Navigation Tabs */}
				<div className="mb-8">
					<div className="border-b border-gray-200">
						<nav className="-mb-px flex space-x-8">
							{[
								{ id: 'browse', label: 'Browse Quizzes', icon: '📚' },
								{ id: 'templates', label: 'Templates', icon: '🧪' },
								{ id: 'analytics', label: 'My Analytics', icon: '📊' },
								{ id: 'create', label: 'Create Quiz', icon: '✏️' },
							].map((tab) => (
								<button
									key={tab.id}
									onClick={() => setActiveTab(tab.id)}
									className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
										activeTab === tab.id
											? 'border-blue-500 text-blue-600'
											: 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
									}`}
								>
									<span className="mr-2">{tab.icon}</span>
									{tab.label}
								</button>
							))}
						</nav>
					</div>
				</div>

				{/* Tab Content */}
				{activeTab === 'browse' && (
					<div className="space-y-6">
						{/* Overview Cards */}
						<div className="grid grid-cols-1 md:grid-cols-4 gap-6">
							<div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white">
								<div className="text-3xl font-bold">250+</div>
								<div className="text-blue-100">Total Quizzes</div>
								<div className="text-xs text-blue-200 mt-2">Community & Official</div>
							</div>
							<div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white">
								<div className="text-3xl font-bold">15</div>
								<div className="text-green-100">Categories</div>
								<div className="text-xs text-green-200 mt-2">All skill levels</div>
							</div>
							<div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-6 text-white">
								<div className="text-3xl font-bold">50K+</div>
								<div className="text-purple-100">Attempts</div>
								<div className="text-xs text-purple-200 mt-2">By learners worldwide</div>
							</div>
							<div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg p-6 text-white">
								<div className="text-3xl font-bold">4.8★</div>
								<div className="text-orange-100">Avg Rating</div>
								<div className="text-xs text-orange-200 mt-2">High quality content</div>
							</div>
						</div>

						{/* Action Buttons */}
						<div className="bg-white rounded-lg shadow-sm p-6">
							<div className="flex flex-wrap gap-4 mb-6">
								<Link
									href="/quiz/create"
									className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-colors font-medium"
								>
									✏️ Create New Quiz
								</Link>
								<button
									onClick={() => router.push("/quiz/enhanced")}
									className="px-6 py-3 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-lg hover:from-green-700 hover:to-teal-700 transition-colors font-medium"
								>
									⚡ Quick Practice
								</button>
								<button className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-colors font-medium">
									🎯 Smart Recommendations
								</button>
								<button className="px-6 py-3 bg-gradient-to-r from-yellow-600 to-orange-600 text-white rounded-lg hover:from-yellow-700 hover:to-orange-700 transition-colors font-medium">
									🏆 Daily Challenge
								</button>
							</div>

							{/* Featured Quiz of the Day */}
							<div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-6 border border-indigo-200">
								<div className="flex items-center gap-2 mb-2">
									<span className="text-2xl">🌟</span>
									<h3 className="text-lg font-bold text-gray-900">Quiz of the Day</h3>
									<span className="px-2 py-1 bg-indigo-100 text-indigo-800 text-xs rounded-full font-medium">FEATURED</span>
								</div>
								<h4 className="font-semibold text-gray-800 mb-2">Advanced Graph Algorithms</h4>
								<p className="text-gray-600 text-sm mb-4">
									Test your knowledge of Dijkstra's algorithm, MST, and advanced graph traversal techniques.
									Perfect for preparing for technical interviews at top tech companies.
								</p>
								<div className="flex items-center justify-between">
									<div className="flex items-center gap-4 text-sm text-gray-500">
										<span>⏱️ 45 mins</span>
										<span>📝 20 questions</span>
										<span className="px-2 py-1 bg-red-100 text-red-800 rounded text-xs">Hard</span>
									</div>
									<button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium">
										Start Now
									</button>
								</div>
							</div>
						</div>

						{/* Filters */}
						<div className="bg-white rounded-lg shadow-sm p-6">
							<h3 className="text-lg font-semibold mb-4">🔍 Find Your Perfect Quiz</h3>
							<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1">
										Duration
									</label>
									<select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
										<option value="all">Any Duration</option>
										<option value="short">Under 30 mins</option>
										<option value="medium">30-60 mins</option>
										<option value="long">Over 60 mins</option>
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
								<div className="text-6xl mb-4">🎯</div>
								<h3 className="text-lg font-medium text-gray-900 mb-2">No quizzes found</h3>
								<p className="text-gray-600 mb-4">Try adjusting your filters or create your own quiz</p>
								<Link
									href="/quiz/create"
									className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
								>
									Create Your First Quiz
								</Link>
							</div>
						) : (
							<div className="bg-white rounded-lg shadow-sm p-6">
								<h3 className="text-lg font-semibold mb-4">📝 Available Quizzes</h3>
								<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
									{/* Sample default quizzes with enhanced design */}
									{[
										{ 
											id: 1, 
											title: "Arrays & Strings Mastery", 
											difficulty: "Easy", 
											category: "Data Structures", 
											timeLimit: 30, 
											questionCount: 15, 
											description: "Master array manipulation, string operations, and fundamental data structure concepts",
											rating: 4.8,
											attempts: 1250,
											successRate: 78
										},
										{ 
											id: 2, 
											title: "Dynamic Programming Deep Dive", 
											difficulty: "Hard", 
											category: "Algorithms", 
											timeLimit: 60, 
											questionCount: 25, 
											description: "Challenge yourself with complex DP problems from memoization to advanced state transitions",
											rating: 4.6,
											attempts: 850,
											successRate: 45
										},
										{ 
											id: 3, 
											title: "Tree & Graph Traversals", 
											difficulty: "Medium", 
											category: "Data Structures", 
											timeLimit: 45, 
											questionCount: 20, 
											description: "Master BFS, DFS, and advanced tree/graph algorithms with real-world applications",
											rating: 4.9,
											attempts: 950,
											successRate: 62
										},
										{ 
											id: 4, 
											title: "System Design Fundamentals", 
											difficulty: "Medium", 
											category: "System Design", 
											timeLimit: 50, 
											questionCount: 18, 
											description: "Learn scalability, load balancing, database design, and distributed systems concepts",
											rating: 4.7,
											attempts: 720,
											successRate: 68
										},
										{ 
											id: 5, 
											title: "FAANG Interview Prep", 
											difficulty: "Hard", 
											category: "Interview Prep", 
											timeLimit: 90, 
											questionCount: 30, 
											description: "Comprehensive preparation for technical interviews at top tech companies",
											rating: 4.8,
											attempts: 1500,
											successRate: 52
										},
										{ 
											id: 6, 
											title: "Binary Search Patterns", 
											difficulty: "Medium", 
											category: "Algorithms", 
											timeLimit: 35, 
											questionCount: 12, 
											description: "Master binary search variations and learn to identify search patterns",
											rating: 4.5,
											attempts: 680,
											successRate: 71
										}
									].map((quiz) => (
										<div key={quiz.id} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300 hover:scale-105">
											<div className="flex justify-between items-start mb-3">
												<h4 className="text-lg font-semibold text-gray-900 line-clamp-2">
													{quiz.title}
												</h4>
												<span className={`px-3 py-1 text-xs font-medium rounded-full ${
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
											<div className="flex items-center justify-between text-sm text-gray-500 mb-3">
												<span className="flex items-center">
													⏱️ {quiz.timeLimit} mins
												</span>
												<span className="flex items-center">
													📝 {quiz.questionCount} questions
												</span>
											</div>
											<div className="flex items-center justify-between text-xs text-gray-500 mb-4">
												<span>⭐ {quiz.rating} • {quiz.attempts} attempts</span>
												<span className="text-green-600 font-medium">{quiz.successRate}% success</span>
											</div>
											<div className="flex items-center justify-between">
												<span className="text-xs bg-gray-100 text-gray-700 px-3 py-1 rounded-full">
													{quiz.category}
												</span>
												<button
													onClick={() => startQuiz(quiz.id)}
													className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-medium rounded-lg hover:from-blue-700 hover:to-purple-700 transition-colors"
												>
													Start Quiz
												</button>
											</div>
										</div>
									))}
								</div>
							</div>
						)}
					</div>
				)}

				{activeTab === 'templates' && <QuizTemplates />}
				{activeTab === 'analytics' && <QuizAnalytics />}
				
				{activeTab === 'create' && (
					<div className="bg-white rounded-lg shadow-sm p-8">
						<h2 className="text-2xl font-bold mb-6">✏️ Create Your Own Quiz</h2>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
							<div>
								<h3 className="text-lg font-semibold mb-4">Quick Start Options</h3>
								<div className="space-y-4">
									<Link href="/quiz/create" className="block p-4 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors">
										<div className="flex items-center gap-3">
											<div className="text-2xl">🚀</div>
											<div>
												<div className="font-medium">Start from Scratch</div>
												<div className="text-sm text-gray-600">Build your quiz from the ground up</div>
											</div>
										</div>
									</Link>
									<div className="block p-4 border border-green-200 rounded-lg hover:bg-green-50 transition-colors cursor-pointer">
										<div className="flex items-center gap-3">
											<div className="text-2xl">📋</div>
											<div>
												<div className="font-medium">Use Template</div>
												<div className="text-sm text-gray-600">Start with a pre-built structure</div>
											</div>
										</div>
									</div>
									<div className="block p-4 border border-purple-200 rounded-lg hover:bg-purple-50 transition-colors cursor-pointer">
										<div className="flex items-center gap-3">
											<div className="text-2xl">🤖</div>
											<div>
												<div className="font-medium">AI-Generated Quiz</div>
												<div className="text-sm text-gray-600">Let AI create questions for you</div>
											</div>
										</div>
									</div>
								</div>
							</div>
							<div>
								<h3 className="text-lg font-semibold mb-4">Popular Quiz Types</h3>
								<div className="grid grid-cols-2 gap-3">
									{[
										{ name: 'Multiple Choice', icon: '☑️', color: 'bg-blue-50 text-blue-700' },
										{ name: 'Coding Problems', icon: '💻', color: 'bg-green-50 text-green-700' },
										{ name: 'True/False', icon: '✅', color: 'bg-yellow-50 text-yellow-700' },
										{ name: 'Fill in the Blank', icon: '📝', color: 'bg-purple-50 text-purple-700' },
										{ name: 'Drag & Drop', icon: '🔄', color: 'bg-pink-50 text-pink-700' },
										{ name: 'Scenario Based', icon: '🎭', color: 'bg-indigo-50 text-indigo-700' },
									].map(type => (
										<div key={type.name} className={`p-3 rounded-lg ${type.color} text-center cursor-pointer hover:scale-105 transition-transform`}>
											<div className="text-xl mb-1">{type.icon}</div>
											<div className="text-xs font-medium">{type.name}</div>
										</div>
									))}
								</div>
							</div>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}