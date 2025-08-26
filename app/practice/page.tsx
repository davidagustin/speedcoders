"use client";

import {
	AdjustmentsHorizontalIcon,
	FireIcon,
	PlayIcon,
	PuzzlePieceIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Navbar } from "../../components/Navbar";
import { Sidebar } from "../../components/Sidebar";

interface Problem {
	id: number;
	title: string;
	difficulty: string;
	category: string;
	description: string;
	leetcodeUrl: string;
	algorithms: string[];
	tags: string[];
}

export default function PracticePage() {
	const { data: session } = useSession();
	const [problems, setProblems] = useState<Problem[]>([]);
	const [filteredProblems, setFilteredProblems] = useState<Problem[]>([]);
	const [loading, setLoading] = useState(true);
	const [stats, setStats] = useState<any>(null);
	const [filters, setFilters] = useState({
		difficulty: "",
		category: "",
		yoloMode: false,
	});

	useEffect(() => {
		loadProblems();
	}, []);

	const loadProblems = async () => {
		try {
			setLoading(true);
			const response = await fetch('/api/problems');
			const result = await response.json();
			
			if (result.success) {
				setProblems(result.data.problems);
				setFilteredProblems(result.data.problems);
				setStats(result.data.stats);
			} else {
				console.error('Failed to load problems:', result.error);
			}
		} catch (error) {
			console.error('Error loading problems:', error);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		let filtered = problems;

		if (filters.difficulty) {
			filtered = filtered.filter((p) => p.difficulty === filters.difficulty);
		}

		if (filters.category) {
			filtered = filtered.filter((p) => p.category === filters.category);
		}

		if (filters.yoloMode) {
			// YOLO MODE: NO RESTRICTIONS, MAXIMUM CHAOS! 🚀
			// Shuffle problems and duplicate some for extra chaos
			const shuffled = [...filtered].sort(() => Math.random() - 0.5);
			const duplicated = [...shuffled, ...shuffled.slice(0, Math.floor(shuffled.length / 2))];
			filtered = duplicated.sort(() => Math.random() - 0.5);
		}

		setFilteredProblems(filtered);
	}, [problems, filters]);

	const getDifficultyColor = (difficulty: string) => {
		switch (difficulty) {
			case "Easy":
				return "bg-green-100 text-green-800";
			case "Medium":
				return "bg-yellow-100 text-yellow-800";
			case "Hard":
				return "bg-red-100 text-red-800";
			default:
				return "bg-gray-100 text-gray-800";
		}
	};

	const getCategoryIcon = (category: string) => {
		switch (category) {
			case "Array":
				return "🔢";
			case "String":
				return "📝";
			case "Linked List":
				return "🔗";
			case "Tree":
				return "🌳";
			case "Graph":
				return "🕸️";
			case "Dynamic Programming":
				return "⚡";
			case "Greedy":
				return "💰";
			case "Binary Search":
				return "🔍";
			case "Backtracking":
				return "🔄";
			case "Stack":
				return "📚";
			case "Queue":
				return "🚶";
			case "Hash Table":
				return "🗂️";
			case "Math":
				return "🧮";
			case "Bit Manipulation":
				return "🔧";
			case "Database":
				return "💾";
			default:
				return "💻";
		}
	};

	if (!session) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="text-center">
					<h1 className="text-2xl font-bold text-gray-900">
						Please sign in to practice
					</h1>
					<Link
						href="/auth/login"
						className="mt-4 inline-block bg-blue-600 text-white px-6 py-2 rounded-lg"
					>
						Sign In
					</Link>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-50">
			<Navbar />
			<div className="flex">
				<Sidebar />
				<main className="flex-1 p-6">
					<div className="max-w-7xl mx-auto">
						{/* Header */}
						<div className="mb-8">
							<div className="flex items-center gap-3 mb-4">
								<div className="p-2 bg-blue-100 rounded-lg">
									<PuzzlePieceIcon className="w-6 h-6 text-blue-600" />
								</div>
								<div>
									<h1 className="text-3xl font-bold text-gray-900">Practice Problems</h1>
									<p className="text-gray-600">Master algorithms and data structures</p>
								</div>
							</div>

							{/* Stats */}
							{stats && (
								<div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
									<div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
										<div className="flex items-center">
											<div className="p-2 bg-blue-100 rounded-lg">
												<PuzzlePieceIcon className="w-4 h-4 text-blue-600" />
											</div>
											<div className="ml-3">
												<p className="text-sm font-medium text-gray-500">Total Problems</p>
												<p className="text-lg font-semibold text-gray-900">{stats.total}</p>
											</div>
										</div>
									</div>
									<div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
										<div className="flex items-center">
											<div className="p-2 bg-green-100 rounded-lg">
												<FireIcon className="w-4 h-4 text-green-600" />
											</div>
											<div className="ml-3">
												<p className="text-sm font-medium text-gray-500">Easy</p>
												<p className="text-lg font-semibold text-gray-900">{stats.easy}</p>
											</div>
										</div>
									</div>
									<div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
										<div className="flex items-center">
											<div className="p-2 bg-yellow-100 rounded-lg">
												<FireIcon className="w-4 h-4 text-yellow-600" />
											</div>
											<div className="ml-3">
												<p className="text-sm font-medium text-gray-500">Medium</p>
												<p className="text-lg font-semibold text-gray-900">{stats.medium}</p>
											</div>
										</div>
									</div>
									<div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
										<div className="flex items-center">
											<div className="p-2 bg-red-100 rounded-lg">
												<FireIcon className="w-4 h-4 text-red-600" />
											</div>
											<div className="ml-3">
												<p className="text-sm font-medium text-gray-500">Hard</p>
												<p className="text-lg font-semibold text-gray-900">{stats.hard}</p>
											</div>
										</div>
									</div>
								</div>
							)}

							{/* Filters */}
							<div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
								<div className="flex items-center gap-4 mb-4">
									<AdjustmentsHorizontalIcon className="w-5 h-5 text-gray-500" />
									<h2 className="text-lg font-semibold text-gray-900">Filters</h2>
								</div>
								<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
									<div>
										<label className="block text-sm font-medium text-gray-700 mb-2">
											Difficulty
										</label>
										<select
											value={filters.difficulty}
											onChange={(e) =>
												setFilters({ ...filters, difficulty: e.target.value })
											}
											className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
										>
											<option value="">All Difficulties</option>
											<option value="Easy">Easy</option>
											<option value="Medium">Medium</option>
											<option value="Hard">Hard</option>
										</select>
									</div>
									<div>
										<label className="block text-sm font-medium text-gray-700 mb-2">
											Category
										</label>
										<select
											value={filters.category}
											onChange={(e) =>
												setFilters({ ...filters, category: e.target.value })
											}
											className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
										>
											<option value="">All Categories</option>
											{stats?.categories?.map((category: string) => (
												<option key={category} value={category}>
													{category}
												</option>
											))}
										</select>
									</div>
									<div className="flex items-end">
										<label className="flex items-center">
											<input
												type="checkbox"
												checked={filters.yoloMode}
												onChange={(e) =>
													setFilters({ ...filters, yoloMode: e.target.checked })
												}
												className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
											/>
											<span className="ml-2 text-sm font-medium text-gray-700">
												🔥 YOLO Mode
											</span>
										</label>
									</div>
								</div>
							</div>
						</div>

						{/* Loading State */}
						{loading && (
							<div className="flex justify-center items-center py-12">
								<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
							</div>
						)}

						{/* Problems Grid */}
						{!loading && (
							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
								{filteredProblems.map((problem) => (
									<div
										key={problem.id}
										className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200"
									>
										<div className="p-6">
											{/* Header */}
											<div className="flex items-start justify-between mb-4">
												<div className="flex items-center gap-2">
													<span className="text-2xl">
														{getCategoryIcon(problem.category)}
													</span>
													<span
														className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(
															problem.difficulty,
														)}`}
													>
														{problem.difficulty}
													</span>
												</div>
											</div>

											{/* Content */}
											<h3 className="text-lg font-semibold text-gray-900 mb-2">
												{problem.title}
											</h3>
											<p className="text-gray-600 text-sm mb-4 line-clamp-3">
												{problem.description}
											</p>

											{/* Algorithms */}
											{problem.algorithms && problem.algorithms.length > 0 && (
												<div className="mb-4">
													<div className="text-xs text-gray-500 mb-2">Algorithms:</div>
													<div className="flex flex-wrap gap-1">
														{problem.algorithms.slice(0, 3).map((algo) => (
															<span
																key={algo}
																className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded"
															>
																{algo}
															</span>
														))}
														{problem.algorithms.length > 3 && (
															<span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
																+{problem.algorithms.length - 3} more
															</span>
														)}
													</div>
												</div>
											)}

											{/* Action Buttons */}
											<div className="flex gap-2">
												<Link
													href={`/problems/${problem.id}`}
													className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-center"
												>
													<PlayIcon className="w-4 h-4 inline mr-2" />
													Practice
												</Link>
												<a
													href={problem.leetcodeUrl}
													target="_blank"
													rel="noopener noreferrer"
													className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
												>
													LeetCode
												</a>
											</div>
										</div>
									</div>
								))}
							</div>
						)}

						{/* No Results */}
						{!loading && filteredProblems.length === 0 && (
							<div className="text-center py-12">
								<PuzzlePieceIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
								<h3 className="text-lg font-medium text-gray-900 mb-2">No problems found</h3>
								<p className="text-gray-500">Try adjusting your filters or YOLO mode settings.</p>
							</div>
						)}
					</div>
				</main>
			</div>
		</div>
	);
}
