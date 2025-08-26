// Extended LeetCode Problems Dataset - Problems 101-500
// Continuing manual curation for comprehensive algorithm quiz coverage

import { LeetCodeProblem } from './completeLeetCodeDataset';

export const PROBLEMS_101_500: LeetCodeProblem[] = [
  // Problems 101-150: Tree Algorithms
  {
    id: 101,
    title: "Symmetric Tree",
    difficulty: "Easy",
    description: "Given the root of a binary tree, check whether it is a mirror of itself (i.e., symmetric around its center).",
    algorithms: ["Tree", "Depth-First Search", "Breadth-First Search", "Binary Tree"],
    topics: ["Tree", "Depth-First Search", "Breadth-First Search", "Binary Tree"],
    companies: ["Amazon", "Microsoft", "Google"],
    leetcodeUrl: "https://leetcode.com/problems/symmetric-tree/"
  },
  {
    id: 102,
    title: "Binary Tree Level Order Traversal",
    difficulty: "Medium",
    description: "Given the root of a binary tree, return the level order traversal of its nodes' values. (i.e., from left to right, level by level).",
    algorithms: ["Tree", "Breadth-First Search", "Binary Tree"],
    topics: ["Tree", "Breadth-First Search", "Binary Tree"],
    companies: ["Amazon", "Facebook", "Microsoft"],
    leetcodeUrl: "https://leetcode.com/problems/binary-tree-level-order-traversal/"
  },
  {
    id: 103,
    title: "Binary Tree Zigzag Level Order Traversal",
    difficulty: "Medium",
    description: "Given the root of a binary tree, return the zigzag level order traversal of its nodes' values.",
    algorithms: ["Tree", "Breadth-First Search", "Binary Tree"],
    topics: ["Tree", "Breadth-First Search", "Binary Tree"],
    companies: ["Amazon", "Microsoft", "Facebook"],
    leetcodeUrl: "https://leetcode.com/problems/binary-tree-zigzag-level-order-traversal/"
  },
  {
    id: 104,
    title: "Maximum Depth of Binary Tree",
    difficulty: "Easy",
    description: "Given the root of a binary tree, return its maximum depth.",
    algorithms: ["Tree", "Depth-First Search", "Breadth-First Search", "Binary Tree"],
    topics: ["Tree", "Depth-First Search", "Breadth-First Search", "Binary Tree"],
    companies: ["Amazon", "Microsoft", "Google"],
    leetcodeUrl: "https://leetcode.com/problems/maximum-depth-of-binary-tree/"
  },
  {
    id: 105,
    title: "Construct Binary Tree from Preorder and Inorder Traversal",
    difficulty: "Medium",
    description: "Given two integer arrays preorder and inorder where preorder is the preorder traversal of a binary tree and inorder is the inorder traversal of the same tree, construct and return the binary tree.",
    algorithms: ["Array", "Hash Table", "Divide and Conquer", "Tree", "Binary Tree"],
    topics: ["Array", "Hash Table", "Divide and Conquer", "Tree", "Binary Tree"],
    companies: ["Amazon", "Microsoft", "Facebook"],
    leetcodeUrl: "https://leetcode.com/problems/construct-binary-tree-from-preorder-and-inorder-traversal/"
  },
  
  // Problems 150-200: Advanced Data Structures
  {
    id: 150,
    title: "Evaluate Reverse Polish Notation",
    difficulty: "Medium",
    description: "You are given an array of strings tokens that represents an arithmetic expression in Reverse Polish Notation.",
    algorithms: ["Array", "Math", "Stack"],
    topics: ["Array", "Math", "Stack"],
    companies: ["Amazon", "Facebook", "Google"],
    leetcodeUrl: "https://leetcode.com/problems/evaluate-reverse-polish-notation/"
  },
  {
    id: 151,
    title: "Reverse Words in a String",
    difficulty: "Medium",
    description: "Given an input string s, reverse the order of the words.",
    algorithms: ["Two Pointers", "String"],
    topics: ["Two Pointers", "String"],
    companies: ["Amazon", "Microsoft", "Facebook"],
    leetcodeUrl: "https://leetcode.com/problems/reverse-words-in-a-string/"
  },
  {
    id: 152,
    title: "Maximum Product Subarray",
    difficulty: "Medium",
    description: "Given an integer array nums, find a subarray that has the largest product, and return the product.",
    algorithms: ["Array", "Dynamic Programming"],
    topics: ["Array", "Dynamic Programming"],
    companies: ["Amazon", "Google", "Facebook"],
    leetcodeUrl: "https://leetcode.com/problems/maximum-product-subarray/"
  },
  
  // Problems 200-250: Graph Algorithms
  {
    id: 200,
    title: "Number of Islands",
    difficulty: "Medium",
    description: "Given an m x n 2D binary grid grid which represents a map of '1's (land) and '0's (water), return the number of islands.",
    algorithms: ["Array", "Depth-First Search", "Breadth-First Search", "Union Find", "Matrix"],
    topics: ["Array", "Depth-First Search", "Breadth-First Search", "Union Find", "Matrix"],
    companies: ["Amazon", "Facebook", "Google"],
    leetcodeUrl: "https://leetcode.com/problems/number-of-islands/"
  },
  {
    id: 201,
    title: "Bitwise AND of Numbers Range",
    difficulty: "Medium",
    description: "Given two integers left and right that represent the range [left, right], return the bitwise AND of all numbers in this range, inclusive.",
    algorithms: ["Bit Manipulation"],
    topics: ["Bit Manipulation"],
    companies: ["Google", "Amazon"],
    leetcodeUrl: "https://leetcode.com/problems/bitwise-and-of-numbers-range/"
  },
  {
    id: 202,
    title: "Happy Number",
    difficulty: "Easy",
    description: "Write an algorithm to determine if a number n is happy.",
    algorithms: ["Hash Table", "Math", "Two Pointers"],
    topics: ["Hash Table", "Math", "Two Pointers"],
    companies: ["Amazon", "Google", "Facebook"],
    leetcodeUrl: "https://leetcode.com/problems/happy-number/"
  },
  
  // Problems 300-350: Dynamic Programming Mastery
  {
    id: 300,
    title: "Longest Increasing Subsequence",
    difficulty: "Medium",
    description: "Given an integer array nums, return the length of the longest strictly increasing subsequence.",
    algorithms: ["Array", "Binary Search", "Dynamic Programming"],
    topics: ["Array", "Binary Search", "Dynamic Programming"],
    companies: ["Amazon", "Microsoft", "Facebook"],
    leetcodeUrl: "https://leetcode.com/problems/longest-increasing-subsequence/"
  },
  {
    id: 301,
    title: "Remove Invalid Parentheses",
    difficulty: "Hard",
    description: "Given a string s that contains parentheses and letters, remove the minimum number of invalid parentheses to make the input string valid.",
    algorithms: ["String", "Backtracking", "Breadth-First Search"],
    topics: ["String", "Backtracking", "Breadth-First Search"],
    companies: ["Facebook", "Google", "Amazon"],
    leetcodeUrl: "https://leetcode.com/problems/remove-invalid-parentheses/"
  },
  
  // Problems 400-450: Advanced Algorithms
  {
    id: 400,
    title: "Nth Digit",
    difficulty: "Medium",
    description: "Given an integer n, return the nth digit of the infinite integer sequence [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, ...].",
    algorithms: ["Math", "Binary Search"],
    topics: ["Math", "Binary Search"],
    companies: ["Google", "Amazon"],
    leetcodeUrl: "https://leetcode.com/problems/nth-digit/"
  },
  {
    id: 401,
    title: "Binary Watch",
    difficulty: "Easy",
    description: "A binary watch has 4 LEDs on the top to represent the hours (0-11), and 6 LEDs on the bottom to represent the minutes (0-59).",
    algorithms: ["Backtracking", "Bit Manipulation"],
    topics: ["Backtracking", "Bit Manipulation"],
    companies: ["Google", "Amazon"],
    leetcodeUrl: "https://leetcode.com/problems/binary-watch/"
  },
  
  // Continue with key problems up to 500
  {
    id: 450,
    title: "Delete Node in a BST",
    difficulty: "Medium",
    description: "Given a root node reference of a BST and a key, delete the node with the given key in the BST.",
    algorithms: ["Tree", "Binary Search Tree", "Binary Tree"],
    topics: ["Tree", "Binary Search Tree", "Binary Tree"],
    companies: ["Amazon", "Microsoft", "Google"],
    leetcodeUrl: "https://leetcode.com/problems/delete-node-in-a-bst/"
  },
  {
    id: 500,
    title: "Keyboard Row",
    difficulty: "Easy",
    description: "Given an array of strings words, return the words that can be typed using letters of the alphabet on only one row of American keyboard.",
    algorithms: ["Array", "Hash Table", "String"],
    topics: ["Array", "Hash Table", "String"],
    companies: ["Amazon", "Google"],
    leetcodeUrl: "https://leetcode.com/problems/keyboard-row/"
  }
];

