const fs = require('fs');
const path = require('path');

// Manual algorithm mappings for real LeetCode problems
const algorithmMappings = {
  // Array problems
  1: ["Hash Table", "Array"], // Two Sum
  11: ["Array", "Two Pointers", "Greedy"], // Container With Most Water
  15: ["Array", "Two Pointers", "Sorting"], // 3Sum
  16: ["Array", "Two Pointers", "Sorting"], // 3Sum Closest
  18: ["Array", "Two Pointers", "Sorting"], // 4Sum
  26: ["Array", "Two Pointers"], // Remove Duplicates from Sorted Array
  27: ["Array", "Two Pointers"], // Remove Element
  31: ["Array", "Two Pointers"], // Next Permutation
  33: ["Array", "Binary Search"], // Search in Rotated Sorted Array
  34: ["Array", "Binary Search"], // Find First and Last Position
  35: ["Array", "Binary Search"], // Search Insert Position
  39: ["Array", "Backtracking"], // Combination Sum
  40: ["Array", "Backtracking"], // Combination Sum II
  41: ["Array", "Hash Table"], // First Missing Positive
  42: ["Array", "Two Pointers", "Dynamic Programming", "Stack", "Monotonic Stack"], // Trapping Rain Water
  45: ["Array", "Dynamic Programming", "Greedy"], // Jump Game II
  46: ["Array", "Backtracking"], // Permutations
  47: ["Array", "Backtracking"], // Permutations II
  48: ["Array", "Math", "Matrix"], // Rotate Image
  49: ["Array", "Hash Table", "String", "Sorting"], // Group Anagrams
  53: ["Array", "Dynamic Programming", "Divide and Conquer"], // Maximum Subarray
  54: ["Array", "Matrix", "Simulation"], // Spiral Matrix
  55: ["Array", "Dynamic Programming", "Greedy"], // Jump Game
  56: ["Array", "Sorting"], // Merge Intervals
  57: ["Array"], // Insert Interval
  59: ["Array", "Matrix", "Simulation"], // Spiral Matrix II
  62: ["Math", "Dynamic Programming", "Combinatorics"], // Unique Paths
  63: ["Array", "Dynamic Programming"], // Unique Paths II
  64: ["Array", "Dynamic Programming", "Matrix"], // Minimum Path Sum
  66: ["Array", "Math"], // Plus One
  73: ["Array", "Hash Table", "Matrix"], // Set Matrix Zeroes
  74: ["Array", "Binary Search", "Matrix"], // Search a 2D Matrix
  75: ["Array", "Two Pointers", "Sorting"], // Sort Colors
  76: ["Hash Table", "String", "Sliding Window"], // Minimum Window Substring
  78: ["Array", "Backtracking", "Bit Manipulation"], // Subsets
  79: ["Array", "String", "Backtracking", "Matrix"], // Word Search
  80: ["Array", "Two Pointers"], // Remove Duplicates from Sorted Array II
  
  // Linked List problems
  2: ["Linked List", "Math", "Recursion"], // Add Two Numbers
  19: ["Linked List", "Two Pointers"], // Remove Nth Node From End
  21: ["Linked List", "Recursion"], // Merge Two Sorted Lists
  23: ["Linked List", "Divide and Conquer", "Heap", "Merge Sort"], // Merge k Sorted Lists
  24: ["Linked List", "Recursion"], // Swap Nodes in Pairs
  25: ["Linked List", "Recursion"], // Reverse Nodes in k-Group
  61: ["Linked List", "Two Pointers"], // Rotate List
  82: ["Linked List", "Two Pointers"], // Remove Duplicates from Sorted List II
  83: ["Linked List"], // Remove Duplicates from Sorted List
  86: ["Linked List", "Two Pointers"], // Partition List
  92: ["Linked List"], // Reverse Linked List II
  138: ["Hash Table", "Linked List"], // Copy List with Random Pointer
  141: ["Hash Table", "Linked List", "Two Pointers"], // Linked List Cycle
  142: ["Hash Table", "Linked List", "Two Pointers"], // Linked List Cycle II
  143: ["Linked List", "Two Pointers", "Stack", "Recursion"], // Reorder List
  147: ["Linked List", "Sorting"], // Insertion Sort List
  148: ["Linked List", "Two Pointers", "Divide and Conquer", "Sorting", "Merge Sort"], // Sort List
  160: ["Hash Table", "Linked List", "Two Pointers"], // Intersection of Two Linked Lists
  203: ["Linked List", "Recursion"], // Remove Linked List Elements
  206: ["Linked List", "Recursion"], // Reverse Linked List
  234: ["Linked List", "Two Pointers", "Stack", "Recursion"], // Palindrome Linked List
  237: ["Linked List"], // Delete Node in a Linked List
  445: ["Linked List", "Math", "Stack"], // Add Two Numbers II
  
  // String problems
  3: ["Hash Table", "String", "Sliding Window"], // Longest Substring Without Repeating Characters
  5: ["String", "Dynamic Programming"], // Longest Palindromic Substring
  6: ["String"], // Zigzag Conversion
  8: ["String"], // String to Integer (atoi)
  10: ["String", "Dynamic Programming", "Recursion"], // Regular Expression Matching
  12: ["Hash Table", "Math", "String"], // Integer to Roman
  13: ["Hash Table", "Math", "String"], // Roman to Integer
  14: ["String", "Trie"], // Longest Common Prefix
  17: ["Hash Table", "String", "Backtracking"], // Letter Combinations of a Phone Number
  20: ["String", "Stack"], // Valid Parentheses
  22: ["String", "Dynamic Programming", "Backtracking"], // Generate Parentheses
  28: ["String", "String Matching"], // Find the Index of the First Occurrence
  30: ["Hash Table", "String", "Sliding Window"], // Substring with Concatenation of All Words
  32: ["String", "Dynamic Programming", "Stack"], // Longest Valid Parentheses
  36: ["Array", "Hash Table", "Matrix"], // Valid Sudoku
  38: ["String"], // Count and Say
  43: ["Math", "String", "Simulation"], // Multiply Strings
  44: ["String", "Dynamic Programming", "Backtracking", "Recursion", "Greedy"], // Wildcard Matching
  49: ["Array", "Hash Table", "String", "Sorting"], // Group Anagrams
  58: ["String"], // Length of Last Word
  67: ["Math", "String", "Bit Manipulation", "Simulation"], // Add Binary
  68: ["Array", "String", "Simulation"], // Text Justification
  71: ["Array", "String", "Stack", "Simulation"], // Simplify Path
  72: ["String", "Dynamic Programming"], // Edit Distance
  
  // Tree problems
  94: ["Stack", "Tree", "Depth-First Search", "Binary Tree"], // Binary Tree Inorder Traversal
  95: ["Dynamic Programming", "Backtracking", "Tree", "Binary Search Tree", "Binary Tree"], // Unique Binary Search Trees II
  96: ["Math", "Dynamic Programming", "Tree", "Binary Search Tree", "Binary Tree"], // Unique Binary Search Trees
  98: ["Tree", "Depth-First Search", "Binary Search Tree", "Binary Tree"], // Validate Binary Search Tree
  99: ["Tree", "Depth-First Search", "Binary Search Tree", "Binary Tree"], // Recover Binary Search Tree
  100: ["Tree", "Depth-First Search", "Breadth-First Search", "Binary Tree"], // Same Tree
  101: ["Tree", "Depth-First Search", "Breadth-First Search", "Binary Tree"], // Symmetric Tree
  102: ["Tree", "Breadth-First Search", "Binary Tree"], // Binary Tree Level Order Traversal
  103: ["Tree", "Breadth-First Search", "Binary Tree"], // Binary Tree Zigzag Level Order Traversal
  104: ["Tree", "Depth-First Search", "Breadth-First Search", "Binary Tree"], // Maximum Depth of Binary Tree
  105: ["Array", "Hash Table", "Divide and Conquer", "Tree", "Binary Tree"], // Construct Binary Tree from Preorder and Inorder
  106: ["Array", "Hash Table", "Divide and Conquer", "Tree", "Binary Tree"], // Construct Binary Tree from Inorder and Postorder
  107: ["Tree", "Breadth-First Search", "Binary Tree"], // Binary Tree Level Order Traversal II
  108: ["Array", "Divide and Conquer", "Tree", "Binary Search Tree", "Binary Tree"], // Convert Sorted Array to Binary Search Tree
  109: ["Linked List", "Divide and Conquer", "Tree", "Binary Search Tree", "Binary Tree"], // Convert Sorted List to Binary Search Tree
  110: ["Tree", "Depth-First Search", "Binary Tree"], // Balanced Binary Tree
  111: ["Tree", "Depth-First Search", "Breadth-First Search", "Binary Tree"], // Minimum Depth of Binary Tree
  112: ["Tree", "Depth-First Search", "Breadth-First Search", "Binary Tree"], // Path Sum
  113: ["Backtracking", "Tree", "Depth-First Search", "Binary Tree"], // Path Sum II
  114: ["Linked List", "Stack", "Tree", "Depth-First Search", "Binary Tree"], // Flatten Binary Tree to Linked List
  115: ["String", "Dynamic Programming"], // Distinct Subsequences
  116: ["Linked List", "Tree", "Depth-First Search", "Breadth-First Search", "Binary Tree"], // Populating Next Right Pointers in Each Node
  117: ["Linked List", "Tree", "Depth-First Search", "Breadth-First Search", "Binary Tree"], // Populating Next Right Pointers in Each Node II
  124: ["Dynamic Programming", "Tree", "Depth-First Search", "Binary Tree"], // Binary Tree Maximum Path Sum
  
  // Dynamic Programming problems
  70: ["Math", "Dynamic Programming", "Memoization"], // Climbing Stairs
  85: ["Array", "Dynamic Programming", "Stack", "Matrix", "Monotonic Stack"], // Maximal Rectangle
  87: ["String", "Dynamic Programming"], // Scramble String
  91: ["String", "Dynamic Programming"], // Decode Ways
  97: ["String", "Dynamic Programming"], // Interleaving String
  115: ["String", "Dynamic Programming"], // Distinct Subsequences
  118: ["Array", "Dynamic Programming"], // Pascal's Triangle
  119: ["Array", "Dynamic Programming"], // Pascal's Triangle II
  120: ["Array", "Dynamic Programming"], // Triangle
  121: ["Array", "Dynamic Programming"], // Best Time to Buy and Sell Stock
  122: ["Array", "Dynamic Programming", "Greedy"], // Best Time to Buy and Sell Stock II
  123: ["Array", "Dynamic Programming"], // Best Time to Buy and Sell Stock III
  132: ["String", "Dynamic Programming"], // Palindrome Partitioning II
  139: ["Array", "Hash Table", "String", "Dynamic Programming"], // Word Break
  140: ["Array", "Hash Table", "String", "Dynamic Programming", "Backtracking", "Trie", "Memoization"], // Word Break II
  152: ["Array", "Dynamic Programming"], // Maximum Product Subarray
  188: ["Array", "Dynamic Programming"], // Best Time to Buy and Sell Stock IV
  198: ["Array", "Dynamic Programming"], // House Robber
  213: ["Array", "Dynamic Programming"], // House Robber II
  221: ["Array", "Dynamic Programming", "Matrix"], // Maximal Square
  
  // Graph problems
  127: ["Hash Table", "String", "Breadth-First Search"], // Word Ladder
  128: ["Array", "Hash Table", "Union Find"], // Longest Consecutive Sequence
  130: ["Array", "Depth-First Search", "Breadth-First Search", "Union Find", "Matrix"], // Surrounded Regions
  133: ["Hash Table", "Depth-First Search", "Breadth-First Search", "Graph"], // Clone Graph
  200: ["Array", "Depth-First Search", "Breadth-First Search", "Union Find", "Matrix"], // Number of Islands
  207: ["Depth-First Search", "Breadth-First Search", "Graph", "Topological Sort"], // Course Schedule
  210: ["Depth-First Search", "Breadth-First Search", "Graph", "Topological Sort"], // Course Schedule II
  
  // Math problems
  7: ["Math"], // Reverse Integer
  9: ["Math"], // Palindrome Number
  50: ["Math", "Recursion"], // Pow(x, n)
  60: ["Math", "Recursion"], // Permutation Sequence
  65: ["String"], // Valid Number
  69: ["Math", "Binary Search"], // Sqrt(x)
  172: ["Math"], // Factorial Trailing Zeroes
  171: ["Math", "String"], // Excel Sheet Column Number
  168: ["Math", "String"], // Excel Sheet Column Title
  
  // Stack problems
  84: ["Array", "Stack", "Monotonic Stack"], // Largest Rectangle in Histogram
  150: ["Array", "Math", "Stack"], // Evaluate Reverse Polish Notation
  155: ["Stack", "Design"], // Min Stack
  
  // Hash Table problems
  136: ["Array", "Bit Manipulation"], // Single Number
  137: ["Array", "Bit Manipulation"], // Single Number II
  146: ["Hash Table", "Linked List", "Design", "Doubly-Linked List"], // LRU Cache
  149: ["Array", "Hash Table", "Math", "Geometry"], // Max Points on a Line
  166: ["Hash Table", "Math", "String"], // Fraction to Recurring Decimal
  187: ["Hash Table", "String", "Bit Manipulation", "Sliding Window", "Rolling Hash"], // Repeated DNA Sequences
  
  // Two Pointers
  125: ["Two Pointers", "String"], // Valid Palindrome
  167: ["Array", "Two Pointers", "Binary Search"], // Two Sum II - Input Array Is Sorted
  
  // Bit Manipulation
  190: ["Divide and Conquer", "Bit Manipulation"], // Reverse Bits
  191: ["Divide and Conquer", "Bit Manipulation"], // Number of 1 Bits
  
  // Design problems
  146: ["Hash Table", "Linked List", "Design", "Doubly-Linked List"], // LRU Cache
  155: ["Stack", "Design"], // Min Stack
  
  // Sliding Window
  209: ["Array", "Binary Search", "Sliding Window", "Prefix Sum"], // Minimum Size Subarray Sum
  239: ["Array", "Queue", "Sliding Window", "Heap", "Monotonic Queue"], // Sliding Window Maximum
  
  // Binary Search
  153: ["Array", "Binary Search"], // Find Minimum in Rotated Sorted Array
  154: ["Array", "Binary Search"], // Find Minimum in Rotated Sorted Array II
  162: ["Array", "Binary Search"], // Find Peak Element
  174: ["Array", "Dynamic Programming", "Matrix"], // Dungeon Game
  
  // Greedy
  134: ["Array", "Greedy"], // Gas Station
  135: ["Array", "Greedy"], // Candy
  
  // Trie
  208: ["Hash Table", "String", "Design", "Trie"], // Implement Trie (Prefix Tree)
  
  // Union Find
  200: ["Array", "Depth-First Search", "Breadth-First Search", "Union Find", "Matrix"], // Number of Islands
  
  // Heap
  215: ["Array", "Divide and Conquer", "Sorting", "Heap", "Quickselect"], // Kth Largest Element in an Array
  
  // Simulation
  289: ["Array", "Matrix", "Simulation"], // Game of Life
  
  // Monotonic Stack
  316: ["String", "Stack", "Greedy", "Monotonic Stack"], // Remove Duplicate Letters
  
  // Divide and Conquer
  169: ["Array", "Hash Table", "Divide and Conquer", "Sorting", "Counting"], // Majority Element
  
  // Geometry
  149: ["Array", "Hash Table", "Math", "Geometry"], // Max Points on a Line
  
  // Combinatorics
  62: ["Math", "Dynamic Programming", "Combinatorics"], // Unique Paths
  
  // Sorting
  147: ["Linked List", "Sorting"], // Insertion Sort List
  148: ["Linked List", "Two Pointers", "Divide and Conquer", "Sorting", "Merge Sort"], // Sort List
  164: ["Array", "Sorting", "Radix Sort", "Bucket Sort"], // Maximum Gap
  179: ["Array", "String", "Greedy", "Sorting"], // Largest Number
  
  // Rolling Hash
  187: ["Hash Table", "String", "Bit Manipulation", "Sliding Window", "Rolling Hash"], // Repeated DNA Sequences
  
  // Merge Sort
  148: ["Linked List", "Two Pointers", "Divide and Conquer", "Sorting", "Merge Sort"], // Sort List
  
  // Quickselect
  215: ["Array", "Divide and Conquer", "Sorting", "Heap", "Quickselect"], // Kth Largest Element in an Array
  
  // Radix Sort
  164: ["Array", "Sorting", "Radix Sort", "Bucket Sort"], // Maximum Gap
  
  // Bucket Sort
  164: ["Array", "Sorting", "Radix Sort", "Bucket Sort"], // Maximum Gap
  
  // Counting
  169: ["Array", "Hash Table", "Divide and Conquer", "Sorting", "Counting"], // Majority Element
  
  // Memoization
  70: ["Math", "Dynamic Programming", "Memoization"], // Climbing Stairs
  140: ["Array", "Hash Table", "String", "Dynamic Programming", "Backtracking", "Trie", "Memoization"], // Word Break II
  
  // String Matching
  28: ["String", "String Matching"], // Find the Index of the First Occurrence
  
  // Prefix Sum
  209: ["Array", "Binary Search", "Sliding Window", "Prefix Sum"], // Minimum Size Subarray Sum
  
  // Matrix
  48: ["Array", "Math", "Matrix"], // Rotate Image
  54: ["Array", "Matrix", "Simulation"], // Spiral Matrix
  59: ["Array", "Matrix", "Simulation"], // Spiral Matrix II
  73: ["Array", "Hash Table", "Matrix"], // Set Matrix Zeroes
  74: ["Array", "Binary Search", "Matrix"], // Search a 2D Matrix
  79: ["Array", "String", "Backtracking", "Matrix"], // Word Search
  85: ["Array", "Dynamic Programming", "Stack", "Matrix", "Monotonic Stack"], // Maximal Rectangle
  130: ["Array", "Depth-First Search", "Breadth-First Search", "Union Find", "Matrix"], // Surrounded Regions
  200: ["Array", "Depth-First Search", "Breadth-First Search", "Union Find", "Matrix"], // Number of Islands
  221: ["Array", "Dynamic Programming", "Matrix"], // Maximal Square
  289: ["Array", "Matrix", "Simulation"], // Game of Life
  
  // Queue
  239: ["Array", "Queue", "Sliding Window", "Heap", "Monotonic Queue"], // Sliding Window Maximum
  
  // Monotonic Queue
  239: ["Array", "Queue", "Sliding Window", "Heap", "Monotonic Queue"], // Sliding Window Maximum
  
  // Doubly-Linked List
  146: ["Hash Table", "Linked List", "Design", "Doubly-Linked List"], // LRU Cache
  
  // Topological Sort
  207: ["Depth-First Search", "Breadth-First Search", "Graph", "Topological Sort"], // Course Schedule
  210: ["Depth-First Search", "Breadth-First Search", "Graph", "Topological Sort"], // Course Schedule II
  
  // Binary Tree
  94: ["Stack", "Tree", "Depth-First Search", "Binary Tree"], // Binary Tree Inorder Traversal
  95: ["Dynamic Programming", "Backtracking", "Tree", "Binary Search Tree", "Binary Tree"], // Unique Binary Search Trees II
  96: ["Math", "Dynamic Programming", "Tree", "Binary Search Tree", "Binary Tree"], // Unique Binary Search Trees
  98: ["Tree", "Depth-First Search", "Binary Search Tree", "Binary Tree"], // Validate Binary Search Tree
  99: ["Tree", "Depth-First Search", "Binary Search Tree", "Binary Tree"], // Recover Binary Search Tree
  100: ["Tree", "Depth-First Search", "Breadth-First Search", "Binary Tree"], // Same Tree
  101: ["Tree", "Depth-First Search", "Breadth-First Search", "Binary Tree"], // Symmetric Tree
  102: ["Tree", "Breadth-First Search", "Binary Tree"], // Binary Tree Level Order Traversal
  103: ["Tree", "Breadth-First Search", "Binary Tree"], // Binary Tree Zigzag Level Order Traversal
  104: ["Tree", "Depth-First Search", "Breadth-First Search", "Binary Tree"], // Maximum Depth of Binary Tree
  105: ["Array", "Hash Table", "Divide and Conquer", "Tree", "Binary Tree"], // Construct Binary Tree from Preorder and Inorder
  106: ["Array", "Hash Table", "Divide and Conquer", "Tree", "Binary Tree"], // Construct Binary Tree from Inorder and Postorder
  107: ["Tree", "Breadth-First Search", "Binary Tree"], // Binary Tree Level Order Traversal II
  108: ["Array", "Divide and Conquer", "Tree", "Binary Search Tree", "Binary Tree"], // Convert Sorted Array to Binary Search Tree
  109: ["Linked List", "Divide and Conquer", "Tree", "Binary Search Tree", "Binary Tree"], // Convert Sorted List to Binary Search Tree
  110: ["Tree", "Depth-First Search", "Binary Tree"], // Balanced Binary Tree
  111: ["Tree", "Depth-First Search", "Breadth-First Search", "Binary Tree"], // Minimum Depth of Binary Tree
  112: ["Tree", "Depth-First Search", "Breadth-First Search", "Binary Tree"], // Path Sum
  113: ["Backtracking", "Tree", "Depth-First Search", "Binary Tree"], // Path Sum II
  114: ["Linked List", "Stack", "Tree", "Depth-First Search", "Binary Tree"], // Flatten Binary Tree to Linked List
  116: ["Linked List", "Tree", "Depth-First Search", "Breadth-First Search", "Binary Tree"], // Populating Next Right Pointers in Each Node
  117: ["Linked List", "Tree", "Depth-First Search", "Breadth-First Search", "Binary Tree"], // Populating Next Right Pointers in Each Node II
  124: ["Dynamic Programming", "Tree", "Depth-First Search", "Binary Tree"], // Binary Tree Maximum Path Sum
  
  // Binary Search Tree
  95: ["Dynamic Programming", "Backtracking", "Tree", "Binary Search Tree", "Binary Tree"], // Unique Binary Search Trees II
  96: ["Math", "Dynamic Programming", "Tree", "Binary Search Tree", "Binary Tree"], // Unique Binary Search Trees
  98: ["Tree", "Depth-First Search", "Binary Search Tree", "Binary Tree"], // Validate Binary Search Tree
  99: ["Tree", "Depth-First Search", "Binary Search Tree", "Binary Tree"], // Recover Binary Search Tree
  108: ["Array", "Divide and Conquer", "Tree", "Binary Search Tree", "Binary Tree"], // Convert Sorted Array to Binary Search Tree
  109: ["Linked List", "Divide and Conquer", "Tree", "Binary Search Tree", "Binary Tree"] // Convert Sorted List to Binary Search Tree
};

