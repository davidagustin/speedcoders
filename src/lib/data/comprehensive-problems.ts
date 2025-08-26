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
}

export const comprehensiveProblems: ComprehensiveProblem[] = [
  {
    id: 1,
    title: "Two Sum",
    difficulty: "Easy",
    category: "Array",
    algorithms: ["Hash Table", "Array"],
    description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
    examples: [
      "Input: nums = [2,7,11,15], target = 9\nOutput: [0,1]\nExplanation: Because nums[0] + nums[1] == 9, we return [0, 1]."
    ],
    constraints: [
      "2 <= nums.length <= 10^4",
      "-10^9 <= nums[i] <= 10^9",
      "-10^9 <= target <= 10^9",
      "Only one valid answer exists."
    ],
    solutions: ["Use hash map to store complements", "Brute force with nested loops"],
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    leetcodeUrl: "https://leetcode.com/problems/two-sum/"
  },
  {
    id: 3,
    title: "Longest Substring Without Repeating Characters",
    difficulty: "Medium",
    category: "String",
    algorithms: ["Sliding Window", "Hash Table"],
    description: "Given a string s, find the length of the longest substring without repeating characters.",
    examples: [
      "Input: s = \"abcabcbb\"\nOutput: 3\nExplanation: The answer is \"abc\", with the length of 3."
    ],
    constraints: [
      "0 <= s.length <= 5 * 10^4",
      "s consists of English letters, digits, symbols and spaces."
    ],
    solutions: ["Sliding window with hash set", "Sliding window with hash map"],
    timeComplexity: "O(n)",
    spaceComplexity: "O(min(m,n))",
    leetcodeUrl: "https://leetcode.com/problems/longest-substring-without-repeating-characters/"
  },
  {
    id: 5,
    title: "Longest Palindromic Substring",
    difficulty: "Medium",
    category: "String",
    algorithms: ["Dynamic Programming", "Expand Around Centers"],
    description: "Given a string s, return the longest palindromic substring in s.",
    examples: [
      "Input: s = \"babad\"\nOutput: \"bab\"\nExplanation: \"aba\" is also a valid answer."
    ],
    constraints: [
      "1 <= s.length <= 1000",
      "s consist of only digits and English letters."
    ],
    solutions: ["Expand around centers", "Dynamic programming", "Manacher's algorithm"],
    timeComplexity: "O(n^2)",
    spaceComplexity: "O(1)",
    leetcodeUrl: "https://leetcode.com/problems/longest-palindromic-substring/"
  },
  {
    id: 11,
    title: "Container With Most Water",
    difficulty: "Medium",
    category: "Array",
    algorithms: ["Two Pointers"],
    description: "You are given an integer array height of length n. There are n vertical lines drawn such that the two endpoints of the ith line are (i, 0) and (i, height[i]). Find two lines that together with the x-axis form a container, such that the container contains the most water.",
    examples: [
      "Input: height = [1,8,6,2,5,4,8,3,7]\nOutput: 49\nExplanation: The above vertical lines are represented by array [1,8,6,2,5,4,8,3,7]. In this case, the max area of water (blue section) the container can contain is 49."
    ],
    constraints: [
      "n == height.length",
      "2 <= n <= 10^5",
      "0 <= height[i] <= 10^4"
    ],
    solutions: ["Two pointers approach", "Brute force"],
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    leetcodeUrl: "https://leetcode.com/problems/container-with-most-water/"
  },
  {
    id: 15,
    title: "3Sum",
    difficulty: "Medium",
    category: "Array",
    algorithms: ["Two Pointers", "Array"],
    description: "Given an integer array nums, return all the triplets [nums[i], nums[j], nums[k]] such that i != j, i != k, and j != k, and nums[i] + nums[j] + nums[k] == 0.",
    examples: [
      "Input: nums = [-1,0,1,2,-1,-4]\nOutput: [[-1,-1,2],[-1,0,1]]\nExplanation: The distinct triplets are [-1,-1,2] and [-1,0,1]."
    ],
    constraints: [
      "3 <= nums.length <= 3000",
      "-10^5 <= nums[i] <= 10^5"
    ],
    solutions: ["Sort and use two pointers", "Hash set approach"],
    timeComplexity: "O(n^2)",
    spaceComplexity: "O(1)",
    leetcodeUrl: "https://leetcode.com/problems/3sum/"
  },
  {
    id: 20,
    title: "Valid Parentheses",
    difficulty: "Easy",
    category: "String",
    algorithms: ["Stack"],
    description: "Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.",
    examples: [
      "Input: s = \"()\"\nOutput: true",
      "Input: s = \"()[]{}\"\nOutput: true",
      "Input: s = \"(]\"\nOutput: false"
    ],
    constraints: [
      "1 <= s.length <= 10^4",
      "s consists of parentheses only '()[]{}'."
    ],
    solutions: ["Stack-based approach", "Counter approach for simple cases"],
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    leetcodeUrl: "https://leetcode.com/problems/valid-parentheses/"
  },
  {
    id: 21,
    title: "Merge Two Sorted Lists",
    difficulty: "Easy",
    category: "Linked List",
    algorithms: ["Linked List", "Recursion"],
    description: "You are given the heads of two sorted linked lists list1 and list2. Merge the two lists in a one sorted list.",
    examples: [
      "Input: list1 = [1,2,4], list2 = [1,3,4]\nOutput: [1,1,2,3,4,4]"
    ],
    constraints: [
      "The number of nodes in both lists is in the range [0, 50].",
      "-100 <= Node.val <= 100",
      "Both list1 and list2 are sorted in non-decreasing order."
    ],
    solutions: ["Iterative approach", "Recursive approach"],
    timeComplexity: "O(n + m)",
    spaceComplexity: "O(1)",
    leetcodeUrl: "https://leetcode.com/problems/merge-two-sorted-lists/"
  },
  {
    id: 53,
    title: "Maximum Subarray",
    difficulty: "Medium",
    category: "Array",
    algorithms: ["Dynamic Programming", "Divide and Conquer"],
    description: "Given an integer array nums, find the contiguous subarray (containing at least one number) which has the largest sum and return its sum.",
    examples: [
      "Input: nums = [-2,1,-3,4,-1,2,1,-5,4]\nOutput: 6\nExplanation: [4,-1,2,1] has the largest sum = 6."
    ],
    constraints: [
      "1 <= nums.length <= 10^5",
      "-10^4 <= nums[i] <= 10^4"
    ],
    solutions: ["Kadane's algorithm", "Divide and conquer", "Dynamic programming"],
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    leetcodeUrl: "https://leetcode.com/problems/maximum-subarray/"
  },
  {
    id: 70,
    title: "Climbing Stairs",
    difficulty: "Easy",
    category: "Dynamic Programming",
    algorithms: ["Dynamic Programming", "Math"],
    description: "You are climbing a staircase. It takes n steps to reach the top. Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?",
    examples: [
      "Input: n = 2\nOutput: 2\nExplanation: There are two ways to climb to the top.\n1. 1 step + 1 step\n2. 2 steps"
    ],
    constraints: [
      "1 <= n <= 45"
    ],
    solutions: ["Dynamic programming", "Fibonacci sequence", "Matrix exponentiation"],
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    leetcodeUrl: "https://leetcode.com/problems/climbing-stairs/"
  },
  {
    id: 104,
    title: "Maximum Depth of Binary Tree",
    difficulty: "Easy",
    category: "Tree",
    algorithms: ["Tree", "DFS", "BFS"],
    description: "Given the root of a binary tree, return its maximum depth.",
    examples: [
      "Input: root = [3,9,20,null,null,15,7]\nOutput: 3"
    ],
    constraints: [
      "The number of nodes in the tree is in the range [0, 10^4].",
      "-100 <= Node.val <= 100"
    ],
    solutions: ["Recursive DFS", "Iterative BFS", "Iterative DFS"],
    timeComplexity: "O(n)",
    spaceComplexity: "O(h)",
    leetcodeUrl: "https://leetcode.com/problems/maximum-depth-of-binary-tree/"
  },
  {
    id: 121,
    title: "Best Time to Buy and Sell Stock",
    difficulty: "Easy",
    category: "Array",
    algorithms: ["Array", "Dynamic Programming"],
    description: "You are given an array prices where prices[i] is the price of a given stock on the ith day. You want to maximize your profit by choosing a single day to buy one stock and choosing a different day in the future to sell that stock.",
    examples: [
      "Input: prices = [7,1,5,3,6,4]\nOutput: 5\nExplanation: Buy on day 2 (price = 1) and sell on day 5 (price = 6), profit = 6-1 = 5."
    ],
    constraints: [
      "1 <= prices.length <= 10^5",
      "0 <= prices[i] <= 10^4"
    ],
    solutions: ["Single pass", "Dynamic programming"],
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    leetcodeUrl: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock/"
  },
  {
    id: 125,
    title: "Valid Palindrome",
    difficulty: "Easy",
    category: "String",
    algorithms: ["Two Pointers", "String"],
    description: "A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward.",
    examples: [
      "Input: s = \"A man, a plan, a canal: Panama\"\nOutput: true\nExplanation: \"amanaplanacanalpanama\" is a palindrome."
    ],
    constraints: [
      "1 <= s.length <= 2 * 10^5",
      "s consists only of printable ASCII characters."
    ],
    solutions: ["Two pointers", "Reverse and compare"],
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    leetcodeUrl: "https://leetcode.com/problems/valid-palindrome/"
  },
  {
    id: 141,
    title: "Linked List Cycle",
    difficulty: "Easy",
    category: "Linked List",
    algorithms: ["Linked List", "Two Pointers"],
    description: "Given head, the head of a linked list, determine if the linked list has a cycle in it.",
    examples: [
      "Input: head = [3,2,0,-4], pos = 1\nOutput: true\nExplanation: There is a cycle in the linked list, where the tail connects to the 1st node (0-indexed)."
    ],
    constraints: [
      "The number of the nodes in the list is in the range [0, 10^4].",
      "-10^5 <= Node.val <= 10^5",
      "pos is -1 or a valid index in the linked-list."
    ],
    solutions: ["Floyd's cycle detection", "Hash set"],
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    leetcodeUrl: "https://leetcode.com/problems/linked-list-cycle/"
  },
  {
    id: 200,
    title: "Number of Islands",
    difficulty: "Medium",
    category: "Matrix",
    algorithms: ["DFS", "BFS", "Union Find"],
    description: "Given an m x n 2D binary grid which represents a map of '1's (land) and '0's (water), return the number of islands.",
    examples: [
      "Input: grid = [[\"1\",\"1\",\"1\",\"1\",\"0\"],[\"1\",\"1\",\"0\",\"1\",\"0\"],[\"1\",\"1\",\"0\",\"0\",\"0\"],[\"0\",\"0\",\"0\",\"0\",\"0\"]]\nOutput: 1"
    ],
    constraints: [
      "m == grid.length",
      "n == grid[i].length",
      "1 <= m, n <= 300",
      "grid[i][j] is '0' or '1'."
    ],
    solutions: ["DFS traversal", "BFS traversal", "Union Find"],
    timeComplexity: "O(m * n)",
    spaceComplexity: "O(m * n)",
    leetcodeUrl: "https://leetcode.com/problems/number-of-islands/"
  },
  {
    id: 206,
    title: "Reverse Linked List",
    difficulty: "Easy",
    category: "Linked List",
    algorithms: ["Linked List", "Recursion"],
    description: "Given the head of a singly linked list, reverse the list, and return the reversed list.",
    examples: [
      "Input: head = [1,2,3,4,5]\nOutput: [5,4,3,2,1]"
    ],
    constraints: [
      "The number of nodes in the list is the range [0, 5000].",
      "-5000 <= Node.val <= 5000"
    ],
    solutions: ["Iterative approach", "Recursive approach"],
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    leetcodeUrl: "https://leetcode.com/problems/reverse-linked-list/"
  },
  {
    id: 226,
    title: "Invert Binary Tree",
    difficulty: "Easy",
    category: "Tree",
    algorithms: ["Tree", "DFS", "BFS"],
    description: "Given the root of a binary tree, invert the tree, and return its root.",
    examples: [
      "Input: root = [4,2,7,1,3,6,9]\nOutput: [4,7,2,9,6,3,1]"
    ],
    constraints: [
      "The number of nodes in the tree is in the range [0, 100].",
      "-100 <= Node.val <= 100"
    ],
    solutions: ["Recursive DFS", "Iterative BFS", "Iterative DFS"],
    timeComplexity: "O(n)",
    spaceComplexity: "O(h)",
    leetcodeUrl: "https://leetcode.com/problems/invert-binary-tree/"
  },
  {
    id: 238,
    title: "Product of Array Except Self",
    difficulty: "Medium",
    category: "Array",
    algorithms: ["Array", "Prefix Sum"],
    description: "Given an integer array nums, return an array answer such that answer[i] is equal to the product of all the elements of nums except nums[i].",
    examples: [
      "Input: nums = [1,2,3,4]\nOutput: [24,12,8,6]"
    ],
    constraints: [
      "2 <= nums.length <= 10^5",
      "-30 <= nums[i] <= 30",
      "The product of any prefix or suffix of nums is guaranteed to fit in a 32-bit integer."
    ],
    solutions: ["Left and right products", "Single array approach"],
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    leetcodeUrl: "https://leetcode.com/problems/product-of-array-except-self/"
  },
  {
    id: 242,
    title: "Valid Anagram",
    difficulty: "Easy",
    category: "String",
    algorithms: ["Hash Table", "String", "Sorting"],
    description: "Given two strings s and t, return true if t is an anagram of s, and false otherwise.",
    examples: [
      "Input: s = \"anagram\", t = \"nagaram\"\nOutput: true"
    ],
    constraints: [
      "1 <= s.length, t.length <= 5 * 10^4",
      "s and t consist of lowercase English letters."
    ],
    solutions: ["Character frequency count", "Sorting approach"],
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    leetcodeUrl: "https://leetcode.com/problems/valid-anagram/"
  },
  {
    id: 252,
    title: "Meeting Rooms",
    difficulty: "Easy",
    category: "Array",
    algorithms: ["Array", "Sorting"],
    description: "Given an array of meeting time intervals where intervals[i] = [start_i, end_i], determine if a person could attend all meetings.",
    examples: [
      "Input: intervals = [[0,30],[5,10],[15,20]]\nOutput: false"
    ],
    constraints: [
      "0 <= intervals.length <= 10^4",
      "intervals[i].length == 2",
      "0 <= start_i < end_i <= 10^6"
    ],
    solutions: ["Sort and check overlaps", "Brute force comparison"],
    timeComplexity: "O(n log n)",
    spaceComplexity: "O(1)",
    leetcodeUrl: "https://leetcode.com/problems/meeting-rooms/"
  },
  {
    id: 300,
    title: "Longest Increasing Subsequence",
    difficulty: "Medium",
    category: "Array",
    algorithms: ["Dynamic Programming", "Binary Search"],
    description: "Given an integer array nums, return the length of the longest strictly increasing subsequence.",
    examples: [
      "Input: nums = [10,9,2,5,3,7,101,18]\nOutput: 4\nExplanation: The longest increasing subsequence is [2,3,7,18], therefore the length is 4."
    ],
    constraints: [
      "1 <= nums.length <= 2500",
      "-10^4 <= nums[i] <= 10^4"
    ],
    solutions: ["Dynamic programming", "Binary search with patience sorting"],
    timeComplexity: "O(n^2)",
    spaceComplexity: "O(n)",
    leetcodeUrl: "https://leetcode.com/problems/longest-increasing-subsequence/"
  }
];

// Export for backward compatibility
export { comprehensiveProblems as problems };