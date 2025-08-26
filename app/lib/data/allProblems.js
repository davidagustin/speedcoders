// Complete LeetCode Problems Database - All 3662 Problems
import { batch1Problems } from "./batch1";
import { batch2Problems } from "./batch2";
import {
	batch3Problems,
	batch4Problems,
	batch5Problems,
	batch6Problems,
	batch7Problems,
} from "./problemGenerator";

// Combine all problem batches
export const allLeetcodeProblems = [
	...batch1Problems,
	...batch2Problems,
	...batch3Problems,
	...batch4Problems,
	...batch5Problems,
	...batch6Problems,
	...batch7Problems,
].sort((a, b) => a.id - b.id);

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
	easy: allLeetcodeProblems.filter((p) => p.difficulty === "Easy").length,
	medium: allLeetcodeProblems.filter((p) => p.difficulty === "Medium").length,
	hard: allLeetcodeProblems.filter((p) => p.difficulty === "Hard").length,
	total: allLeetcodeProblems.length,
};

// Algorithm frequency analysis
export const algorithmFrequency = {};
allLeetcodeProblems.forEach((problem) => {
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

export default allLeetcodeProblems;
