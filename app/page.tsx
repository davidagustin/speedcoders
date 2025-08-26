"use client";

import React, { useState, useEffect } from "react";
import { CheckCircleIcon, XCircleIcon, ArrowRightIcon, ArrowLeftIcon, TrophyIcon, ClockIcon } from "@heroicons/react/24/outline";

interface LeetCodeProblem {
  id: number;
  title: string;
  acceptanceRate: string;
  difficulty: string;
  category: string;
}

interface Algorithm {
  id: string;
  name: string;
  description: string;
  timeComplexity: string;
  spaceComplexity: string;
  category: string;
}

interface QuizQuestion {
  problem: LeetCodeProblem;
  correctAlgorithms: string[];
  selectedAlgorithms: string[];
  isAnswered: boolean;
  isCorrect: boolean;
}

const ALGORITHMS: Algorithm[] = [
  {
    id: "hash-table",
    name: "Hash Table",
    description: "Use a hash table to store and retrieve data in O(1) average time",
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    category: "Data Structures"
  },
  {
    id: "two-pointers",
    name: "Two Pointers",
    description: "Use two pointers to traverse the array from different positions",
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    category: "Techniques"
  },
  {
    id: "sliding-window",
    name: "Sliding Window",
    description: "Maintain a window of elements and slide it to find optimal solutions",
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    category: "Techniques"
  },
  {
    id: "binary-search",
    name: "Binary Search",
    description: "Search for an element in a sorted array by dividing the search space",
    timeComplexity: "O(log n)",
    spaceComplexity: "O(1)",
    category: "Search"
  },
  {
    id: "dynamic-programming",
    name: "Dynamic Programming",
    description: "Solve complex problems by breaking them into simpler subproblems",
    timeComplexity: "Varies",
    spaceComplexity: "Varies",
    category: "Optimization"
  },
  {
    id: "greedy",
    name: "Greedy",
    description: "Make locally optimal choices at each step to find global optimum",
    timeComplexity: "Varies",
    spaceComplexity: "Varies",
    category: "Optimization"
  },
  {
    id: "dfs",
    name: "Depth-First Search",
    description: "Explore as far as possible along each branch before backtracking",
    timeComplexity: "O(V + E)",
    spaceComplexity: "O(V)",
    category: "Graph"
  },
  {
    id: "bfs",
    name: "Breadth-First Search",
    description: "Explore all neighbors at the present depth before moving deeper",
    timeComplexity: "O(V + E)",
    spaceComplexity: "O(V)",
    category: "Graph"
  },
  {
    id: "stack",
    name: "Stack",
    description: "Use LIFO (Last In, First Out) data structure for problem solving",
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    category: "Data Structures"
  },
  {
    id: "queue",
    name: "Queue",
    description: "Use FIFO (First In, First Out) data structure for problem solving",
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    category: "Data Structures"
  },
  {
    id: "heap",
    name: "Heap/Priority Queue",
    description: "Use heap data structure for efficient priority-based operations",
    timeComplexity: "O(n log n)",
    spaceComplexity: "O(n)",
    category: "Data Structures"
  },
  {
    id: "trie",
    name: "Trie",
    description: "Use prefix tree for efficient string operations and searches",
    timeComplexity: "O(m)",
    spaceComplexity: "O(m)",
    category: "Data Structures"
  },
  {
    id: "union-find",
    name: "Union Find",
    description: "Use disjoint set data structure for connectivity problems",
    timeComplexity: "O(α(n))",
    spaceComplexity: "O(n)",
    category: "Data Structures"
  },
  {
    id: "backtracking",
    name: "Backtracking",
    description: "Try different solutions and backtrack when they don't work",
    timeComplexity: "Exponential",
    spaceComplexity: "O(n)",
    category: "Search"
  },
  {
    id: "sorting",
    name: "Sorting",
    description: "Sort the data to simplify the problem or enable other algorithms",
    timeComplexity: "O(n log n)",
    spaceComplexity: "O(1)",
    category: "Techniques"
  }
];

