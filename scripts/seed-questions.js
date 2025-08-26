const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const questions = [
	// Array Problems
	{
		title: "Two Sum",
		difficulty: "Easy",
		category: "Array",
		description:
			"Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume that each input would have exactly one solution, and you may not use the same element twice.",
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
			"2 <= nums.length <= 10^4",
			"-10^9 <= nums[i] <= 10^9",
			"-10^9 <= target <= 10^9",
			"Only one valid answer exists.",
		]),
		solutions: JSON.stringify([
			{
				name: "Hash Map",
				approach:
					"Use a hash map to store complements. For each number, check if its complement exists in the map.",
				timeComplexity: "O(n)",
				spaceComplexity: "O(n)",
			},
			{
				name: "Brute Force",
				approach: "Check every pair of numbers using nested loops.",
				timeComplexity: "O(n²)",
				spaceComplexity: "O(1)",
			},
		]),
		leetcodeUrl: "https://leetcode.com/problems/two-sum/",
	},
	{
		title: "Best Time to Buy and Sell Stock",
		difficulty: "Easy",
		category: "Array",
		description:
			"You are given an array prices where prices[i] is the price of a given stock on the ith day. You want to maximize your profit by choosing a single day to buy one stock and choosing a different day in the future to sell that stock. Return the maximum profit you can achieve from this transaction. If you cannot achieve any profit, return 0.",
		examples: JSON.stringify([
			{
				input: "prices = [7,1,5,3,6,4]",
				output: "5",
				explanation:
					"Buy on day 2 (price = 1) and sell on day 5 (price = 6), profit = 6-1 = 5.",
			},
		]),
		constraints: JSON.stringify([
			"1 <= prices.length <= 10^5",
			"0 <= prices[i] <= 10^4",
		]),
		solutions: JSON.stringify([
			{
				name: "One Pass",
				approach:
					"Keep track of minimum price and maximum profit in a single pass.",
				timeComplexity: "O(n)",
				spaceComplexity: "O(1)",
			},
		]),
		leetcodeUrl:
			"https://leetcode.com/problems/best-time-to-buy-and-sell-stock/",
	},
	{
		title: "Contains Duplicate",
		difficulty: "Easy",
		category: "Array",
		description:
			"Given an integer array nums, return true if any value appears at least twice in the array, and return false if every element is distinct.",
		examples: JSON.stringify([
			{
				input: "nums = [1,2,3,1]",
				output: "true",
				explanation: "1 appears twice in the array.",
			},
		]),
		constraints: JSON.stringify([
			"1 <= nums.length <= 10^5",
			"-10^9 <= nums[i] <= 10^9",
		]),
		solutions: JSON.stringify([
			{
				name: "Hash Set",
				approach: "Use a hash set to track seen numbers.",
				timeComplexity: "O(n)",
				spaceComplexity: "O(n)",
			},
			{
				name: "Sorting",
				approach: "Sort the array and check adjacent elements.",
				timeComplexity: "O(n log n)",
				spaceComplexity: "O(1)",
			},
		]),
		leetcodeUrl: "https://leetcode.com/problems/contains-duplicate/",
	},
	{
		title: "Product of Array Except Self",
		difficulty: "Medium",
		category: "Array",
		description:
			"Given an integer array nums, return an array answer such that answer[i] is equal to the product of all the elements of nums except nums[i]. The product of any prefix or suffix of nums is guaranteed to fit in a 32-bit integer.",
		examples: JSON.stringify([
			{
				input: "nums = [1,2,3,4]",
				output: "[24,12,8,6]",
				explanation: "answer[0] = 2*3*4 = 24, answer[1] = 1*3*4 = 12, etc.",
			},
		]),
		constraints: JSON.stringify([
			"2 <= nums.length <= 10^5",
			"-30 <= nums[i] <= 30",
			"The product of any prefix or suffix of nums is guaranteed to fit in a 32-bit integer.",
		]),
		solutions: JSON.stringify([
			{
				name: "Two Pass",
				approach:
					"Calculate left products, then right products in separate passes.",
				timeComplexity: "O(n)",
				spaceComplexity: "O(1)",
			},
		]),
		leetcodeUrl: "https://leetcode.com/problems/product-of-array-except-self/",
	},
	{
		title: "Maximum Subarray",
		difficulty: "Medium",
		category: "Array",
		description:
			"Given an integer array nums, find the subarray with the largest sum, and return its sum.",
		examples: JSON.stringify([
			{
				input: "nums = [-2,1,-3,4,-1,2,1,-5,4]",
				output: "6",
				explanation: "The subarray [4,-1,2,1] has the largest sum 6.",
			},
		]),
		constraints: JSON.stringify([
			"1 <= nums.length <= 10^5",
			"-10^4 <= nums[i] <= 10^4",
		]),
		solutions: JSON.stringify([
			{
				name: "Kadane's Algorithm",
				approach: "Keep track of current sum and maximum sum seen so far.",
				timeComplexity: "O(n)",
				spaceComplexity: "O(1)",
			},
		]),
		leetcodeUrl: "https://leetcode.com/problems/maximum-subarray/",
	},

	// String Problems
	{
		title: "Valid Parentheses",
		difficulty: "Easy",
		category: "String",
		description:
			"Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid. An input string is valid if: 1) Open brackets must be closed by the same type of brackets. 2) Open brackets must be closed in the correct order.",
		examples: JSON.stringify([
			{
				input: 's = "()"',
				output: "true",
				explanation: "Simple valid parentheses.",
			},
			{
				input: 's = "([)]"',
				output: "false",
				explanation: "Wrong order of closing brackets.",
			},
		]),
		constraints: JSON.stringify([
			"1 <= s.length <= 10^4",
			"s consists of parentheses only '()[]{}'",
		]),
		solutions: JSON.stringify([
			{
				name: "Stack",
				approach: "Use a stack to keep track of opening brackets.",
				timeComplexity: "O(n)",
				spaceComplexity: "O(n)",
			},
		]),
		leetcodeUrl: "https://leetcode.com/problems/valid-parentheses/",
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
				explanation: "The answer is 'abc', with the length of 3.",
			},
		]),
		constraints: JSON.stringify([
			"0 <= s.length <= 5 * 10^4",
			"s consists of English letters, digits, symbols and spaces.",
		]),
		solutions: JSON.stringify([
			{
				name: "Sliding Window",
				approach: "Use two pointers to maintain a window of unique characters.",
				timeComplexity: "O(n)",
				spaceComplexity: "O(min(m,n))",
			},
		]),
		leetcodeUrl:
			"https://leetcode.com/problems/longest-substring-without-repeating-characters/",
	},

	// Linked List Problems
	{
		title: "Reverse Linked List",
		difficulty: "Easy",
		category: "Linked List",
		description:
			"Given the head of a singly linked list, reverse the list, and return the reversed list.",
		examples: JSON.stringify([
			{
				input: "head = [1,2,3,4,5]",
				output: "[5,4,3,2,1]",
				explanation: "Reverse the entire linked list.",
			},
		]),
		constraints: JSON.stringify([
			"The number of nodes in the list is the range [0, 5000]",
			"-5000 <= Node.val <= 5000",
		]),
		solutions: JSON.stringify([
			{
				name: "Iterative",
				approach: "Use three pointers to reverse the list in place.",
				timeComplexity: "O(n)",
				spaceComplexity: "O(1)",
			},
			{
				name: "Recursive",
				approach:
					"Recursively reverse the rest of the list and update pointers.",
				timeComplexity: "O(n)",
				spaceComplexity: "O(n)",
			},
		]),
		leetcodeUrl: "https://leetcode.com/problems/reverse-linked-list/",
	},
	{
		title: "Linked List Cycle",
		difficulty: "Easy",
		category: "Linked List",
		description:
			"Given head, the head of a linked list, determine if the linked list has a cycle in it. There is a cycle in a linked list if there is some node in the list that can be reached again by continuously following the next pointer.",
		examples: JSON.stringify([
			{
				input: "head = [3,2,0,-4], pos = 1",
				output: "true",
				explanation:
					"There is a cycle in the linked list, where the tail connects to the 1st node (0-indexed).",
			},
		]),
		constraints: JSON.stringify([
			"The number of the nodes in the list is in the range [0, 10^4]",
			"-10^5 <= Node.val <= 10^5",
			"pos is -1 or a valid index in the linked-list.",
		]),
		solutions: JSON.stringify([
			{
				name: "Floyd's Cycle Finding",
				approach: "Use fast and slow pointers to detect cycle.",
				timeComplexity: "O(n)",
				spaceComplexity: "O(1)",
			},
			{
				name: "Hash Set",
				approach: "Store visited nodes in a hash set.",
				timeComplexity: "O(n)",
				spaceComplexity: "O(n)",
			},
		]),
		leetcodeUrl: "https://leetcode.com/problems/linked-list-cycle/",
	},

	// Tree Problems
	{
		title: "Maximum Depth of Binary Tree",
		difficulty: "Easy",
		category: "Tree",
		description:
			"Given the root of a binary tree, return its maximum depth. A binary tree's maximum depth is the number of nodes along the longest path from the root node down to the farthest leaf node.",
		examples: JSON.stringify([
			{
				input: "root = [3,9,20,null,null,15,7]",
				output: "3",
				explanation:
					"The maximum depth is 3 (path: 3 -> 20 -> 15 or 3 -> 20 -> 7).",
			},
		]),
		constraints: JSON.stringify([
			"The number of nodes in the tree is in the range [0, 10^4]",
			"-100 <= Node.val <= 100",
		]),
		solutions: JSON.stringify([
			{
				name: "Recursive DFS",
				approach: "Recursively calculate depth of left and right subtrees.",
				timeComplexity: "O(n)",
				spaceComplexity: "O(h)",
			},
			{
				name: "Iterative BFS",
				approach: "Use level-order traversal to count levels.",
				timeComplexity: "O(n)",
				spaceComplexity: "O(w)",
			},
		]),
		leetcodeUrl: "https://leetcode.com/problems/maximum-depth-of-binary-tree/",
	},
	{
		title: "Validate Binary Search Tree",
		difficulty: "Medium",
		category: "Tree",
		description:
			"Given the root of a binary tree, determine if it is a valid binary search tree (BST). A valid BST is defined as follows: The left subtree of a node contains only nodes with keys less than the node's key. The right subtree of a node contains only nodes with keys greater than the node's key. Both the left and right subtrees must also be binary search trees.",
		examples: JSON.stringify([
			{
				input: "root = [2,1,3]",
				output: "true",
				explanation: "Valid BST structure.",
			},
		]),
		constraints: JSON.stringify([
			"The number of nodes in the tree is in the range [1, 10^4]",
			"-2^31 <= Node.val <= 2^31 - 1",
		]),
		solutions: JSON.stringify([
			{
				name: "Inorder Traversal",
				approach: "Inorder traversal of BST gives sorted order.",
				timeComplexity: "O(n)",
				spaceComplexity: "O(h)",
			},
			{
				name: "Recursive with Bounds",
				approach: "Pass min and max bounds to each recursive call.",
				timeComplexity: "O(n)",
				spaceComplexity: "O(h)",
			},
		]),
		leetcodeUrl: "https://leetcode.com/problems/validate-binary-search-tree/",
	},

	// Dynamic Programming Problems
	{
		title: "Climbing Stairs",
		difficulty: "Easy",
		category: "Dynamic Programming",
		description:
			"You are climbing a staircase. It takes n steps to reach the top. Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?",
		examples: JSON.stringify([
			{
				input: "n = 3",
				output: "3",
				explanation: "There are three ways: 1+1+1, 1+2, 2+1.",
			},
		]),
		constraints: JSON.stringify(["1 <= n <= 45"]),
		solutions: JSON.stringify([
			{
				name: "Dynamic Programming",
				approach: "Use DP array to store number of ways for each step.",
				timeComplexity: "O(n)",
				spaceComplexity: "O(n)",
			},
			{
				name: "Fibonacci Sequence",
				approach: "This is essentially the Fibonacci sequence.",
				timeComplexity: "O(n)",
				spaceComplexity: "O(1)",
			},
		]),
		leetcodeUrl: "https://leetcode.com/problems/climbing-stairs/",
	},
	{
		title: "House Robber",
		difficulty: "Medium",
		category: "Dynamic Programming",
		description:
			"You are a professional robber planning to rob houses along a street. Each house has a certain amount of money stashed, the only constraint stopping you from robbing each of them is that adjacent houses have security systems connected and it will automatically contact the police if two adjacent houses were broken into on the same night. Given an integer array nums representing the amount of money of each house, return the maximum amount of money you can rob tonight without alerting the police.",
		examples: JSON.stringify([
			{
				input: "nums = [1,2,3,1]",
				output: "4",
				explanation:
					"Rob house 1 (money = 1) and then rob house 3 (money = 3). Total amount you can rob = 1 + 3 = 4.",
			},
		]),
		constraints: JSON.stringify([
			"1 <= nums.length <= 100",
			"0 <= nums[i] <= 400",
		]),
		solutions: JSON.stringify([
			{
				name: "Dynamic Programming",
				approach: "Use DP to store maximum money for each position.",
				timeComplexity: "O(n)",
				spaceComplexity: "O(n)",
			},
			{
				name: "Space Optimized DP",
				approach: "Use only two variables to track previous states.",
				timeComplexity: "O(n)",
				spaceComplexity: "O(1)",
			},
		]),
		leetcodeUrl: "https://leetcode.com/problems/house-robber/",
	},

	// Graph Problems
	{
		title: "Number of Islands",
		difficulty: "Medium",
		category: "Graph",
		description:
			"Given an m x n 2D binary grid grid which represents a map of '1's (land) and '0's (water), return the number of islands. An island is surrounded by water and is formed by connecting adjacent lands horizontally or vertically. You may assume all four edges of the grid are all surrounded by water.",
		examples: JSON.stringify([
			{
				input:
					'grid = [["1","1","1","1","0"],["1","1","0","1","0"],["1","1","0","0","0"],["0","0","0","0","0"]]',
				output: "1",
				explanation: "One island surrounded by water.",
			},
		]),
		constraints: JSON.stringify([
			"m == grid.length",
			"n == grid[i].length",
			"1 <= m, n <= 300",
			"grid[i][j] is '0' or '1'.",
		]),
		solutions: JSON.stringify([
			{
				name: "DFS",
				approach: "Use depth-first search to explore each island.",
				timeComplexity: "O(m*n)",
				spaceComplexity: "O(m*n)",
			},
			{
				name: "BFS",
				approach: "Use breadth-first search to explore each island.",
				timeComplexity: "O(m*n)",
				spaceComplexity: "O(min(m,n))",
			},
		]),
		leetcodeUrl: "https://leetcode.com/problems/number-of-islands/",
	},

	// Hash Table Problems
	{
		title: "Group Anagrams",
		difficulty: "Medium",
		category: "Hash Table",
		description:
			"Given an array of strings strs, group the anagrams together. You can return the answer in any order. An Anagram is a word or phrase formed by rearranging the letters of a different word or phrase, typically using all the original letters exactly once.",
		examples: JSON.stringify([
			{
				input: 'strs = ["eat","tea","tan","ate","nat","bat"]',
				output: '[["bat"],["nat","tan"],["ate","eat","tea"]]',
				explanation: "Group strings that are anagrams of each other.",
			},
		]),
		constraints: JSON.stringify([
			"1 <= strs.length <= 10^4",
			"0 <= strs[i].length <= 100",
			"strs[i] consists of lowercase English letters.",
		]),
		solutions: JSON.stringify([
			{
				name: "Sorted String Key",
				approach: "Use sorted string as key in hash map.",
				timeComplexity: "O(n*k*log(k))",
				spaceComplexity: "O(n*k)",
			},
			{
				name: "Character Count Key",
				approach: "Use character frequency array as key.",
				timeComplexity: "O(n*k)",
				spaceComplexity: "O(n*k)",
			},
		]),
		leetcodeUrl: "https://leetcode.com/problems/group-anagrams/",
	},

	// Two Pointers Problems
	{
		title: "Container With Most Water",
		difficulty: "Medium",
		category: "Two Pointers",
		description:
			"Given n non-negative integers height where each represents a point at coordinate (i, height[i]), find two lines, which, together with the x-axis forms a container, such that the container contains the most water. Return the maximum amount of water a container can store.",
		examples: JSON.stringify([
			{
				input: "height = [1,8,6,2,5,4,8,3,7]",
				output: "49",
				explanation:
					"The maximum area is obtained by choosing height[1] = 8 and height[8] = 7.",
			},
		]),
		constraints: JSON.stringify([
			"n == height.length",
			"2 <= n <= 10^5",
			"0 <= height[i] <= 10^4",
		]),
		solutions: JSON.stringify([
			{
				name: "Two Pointers",
				approach:
					"Use two pointers from both ends, move the shorter one inward.",
				timeComplexity: "O(n)",
				spaceComplexity: "O(1)",
			},
		]),
		leetcodeUrl: "https://leetcode.com/problems/container-with-most-water/",
	},

	// Sliding Window Problems
	{
		title: "Minimum Window Substring",
		difficulty: "Hard",
		category: "Sliding Window",
		description:
			"Given two strings s and t of lengths m and n respectively, return the minimum window substring of s such that every character in t (including duplicates) is included in the window. If there is no such substring, return the empty string ''.",
		examples: JSON.stringify([
			{
				input: 's = "ADOBECODEBANC", t = "ABC"',
				output: '"BANC"',
				explanation:
					"The minimum window substring 'BANC' includes 'A', 'B', and 'C' from string t.",
			},
		]),
		constraints: JSON.stringify([
			"m == s.length",
			"n == t.length",
			"1 <= m, n <= 10^5",
			"s and t consist of uppercase and lowercase English letters.",
		]),
		solutions: JSON.stringify([
			{
				name: "Sliding Window",
				approach:
					"Use two pointers to maintain a window with all required characters.",
				timeComplexity: "O(m+n)",
				spaceComplexity: "O(k)",
			},
		]),
		leetcodeUrl: "https://leetcode.com/problems/minimum-window-substring/",
	},

	// Binary Search Problems
	{
		title: "Binary Search",
		difficulty: "Easy",
		category: "Binary Search",
		description:
			"Given an array of integers nums which is sorted in ascending order, and an integer target, write a function to search target in nums. If target exists, then return its index. Otherwise, return -1.",
		examples: JSON.stringify([
			{
				input: "nums = [-1,0,3,5,9,12], target = 9",
				output: "4",
				explanation: "9 exists in nums and its index is 4.",
			},
		]),
		constraints: JSON.stringify([
			"1 <= nums.length <= 10^4",
			"-10^4 < nums[i], target < 10^4",
			"All the integers in nums are unique.",
			"nums is sorted in ascending order.",
		]),
		solutions: JSON.stringify([
			{
				name: "Binary Search",
				approach: "Use binary search to find target in sorted array.",
				timeComplexity: "O(log n)",
				spaceComplexity: "O(1)",
			},
		]),
		leetcodeUrl: "https://leetcode.com/problems/binary-search/",
	},

	// Stack Problems
	{
		title: "Min Stack",
		difficulty: "Medium",
		category: "Stack",
		description:
			"Design a stack that supports push, pop, top, and retrieving the minimum element in constant time. Implement the MinStack class: MinStack() initializes the stack object. void push(int val) pushes the element val onto the stack. void pop() removes the element on the top of the stack. int top() gets the top element of the stack. int getMin() retrieves the minimum element in the stack.",
		examples: JSON.stringify([
			{
				input:
					'["MinStack","push","push","push","getMin","pop","top","getMin"]\n[[],[-2],[0],[-3],[],[],[],[]]',
				output: "[null,null,null,null,-3,null,0,-2]",
				explanation:
					"MinStack minStack = new MinStack(); minStack.push(-2); minStack.push(0); minStack.push(-3); minStack.getMin(); // return -3 minStack.pop(); minStack.top(); // return 0 minStack.getMin(); // return -2",
			},
		]),
		constraints: JSON.stringify([
			"-2^31 <= val <= 2^31 - 1",
			"Methods pop, top and getMin operations will always be called on non-empty stacks.",
			"At most 3 * 10^4 calls will be made to push, pop, top, and getMin.",
		]),
		solutions: JSON.stringify([
			{
				name: "Two Stacks",
				approach: "Use two stacks: one for elements, one for minimums.",
				timeComplexity: "O(1) for all operations",
				spaceComplexity: "O(n)",
			},
			{
				name: "Single Stack with Pairs",
				approach: "Store pairs of (value, current_min) in single stack.",
				timeComplexity: "O(1) for all operations",
				spaceComplexity: "O(n)",
			},
		]),
		leetcodeUrl: "https://leetcode.com/problems/min-stack/",
	},
];

