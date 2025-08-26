"use client";

import {
	BookmarkIcon,
	ChartBarIcon,
	CheckCircleIcon,
	ClockIcon,
	FunnelIcon,
	MagnifyingGlassIcon,
	StarIcon,
	TagIcon,
	XMarkIcon,
} from "@heroicons/react/24/outline";
import { BookmarkIcon as BookmarkSolidIcon } from "@heroicons/react/24/solid";
import { useEffect, useMemo, useState } from "react";

interface Problem {
	id: string;
	title: string;
	difficulty: "Easy" | "Medium" | "Hard";
	category: string;
	algorithms: string[];
	description: string;
	acceptance: number;
	frequency: number;
	companies: string[];
	timeComplexity: string[];
	spaceComplexity: string[];
	tags: string[];
	solved: boolean;
	bookmarked: boolean;
	rating: number;
	estimatedTime: number; // in minutes
	lastAttempted?: string;
	successRate: number;
}

interface SearchFilters {
	query: string;
	difficulty: ("Easy" | "Medium" | "Hard")[];
	categories: string[];
	algorithms: string[];
	companies: string[];
	tags: string[];
	status: "all" | "solved" | "unsolved" | "attempted" | "bookmarked";
	complexity: {
		time: string[];
		space: string[];
	};
	acceptance: [number, number];
	frequency: [number, number];
	estimatedTime: [number, number];
}

const DIFFICULTIES = ["Easy", "Medium", "Hard"] as const;
const CATEGORIES = [
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
	"Heap",
	"Graph",
	"Design",
	"Simulation",
	"Backtracking",
	"Bit Manipulation",
	"Union Find",
	"Linked List",
	"Sliding Window",
	"Trie",
];

const ALGORITHMS = [
	"Two Pointers",
	"Sliding Window",
	"Binary Search",
	"DFS",
	"BFS",
	"Dynamic Programming",
	"Greedy",
	"Divide and Conquer",
	"Backtracking",
	"Union Find",
	"Topological Sort",
	"Dijkstra",
	"A*",
	"KMP",
	"Rabin-Karp",
	"Manacher",
	"Morris Traversal",
];

const COMPANIES = [
	"Google",
	"Facebook",
	"Amazon",
	"Microsoft",
	"Apple",
	"Netflix",
	"Uber",
	"Airbnb",
	"LinkedIn",
	"Twitter",
	"Spotify",
	"Dropbox",
	"Salesforce",
	"Adobe",
	"Oracle",
];

const TIME_COMPLEXITIES = [
	"O(1)",
	"O(log n)",
	"O(n)",
	"O(n log n)",
	"O(n²)",
	"O(n³)",
	"O(2ⁿ)",
];
const SPACE_COMPLEXITIES = ["O(1)", "O(log n)", "O(n)", "O(n²)"];

