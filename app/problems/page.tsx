"use client";

import { useState, useEffect } from "react";
import { MagnifyingGlassIcon, FunnelIcon, StarIcon, ClockIcon, FireIcon } from "@heroicons/react/24/outline";
import { apiClient } from "@/utils/api/client";

interface Problem {
	id: string;
	title: string;
	difficulty: "Easy" | "Medium" | "Hard";
	category: string;
	description: string;
	leetcodeUrl: string;
	acceptanceRate?: number;
	companies?: string[];
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
			const response = await apiClient.getProblems();
			if (response.success) {
				setProblems(response.data?.problems || getDefaultProblems());
			} else {
				setProblems(getDefaultProblems());
			}
		} catch (error) {
			console.error("Error fetching problems:", error);
			setProblems(getDefaultProblems());
		} finally {
			setLoading(false);
		}
	};

	const getDefaultProblems = (): Problem[] => [
		{
			id: "1",
			title: "Two Sum",
			difficulty: "Easy",
			category: "Array",
			description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
			leetcodeUrl: "https://leetcode.com/problems/two-sum/",
			acceptanceRate: 49.5,
			companies: ["Google", "Amazon", "Microsoft"]
		},
		{
			id: "2",
			title: "Add Two Numbers",
			difficulty: "Medium",
			category: "Linked List",
			description: "You are given two non-empty linked lists representing two non-negative integers. The digits are stored in reverse order.",
			leetcodeUrl: "https://leetcode.com/problems/add-two-numbers/",
			acceptanceRate: 38.9,
			companies: ["Amazon", "Microsoft", "Bloomberg"]
		},
		{
			id: "3",
			title: "Longest Substring Without Repeating Characters",
			difficulty: "Medium",
			category: "String",
			description: "Given a string s, find the length of the longest substring without repeating characters.",
			leetcodeUrl: "https://leetcode.com/problems/longest-substring-without-repeating-characters/",
			acceptanceRate: 33.8,
			companies: ["Google", "Amazon", "Facebook"]
		},
		{
			id: "4",
			title: "Median of Two Sorted Arrays",
			difficulty: "Hard",
			category: "Array",
			description: "Given two sorted arrays nums1 and nums2 of size m and n respectively, return the median of the two sorted arrays.",
			leetcodeUrl: "https://leetcode.com/problems/median-of-two-sorted-arrays/",
			acceptanceRate: 35.2,
			companies: ["Google", "Microsoft", "Amazon"]
		},
		{
			id: "5",
			title: "Valid Parentheses",
			difficulty: "Easy",
			category: "Stack",
			description: "Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.",
			leetcodeUrl: "https://leetcode.com/problems/valid-parentheses/",
			acceptanceRate: 40.5,
			companies: ["Amazon", "Google", "Microsoft"]
		},
		{
			id: "6",
			title: "Merge Two Sorted Lists",
			difficulty: "Easy",
			category: "Linked List",
			description: "Merge two sorted linked lists and return it as a sorted list. The list should be made by splicing together the nodes of the first two lists.",
			leetcodeUrl: "https://leetcode.com/problems/merge-two-sorted-lists/",
			acceptanceRate: 56.6,
			companies: ["Amazon", "Microsoft", "Apple"]
		}
	];

	const filterProblems = () => {
		let filtered = problems;

		// Search filter
		if (searchTerm) {
			filtered = filtered.filter(problem =>
				problem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
				problem.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
				problem.category.toLowerCase().includes(searchTerm.toLowerCase())
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
					{/* Header Skeleton */}
					<div className="mb-8">
						<div className="flex items-center gap-3 mb-6 animate-pulse">
							<div className="w-14 h-14 bg-gradient-to-r from-gray-200 to-gray-300 rounded-xl"></div>
							<div>
								<div className="h-8 bg-gray-200 rounded w-80 mb-2"></div>
								<div className="h-4 bg-gray-200 rounded w-96"></div>
							</div>
						</div>

						{/* Stats Cards Skeleton */}
						<div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
							{[...Array(4)].map((_, i) => (
								<div key={i} className="bg-white p-4 rounded-xl border animate-pulse">
									<div className="flex items-center gap-3">
										<div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
										<div>
											<div className="h-3 bg-gray-200 rounded w-16 mb-2"></div>
											<div className="h-6 bg-gray-200 rounded w-8"></div>
										</div>
									</div>
								</div>
							))}
						</div>
					</div>

					{/* Filters Skeleton */}
					<div className="bg-white p-6 rounded-lg shadow-sm border mb-6 animate-pulse">
						<div className="flex flex-col md:flex-row gap-4">
							<div className="flex-1">
								<div className="h-10 bg-gray-200 rounded-lg"></div>
							</div>
							<div className="w-40 h-10 bg-gray-200 rounded-lg"></div>
							<div className="w-40 h-10 bg-gray-200 rounded-lg"></div>
						</div>
					</div>

					{/* Results Count Skeleton */}
					<div className="mb-4 animate-pulse">
						<div className="h-4 bg-gray-200 rounded w-48"></div>
					</div>

					{/* Enhanced Problem Cards Skeleton */}
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{[...Array(6)].map((_, i) => (
							<div key={i} className="bg-white rounded-xl shadow-sm border overflow-hidden">
								{/* Gradient header skeleton */}
								<div className="h-1 bg-gradient-to-r from-gray-200 to-gray-300"></div>
								
								<div className="p-6 animate-pulse">
									{/* Title and star */}
									<div className="flex items-start justify-between mb-4">
										<div className="flex-1">
											<div className="h-6 bg-gray-200 rounded w-3/4 mb-1"></div>
											<div className="h-4 bg-gray-100 rounded w-1/2"></div>
										</div>
										<div className="w-6 h-6 bg-gray-200 rounded-full"></div>
									</div>
									
									{/* Badges */}
									<div className="flex gap-2 mb-4">
										<div className="h-6 bg-gray-200 rounded-full w-16"></div>
										<div className="h-6 bg-gray-200 rounded-full w-20"></div>
										<div className="h-6 bg-gray-200 rounded-full w-24"></div>
									</div>

									{/* Description */}
									<div className="space-y-2 mb-5">
										<div className="h-3 bg-gray-200 rounded w-full"></div>
										<div className="h-3 bg-gray-200 rounded w-full"></div>
										<div className="h-3 bg-gray-200 rounded w-2/3"></div>
									</div>

									{/* Companies */}
									<div className="mb-6">
										<div className="h-3 bg-gray-200 rounded w-20 mb-2"></div>
										<div className="flex gap-2">
											<div className="h-6 bg-gray-100 rounded-lg w-16"></div>
											<div className="h-6 bg-gray-100 rounded-lg w-20"></div>
											<div className="h-6 bg-gray-100 rounded-lg w-18"></div>
										</div>
									</div>

									{/* Actions */}
									<div className="flex items-center justify-between pt-4 border-t border-gray-100">
										<div className="h-4 bg-gray-200 rounded w-24"></div>
										<div className="h-8 bg-gray-200 rounded-lg w-20"></div>
									</div>
								</div>
							</div>
						))}
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-50 p-6">
			<div className="max-w-7xl mx-auto">
				{/* Header with Statistics Cards */}
				<div className="mb-8">
					<div className="flex items-center gap-3 mb-6">
						<div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-xl">
							<MagnifyingGlassIcon className="h-8 w-8 text-white" />
						</div>
						<div>
							<h1 className="text-3xl font-bold text-gray-900 mb-1">Problem Browser</h1>
							<p className="text-gray-600">Browse and practice coding problems from top companies</p>
						</div>
					</div>

					{/* Quick Stats Cards */}
					<div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
						<div className="bg-gradient-to-br from-green-50 to-emerald-100 p-4 rounded-xl border border-green-200 hover:shadow-md transition-shadow">
							<div className="flex items-center gap-3">
								<div className="bg-green-500 p-2 rounded-lg">
									<FireIcon className="h-5 w-5 text-white" />
								</div>
								<div>
									<p className="text-sm font-medium text-green-700">Solved Today</p>
									<p className="text-2xl font-bold text-green-800">12</p>
								</div>
							</div>
						</div>
						<div className="bg-gradient-to-br from-blue-50 to-indigo-100 p-4 rounded-xl border border-blue-200 hover:shadow-md transition-shadow">
							<div className="flex items-center gap-3">
								<div className="bg-blue-500 p-2 rounded-lg">
									<StarIcon className="h-5 w-5 text-white" />
								</div>
								<div>
									<p className="text-sm font-medium text-blue-700">Total Solved</p>
									<p className="text-2xl font-bold text-blue-800">347</p>
								</div>
							</div>
						</div>
						<div className="bg-gradient-to-br from-purple-50 to-violet-100 p-4 rounded-xl border border-purple-200 hover:shadow-md transition-shadow">
							<div className="flex items-center gap-3">
								<div className="bg-purple-500 p-2 rounded-lg">
									<ClockIcon className="h-5 w-5 text-white" />
								</div>
								<div>
									<p className="text-sm font-medium text-purple-700">Streak</p>
									<p className="text-2xl font-bold text-purple-800">28</p>
								</div>
							</div>
						</div>
						<div className="bg-gradient-to-br from-orange-50 to-amber-100 p-4 rounded-xl border border-orange-200 hover:shadow-md transition-shadow">
							<div className="flex items-center gap-3">
								<div className="bg-orange-500 p-2 rounded-lg">
									<FunnelIcon className="h-5 w-5 text-white" />
								</div>
								<div>
									<p className="text-sm font-medium text-orange-700">Accuracy</p>
									<p className="text-2xl font-bold text-orange-800">84%</p>
								</div>
							</div>
						</div>
					</div>
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
							<option value="Linked List">Linked List</option>
							<option value="Stack">Stack</option>
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
					{filteredProblems.map((problem, index) => (
						<div 
							key={problem.id} 
							className="group relative bg-white rounded-xl shadow-sm border border-gray-200 hover:border-blue-300 hover:shadow-xl transition-all duration-300 overflow-hidden transform hover:-translate-y-1"
							style={{ 
								animationDelay: `${index * 100}ms`,
							}}
						>
							{/* Gradient Header */}
							<div className="h-1 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500"></div>
							
							<div className="p-6">
								{/* Title and Actions */}
								<div className="flex items-start justify-between mb-4">
									<h3 className="font-semibold text-lg text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
										{problem.title}
									</h3>
									<div className="flex gap-2 flex-shrink-0 ml-3">
										<button className="p-1.5 rounded-full hover:bg-gray-100 transition-colors group/star">
											<StarIcon className="h-4 w-4 text-gray-400 group-hover/star:text-yellow-500 transition-colors" />
										</button>
									</div>
								</div>
								
								{/* Enhanced Badges */}
								<div className="flex items-center flex-wrap gap-2 mb-4">
									<span className={`px-3 py-1.5 rounded-full text-xs font-semibold ${getDifficultyColor(problem.difficulty)} ring-1 ring-inset ring-current/20 shadow-sm`}>
										{problem.difficulty}
									</span>
									<span className="text-xs font-medium text-gray-600 bg-gradient-to-r from-gray-50 to-gray-100 px-3 py-1.5 rounded-full border border-gray-200">
										{problem.category}
									</span>
									{problem.acceptanceRate && (
										<div className="flex items-center gap-2 bg-blue-50 px-3 py-1.5 rounded-full border border-blue-200">
											<div className="w-12 h-1.5 bg-gray-200 rounded-full overflow-hidden">
												<div 
													className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-700"
													style={{ width: `${problem.acceptanceRate}%` }}
												></div>
											</div>
											<span className="text-xs text-blue-700 font-semibold">
												{problem.acceptanceRate}%
											</span>
										</div>
									)}
								</div>

								{/* Description */}
								<p className="text-gray-600 text-sm leading-relaxed line-clamp-3 mb-5">
									{problem.description}
								</p>

								{/* Companies */}
								{problem.companies && problem.companies.length > 0 && (
									<div className="mb-6">
										<p className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wider">Companies</p>
										<div className="flex flex-wrap gap-2">
											{problem.companies.slice(0, 3).map((company, index) => (
												<span 
													key={index} 
													className="text-xs bg-gradient-to-r from-purple-50 to-indigo-50 text-purple-800 px-3 py-1.5 rounded-lg font-medium border border-purple-200 hover:shadow-sm transition-all hover:scale-105"
												>
													{company}
												</span>
											))}
											{problem.companies.length > 3 && (
												<span className="text-xs text-gray-500 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-200">
													+{problem.companies.length - 3} more
												</span>
											)}
										</div>
									</div>
								)}

								{/* Action Buttons */}
								<div className="flex items-center justify-between pt-4 border-t border-gray-100">
									<a
										href={problem.leetcodeUrl}
										target="_blank"
										rel="noopener noreferrer"
										className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1 group/link"
									>
										<span>View Problem</span>
										<svg className="w-4 h-4 transition-transform group-hover/link:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
										</svg>
									</a>
									<button className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2 rounded-lg text-sm font-semibold hover:shadow-lg hover:scale-105 transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
										Practice
									</button>
								</div>
							</div>

							{/* Hover Glow Effect */}
							<div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-xl"></div>
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