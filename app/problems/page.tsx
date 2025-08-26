"use client";

import { useState, useEffect } from "react";
import { MagnifyingGlassIcon, FunnelIcon, StarIcon } from "@heroicons/react/24/outline";

interface Problem {
	id: string;
	title: string;
	difficulty: "Easy" | "Medium" | "Hard";
	category: string;
	description: string;
	leetcodeUrl: string;
}

export default function ProblemsPage() {
	const [problems, setProblems] = useState<Problem[]>([]);
	const [filteredProblems, setFilteredProblems] = useState<Problem[]>([]);
	const [loading, setLoading] = useState(true);
	const [searchTerm, setSearchTerm] = useState("");
	const [difficultyFilter, setDifficultyFilter] = useState<string>("all");
	const [categoryFilter, setCategoryFilter] = useState<string>("all");

	useEffect(() => {
		fetchProblems();
	}, []);

	useEffect(() => {
		filterProblems();
	}, [problems, searchTerm, difficultyFilter, categoryFilter]);

	const fetchProblems = async () => {
		try {
			const response = await fetch("/api/problems");
			if (response.ok) {
				const data = await response.json();
				setProblems(data.data?.problems || []);
			}
		} catch (error) {
			console.error("Error fetching problems:", error);
		} finally {
			setLoading(false);
		}
	};

	const filterProblems = () => {
		let filtered = problems;

		// Search filter
		if (searchTerm) {
			filtered = filtered.filter(problem =>
				problem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
				problem.description.toLowerCase().includes(searchTerm.toLowerCase())
			);
		}

		// Difficulty filter
		if (difficultyFilter !== "all") {
			filtered = filtered.filter(problem => problem.difficulty === difficultyFilter);
		}

		// Category filter
		if (categoryFilter !== "all") {
			filtered = filtered.filter(problem => problem.category === categoryFilter);
		}

		setFilteredProblems(filtered);
	};

	const getDifficultyColor = (difficulty: string) => {
		switch (difficulty) {
			case "Easy": return "text-green-600 bg-green-100";
			case "Medium": return "text-yellow-600 bg-yellow-100";
			case "Hard": return "text-red-600 bg-red-100";
			default: return "text-gray-600 bg-gray-100";
		}
	};

	if (loading) {
		return (
			<div className="min-h-screen bg-gray-50 p-6">
				<div className="max-w-7xl mx-auto">
					<div className="animate-pulse">
						<div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
							{[...Array(9)].map((_, i) => (
								<div key={i} className="bg-white p-6 rounded-lg shadow-sm border">
									<div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
									<div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
									<div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
									<div className="h-3 bg-gray-200 rounded w-2/3"></div>
								</div>
							))}
						</div>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-50 p-6">
			<div className="max-w-7xl mx-auto">
				{/* Header */}
				<div className="mb-8">
					<h1 className="text-3xl font-bold text-gray-900 mb-2">Problem Browser</h1>
					<p className="text-gray-600">Browse and practice coding problems</p>
				</div>

				{/* Filters */}
				<div className="bg-white p-6 rounded-lg shadow-sm border mb-6">
					<div className="flex flex-col md:flex-row gap-4">
						{/* Search */}
						<div className="flex-1">
							<div className="relative">
								<MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
								<input
									type="text"
									placeholder="Search problems..."
									value={searchTerm}
									onChange={(e) => setSearchTerm(e.target.value)}
									className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
								/>
							</div>
						</div>

						{/* Difficulty Filter */}
						<select
							value={difficultyFilter}
							onChange={(e) => setDifficultyFilter(e.target.value)}
							className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
						>
							<option value="all">All Difficulties</option>
							<option value="Easy">Easy</option>
							<option value="Medium">Medium</option>
							<option value="Hard">Hard</option>
						</select>

						{/* Category Filter */}
						<select
							value={categoryFilter}
							onChange={(e) => setCategoryFilter(e.target.value)}
							className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
						>
							<option value="all">All Categories</option>
							<option value="Array">Array</option>
							<option value="String">String</option>
							<option value="Tree">Tree</option>
							<option value="Graph">Graph</option>
							<option value="Dynamic Programming">Dynamic Programming</option>
						</select>
					</div>
				</div>

				{/* Results Count */}
				<div className="mb-4">
					<p className="text-gray-600">
						Showing {filteredProblems.length} of {problems.length} problems
					</p>
				</div>

				{/* Problems Grid */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{filteredProblems.map((problem) => (
						<div key={problem.id} className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow">
							<div className="flex items-start justify-between mb-3">
								<h3 className="font-semibold text-gray-900 line-clamp-2">{problem.title}</h3>
								<StarIcon className="h-5 w-5 text-gray-400 flex-shrink-0 ml-2" />
							</div>
							
							<div className="flex items-center gap-2 mb-3">
								<span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(problem.difficulty)}`}>
									{problem.difficulty}
								</span>
								<span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
									{problem.category}
								</span>
							</div>

							<p className="text-gray-600 text-sm line-clamp-3 mb-4">
								{problem.description}
							</p>

							<div className="flex items-center justify-between">
								<a
									href={problem.leetcodeUrl}
									target="_blank"
									rel="noopener noreferrer"
									className="text-blue-600 hover:text-blue-800 text-sm font-medium"
								>
									View on LeetCode →
								</a>
								<button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors">
									Practice
								</button>
							</div>
						</div>
					))}
				</div>

				{/* Empty State */}
				{filteredProblems.length === 0 && !loading && (
					<div className="text-center py-12">
						<FunnelIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
						<h3 className="text-lg font-medium text-gray-900 mb-2">No problems found</h3>
						<p className="text-gray-600">Try adjusting your search or filters</p>
					</div>
				)}
			</div>
		</div>
	);
}
