import { createClient } from "@/utils/supabase/server";

interface LeetCodeProblem {
	title: string;
	difficulty: string;
	description: string;
	examples: string[];
	constraints: string[];
	topics: string[];
	hints: string[];
	similarQuestions: string[];
	solutions: {
		approach: string;
		complexity: {
			time: string;
			space: string;
		};
		code: {
			python?: string;
			javascript?: string;
			java?: string;
			cpp?: string;
		};
	}[];
}

interface AlgorithmPattern {
	name: string;
	patterns: string[];
	keywords: string[];
	complexities: {
		time: string[];
		space: string[];
	};
}

const ALGORITHM_PATTERNS: AlgorithmPattern[] = [
	{
		name: "Two Pointers",
		patterns: ["two pointer", "left.*right", "start.*end", "sliding window"],
		keywords: ["sorted array", "palindrome", "sum equals", "container"],
		complexities: { time: ["O(n)", "O(n^2)"], space: ["O(1)"] },
	},
	{
		name: "Hash Table",
		patterns: ["hash", "map", "dictionary", "lookup", "complement"],
		keywords: ["frequency", "count", "duplicate", "two sum", "anagram"],
		complexities: { time: ["O(n)", "O(1)"], space: ["O(n)"] },
	},
	{
		name: "Binary Search",
		patterns: [
			"binary search",
			"mid.*point",
			"left.*right.*mid",
			"search space",
		],
		keywords: ["sorted", "rotated", "peak", "minimum", "maximum"],
		complexities: { time: ["O(log n)"], space: ["O(1)", "O(log n)"] },
	},
	{
		name: "Dynamic Programming",
		patterns: [
			"dp",
			"memoization",
			"tabulation",
			"subproblem",
			"optimal substructure",
		],
		keywords: [
			"fibonacci",
			"climbing stairs",
			"knapsack",
			"longest",
			"minimum cost",
		],
		complexities: { time: ["O(n^2)", "O(n*m)"], space: ["O(n)", "O(n^2)"] },
	},
	{
		name: "Breadth-First Search",
		patterns: ["bfs", "queue", "level.*order", "shortest path"],
		keywords: ["tree level", "shortest", "minimum steps", "layer"],
		complexities: { time: ["O(V+E)", "O(n)"], space: ["O(n)"] },
	},
	{
		name: "Depth-First Search",
		patterns: [
			"dfs",
			"recursion",
			"backtrack",
			"preorder",
			"inorder",
			"postorder",
		],
		keywords: ["path", "connected", "cycle", "tree traversal"],
		complexities: { time: ["O(V+E)", "O(n)"], space: ["O(h)", "O(n)"] },
	},
	{
		name: "Greedy",
		patterns: ["greedy", "local.*optimal", "best.*choice", "maximum.*minimum"],
		keywords: ["interval", "scheduling", "huffman", "activity selection"],
		complexities: { time: ["O(n log n)", "O(n)"], space: ["O(1)"] },
	},
	{
		name: "Backtracking",
		patterns: [
			"backtrack",
			"explore.*paths",
			"generate.*combinations",
			"permutation",
		],
		keywords: ["subset", "permutation", "combination", "n-queens", "sudoku"],
		complexities: { time: ["O(2^n)", "O(n!)"], space: ["O(n)"] },
	},
	{
		name: "Sliding Window",
		patterns: ["window", "subarray", "substring", "contiguous"],
		keywords: ["maximum sum", "longest substring", "minimum window"],
		complexities: { time: ["O(n)"], space: ["O(1)", "O(k)"] },
	},
	{
		name: "Union Find",
		patterns: ["union.*find", "disjoint set", "connected components"],
		keywords: ["islands", "accounts merge", "friend circles"],
		complexities: { time: ["O(α(n))"], space: ["O(n)"] },
	},
	{
		name: "Trie",
		patterns: ["trie", "prefix tree", "autocomplete"],
		keywords: ["word search", "prefix", "dictionary"],
		complexities: { time: ["O(m)"], space: ["O(ALPHABET_SIZE * m)"] },
	},
	{
		name: "Heap/Priority Queue",
		patterns: ["heap", "priority queue", "top k", "kth largest"],
		keywords: ["median", "k closest", "merge k", "skyline"],
		complexities: { time: ["O(n log k)", "O(log n)"], space: ["O(k)", "O(n)"] },
	},
	{
		name: "Graph Algorithms",
		patterns: ["dijkstra", "bellman.*ford", "floyd.*warshall", "topological"],
		keywords: ["shortest path", "minimum spanning tree", "network delay"],
		complexities: { time: ["O(V^2)", "O(ElogV)"], space: ["O(V)"] },
	},
	{
		name: "Bit Manipulation",
		patterns: ["bit", "xor", "and.*or", "shift", "mask"],
		keywords: ["single number", "power of", "counting bits", "hamming"],
		complexities: { time: ["O(1)", "O(log n)"], space: ["O(1)"] },
	},
	{
		name: "Math",
		patterns: ["gcd", "lcm", "prime", "factorial", "modulo"],
		keywords: ["palindrome number", "reverse integer", "excel sheet"],
		complexities: { time: ["O(log n)", "O(sqrt(n))"], space: ["O(1)"] },
	},
	{
		name: "Sorting",
		patterns: ["quick.*sort", "merge.*sort", "heap.*sort", "bucket.*sort"],
		keywords: ["kth element", "top k frequent", "sort colors"],
		complexities: { time: ["O(n log n)", "O(n^2)"], space: ["O(1)", "O(n)"] },
	},
	{
		name: "Binary Tree",
		patterns: ["tree", "binary tree", "bst", "traversal"],
		keywords: ["diameter", "height", "balanced", "symmetric"],
		complexities: { time: ["O(n)"], space: ["O(h)", "O(n)"] },
	},
	{
		name: "Linked List",
		patterns: ["linked list", "node", "reverse", "cycle detection"],
		keywords: ["merge lists", "reverse", "cycle", "middle node"],
		complexities: { time: ["O(n)"], space: ["O(1)"] },
	},
	{
		name: "Stack",
		patterns: ["stack", "push.*pop", "lifo", "monotonic stack"],
		keywords: ["valid parentheses", "daily temperatures", "largest rectangle"],
		complexities: { time: ["O(n)"], space: ["O(n)"] },
	},
	{
		name: "Queue",
		patterns: ["queue", "enqueue.*dequeue", "fifo"],
		keywords: ["moving average", "recent calls", "task scheduler"],
		complexities: { time: ["O(1)"], space: ["O(n)"] },
	},
];