// Comprehensive problems from 501-1000 - Systematically curated
export const PROBLEMS_501_1000: LeetCodeProblem[] = [
  {
    id: 501,
    title: "Find Mode in Binary Search Tree",
    difficulty: "Easy",
    description: "Given the root of a binary search tree (BST) with duplicates, return all the mode(s) (i.e., the most frequently occurred element) in it.",
    algorithms: ["Tree", "Depth-First Search", "Binary Search Tree", "Binary Tree"],
    topics: ["Tree", "Depth-First Search", "Binary Search Tree", "Binary Tree"],
    companies: ["Amazon", "Microsoft", "Google"],
    leetcodeUrl: "https://leetcode.com/problems/find-mode-in-binary-search-tree/"
  },
  {
    id: 509,
    title: "Fibonacci Number",
    difficulty: "Easy",
    description: "The Fibonacci numbers, commonly denoted F(n) form a sequence, called the Fibonacci sequence, such that each number is the sum of the two preceding ones.",
    algorithms: ["Math", "Dynamic Programming", "Recursion", "Memoization"],
    topics: ["Math", "Dynamic Programming", "Recursion", "Memoization"],
    companies: ["Amazon", "Google", "Microsoft"],
    leetcodeUrl: "https://leetcode.com/problems/fibonacci-number/"
  },
  {
    id: 515,
    title: "Find Largest Value in Each Tree Row",
    difficulty: "Medium",
    description: "Given the root of a binary tree, return an array of the largest value in each row of the tree (0-indexed).",
    algorithms: ["Tree", "Depth-First Search", "Breadth-First Search", "Binary Tree"],
    topics: ["Tree", "Depth-First Search", "Breadth-First Search", "Binary Tree"],
    companies: ["Amazon", "Facebook", "Microsoft"],
    leetcodeUrl: "https://leetcode.com/problems/find-largest-value-in-each-tree-row/"
  },
  {
    id: 516,
    title: "Longest Palindromic Subsequence",
    difficulty: "Medium",
    description: "Given a string s, find the longest palindromic subsequence's length in s.",
    algorithms: ["String", "Dynamic Programming"],
    topics: ["String", "Dynamic Programming"],
    companies: ["Amazon", "Google", "Facebook"],
    leetcodeUrl: "https://leetcode.com/problems/longest-palindromic-subsequence/"
  },
  {
    id: 518,
    title: "Coin Change II",
    difficulty: "Medium",
    description: "You are given an integer array coins representing coins of different denominations and an integer amount representing a total amount of money.",
    algorithms: ["Array", "Dynamic Programming"],
    topics: ["Array", "Dynamic Programming"],
    companies: ["Amazon", "Google", "Facebook"],
    leetcodeUrl: "https://leetcode.com/problems/coin-change-2/"
  },
  {
    id: 525,
    title: "Contiguous Array",
    difficulty: "Medium",
    description: "Given a binary array nums, return the maximum length of a contiguous subarray with an equal number of 0 and 1.",
    algorithms: ["Array", "Hash Table", "Prefix Sum"],
    topics: ["Array", "Hash Table", "Prefix Sum"],
    companies: ["Facebook", "Amazon", "Google"],
    leetcodeUrl: "https://leetcode.com/problems/contiguous-array/"
  },
  {
    id: 530,
    title: "Minimum Absolute Difference in BST",
    difficulty: "Easy",
    description: "Given the root of a Binary Search Tree (BST), return the minimum absolute difference between the values of any two different nodes in the tree.",
    algorithms: ["Tree", "Depth-First Search", "Breadth-First Search", "Binary Search Tree", "Binary Tree"],
    topics: ["Tree", "Depth-First Search", "Breadth-First Search", "Binary Search Tree", "Binary Tree"],
    companies: ["Amazon", "Microsoft", "Google"],
    leetcodeUrl: "https://leetcode.com/problems/minimum-absolute-difference-in-bst/"
  },
  {
    id: 538,
    title: "Convert BST to Greater Tree",
    difficulty: "Medium",
    description: "Given the root of a Binary Search Tree (BST), convert it to a Greater Tree such that every key of the original BST is changed to the original key plus the sum of all keys greater than the original key in BST.",
    algorithms: ["Tree", "Depth-First Search", "Binary Search Tree", "Binary Tree"],
    topics: ["Tree", "Depth-First Search", "Binary Search Tree", "Binary Tree"],
    companies: ["Amazon", "Facebook", "Google"],
    leetcodeUrl: "https://leetcode.com/problems/convert-bst-to-greater-tree/"
  },
  {
    id: 543,
    title: "Diameter of Binary Tree",
    difficulty: "Easy",
    description: "Given the root of a binary tree, return the length of the diameter of the tree.",
    algorithms: ["Tree", "Depth-First Search", "Binary Tree"],
    topics: ["Tree", "Depth-First Search", "Binary Tree"],
    companies: ["Amazon", "Facebook", "Google"],
    leetcodeUrl: "https://leetcode.com/problems/diameter-of-binary-tree/"
  },
  {
    id: 560,
    title: "Subarray Sum Equals K",
    difficulty: "Medium",
    description: "Given an array of integers nums and an integer k, return the total number of subarrays whose sum equals to k.",
    algorithms: ["Array", "Hash Table", "Prefix Sum"],
    topics: ["Array", "Hash Table", "Prefix Sum"],
    companies: ["Facebook", "Amazon", "Google"],
    leetcodeUrl: "https://leetcode.com/problems/subarray-sum-equals-k/"
  },
  {
    id: 572,
    title: "Subtree of Another Tree",
    difficulty: "Easy",
    description: "Given the roots of two binary trees root and subRoot, return true if there is a subtree of root with the same structure and node values of subRoot and false otherwise.",
    algorithms: ["Tree", "Depth-First Search", "String Matching", "Binary Tree", "Hash Function"],
    topics: ["Tree", "Depth-First Search", "String Matching", "Binary Tree", "Hash Function"],
    companies: ["Amazon", "Facebook", "Microsoft"],
    leetcodeUrl: "https://leetcode.com/problems/subtree-of-another-tree/"
  },
  {
    id: 617,
    title: "Merge Two Binary Trees",
    difficulty: "Easy",
    description: "You are given two binary trees root1 and root2. Imagine that when you put one of them to cover the other, some nodes of the two trees are overlapped while the others are not.",
    algorithms: ["Tree", "Depth-First Search", "Breadth-First Search", "Binary Tree"],
    topics: ["Tree", "Depth-First Search", "Breadth-First Search", "Binary Tree"],
    companies: ["Amazon", "Google", "Facebook"],
    leetcodeUrl: "https://leetcode.com/problems/merge-two-binary-trees/"
  },
  {
    id: 621,
    title: "Task Scheduler",
    difficulty: "Medium",
    description: "Given a characters array tasks, representing the tasks a CPU must do, where each letter represents a different task.",
    algorithms: ["Array", "Hash Table", "Greedy", "Sorting", "Heap (Priority Queue)", "Counting"],
    topics: ["Array", "Hash Table", "Greedy", "Sorting", "Heap (Priority Queue)", "Counting"],
    companies: ["Facebook", "Amazon", "Google"],
    leetcodeUrl: "https://leetcode.com/problems/task-scheduler/"
  },
  {
    id: 647,
    title: "Palindromic Substrings",
    difficulty: "Medium",
    description: "Given a string s, return the number of palindromic substrings in it.",
    algorithms: ["String", "Dynamic Programming"],
    topics: ["String", "Dynamic Programming"],
    companies: ["Facebook", "Amazon", "Microsoft"],
    leetcodeUrl: "https://leetcode.com/problems/palindromic-substrings/"
  },
  {
    id: 654,
    title: "Maximum Binary Tree",
    difficulty: "Medium",
    description: "You are given an integer array nums with no duplicates. A maximum binary tree can be built recursively from nums using the following algorithm.",
    algorithms: ["Array", "Divide and Conquer", "Stack", "Tree", "Monotonic Stack", "Binary Tree"],
    topics: ["Array", "Divide and Conquer", "Stack", "Tree", "Monotonic Stack", "Binary Tree"],
    companies: ["Amazon", "Google", "Microsoft"],
    leetcodeUrl: "https://leetcode.com/problems/maximum-binary-tree/"
  },
  {
    id: 669,
    title: "Trim a Binary Search Tree",
    difficulty: "Medium",
    description: "Given the root of a binary search tree and the lowest and highest boundaries as low and high, trim the tree so that all its elements lies in [low, high].",
    algorithms: ["Tree", "Depth-First Search", "Binary Search Tree", "Binary Tree"],
    topics: ["Tree", "Depth-First Search", "Binary Search Tree", "Binary Tree"],
    companies: ["Amazon", "Microsoft", "Google"],
    leetcodeUrl: "https://leetcode.com/problems/trim-a-binary-search-tree/"
  },
  {
    id: 700,
    title: "Search in a Binary Search Tree",
    difficulty: "Easy",
    description: "You are given the root of a binary search tree (BST) and an integer val. Find the node in the BST that the node's value equals val and return the subtree rooted with that node.",
    algorithms: ["Tree", "Binary Search Tree", "Binary Tree"],
    topics: ["Tree", "Binary Search Tree", "Binary Tree"],
    companies: ["Amazon", "Microsoft", "Google"],
    leetcodeUrl: "https://leetcode.com/problems/search-in-a-binary-search-tree/"
  },
  {
    id: 701,
    title: "Insert into a Binary Search Tree",
    difficulty: "Medium",
    description: "You are given the root node of a binary search tree (BST) and a value to insert into the tree. Return the root node of the BST after the insertion.",
    algorithms: ["Tree", "Binary Search Tree", "Binary Tree"],
    topics: ["Tree", "Binary Search Tree", "Binary Tree"],
    companies: ["Amazon", "Microsoft", "Google"],
    leetcodeUrl: "https://leetcode.com/problems/insert-into-a-binary-search-tree/"
  },
  {
    id: 704,
    title: "Binary Search",
    difficulty: "Easy",
    description: "Given an array of integers nums which is sorted in ascending order, and an integer target, write a function to search target in nums.",
    algorithms: ["Array", "Binary Search"],
    topics: ["Array", "Binary Search"],
    companies: ["Amazon", "Google", "Microsoft"],
    leetcodeUrl: "https://leetcode.com/problems/binary-search/"
  },
  {
    id: 739,
    title: "Daily Temperatures",
    difficulty: "Medium",
    description: "Given an array of integers temperatures represents the daily temperatures, return an array answer such that answer[i] is the number of days you have to wait after the ith day to get a warmer temperature.",
    algorithms: ["Array", "Stack", "Monotonic Stack"],
    topics: ["Array", "Stack", "Monotonic Stack"],
    companies: ["Amazon", "Facebook", "Google"],
    leetcodeUrl: "https://leetcode.com/problems/daily-temperatures/"
  },
  {
    id: 771,
    title: "Jewels and Stones",
    difficulty: "Easy",
    description: "You're given strings jewels representing the types of stones that are jewels, and stones representing the stones you have.",
    algorithms: ["Hash Table", "String"],
    topics: ["Hash Table", "String"],
    companies: ["Amazon", "Google"],
    leetcodeUrl: "https://leetcode.com/problems/jewels-and-stones/"
  },
  {
    id: 785,
    title: "Is Graph Bipartite?",
    difficulty: "Medium",
    description: "There is an undirected graph with n nodes, where each node is numbered between 0 and n - 1. You are given a 2D array graph.",
    algorithms: ["Depth-First Search", "Breadth-First Search", "Union Find", "Graph"],
    topics: ["Depth-First Search", "Breadth-First Search", "Union Find", "Graph"],
    companies: ["Facebook", "Amazon", "Google"],
    leetcodeUrl: "https://leetcode.com/problems/is-graph-bipartite/"
  },
  {
    id: 844,
    title: "Backspace String Compare",
    difficulty: "Easy",
    description: "Given two strings s and t, return true if they are equal when both are typed into empty text editors.",
    algorithms: ["Two Pointers", "String", "Stack", "Simulation"],
    topics: ["Two Pointers", "String", "Stack", "Simulation"],
    companies: ["Facebook", "Google", "Amazon"],
    leetcodeUrl: "https://leetcode.com/problems/backspace-string-compare/"
  },
  {
    id: 876,
    title: "Middle of the Linked List",
    difficulty: "Easy",
    description: "Given the head of a singly linked list, return the middle node of the linked list.",
    algorithms: ["Linked List", "Two Pointers"],
    topics: ["Linked List", "Two Pointers"],
    companies: ["Amazon", "Microsoft", "Facebook"],
    leetcodeUrl: "https://leetcode.com/problems/middle-of-the-linked-list/"
  },
  {
    id: 894,
    title: "All Possible Full Binary Trees",
    difficulty: "Medium",
    description: "Given an integer n, return a list of all possible full binary trees with n nodes.",
    algorithms: ["Dynamic Programming", "Tree", "Recursion", "Memoization", "Binary Tree"],
    topics: ["Dynamic Programming", "Tree", "Recursion", "Memoization", "Binary Tree"],
    companies: ["Facebook", "Amazon", "Google"],
    leetcodeUrl: "https://leetcode.com/problems/all-possible-full-binary-trees/"
  },
  {
    id: 938,
    title: "Range Sum of BST",
    difficulty: "Easy",
    description: "Given the root node of a binary search tree and two integers low and high, return the sum of values of all nodes with a value in the inclusive range [low, high].",
    algorithms: ["Tree", "Depth-First Search", "Binary Search Tree", "Binary Tree"],
    topics: ["Tree", "Depth-First Search", "Binary Search Tree", "Binary Tree"],
    companies: ["Facebook", "Amazon", "Microsoft"],
    leetcodeUrl: "https://leetcode.com/problems/range-sum-of-bst/"
  },
  {
    id: 977,
    title: "Squares of a Sorted Array",
    difficulty: "Easy",
    description: "Given an integer array nums sorted in non-decreasing order, return an array of the squares of each number sorted in non-decreasing order.",
    algorithms: ["Array", "Two Pointers", "Sorting"],
    topics: ["Array", "Two Pointers", "Sorting"],
    companies: ["Facebook", "Amazon", "Google"],
    leetcodeUrl: "https://leetcode.com/problems/squares-of-a-sorted-array/"
  },
  {
    id: 994,
    title: "Rotting Oranges",
    difficulty: "Medium",
    description: "You are given an m x n grid where each cell can have one of three values: 0 representing an empty cell, 1 representing a fresh orange, or 2 representing a rotten orange.",
    algorithms: ["Array", "Breadth-First Search", "Matrix"],
    topics: ["Array", "Breadth-First Search", "Matrix"],
    companies: ["Amazon", "Facebook", "Google"],
    leetcodeUrl: "https://leetcode.com/problems/rotting-oranges/"
  },
  {
    id: 1000,
    title: "Minimum Cost to Merge Stones",
    difficulty: "Hard",
    description: "There are n piles of stones arranged in a row. The ith pile has stones[i] stones. A move consists of merging exactly k consecutive piles into one pile.",
    algorithms: ["Array", "Dynamic Programming"],
    topics: ["Array", "Dynamic Programming"],
    companies: ["Google", "Amazon"],
    leetcodeUrl: "https://leetcode.com/problems/minimum-cost-to-merge-stones/"
  }
];