async function curateAlgorithms() {
  console.log('🔧 Starting manual curation of algorithm mappings...');
  
  // Load the real problems data
  const realProblemsPath = path.join(__dirname, '../data/real-leetcode-problems.json');
  const realProblemsData = JSON.parse(fs.readFileSync(realProblemsPath, 'utf8'));
  const problems = realProblemsData.problems;
  
  console.log(`📊 Total problems to curate: ${problems.length}`);
  
  let curatedCount = 0;
  
  // Apply manual algorithm mappings
  const curatedProblems = problems.map(problem => {
    if (algorithmMappings[problem.id]) {
      problem.algorithms = algorithmMappings[problem.id];
      curatedCount++;
    } else {
      // Use intelligent defaults based on problem patterns
      problem.algorithms = inferAlgorithms(problem.title, problem.id);
    }
    
    // Add agent assignment for parallel processing
    problem.agentAssigned = Math.floor((problem.id - 1) / 100) + 1;
    
    return problem;
  });
  
  console.log(`✅ Manually curated: ${curatedCount} problems`);
  console.log(`🤖 Inferred algorithms: ${problems.length - curatedCount} problems`);
  
  // Save curated data
  const curatedData = {
    ...realProblemsData,
    problems: curatedProblems,
    metadata: {
      ...realProblemsData.metadata,
      curationDate: new Date().toISOString(),
      manuallyCurated: curatedCount,
      totalProblems: problems.length
    }
  };
  
  const outputPath = path.join(__dirname, '../data/curated-leetcode-problems.json');
  fs.writeFileSync(outputPath, JSON.stringify(curatedData, null, 2));
  
  console.log(`💾 Saved curated problems to ${outputPath}`);
  
  // Show sample curated problems
  console.log('\n📋 Sample Curated Problems:');
  curatedProblems.slice(0, 20).forEach(problem => {
    console.log(`  ${problem.id}: ${problem.title} (${problem.difficulty}) - ${problem.algorithms.join(', ')}`);
  });
  
  return curatedProblems;
}

