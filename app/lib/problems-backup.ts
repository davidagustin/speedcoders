export const comprehensiveProblems = [
	// Original enhanced problems
	{
		title: "Two Sum",
		difficulty: "Easy",
		url: "https://leetcode.com/problems/two-sum/",
		algorithms: ["Hash Table", "Array", "Brute Force"],
		description:
			"Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume that each input would have exactly one solution, and you may not use the same element twice.",
		editorial: {
			approach:
				"Use a hash table to store complements. For each number, check if its complement (target - num) exists in the hash table.",
			timeComplexity: "O(n)",
			spaceComplexity: "O(n)",
			solutions: [
				{
					name: "Hash Table Approach",
					description:
						"Use a hash map to store numbers and their indices. For each number, check if target - num exists in the map.",
					code: "// Hash table solution\nconst twoSum = (nums, target) => {\n  const map = new Map();\n  for (let i = 0; i < nums.length; i++) {\n    const complement = target - nums[i];\n    if (map.has(complement)) {\n      return [map.get(complement), i];\n    }\n    map.set(nums[i], i);\n  }\n  return [];\n};",
				},
			],
		},
	},
	{
		title: "Add Two Numbers",
		difficulty: "Medium",
		url: "https://leetcode.com/problems/add-two-numbers/",
		algorithms: ["Linked List", "Math", "Recursion"],
		description:
			"You are given two non-empty linked lists representing two non-negative integers. The digits are stored in reverse order, and each of their nodes contains a single digit. Add the two numbers and return the sum as a linked list.",
		editorial: {
			approach:
				"Simulate the addition process digit by digit, handling carry-over at each step.",
			timeComplexity: "O(max(M, N))",
			spaceComplexity: "O(max(M, N))",
			solutions: [
				{
					name: "Iterative Approach",
					description:
						"Traverse both lists simultaneously, adding digits and handling carry.",
					code: "// Iterative solution\nconst addTwoNumbers = (l1, l2) => {\n  const dummy = new ListNode(0);\n  let current = dummy;\n  let carry = 0;\n  \n  while (l1 || l2 || carry) {\n    const sum = (l1?.val || 0) + (l2?.val || 0) + carry;\n    carry = Math.floor(sum / 10);\n    current.next = new ListNode(sum % 10);\n    current = current.next;\n    l1 = l1?.next;\n    l2 = l2?.next;\n  }\n  \n  return dummy.next;\n};",
				},
			],
		},
	},
	// Additional problems from README
	{
		title: "Longest Substring Without Repeating Characters",
		difficulty: "Medium",
		url: "https://leetcode.com/problems/longest-substring-without-repeating-characters/",
		algorithms: ["Sliding Window", "Hash Table", "String", "Two Pointers"],
		description:
			"Given a string s, find the length of the longest substring without repeating characters.",
		editorial: {
			approach:
				"Use sliding window technique with a hash set to track unique characters.",
			timeComplexity: "O(n)",
			spaceComplexity: "O(min(m, n))",
			solutions: [
				{
					name: "Sliding Window",
					description:
						"Maintain a window of unique characters using two pointers and a hash set.",
					code: "// Sliding window solution\nconst lengthOfLongestSubstring = (s) => {\n  const set = new Set();\n  let left = 0, maxLength = 0;\n  \n  for (let right = 0; right < s.length; right++) {\n    while (set.has(s[right])) {\n      set.delete(s[left]);\n      left++;\n    }\n    set.add(s[right]);\n    maxLength = Math.max(maxLength, right - left + 1);\n  }\n  \n  return maxLength;\n};",
				},
			],
		},
	},
	{
		title: "Median of Two Sorted Arrays",
		difficulty: "Hard",
		url: "https://leetcode.com/problems/median-of-two-sorted-arrays/",
		algorithms: ["Binary Search", "Divide and Conquer", "Array"],
		description:
			"Given two sorted arrays nums1 and nums2 of size m and n respectively, return the median of the two sorted arrays.",
		editorial: {
			approach:
				"Use binary search to find the correct partition point that divides both arrays into left and right halves.",
			timeComplexity: "O(log(min(m, n)))",
			spaceComplexity: "O(1)",
			solutions: [
				{
					name: "Binary Search Approach",
					description:
						"Find the partition point using binary search on the smaller array.",
					code: "// Binary search solution\nconst findMedianSortedArrays = (nums1, nums2) => {\n  if (nums1.length > nums2.length) {\n    return findMedianSortedArrays(nums2, nums1);\n  }\n  \n  const x = nums1.length, y = nums2.length;\n  let low = 0, high = x;\n  \n  while (low <= high) {\n    const partitionX = Math.floor((low + high) / 2);\n    const partitionY = Math.floor((x + y + 1) / 2) - partitionX;\n    \n    const maxLeftX = partitionX === 0 ? -Infinity : nums1[partitionX - 1];\n    const minRightX = partitionX === x ? Infinity : nums1[partitionX];\n    const maxLeftY = partitionY === 0 ? -Infinity : nums2[partitionY - 1];\n    const minRightY = partitionY === y ? Infinity : nums2[partitionY];\n    \n    if (maxLeftX <= minRightY && maxLeftY <= minRightX) {\n      if ((x + y) % 2 === 0) {\n        return (Math.max(maxLeftX, maxLeftY) + Math.min(minRightX, minRightY)) / 2;\n      } else {\n        return Math.max(maxLeftX, maxLeftY);\n      }\n    } else if (maxLeftX > minRightY) {\n      high = partitionX - 1;\n    } else {\n      low = partitionX + 1;\n    }\n  }\n};",
				},
			],
		},
	},
	{
		title: "Longest Palindromic Substring",
		difficulty: "Medium",
		url: "https://leetcode.com/problems/longest-palindromic-substring/",
		algorithms: ["Dynamic Programming", "String", "Expand Around Center"],
		description:
			"Given a string s, return the longest palindromic substring in s.",
		editorial: {
			approach:
				"Use dynamic programming or expand around center technique to find the longest palindrome.",
			timeComplexity: "O(n²)",
			spaceComplexity: "O(n²)",
			solutions: [
				{
					name: "Expand Around Center",
					description:
						"For each character, expand around it to find the longest palindrome.",
					code: "// Expand around center solution\nconst longestPalindrome = (s) => {\n  let start = 0, maxLength = 1;\n  \n  const expandAroundCenter = (left, right) => {\n    while (left >= 0 && right < s.length && s[left] === s[right]) {\n      left--;\n      right++;\n    }\n    return right - left - 1;\n  };\n  \n  for (let i = 0; i < s.length; i++) {\n    const len1 = expandAroundCenter(i, i);\n    const len2 = expandAroundCenter(i, i + 1);\n    const maxLen = Math.max(len1, len2);\n    \n    if (maxLen > maxLength) {\n      start = i - Math.floor((maxLen - 1) / 2);\n      maxLength = maxLen;\n    }\n  }\n  \n  return s.substring(start, start + maxLength);\n};",
				},
			],
		},
	},
	{
		title: "Zigzag Conversion",
		difficulty: "Medium",
		url: "https://leetcode.com/problems/zigzag-conversion/",
		algorithms: ["String", "Simulation"],
		description:
			'The string "PAYPALISHIRING" is written in a zigzag pattern on a given number of rows.',
		editorial: {
			approach:
				"Simulate the zigzag pattern by tracking the current row and direction.",
			timeComplexity: "O(n)",
			spaceComplexity: "O(n)",
			solutions: [
				{
					name: "Row-by-Row Approach",
					description:
						"Build the result string row by row by tracking the zigzag pattern.",
					code: "// Row-by-row solution\nconst convert = (s, numRows) => {\n  if (numRows === 1) return s;\n  \n  const rows = Array(numRows).fill('');\n  let currentRow = 0;\n  let goingDown = false;\n  \n  for (const char of s) {\n    rows[currentRow] += char;\n    \n    if (currentRow === 0 || currentRow === numRows - 1) {\n      goingDown = !goingDown;\n    }\n    \n    currentRow += goingDown ? 1 : -1;\n  }\n  \n  return rows.join('');\n};",
				},
			],
		},
	},
	{
		title: "Reverse Integer",
		difficulty: "Medium",
		url: "https://leetcode.com/problems/reverse-integer/",
		algorithms: ["Math", "Bit Manipulation"],
		description:
			"Given a signed 32-bit integer x, return x with its digits reversed.",
		editorial: {
			approach:
				"Extract digits one by one and build the reversed number, handling overflow.",
			timeComplexity: "O(log n)",
			spaceComplexity: "O(1)",
			solutions: [
				{
					name: "Digit Extraction",
					description:
						"Extract digits and build reversed number while checking for overflow.",
					code: "// Digit extraction solution\nconst reverse = (x) => {\n  let result = 0;\n  const isNegative = x < 0;\n  x = Math.abs(x);\n  \n  while (x > 0) {\n    const digit = x % 10;\n    result = result * 10 + digit;\n    x = Math.floor(x / 10);\n  }\n  \n  if (result > 2**31 - 1) return 0;\n  return isNegative ? -result : result;\n};",
				},
			],
		},
	},
	{
		title: "String to Integer (atoi)",
		difficulty: "Medium",
		url: "https://leetcode.com/problems/string-to-integer-atoi/",
		algorithms: ["String", "Math"],
		description:
			"Implement the myAtoi(string s) function, which converts a string to a 32-bit signed integer.",
		editorial: {
			approach:
				"Parse the string character by character, handling whitespace, signs, and overflow.",
			timeComplexity: "O(n)",
			spaceComplexity: "O(1)",
			solutions: [
				{
					name: "Character-by-Character Parsing",
					description:
						"Parse the string step by step, handling all edge cases.",
					code: "// Character parsing solution\nconst myAtoi = (s) => {\n  let i = 0;\n  let sign = 1;\n  let result = 0;\n  \n  // Skip whitespace\n  while (i < s.length && s[i] === ' ') i++;\n  \n  // Handle sign\n  if (i < s.length && (s[i] === '+' || s[i] === '-')) {\n    sign = s[i] === '-' ? -1 : 1;\n    i++;\n  }\n  \n  // Parse digits\n  while (i < s.length && /\\d/.test(s[i])) {\n    const digit = parseInt(s[i]);\n    result = result * 10 + digit;\n    \n    if (result > 2**31 - 1) {\n      return sign === 1 ? 2**31 - 1 : -2**31;\n    }\n    i++;\n  }\n  \n  return sign * result;\n};",
				},
			],
		},
	},
	{
		title: "Palindrome Number",
		difficulty: "Easy",
		url: "https://leetcode.com/problems/palindrome-number/",
		algorithms: ["Math", "String"],
		description:
			"Given an integer x, return true if x is a palindrome, and false otherwise.",
		editorial: {
			approach:
				"Convert to string and check if it reads the same forwards and backwards, or reverse the number mathematically.",
			timeComplexity: "O(log n)",
			spaceComplexity: "O(1)",
			solutions: [
				{
					name: "Mathematical Approach",
					description: "Reverse the number and compare with original.",
					code: "// Mathematical solution\nconst isPalindrome = (x) => {\n  if (x < 0) return false;\n  let reversed = 0;\n  let original = x;\n  \n  while (x > 0) {\n    reversed = reversed * 10 + x % 10;\n    x = Math.floor(x / 10);\n  }\n  \n  return reversed === original;\n};",
				},
			],
		},
	},
	{
		title: "Regular Expression Matching",
		difficulty: "Hard",
		url: "https://leetcode.com/problems/regular-expression-matching/",
		algorithms: ["Dynamic Programming", "Recursion"],
		description:
			"Given an input string s and a pattern p, implement regular expression matching with support for '.' and '*'.",
		editorial: {
			approach:
				"Use dynamic programming to match the pattern against the string recursively.",
			timeComplexity: "O(mn)",
			spaceComplexity: "O(mn)",
			solutions: [
				{
					name: "Dynamic Programming",
					description:
						"Use DP table to track matching states for each position.",
					code: "// DP solution\nconst isMatch = (s, p) => {\n  const dp = Array(s.length + 1).fill().map(() => Array(p.length + 1).fill(false));\n  dp[0][0] = true;\n  \n  // Handle patterns with *\n  for (let j = 1; j <= p.length; j++) {\n    if (p[j - 1] === '*') {\n      dp[0][j] = dp[0][j - 2];\n    }\n  }\n  \n  for (let i = 1; i <= s.length; i++) {\n    for (let j = 1; j <= p.length; j++) {\n      if (p[j - 1] === '.' || p[j - 1] === s[i - 1]) {\n        dp[i][j] = dp[i - 1][j - 1];\n      } else if (p[j - 1] === '*') {\n        dp[i][j] = dp[i][j - 2];\n        if (p[j - 2] === '.' || p[j - 2] === s[i - 1]) {\n          dp[i][j] = dp[i][j] || dp[i - 1][j];\n        }\n      }\n    }\n  }\n  \n  return dp[s.length][p.length];\n};",
				},
			],
		},
	},
	{
		title: "Container With Most Water",
		difficulty: "Medium",
		url: "https://leetcode.com/problems/container-with-most-water/",
		algorithms: ["Two Pointers", "Array", "Greedy"],
		description:
			"Given n non-negative integers height where each represents a point at coordinate (i, height[i]), find two lines that together with the x-axis form a container that would hold the maximum amount of water.",
		editorial: {
			approach:
				"Use two pointers starting from both ends and move the pointer with smaller height inward.",
			timeComplexity: "O(n)",
			spaceComplexity: "O(1)",
			solutions: [
				{
					name: "Two Pointers Approach",
					description: "Start with widest container and move pointers inward.",
					code: "// Two pointers solution\nconst maxArea = (height) => {\n  let left = 0, right = height.length - 1;\n  let maxArea = 0;\n  \n  while (left < right) {\n    const area = Math.min(height[left], height[right]) * (right - left);\n    maxArea = Math.max(maxArea, area);\n    \n    if (height[left] < height[right]) {\n      left++;\n    } else {\n      right--;\n    }\n  }\n  \n  return maxArea;\n};",
				},
			],
		},
	},
	{
		title: "Integer to Roman",
		difficulty: "Medium",
		url: "https://leetcode.com/problems/integer-to-roman/",
		algorithms: ["Math", "String"],
		description: "Given an integer, convert it to a roman numeral.",
		editorial: {
			approach:
				"Use a mapping of integer values to roman numerals and build the result.",
			timeComplexity: "O(1)",
			spaceComplexity: "O(1)",
			solutions: [
				{
					name: "Greedy Approach",
					description: "Use the largest possible roman numeral at each step.",
					code: "// Greedy solution\nconst intToRoman = (num) => {\n  const values = [1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1];\n  const symbols = ['M', 'CM', 'D', 'CD', 'C', 'XC', 'L', 'XL', 'X', 'IX', 'V', 'IV', 'I'];\n  \n  let result = '';\n  \n  for (let i = 0; i < values.length; i++) {\n    while (num >= values[i]) {\n      result += symbols[i];\n      num -= values[i];\n    }\n  }\n  \n  return result;\n};",
				},
			],
		},
	},
	{
		title: "Roman to Integer",
		difficulty: "Easy",
		url: "https://leetcode.com/problems/roman-to-integer/",
		algorithms: ["Math", "String"],
		description: "Given a roman numeral, convert it to an integer.",
		editorial: {
			approach:
				"Process the roman numeral from left to right, handling special cases where a smaller value precedes a larger one.",
			timeComplexity: "O(n)",
			spaceComplexity: "O(1)",
			solutions: [
				{
					name: "Left-to-Right Processing",
					description: "Process each character and handle special cases.",
					code: "// Left-to-right solution\nconst romanToInt = (s) => {\n  const values = {\n    'I': 1, 'V': 5, 'X': 10, 'L': 50,\n    'C': 100, 'D': 500, 'M': 1000\n  };\n  \n  let result = 0;\n  \n  for (let i = 0; i < s.length; i++) {\n    const current = values[s[i]];\n    const next = values[s[i + 1]] || 0;\n    \n    if (current < next) {\n      result += next - current;\n      i++;\n    } else {\n      result += current;\n    }\n  }\n  \n  return result;\n};",
				},
			],
		},
	},
	{
		title: "Longest Common Prefix",
		difficulty: "Easy",
		url: "https://leetcode.com/problems/longest-common-prefix/",
		algorithms: ["String", "Trie"],
		description:
			"Write a function to find the longest common prefix string amongst an array of strings.",
		editorial: {
			approach:
				"Compare characters at the same position across all strings until a mismatch is found.",
			timeComplexity: "O(S)",
			spaceComplexity: "O(1)",
			solutions: [
				{
					name: "Horizontal Scanning",
					description: "Compare strings one by one to find the common prefix.",
					code: "// Horizontal scanning solution\nconst longestCommonPrefix = (strs) => {\n  if (strs.length === 0) return '';\n  \n  let prefix = strs[0];\n  \n  for (let i = 1; i < strs.length; i++) {\n    while (strs[i].indexOf(prefix) !== 0) {\n      prefix = prefix.substring(0, prefix.length - 1);\n      if (prefix === '') return '';\n    }\n  }\n  \n  return prefix;\n};",
				},
			],
		},
	},
	{
		title: "3Sum",
		difficulty: "Medium",
		url: "https://leetcode.com/problems/3sum/",
		algorithms: ["Two Pointers", "Array", "Sorting"],
		description:
			"Given an integer array nums, return all the triplets [nums[i], nums[j], nums[k]] such that i != j, i != k, and j != k, and nums[i] + nums[j] + nums[k] == 0.",
		editorial: {
			approach:
				"Sort the array and use two pointers to find triplets that sum to zero.",
			timeComplexity: "O(n²)",
			spaceComplexity: "O(1)",
			solutions: [
				{
					name: "Two Pointers Approach",
					description:
						"Sort array and use two pointers to find valid triplets.",
					code: "// Two pointers solution\nconst threeSum = (nums) => {\n  const result = [];\n  nums.sort((a, b) => a - b);\n  \n  for (let i = 0; i < nums.length - 2; i++) {\n    if (i > 0 && nums[i] === nums[i - 1]) continue;\n    \n    let left = i + 1, right = nums.length - 1;\n    \n    while (left < right) {\n      const sum = nums[i] + nums[left] + nums[right];\n      \n      if (sum === 0) {\n        result.push([nums[i], nums[left], nums[right]]);\n        while (left < right && nums[left] === nums[left + 1]) left++;\n        while (left < right && nums[right] === nums[right - 1]) right--;\n        left++;\n        right--;\n      } else if (sum < 0) {\n        left++;\n      } else {\n        right--;\n      }\n    }\n  }\n  \n  return result;\n};",
				},
			],
		},
	},
];

// Export for use in the app
export const allProblems = comprehensiveProblems;
export const easyProblems = comprehensiveProblems.filter(
	(p) => p.difficulty === "Easy",
);
export const mediumProblems = comprehensiveProblems.filter(
	(p) => p.difficulty === "Medium",
);
export const hardProblems = comprehensiveProblems.filter(
	(p) => p.difficulty === "Hard",
);

// Algorithm categories for filtering
export const algorithmCategories = [
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
	"Backtracking",
	"Heap",
	"Bit Manipulation",
	"Graph",
	"Design",
	"Linked List",
	"Recursion",
	"Sliding Window",
	"Divide and Conquer",
	"Trie",
	"Binary Tree",
	"Monotonic Stack",
	"Topological Sort",
	"Quick Select",
	"Bucket Sort",
	"Minimum Spanning Tree",
	"Counting",
	"Binary Search Tree",
	"XOR",
	"Kadane's Algorithm",
	"Floyd's Cycle Detection",
	"Morris Traversal",
	"Expand Around Center",
	"Brute Force",
	"Iteration",
	"Memoization",
];
