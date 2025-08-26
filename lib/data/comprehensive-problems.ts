export interface ComprehensiveProblem {
  id: number;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: string;
  algorithms: string[];
  description: string;
  examples: string[];
  constraints: string[];
  solutions: string[];
  timeComplexity: string;
  spaceComplexity: string;
  leetcodeUrl: string;
  tags: string[];
}

export const comprehensiveProblems: ComprehensiveProblem[] = [
  {
    id: 1,
    title: "Two Sum",
    difficulty: "Easy",
    category: "Array",
    algorithms: ["Hash Table", "Two Pointers"],
    description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
    examples: [
      "Input: nums = [2,7,11,15], target = 9\nOutput: [0,1]\nExplanation: Because nums[0] + nums[1] == 9, we return [0, 1].",
      "Input: nums = [3,2,4], target = 6\nOutput: [1,2]",
      "Input: nums = [3,3], target = 6\nOutput: [0,1]"
    ],
    constraints: [
      "2 <= nums.length <= 10^4",
      "-10^9 <= nums[i] <= 10^9",
      "-10^9 <= target <= 10^9",
      "Only one valid answer exists."
    ],
    solutions: [
      "Hash Table Approach: Use a hash map to store complement values",
      "Two Pointers Approach: Sort array and use two pointers (if indices don't matter)"
    ],
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    leetcodeUrl: "https://leetcode.com/problems/two-sum/",
    tags: ["array", "hash-table", "two-pointers"]
  },
  {
    id: 2,
    title: "Add Two Numbers",
    difficulty: "Medium",
    category: "Linked List",
    algorithms: ["Linked List", "Math"],
    description: "You are given two non-empty linked lists representing two non-negative integers. The digits are stored in reverse order, and each of their nodes contains a single digit.",
    examples: [
      "Input: l1 = [2,4,3], l2 = [5,6,4]\nOutput: [7,0,8]\nExplanation: 342 + 465 = 807.",
      "Input: l1 = [0], l2 = [0]\nOutput: [0]",
      "Input: l1 = [9,9,9,9,9,9,9], l2 = [9,9,9,9]\nOutput: [8,9,9,9,0,0,0,1]"
    ],
    constraints: [
      "The number of nodes in each linked list is in the range [1, 100]",
      "0 <= Node.val <= 9",
      "It is guaranteed that the list represents a number that does not have leading zeros."
    ],
    solutions: [
      "Iterative Approach: Traverse both lists simultaneously, handle carry",
      "Recursive Approach: Use recursion to handle the addition"
    ],
    timeComplexity: "O(max(M,N))",
    spaceComplexity: "O(max(M,N))",
    leetcodeUrl: "https://leetcode.com/problems/add-two-numbers/",
    tags: ["linked-list", "math", "recursion"]
  },
  {
    id: 3,
    title: "Longest Substring Without Repeating Characters",
    difficulty: "Medium",
    category: "String",
    algorithms: ["Sliding Window", "Hash Table"],
    description: "Given a string s, find the length of the longest substring without repeating characters.",
    examples: [
      'Input: s = "abcabcbb"\nOutput: 3\nExplanation: The answer is "abc", with the length of 3.',
      'Input: s = "bbbbb"\nOutput: 1\nExplanation: The answer is "b", with the length of 1.',
      'Input: s = "pwwkew"\nOutput: 3\nExplanation: The answer is "wke", with the length of 3.'
    ],
    constraints: [
      "0 <= s.length <= 5 * 10^4",
      "s consists of English letters, digits, symbols and spaces."
    ],
    solutions: [
      "Sliding Window with Hash Set: Expand window when no duplicates, contract when duplicate found",
      "Sliding Window with Hash Map: Store character positions for O(1) lookup"
    ],
    timeComplexity: "O(n)",
    spaceComplexity: "O(min(m,n))",
    leetcodeUrl: "https://leetcode.com/problems/longest-substring-without-repeating-characters/",
    tags: ["string", "sliding-window", "hash-table"]
  },
  {
    id: 4,
    title: "Median of Two Sorted Arrays",
    difficulty: "Hard",
    category: "Array",
    algorithms: ["Binary Search", "Divide and Conquer"],
    description: "Given two sorted arrays nums1 and nums2 of size m and n respectively, return the median of the two sorted arrays.",
    examples: [
      "Input: nums1 = [1,3], nums2 = [2]\nOutput: 2.00000\nExplanation: merged array = [1,2,3] and median is 2.",
      "Input: nums1 = [1,2], nums2 = [3,4]\nOutput: 2.50000\nExplanation: merged array = [1,2,3,4] and median is (2 + 3) / 2 = 2.5."
    ],
    constraints: [
      "nums1.length + nums2.length >= 1",
      "nums1.length + nums2.length <= 2000",
      "-10^6 <= nums1[i], nums2[i] <= 10^6"
    ],
    solutions: [
      "Binary Search Approach: Find the correct partition point in both arrays",
      "Merge and Sort: Merge arrays and find median (not optimal)"
    ],
    timeComplexity: "O(log(min(m,n)))",
    spaceComplexity: "O(1)",
    leetcodeUrl: "https://leetcode.com/problems/median-of-two-sorted-arrays/",
    tags: ["array", "binary-search", "divide-and-conquer"]
  },
  {
    id: 5,
    title: "Valid Parentheses",
    difficulty: "Easy",
    category: "Stack",
    algorithms: ["Stack"],
    description: "Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.",
    examples: [
      'Input: s = "()"\nOutput: true',
      'Input: s = "()[]{}"\nOutput: true',
      'Input: s = "(]"\nOutput: false'
    ],
    constraints: [
      "1 <= s.length <= 10^4",
      "s consists of parentheses only '()[]{}'"
    ],
    solutions: [
      "Stack Approach: Push opening brackets, pop and match closing brackets",
      "Counter Approach: Count brackets (only works for single type)"
    ],
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    leetcodeUrl: "https://leetcode.com/problems/valid-parentheses/",
    tags: ["stack", "string"]
  },
  {
    id: 6,
    title: "Merge Two Sorted Lists",
    difficulty: "Easy",
    category: "Linked List",
    algorithms: ["Linked List", "Two Pointers"],
    description: "Merge two sorted linked lists and return it as a sorted list. The list should be made by splicing together the nodes of the first two lists.",
    examples: [
      "Input: l1 = [1,2,4], l2 = [1,3,4]\nOutput: [1,1,2,3,4,4]",
      "Input: l1 = [], l2 = []\nOutput: []",
      "Input: l1 = [], l2 = [0]\nOutput: [0]"
    ],
    constraints: [
      "The number of nodes in both lists is in the range [0, 50]",
      "-100 <= Node.val <= 100",
      "Both l1 and l2 are sorted in non-decreasing order"
    ],
    solutions: [
      "Iterative Approach: Compare nodes and link them in order",
      "Recursive Approach: Use recursion to merge lists"
    ],
    timeComplexity: "O(n + m)",
    spaceComplexity: "O(1)",
    leetcodeUrl: "https://leetcode.com/problems/merge-two-sorted-lists/",
    tags: ["linked-list", "recursion"]
  },
  {
    id: 7,
    title: "Maximum Subarray",
    difficulty: "Medium",
    category: "Array",
    algorithms: ["Dynamic Programming", "Kadane's Algorithm"],
    description: "Given an integer array nums, find the contiguous subarray (containing at least one number) which has the largest sum and return its sum.",
    examples: [
      "Input: nums = [-2,1,-3,4,-1,2,1,-5,4]\nOutput: 6\nExplanation: [4,-1,2,1] has the largest sum = 6.",
      "Input: nums = [1]\nOutput: 1",
      "Input: nums = [5,4,-1,7,8]\nOutput: 23"
    ],
    constraints: [
      "1 <= nums.length <= 10^5",
      "-10^4 <= nums[i] <= 10^4"
    ],
    solutions: [
      "Kadane's Algorithm: Track current sum and maximum sum",
      "Divide and Conquer: Split array and find max subarray in each half"
    ],
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    leetcodeUrl: "https://leetcode.com/problems/maximum-subarray/",
    tags: ["array", "divide-and-conquer", "dynamic-programming"]
  },
  {
    id: 8,
    title: "Climbing Stairs",
    difficulty: "Easy",
    category: "Dynamic Programming",
    algorithms: ["Dynamic Programming", "Math"],
    description: "You are climbing a staircase. It takes n steps to reach the top. Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?",
    examples: [
      "Input: n = 2\nOutput: 2\nExplanation: There are two ways to climb to the top.\n1. 1 step + 1 step\n2. 2 steps",
      "Input: n = 3\nOutput: 3\nExplanation: There are three ways to climb to the top.\n1. 1 step + 1 step + 1 step\n2. 1 step + 2 steps\n3. 2 steps + 1 step"
    ],
    constraints: [
      "1 <= n <= 45"
    ],
    solutions: [
      "Dynamic Programming: Use memoization or tabulation",
      "Mathematical: Use Fibonacci sequence formula"
    ],
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    leetcodeUrl: "https://leetcode.com/problems/climbing-stairs/",
    tags: ["math", "dynamic-programming", "memoization"]
  },
  {
    id: 9,
    title: "Binary Tree Inorder Traversal",
    difficulty: "Easy",
    category: "Tree",
    algorithms: ["Tree Traversal", "Stack"],
    description: "Given the root of a binary tree, return the inorder traversal of its nodes' values.",
    examples: [
      "Input: root = [1,null,2,3]\nOutput: [1,3,2]",
      "Input: root = []\nOutput: []",
      "Input: root = [1]\nOutput: [1]"
    ],
    constraints: [
      "The number of nodes in the tree is in the range [0, 100]",
      "-100 <= Node.val <= 100"
    ],
    solutions: [
      "Recursive Approach: Visit left subtree, root, right subtree",
      "Iterative Approach: Use stack to simulate recursion"
    ],
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    leetcodeUrl: "https://leetcode.com/problems/binary-tree-inorder-traversal/",
    tags: ["stack", "tree", "depth-first-search"]
  },
  {
    id: 10,
    title: "Symmetric Tree",
    difficulty: "Easy",
    category: "Tree",
    algorithms: ["Tree Traversal", "Recursion"],
    description: "Given the root of a binary tree, check whether it is a mirror of itself (i.e., symmetric around its center).",
    examples: [
      "Input: root = [1,2,2,3,4,4,3]\nOutput: true",
      "Input: root = [1,2,2,null,3,null,3]\nOutput: false"
    ],
    constraints: [
      "The number of nodes in the tree is in the range [1, 1000]",
      "-100 <= Node.val <= 100"
    ],
    solutions: [
      "Recursive Approach: Compare left.left with right.right and left.right with right.left",
      "Iterative Approach: Use queue to compare nodes level by level"
    ],
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    leetcodeUrl: "https://leetcode.com/problems/symmetric-tree/",
    tags: ["tree", "depth-first-search", "breadth-first-search"]
  },
  
  // Additional Array Problems
  {
    id: 11,
    title: "Container With Most Water",
    difficulty: "Medium",
    category: "Array",
    algorithms: ["Two Pointers", "Greedy"],
    description: "Find two lines that together with the x-axis form a container that holds the most water.",
    examples: [
      "Input: height = [1,8,6,2,5,4,8,3,7]\nOutput: 49\nExplanation: The above vertical lines are represented by array [1,8,6,2,5,4,8,3,7]. In this case, the max area of water (blue section) the container can contain is 49.",
      "Input: height = [1,1]\nOutput: 1"
    ],
    constraints: [
      "n >= 2",
      "0 <= height[i] <= 3 * 10^4"
    ],
    solutions: [
      "Two Pointers: Start from both ends, move the pointer with smaller height",
      "Brute Force: Check all possible pairs (not optimal)"
    ],
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    leetcodeUrl: "https://leetcode.com/problems/container-with-most-water/",
    tags: ["array", "two-pointers", "greedy"]
  },
  {
    id: 12,
    title: "3Sum",
    difficulty: "Medium",
    category: "Array",
    algorithms: ["Two Pointers", "Array", "Sorting"],
    description: "Given an integer array nums, return all the triplets [nums[i], nums[j], nums[k]] such that i != j, i != k, and j != k, and nums[i] + nums[j] + nums[k] == 0.",
    examples: [
      "Input: nums = [-1,0,1,2,-1,-4]\nOutput: [[-1,-1,2],[-1,0,1]]\nExplanation: nums[0] + nums[1] + nums[2] = (-1) + 0 + 1 = 0.",
      "Input: nums = []\nOutput: []",
      "Input: nums = [0]\nOutput: []"
    ],
    constraints: [
      "0 <= nums.length <= 3000",
      "-10^5 <= nums[i] <= 10^5"
    ],
    solutions: [
      "Sort + Two Pointers: Fix first element, use two pointers for remaining two",
      "Hash Set: Use nested loops with hash set for third element"
    ],
    timeComplexity: "O(n²)",
    spaceComplexity: "O(1)",
    leetcodeUrl: "https://leetcode.com/problems/3sum/",
    tags: ["array", "two-pointers", "sorting"]
  },
  {
    id: 13,
    title: "Best Time to Buy and Sell Stock",
    difficulty: "Easy",
    category: "Array",
    algorithms: ["Array", "Dynamic Programming"],
    description: "You want to maximize your profit by choosing a single day to buy one stock and choosing a different day in the future to sell that stock.",
    examples: [
      "Input: prices = [7,1,5,3,6,4]\nOutput: 5\nExplanation: Buy on day 2 (price = 1) and sell on day 5 (price = 6), profit = 6-1 = 5.",
      "Input: prices = [7,6,4,3,1]\nOutput: 0\nExplanation: In this case, no transactions are done and the max profit = 0."
    ],
    constraints: [
      "1 <= prices.length <= 10^5",
      "0 <= prices[i] <= 10^4"
    ],
    solutions: [
      "One Pass: Keep track of minimum price seen so far and maximum profit",
      "Dynamic Programming: Track buy and sell states"
    ],
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    leetcodeUrl: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock/",
    tags: ["array", "dynamic-programming"]
  },
  {
    id: 14,
    title: "Product of Array Except Self",
    difficulty: "Medium",
    category: "Array",
    algorithms: ["Array", "Prefix Sum"],
    description: "Given an integer array nums, return an array answer such that answer[i] is equal to the product of all the elements of nums except nums[i].",
    examples: [
      "Input: nums = [1,2,3,4]\nOutput: [24,12,8,6]",
      "Input: nums = [-1,1,0,-3,3]\nOutput: [0,0,9,0,0]"
    ],
    constraints: [
      "2 <= nums.length <= 10^5",
      "-30 <= nums[i] <= 30",
      "The product of any prefix or suffix of nums is guaranteed to fit in a 32-bit integer"
    ],
    solutions: [
      "Left and Right Products: Calculate left products, then right products in reverse",
      "Space Optimized: Use output array to store left products, then multiply with right"
    ],
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    leetcodeUrl: "https://leetcode.com/problems/product-of-array-except-self/",
    tags: ["array", "prefix-sum"]
  },
  {
    id: 15,
    title: "Maximum Product Subarray",
    difficulty: "Medium",
    category: "Array",
    algorithms: ["Array", "Dynamic Programming"],
    description: "Given an integer array nums, find a contiguous non-empty subarray within the array that has the largest product, and return the product.",
    examples: [
      "Input: nums = [2,3,-2,4]\nOutput: 6\nExplanation: [2,3] has the largest product 6.",
      "Input: nums = [-2,0,-1]\nOutput: 0\nExplanation: The result cannot be 2, because [-2,-1] is not a subarray."
    ],
    constraints: [
      "1 <= nums.length <= 2 * 10^4",
      "-10 <= nums[i] <= 10",
      "The product of any prefix or suffix of nums is guaranteed to fit in a 32-bit integer"
    ],
    solutions: [
      "Track Min and Max: Keep both minimum and maximum product ending at each position",
      "Reset on Zero: Handle zeros by resetting the product calculation"
    ],
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    leetcodeUrl: "https://leetcode.com/problems/maximum-product-subarray/",
    tags: ["array", "dynamic-programming"]
  },

  // More String Problems
  {
    id: 16,
    title: "Valid Anagram",
    difficulty: "Easy",
    category: "String",
    algorithms: ["Hash Table", "Sorting"],
    description: "Given two strings s and t, return true if t is an anagram of s, and false otherwise.",
    examples: [
      'Input: s = "anagram", t = "nagaram"\nOutput: true',
      'Input: s = "rat", t = "car"\nOutput: false'
    ],
    constraints: [
      "1 <= s.length, t.length <= 5 * 10^4",
      "s and t consist of lowercase English letters"
    ],
    solutions: [
      "Character Frequency Count: Count frequency of each character",
      "Sorting: Sort both strings and compare"
    ],
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    leetcodeUrl: "https://leetcode.com/problems/valid-anagram/",
    tags: ["hash-table", "string", "sorting"]
  },
  {
    id: 17,
    title: "Group Anagrams",
    difficulty: "Medium",
    category: "String",
    algorithms: ["Array", "Hash Table", "String", "Sorting"],
    description: "Given an array of strings strs, group the anagrams together.",
    examples: [
      'Input: strs = ["eat","tea","tan","ate","nat","bat"]\nOutput: [["bat"],["nat","tan"],["ate","eat","tea"]]',
      'Input: strs = [""]\nOutput: [[""]]',
      'Input: strs = ["a"]\nOutput: [["a"]]'
    ],
    constraints: [
      "1 <= strs.length <= 10^4",
      "0 <= strs[i].length <= 100",
      "strs[i] consists of lowercase English letters"
    ],
    solutions: [
      "Sort as Key: Use sorted string as hash map key",
      "Character Count as Key: Use character frequency array as key"
    ],
    timeComplexity: "O(N * K * log K)",
    spaceComplexity: "O(N * K)",
    leetcodeUrl: "https://leetcode.com/problems/group-anagrams/",
    tags: ["array", "hash-table", "string", "sorting"]
  },
  {
    id: 18,
    title: "Longest Palindromic Substring",
    difficulty: "Medium",
    category: "String",
    algorithms: ["String", "Dynamic Programming"],
    description: "Given a string s, return the longest palindromic substring in s.",
    examples: [
      'Input: s = "babad"\nOutput: "bab"\nExplanation: "aba" is also a valid answer.',
      'Input: s = "cbbd"\nOutput: "bb"'
    ],
    constraints: [
      "1 <= s.length <= 1000",
      "s consist of only digits and English letters"
    ],
    solutions: [
      "Expand Around Centers: Check for palindromes centered at each position",
      "Dynamic Programming: Build table of palindromic substrings",
      "Manacher's Algorithm: Linear time palindrome detection"
    ],
    timeComplexity: "O(n²)",
    spaceComplexity: "O(1)",
    leetcodeUrl: "https://leetcode.com/problems/longest-palindromic-substring/",
    tags: ["string", "dynamic-programming"]
  },

  // More Tree Problems
  {
    id: 19,
    title: "Maximum Depth of Binary Tree",
    difficulty: "Easy",
    category: "Tree",
    algorithms: ["Tree", "Depth-First Search", "Breadth-First Search"],
    description: "Given the root of a binary tree, return its maximum depth.",
    examples: [
      "Input: root = [3,9,20,null,null,15,7]\nOutput: 3",
      "Input: root = [1,null,2]\nOutput: 2"
    ],
    constraints: [
      "The number of nodes in the tree is in the range [0, 10^4]",
      "-100 <= Node.val <= 100"
    ],
    solutions: [
      "Recursive DFS: Return 1 + max(left_depth, right_depth)",
      "Iterative BFS: Count levels using queue"
    ],
    timeComplexity: "O(n)",
    spaceComplexity: "O(h)",
    leetcodeUrl: "https://leetcode.com/problems/maximum-depth-of-binary-tree/",
    tags: ["tree", "depth-first-search", "breadth-first-search", "binary-tree"]
  },
  {
    id: 20,
    title: "Invert Binary Tree",
    difficulty: "Easy",
    category: "Tree",
    algorithms: ["Tree", "Depth-First Search", "Breadth-First Search"],
    description: "Given the root of a binary tree, invert the tree, and return its root.",
    examples: [
      "Input: root = [4,2,7,1,3,6,9]\nOutput: [4,7,2,9,6,3,1]",
      "Input: root = [2,1,3]\nOutput: [2,3,1]",
      "Input: root = []\nOutput: []"
    ],
    constraints: [
      "The number of nodes in the tree is in the range [0, 100]",
      "-100 <= Node.val <= 100"
    ],
    solutions: [
      "Recursive: Swap left and right children, then invert subtrees",
      "Iterative: Use queue/stack to process nodes level by level"
    ],
    timeComplexity: "O(n)",
    spaceComplexity: "O(h)",
    leetcodeUrl: "https://leetcode.com/problems/invert-binary-tree/",
    tags: ["tree", "depth-first-search", "breadth-first-search", "binary-tree"]
  },

  // Dynamic Programming Problems
  {
    id: 21,
    title: "House Robber",
    difficulty: "Medium",
    category: "Dynamic Programming",
    algorithms: ["Array", "Dynamic Programming"],
    description: "You are a professional robber planning to rob houses along a street. Each house has a certain amount of money stashed, the only constraint stopping you from robbing each of them is that adjacent houses have security systems connected.",
    examples: [
      "Input: nums = [1,2,3,1]\nOutput: 4\nExplanation: Rob house 1 (money = 1) and then rob house 3 (money = 3). Total amount you can rob = 1 + 3 = 4.",
      "Input: nums = [2,7,9,3,1]\nOutput: 12\nExplanation: Rob house 1 (money = 2), rob house 3 (money = 9) and rob house 5 (money = 1). Total amount you can rob = 2 + 9 + 1 = 12."
    ],
    constraints: [
      "1 <= nums.length <= 100",
      "0 <= nums[i] <= 400"
    ],
    solutions: [
      "Dynamic Programming: dp[i] = max(dp[i-1], dp[i-2] + nums[i])",
      "Space Optimized: Only keep track of last two values"
    ],
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    leetcodeUrl: "https://leetcode.com/problems/house-robber/",
    tags: ["array", "dynamic-programming"]
  },
  {
    id: 22,
    title: "Coin Change",
    difficulty: "Medium",
    category: "Dynamic Programming",
    algorithms: ["Array", "Dynamic Programming", "Breadth-First Search"],
    description: "You are given an integer array coins representing coins of different denominations and an integer amount representing a total amount of money. Return the fewest number of coins that you need to make up that amount.",
    examples: [
      "Input: coins = [1,3,4], amount = 6\nOutput: 2\nExplanation: The answer is 6 = 3 + 3.",
      "Input: coins = [2], amount = 3\nOutput: -1",
      "Input: coins = [1], amount = 0\nOutput: 0"
    ],
    constraints: [
      "1 <= coins.length <= 12",
      "1 <= coins[i] <= 2^31 - 1",
      "0 <= amount <= 10^4"
    ],
    solutions: [
      "Bottom-up DP: Build solution from amount 0 to target amount",
      "BFS: Treat as shortest path problem"
    ],
    timeComplexity: "O(amount * n)",
    spaceComplexity: "O(amount)",
    leetcodeUrl: "https://leetcode.com/problems/coin-change/",
    tags: ["array", "dynamic-programming", "breadth-first-search"]
  },
  {
    id: 23,
    title: "Longest Increasing Subsequence",
    difficulty: "Medium",
    category: "Dynamic Programming",
    algorithms: ["Array", "Binary Search", "Dynamic Programming"],
    description: "Given an integer array nums, return the length of the longest strictly increasing subsequence.",
    examples: [
      "Input: nums = [10,9,2,5,3,7,101,18]\nOutput: 4\nExplanation: The longest increasing subsequence is [2,3,7,18], therefore the length is 4.",
      "Input: nums = [0,1,0,3,2,3]\nOutput: 4",
      "Input: nums = [7,7,7,7,7,7,7]\nOutput: 1"
    ],
    constraints: [
      "1 <= nums.length <= 2500",
      "-10^4 <= nums[i] <= 10^4"
    ],
    solutions: [
      "Dynamic Programming: dp[i] represents length of LIS ending at index i",
      "Binary Search + Tails Array: Maintain array of smallest tail elements"
    ],
    timeComplexity: "O(n log n)",
    spaceComplexity: "O(n)",
    leetcodeUrl: "https://leetcode.com/problems/longest-increasing-subsequence/",
    tags: ["array", "binary-search", "dynamic-programming"]
  },

  // Linked List Problems
  {
    id: 24,
    title: "Reverse Linked List",
    difficulty: "Easy",
    category: "Linked List",
    algorithms: ["Linked List", "Recursion"],
    description: "Given the head of a singly linked list, reverse the list, and return the reversed list.",
    examples: [
      "Input: head = [1,2,3,4,5]\nOutput: [5,4,3,2,1]",
      "Input: head = [1,2]\nOutput: [2,1]",
      "Input: head = []\nOutput: []"
    ],
    constraints: [
      "The number of nodes in the list is the range [0, 5000]",
      "-5000 <= Node.val <= 5000"
    ],
    solutions: [
      "Iterative: Use three pointers (prev, current, next)",
      "Recursive: Reverse rest of list, then fix pointers"
    ],
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    leetcodeUrl: "https://leetcode.com/problems/reverse-linked-list/",
    tags: ["linked-list", "recursion"]
  },
  {
    id: 25,
    title: "Linked List Cycle",
    difficulty: "Easy",
    category: "Linked List",
    algorithms: ["Hash Table", "Linked List", "Two Pointers"],
    description: "Given head, the head of a linked list, determine if the linked list has a cycle in it.",
    examples: [
      "Input: head = [3,2,0,-4], pos = 1\nOutput: true\nExplanation: There is a cycle in the linked list, where the tail connects to the 1st node (0-indexed).",
      "Input: head = [1,2], pos = 0\nOutput: true",
      "Input: head = [1], pos = -1\nOutput: false"
    ],
    constraints: [
      "The number of the nodes in the list is in the range [0, 10^4]",
      "-10^5 <= Node.val <= 10^5",
      "pos is -1 or a valid index in the linked-list"
    ],
    solutions: [
      "Floyd's Cycle Detection (Two Pointers): Use slow and fast pointers",
      "Hash Set: Keep track of visited nodes"
    ],
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    leetcodeUrl: "https://leetcode.com/problems/linked-list-cycle/",
    tags: ["hash-table", "linked-list", "two-pointers"]
  },

  // Binary Search Problems
  {
    id: 26,
    title: "Search in Rotated Sorted Array",
    difficulty: "Medium",
    category: "Array",
    algorithms: ["Array", "Binary Search"],
    description: "There is an integer array nums sorted in ascending order (with distinct values). Prior to being passed to your function, nums is possibly rotated at an unknown pivot index k. Given the array nums after the possible rotation and an integer target, return the index of target if it is in nums, or -1 if it is not in nums.",
    examples: [
      "Input: nums = [4,5,6,7,0,1,2], target = 0\nOutput: 4",
      "Input: nums = [4,5,6,7,0,1,2], target = 3\nOutput: -1",
      "Input: nums = [1], target = 0\nOutput: -1"
    ],
    constraints: [
      "1 <= nums.length <= 5000",
      "-10^4 <= nums[i] <= 10^4",
      "All values of nums are unique",
      "-10^4 <= target <= 10^4"
    ],
    solutions: [
      "Modified Binary Search: Identify which half is sorted, then search accordingly",
      "Find Pivot + Binary Search: First find rotation point, then search"
    ],
    timeComplexity: "O(log n)",
    spaceComplexity: "O(1)",
    leetcodeUrl: "https://leetcode.com/problems/search-in-rotated-sorted-array/",
    tags: ["array", "binary-search"]
  },
  {
    id: 27,
    title: "Find Minimum in Rotated Sorted Array",
    difficulty: "Medium",
    category: "Array",
    algorithms: ["Array", "Binary Search"],
    description: "Suppose an array of length n sorted in ascending order is rotated between 1 and n times. Given the sorted rotated array nums of unique elements, return the minimum element of this array.",
    examples: [
      "Input: nums = [3,4,5,1,2]\nOutput: 1\nExplanation: The original array was [1,2,3,4,5] rotated 3 times.",
      "Input: nums = [4,5,6,7,0,1,2]\nOutput: 0",
      "Input: nums = [11,13,15,17]\nOutput: 11"
    ],
    constraints: [
      "n == nums.length",
      "1 <= n <= 5000",
      "-5000 <= nums[i] <= 5000",
      "All the integers of nums are unique"
    ],
    solutions: [
      "Binary Search: Compare middle element with rightmost element",
      "Linear Scan: O(n) approach for comparison"
    ],
    timeComplexity: "O(log n)",
    spaceComplexity: "O(1)",
    leetcodeUrl: "https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/",
    tags: ["array", "binary-search"]
  },

  // Graph Problems
  {
    id: 28,
    title: "Number of Islands",
    difficulty: "Medium",
    category: "Array",
    algorithms: ["Array", "Depth-First Search", "Breadth-First Search", "Union Find"],
    description: "Given an m x n 2D binary grid grid which represents a map of '1's (land) and '0's (water), return the number of islands.",
    examples: [
      'Input: grid = [["1","1","1","1","0"],["1","1","0","1","0"],["1","1","0","0","0"],["0","0","0","0","0"]]\nOutput: 1',
      'Input: grid = [["1","1","0","0","0"],["1","1","0","0","0"],["0","0","1","0","0"],["0","0","0","1","1"]]\nOutput: 3'
    ],
    constraints: [
      "m == grid.length",
      "n == grid[i].length",
      "1 <= m, n <= 300",
      'grid[i][j] is "0" or "1"'
    ],
    solutions: [
      "DFS: Mark connected land cells as visited using DFS",
      "BFS: Use queue to explore connected components",
      "Union Find: Union adjacent land cells and count components"
    ],
    timeComplexity: "O(M × N)",
    spaceComplexity: "O(M × N)",
    leetcodeUrl: "https://leetcode.com/problems/number-of-islands/",
    tags: ["array", "depth-first-search", "breadth-first-search", "union-find", "matrix"]
  },
  {
    id: 29,
    title: "Clone Graph",
    difficulty: "Medium",
    category: "Hash Table",
    algorithms: ["Hash Table", "Depth-First Search", "Breadth-First Search", "Graph"],
    description: "Given a reference of a node in a connected undirected graph, return a deep copy (clone) of the graph.",
    examples: [
      "Input: adjList = [[2,4],[1,3],[2,4],[1,3]]\nOutput: [[2,4],[1,3],[2,4],[1,3]]\nExplanation: There are 4 nodes in the graph.",
      "Input: adjList = [[]]\nOutput: [[]]\nExplanation: Note that the input contains one empty list.",
      "Input: adjList = []\nOutput: []\nExplanation: This an empty graph, it does not have any nodes."
    ],
    constraints: [
      "The number of nodes in the graph is in the range [0, 100]",
      "1 <= Node.val <= 100",
      "Node.val is unique for each node",
      "There are no repeated edges and no self-loops in the graph"
    ],
    solutions: [
      "DFS with HashMap: Use recursion and map to track cloned nodes",
      "BFS with HashMap: Use queue and map to clone level by level"
    ],
    timeComplexity: "O(N + M)",
    spaceComplexity: "O(N)",
    leetcodeUrl: "https://leetcode.com/problems/clone-graph/",
    tags: ["hash-table", "depth-first-search", "breadth-first-search", "graph"]
  },

  // Stack Problems
  {
    id: 30,
    title: "Min Stack",
    difficulty: "Medium",
    category: "Stack",
    algorithms: ["Stack", "Design"],
    description: "Design a stack that supports push, pop, top, and retrieving the minimum element in constant time.",
    examples: [
      'MinStack minStack = new MinStack();\nminStack.push(-2);\nminStack.push(0);\nminStack.push(-3);\nminStack.getMin(); // return -3\nminStack.pop();\nminStack.top();    // return 0\nminStack.getMin(); // return -2'
    ],
    constraints: [
      "-2^31 <= val <= 2^31 - 1",
      "Methods pop, top and getMin operations will always be called on non-empty stacks",
      "At most 3 * 10^4 calls will be made to push, pop, top, and getMin"
    ],
    solutions: [
      "Two Stacks: One for values, one for minimums",
      "Single Stack with Pairs: Store (value, current_min) pairs",
      "Single Stack with Encoding: Encode min info in the stack values"
    ],
    timeComplexity: "O(1)",
    spaceComplexity: "O(n)",
    leetcodeUrl: "https://leetcode.com/problems/min-stack/",
    tags: ["stack", "design"]
  },

  // Heap Problems
  {
    id: 31,
    title: "Kth Largest Element in an Array",
    difficulty: "Medium",
    category: "Array",
    algorithms: ["Array", "Divide and Conquer", "Sorting", "Heap", "Quickselect"],
    description: "Given an integer array nums and an integer k, return the kth largest element in the array.",
    examples: [
      "Input: nums = [3,2,1,5,6,4], k = 2\nOutput: 5",
      "Input: nums = [3,2,3,1,2,4,5,5,6], k = 4\nOutput: 4"
    ],
    constraints: [
      "1 <= k <= nums.length <= 10^5",
      "-10^4 <= nums[i] <= 10^4"
    ],
    solutions: [
      "Min Heap: Maintain heap of size k with smallest elements",
      "Quickselect: Partition-based selection algorithm",
      "Sorting: Sort array and return kth from end"
    ],
    timeComplexity: "O(n log k)",
    spaceComplexity: "O(k)",
    leetcodeUrl: "https://leetcode.com/problems/kth-largest-element-in-an-array/",
    tags: ["array", "divide-and-conquer", "sorting", "heap", "quickselect"]
  }
];

export const algorithmsList = [
  "Array", "String", "Hash Table", "Dynamic Programming", "Math",
  "Sorting", "Greedy", "Depth-First Search", "Binary Search", "Tree",
  "Breadth-First Search", "Two Pointers", "Stack", "Backtracking",
  "Heap", "Bit Manipulation", "Graph", "Design", "Linked List",
  "Recursion", "Sliding Window", "Divide and Conquer", "Trie",
  "Binary Tree", "Monotonic Stack", "Topological Sort", "Quick Select",
  "Bucket Sort", "Minimum Spanning Tree", "Counting", "Binary Search Tree",
  "Union Find", "Prefix Sum", "Simulation", "Matrix", "Memoization",
  "Game Theory", "Segment Tree", "Binary Indexed Tree", "Geometry",
  "Ordered Set", "Line Sweep", "Rolling Hash", "Suffix Array", "String Matching"
];

export default comprehensiveProblems;