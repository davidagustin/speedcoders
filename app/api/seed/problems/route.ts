import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function POST() {
	try {
		const supabase = await createClient();

		// Additional problems from batch1.js and comprehensive problem set
		const problems = [
			// String Problems
			{
				title: "Zigzag Conversion",
				difficulty: "Medium",
				category: "String",
				description:
					"Convert a string to a zigzag pattern on a given number of rows.",
				examples: JSON.stringify([
					{
						input: 's = "PAYPALISHIRING", numRows = 3',
						output: '"PAHNAPLSIIGYIR"',
						explanation: "P   A   H   N\nA P L S I I G\nY   I   R",
					},
					{
						input: 's = "PAYPALISHIRING", numRows = 4',
						output: '"PINALSIGYAHRPI"',
						explanation: "P     I    N\nA   L S  I G\nY A   H R\nP     I",
					},
				]),
				constraints: JSON.stringify([
					"1 <= s.length <= 1000",
					"s consists of English letters (lower-case and upper-case), ',' and '.'.",
					"1 <= numRows <= 1000",
				]),
				solutions: JSON.stringify(["String", "Simulation", "Math"]),
				leetcodeUrl: "https://leetcode.com/problems/zigzag-conversion/",
			},
			{
				title: "String to Integer (atoi)",
				difficulty: "Medium",
				category: "String",
				description:
					"Implement the myAtoi(string s) function, which converts a string to a 32-bit signed integer.",
				examples: JSON.stringify([
					{
						input: 's = "42"',
						output: "42",
						explanation:
							'Leading whitespace is ignored and "42" is parsed as 42.',
					},
					{
						input: 's = "   -42"',
						output: "-42",
						explanation:
							'Leading whitespace is ignored, the minus sign is read, then "42" is parsed as -42.',
					},
					{
						input: 's = "4193 with words"',
						output: "4193",
						explanation: "Parsing stops at the first non-digit character.",
					},
				]),
				constraints: JSON.stringify([
					"0 <= s.length <= 200",
					"s consists of English letters (lower-case and upper-case), digits (0-9), ' ', '+', '-', and '.'.",
				]),
				solutions: JSON.stringify(["String", "Math", "State Machine"]),
				leetcodeUrl: "https://leetcode.com/problems/string-to-integer-atoi/",
			},
			{
				title: "Regular Expression Matching",
				difficulty: "Hard",
				category: "String",
				description:
					"Given an input string s and a pattern p, implement regular expression matching with support for '.' and '*'.",
				examples: JSON.stringify([
					{
						input: 's = "aa", p = "a"',
						output: "false",
						explanation: '"a" does not match the entire string "aa".',
					},
					{
						input: 's = "aa", p = "a*"',
						output: "true",
						explanation:
							'"*" means zero or more of the preceding element, "a".',
					},
					{
						input: 's = "ab", p = ".*"',
						output: "true",
						explanation: '".*" means "zero or more (*) of any character (.)".',
					},
				]),
				constraints: JSON.stringify([
					"1 <= s.length <= 20",
					"1 <= p.length <= 30",
					"s contains only lowercase English letters.",
					"p contains only lowercase English letters, '.', and '*'.",
				]),
				solutions: JSON.stringify([
					"String",
					"Dynamic Programming",
					"Recursion",
				]),
				leetcodeUrl:
					"https://leetcode.com/problems/regular-expression-matching/",
			},
			{
				title: "Longest Common Prefix",
				difficulty: "Easy",
				category: "String",
				description:
					"Write a function to find the longest common prefix string amongst an array of strings.",
				examples: JSON.stringify([
					{
						input: 'strs = ["flower","flow","flight"]',
						output: '"fl"',
						explanation: 'The longest common prefix is "fl".',
					},
					{
						input: 'strs = ["dog","racecar","car"]',
						output: '""',
						explanation: "There is no common prefix among the input strings.",
					},
				]),
				constraints: JSON.stringify([
					"1 <= strs.length <= 200",
					"0 <= strs[i].length <= 200",
					"strs[i] consists of only lowercase English letters.",
				]),
				solutions: JSON.stringify(["String", "Trie", "Binary Search"]),
				leetcodeUrl: "https://leetcode.com/problems/longest-common-prefix/",
			},
			{
				title: "Letter Combinations of a Phone Number",
				difficulty: "Medium",
				category: "String",
				description:
					"Given a string containing digits from 2-9 inclusive, return all possible letter combinations that the number could represent.",
				examples: JSON.stringify([
					{
						input: 'digits = "23"',
						output: '["ad","ae","af","bd","be","bf","cd","ce","cf"]',
						explanation: '2 maps to "abc", 3 maps to "def".',
					},
					{
						input: 'digits = ""',
						output: "[]",
						explanation: "No digits provided.",
					},
				]),
				constraints: JSON.stringify([
					"0 <= digits.length <= 4",
					"digits[i] is a digit in the range ['2', '9'].",
				]),
				solutions: JSON.stringify(["Hash Table", "String", "Backtracking"]),
				leetcodeUrl:
					"https://leetcode.com/problems/letter-combinations-of-a-phone-number/",
			},

			// Array Problems
			{
				title: "3Sum Closest",
				difficulty: "Medium",
				category: "Array",
				description:
					"Given an integer array nums of length n and an integer target, find three integers in nums such that the sum is closest to target.",
				examples: JSON.stringify([
					{
						input: "nums = [-1,2,1,-4], target = 1",
						output: "2",
						explanation:
							"The sum that is closest to the target is 2. (-1 + 2 + 1 = 2).",
					},
					{
						input: "nums = [0,0,0], target = 1",
						output: "0",
						explanation:
							"The sum that is closest to the target is 0. (0 + 0 + 0 = 0).",
					},
				]),
				constraints: JSON.stringify([
					"3 <= nums.length <= 1000",
					"-1000 <= nums[i] <= 1000",
					"-104 <= target <= 104",
				]),
				solutions: JSON.stringify(["Array", "Two Pointers", "Sorting"]),
				leetcodeUrl: "https://leetcode.com/problems/3sum-closest/",
			},
			{
				title: "4Sum",
				difficulty: "Medium",
				category: "Array",
				description:
					"Given an array nums of n integers, return an array of all the unique quadruplets [nums[a], nums[b], nums[c], nums[d]] such that a, b, c, and d are distinct.",
				examples: JSON.stringify([
					{
						input: "nums = [1,0,-1,0,-2,2], target = 0",
						output: "[[-2,-1,1,2],[-2,0,0,2],[-1,0,0,1]]",
						explanation: "The quadruplets that sum to 0 are shown.",
					},
					{
						input: "nums = [2,2,2,2,2], target = 8",
						output: "[[2,2,2,2]]",
						explanation: "The only quadruplet that sums to 8.",
					},
				]),
				constraints: JSON.stringify([
					"1 <= nums.length <= 200",
					"-109 <= nums[i] <= 109",
					"-109 <= target <= 109",
				]),
				solutions: JSON.stringify(["Array", "Two Pointers", "Sorting"]),
				leetcodeUrl: "https://leetcode.com/problems/4sum/",
			},
			{
				title: "Remove Duplicates from Sorted Array II",
				difficulty: "Medium",
				category: "Array",
				description:
					"Given an integer array nums sorted in non-decreasing order, remove some duplicates in-place such that each unique element appears at most twice.",
				examples: JSON.stringify([
					{
						input: "nums = [1,1,1,2,2,3]",
						output: "5, nums = [1,1,2,2,3,_]",
						explanation:
							"Your function should return k = 5, with the first five elements of nums being 1, 1, 2, 2 and 3 respectively.",
					},
					{
						input: "nums = [0,0,1,1,1,1,2,3,3]",
						output: "7, nums = [0,0,1,1,2,3,3,_,_]",
						explanation:
							"Your function should return k = 7, with the first seven elements of nums being 0, 0, 1, 1, 2, 3 and 3 respectively.",
					},
				]),
				constraints: JSON.stringify([
					"1 <= nums.length <= 3 * 104",
					"-104 <= nums[i] <= 104",
					"nums is sorted in non-decreasing order.",
				]),
				solutions: JSON.stringify(["Array", "Two Pointers"]),
				leetcodeUrl:
					"https://leetcode.com/problems/remove-duplicates-from-sorted-array-ii/",
			},
			{
				title: "Search in Rotated Sorted Array II",
				difficulty: "Medium",
				category: "Array",
				description:
					"There is an integer array nums sorted in non-decreasing order (not necessarily with distinct values).",
				examples: JSON.stringify([
					{
						input: "nums = [2,5,6,0,0,1,2], target = 0",
						output: "true",
						explanation: "0 is found in the array.",
					},
					{
						input: "nums = [2,5,6,0,0,1,2], target = 3",
						output: "false",
						explanation: "3 is not found in the array.",
					},
				]),
				constraints: JSON.stringify([
					"1 <= nums.length <= 5000",
					"-104 <= nums[i] <= 104",
					"nums is guaranteed to be rotated at some pivot.",
					"-104 <= target <= 104",
				]),
				solutions: JSON.stringify(["Array", "Binary Search"]),
				leetcodeUrl:
					"https://leetcode.com/problems/search-in-rotated-sorted-array-ii/",
			},
			{
				title: "Maximum Gap",
				difficulty: "Medium",
				category: "Array",
				description:
					"Given an integer array nums, return the maximum difference between two successive elements in its sorted form.",
				examples: JSON.stringify([
					{
						input: "nums = [3,6,9,1]",
						output: "3",
						explanation:
							"The sorted form of the array is [1,3,6,9], either (3,6) or (6,9) has the maximum difference 3.",
					},
					{
						input: "nums = [10]",
						output: "0",
						explanation:
							"The array contains less than 2 elements, therefore return 0.",
					},
				]),
				constraints: JSON.stringify([
					"1 <= nums.length <= 105",
					"0 <= nums[i] <= 109",
				]),
				solutions: JSON.stringify(["Array", "Sorting", "Bucket Sort"]),
				leetcodeUrl: "https://leetcode.com/problems/maximum-gap/",
			},

			// Dynamic Programming Problems
			{
				title: "Longest Valid Parentheses",
				difficulty: "Hard",
				category: "Dynamic Programming",
				description:
					"Given a string containing just the characters '(' and ')', find the length of the longest valid (well-formed) parentheses substring.",
				examples: JSON.stringify([
					{
						input: 's = "(()"',
						output: "2",
						explanation: 'The longest valid parentheses substring is "()".',
					},
					{
						input: 's = ")()())"',
						output: "4",
						explanation: 'The longest valid parentheses substring is "()()".',
					},
				]),
				constraints: JSON.stringify([
					"0 <= s.length <= 3 * 104",
					"s[i] is '(', or ')'.",
				]),
				solutions: JSON.stringify(["String", "Dynamic Programming", "Stack"]),
				leetcodeUrl: "https://leetcode.com/problems/longest-valid-parentheses/",
			},
			{
				title: "Scramble String",
				difficulty: "Hard",
				category: "Dynamic Programming",
				description:
					"We can scramble a string s to get a string t using the following algorithm.",
				examples: JSON.stringify([
					{
						input: 's1 = "great", s2 = "rgeat"',
						output: "true",
						explanation:
							'One possible scenario applied on s1 is: "great" --> "gr/eat" --> "gr/eat" --> "rgeat".',
					},
					{
						input: 's1 = "abcde", s2 = "caebd"',
						output: "false",
						explanation: "It is impossible to scramble s1 to get s2.",
					},
				]),
				constraints: JSON.stringify([
					"s1.length == s2.length",
					"1 <= s1.length <= 30",
					"s1 and s2 consist of lowercase English letters.",
				]),
				solutions: JSON.stringify([
					"String",
					"Dynamic Programming",
					"Recursion",
				]),
				leetcodeUrl: "https://leetcode.com/problems/scramble-string/",
			},
			{
				title: "Interleaving String",
				difficulty: "Medium",
				category: "Dynamic Programming",
				description:
					"Given strings s1, s2, and s3, find whether s3 is formed by an interleaving of s1 and s2.",
				examples: JSON.stringify([
					{
						input: 's1 = "aabcc", s2 = "dbbca", s3 = "aadbbcbcac"',
						output: "true",
						explanation: "s3 is formed by interleaving s1 and s2.",
					},
					{
						input: 's1 = "aabcc", s2 = "dbbca", s3 = "aadbbbaccc"',
						output: "false",
						explanation: "s3 cannot be formed by interleaving s1 and s2.",
					},
				]),
				constraints: JSON.stringify([
					"0 <= s1.length, s2.length <= 100",
					"0 <= s3.length <= 200",
					"s1, s2, and s3 consist of lowercase English letters.",
				]),
				solutions: JSON.stringify(["String", "Dynamic Programming"]),
				leetcodeUrl: "https://leetcode.com/problems/interleaving-string/",
			},
			{
				title: "Distinct Subsequences",
				difficulty: "Hard",
				category: "Dynamic Programming",
				description:
					"Given two strings s and t, return the number of distinct subsequences of s which equals t.",
				examples: JSON.stringify([
					{
						input: 's = "rabbbit", t = "rabbit"',
						output: "3",
						explanation:
							'There are 3 ways to generate "rabbit" from "rabbbit".',
					},
					{
						input: 's = "babgbag", t = "bag"',
						output: "5",
						explanation: 'There are 5 ways to generate "bag" from "babgbag".',
					},
				]),
				constraints: JSON.stringify([
					"1 <= s.length, t.length <= 1000",
					"s and t consist of English letters.",
				]),
				solutions: JSON.stringify(["String", "Dynamic Programming"]),
				leetcodeUrl: "https://leetcode.com/problems/distinct-subsequences/",
			},

			// Tree Problems
			{
				title: "Construct Binary Tree from Inorder and Postorder Traversal",
				difficulty: "Medium",
				category: "Tree",
				description:
					"Given two integer arrays inorder and postorder where inorder is the inorder traversal of a binary tree and postorder is the postorder traversal of the same tree.",
				examples: JSON.stringify([
					{
						input: "inorder = [9,3,15,20,7], postorder = [9,15,7,20,3]",
						output: "[3,9,20,null,null,15,7]",
						explanation: "The binary tree is constructed from the traversals.",
					},
					{
						input: "inorder = [-1], postorder = [-1]",
						output: "[-1]",
						explanation: "Single node tree.",
					},
				]),
				constraints: JSON.stringify([
					"1 <= inorder.length <= 3000",
					"postorder.length == inorder.length",
					"-3000 <= inorder[i], postorder[i] <= 3000",
					"inorder and postorder consist of unique values.",
				]),
				solutions: JSON.stringify([
					"Array",
					"Hash Table",
					"Divide and Conquer",
					"Tree",
				]),
				leetcodeUrl:
					"https://leetcode.com/problems/construct-binary-tree-from-inorder-and-postorder-traversal/",
			},
			{
				title: "Convert Sorted List to Binary Search Tree",
				difficulty: "Medium",
				category: "Tree",
				description:
					"Given the head of a singly linked list where elements are sorted in ascending order, convert it to a height balanced BST.",
				examples: JSON.stringify([
					{
						input: "head = [-10,-3,0,5,9]",
						output: "[0,-3,9,-10,null,5]",
						explanation: "A height balanced BST is constructed.",
					},
					{
						input: "head = []",
						output: "[]",
						explanation: "Empty list results in empty tree.",
					},
				]),
				constraints: JSON.stringify([
					"The number of nodes in head is in the range [0, 2 * 104].",
					"-105 <= Node.val <= 105",
				]),
				solutions: JSON.stringify([
					"Linked List",
					"Divide and Conquer",
					"Tree",
				]),
				leetcodeUrl:
					"https://leetcode.com/problems/convert-sorted-list-to-binary-search-tree/",
			},
			{
				title: "Populating Next Right Pointers in Each Node II",
				difficulty: "Medium",
				category: "Tree",
				description:
					"Given a binary tree, populate each next pointer to point to its next right node.",
				examples: JSON.stringify([
					{
						input: "root = [1,2,3,4,5,null,7]",
						output: "[1,#,2,3,#,4,5,7,#]",
						explanation: "Next pointers are populated.",
					},
					{ input: "root = []", output: "[]", explanation: "Empty tree." },
				]),
				constraints: JSON.stringify([
					"The number of nodes in the tree is in the range [0, 6000].",
					"-100 <= Node.val <= 100",
				]),
				solutions: JSON.stringify(["Linked List", "Tree", "DFS", "BFS"]),
				leetcodeUrl:
					"https://leetcode.com/problems/populating-next-right-pointers-in-each-node-ii/",
			},
			{
				title: "Binary Tree Preorder Traversal",
				difficulty: "Easy",
				category: "Tree",
				description:
					"Given the root of a binary tree, return the preorder traversal of its nodes' values.",
				examples: JSON.stringify([
					{
						input: "root = [1,null,2,3]",
						output: "[1,2,3]",
						explanation: "Preorder traversal visits root, left, right.",
					},
					{ input: "root = []", output: "[]", explanation: "Empty tree." },
				]),
				constraints: JSON.stringify([
					"The number of nodes in the tree is in the range [0, 100].",
					"-100 <= Node.val <= 100",
				]),
				solutions: JSON.stringify(["Stack", "Tree", "DFS"]),
				leetcodeUrl:
					"https://leetcode.com/problems/binary-tree-preorder-traversal/",
			},
			{
				title: "Binary Search Tree Iterator",
				difficulty: "Medium",
				category: "Tree",
				description:
					"Implement the BSTIterator class that represents an iterator over the in-order traversal of a binary search tree (BST).",
				examples: JSON.stringify([
					{
						input:
							'["BSTIterator", "next", "next", "hasNext", "next", "hasNext", "next", "hasNext", "next", "hasNext"]\n[[[7, 3, 15, null, null, 9, 20]], [], [], [], [], [], [], [], [], []]',
						output: "[null, 3, 7, true, 9, true, 15, true, 20, false]",
						explanation: "Iterator traverses BST in-order.",
					},
				]),
				constraints: JSON.stringify([
					"The number of nodes in the tree is in the range [1, 105].",
					"0 <= Node.val <= 106",
					"At most 105 calls will be made to hasNext, and next.",
				]),
				solutions: JSON.stringify(["Stack", "Tree", "Design"]),
				leetcodeUrl:
					"https://leetcode.com/problems/binary-search-tree-iterator/",
			},

			// Linked List Problems
			{
				title: "Remove Nth Node From End of List",
				difficulty: "Medium",
				category: "Linked List",
				description:
					"Given the head of a linked list, remove the nth node from the end of the list and return its head.",
				examples: JSON.stringify([
					{
						input: "head = [1,2,3,4,5], n = 2",
						output: "[1,2,3,5]",
						explanation:
							"Remove the 2nd node from the end (node with value 4).",
					},
					{
						input: "head = [1], n = 1",
						output: "[]",
						explanation: "Remove the only node.",
					},
				]),
				constraints: JSON.stringify([
					"The number of nodes in the list is sz.",
					"1 <= sz <= 30",
					"0 <= Node.val <= 100",
					"1 <= n <= sz",
				]),
				solutions: JSON.stringify(["Linked List", "Two Pointers"]),
				leetcodeUrl:
					"https://leetcode.com/problems/remove-nth-node-from-end-of-list/",
			},
			{
				title: "Merge k Sorted Lists",
				difficulty: "Hard",
				category: "Linked List",
				description:
					"You are given an array of k linked-lists lists, each linked-list is sorted in ascending order.",
				examples: JSON.stringify([
					{
						input: "lists = [[1,4,5],[1,3,4],[2,6]]",
						output: "[1,1,2,3,4,4,5,6]",
						explanation: "Merge all sorted lists.",
					},
					{ input: "lists = []", output: "[]", explanation: "Empty array." },
				]),
				constraints: JSON.stringify([
					"k == lists.length",
					"0 <= k <= 104",
					"0 <= lists[i].length <= 500",
					"-104 <= lists[i][j] <= 104",
					"lists[i] is sorted in ascending order.",
				]),
				solutions: JSON.stringify([
					"Linked List",
					"Divide and Conquer",
					"Heap",
				]),
				leetcodeUrl: "https://leetcode.com/problems/merge-k-sorted-lists/",
			},
			{
				title: "Swap Nodes in Pairs",
				difficulty: "Medium",
				category: "Linked List",
				description:
					"Given a linked list, swap every two adjacent nodes and return its head.",
				examples: JSON.stringify([
					{
						input: "head = [1,2,3,4]",
						output: "[2,1,4,3]",
						explanation: "Swap adjacent pairs.",
					},
					{ input: "head = []", output: "[]", explanation: "Empty list." },
				]),
				constraints: JSON.stringify([
					"The number of nodes in the list is in the range [0, 100].",
					"0 <= Node.val <= 100",
				]),
				solutions: JSON.stringify(["Linked List", "Recursion"]),
				leetcodeUrl: "https://leetcode.com/problems/swap-nodes-in-pairs/",
			},
			{
				title: "Reverse Nodes in k-Group",
				difficulty: "Hard",
				category: "Linked List",
				description:
					"Given the head of a linked list, reverse the nodes of the list k at a time, and return the modified list.",
				examples: JSON.stringify([
					{
						input: "head = [1,2,3,4,5], k = 2",
						output: "[2,1,4,3,5]",
						explanation: "Reverse nodes in groups of 2.",
					},
					{
						input: "head = [1,2,3,4,5], k = 3",
						output: "[3,2,1,4,5]",
						explanation: "Reverse nodes in groups of 3.",
					},
				]),
				constraints: JSON.stringify([
					"The number of nodes in the list is n.",
					"1 <= k <= n <= 5000",
					"0 <= Node.val <= 1000",
				]),
				solutions: JSON.stringify(["Linked List", "Recursion"]),
				leetcodeUrl: "https://leetcode.com/problems/reverse-nodes-in-k-group/",
			},
			{
				title: "Remove Duplicates from Sorted List II",
				difficulty: "Medium",
				category: "Linked List",
				description:
					"Given the head of a sorted linked list, delete all nodes that have duplicate numbers.",
				examples: JSON.stringify([
					{
						input: "head = [1,2,3,3,4,4,5]",
						output: "[1,2,5]",
						explanation: "Remove all nodes with duplicates.",
					},
					{
						input: "head = [1,1,1,2,3]",
						output: "[2,3]",
						explanation: "Remove all nodes with value 1.",
					},
				]),
				constraints: JSON.stringify([
					"The number of nodes in the list is in the range [0, 300].",
					"-100 <= Node.val <= 100",
					"The list is guaranteed to be sorted in ascending order.",
				]),
				solutions: JSON.stringify(["Linked List", "Two Pointers"]),
				leetcodeUrl:
					"https://leetcode.com/problems/remove-duplicates-from-sorted-list-ii/",
			},

			// Database Problems
			{
				title: "Combine Two Tables",
				difficulty: "Easy",
				category: "Database",
				description:
					"Write a SQL query to get the names of customers who have made orders.",
				examples: JSON.stringify([
					{
						input:
							'Person table: [[1, "John", "Doe"], [2, "Jane", "Smith"]]\nOrders table: [[1, 1, "Order1"], [2, 2, "Order2"]]',
						output: '[["John", "Order1"], ["Jane", "Order2"]]',
						explanation: "LEFT JOIN combines customer names with their orders.",
					},
				]),
				constraints: JSON.stringify([
					"Use LEFT JOIN to include all customers even if they have no orders.",
					"Return customer first name, last name, and order details.",
				]),
				solutions: JSON.stringify(["Database", "SQL", "LEFT JOIN"]),
				leetcodeUrl: "https://leetcode.com/problems/combine-two-tables/",
			},
			{
				title: "Second Highest Salary",
				difficulty: "Medium",
				category: "Database",
				description:
					"Write a SQL query to get the second highest salary from the Employee table.",
				examples: JSON.stringify([
					{
						input: "Employee table: [[1, 100], [2, 200], [3, 300]]",
						output: "200",
						explanation: "Second highest salary is 200.",
					},
					{
						input: "Employee table: [[1, 100]]",
						output: "null",
						explanation: "No second highest salary.",
					},
				]),
				constraints: JSON.stringify([
					"If there is no second highest salary, return null.",
					"Use subquery with LIMIT and OFFSET.",
				]),
				solutions: JSON.stringify(["Database", "SQL", "Subquery"]),
				leetcodeUrl: "https://leetcode.com/problems/second-highest-salary/",
			},
			{
				title: "Rank Scores",
				difficulty: "Medium",
				category: "Database",
				description:
					"Write a SQL query to rank scores. If there is a tie between two scores, both should have the same ranking.",
				examples: JSON.stringify([
					{
						input:
							"Scores table: [[1, 3.50], [2, 3.65], [3, 4.00], [4, 3.85], [5, 4.00], [6, 3.65]]",
						output:
							"[[4.00, 1], [4.00, 1], [3.85, 2], [3.65, 3], [3.65, 3], [3.50, 4]]",
						explanation: "DENSE_RANK provides ranking without gaps.",
					},
				]),
				constraints: JSON.stringify([
					"Use DENSE_RANK() window function.",
					"Order by score in descending order.",
				]),
				solutions: JSON.stringify(["Database", "SQL", "Window Function"]),
				leetcodeUrl: "https://leetcode.com/problems/rank-scores/",
			},
			{
				title: "Consecutive Numbers",
				difficulty: "Medium",
				category: "Database",
				description:
					"Write a SQL query to find all numbers that appear at least three times consecutively.",
				examples: JSON.stringify([
					{
						input:
							"Logs table: [[1, 1], [2, 1], [3, 1], [4, 2], [5, 1], [6, 2], [7, 2]]",
						output: "[1]",
						explanation: "1 appears three times consecutively.",
					},
				]),
				constraints: JSON.stringify([
					"Use self join or window functions.",
					"Numbers must appear consecutively.",
				]),
				solutions: JSON.stringify(["Database", "SQL", "Self Join"]),
				leetcodeUrl: "https://leetcode.com/problems/consecutive-numbers/",
			},
			{
				title: "Department Top Three Salaries",
				difficulty: "Hard",
				category: "Database",
				description:
					"Write a SQL query to find employees who have the highest salary in each of the departments.",
				examples: JSON.stringify([
					{
						input:
							'Employee table: [[1, "Joe", 70000, 1], [2, "Henry", 80000, 2], [3, "Sam", 60000, 2], [4, "Max", 90000, 1]]\nDepartment table: [[1, "IT"], [2, "Sales"]]',
						output: '[["IT", "Max", 90000], ["Sales", "Henry", 80000]]',
						explanation: "Top salary per department.",
					},
				]),
				constraints: JSON.stringify([
					"Use window functions with PARTITION BY.",
					"Handle ties appropriately.",
				]),
				solutions: JSON.stringify(["Database", "SQL", "Window Function"]),
				leetcodeUrl:
					"https://leetcode.com/problems/department-top-three-salaries/",
			},
		];

		// Insert all problems
		for (const problem of problems) {
			await supabase.from("problems").upsert(problem, { onConflict: "title" });
		}

		return NextResponse.json({
			success: true,
			message: `Successfully seeded ${problems.length} problems from batch1.js and additional comprehensive problem set`,
		});
	} catch (error) {
		console.error("Problem seeding error:", error);
		return NextResponse.json(
			{
				success: false,
				error: "Failed to seed problems",
			},
			{ status: 500 },
		);
	}
}
