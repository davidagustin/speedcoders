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
import { Navbar } from "../components/Navbar";
import { Sidebar } from "../components/Sidebar";

interface Problem {
	id: number;
	title: string;
	difficulty: string;
	category: string;
	description: string;
	leetcodeUrl: string;
}

export default function PracticePage() {
	const { data: session } = useSession();
	const [problems, setProblems] = useState<Problem[]>([]);
	const [filteredProblems, setFilteredProblems] = useState<Problem[]>([]);
	const [loading, setLoading] = useState(true);
	const [filters, setFilters] = useState({
		difficulty: "",
		category: "",
		yoloMode: false,
	});

	useEffect(() => {
		// Simulate loading problems from API
		const loadProblems = async () => {
			setLoading(true);
			// In a real app, this would fetch from your API
			const mockProblems: Problem[] = [
				{
					id: 1,
					title: "Two Sum",
					difficulty: "Easy",
					category: "Array",
					description:
						"Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
					leetcodeUrl: "https://leetcode.com/problems/two-sum/",
				},
				{
					id: 2,
					title: "Add Two Numbers",
					difficulty: "Medium",
					category: "Linked List",
					description:
						"You are given two non-empty linked lists representing two non-negative integers. The digits are stored in reverse order, and each of their nodes contains a single digit.",
					leetcodeUrl: "https://leetcode.com/problems/add-two-numbers/",
				},
				{
					id: 3,
					title: "Longest Substring Without Repeating Characters",
					difficulty: "Medium",
					category: "String",
					description:
						"Given a string s, find the length of the longest substring without repeating characters.",
					leetcodeUrl:
						"https://leetcode.com/problems/longest-substring-without-repeating-characters/",
				},
				{
					id: 4,
					title: "Median of Two Sorted Arrays",
					difficulty: "Hard",
					category: "Array",
					description:
						"Given two sorted arrays nums1 and nums2 of size m and n respectively, return the median of the two sorted arrays.",
					leetcodeUrl:
						"https://leetcode.com/problems/median-of-two-sorted-arrays/",
				},
			];

			setProblems(mockProblems);
			setFilteredProblems(mockProblems);
			setLoading(false);
		};

		loadProblems();
	}, []);

	useEffect(() => {
		let filtered = problems;

		if (filters.difficulty) {
			filtered = filtered.filter((p) => p.difficulty === filters.difficulty);
		}

		if (filters.category) {
			filtered = filtered.filter((p) => p.category === filters.category);
		}

		if (filters.yoloMode) {
			// YOLO mode: shuffle and add some chaos
			filtered = [...filtered].sort(() => Math.random() - 0.5);
			// Add some random problems multiple times for extra chaos
			const yoloProblems = [];
			for (let i = 0; i < Math.min(20, filtered.length * 2); i++) {
				const randomIndex = Math.floor(Math.random() * filtered.length);
				yoloProblems.push(filtered[randomIndex]);
			}
			filtered = yoloProblems;
		}

		setFilteredProblems(filtered);
	}, [problems, filters]);

	const handleYoloMode = () => {
		setFilters((prev) => ({ ...prev, yoloMode: !prev.yoloMode }));
		if (!filters.yoloMode) {
			console.log(
				"🔥 YOLO MODE ACTIVATED - NO RESTRICTIONS, MAXIMUM CHAOS! 🔥",
			);
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
		<div className="h-full flex">
			<Sidebar />
			<div className="flex-1 flex flex-col min-w-0">
				<Navbar />

				<main className="flex-1 overflow-y-auto bg-gray-50">
					<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
						{/* Header */}
						<div className="mb-8">
							<div className="flex items-center justify-between">
								<div>
									<h1 className="text-3xl font-bold text-gray-900">
										Practice Problems
									</h1>
									<p className="mt-2 text-gray-600">
										Solve coding problems and improve your algorithmic thinking
									</p>
								</div>
								<button
									onClick={handleYoloMode}
									className={`inline-flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${
										filters.yoloMode
											? "bg-red-600 text-white hover:bg-red-700"
											: "bg-gray-200 text-gray-700 hover:bg-gray-300"
									}`}
								>
									<FireIcon className="w-5 h-5 mr-2" />
									{filters.yoloMode ? "YOLO MODE ON" : "YOLO Mode"}
								</button>
							</div>
						</div>

						{/* Filters */}
						<div className="bg-white rounded-lg shadow p-6 mb-8">
							<div className="flex items-center space-x-4">
								<AdjustmentsHorizontalIcon className="w-5 h-5 text-gray-400" />
								<h3 className="text-lg font-medium text-gray-900">Filters</h3>
							</div>
							<div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">
										Difficulty
									</label>
									<select
										value={filters.difficulty}
										onChange={(e) =>
											setFilters((prev) => ({
												...prev,
												difficulty: e.target.value,
											}))
										}
										className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
											setFilters((prev) => ({
												...prev,
												category: e.target.value,
											}))
										}
										className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
									>
										<option value="">All Categories</option>
										<option value="Array">Array</option>
										<option value="String">String</option>
										<option value="Linked List">Linked List</option>
										<option value="Tree">Tree</option>
										<option value="Graph">Graph</option>
										<option value="Dynamic Programming">
											Dynamic Programming
										</option>
									</select>
								</div>
								<div className="flex items-end">
									<button
										onClick={() =>
											setFilters({
												difficulty: "",
												category: "",
												yoloMode: false,
											})
										}
										className="w-full px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
									>
										Clear Filters
									</button>
								</div>
							</div>
						</div>

						{/* Problems Grid */}
						{loading ? (
							<div className="text-center py-12">
								<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
								<p className="mt-4 text-gray-600">Loading problems...</p>
							</div>
						) : (
							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
								{filteredProblems.map((problem) => (
									<div
										key={problem.id}
										className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
									>
										<div className="p-6">
											<div className="flex items-start justify-between mb-4">
												<h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
													{problem.title}
												</h3>
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
											</div>

											<p className="text-sm text-gray-600 mb-4 line-clamp-3">
												{problem.description}
											</p>

											<div className="flex items-center justify-between">
												<span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
													{problem.category}
												</span>
												<Link
													href={`/problems/${problem.id}`}
													className="inline-flex items-center px-3 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
												>
													<PlayIcon className="w-4 h-4 mr-1" />
													Start
												</Link>
											</div>
										</div>
									</div>
								))}
							</div>
						)}

						{!loading && filteredProblems.length === 0 && (
							<div className="text-center py-12">
								<PuzzlePieceIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
								<h3 className="text-lg font-medium text-gray-900 mb-2">
									No problems found
								</h3>
								<p className="text-gray-600">
									Try adjusting your filters or check back later for new
									problems.
								</p>
							</div>
						)}
					</div>
				</main>
			</div>
		</div>
	);
}
