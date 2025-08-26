import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function POST() {
	try {
		const supabase = await createClient();

		const batch3Problems = [
			{
				id: 1001,
				title: "Grid Illumination",
				difficulty: "Hard",
				category: "Hash Table",
				algorithms: ["Hash Table", "Simulation"],
				description:
					"On a N x N grid of cells, each cell (x, y) with 0 <= x < N and 0 <= y < N has a lamp. Initially, some number of lamps are on. lamps[i] tells us the location of the i-th lamp that is on. Each lamp that is on illuminates every square on its x-axis, y-axis, and both diagonals (similar to a Queen in chess). For the i-th query queries[i] = (x, y), the answer to the query is 1 if the cell (x, y) is illuminated, else 0. After each query (x, y), we turn off any lamps that are at cell (x, y) or are adjacent 8-directionally (ie., share a corner or edge with cell (x, y).)",
				leetcodeUrl: "https://leetcode.com/problems/grid-illumination/",
			},
			{
				id: 1002,
				title: "Find Common Characters",
				difficulty: "Easy",
				category: "Array",
				algorithms: ["Hash Table", "String"],
				description:
					"Given an array A of strings made only from lowercase letters, return a list of all characters that show up in all strings within the list (including duplicates). For example, if a character occurs 3 times in all strings but not 4 times, you need to include that character three times in the final answer.",
				leetcodeUrl: "https://leetcode.com/problems/find-common-characters/",
			},
			{
				id: 1003,
				title: "Check If Word Is Valid After Substitutions",
				difficulty: "Medium",
				category: "String",
				algorithms: ["Stack", "String"],
				description:
					"We are given that the string 'abc' is valid. From any valid string V, we may split V into two pieces X and Y such that X + Y (X concatenated with Y) is equal to V. (X or Y may be empty.) Then, X + 'abc' + Y is also valid.",
				leetcodeUrl:
					"https://leetcode.com/problems/check-if-word-is-valid-after-substitutions/",
			},
			{
				id: 1004,
				title: "Max Consecutive Ones III",
				difficulty: "Medium",
				category: "Array",
				algorithms: ["Sliding Window", "Two Pointers"],
				description:
					"Given a binary array nums and an integer k, return the maximum number of consecutive 1's in the array if you can flip at most k 0's.",
				leetcodeUrl: "https://leetcode.com/problems/max-consecutive-ones-iii/",
			},
			{
				id: 1005,
				title: "Maximize Sum Of Array After K Negations",
				difficulty: "Easy",
				category: "Array",
				algorithms: ["Greedy", "Sorting"],
				description:
					"Given an array A of integers, we must modify the array in the following way: we choose an i and replace A[i] with -A[i], and we repeat this process K times in total. Return the largest possible sum of the array after modifying it in this way.",
				leetcodeUrl:
					"https://leetcode.com/problems/maximize-sum-of-array-after-k-negations/",
			},
			{
				id: 1006,
				title: "Clumsy Factorial",
				difficulty: "Medium",
				category: "Math",
				algorithms: ["Math", "Simulation"],
				description:
					"Normally, the factorial of a positive integer n is the product of all positive integers less than or equal to n. We instead make a clumsy factorial: using the integers in decreasing order, we swap out the multiply operations for a fixed rotation of operations: multiply (*), divide (/), add (+) and subtract (-) in this order.",
				leetcodeUrl: "https://leetcode.com/problems/clumsy-factorial/",
			},
			{
				id: 1007,
				title: "Minimum Domino Rotations For Equal Row",
				difficulty: "Medium",
				category: "Array",
				algorithms: ["Greedy", "Array"],
				description:
					"In a row of dominoes, A[i] and B[i] represent the top and bottom halves of the i-th domino. We may rotate the i-th domino, so that A[i] and B[i] swap values. Return the minimum number of rotations so that all the values in A are the same, or all the values in B are the same.",
				leetcodeUrl:
					"https://leetcode.com/problems/minimum-domino-rotations-for-equal-row/",
			},
			{
				id: 1008,
				title: "Construct Binary Search Tree from Preorder Traversal",
				difficulty: "Medium",
				category: "Tree",
				algorithms: ["Tree", "Recursion", "Stack"],
				description:
					"Return the root node of a binary search tree that matches the given preorder traversal.",
				leetcodeUrl:
					"https://leetcode.com/problems/construct-binary-search-tree-from-preorder-traversal/",
			},
			{
				id: 1009,
				title: "Complement of Base 10 Integer",
				difficulty: "Easy",
				category: "Bit Manipulation",
				algorithms: ["Bit Manipulation"],
				description:
					"Every non-negative integer N has a binary representation. The complement of a binary representation is the number in binary you get when changing every 1 to a 0 and 0 to a 1.",
				leetcodeUrl:
					"https://leetcode.com/problems/complement-of-base-10-integer/",
			},
			{
				id: 1010,
				title: "Pairs of Songs With Total Durations Divisible by 60",
				difficulty: "Medium",
				category: "Array",
				algorithms: ["Hash Table", "Math"],
				description:
					"In a list of songs, the i-th song has a duration of time[i] seconds. Return the number of pairs of songs for which their total duration in seconds is divisible by 60.",
				leetcodeUrl:
					"https://leetcode.com/problems/pairs-of-songs-with-total-durations-divisible-by-60/",
			},
			{
				id: 1011,
				title: "Capacity To Ship Packages Within D Days",
				difficulty: "Medium",
				category: "Binary Search",
				algorithms: ["Binary Search", "Greedy"],
				description:
					"A conveyor belt has packages that must be shipped from one port to another within days days. The ith package on the conveyor belt has a weight of weights[i]. Each day, we load the ship with packages on the conveyor belt. We may not load more weight than the maximum weight capacity of the ship. Return the least weight capacity of the ship that will result in all the packages on the conveyor belt being shipped within days days.",
				leetcodeUrl:
					"https://leetcode.com/problems/capacity-to-ship-packages-within-d-days/",
			},
			{
				id: 1012,
				title: "Numbers With Repeated Digits",
				difficulty: "Hard",
				category: "Dynamic Programming",
				algorithms: ["Dynamic Programming", "Math"],
				description:
					"Given an integer n, return the number of positive integers in the range [1, n] that have at least one repeated digit.",
				leetcodeUrl:
					"https://leetcode.com/problems/numbers-with-repeated-digits/",
			},
			{
				id: 1013,
				title: "Partition Array Into Three Parts With Equal Sum",
				difficulty: "Easy",
				category: "Array",
				algorithms: ["Array", "Prefix Sum"],
				description:
					"Given an array of integers arr, return true if we can partition the array into three non-empty parts with equal sums.",
				leetcodeUrl:
					"https://leetcode.com/problems/partition-array-into-three-parts-with-equal-sum/",
			},
			{
				id: 1014,
				title: "Best Sightseeing Pair",
				difficulty: "Medium",
				category: "Array",
				algorithms: ["Array", "Dynamic Programming"],
				description:
					"You are given an integer array values where values[i] represents the value of the ith sightseeing spot. Two sightseeing spots i and j have a distance j - i between them. The score of a pair (i < j) of sightseeing spots is values[i] + values[j] + i - j. Return the maximum score of a pair of sightseeing spots.",
				leetcodeUrl: "https://leetcode.com/problems/best-sightseeing-pair/",
			},
			{
				id: 1015,
				title: "Smallest Integer Divisible by K",
				difficulty: "Medium",
				category: "Math",
				algorithms: ["Math", "Modular Arithmetic"],
				description:
					"Given a positive integer k, you need to find the length of the smallest positive integer n such that n is divisible by k, and n only contains the digit 1. Return the length of n. If there is no such n, return -1.",
				leetcodeUrl:
					"https://leetcode.com/problems/smallest-integer-divisible-by-k/",
			},
			{
				id: 1016,
				title: "Binary String With Substrings Representing 1 To N",
				difficulty: "Medium",
				category: "String",
				algorithms: ["String", "Bit Manipulation"],
				description:
					"Given a binary string s and a positive integer n, return true if the binary representation of all the integers in the range [1, n] are substrings of s, or false otherwise.",
				leetcodeUrl:
					"https://leetcode.com/problems/binary-string-with-substrings-representing-1-to-n/",
			},
			{
				id: 1017,
				title: "Convert to Base -2",
				difficulty: "Medium",
				category: "Math",
				algorithms: ["Math", "Bit Manipulation"],
				description:
					"Given an integer n, return a binary string representing its representation in base -2.",
				leetcodeUrl: "https://leetcode.com/problems/convert-to-base-2/",
			},
			{
				id: 1018,
				title: "Binary Prefix Divisible By 5",
				difficulty: "Easy",
				category: "Array",
				algorithms: ["Array", "Math"],
				description:
					"You are given a binary array nums (0-indexed). We define xi as the number whose binary representation is the subarray nums[0..i]. Return an array of booleans answer where answer[i] is true if xi is divisible by 5.",
				leetcodeUrl:
					"https://leetcode.com/problems/binary-prefix-divisible-by-5/",
			},
			{
				id: 1019,
				title: "Next Greater Node In Linked List",
				difficulty: "Medium",
				category: "Linked List",
				algorithms: ["Linked List", "Stack"],
				description:
					"You are given the head of a linked list with n nodes. For each node in the list, find the value of the next greater node. That is, for each node, find the value of the first node that is next to it and has a strictly larger value than it.",
				leetcodeUrl:
					"https://leetcode.com/problems/next-greater-node-in-linked-list/",
			},
			{
				id: 1020,
				title: "Number of Enclaves",
				difficulty: "Medium",
				category: "Graph",
				algorithms: ["DFS", "BFS"],
				description:
					"You are given an m x n binary matrix grid, where 0 represents a sea cell and 1 represents a land cell. A move consists of walking from one land cell to another adjacent (4-directionally) land cell or walking off the boundary of the grid. Return the number of land cells in grid for which we cannot walk off the boundary of the grid in any number of moves.",
				leetcodeUrl: "https://leetcode.com/problems/number-of-enclaves/",
			},
			{
				id: 1021,
				title: "Remove Outermost Parentheses",
				difficulty: "Easy",
				category: "String",
				algorithms: ["String", "Stack"],
				description:
					"A valid parentheses string s is primitive if it is nonempty, and there does not exist a way to split it into s = A + B, with A and B nonempty valid parentheses strings. Given a valid parentheses string s, consider its primitive decomposition: s = P1 + P2 + ... + Pk, where Pi are primitive valid parentheses strings. Return s after removing the outermost parentheses of every primitive string in the primitive decomposition of s.",
				leetcodeUrl:
					"https://leetcode.com/problems/remove-outermost-parentheses/",
			},
			{
				id: 1022,
				title: "Sum of Root To Leaf Binary Numbers",
				difficulty: "Easy",
				category: "Tree",
				algorithms: ["Tree", "DFS"],
				description:
					"You are given the root of a binary tree where each node has a value 0 or 1. Each root-to-leaf path represents a binary number starting with the most significant bit. For all leaves in the tree, consider the numbers represented by the path from the root to that leaf. Return the sum of these numbers.",
				leetcodeUrl:
					"https://leetcode.com/problems/sum-of-root-to-leaf-binary-numbers/",
			},
			{
				id: 1023,
				title: "Camelcase Matching",
				difficulty: "Medium",
				category: "String",
				algorithms: ["String", "Two Pointers"],
				description:
					"Given an array of strings queries and a string pattern, return a boolean array answer where answer[i] is true if queries[i] matches pattern, and false otherwise. A query word queries[i] matches pattern if you can insert lowercase English letters pattern so that it equals the query.",
				leetcodeUrl: "https://leetcode.com/problems/camelcase-matching/",
			},
			{
				id: 1024,
				title: "Video Stitching",
				difficulty: "Medium",
				category: "Dynamic Programming",
				algorithms: ["Dynamic Programming", "Greedy"],
				description:
					"You are given a series of video clips from a sporting event that lasted time seconds. These video clips can be overlapping with each other and have varying lengths. Each video clip is described by an array clips where clips[i] = [starti, endi] indicates that the ith clip started at starti and ended at endi. Return the minimum number of clips needed so that we can cut the clips into segments that cover the entire sporting event [0, time].",
				leetcodeUrl: "https://leetcode.com/problems/video-stitching/",
			},
			{
				id: 1025,
				title: "Divisor Game",
				difficulty: "Easy",
				category: "Math",
				algorithms: ["Math", "Dynamic Programming"],
				description:
					"Alice and Bob take turns playing a game, with Alice starting first. Initially, there is a number n on the chalkboard. On each player's turn, that player makes a move consisting of: Choosing any x with 0 < x < n and n % x == 0. Replacing the number n on the chalkboard with n - x. Also, if a player cannot make a move, they lose the game. Return true if and only if Alice wins the game, assuming both players play optimally.",
				leetcodeUrl: "https://leetcode.com/problems/divisor-game/",
			},
			{
				id: 1026,
				title: "Maximum Difference Between Node and Ancestor",
				difficulty: "Medium",
				category: "Tree",
				algorithms: ["Tree", "DFS"],
				description:
					"Given the root of a binary tree, find the maximum value v for which there exist different nodes a and b where v = |a.val - b.val| and a is an ancestor of b.",
				leetcodeUrl:
					"https://leetcode.com/problems/maximum-difference-between-node-and-ancestor/",
			},
			{
				id: 1027,
				title: "Longest Arithmetic Subsequence",
				difficulty: "Medium",
				category: "Dynamic Programming",
				algorithms: ["Dynamic Programming", "Hash Table"],
				description:
					"Given an array nums of integers, return the length of the longest arithmetic subsequence in nums. Recall that a subsequence of an array nums is a list nums[i1], nums[i2], ..., nums[ik] with 0 <= i1 < i2 < ... < ik <= nums.length - 1, and that a sequence seq is arithmetic if seq[i+1] - seq[i] are all the same value.",
				leetcodeUrl:
					"https://leetcode.com/problems/longest-arithmetic-subsequence/",
			},
			{
				id: 1028,
				title: "Recover a Tree From Preorder Traversal",
				difficulty: "Hard",
				category: "Tree",
				algorithms: ["Tree", "Stack"],
				description:
					"We run a preorder depth-first search (DFS) on the root of a binary tree. At each node in this traversal, we output D dashes (where D is the depth of this node), then we output the value of this node. If the depth of a node is D, the depth of its immediate child is D + 1. The depth of the root node is 0. If a node has only one child, that child is guaranteed to be the left child. Given the output S of this traversal, recover the tree and return its root.",
				leetcodeUrl:
					"https://leetcode.com/problems/recover-a-tree-from-preorder-traversal/",
			},
			{
				id: 1029,
				title: "Two City Scheduling",
				difficulty: "Medium",
				category: "Greedy",
				algorithms: ["Greedy", "Sorting"],
				description:
					"A company is planning to interview 2n people. Given the array costs where costs[i] = [aCosti, bCosti], the cost of flying the ith person to city A is aCosti, and the cost of flying the ith person to city B is bCosti. Return the minimum cost to fly every person to a city such that exactly n people arrive in each city.",
				leetcodeUrl: "https://leetcode.com/problems/two-city-scheduling/",
			},
			{
				id: 1030,
				title: "Matrix Cells in Distance Order",
				difficulty: "Easy",
				category: "Array",
				algorithms: ["Array", "Sorting"],
				description:
					"You are given four integers row, cols, rCenter, and cCenter. There is a rows x cols matrix and you are on the cell with the coordinates (rCenter, cCenter). Return the coordinates of all cells in the matrix, sorted by their distance from (rCenter, cCenter) from the smallest distance to the largest distance.",
				leetcodeUrl:
					"https://leetcode.com/problems/matrix-cells-in-distance-order/",
			},
			// Add more problems from batch3 as needed...
		];

		const { data, error } = await supabase.from("problems").upsert(
			batch3Problems.map((problem) => ({
				id: problem.id,
				title: problem.title,
				difficulty: problem.difficulty,
				category: problem.category,
				algorithms: problem.algorithms,
				description: problem.description,
				leetcodeUrl: problem.leetcodeUrl,
				createdAt: new Date().toISOString(),
				updatedAt: new Date().toISOString(),
			})),
			{ onConflict: "id" },
		);

		if (error) {
			console.error("Error seeding batch3 problems:", error);
			return NextResponse.json({ error: error.message }, { status: 500 });
		}

		return NextResponse.json({
			message: `Successfully seeded ${batch3Problems.length} batch3 problems`,
			count: batch3Problems.length,
		});
	} catch (error) {
		console.error("Error in batch3 seeding:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}
