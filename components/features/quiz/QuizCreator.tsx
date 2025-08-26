"use client";

import { useState } from "react";

interface QuizCreatorProps {
	onCreateQuiz: (config: {
		problemCount: number;
		difficulty: string;
		category: string | null;
		timeLimit?: number;
		scoringMode: string;
		adaptiveDifficulty: boolean;
		includeHints: boolean;
		includeSolutions: boolean;
	}) => void;
	isLoading: boolean;
}

const algorithmCategories = [
	"Array",
	"String",
	"Hash Table",
	"Dynamic Programming",
	"Math",
	"Sorting",
	"Greedy",
	"Depth-First Search",
	"Binary Search",
	"Tree",
	"Breadth-First Search",
	"Two Pointers",
	"Stack",
	"Backtracking",
	"Heap",
	"Bit Manipulation",
	"Graph",
	"Design",
	"Linked List",
	"Recursion",
	"Sliding Window",
	"Divide and Conquer",
	"Trie",
	"Binary Tree",
	"Monotonic Stack",
	"Topological Sort",
	"Quick Select",
	"Bucket Sort",
	"Minimum Spanning Tree",
	"Counting",
	"Binary Search Tree",
	"XOR",
	"Kadane's Algorithm",
	"Floyd's Cycle Detection",
	"Morris Traversal",
	"Expand Around Center",
	"Brute Force",
	"Iteration",
	"Memoization",
];