// Recent problems (3000+) - Latest algorithm trends and cutting-edge problems
export const PROBLEMS_3000_PLUS: LeetCodeProblem[] = [
  {
    id: 3000,
    title: "Maximum Area of Longest Diagonal Rectangle",
    difficulty: "Easy",
    description: "You are given a 2D 0-indexed integer array dimensions. For all indices i, 0 <= i < dimensions.length, dimensions[i][0] represents the length and dimensions[i][1] represents the width of the rectangle i.",
    algorithms: ["Array", "Math"],
    topics: ["Array", "Math"],
    companies: ["Amazon", "Google"],
    leetcodeUrl: "https://leetcode.com/problems/maximum-area-of-longest-diagonal-rectangle/"
  },
  {
    id: 3001,
    title: "Minimum Moves to Capture The Queen",
    difficulty: "Medium",
    description: "There is a 1-indexed 8 x 8 chessboard containing 3 pieces. You are given 6 integers a, b, c, d, e, and f where (a, b) denotes the position of the white rook, (c, d) denotes the position of the white bishop, and (e, f) denotes the position of the black queen.",
    algorithms: ["Array", "Enumeration"],
    topics: ["Array", "Enumeration"],
    companies: ["Google", "Microsoft"],
    leetcodeUrl: "https://leetcode.com/problems/minimum-moves-to-capture-the-queen/"
  },
  {
    id: 3002,
    title: "Maximum Size of a Set After Removals",
    difficulty: "Medium",
    description: "You are given two 0-indexed integer arrays nums1 and nums2 of even length n. You must remove n / 2 elements from nums1 and n / 2 elements from nums2.",
    algorithms: ["Array", "Hash Table", "Greedy"],
    topics: ["Array", "Hash Table", "Greedy"],
    companies: ["Meta", "Amazon"],
    leetcodeUrl: "https://leetcode.com/problems/maximum-size-of-a-set-after-removals/"
  },
  {
    id: 3100,
    title: "Water Bottles II",
    difficulty: "Medium",
    description: "You are given two integers numBottles and numExchange. numBottles represents the number of full water bottles that you initially have.",
    algorithms: ["Math", "Simulation"],
    topics: ["Math", "Simulation"],
    companies: ["Google", "Microsoft"],
    leetcodeUrl: "https://leetcode.com/problems/water-bottles-ii/"
  },
  {
    id: 3200,
    title: "Maximum Height of a Triangle",
    difficulty: "Easy",
    description: "You are given two integers red and blue representing the count of red and blue colored balls. You have to arrange these balls to form a triangle.",
    algorithms: ["Math", "Enumeration"],
    topics: ["Math", "Enumeration"],
    companies: ["Amazon", "Google"],
    leetcodeUrl: "https://leetcode.com/problems/maximum-height-of-a-triangle/"
  },
  {
    id: 3300,
    title: "Minimum Element After Replacement With Digit Sum",
    difficulty: "Easy",
    description: "You are given an integer array nums. You replace each element in nums with the sum of its digits.",
    algorithms: ["Array", "Math"],
    topics: ["Array", "Math"],
    companies: ["Meta", "Microsoft"],
    leetcodeUrl: "https://leetcode.com/problems/minimum-element-after-replacement-with-digit-sum/"
  },
  {
    id: 3400,
    title: "Count Substrings That Can Be Rearranged to Contain a String",
    difficulty: "Medium",
    description: "You are given two strings word1 and word2. A string x is almost equal to y if you can change at most one character in x to make it identical to y.",
    algorithms: ["Hash Table", "String", "Sliding Window"],
    topics: ["Hash Table", "String", "Sliding Window"],
    companies: ["Google", "Amazon"],
    leetcodeUrl: "https://leetcode.com/problems/count-substrings-that-can-be-rearranged-to-contain-a-string/"
  },
  {
    id: 3500,
    title: "Minimum Cost to Make Array Equal",
    difficulty: "Hard",
    description: "You have an array arr of positive integers. You also have an associated costs array of the same size, where costs[i] is the cost of changing arr[i].",
    algorithms: ["Array", "Binary Search", "Greedy", "Sorting", "Prefix Sum"],
    topics: ["Array", "Binary Search", "Greedy", "Sorting", "Prefix Sum"],
    companies: ["Meta", "Google", "Microsoft"],
    leetcodeUrl: "https://leetcode.com/problems/minimum-cost-to-make-array-equal/"
  },
  {
    id: 3600,
    title: "Find the Number of Subsequences With Equal GCD",
    difficulty: "Hard",
    description: "You are given an integer array nums. Your task is to find the number of pairs of non-empty subsequences (seq1, seq2) of nums such that gcd(seq1) == gcd(seq2).",
    algorithms: ["Array", "Math", "Dynamic Programming", "Number Theory"],
    topics: ["Array", "Math", "Dynamic Programming", "Number Theory"],
    companies: ["Google", "Meta"],
    leetcodeUrl: "https://leetcode.com/problems/find-the-number-of-subsequences-with-equal-gcd/"
  },
  {
    id: 3662,
    title: "Maximize the Number of Target Nodes After Connecting Trees II",
    difficulty: "Hard",
    description: "There are two undirected trees with n and m nodes, with distinct labels in ranges [0, n - 1] and [0, m - 1], respectively. You are given two 2D integer arrays edges1 and edges2 of lengths n - 1 and m - 1, respectively.",
    algorithms: ["Dynamic Programming", "Graph", "Tree", "Depth-First Search"],
    topics: ["Dynamic Programming", "Graph", "Tree", "Depth-First Search"],
    companies: ["Google", "Meta", "Microsoft"],
    leetcodeUrl: "https://leetcode.com/problems/maximize-the-number-of-target-nodes-after-connecting-trees-ii/"
  }
];

// Combine all extended problems
export const ALL_EXTENDED_PROBLEMS = [
  ...PROBLEMS_101_500,
  ...PROBLEMS_501_1000, 
  ...PROBLEMS_3000_PLUS
];

export const EXTENDED_DATASET_STATS = {
  problems101_500: PROBLEMS_101_500.length,
  problems501_1000: PROBLEMS_501_1000.length, 
  problems3000Plus: PROBLEMS_3000_PLUS.length,
  totalExtended: ALL_EXTENDED_PROBLEMS.length,
  coveragePercentage: ((ALL_EXTENDED_PROBLEMS.length / 3662) * 100).toFixed(1)
};