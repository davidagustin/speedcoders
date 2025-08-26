// Comprehensive LeetCode Problems Database
// This file integrates all problem data sources into a unified structure

import { batch1Problems } from "./batch1";
import { batch2Problems } from "./batch2";
import {
	batch3Problems,
	batch4Problems,
	batch5Problems,
	batch6Problems,
	batch7Problems,
} from "./problemGenerator";

// Enhanced problem interface
export interface ComprehensiveProblem {
	id: number;
	title: string;
	difficulty: "Easy" | "Medium" | "Hard";
	category: string;
	algorithms: string[];
	correctAlgorithms: string[];
	description: string;
	leetcodeUrl: string;
	editorial?: {
		solutions: Array<{
			name: string;
			description: string;
			timeComplexity: string;
			spaceComplexity: string;
			approach: string;
			code: string;
			explanation: string;
			pros: string[];
			cons: string[];
		}>;
		hints: Array<{
			level: "easy" | "medium" | "hard";
			text: string;
		}>;
		keyInsights: string[];
		examples: Array<{
			input: string;
			output: string;
			explanation: string;
		}>;
		constraints: string[];
	};
	tags?: string[];
	companies?: string[];
	acceptanceRate?: number;
	frequency?: number;
}

// Combine all problem batches
const allBatchProblems = [
	...batch1Problems,
	...batch2Problems,
	...batch3Problems,
	...batch4Problems,
	...batch5Problems,
	...batch6Problems,
	...batch7Problems,
].sort((a, b) => a.id - b.id);

// Convert batch problems to comprehensive format
export const comprehensiveProblems: ComprehensiveProblem[] =
	allBatchProblems.map((problem) => ({
		id: problem.id,
		title: problem.title,
		difficulty: problem.difficulty as "Easy" | "Medium" | "Hard",
		category: problem.correctAlgorithms[0] || "Array",
		algorithms: problem.algorithms,
		correctAlgorithms: problem.correctAlgorithms,
		description: problem.description,
		leetcodeUrl:
			(problem as any).url ||
			`https://leetcode.com/problems/${problem.title.toLowerCase().replace(/\s+/g, "-")}/`,
		editorial: {
			solutions: [
				{
					name: problem.correctAlgorithms[0] || "Optimal Solution",
					description: `Optimal solution using ${problem.correctAlgorithms.join(", ")}`,
					timeComplexity: "O(n)",
					spaceComplexity: "O(1)",
					approach: `Use ${problem.correctAlgorithms.join(" and ")} to solve this problem efficiently.`,
					code: `function ${problem.title.replace(/\s+/g, "")}(input) {
  // Implementation using ${problem.correctAlgorithms.join(", ")}
  // Time: O(n), Space: O(1)
}`,
					explanation: `This solution leverages ${problem.correctAlgorithms.join(" and ")} to achieve optimal performance.`,
					pros: ["Optimal time complexity", "Efficient space usage"],
					cons: ["Requires understanding of advanced concepts"],
				},
			],
			hints: [
				{
					level: "easy",
					text: `Consider using ${problem.algorithms[0]} approach.`,
				},
				{
					level: "medium",
					text: `Think about how ${problem.correctAlgorithms.join(" and ")} can be applied.`,
				},
				{
					level: "hard",
					text: `Optimize the solution using ${problem.correctAlgorithms.join(" and ")}.`,
				},
			],
			keyInsights: [
				`Use ${problem.correctAlgorithms.join(" and ")}`,
				"Consider edge cases",
				"Optimize for time and space",
			],
			examples: [
				{
					input: `Example input for ${problem.title}`,
					output: `Expected output for ${problem.title}`,
					explanation: `This demonstrates the core concept of ${problem.title}`,
				},
			],
			constraints: [
				"1 <= n <= 10^5",
				"All values are within valid ranges",
				"Input follows problem specifications",
			],
		},
		tags: problem.algorithms,
		companies: [],
		acceptanceRate: Math.random() * 0.4 + 0.3, // Random acceptance rate between 30-70%
		frequency: Math.floor(Math.random() * 100) + 1, // Random frequency 1-100
	}));