const LEETCODE_PROBLEMS: LeetCodeProblem[] = [
  {
    id: 1,
    title: "Two Sum",
    acceptanceRate: "56.2%",
    difficulty: "Easy",
    category: "Array"
  },
  {
    id: 2,
    title: "Add Two Numbers",
    acceptanceRate: "46.8%",
    difficulty: "Medium",
    category: "Linked List"
  },
  {
    id: 3,
    title: "Longest Substring Without Repeating Characters",
    acceptanceRate: "37.4%",
    difficulty: "Medium",
    category: "String"
  },
  {
    id: 4,
    title: "Median of Two Sorted Arrays",
    acceptanceRate: "44.5%",
    difficulty: "Hard",
    category: "Array"
  },
  {
    id: 5,
    title: "Longest Palindromic Substring",
    acceptanceRate: "36.3%",
    difficulty: "Medium",
    category: "String"
  },
  {
    id: 11,
    title: "Container With Most Water",
    acceptanceRate: "58.2%",
    difficulty: "Medium",
    category: "Array"
  },
  {
    id: 15,
    title: "3Sum",
    acceptanceRate: "32.8%",
    difficulty: "Medium",
    category: "Array"
  },
  {
    id: 17,
    title: "Letter Combinations of a Phone Number",
    acceptanceRate: "58.9%",
    difficulty: "Medium",
    category: "String"
  },
  {
    id: 19,
    title: "Remove Nth Node From End of List",
    acceptanceRate: "45.2%",
    difficulty: "Medium",
    category: "Linked List"
  },
  {
    id: 20,
    title: "Valid Parentheses",
    acceptanceRate: "40.5%",
    difficulty: "Easy",
    category: "Stack"
  },
  {
    id: 21,
    title: "Merge Two Sorted Lists",
    acceptanceRate: "62.3%",
    difficulty: "Easy",
    category: "Linked List"
  },
  {
    id: 22,
    title: "Generate Parentheses",
    acceptanceRate: "74.2%",
    difficulty: "Medium",
    category: "Backtracking"
  },
  {
    id: 23,
    title: "Merge k Sorted Lists",
    acceptanceRate: "52.1%",
    difficulty: "Hard",
    category: "Linked List"
  },
  {
    id: 31,
    title: "Next Permutation",
    acceptanceRate: "39.8%",
    difficulty: "Medium",
    category: "Array"
  },
  {
    id: 33,
    title: "Search in Rotated Sorted Array",
    acceptanceRate: "40.2%",
    difficulty: "Medium",
    category: "Array"
  },
  {
    id: 34,
    title: "Find First and Last Position of Element in Sorted Array",
    acceptanceRate: "44.1%",
    difficulty: "Medium",
    category: "Array"
  },
  {
    id: 39,
    title: "Combination Sum",
    acceptanceRate: "69.8%",
    difficulty: "Medium",
    category: "Backtracking"
  },
  {
    id: 42,
    title: "Trapping Rain Water",
    acceptanceRate: "64.8%",
    difficulty: "Hard",
    category: "Array"
  },
  {
    id: 46,
    title: "Permutations",
    acceptanceRate: "78.9%",
    difficulty: "Medium",
    category: "Backtracking"
  },
  {
    id: 48,
    title: "Rotate Image",
    acceptanceRate: "74.2%",
    difficulty: "Medium",
    category: "Array"
  },
  {
    id: 49,
    title: "Group Anagrams",
    acceptanceRate: "76.3%",
    difficulty: "Medium",
    category: "String"
  },
  {
    id: 53,
    title: "Maximum Subarray",
    acceptanceRate: "52.2%",
    difficulty: "Medium",
    category: "Array"
  },
  {
    id: 55,
    title: "Jump Game",
    acceptanceRate: "38.9%",
    difficulty: "Medium",
    category: "Greedy"
  },
  {
    id: 56,
    title: "Merge Intervals",
    acceptanceRate: "52.8%",
    difficulty: "Medium",
    category: "Array"
  },
  {
    id: 62,
    title: "Unique Paths",
    acceptanceRate: "68.9%",
    difficulty: "Medium",
    category: "Dynamic Programming"
  },
  {
    id: 70,
    title: "Climbing Stairs",
    acceptanceRate: "54.2%",
    difficulty: "Easy",
    category: "Dynamic Programming"
  },
  {
    id: 75,
    title: "Sort Colors",
    acceptanceRate: "62.1%",
    difficulty: "Medium",
    category: "Array"
  },
  {
    id: 78,
    title: "Subsets",
    acceptanceRate: "78.9%",
    difficulty: "Medium",
    category: "Backtracking"
  },
  {
    id: 79,
    title: "Word Search",
    acceptanceRate: "45.2%",
    difficulty: "Medium",
    category: "Backtracking"
  },
  {
    id: 84,
    title: "Largest Rectangle in Histogram",
    acceptanceRate: "45.8%",
    difficulty: "Hard",
    category: "Stack"
  },
  {
    id: 94,
    title: "Binary Tree Inorder Traversal",
    acceptanceRate: "78.9%",
    difficulty: "Easy",
    category: "Tree"
  },
  {
    id: 98,
    title: "Validate Binary Search Tree",
    acceptanceRate: "35.2%",
    difficulty: "Medium",
    category: "Tree"
  },
  {
    id: 101,
    title: "Symmetric Tree",
    acceptanceRate: "58.9%",
    difficulty: "Easy",
    category: "Tree"
  },
  {
    id: 102,
    title: "Binary Tree Level Order Traversal",
    acceptanceRate: "68.9%",
    difficulty: "Medium",
    category: "Tree"
  },
  {
    id: 104,
    title: "Maximum Depth of Binary Tree",
    acceptanceRate: "78.9%",
    difficulty: "Easy",
    category: "Tree"
  },
  {
    id: 105,
    title: "Construct Binary Tree from Preorder and Inorder Traversal",
    acceptanceRate: "68.9%",
    difficulty: "Medium",
    category: "Tree"
  },
  {
    id: 114,
    title: "Flatten Binary Tree to Linked List",
    acceptanceRate: "68.9%",
    difficulty: "Medium",
    category: "Tree"
  },
  {
    id: 121,
    title: "Best Time to Buy and Sell Stock",
    acceptanceRate: "58.9%",
    difficulty: "Easy",
    category: "Array"
  },
  {
    id: 124,
    title: "Binary Tree Maximum Path Sum",
    acceptanceRate: "45.2%",
    difficulty: "Hard",
    category: "Tree"
  },
  {
    id: 128,
    title: "Longest Consecutive Sequence",
    acceptanceRate: "58.9%",
    difficulty: "Medium",
    category: "Array"
  },
  {
    id: 136,
    title: "Single Number",
    acceptanceRate: "78.9%",
    difficulty: "Easy",
    category: "Array"
  },
  {
    id: 139,
    title: "Word Break",
    acceptanceRate: "58.9%",
    difficulty: "Medium",
    category: "Dynamic Programming"
  },
  {
    id: 141,
    title: "Linked List Cycle",
    acceptanceRate: "58.9%",
    difficulty: "Easy",
    category: "Linked List"
  },
  {
    id: 142,
    title: "Linked List Cycle II",
    acceptanceRate: "58.9%",
    difficulty: "Medium",
    category: "Linked List"
  },
  {
    id: 146,
    title: "LRU Cache",
    acceptanceRate: "58.9%",
    difficulty: "Medium",
    category: "Design"
  },
  {
    id: 148,
    title: "Sort List",
    acceptanceRate: "58.9%",
    difficulty: "Medium",
    category: "Linked List"
  },
  {
    id: 152,
    title: "Maximum Product Subarray",
    acceptanceRate: "58.9%",
    difficulty: "Medium",
    category: "Array"
  },
  {
    id: 155,
    title: "Min Stack",
    acceptanceRate: "58.9%",
    difficulty: "Medium",
    category: "Stack"
  },
  {
    id: 160,
    title: "Intersection of Two Linked Lists",
    acceptanceRate: "58.9%",
    difficulty: "Easy",
    category: "Linked List"
  },
  {
    id: 169,
    title: "Majority Element",
    acceptanceRate: "78.9%",
    difficulty: "Easy",
    category: "Array"
  },
  {
    id: 198,
    title: "House Robber",
    acceptanceRate: "58.9%",
    difficulty: "Medium",
    category: "Dynamic Programming"
  },
  {
    id: 200,
    title: "Number of Islands",
    acceptanceRate: "58.9%",
    difficulty: "Medium",
    category: "Graph"
  },
  {
    id: 206,
    title: "Reverse Linked List",
    acceptanceRate: "78.9%",
    difficulty: "Easy",
    category: "Linked List"
  },
  {
    id: 207,
    title: "Course Schedule",
    acceptanceRate: "58.9%",
    difficulty: "Medium",
    category: "Graph"
  },
  {
    id: 208,
    title: "Implement Trie (Prefix Tree)",
    acceptanceRate: "58.9%",
    difficulty: "Medium",
    category: "Design"
  },
  {
    id: 215,
    title: "Kth Largest Element in an Array",
    acceptanceRate: "58.9%",
    difficulty: "Medium",
    category: "Array"
  },
  {
    id: 221,
    title: "Maximal Square",
    acceptanceRate: "58.9%",
    difficulty: "Medium",
    category: "Dynamic Programming"
  },
  {
    id: 226,
    title: "Invert Binary Tree",
    acceptanceRate: "78.9%",
    difficulty: "Easy",
    category: "Tree"
  },
  {
    id: 234,
    title: "Palindrome Linked List",
    acceptanceRate: "58.9%",
    difficulty: "Easy",
    category: "Linked List"
  },
  {
    id: 236,
    title: "Lowest Common Ancestor of a Binary Tree",
    acceptanceRate: "58.9%",
    difficulty: "Medium",
    category: "Tree"
  },
  {
    id: 238,
    title: "Product of Array Except Self",
    acceptanceRate: "58.9%",
    difficulty: "Medium",
    category: "Array"
  },
  {
    id: 239,
    title: "Sliding Window Maximum",
    acceptanceRate: "58.9%",
    difficulty: "Hard",
    category: "Array"
  },
  {
    id: 240,
    title: "Search a 2D Matrix II",
    acceptanceRate: "58.9%",
    difficulty: "Medium",
    category: "Array"
  },
  {
    id: 253,
    title: "Meeting Rooms II",
    acceptanceRate: "58.9%",
    difficulty: "Medium",
    category: "Heap"
  },
  {
    id: 279,
    title: "Perfect Squares",
    acceptanceRate: "58.9%",
    difficulty: "Medium",
    category: "Dynamic Programming"
  },
  {
    id: 283,
    title: "Move Zeroes",
    acceptanceRate: "78.9%",
    difficulty: "Easy",
    category: "Array"
  },
  {
    id: 287,
    title: "Find the Duplicate Number",
    acceptanceRate: "58.9%",
    difficulty: "Medium",
    category: "Array"
  },
  {
    id: 297,
    title: "Serialize and Deserialize Binary Tree",
    acceptanceRate: "58.9%",
    difficulty: "Hard",
    category: "Tree"
  },
  {
    id: 300,
    title: "Longest Increasing Subsequence",
    acceptanceRate: "58.9%",
    difficulty: "Medium",
    category: "Dynamic Programming"
  },
  {
    id: 322,
    title: "Coin Change",
    acceptanceRate: "58.9%",
    difficulty: "Medium",
    category: "Dynamic Programming"
  },
  {
    id: 337,
    title: "House Robber III",
    acceptanceRate: "58.9%",
    difficulty: "Medium",
    category: "Dynamic Programming"
  },
  {
    id: 338,
    title: "Counting Bits",
    acceptanceRate: "78.9%",
    difficulty: "Easy",
    category: "Dynamic Programming"
  },
  {
    id: 347,
    title: "Top K Frequent Elements",
    acceptanceRate: "58.9%",
    difficulty: "Medium",
    category: "Heap"
  },
  {
    id: 394,
    title: "Decode String",
    acceptanceRate: "58.9%",
    difficulty: "Medium",
    category: "Stack"
  },
  {
    id: 406,
    title: "Queue Reconstruction by Height",
    acceptanceRate: "58.9%",
    difficulty: "Medium",
    category: "Greedy"
  },
  {
    id: 416,
    title: "Partition Equal Subset Sum",
    acceptanceRate: "58.9%",
    difficulty: "Medium",
    category: "Dynamic Programming"
  },
  {
    id: 437,
    title: "Path Sum III",
    acceptanceRate: "58.9%",
    difficulty: "Medium",
    category: "Tree"
  },
  {
    id: 438,
    title: "Find All Anagrams in a String",
    acceptanceRate: "58.9%",
    difficulty: "Medium",
    category: "String"
  },
  {
    id: 448,
    title: "Find All Numbers Disappeared in an Array",
    acceptanceRate: "78.9%",
    difficulty: "Easy",
    category: "Array"
  },
  {
    id: 461,
    title: "Hamming Distance",
    acceptanceRate: "78.9%",
    difficulty: "Easy",
    category: "Bit Manipulation"
  },
  {
    id: 494,
    title: "Target Sum",
    acceptanceRate: "58.9%",
    difficulty: "Medium",
    category: "Dynamic Programming"
  },
  {
    id: 538,
    title: "Convert BST to Greater Tree",
    acceptanceRate: "78.9%",
    difficulty: "Medium",
    category: "Tree"
  },
  {
    id: 543,
    title: "Diameter of Binary Tree",
    acceptanceRate: "58.9%",
    difficulty: "Easy",
    category: "Tree"
  },
  {
    id: 560,
    title: "Subarray Sum Equals K",
    acceptanceRate: "58.9%",
    difficulty: "Medium",
    category: "Array"
  },
  {
    id: 581,
    title: "Shortest Unsorted Continuous Subarray",
    acceptanceRate: "58.9%",
    difficulty: "Medium",
    category: "Array"
  },
  {
    id: 617,
    title: "Merge Two Binary Trees",
    acceptanceRate: "78.9%",
    difficulty: "Easy",
    category: "Tree"
  },
  {
    id: 621,
    title: "Task Scheduler",
    acceptanceRate: "58.9%",
    difficulty: "Medium",
    category: "Greedy"
  },
  {
    id: 647,
    title: "Palindromic Substrings",
    acceptanceRate: "58.9%",
    difficulty: "Medium",
    category: "Dynamic Programming"
  },
  {
    id: 739,
    title: "Daily Temperatures",
    acceptanceRate: "58.9%",
    difficulty: "Medium",
    category: "Stack"
  },
  {
    id: 763,
    title: "Partition Labels",
    acceptanceRate: "58.9%",
    difficulty: "Medium",
    category: "Greedy"
  },
  {
    id: 771,
    title: "Jewels and Stones",
    acceptanceRate: "78.9%",
    difficulty: "Easy",
    category: "String"
  },
  {
    id: 994,
    title: "Rotting Oranges",
    acceptanceRate: "58.9%",
    difficulty: "Medium",
    category: "Graph"
  },
  {
    id: 1046,
    title: "Last Stone Weight",
    acceptanceRate: "78.9%",
    difficulty: "Easy",
    category: "Heap"
  },
  {
    id: 1143,
    title: "Longest Common Subsequence",
    acceptanceRate: "58.9%",
    difficulty: "Medium",
    category: "Dynamic Programming"
  },
  {
    id: 1249,
    title: "Minimum Remove to Make Valid Parentheses",
    acceptanceRate: "58.9%",
    difficulty: "Medium",
    category: "Stack"
  },
  {
    id: 1466,
    title: "Reorder Routes to Make All Paths Lead to the City Zero",
    acceptanceRate: "58.9%",
    difficulty: "Medium",
    category: "Graph"
  }
];

