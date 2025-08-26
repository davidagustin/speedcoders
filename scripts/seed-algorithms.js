const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const algorithms = [
	// Sorting Algorithms
	{
		name: "Bubble Sort",
		category: "Sorting",
		description:
			"A simple sorting algorithm that repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order.",
		timeComplexity: "O(n²)",
		spaceComplexity: "O(1)",
		examples: JSON.stringify([
			{
				input: "[64, 34, 25, 12, 22, 11, 90]",
				output: "[11, 12, 22, 25, 34, 64, 90]",
				explanation:
					"Repeatedly swap adjacent elements if they are in wrong order.",
			},
		]),
	},
	{
		name: "Quick Sort",
		category: "Sorting",
		description:
			"A highly efficient, comparison-based sorting algorithm that uses a divide-and-conquer strategy.",
		timeComplexity: "O(n log n) average, O(n²) worst",
		spaceComplexity: "O(log n)",
		examples: JSON.stringify([
			{
				input: "[10, 7, 8, 9, 1, 5]",
				output: "[1, 5, 7, 8, 9, 10]",
				explanation:
					"Choose pivot, partition around it, recursively sort subarrays.",
			},
		]),
	},
	{
		name: "Merge Sort",
		category: "Sorting",
		description:
			"A stable, divide-and-conquer sorting algorithm that produces a sorted array by merging sorted subarrays.",
		timeComplexity: "O(n log n)",
		spaceComplexity: "O(n)",
		examples: JSON.stringify([
			{
				input: "[38, 27, 43, 3, 9, 82, 10]",
				output: "[3, 9, 10, 27, 38, 43, 82]",
				explanation:
					"Divide into halves, recursively sort, merge sorted halves.",
			},
		]),
	},

	// Searching Algorithms
	{
		name: "Binary Search",
		category: "Searching",
		description:
			"An efficient algorithm for finding an element in a sorted array by repeatedly dividing the search interval in half.",
		timeComplexity: "O(log n)",
		spaceComplexity: "O(1)",
		examples: JSON.stringify([
			{
				input: "Array: [1, 3, 5, 7, 9, 11, 13], Target: 7",
				output: "Index: 3",
				explanation:
					"Compare with middle element, eliminate half of remaining elements.",
			},
		]),
	},
	{
		name: "Linear Search",
		category: "Searching",
		description:
			"A simple search algorithm that checks each element in the list sequentially until the target is found.",
		timeComplexity: "O(n)",
		spaceComplexity: "O(1)",
		examples: JSON.stringify([
			{
				input: "Array: [4, 2, 7, 1, 9, 3], Target: 7",
				output: "Index: 2",
				explanation: "Check each element from start to end until found.",
			},
		]),
	},

	// Graph Algorithms
	{
		name: "Depth-First Search (DFS)",
		category: "Graph",
		description:
			"A graph traversal algorithm that explores as far as possible along each branch before backtracking.",
		timeComplexity: "O(V + E)",
		spaceComplexity: "O(V)",
		examples: JSON.stringify([
			{
				input: "Graph with nodes: A->B->C, A->D",
				output: "Traversal: A, B, C, D",
				explanation: "Explore deep into one path before backtracking.",
			},
		]),
	},
	{
		name: "Breadth-First Search (BFS)",
		category: "Graph",
		description:
			"A graph traversal algorithm that explores all vertices at the present depth before moving to vertices at the next depth level.",
		timeComplexity: "O(V + E)",
		spaceComplexity: "O(V)",
		examples: JSON.stringify([
			{
				input: "Graph with nodes: A->B->C, A->D",
				output: "Traversal: A, B, D, C",
				explanation:
					"Explore all neighbors at current level before going deeper.",
			},
		]),
	},

	// Dynamic Programming
	{
		name: "Fibonacci with Memoization",
		category: "Dynamic Programming",
		description:
			"An optimization technique that stores the results of expensive function calls and returns the cached result when the same inputs occur again.",
		timeComplexity: "O(n)",
		spaceComplexity: "O(n)",
		examples: JSON.stringify([
			{
				input: "n = 10",
				output: "55",
				explanation:
					"Store previously calculated Fibonacci numbers to avoid recalculation.",
			},
		]),
	},
	{
		name: "Longest Common Subsequence",
		category: "Dynamic Programming",
		description:
			"A classic dynamic programming problem to find the longest subsequence present in both strings in the same order.",
		timeComplexity: "O(m*n)",
		spaceComplexity: "O(m*n)",
		examples: JSON.stringify([
			{
				input: "str1 = 'ABCDGH', str2 = 'AEDFHR'",
				output: "Length: 3, LCS: 'ADH'",
				explanation: "Build DP table to find optimal substructure.",
			},
		]),
	},

	// Tree Algorithms
	{
		name: "Inorder Traversal",
		category: "Tree",
		description:
			"A tree traversal method that visits the left subtree, then the root, then the right subtree.",
		timeComplexity: "O(n)",
		spaceComplexity: "O(h)",
		examples: JSON.stringify([
			{
				input: "Tree: 1->2->3",
				output: "Traversal: 2, 1, 3",
				explanation: "Visit left child, then root, then right child.",
			},
		]),
	},
	{
		name: "Level Order Traversal",
		category: "Tree",
		description:
			"A tree traversal method that visits all nodes at the current depth before moving to nodes at the next depth level.",
		timeComplexity: "O(n)",
		spaceComplexity: "O(w)",
		examples: JSON.stringify([
			{
				input: "Tree: 1->2->3",
				output: "Traversal: 1, 2, 3",
				explanation: "Use queue to process nodes level by level.",
			},
		]),
	},

	// String Algorithms
	{
		name: "KMP Algorithm",
		category: "String",
		description:
			"A string matching algorithm that uses information about the pattern to skip unnecessary comparisons.",
		timeComplexity: "O(m+n)",
		spaceComplexity: "O(m)",
		examples: JSON.stringify([
			{
				input: "Text: 'ABABCABCABAB', Pattern: 'ABC'",
				output: "Found at index: 2, 5",
				explanation: "Use failure function to skip comparisons.",
			},
		]),
	},
	{
		name: "Rabin-Karp Algorithm",
		category: "String",
		description:
			"A string searching algorithm that uses hashing to find patterns in text.",
		timeComplexity: "O(m+n) average, O(m*n) worst",
		spaceComplexity: "O(1)",
		examples: JSON.stringify([
			{
				input: "Text: 'GEEKS FOR GEEKS', Pattern: 'GEEK'",
				output: "Found at index: 0, 10",
				explanation: "Use rolling hash to compare pattern with text windows.",
			},
		]),
	},

	// Array Algorithms
	{
		name: "Kadane's Algorithm",
		category: "Array",
		description:
			"An algorithm to find the maximum sum of a contiguous subarray in an array of numbers.",
		timeComplexity: "O(n)",
		spaceComplexity: "O(1)",
		examples: JSON.stringify([
			{
				input: "[-2, 1, -3, 4, -1, 2, 1, -5, 4]",
				output: "Maximum sum: 6, Subarray: [4, -1, 2, 1]",
				explanation: "Keep track of current sum and maximum sum seen so far.",
			},
		]),
	},
	{
		name: "Two Pointers Technique",
		category: "Array",
		description:
			"A technique that uses two pointers to solve problems involving arrays, often for searching pairs or subarrays.",
		timeComplexity: "O(n)",
		spaceComplexity: "O(1)",
		examples: JSON.stringify([
			{
				input: "Sorted array: [1, 2, 3, 4, 5, 6], Target: 7",
				output: "Pairs: (1,6), (2,5), (3,4)",
				explanation: "Use left and right pointers to find pairs efficiently.",
			},
		]),
	},
];