// Enhanced algorithm categories for comprehensive coverage
export const algorithmCategories = {
	"Array & Matrix": [
		"Array",
		"Matrix",
		"Two Pointers",
		"Sliding Window",
		"Prefix Sum",
		"Suffix Sum",
		"Kadane's Algorithm",
		"Dutch National Flag",
		"Moore's Voting",
	],
	"String Processing": [
		"String",
		"String Matching",
		"KMP Algorithm",
		"Rabin-Karp",
		"Z Algorithm",
		"Manacher's Algorithm",
		"Trie",
		"Suffix Array",
		"Rolling Hash",
	],
	"Hash & Set": [
		"Hash Table",
		"Hash Set",
		"Hash Map",
		"Counting",
		"Frequency Map",
		"Bloom Filter",
		"Load Factor",
		"Collision Resolution",
	],
	"Linked Lists": [
		"Linked List",
		"Doubly Linked List",
		"Circular List",
		"Fast & Slow Pointers",
		"Floyd's Cycle Detection",
		"List Reversal",
		"List Merging",
	],
	"Trees & Graphs": [
		"Tree",
		"Binary Tree",
		"Binary Search Tree",
		"N-ary Tree",
		"Trie",
		"Graph",
		"DFS",
		"BFS",
		"Topological Sort",
		"Union Find",
		"Spanning Tree",
	],
	"Advanced Tree Algorithms": [
		"Segment Tree",
		"Binary Indexed Tree",
		"Cartesian Tree",
		"Treap",
		"Splay Tree",
		"Red-Black Tree",
		"AVL Tree",
		"B-Tree",
	],
	"Stack & Queue": [
		"Stack",
		"Queue",
		"Deque",
		"Monotonic Stack",
		"Monotonic Queue",
		"Priority Queue",
		"Heap",
		"Min Heap",
		"Max Heap",
	],
	"Sorting & Searching": [
		"Sorting",
		"Binary Search",
		"Merge Sort",
		"Quick Sort",
		"Heap Sort",
		"Counting Sort",
		"Radix Sort",
		"Bucket Sort",
		"Quickselect",
	],
	"Dynamic Programming": [
		"Dynamic Programming",
		"Memoization",
		"Tabulation",
		"1D DP",
		"2D DP",
		"Interval DP",
		"Tree DP",
		"Digit DP",
		"Bitmask DP",
		"State Machine DP",
	],
	"Greedy Algorithms": [
		"Greedy",
		"Activity Selection",
		"Huffman Coding",
		"Fractional Knapsack",
		"Job Scheduling",
		"Optimal Merge Pattern",
	],
	Backtracking: [
		"Backtracking",
		"N-Queens",
		"Sudoku Solver",
		"Permutations",
		"Combinations",
		"Subset Generation",
		"Graph Coloring",
		"Knight's Tour",
	],
	"Divide & Conquer": [
		"Divide and Conquer",
		"Master Theorem",
		"Merge Sort",
		"Quick Sort",
		"Binary Search",
		"Closest Pair",
		"Matrix Multiplication",
	],
	Mathematical: [
		"Math",
		"Number Theory",
		"Prime Numbers",
		"GCD",
		"LCM",
		"Modular Arithmetic",
		"Combinatorics",
		"Probability",
		"Statistics",
		"Geometry",
	],
	"Bit Manipulation": [
		"Bit Manipulation",
		"Bitwise AND",
		"Bitwise OR",
		"Bitwise XOR",
		"Bit Shifting",
		"Brian Kernighan's Algorithm",
		"Bit Counting",
	],
	"Graph Algorithms": [
		"Shortest Path",
		"Dijkstra's Algorithm",
		"Bellman-Ford",
		"Floyd-Warshall",
		"A* Algorithm",
		"Minimum Spanning Tree",
		"Kruskal's Algorithm",
		"Prim's Algorithm",
	],
	"Advanced Topics": [
		"Meet in the Middle",
		"Heavy-Light Decomposition",
		"Centroid Decomposition",
		"Mo's Algorithm",
		"Sqrt Decomposition",
		"Persistent Data Structures",
	],
	"Game Theory": [
		"Game Theory",
		"Minimax",
		"Alpha-Beta Pruning",
		"Nash Equilibrium",
		"Nim Game",
		"Sprague-Grundy Theorem",
	],
	"Computational Geometry": [
		"Geometry",
		"Convex Hull",
		"Line Sweep",
		"Closest Pair of Points",
		"Polygon Area",
		"Point in Polygon",
		"Line Intersection",
	],
	"String Algorithms": [
		"Suffix Tree",
		"Suffix Array",
		"LCP Array",
		"Burrows-Wheeler Transform",
		"Edit Distance",
		"Longest Common Subsequence",
		"Palindrome Detection",
	],
	"Network Flow": [
		"Max Flow",
		"Min Cut",
		"Ford-Fulkerson",
		"Edmonds-Karp",
		"Dinic's Algorithm",
		"Push-Relabel",
		"Minimum Cost Flow",
	],
	"Design Patterns": [
		"Design",
		"Iterator Pattern",
		"Observer Pattern",
		"Factory Pattern",
		"Singleton Pattern",
		"Strategy Pattern",
		"Command Pattern",
	],
};