export function detectAlgorithmsFromProblem(
	problem: LeetCodeProblem,
): string[] {
	const detectedAlgorithms = new Set<string>();
	const content =
		`${problem.description} ${problem.solutions.map((s) => s.approach).join(" ")}`.toLowerCase();

	for (const algo of ALGORITHM_PATTERNS) {
		// Check patterns
		for (const pattern of algo.patterns) {
			const regex = new RegExp(pattern, "i");
			if (regex.test(content)) {
				detectedAlgorithms.add(algo.name);
				break;
			}
		}

		// Check keywords
		for (const keyword of algo.keywords) {
			if (content.includes(keyword.toLowerCase())) {
				detectedAlgorithms.add(algo.name);
				break;
			}
		}

		// Check complexity matches
		for (const solution of problem.solutions) {
			if (
				algo.complexities.time.includes(solution.complexity.time) ||
				algo.complexities.space.includes(solution.complexity.space)
			) {
				detectedAlgorithms.add(algo.name);
			}
		}
	}

	return Array.from(detectedAlgorithms);
}

export async function fetchLeetCodeProblem(
	slug: string,
): Promise<LeetCodeProblem | null> {
	// This would normally fetch from LeetCode API or scrape
	// For now, returning mock data based on Two Sum problem
	if (slug === "two-sum") {
		return {
			title: "Two Sum",
			difficulty: "Easy",
			description:
				"Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume that each input would have exactly one solution, and you may not use the same element twice.",
			examples: [
				"Input: nums = [2,7,11,15], target = 9\nOutput: [0,1]\nExplanation: Because nums[0] + nums[1] == 9, we return [0, 1].",
				"Input: nums = [3,2,4], target = 6\nOutput: [1,2]",
				"Input: nums = [3,3], target = 6\nOutput: [0,1]",
			],
			constraints: [
				"2 <= nums.length <= 10^4",
				"-10^9 <= nums[i] <= 10^9",
				"-10^9 <= target <= 10^9",
				"Only one valid answer exists",
			],
			topics: ["Array", "Hash Table"],
			hints: [
				"A really brute force way would be to search for all possible pairs of numbers but that would be too slow.",
				"So, if we fix one of the numbers, say x, we have to scan the entire array to find the next number y which is value - x.",
				"Can we change our array somehow so that this search becomes faster?",
				"The second train of thought is, without changing the array, can we use additional space somehow?",
			],
			solutions: [
				{
					approach: "Brute Force: Check all pairs using nested loops",
					complexity: { time: "O(n^2)", space: "O(1)" },
					code: {
						python: `def twoSum(nums, target):
    for i in range(len(nums)):
        for j in range(i + 1, len(nums)):
            if nums[i] + nums[j] == target:
                return [i, j]`,
						javascript: `function twoSum(nums, target) {
    for (let i = 0; i < nums.length; i++) {
        for (let j = i + 1; j < nums.length; j++) {
            if (nums[i] + nums[j] === target) {
                return [i, j];
            }
        }
    }
}`,
					},
				},
				{
					approach:
						"Hash Table: Use a hash map to store complements for O(1) lookup",
					complexity: { time: "O(n)", space: "O(n)" },
					code: {
						python: `def twoSum(nums, target):
    hashmap = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in hashmap:
            return [hashmap[complement], i]
        hashmap[num] = i`,
						javascript: `function twoSum(nums, target) {
    const map = new Map();
    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];
        if (map.has(complement)) {
            return [map.get(complement), i];
        }
        map.set(nums[i], i);
    }
}`,
					},
				},
			],
			similarQuestions: [],
		};
	}
	return null;
}