function inferAlgorithms(title, id) {
  const titleLower = title.toLowerCase();
  let algorithms = [];
  
  // Pattern-based algorithm inference
  if (titleLower.includes('tree') || titleLower.includes('binary tree')) {
    algorithms.push('Tree', 'Depth-First Search', 'Binary Tree');
  }
  if (titleLower.includes('linked list') || titleLower.includes('list')) {
    algorithms.push('Linked List');
  }
  if (titleLower.includes('array') || titleLower.includes('sum') || titleLower.includes('sort')) {
    algorithms.push('Array');
  }
  if (titleLower.includes('string') || titleLower.includes('substring') || titleLower.includes('palindrome')) {
    algorithms.push('String');
  }
  if (titleLower.includes('hash') || titleLower.includes('map') || titleLower.includes('frequency')) {
    algorithms.push('Hash Table');
  }
  if (titleLower.includes('search') || titleLower.includes('find')) {
    algorithms.push('Binary Search');
  }
  if (titleLower.includes('dynamic') || titleLower.includes('dp') || titleLower.includes('optimization')) {
    algorithms.push('Dynamic Programming');
  }
  if (titleLower.includes('graph') || titleLower.includes('node') || titleLower.includes('path')) {
    algorithms.push('Graph', 'Depth-First Search', 'Breadth-First Search');
  }
  if (titleLower.includes('stack') || titleLower.includes('queue')) {
    algorithms.push('Stack');
  }
  if (titleLower.includes('two pointers') || titleLower.includes('pointer')) {
    algorithms.push('Two Pointers');
  }
  if (titleLower.includes('sliding window') || titleLower.includes('window')) {
    algorithms.push('Sliding Window');
  }
  if (titleLower.includes('backtrack') || titleLower.includes('combination') || titleLower.includes('permutation')) {
    algorithms.push('Backtracking');
  }
  if (titleLower.includes('greedy') || titleLower.includes('optimal')) {
    algorithms.push('Greedy');
  }
  if (titleLower.includes('bit') || titleLower.includes('xor') || titleLower.includes('binary')) {
    algorithms.push('Bit Manipulation');
  }
  if (titleLower.includes('math') || titleLower.includes('number') || titleLower.includes('digit')) {
    algorithms.push('Math');
  }
  if (titleLower.includes('matrix') || titleLower.includes('2d')) {
    algorithms.push('Matrix');
  }
  if (titleLower.includes('design') || titleLower.includes('implement')) {
    algorithms.push('Design');
  }
  
  // Default fallback based on problem ID ranges (common patterns)
  if (algorithms.length === 0) {
    if (id <= 100) {
      algorithms = ['Array', 'Hash Table'];
    } else if (id <= 200) {
      algorithms = ['Dynamic Programming', 'String'];
    } else if (id <= 300) {
      algorithms = ['Tree', 'Depth-First Search'];
    } else {
      algorithms = ['Array', 'Two Pointers'];
    }
  }
  
  return algorithms;
}

module.exports = curateAlgorithms;

if (require.main === module) {
  curateAlgorithms()
    .then(problems => {
      console.log(`\n🎉 Successfully curated algorithms for ${problems.length} problems!`);
    })
    .catch(console.error);
}