export default function QuizCreator({
	onCreateQuiz,
	isLoading,
}: QuizCreatorProps) {
	const [problemCount, setProblemCount] = useState(10);
	const [difficulty, setDifficulty] = useState("Mixed");
	const [category, setCategory] = useState<string | null>(null);
	const [timeLimit, setTimeLimit] = useState(0); // 0 = no time limit
	const [scoringMode, setScoringMode] = useState("standard");
	const [adaptiveDifficulty, setAdaptiveDifficulty] = useState(false);
	const [includeHints, setIncludeHints] = useState(true);
	const [includeSolutions, setIncludeSolutions] = useState(false);

	const handleCreateQuiz = () => {
		onCreateQuiz({
			problemCount,
			difficulty,
			category,
			timeLimit: timeLimit > 0 ? timeLimit : undefined,
			scoringMode,
			adaptiveDifficulty,
			includeHints,
			includeSolutions,
		});
	};

	const getEstimatedTime = () => {
		const timePerProblem = {
			Easy: 15,
			Medium: 30,
			Hard: 45,
			Mixed: 25,
		};
		return Math.ceil(
			(problemCount *
				timePerProblem[difficulty as keyof typeof timePerProblem]) /
				60,
		);
	};

	return (
		<div className="bg-white rounded-lg shadow-md p-6">
			<h2 className="text-xl font-semibold text-gray-900 mb-6">
				Create New Quiz
			</h2>

			{/* Problem Count */}
			<div className="mb-6">
				<label className="block text-sm font-medium text-gray-700 mb-2">
					Number of Problems
				</label>
				<select
					value={problemCount}
					onChange={(e) => setProblemCount(Number(e.target.value))}
					className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
				>
					<option value={5}>5 Problems</option>
					<option value={10}>10 Problems</option>
					<option value={15}>15 Problems</option>
					<option value={20}>20 Problems</option>
					<option value={25}>25 Problems</option>
				</select>
			</div>

			{/* Difficulty */}
			<div className="mb-6">
				<label className="block text-sm font-medium text-gray-700 mb-2">
					Difficulty Level
				</label>
				<select
					value={difficulty}
					onChange={(e) => setDifficulty(e.target.value)}
					className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
				>
					<option value="Mixed">Mixed Difficulty</option>
					<option value="Easy">Easy Only</option>
					<option value="Medium">Medium Only</option>
					<option value="Hard">Hard Only</option>
				</select>
			</div>

			{/* Category */}
			<div className="mb-6">
				<label className="block text-sm font-medium text-gray-700 mb-2">
					Algorithm Category (Optional)
				</label>
				<select
					value={category || ""}
					onChange={(e) => setCategory(e.target.value || null)}
					className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
				>
					<option value="">All Categories</option>
					{algorithmCategories.map((cat) => (
						<option key={cat} value={cat}>
							{cat}
						</option>
					))}
				</select>
			</div>

			{/* Time Limit */}
			<div className="mb-6">
				<label className="block text-sm font-medium text-gray-700 mb-2">
					Time Limit (Optional)
				</label>
				<select
					value={timeLimit}
					onChange={(e) => setTimeLimit(Number(e.target.value))}
					className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
				>
					<option value={0}>No Time Limit</option>
					<option value={15}>15 minutes</option>
					<option value={30}>30 minutes</option>
					<option value={45}>45 minutes</option>
					<option value={60}>60 minutes</option>
					<option value={90}>90 minutes</option>
				</select>
			</div>

			{/* Scoring Mode */}
			<div className="mb-6">
				<label className="block text-sm font-medium text-gray-700 mb-2">
					Scoring Mode
				</label>
				<select
					value={scoringMode}
					onChange={(e) => setScoringMode(e.target.value)}
					className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
				>
					<option value="standard">Standard (Accuracy based)</option>
					<option value="time-weighted">Time Weighted (Speed bonus)</option>
					<option value="competitive">Competitive (Contest style)</option>
					<option value="learning">Learning Mode (Hints encouraged)</option>
				</select>
			</div>

			{/* Advanced Options */}
			<div className="mb-6">
				<h3 className="text-sm font-medium text-gray-700 mb-3">
					Advanced Options
				</h3>
				<div className="space-y-3">
					<label className="flex items-center">
						<input
							type="checkbox"
							checked={adaptiveDifficulty}
							onChange={(e) => setAdaptiveDifficulty(e.target.checked)}
							className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
						/>
						<span className="ml-2 text-sm text-gray-700">
							Adaptive Difficulty (Adjust based on performance)
						</span>
					</label>

					<label className="flex items-center">
						<input
							type="checkbox"
							checked={includeHints}
							onChange={(e) => setIncludeHints(e.target.checked)}
							className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
						/>
						<span className="ml-2 text-sm text-gray-700">Include Hints</span>
					</label>

					<label className="flex items-center">
						<input
							type="checkbox"
							checked={includeSolutions}
							onChange={(e) => setIncludeSolutions(e.target.checked)}
							className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
						/>
						<span className="ml-2 text-sm text-gray-700">
							Include Solutions (After completion)
						</span>
					</label>
				</div>
			</div>

			{/* Time Estimate */}
			<div className="mb-6 p-4 bg-blue-50 rounded-lg">
				<div className="flex items-center justify-between">
					<span className="text-sm font-medium text-blue-900">
						Estimated Time:
					</span>
					<span className="text-lg font-semibold text-blue-700">
						{getEstimatedTime()} minutes
					</span>
				</div>
			</div>

			{/* Create Button */}
			<button
				onClick={handleCreateQuiz}
				disabled={isLoading}
				className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
			>
				{isLoading ? "Creating Quiz..." : "Create Quiz"}
			</button>

			{/* Quick Start Options */}
			<div className="mt-6 pt-6 border-t border-gray-200">
				<h3 className="text-sm font-medium text-gray-900 mb-3">Quick Start</h3>
				<div className="grid grid-cols-2 gap-2">
					<button
						onClick={() =>
							onCreateQuiz({
								problemCount: 5,
								difficulty: "Easy",
								category: null,
								timeLimit: 25,
								scoringMode: "standard",
								adaptiveDifficulty: false,
								includeHints: true,
								includeSolutions: true,
							})
						}
						className="text-sm bg-green-100 text-green-700 py-2 px-3 rounded hover:bg-green-200 transition-colors"
					>
						Easy Practice (5)
					</button>
					<button
						onClick={() =>
							onCreateQuiz({
								problemCount: 10,
								difficulty: "Mixed",
								category: null,
								timeLimit: 30,
								scoringMode: "standard",
								adaptiveDifficulty: true,
								includeHints: false,
								includeSolutions: false,
							})
						}
						className="text-sm bg-yellow-100 text-yellow-700 py-2 px-3 rounded hover:bg-yellow-200 transition-colors"
					>
						Mixed Challenge (10)
					</button>
					<button
						onClick={() =>
							onCreateQuiz({
								problemCount: 15,
								difficulty: "Medium",
								category: null,
								timeLimit: 45,
								scoringMode: "time-weighted",
								adaptiveDifficulty: false,
								includeHints: false,
								includeSolutions: false,
							})
						}
						className="text-sm bg-orange-100 text-orange-700 py-2 px-3 rounded hover:bg-orange-200 transition-colors"
					>
						Medium Focus (15)
					</button>
					<button
						onClick={() =>
							onCreateQuiz({
								problemCount: 20,
								difficulty: "Mixed",
								category: null,
								timeLimit: 60,
								scoringMode: "competitive",
								adaptiveDifficulty: true,
								includeHints: false,
								includeSolutions: false,
							})
						}
						className="text-sm bg-red-100 text-red-700 py-2 px-3 rounded hover:bg-red-200 transition-colors"
					>
						Full Challenge (20)
					</button>
				</div>
			</div>
		</div>
	);
}
