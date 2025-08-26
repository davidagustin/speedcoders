"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import QuizCreator from "@/components/features/quiz/QuizCreator";
import { useToast } from "@/components/providers/ToastProvider";

export default function CreateQuizPage() {
	const [isLoading, setIsLoading] = useState(false);
	const router = useRouter();
	const { showToast } = useToast();

	const handleCreateQuiz = async (config: {
		problemCount: number;
		difficulty: string;
		category: string | null;
		timeLimit?: number;
		scoringMode: string;
		adaptiveDifficulty: boolean;
		includeHints: boolean;
		includeSolutions: boolean;
	}) => {
		setIsLoading(true);
		
		try {
			const response = await fetch("/api/quiz/generate", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(config),
			});

			if (response.ok) {
				const data = await response.json();
				showToast("Quiz created successfully!", "success");
				router.push(`/quiz/${data.quizId}`);
			} else {
				throw new Error("Failed to create quiz");
			}
		} catch (error) {
			showToast("Failed to create quiz. Please try again.", "error");
			console.error("Error creating quiz:", error);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="min-h-screen bg-gray-50">
			<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				<div className="mb-8">
					<h1 className="text-4xl font-bold text-gray-900 mb-2">✏️ Create Quiz</h1>
					<p className="text-gray-600 text-lg">Build a custom quiz tailored to your learning needs</p>
				</div>

				{/* Quick Options */}
				<div className="mb-8 bg-white rounded-lg shadow-sm p-6">
					<h2 className="text-xl font-semibold mb-4">🚀 Quick Start Options</h2>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
						<div className="p-4 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors cursor-pointer">
							<div className="flex items-center gap-3 mb-2">
								<span className="text-2xl">⚡</span>
								<h3 className="font-semibold">Speed Practice</h3>
							</div>
							<p className="text-sm text-gray-600 mb-3">
								Quick 15-minute session with 5 problems
							</p>
							<button
								onClick={() => handleCreateQuiz({
									problemCount: 5,
									difficulty: "Mixed",
									category: null,
									timeLimit: 15,
									scoringMode: "time-weighted",
									adaptiveDifficulty: false,
									includeHints: true,
									includeSolutions: true,
								})}
								disabled={isLoading}
								className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors text-sm"
							>
								Start Now
							</button>
						</div>

						<div className="p-4 border border-green-200 rounded-lg hover:bg-green-50 transition-colors cursor-pointer">
							<div className="flex items-center gap-3 mb-2">
								<span className="text-2xl">🎯</span>
								<h3 className="font-semibold">Focused Study</h3>
							</div>
							<p className="text-sm text-gray-600 mb-3">
								30-minute deep dive with 10 problems
							</p>
							<button
								onClick={() => handleCreateQuiz({
									problemCount: 10,
									difficulty: "Medium",
									category: null,
									timeLimit: 30,
									scoringMode: "standard",
									adaptiveDifficulty: true,
									includeHints: true,
									includeSolutions: true,
								})}
								disabled={isLoading}
								className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 transition-colors text-sm"
							>
								Start Now
							</button>
						</div>

						<div className="p-4 border border-purple-200 rounded-lg hover:bg-purple-50 transition-colors cursor-pointer">
							<div className="flex items-center gap-3 mb-2">
								<span className="text-2xl">🏆</span>
								<h3 className="font-semibold">Challenge Mode</h3>
							</div>
							<p className="text-sm text-gray-600 mb-3">
								60-minute intensive with 20 problems
							</p>
							<button
								onClick={() => handleCreateQuiz({
									problemCount: 20,
									difficulty: "Hard",
									category: null,
									timeLimit: 60,
									scoringMode: "competitive",
									adaptiveDifficulty: false,
									includeHints: false,
									includeSolutions: false,
								})}
								disabled={isLoading}
								className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-400 transition-colors text-sm"
							>
								Start Now
							</button>
						</div>
					</div>
				</div>

				{/* Custom Quiz Creator */}
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
					<div className="lg:col-span-2">
						<QuizCreator onCreateQuiz={handleCreateQuiz} isLoading={isLoading} />
					</div>
					
					{/* Tips and Info */}
					<div className="space-y-6">
						{/* Tips */}
						<div className="bg-white rounded-lg shadow-sm p-6">
							<h3 className="text-lg font-semibold mb-4">💡 Quiz Tips</h3>
							<div className="space-y-3 text-sm">
								<div className="flex items-start gap-2">
									<span className="text-blue-500 mt-1">•</span>
									<p>Start with Mixed difficulty to assess your level</p>
								</div>
								<div className="flex items-start gap-2">
									<span className="text-blue-500 mt-1">•</span>
									<p>Use adaptive difficulty for personalized learning</p>
								</div>
								<div className="flex items-start gap-2">
									<span className="text-blue-500 mt-1">•</span>
									<p>Enable hints if you're learning new concepts</p>
								</div>
								<div className="flex items-start gap-2">
									<span className="text-blue-500 mt-1">•</span>
									<p>Time limits help simulate interview conditions</p>
								</div>
							</div>
						</div>

						{/* Statistics */}
						<div className="bg-white rounded-lg shadow-sm p-6">
							<h3 className="text-lg font-semibold mb-4">📊 Your Stats</h3>
							<div className="space-y-3">
								<div className="flex justify-between">
									<span className="text-gray-600">Quizzes Completed</span>
									<span className="font-semibold">12</span>
								</div>
								<div className="flex justify-between">
									<span className="text-gray-600">Average Score</span>
									<span className="font-semibold">78%</span>
								</div>
								<div className="flex justify-between">
									<span className="text-gray-600">Best Category</span>
									<span className="font-semibold">Arrays</span>
								</div>
								<div className="flex justify-between">
									<span className="text-gray-600">Streak</span>
									<span className="font-semibold">5 days</span>
								</div>
							</div>
						</div>

						{/* Recent Activity */}
						<div className="bg-white rounded-lg shadow-sm p-6">
							<h3 className="text-lg font-semibold mb-4">📈 Recent Activity</h3>
							<div className="space-y-3 text-sm">
								<div className="flex items-center gap-2">
									<div className="w-2 h-2 bg-green-500 rounded-full"></div>
									<span className="text-gray-600">Completed "Arrays & Strings" - 85%</span>
								</div>
								<div className="flex items-center gap-2">
									<div className="w-2 h-2 bg-blue-500 rounded-full"></div>
									<span className="text-gray-600">Started "Tree Traversal" - In Progress</span>
								</div>
								<div className="flex items-center gap-2">
									<div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
									<span className="text-gray-600">Created custom "DP Practice" quiz</span>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}