export default function AdvancedSearch() {
	const [problems, setProblems] = useState<Problem[]>([]);
	const [filters, setFilters] = useState<SearchFilters>({
		query: "",
		difficulty: [],
		categories: [],
		algorithms: [],
		companies: [],
		tags: [],
		status: "all",
		complexity: { time: [], space: [] },
		acceptance: [0, 100],
		frequency: [0, 100],
		estimatedTime: [0, 180],
	});
	const [sortBy, setSortBy] = useState<
		"relevance" | "difficulty" | "acceptance" | "frequency" | "title"
	>("relevance");
	const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
	const [showFilters, setShowFilters] = useState(false);
	const [savedSearches, setSavedSearches] = useState<string[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		generateMockProblems();
	}, []);

	const generateMockProblems = () => {
		const mockProblems: Problem[] = Array.from({ length: 200 }, (_, index) => ({
			id: `problem-${index + 1}`,
			title: generateProblemTitle(),
			difficulty: DIFFICULTIES[Math.floor(Math.random() * 3)],
			category: CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)],
			algorithms: ALGORITHMS.slice(0, Math.floor(Math.random() * 3) + 1),
			description: `Problem description for problem ${index + 1}...`,
			acceptance: Math.floor(Math.random() * 60) + 20,
			frequency: Math.floor(Math.random() * 100),
			companies: COMPANIES.slice(0, Math.floor(Math.random() * 5) + 1),
			timeComplexity: [
				TIME_COMPLEXITIES[Math.floor(Math.random() * TIME_COMPLEXITIES.length)],
			],
			spaceComplexity: [
				SPACE_COMPLEXITIES[
					Math.floor(Math.random() * SPACE_COMPLEXITIES.length)
				],
			],
			tags: CATEGORIES.slice(0, Math.floor(Math.random() * 4) + 1),
			solved: Math.random() < 0.3,
			bookmarked: Math.random() < 0.2,
			rating: Math.floor(Math.random() * 5) + 1,
			estimatedTime: Math.floor(Math.random() * 120) + 15,
			lastAttempted: Math.random() < 0.4 ? "2024-01-15" : undefined,
			successRate: Math.floor(Math.random() * 60) + 40,
		}));

		setProblems(mockProblems);
		setLoading(false);
	};

	const generateProblemTitle = (): string => {
		const actions = [
			"Find",
			"Maximum",
			"Minimum",
			"Count",
			"Sum",
			"Search",
			"Sort",
			"Reverse",
		];
		const objects = [
			"Array",
			"Tree",
			"Path",
			"Substring",
			"Number",
			"Elements",
			"Nodes",
			"String",
		];
		const descriptors = [
			"Longest",
			"Shortest",
			"Valid",
			"Unique",
			"Common",
			"Missing",
			"Duplicate",
		];

		const action = actions[Math.floor(Math.random() * actions.length)];
		const descriptor =
			Math.random() < 0.5
				? `${descriptors[Math.floor(Math.random() * descriptors.length)]} `
				: "";
		const object = objects[Math.floor(Math.random() * objects.length)];

		return `${action} ${descriptor}${object}`;
	};

	const filteredProblems = useMemo(() => {
		const filtered = problems.filter((problem) => {
			// Text search
			if (
				filters.query &&
				!problem.title.toLowerCase().includes(filters.query.toLowerCase())
			) {
				return false;
			}

			// Difficulty filter
			if (
				filters.difficulty.length > 0 &&
				!filters.difficulty.includes(problem.difficulty)
			) {
				return false;
			}

			// Category filter
			if (
				filters.categories.length > 0 &&
				!filters.categories.includes(problem.category)
			) {
				return false;
			}

			// Algorithm filter
			if (
				filters.algorithms.length > 0 &&
				!filters.algorithms.some((alg) => problem.algorithms.includes(alg))
			) {
				return false;
			}

			// Company filter
			if (
				filters.companies.length > 0 &&
				!filters.companies.some((comp) => problem.companies.includes(comp))
			) {
				return false;
			}

			// Status filter
			switch (filters.status) {
				case "solved":
					if (!problem.solved) return false;
					break;
				case "unsolved":
					if (problem.solved) return false;
					break;
				case "attempted":
					if (!problem.lastAttempted) return false;
					break;
				case "bookmarked":
					if (!problem.bookmarked) return false;
					break;
			}

			// Acceptance rate filter
			if (
				problem.acceptance < filters.acceptance[0] ||
				problem.acceptance > filters.acceptance[1]
			) {
				return false;
			}

			// Frequency filter
			if (
				problem.frequency < filters.frequency[0] ||
				problem.frequency > filters.frequency[1]
			) {
				return false;
			}

			// Estimated time filter
			if (
				problem.estimatedTime < filters.estimatedTime[0] ||
				problem.estimatedTime > filters.estimatedTime[1]
			) {
				return false;
			}

			return true;
		});

		// Sort
		filtered.sort((a, b) => {
			let comparison = 0;

			switch (sortBy) {
				case "title":
					comparison = a.title.localeCompare(b.title);
					break;
				case "difficulty": {
					const diffOrder = { Easy: 1, Medium: 2, Hard: 3 };
					comparison = diffOrder[a.difficulty] - diffOrder[b.difficulty];
					break;
				}
				case "acceptance":
					comparison = a.acceptance - b.acceptance;
					break;
				case "frequency":
					comparison = a.frequency - b.frequency;
					break;
				default: // relevance
					comparison = b.frequency - a.frequency; // Default to frequency for relevance
			}

			return sortOrder === "asc" ? comparison : -comparison;
		});

		return filtered;
	}, [problems, filters, sortBy, sortOrder]);

	const updateFilter = <K extends keyof SearchFilters>(
		key: K,
		value: SearchFilters[K],
	) => {
		setFilters((prev) => ({ ...prev, [key]: value }));
	};

	const toggleArrayFilter = <
		K extends keyof Pick<
			SearchFilters,
			"difficulty" | "categories" | "algorithms" | "companies"
		>,
	>(
		key: K,
		value: string,
	) => {
		setFilters((prev) => ({
			...prev,
			[key]: (prev[key] as string[]).includes(value)
				? (prev[key] as string[]).filter((item) => item !== value)
				: [...(prev[key] as string[]), value],
		}));
	};

	const clearFilters = () => {
		setFilters({
			query: "",
			difficulty: [],
			categories: [],
			algorithms: [],
			companies: [],
			tags: [],
			status: "all",
			complexity: { time: [], space: [] },
			acceptance: [0, 100],
			frequency: [0, 100],
			estimatedTime: [0, 180],
		});
	};

	const saveSearch = () => {
		const searchName = `Search ${savedSearches.length + 1}`;
		setSavedSearches((prev) => [...prev, searchName]);
	};

	const getDifficultyColor = (difficulty: string) => {
		switch (difficulty) {
			case "Easy":
				return "text-green-600 bg-green-50";
			case "Medium":
				return "text-yellow-600 bg-yellow-50";
			case "Hard":
				return "text-red-600 bg-red-50";
			default:
				return "text-gray-600 bg-gray-50";
		}
	};

	if (loading) {
		return (
			<div className="flex items-center justify-center min-h-96">
				<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
			</div>
		);
	}

	return (
		<div className="max-w-7xl mx-auto p-6">
			{/* Header */}
			<div className="mb-6">
				<h1 className="text-3xl font-bold text-gray-900 mb-2">
					Advanced Problem Search
				</h1>
				<p className="text-gray-600">
					Find the perfect problems to practice with powerful filtering and
					search
				</p>
			</div>

			{/* Search Bar */}
			<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
				<div className="flex gap-4 mb-4">
					<div className="flex-1 relative">
						<MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
						<input
							type="text"
							placeholder="Search problems..."
							value={filters.query}
							onChange={(e) => updateFilter("query", e.target.value)}
							className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
						/>
					</div>
					<button
						onClick={() => setShowFilters(!showFilters)}
						className={`px-4 py-2 rounded-lg border transition-colors flex items-center gap-2 ${
							showFilters
								? "bg-blue-600 text-white border-blue-600"
								: "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
						}`}
					>
						<FunnelIcon className="h-5 w-5" />
						Filters
						{Object.values(filters).some((v) =>
							Array.isArray(v) ? v.length > 0 : v !== "all" && v !== "",
						) && (
							<span className="bg-red-500 text-white text-xs rounded-full h-2 w-2" />
						)}
					</button>
					<button
						onClick={saveSearch}
						className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
					>
						<BookmarkIcon className="h-5 w-5" />
						Save
					</button>
				</div>

				{/* Results summary */}
				<div className="flex items-center justify-between text-sm text-gray-600">
					<span>{filteredProblems.length} problems found</span>
					<div className="flex items-center gap-4">
						<select
							value={sortBy}
							onChange={(e) => setSortBy(e.target.value as any)}
							className="border border-gray-300 rounded px-3 py-1 text-sm"
						>
							<option value="relevance">Sort by Relevance</option>
							<option value="title">Sort by Title</option>
							<option value="difficulty">Sort by Difficulty</option>
							<option value="acceptance">Sort by Acceptance</option>
							<option value="frequency">Sort by Frequency</option>
						</select>
						<button
							onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
							className="p-1 hover:bg-gray-100 rounded"
						>
							{sortOrder === "asc" ? "↑" : "↓"}
						</button>
					</div>
				</div>
			</div>

			{/* Advanced Filters */}
			{showFilters && (
				<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6 space-y-6">
					<div className="flex items-center justify-between">
						<h3 className="text-lg font-semibold text-gray-900">
							Advanced Filters
						</h3>
						<div className="flex gap-2">
							<button
								onClick={clearFilters}
								className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
							>
								Clear All
							</button>
							<button
								onClick={() => setShowFilters(false)}
								className="p-1 hover:bg-gray-100 rounded"
							>
								<XMarkIcon className="h-5 w-5" />
							</button>
						</div>
					</div>

					<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
						{/* Difficulty */}
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Difficulty
							</label>
							<div className="flex gap-2">
								{DIFFICULTIES.map((diff) => (
									<button
										key={diff}
										onClick={() => toggleArrayFilter("difficulty", diff)}
										className={`px-3 py-1 text-sm rounded-full border transition-colors ${
											filters.difficulty.includes(diff)
												? `${getDifficultyColor(diff)} border-current`
												: "text-gray-600 bg-gray-50 border-gray-200 hover:bg-gray-100"
										}`}
									>
										{diff}
									</button>
								))}
							</div>
						</div>

						{/* Status */}
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Status
							</label>
							<select
								value={filters.status}
								onChange={(e) => updateFilter("status", e.target.value as any)}
								className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
							>
								<option value="all">All Problems</option>
								<option value="solved">Solved</option>
								<option value="unsolved">Unsolved</option>
								<option value="attempted">Attempted</option>
								<option value="bookmarked">Bookmarked</option>
							</select>
						</div>
					</div>

					{/* Categories */}
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							Categories
						</label>
						<div className="flex flex-wrap gap-2">
							{CATEGORIES.slice(0, 12).map((category) => (
								<button
									key={category}
									onClick={() => toggleArrayFilter("categories", category)}
									className={`px-3 py-1 text-sm rounded-full border transition-colors ${
										filters.categories.includes(category)
											? "bg-blue-600 text-white border-blue-600"
											: "text-gray-600 bg-gray-50 border-gray-200 hover:bg-gray-100"
									}`}
								>
									{category}
								</button>
							))}
						</div>
					</div>

					{/* Companies */}
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							Companies
						</label>
						<div className="flex flex-wrap gap-2">
							{COMPANIES.slice(0, 10).map((company) => (
								<button
									key={company}
									onClick={() => toggleArrayFilter("companies", company)}
									className={`px-3 py-1 text-sm rounded-full border transition-colors ${
										filters.companies.includes(company)
											? "bg-purple-600 text-white border-purple-600"
											: "text-gray-600 bg-gray-50 border-gray-200 hover:bg-gray-100"
									}`}
								>
									{company}
								</button>
							))}
						</div>
					</div>

					{/* Range Filters */}
					<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Acceptance Rate: {filters.acceptance[0]}% -{" "}
								{filters.acceptance[1]}%
							</label>
							<input
								type="range"
								min="0"
								max="100"
								value={filters.acceptance[1]}
								onChange={(e) =>
									updateFilter("acceptance", [
										filters.acceptance[0],
										parseInt(e.target.value, 10),
									])
								}
								className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
							/>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Frequency: {filters.frequency[0]} - {filters.frequency[1]}
							</label>
							<input
								type="range"
								min="0"
								max="100"
								value={filters.frequency[1]}
								onChange={(e) =>
									updateFilter("frequency", [
										filters.frequency[0],
										parseInt(e.target.value, 10),
									])
								}
								className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
							/>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Est. Time: {filters.estimatedTime[0]} -{" "}
								{filters.estimatedTime[1]} min
							</label>
							<input
								type="range"
								min="0"
								max="180"
								value={filters.estimatedTime[1]}
								onChange={(e) =>
									updateFilter("estimatedTime", [
										filters.estimatedTime[0],
										parseInt(e.target.value, 10),
									])
								}
								className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
							/>
						</div>
					</div>
				</div>
			)}

			{/* Results */}
			<div className="space-y-4">
				{filteredProblems.map((problem) => (
					<div
						key={problem.id}
						className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
					>
						<div className="flex items-start justify-between mb-3">
							<div className="flex-1">
								<div className="flex items-center gap-3 mb-2">
									<h3 className="text-lg font-semibold text-gray-900 hover:text-blue-600 cursor-pointer">
										{problem.title}
									</h3>
									{problem.solved && (
										<CheckCircleIcon className="h-5 w-5 text-green-600" />
									)}
									<span
										className={`px-2 py-1 text-xs font-semibold rounded-full ${getDifficultyColor(problem.difficulty)}`}
									>
										{problem.difficulty}
									</span>
								</div>

								<div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
									<span className="flex items-center gap-1">
										<TagIcon className="h-4 w-4" />
										{problem.category}
									</span>
									<span className="flex items-center gap-1">
										<ChartBarIcon className="h-4 w-4" />
										{problem.acceptance}% accepted
									</span>
									<span className="flex items-center gap-1">
										<ClockIcon className="h-4 w-4" />~{problem.estimatedTime}{" "}
										min
									</span>
									{problem.rating > 0 && (
										<div className="flex items-center gap-1">
											{[...Array(5)].map((_, i) => (
												<StarIcon
													key={i}
													className={`h-4 w-4 ${i < problem.rating ? "text-yellow-400 fill-current" : "text-gray-300"}`}
												/>
											))}
										</div>
									)}
								</div>

								<p className="text-gray-700 text-sm mb-3 line-clamp-2">
									{problem.description}
								</p>

								<div className="flex flex-wrap gap-2 mb-3">
									{problem.algorithms.slice(0, 3).map((algorithm, index) => (
										<span
											key={index}
											className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full"
										>
											{algorithm}
										</span>
									))}
									{problem.companies.slice(0, 3).map((company, index) => (
										<span
											key={index}
											className="px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded-full"
										>
											{company}
										</span>
									))}
								</div>
							</div>

							<div className="flex flex-col items-end gap-2 ml-4">
								<div className="flex gap-2">
									<button className="p-2 hover:bg-gray-100 rounded-full">
										{problem.bookmarked ? (
											<BookmarkSolidIcon className="h-5 w-5 text-blue-600" />
										) : (
											<BookmarkIcon className="h-5 w-5 text-gray-400" />
										)}
									</button>
								</div>

								<div className="text-right text-xs text-gray-500">
									<div>Freq: {problem.frequency}</div>
									<div>{problem.timeComplexity[0]}</div>
									<div>{problem.spaceComplexity[0]}</div>
								</div>
							</div>
						</div>

						<div className="flex justify-between items-center pt-3 border-t border-gray-100">
							<div className="flex gap-2">
								<button className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors">
									Solve Now
								</button>
								<button className="px-4 py-2 bg-gray-100 text-gray-700 text-sm rounded-lg hover:bg-gray-200 transition-colors">
									View Editorial
								</button>
							</div>

							{problem.lastAttempted && (
								<span className="text-xs text-gray-500">
									Last attempted: {problem.lastAttempted}
								</span>
							)}
						</div>
					</div>
				))}

				{filteredProblems.length === 0 && (
					<div className="text-center py-12">
						<MagnifyingGlassIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
						<h3 className="text-lg font-medium text-gray-900 mb-2">
							No problems found
						</h3>
						<p className="text-gray-600">
							Try adjusting your search criteria or filters
						</p>
					</div>
				)}
			</div>
		</div>
	);
}