// Problem to algorithm mappings
const PROBLEM_ALGORITHM_MAPPINGS: { [key: number]: string[] } = {
  1: ["hash-table", "two-pointers"], // Two Sum
  2: ["two-pointers"], // Add Two Numbers
  3: ["sliding-window", "hash-table"], // Longest Substring Without Repeating Characters
  4: ["binary-search"], // Median of Two Sorted Arrays
  5: ["dynamic-programming"], // Longest Palindromic Substring
  11: ["two-pointers"], // Container With Most Water
  15: ["two-pointers", "sorting"], // 3Sum
  17: ["backtracking"], // Letter Combinations of a Phone Number
  19: ["two-pointers"], // Remove Nth Node From End of List
  20: ["stack"], // Valid Parentheses
  21: ["two-pointers"], // Merge Two Sorted Lists
  22: ["backtracking"], // Generate Parentheses
  23: ["heap", "two-pointers"], // Merge k Sorted Lists
  31: ["two-pointers"], // Next Permutation
  33: ["binary-search"], // Search in Rotated Sorted Array
  34: ["binary-search"], // Find First and Last Position of Element in Sorted Array
  39: ["backtracking"], // Combination Sum
  42: ["two-pointers", "dynamic-programming"], // Trapping Rain Water
  46: ["backtracking"], // Permutations
  48: ["two-pointers"], // Rotate Image
  49: ["hash-table", "sorting"], // Group Anagrams
  53: ["dynamic-programming"], // Maximum Subarray
  55: ["greedy"], // Jump Game
  56: ["sorting", "two-pointers"], // Merge Intervals
  62: ["dynamic-programming"], // Unique Paths
  70: ["dynamic-programming"], // Climbing Stairs
  75: ["two-pointers"], // Sort Colors
  78: ["backtracking"], // Subsets
  79: ["backtracking", "dfs"], // Word Search
  84: ["stack"], // Largest Rectangle in Histogram
  94: ["stack", "dfs"], // Binary Tree Inorder Traversal
  98: ["dfs"], // Validate Binary Search Tree
  101: ["dfs", "bfs"], // Symmetric Tree
  102: ["bfs"], // Binary Tree Level Order Traversal
  104: ["dfs"], // Maximum Depth of Binary Tree
  105: ["dfs"], // Construct Binary Tree from Preorder and Inorder Traversal
  114: ["dfs"], // Flatten Binary Tree to Linked List
  121: ["greedy"], // Best Time to Buy and Sell Stock
  124: ["dfs"], // Binary Tree Maximum Path Sum
  128: ["hash-table"], // Longest Consecutive Sequence
  136: ["hash-table"], // Single Number
  139: ["dynamic-programming"], // Word Break
  141: ["two-pointers"], // Linked List Cycle
  142: ["two-pointers"], // Linked List Cycle II
  146: ["hash-table"], // LRU Cache
  148: ["two-pointers"], // Sort List
  152: ["dynamic-programming"], // Maximum Product Subarray
  155: ["stack"], // Min Stack
  160: ["two-pointers"], // Intersection of Two Linked Lists
  169: ["hash-table", "sorting"], // Majority Element
  198: ["dynamic-programming"], // House Robber
  200: ["dfs", "bfs"], // Number of Islands
  206: ["two-pointers"], // Reverse Linked List
  207: ["dfs", "bfs"], // Course Schedule
  208: ["trie"], // Implement Trie (Prefix Tree)
  215: ["heap", "sorting"], // Kth Largest Element in an Array
  221: ["dynamic-programming"], // Maximal Square
  226: ["dfs"], // Invert Binary Tree
  234: ["two-pointers"], // Palindrome Linked List
  236: ["dfs"], // Lowest Common Ancestor of a Binary Tree
  238: ["two-pointers"], // Product of Array Except Self
  239: ["heap", "sliding-window"], // Sliding Window Maximum
  240: ["binary-search"], // Search a 2D Matrix II
  253: ["heap"], // Meeting Rooms II
  279: ["dynamic-programming"], // Perfect Squares
  283: ["two-pointers"], // Move Zeroes
  287: ["two-pointers"], // Find the Duplicate Number
  297: ["dfs"], // Serialize and Deserialize Binary Tree
  300: ["dynamic-programming"], // Longest Increasing Subsequence
  322: ["dynamic-programming"], // Coin Change
  337: ["dynamic-programming"], // House Robber III
  338: ["dynamic-programming"], // Counting Bits
  347: ["heap", "hash-table"], // Top K Frequent Elements
  394: ["stack"], // Decode String
  406: ["greedy", "sorting"], // Queue Reconstruction by Height
  416: ["dynamic-programming"], // Partition Equal Subset Sum
  437: ["dfs"], // Path Sum III
  438: ["sliding-window", "hash-table"], // Find All Anagrams in a String
  448: ["hash-table"], // Find All Numbers Disappeared in an Array
  461: ["bit-manipulation"], // Hamming Distance
  494: ["dynamic-programming"], // Target Sum
  538: ["dfs"], // Convert BST to Greater Tree
  543: ["dfs"], // Diameter of Binary Tree
  560: ["hash-table"], // Subarray Sum Equals K
  581: ["sorting"], // Shortest Unsorted Continuous Subarray
  617: ["dfs"], // Merge Two Binary Trees
  621: ["greedy", "heap"], // Task Scheduler
  647: ["dynamic-programming"], // Palindromic Substrings
  739: ["stack"], // Daily Temperatures
  763: ["greedy"], // Partition Labels
  771: ["hash-table"], // Jewels and Stones
  994: ["bfs"], // Rotting Oranges
  1046: ["heap"], // Last Stone Weight
  1143: ["dynamic-programming"], // Longest Common Subsequence
  1249: ["stack"], // Minimum Remove to Make Valid Parentheses
  1466: ["dfs", "bfs"] // Reorder Routes to Make All Paths Lead to the City Zero
};

