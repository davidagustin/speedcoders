import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function POST() {
	try {
		const supabase = await createClient();

		// Seed Algorithms
		const algorithms = [
			{
				name: "Hash Table",
				category: "Data Structures",
				description: "Fast key-value lookups with O(1) average time complexity",
				timeComplexity: "O(1)",
				spaceComplexity: "O(n)",
				examples: JSON.stringify([
					{
						problem: "Two Sum",
						approach: "Use hash table to store complements",
					},
					{ problem: "Valid Anagram", approach: "Count character frequencies" },
				]),
			},
			{
				name: "Two Pointers",
				category: "Techniques",
				description: "Efficient array traversal using two pointers",
				timeComplexity: "O(n)",
				spaceComplexity: "O(1)",
				examples: JSON.stringify([
					{ problem: "Valid Palindrome", approach: "Compare from both ends" },
					{
						problem: "Container With Most Water",
						approach: "Move pointer with smaller height",
					},
				]),
			},
			{
				name: "Sliding Window",
				category: "Techniques",
				description: "Contiguous subarray problems with variable window size",
				timeComplexity: "O(n)",
				spaceComplexity: "O(1)",
				examples: JSON.stringify([
					{
						problem: "Longest Substring Without Repeating Characters",
						approach: "Expand window until duplicate found",
					},
					{
						problem: "Minimum Size Subarray Sum",
						approach: "Shrink window when sum >= target",
					},
				]),
			},
			{
				name: "Dynamic Programming",
				category: "Techniques",
				description:
					"Solve complex problems by breaking them into simpler subproblems",
				timeComplexity: "Varies",
				spaceComplexity: "Varies",
				examples: JSON.stringify([
					{ problem: "Climbing Stairs", approach: "dp[i] = dp[i-1] + dp[i-2]" },
					{
						problem: "Coin Change",
						approach: "dp[amount] = min(dp[amount - coin] + 1)",
					},
				]),
			},
			{
				name: "Binary Search",
				category: "Search",
				description: "Efficient search in sorted arrays",
				timeComplexity: "O(log n)",
				spaceComplexity: "O(1)",
				examples: JSON.stringify([
					{ problem: "Binary Search", approach: "Compare with middle element" },
					{
						problem: "Search in Rotated Sorted Array",
						approach: "Handle rotation with modified binary search",
					},
				]),
			},
			{
				name: "Depth-First Search",
				category: "Graph",
				description:
					"Explore as far as possible along each branch before backtracking",
				timeComplexity: "O(V + E)",
				spaceComplexity: "O(V)",
				examples: JSON.stringify([
					{
						problem: "Number of Islands",
						approach: "DFS to mark connected land",
					},
					{
						problem: "Validate Binary Search Tree",
						approach: "Inorder traversal should be sorted",
					},
				]),
			},
			{
				name: "Breadth-First Search",
				category: "Graph",
				description:
					"Explore all neighbors at current depth before moving to next level",
				timeComplexity: "O(V + E)",
				spaceComplexity: "O(V)",
				examples: JSON.stringify([
					{
						problem: "Binary Tree Level Order Traversal",
						approach: "Use queue for level-by-level traversal",
					},
					{
						problem: "Word Ladder",
						approach: "BFS to find shortest transformation sequence",
					},
				]),
			},
			{
				name: "Stack",
				category: "Data Structures",
				description: "LIFO data structure for tracking state",
				timeComplexity: "O(1)",
				spaceComplexity: "O(n)",
				examples: JSON.stringify([
					{
						problem: "Valid Parentheses",
						approach: "Push opening brackets, pop on closing",
					},
					{
						problem: "Min Stack",
						approach: "Maintain minimum value alongside stack",
					},
				]),
			},
		];

		for (const algorithm of algorithms) {
			await supabase
				.from("algorithms")
				.upsert(algorithm, { onConflict: "name" });
		}

		// Seed Problems
		const problems = [
			{
				title: "Two Sum",
				difficulty: "Easy",
				category: "Array",
				description:
					"Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
				examples: JSON.stringify([
					{
						input: "nums = [2,7,11,15], target = 9",
						output: "[0,1]",
						explanation: "Because nums[0] + nums[1] == 9, we return [0, 1].",
					},
					{
						input: "nums = [3,2,4], target = 6",
						output: "[1,2]",
						explanation: "Because nums[1] + nums[2] == 6, we return [1, 2].",
					},
				]),
				constraints: JSON.stringify([
					"2 <= nums.length <= 104",
					"-109 <= nums[i] <= 109",
					"-109 <= target <= 109",
					"Only one valid answer exists.",
				]),
				solutions: JSON.stringify(["Hash Table", "Two Pointers"]),
				leetcodeUrl: "https://leetcode.com/problems/two-sum/",
			},
			{
				title: "Add Two Numbers",
				difficulty: "Medium",
				category: "Linked List",
				description:
					"You are given two non-empty linked lists representing two non-negative integers. The digits are stored in reverse order, and each of their nodes contains a single digit. Add the two numbers and return the sum as a linked list.",
				examples: JSON.stringify([
					{
						input: "l1 = [2,4,3], l2 = [5,6,4]",
						output: "[7,0,8]",
						explanation: "342 + 465 = 807.",
					},
					{
						input: "l1 = [0], l2 = [0]",
						output: "[0]",
						explanation: "0 + 0 = 0.",
					},
				]),
				constraints: JSON.stringify([
					"The number of nodes in each linked list is in the range [1, 100].",
					"0 <= Node.val <= 9",
					"It is guaranteed that the list represents a number that does not have leading zeros.",
				]),
				solutions: JSON.stringify(["Linked List", "Math"]),
				leetcodeUrl: "https://leetcode.com/problems/add-two-numbers/",
			},
			{
				title: "Longest Substring Without Repeating Characters",
				difficulty: "Medium",
				category: "String",
				description:
					"Given a string s, find the length of the longest substring without repeating characters.",
				examples: JSON.stringify([
					{
						input: 's = "abcabcbb"',
						output: "3",
						explanation: 'The answer is "abc", with the length of 3.',
					},
					{
						input: 's = "bbbbb"',
						output: "1",
						explanation: 'The answer is "b", with the length of 1.',
					},
				]),
				constraints: JSON.stringify([
					"0 <= s.length <= 5 * 104",
					"s consists of English letters, digits, symbols and spaces.",
				]),
				solutions: JSON.stringify(["Sliding Window", "Hash Table"]),
				leetcodeUrl:
					"https://leetcode.com/problems/longest-substring-without-repeating-characters/",
			},
			{
				title: "Median of Two Sorted Arrays",
				difficulty: "Hard",
				category: "Array",
				description:
					"Given two sorted arrays nums1 and nums2 of size m and n respectively, return the median of the two sorted arrays.",
				examples: JSON.stringify([
					{
						input: "nums1 = [1,3], nums2 = [2]",
						output: "2.00000",
						explanation: "merged array = [1,2,3] and median is 2.",
					},
					{
						input: "nums1 = [1,2], nums2 = [3,4]",
						output: "2.50000",
						explanation:
							"merged array = [1,2,3,4] and median is (2 + 3) / 2 = 2.5.",
					},
				]),
				constraints: JSON.stringify([
					"nums1.length + nums2.length == m + n",
					"0 <= m <= 1000",
					"0 <= n <= 1000",
					"1 <= m + n <= 2000",
					"-106 <= nums1[i], nums2[i] <= 106",
				]),
				solutions: JSON.stringify(["Binary Search", "Divide and Conquer"]),
				leetcodeUrl:
					"https://leetcode.com/problems/median-of-two-sorted-arrays/",
			},
			{
				title: "Valid Parentheses",
				difficulty: "Easy",
				category: "Stack",
				description:
					"Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.",
				examples: JSON.stringify([
					{
						input: 's = "()"',
						output: "true",
						explanation: "Simple valid parentheses.",
					},
					{
						input: 's = "()[]{}"',
						output: "true",
						explanation: "Multiple valid parentheses.",
					},
					{
						input: 's = "(]"',
						output: "false",
						explanation: "Mismatched parentheses.",
					},
				]),
				constraints: JSON.stringify([
					"1 <= s.length <= 104",
					"s consists of parentheses only '()[]{}'",
				]),
				solutions: JSON.stringify(["Stack"]),
				leetcodeUrl: "https://leetcode.com/problems/valid-parentheses/",
			},
		];

		for (const problem of problems) {
			await supabase.from("problems").upsert(problem, { onConflict: "title" });
		}

		// Seed Learning Paths
		const learningPaths = [
			{
				title: "Data Structures Fundamentals",
				description:
					"Master essential data structures from arrays to advanced trees",
				category: "beginner",
				difficulty: "easy",
				duration: 20,
				topics: JSON.stringify([
					"Arrays and Strings",
					"Linked Lists",
					"Stacks and Queues",
					"Trees and Binary Trees",
					"Hash Tables",
					"Graphs Basics",
				]),
				prerequisites: JSON.stringify([]),
			},
			{
				title: "Algorithm Techniques",
				description: "Learn fundamental algorithmic techniques and patterns",
				category: "intermediate",
				difficulty: "medium",
				duration: 30,
				topics: JSON.stringify([
					"Two Pointers",
					"Sliding Window",
					"Binary Search",
					"Depth-First Search",
					"Breadth-First Search",
					"Dynamic Programming Basics",
				]),
				prerequisites: JSON.stringify(["Data Structures Fundamentals"]),
			},
			{
				title: "Advanced Problem Solving",
				description: "Tackle complex problems with advanced techniques",
				category: "advanced",
				difficulty: "hard",
				duration: 40,
				topics: JSON.stringify([
					"Advanced Dynamic Programming",
					"Greedy Algorithms",
					"Backtracking",
					"Union Find",
					"Topological Sort",
					"System Design Basics",
				]),
				prerequisites: JSON.stringify(["Algorithm Techniques"]),
			},
		];

		for (const path of learningPaths) {
			await supabase
				.from("learning_paths")
				.upsert(path, { onConflict: "title" });
		}

		// Seed System Design Challenges
		const systemDesigns = [
			{
				title: "Design a URL Shortener",
				description:
					"Design a service that takes long URLs and converts them into shorter URLs",
				category: "scalability",
				difficulty: "medium",
				requirements: JSON.stringify([
					"Generate short URLs from long URLs",
					"Redirect short URLs to original URLs",
					"Handle high traffic (millions of requests per day)",
					"Support custom short URLs",
					"Track click analytics",
				]),
				solutions: JSON.stringify([
					"Use hash functions to generate short codes",
					"Database design with URL mappings",
					"Caching layer for frequently accessed URLs",
					"Load balancer for traffic distribution",
					"Analytics tracking system",
				]),
				resources: JSON.stringify([
					"Database design patterns",
					"Caching strategies",
					"Hash function selection",
					"Scalability considerations",
				]),
			},
			{
				title: "Design a Chat Application",
				description:
					"Design a real-time chat application like WhatsApp or Slack",
				category: "real-time",
				difficulty: "hard",
				requirements: JSON.stringify([
					"Real-time messaging between users",
					"Support for group chats",
					"Message persistence and history",
					"Online/offline status",
					"File sharing capabilities",
					"Push notifications",
				]),
				solutions: JSON.stringify([
					"WebSocket connections for real-time communication",
					"Message queue for reliable delivery",
					"Database sharding for scalability",
					"CDN for file storage",
					"Push notification service",
				]),
				resources: JSON.stringify([
					"WebSocket protocols",
					"Message queue systems",
					"Database sharding strategies",
					"Real-time system design",
				]),
			},
		];

		for (const design of systemDesigns) {
			await supabase
				.from("system_designs")
				.upsert(design, { onConflict: "title" });
		}

		return NextResponse.json({
			success: true,
			message:
				"Database seeded successfully with algorithms, problems, learning paths, and system designs",
		});
	} catch (error) {
		console.error("Seeding error:", error);
		return NextResponse.json(
			{
				success: false,
				error: "Failed to seed database",
			},
			{ status: 500 },
		);
	}
}
