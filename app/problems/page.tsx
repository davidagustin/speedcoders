"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

interface Problem {
	id: number;
	title: string;
	difficulty: "Easy" | "Medium" | "Hard";
	category: string;
	description: string;
	leetcodeUrl: string;
	algorithms: string[];
	tags: string[];
}

interface ProblemsResponse {
	problems: Problem[];
	pagination: {
		page: number;
		limit: number;
		total: number;
		totalPages: number;
		hasNext: boolean;
		hasPrev: boolean;
	};
	categories: string[];
	algorithms: string[];
}

export default function ProblemsPage() {
	const [problems, setProblems] = useState<Problem[]>([]);
	const [loading, setLoading] = useState(true);
	const [pagination, setPagination] = useState<any>(null);
	const [categories, setCategories] = useState<string[]>([]);
	const [algorithms, setAlgorithms] = useState<string[]>([]);
	const [filters, setFilters] = useState({
		difficulty: "",
		category: "",
		algorithm: "",
		search: "",
		sortBy: "title",
		sortOrder: "asc",
	});
	const [currentPage, setCurrentPage] = useState(1);

	useEffect(() => {
		fetchProblems();
	}, [fetchProblems]);

	async function fetchProblems() {
		setLoading(true);
		try {
			const params = new URLSearchParams({
				page: currentPage.toString(),
				limit: "20",
				...filters,
			});

			const response = await fetch(`/api/problems?${params}`);
			const data: ProblemsResponse = await response.json();

			setProblems(data.problems);
			setPagination(data.pagination);
			setCategories(data.categories || []);
			setAlgorithms(data.algorithms || []);
		} catch (error) {
			console.error("Error fetching problems:", error);
		} finally {
			setLoading(false);
		}
	}

	function handleFilterChange(key: string, value: string) {
		setFilters((prev) => ({ ...prev, [key]: value }));
		setCurrentPage(1);
	}

	function getDifficultyColor(difficulty: string) {
		switch (difficulty) {
			case "Easy":
				return "text-green-600 bg-green-100";
			case "Medium":
				return "text-yellow-600 bg-yellow-100";
			case "Hard":
				return "text-red-600 bg-red-100";
			default:
				return "text-gray-600 bg-gray-100";
		}
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				{/* Header */}
				<div className="mb-8">
					<h1 className="text-3xl font-bold text-gray-900 mb-2">
						Problem Browser
					</h1>
					<p className="text-gray-600">
						Browse and practice from our comprehensive collection of coding
						problems
					</p>
				</div>

				{/* Filters */}
				<div className="bg-white rounded-lg shadow-lg p-6 mb-8">
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
						{/* Search */}
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Search
							</label>
							<input
								type="text"
								placeholder="Search problems..."
								value={filters.search}
								onChange={(e) => handleFilterChange("search", e.target.value)}
								className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
							/>
						</div>

						{/* Difficulty */}
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Difficulty
							</label>
							<select
								value={filters.difficulty}
								onChange={(e) =>
									handleFilterChange("difficulty", e.target.value)
								}
								className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
							>
								<option value="">All Difficulties</option>
								<option value="Easy">Easy</option>
								<option value="Medium">Medium</option>
								<option value="Hard">Hard</option>
							</select>
						</div>

						{/* Category */}
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Category
							</label>
							<select
								value={filters.category}
								onChange={(e) => handleFilterChange("category", e.target.value)}
								className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
							>
								<option value="">All Categories</option>
								{categories.map((category) => (
									<option key={category} value={category}>
										{category}
									</option>
								))}
							</select>
						</div>

						{/* Algorithm */}
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Algorithm
							</label>
							<select
								value={filters.algorithm}
								onChange={(e) =>
									handleFilterChange("algorithm", e.target.value)
								}
								className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
							>
								<option value="">All Algorithms</option>
								{algorithms.map((algorithm) => (
									<option key={algorithm} value={algorithm}>
										{algorithm}
									</option>
								))}
							</select>
						</div>

						{/* Sort By */}
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Sort By
							</label>
							<select
								value={filters.sortBy}
								onChange={(e) => handleFilterChange("sortBy", e.target.value)}
								className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
							>
								<option value="title">Title</option>
								<option value="difficulty">Difficulty</option>
								<option value="category">Category</option>
								<option value="id">ID</option>
							</select>
						</div>

						{/* Sort Order */}
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Order
							</label>
							<select
								value={filters.sortOrder}
								onChange={(e) =>
									handleFilterChange("sortOrder", e.target.value)
								}
								className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
							>
								<option value="asc">Ascending</option>
								<option value="desc">Descending</option>
							</select>
						</div>
					</div>
				</div>

				{/* Problems List */}
				{loading ? (
					<div className="flex justify-center py-12">
						<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
					</div>
				) : (
					<>
						<div className="bg-white rounded-lg shadow-lg overflow-hidden">
							<div className="overflow-x-auto">
								<table className="min-w-full divide-y divide-gray-200">
									<thead className="bg-gray-50">
										<tr>
											<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
												Problem
											</th>
											<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
												Difficulty
											</th>
											<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
												Category
											</th>
											<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
												Algorithms
											</th>
											<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
												Actions
											</th>
										</tr>
									</thead>
									<tbody className="bg-white divide-y divide-gray-200">
										{problems.map((problem) => (
											<tr key={problem.id} className="hover:bg-gray-50">
												<td className="px-6 py-4 whitespace-nowrap">
													<div>
														<div className="text-sm font-medium text-gray-900">
															{problem.id}. {problem.title}
														</div>
														<div className="text-sm text-gray-500 truncate max-w-md">
															{problem.description}
														</div>
													</div>
												</td>
												<td className="px-6 py-4 whitespace-nowrap">
													<span
														className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getDifficultyColor(problem.difficulty)}`}
													>
														{problem.difficulty}
													</span>
												</td>
												<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
													{problem.category}
												</td>
												<td className="px-6 py-4 whitespace-nowrap">
													<div className="flex flex-wrap gap-1">
														{problem.algorithms.slice(0, 2).map((algorithm) => (
															<span
																key={algorithm}
																className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded"
															>
																{algorithm}
															</span>
														))}
														{problem.algorithms.length > 2 && (
															<span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
																+{problem.algorithms.length - 2}
															</span>
														)}
													</div>
												</td>
												<td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
													<div className="flex space-x-2">
														<Link
															href={`/leetcode?problem=${problem.id}`}
															className="text-blue-600 hover:text-blue-900"
														>
															Practice
														</Link>
														<a
															href={problem.leetcodeUrl}
															target="_blank"
															rel="noopener noreferrer"
															className="text-green-600 hover:text-green-900"
														>
															LeetCode
														</a>
													</div>
												</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
						</div>

						{/* Pagination */}
						{pagination && (
							<div className="mt-8 flex items-center justify-between">
								<div className="text-sm text-gray-700">
									Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
									{Math.min(
										pagination.page * pagination.limit,
										pagination.total,
									)}{" "}
									of {pagination.total} results
								</div>
								<div className="flex space-x-2">
									<button
										onClick={() => setCurrentPage(pagination.page - 1)}
										disabled={!pagination.hasPrev}
										className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
									>
										Previous
									</button>
									<span className="px-3 py-2 text-sm text-gray-700">
										Page {pagination.page} of {pagination.totalPages}
									</span>
									<button
										onClick={() => setCurrentPage(pagination.page + 1)}
										disabled={!pagination.hasNext}
										className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
									>
										Next
									</button>
								</div>
							</div>
						)}
					</>
				)}
			</div>
		</div>
	);
}