export default function QuizApp() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAlgorithms, setSelectedAlgorithms] = useState<string[]>([]);
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [timeSpent, setTimeSpent] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);

  useEffect(() => {
    initializeQuiz();
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning && startTime) {
      interval = setInterval(() => {
        setTimeSpent(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, startTime]);

  const initializeQuiz = () => {
    // Select 10 random problems for the quiz
    const shuffledProblems = LEETCODE_PROBLEMS.sort(() => Math.random() - 0.5).slice(0, 10);
    
    const questions: QuizQuestion[] = shuffledProblems.map(problem => ({
      problem,
      correctAlgorithms: PROBLEM_ALGORITHM_MAPPINGS[problem.id] || [],
      selectedAlgorithms: [],
      isAnswered: false,
      isCorrect: false
    }));

    setQuizQuestions(questions);
    setTotalQuestions(questions.length);
    setStartTime(Date.now());
    setIsTimerRunning(true);
  };

  const handleAlgorithmToggle = (algorithmId: string) => {
    setSelectedAlgorithms(prev => 
      prev.includes(algorithmId)
        ? prev.filter(id => id !== algorithmId)
        : [...prev, algorithmId]
    );
  };

  const handleSubmitAnswer = () => {
    if (selectedAlgorithms.length === 0) return;

    const currentQuestion = quizQuestions[currentQuestionIndex];
    const isCorrect = selectedAlgorithms.every(alg => 
      currentQuestion.correctAlgorithms.includes(alg)
    ) && currentQuestion.correctAlgorithms.every(alg => 
      selectedAlgorithms.includes(alg)
    );

    const updatedQuestions = [...quizQuestions];
    updatedQuestions[currentQuestionIndex] = {
      ...currentQuestion,
      selectedAlgorithms: [...selectedAlgorithms],
      isAnswered: true,
      isCorrect
    };

    setQuizQuestions(updatedQuestions);
    setSelectedAlgorithms([]);

    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      finishQuiz();
    }
  };

  const finishQuiz = () => {
    setIsTimerRunning(false);
    const correctAnswers = quizQuestions.filter(q => q.isCorrect).length;
    setScore(correctAnswers);
    setShowResults(true);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAlgorithms([]);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
      setSelectedAlgorithms(quizQuestions[currentQuestionIndex - 1].selectedAlgorithms);
    }
  };

  const restartQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedAlgorithms([]);
    setQuizQuestions([]);
    setShowResults(false);
    setScore(0);
    setTimeSpent(0);
    initializeQuiz();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (showResults) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-xl p-8">
            <div className="text-center mb-8">
              <TrophyIcon className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Quiz Complete!</h1>
              <p className="text-gray-600">You've completed the algorithm selection quiz</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-blue-50 rounded-lg p-6 text-center">
                <div className="text-3xl font-bold text-blue-600">{score}/{totalQuestions}</div>
                <div className="text-sm text-gray-600">Correct Answers</div>
              </div>
              <div className="bg-green-50 rounded-lg p-6 text-center">
                <div className="text-3xl font-bold text-green-600">{Math.round((score / totalQuestions) * 100)}%</div>
                <div className="text-sm text-gray-600">Accuracy</div>
              </div>
              <div className="bg-purple-50 rounded-lg p-6 text-center">
                <div className="text-3xl font-bold text-purple-600">{formatTime(timeSpent)}</div>
                <div className="text-sm text-gray-600">Time Spent</div>
              </div>
            </div>

            <div className="space-y-4 mb-8">
              <h2 className="text-xl font-semibold text-gray-900">Question Review</h2>
              {quizQuestions.map((question, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-medium text-gray-900">
                      {question.problem.id}. {question.problem.title}
                    </h3>
                    {question.isCorrect ? (
                      <CheckCircleIcon className="h-6 w-6 text-green-500" />
                    ) : (
                      <XCircleIcon className="h-6 w-6 text-red-500" />
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium text-gray-700 mb-2">Your Selection:</h4>
                      <div className="flex flex-wrap gap-2">
                        {question.selectedAlgorithms.length > 0 ? (
                          question.selectedAlgorithms.map(algId => {
                            const algorithm = ALGORITHMS.find(a => a.id === algId);
                            return (
                              <span key={algId} className="px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded">
                                {algorithm?.name}
                              </span>
                            );
                          })
                        ) : (
                          <span className="text-gray-500 text-sm">No algorithms selected</span>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-gray-700 mb-2">Correct Algorithms:</h4>
                      <div className="flex flex-wrap gap-2">
                        {question.correctAlgorithms.map(algId => {
                          const algorithm = ALGORITHMS.find(a => a.id === algId);
                          return (
                            <span key={algId} className="px-2 py-1 bg-green-100 text-green-800 text-sm rounded">
                              {algorithm?.name}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-center">
              <button
                onClick={restartQuiz}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Take Quiz Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (quizQuestions.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading quiz...</p>
        </div>
      </div>
    );
  }

  const currentQuestion = quizQuestions[currentQuestionIndex];
  const progressPercentage = ((currentQuestionIndex + 1) / totalQuestions) * 100;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-semibold text-gray-900">Algorithm Selection Quiz</h1>
              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                Question {currentQuestionIndex + 1} of {totalQuestions}
              </span>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <ClockIcon className="h-5 w-5 text-gray-500" />
                <span className="font-mono text-lg font-semibold text-gray-900">
                  {formatTime(timeSpent)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Progress: {currentQuestionIndex + 1} / {totalQuestions}
              </span>
            </div>
            <div className="w-64 bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          {/* Problem Display */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-900">
                {currentQuestion.problem.id}. {currentQuestion.problem.title}
              </h2>
              <div className="flex space-x-2">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  currentQuestion.problem.difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
                  currentQuestion.problem.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {currentQuestion.problem.difficulty}
                </span>
                <span className="px-3 py-1 bg-gray-100 text-gray-800 text-sm rounded-full">
                  {currentQuestion.problem.acceptanceRate}
                </span>
              </div>
            </div>
            
            <p className="text-gray-600 mb-4">
              Select all the algorithms that can be used to solve this LeetCode problem:
            </p>
          </div>

          {/* Algorithm Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {ALGORITHMS.map((algorithm) => (
              <button
                key={algorithm.id}
                onClick={() => handleAlgorithmToggle(algorithm.id)}
                className={`p-4 border-2 rounded-lg text-left transition-all ${
                  selectedAlgorithms.includes(algorithm.id)
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-gray-900">{algorithm.name}</h3>
                  {selectedAlgorithms.includes(algorithm.id) && (
                    <CheckCircleIcon className="h-5 w-5 text-blue-500" />
                  )}
                </div>
                <p className="text-sm text-gray-600 mb-2">{algorithm.description}</p>
                <div className="flex space-x-2 text-xs text-gray-500">
                  <span>Time: {algorithm.timeComplexity}</span>
                  <span>Space: {algorithm.spaceComplexity}</span>
                </div>
              </button>
            ))}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between pt-6 border-t">
            <button
              onClick={handlePreviousQuestion}
              disabled={currentQuestionIndex === 0}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowLeftIcon className="h-4 w-4" />
              <span>Previous</span>
            </button>

            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                {selectedAlgorithms.length} algorithm(s) selected
              </span>
              
              {currentQuestionIndex === totalQuestions - 1 ? (
                <button
                  onClick={handleSubmitAnswer}
                  disabled={selectedAlgorithms.length === 0}
                  className="flex items-center space-x-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span>Finish Quiz</span>
                  <CheckCircleIcon className="h-4 w-4" />
                </button>
              ) : (
                <button
                  onClick={handleSubmitAnswer}
                  disabled={selectedAlgorithms.length === 0}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span>Next Question</span>
                  <ArrowRightIcon className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