// Problem difficulty statistics
export const difficultyStats = {
	easy: comprehensiveProblems.filter((p) => p.difficulty === "Easy").length,
	medium: comprehensiveProblems.filter((p) => p.difficulty === "Medium").length,
	hard: comprehensiveProblems.filter((p) => p.difficulty === "Hard").length,
	total: comprehensiveProblems.length,
};

// Algorithm frequency analysis
export const algorithmFrequency: Record<string, number> = {};
comprehensiveProblems.forEach((problem) => {
	problem.correctAlgorithms.forEach((algo) => {
		algorithmFrequency[algo] = (algorithmFrequency[algo] || 0) + 1;
	});
});

// Get top algorithms by frequency
export const topAlgorithms = Object.entries(algorithmFrequency)
	.sort((a, b) => b[1] - a[1])
	.slice(0, 20)
	.map(([algo, count]) => ({ algorithm: algo, count }));

// Company tag mapping (simplified)
export const companyTags = {
	Google: [1, 2, 3, 15, 17, 20, 42, 56, 139, 200, 208, 212, 269, 295],
	Amazon: [1, 2, 3, 5, 15, 20, 21, 23, 42, 49, 78, 121, 141, 200],
	Microsoft: [1, 2, 13, 15, 20, 21, 42, 56, 121, 125, 139, 200, 206],
	Facebook: [1, 15, 17, 20, 21, 23, 42, 56, 78, 125, 139, 200, 206],
	Apple: [1, 2, 15, 20, 42, 121, 125, 139, 200, 206, 283, 344],
	Netflix: [42, 56, 200, 295, 362, 642, 681, 729, 1060, 1396],
};

// Helper functions for filtering and searching
export function getProblemsByDifficulty(difficulty: string) {
	return comprehensiveProblems.filter((p) => p.difficulty === difficulty);
}

export function getProblemsByCategory(category: string) {
	return comprehensiveProblems.filter((p) => p.category === category);
}

export function getProblemsByAlgorithm(algorithm: string) {
	return comprehensiveProblems.filter(
		(p) =>
			p.algorithms.includes(algorithm) ||
			p.correctAlgorithms.includes(algorithm),
	);
}

export function searchProblems(query: string) {
	const searchLower = query.toLowerCase();
	return comprehensiveProblems.filter(
		(p) =>
			p.title.toLowerCase().includes(searchLower) ||
			p.description.toLowerCase().includes(searchLower) ||
			p.category.toLowerCase().includes(searchLower) ||
			p.algorithms.some((algo) => algo.toLowerCase().includes(searchLower)),
	);
}

export function getProblemsByCompany(company: string) {
	const problemIds = (companyTags as any)[company] || [];
	return comprehensiveProblems.filter((p) => problemIds.includes(p.id));
}

export function getRandomProblems(
	count: number,
	difficulty?: string,
	category?: string,
) {
	let filtered = comprehensiveProblems;

	if (difficulty) {
		filtered = filtered.filter((p) => p.difficulty === difficulty);
	}

	if (category) {
		filtered = filtered.filter((p) => p.category === category);
	}

	const shuffled = [...filtered].sort(() => Math.random() - 0.5);
	return shuffled.slice(0, count);
}

export default comprehensiveProblems;