async function seedQuestions() {
	console.log("🌱 Starting to seed questions...");

	try {
		for (const question of questions) {
			const existingQuestion = await prisma.problem.findUnique({
				where: { title: question.title },
			});

			if (existingQuestion) {
				console.log(`⏭️  Skipping "${question.title}" - already exists`);
				continue;
			}

			const createdQuestion = await prisma.problem.create({
				data: question,
			});

			console.log(
				`✅ Created: "${createdQuestion.title}" (${createdQuestion.difficulty})`,
			);
		}

		console.log("🎉 Question seeding completed!");

		// Print summary
		const totalQuestions = await prisma.problem.count();
		const easyCount = await prisma.problem.count({
			where: { difficulty: "Easy" },
		});
		const mediumCount = await prisma.problem.count({
			where: { difficulty: "Medium" },
		});
		const hardCount = await prisma.problem.count({
			where: { difficulty: "Hard" },
		});

		console.log("\n📊 Summary:");
		console.log(`Total Questions: ${totalQuestions}`);
		console.log(`Easy: ${easyCount}`);
		console.log(`Medium: ${mediumCount}`);
		console.log(`Hard: ${hardCount}`);
	} catch (error) {
		console.error("❌ Error seeding questions:", error);
	} finally {
		await prisma.$disconnect();
	}
}

// Run the seeding
seedQuestions();