async function seedAlgorithms() {
	console.log("🌱 Starting to seed algorithms...");

	try {
		for (const algorithm of algorithms) {
			const existingAlgorithm = await prisma.algorithm.findUnique({
				where: { name: algorithm.name },
			});

			if (existingAlgorithm) {
				console.log(`⏭️  Skipping "${algorithm.name}" - already exists`);
				continue;
			}

			const createdAlgorithm = await prisma.algorithm.create({
				data: algorithm,
			});

			console.log(
				`✅ Created: "${createdAlgorithm.name}" (${createdAlgorithm.category})`,
			);
		}

		console.log("🎉 Algorithm seeding completed!");

		// Print summary
		const totalAlgorithms = await prisma.algorithm.count();
		const categories = await prisma.algorithm.groupBy({
			by: ["category"],
			_count: {
				category: true,
			},
		});

		console.log("\n📊 Summary:");
		console.log(`Total Algorithms: ${totalAlgorithms}`);
		console.log("By Category:");
		categories.forEach((cat) => {
			console.log(`  ${cat.category}: ${cat._count.category}`);
		});
	} catch (error) {
		console.error("❌ Error seeding algorithms:", error);
	} finally {
		await prisma.$disconnect();
	}
}

// Run the seeding
seedAlgorithms();
