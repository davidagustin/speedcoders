"use client";

import {
	ArrowLeftIcon,
	CheckIcon,
	ClockIcon,
	PlayIcon,
	PuzzlePieceIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { problems } from "@/lib/data/problems";

export default function CreateQuizPage() {
	const { data: session } = useSession();
	const router = useRouter();
	const [selectedProblems, setSelectedProblems] = useState<string[]>([]);
	const [timeLimit, setTimeLimit] = useState(30);
	const [difficulty, setDifficulty] = useState<
		"all" | "Easy" | "Medium" | "Hard"
	>("all");
	const [algorithm, setAlgorithm] = useState<string>("all");

	if (!session) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="text-center">
					<h1 className="text-2xl font-bold text-gray-900 mb-4">
						Please sign in to create a quiz
					</h1>
					<Link
						href="/auth/login"
						className="bg-blue-600 text-white px-6 py-2 rounded-lg"
					>
						Sign In
					</Link>
				</div>
			</div>
		);
	}

	const algorithmOptions = [
		"Two Pointers",
		"Sliding Window",
		"Hash Table",
		"Prefix Sum",
		"Binary Search",
		"Sorting",
		"Greedy",
		"Dynamic Programming",
		"Backtracking",
		"Tree Traversal",
		"Graph Traversal",
		"Union Find",
		"Topological Sort",
		"Trie",
		"Segment Tree",
		"Binary Indexed Tree",
		"Stack",
		"Queue",
		"Linked List",
		"Heap",
	];

	const filteredProblems = problems.filter((problem) => {
		const matchesDifficulty =
			difficulty === "all" || problem.difficulty === difficulty;
		const matchesAlgorithm =
			algorithm === "all" || problem.algorithms.includes(algorithm);
		return matchesDifficulty && matchesAlgorithm;
	});

	const handleProblemToggle = (problemId: string) => {
		setSelectedProblems((prev) =>
			prev.includes(problemId)
				? prev.filter((id) => id !== problemId)
				: [...prev, problemId],
		);
	};

	const handleStartQuiz = async () => {
		if (selectedProblems.length === 0) {
			alert("Please select at least one problem");
			return;
		}

		try {
			const response = await fetch("/api/quiz/create", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					problemIds: selectedProblems,
					timeLimit,
					userId: (session.user as any)?.id || session.user?.email,
				}),
			});

			if (response.ok) {
				const quiz = await response.json();
				router.push(`/quiz/${quiz.id}`);
			} else {
				alert("Failed to create quiz. Please try again.");
			}
		} catch (error) {
			console.error("Error creating quiz:", error);
			alert("Failed to create quiz. Please try again.");
		}
	};

	const handleQuickStart = (type: string) => {
		let quickProblems: string[] = [];

		if (type === "random") {
			const shuffled = [...filteredProblems].sort(() => 0.5 - Math.random());
			quickProblems = shuffled.slice(0, 5).map((p) => String(p.id));
		} else if (type === "easy") {
			const easyProblems = problems.filter((p: any) => p.difficulty === "Easy");
			const shuffled = [...easyProblems].sort(() => 0.5 - Math.random());
			quickProblems = shuffled.slice(0, 5).map((p) => String(p.id));
		} else if (type === "medium") {
			const mediumProblems = problems.filter(
				(p: any) => p.difficulty === "Medium",
			);
			const shuffled = [...mediumProblems].sort(() => 0.5 - Math.random());
			quickProblems = shuffled.slice(0, 5).map((p) => String(p.id));
		}

		setSelectedProblems(quickProblems);
	};

	return (
		<div className="min-h-screen bg-gray-50">
			{/* Header */}
			<div className="bg-white border-b">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
					<div className="flex items-center justify-between">
						<div className="flex items-center space-x-4">
							<Link
								href="/dashboard"
								className="inline-flex items-center text-gray-600 hover:text-gray-900"
							>
								<ArrowLeftIcon className="h-5 w-5 mr-2" />
								Back to Dashboard
							</Link>
							<div>
								<h1 className="text-2xl font-bold text-gray-900">
									Create Quiz
								</h1>
								<p className="text-gray-600 mt-1">
									Select problems and customize your coding challenge
								</p>
							</div>
						</div>
						<button
							onClick={handleStartQuiz}
							disabled={selectedProblems.length === 0}
							className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
						>
							<PlayIcon className="mr-2 h-5 w-5" />
							Start Quiz ({selectedProblems.length})
						</button>
					</div>
				</div>
			</div>

			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				<div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
					{/* Filters Sidebar */}
					<div className="lg:col-span-1">
						<div className="bg-white rounded-lg shadow-sm p-6">
							<h3 className="text-lg font-semibold text-gray-900 mb-4">
								Quiz Settings
							</h3>

							{/* Time Limit */}
							<div className="mb-6">
								<label className="block text-sm font-medium text-gray-700 mb-2">
									Time Limit (minutes)
								</label>
								<select
									value={timeLimit}
									onChange={(e) => setTimeLimit(Number(e.target.value))}
									className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
								>
									<option value={15}>15 minutes</option>
									<option value={30}>30 minutes</option>
									<option value={45}>45 minutes</option>
									<option value={60}>60 minutes</option>
									<option value={90}>90 minutes</option>
								</select>
							</div>

							{/* Difficulty Filter */}
							<div className="mb-6">
								<label className="block text-sm font-medium text-gray-700 mb-2">
									Difficulty
								</label>
								<select
									value={difficulty}
									onChange={(e) => setDifficulty(e.target.value as any)}
									className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
								>
									<option value="all">All Difficulties</option>
									<option value="Easy">Easy</option>
									<option value="Medium">Medium</option>
									<option value="Hard">Hard</option>
								</select>
							</div>

							{/* Algorithm Filter */}
							<div className="mb-6">
								<label className="block text-sm font-medium text-gray-700 mb-2">
									Algorithm Type
								</label>
								<select
									value={algorithm}
									onChange={(e) => setAlgorithm(e.target.value)}
									className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
								>
									<option value="all">All Algorithms</option>
									{algorithmOptions.map((algo) => (
										<option key={algo} value={algo}>
											{algo}
										</option>
									))}
								</select>
							</div>

							{/* Quick Start Options */}
							<div>
								<h4 className="text-sm font-medium text-gray-700 mb-3">
									Quick Start
								</h4>
								<div className="space-y-2">
									<button
										onClick={() => handleQuickStart("random")}
										className="w-full text-left px-3 py-2 text-sm bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100"
									>
										5 Random Problems
									</button>
									<button
										onClick={() => handleQuickStart("easy")}
										className="w-full text-left px-3 py-2 text-sm bg-green-50 text-green-700 rounded-lg hover:bg-green-100"
									>
										5 Easy Problems
									</button>
									<button
										onClick={() => handleQuickStart("medium")}
										className="w-full text-left px-3 py-2 text-sm bg-yellow-50 text-yellow-700 rounded-lg hover:bg-yellow-100"
									>
										5 Medium Problems
									</button>
								</div>
							</div>
						</div>
					</div>

					{/* Problems List */}
					<div className="lg:col-span-3">
						<div className="bg-white rounded-lg shadow-sm">
							<div className="p-6 border-b">
								<div className="flex items-center justify-between">
									<h3 className="text-lg font-semibold text-gray-900">
										Available Problems ({filteredProblems.length})
									</h3>
									<div className="flex items-center space-x-2">
										<ClockIcon className="h-5 w-5 text-gray-400" />
										<span className="text-sm text-gray-600">
											{timeLimit} min timer
										</span>
									</div>
								</div>
							</div>

							<div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
								{filteredProblems.length === 0 ? (
									<div className="p-8 text-center text-gray-500">
										<PuzzlePieceIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
										<p>No problems match your current filters.</p>
										<p className="text-sm">
											Try adjusting your difficulty or algorithm selection.
										</p>
									</div>
								) : (
									filteredProblems.map((problem) => (
										<div key={problem.id} className="p-4 hover:bg-gray-50">
											<div className="flex items-center justify-between">
												<div className="flex-1">
													<div className="flex items-center space-x-3">
														<button
															onClick={() =>
																handleProblemToggle(String(problem.id))
															}
															className={`flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center ${
																selectedProblems.includes(String(problem.id))
																	? "bg-blue-600 border-blue-600 text-white"
																	: "border-gray-300 hover:border-blue-500"
															}`}
														>
															{selectedProblems.includes(
																String(problem.id),
															) && <CheckIcon className="h-3 w-3" />}
														</button>
														<div>
															<h4 className="text-sm font-medium text-gray-900">
																{problem.title}
															</h4>
															<p className="text-xs text-gray-500 mt-1 line-clamp-2">
																{problem.description}
															</p>
														</div>
													</div>
													<div className="flex items-center mt-2 space-x-2">
														<span
															className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
																problem.difficulty === "Easy"
																	? "bg-green-100 text-green-800"
																	: problem.difficulty === "Medium"
																		? "bg-yellow-100 text-yellow-800"
																		: "bg-red-100 text-red-800"
															}`}
														>
															{problem.difficulty}
														</span>
														<div className="flex flex-wrap gap-1">
															{problem.algorithms.slice(0, 3).map((algo) => (
																<span
																	key={algo}
																	className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800"
																>
																	{algo}
																</span>
															))}
															{problem.algorithms.length > 3 && (
																<span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800">
																	+{problem.algorithms.length - 3}
																</span>
															)}
														</div>
													</div>
												</div>
											</div>
										</div>
									))
								)}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