export async function saveProblemToDatabase(
	problem: LeetCodeProblem,
	slug: string,
) {
	const supabase = await createClient();

	// Save problem
	const { data: savedProblem, error: problemError } = await supabase
		.from("problems")
		.upsert({
			slug,
			title: problem.title,
			difficulty: problem.difficulty,
			description: problem.description,
			examples: JSON.stringify(problem.examples),
			constraints: JSON.stringify(problem.constraints),
			topics: problem.topics,
			hints: problem.hints,
			solutions: JSON.stringify(problem.solutions),
			leetcode_url: `https://leetcode.com/problems/${slug}/`,
		})
		.select()
		.single();

	if (problemError) throw problemError;

	// Save detected algorithms
	const algorithms = detectAlgorithmsFromProblem(problem);
	for (const algo of algorithms) {
		await supabase.from("problem_algorithms").upsert({
			problem_id: savedProblem.id,
			algorithm_name: algo,
		});
	}

	return savedProblem;
}

export async function createQuizFromProblems(
	problemSlugs: string[],
	title: string,
	timeLimit: number = 30,
) {
	const supabase = await createClient();

	// Create quiz
	const { data: quiz, error: quizError } = await supabase
		.from("quizzes")
		.insert({
			title,
			description: `Practice quiz with ${problemSlugs.length} LeetCode problems`,
			difficulty: "Mixed",
			time_limit: timeLimit,
			is_active: true,
		})
		.select()
		.single();

	if (quizError) throw quizError;

	// Add problems to quiz
	for (let i = 0; i < problemSlugs.length; i++) {
		const problem = await fetchLeetCodeProblem(problemSlugs[i]);
		if (problem) {
			const savedProblem = await saveProblemToDatabase(
				problem,
				problemSlugs[i],
			);

			await supabase.from("quiz_questions").insert({
				quiz_id: quiz.id,
				problem_id: savedProblem.id,
				order: i + 1,
			});
		}
	}

	return quiz;
}
