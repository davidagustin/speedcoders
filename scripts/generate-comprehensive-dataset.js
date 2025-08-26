const fs = require('fs');
const path = require('path');

// Load the verified problems JSON data
const verifiedDataPath = path.join(__dirname, '../data/verified-leetcode-problems.json');
const verifiedData = JSON.parse(fs.readFileSync(verifiedDataPath, 'utf8'));

// Company mappings based on common LeetCode patterns
const COMPANY_MAPPINGS = {
  // High frequency companies from LeetCode patterns
  'Amazon': ['Two Sum', 'Add Two Numbers', 'Longest Substring Without Repeating Characters', 'Container With Most Water', 'Two Sum II', 'Three Sum', 'Four Sum', 'Remove Nth Node From End of List', 'Valid Parentheses', 'Merge Two Sorted Lists', 'Generate Parentheses', 'Merge k Sorted Lists', 'Remove Duplicates from Sorted Array', 'Remove Element', 'Find the Index of the First Occurrence in a String', 'Next Permutation', 'Search in Rotated Sorted Array', 'Find First and Last Position of Element in Sorted Array', 'Search Insert Position', 'Combination Sum', 'Combination Sum II', 'First Missing Positive', 'Trapping Rain Water', 'Multiply Strings', 'Jump Game II', 'Permutations', 'Permutations II', 'Rotate Image', 'Group Anagrams', 'Pow(x, n)', 'N-Queens', 'Maximum Subarray', 'Spiral Matrix', 'Jump Game', 'Merge Intervals', 'Insert Interval', 'Length of Last Word', 'Spiral Matrix II', 'Rotate List', 'Unique Paths', 'Unique Paths II', 'Minimum Path Sum', 'Plus One', 'Add Binary', 'Climbing Stairs', 'Simplify Path', 'Edit Distance', 'Set Matrix Zeroes', 'Search a 2D Matrix', 'Sort Colors', 'Minimum Window Substring', 'Combinations', 'Subsets', 'Word Search', 'Remove Duplicates from Sorted Array II'],
  
  'Google': ['Two Sum', 'Add Two Numbers', 'Longest Substring Without Repeating Characters', 'Median of Two Sorted Arrays', 'Container With Most Water', 'Integer to Roman', 'Roman to Integer', 'Longest Common Prefix', 'Three Sum', 'Letter Combinations of a Phone Number', 'Four Sum', 'Valid Parentheses', 'Generate Parentheses', 'Merge k Sorted Lists', 'Next Permutation', 'Longest Valid Parentheses', 'Search in Rotated Sorted Array', 'Find First and Last Position of Element in Sorted Array', 'Valid Sudoku', 'Sudoku Solver', 'Count and Say', 'Combination Sum', 'First Missing Positive', 'Trapping Rain Water', 'Wildcard Matching', 'Jump Game II', 'Permutations', 'Rotate Image', 'Group Anagrams', 'Pow(x, n)', 'N-Queens', 'N-Queens II', 'Maximum Subarray', 'Spiral Matrix', 'Jump Game', 'Merge Intervals', 'Insert Interval', 'Permutation Sequence', 'Unique Paths', 'Minimum Path Sum', 'Valid Number', 'Plus One', 'Add Binary', 'Text Justification', 'Sqrt(x)', 'Climbing Stairs', 'Edit Distance', 'Set Matrix Zeroes', 'Search a 2D Matrix', 'Minimum Window Substring', 'Combinations', 'Subsets', 'Word Search'],
  
  'Microsoft': ['Two Sum', 'Add Two Numbers', 'Longest Substring Without Repeating Characters', 'Longest Palindromic Substring', 'Zigzag Conversion', 'Reverse Integer', 'String to Integer (atoi)', 'Container With Most Water', 'Integer to Roman', 'Roman to Integer', 'Longest Common Prefix', 'Three Sum', 'Three Sum Closest', 'Letter Combinations of a Phone Number', 'Remove Nth Node From End of List', 'Valid Parentheses', 'Merge Two Sorted Lists', 'Generate Parentheses', 'Swap Nodes in Pairs', 'Reverse Nodes in k-Group', 'Remove Duplicates from Sorted Array', 'Remove Element', 'Find the Index of the First Occurrence in a String', 'Search in Rotated Sorted Array', 'Search Insert Position', 'Valid Sudoku', 'Sudoku Solver', 'Combination Sum II', 'Jump Game II', 'Permutations', 'Permutations II', 'Rotate Image', 'N-Queens', 'Maximum Subarray', 'Spiral Matrix II', 'Rotate List', 'Unique Paths II', 'Plus One', 'Climbing Stairs', 'Simplify Path', 'Set Matrix Zeroes', 'Sort Colors', 'Combinations', 'Remove Duplicates from Sorted Array II', 'Search in Rotated Sorted Array II', 'Remove Duplicates from Sorted List II', 'Remove Duplicates from Sorted List', 'Partition List', 'Merge Sorted Array', 'Gray Code', 'Subsets II', 'Reverse Linked List II'],
  
  'Facebook': ['Two Sum', 'Add Two Numbers', 'Longest Substring Without Repeating Characters', 'Longest Palindromic Substring', 'Reverse Integer', 'Palindrome Number', 'Regular Expression Matching', 'Container With Most Water', 'Roman to Integer', 'Three Sum', 'Letter Combinations of a Phone Number', 'Remove Nth Node From End of List', 'Valid Parentheses', 'Merge Two Sorted Lists', 'Generate Parentheses', 'Reverse Nodes in k-Group', 'Remove Duplicates from Sorted Array', 'Divide Two Integers', 'Next Permutation', 'Longest Valid Parentheses', 'Find First and Last Position of Element in Sorted Array', 'Count and Say', 'Combination Sum', 'First Missing Positive', 'Trapping Rain Water', 'Multiply Strings', 'Wildcard Matching', 'Permutations', 'Group Anagrams', 'Pow(x, n)', 'Maximum Subarray', 'Spiral Matrix', 'Jump Game', 'Merge Intervals', 'Insert Interval', 'Length of Last Word', 'Unique Paths', 'Minimum Path Sum', 'Add Binary', 'Sqrt(x)', 'Climbing Stairs', 'Simplify Path', 'Edit Distance', 'Search a 2D Matrix', 'Sort Colors', 'Minimum Window Substring', 'Subsets', 'Word Search', 'Remove Duplicates from Sorted Array II', 'Search in Rotated Sorted Array II', 'Remove Duplicates from Sorted List II', 'Largest Rectangle in Histogram', 'Maximal Rectangle', 'Merge Sorted Array', 'Subsets II', 'Decode Ways', 'Restore IP Addresses', 'Binary Tree Inorder Traversal', 'Interleaving String', 'Validate Binary Search Tree']
};

// Enhanced problem descriptions with more detail
const ENHANCED_DESCRIPTIONS = {
  1: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume that each input would have exactly one solution, and you may not use the same element twice. You can return the answer in any order.",
  2: "You are given two non-empty linked lists representing two non-negative integers. The digits are stored in reverse order, and each of their nodes contains a single digit. Add the two numbers and return the sum as a linked list. You may assume the two numbers do not contain any leading zero, except the number 0 itself.",
  3: "Given a string s, find the length of the longest substring without repeating characters. A substring is a contiguous sequence of characters within a string.",
  4: "Given two sorted arrays nums1 and nums2 of size m and n respectively, return the median of the two sorted arrays. The overall run time complexity should be O(log (m+n)).",
  5: "Given a string s, return the longest palindromic substring in s. A string is palindromic if it reads the same forward and backward.",
  // Add more as needed...
};

// Algorithm to complexity mappings
const ALGORITHM_COMPLEXITIES = {
  'Array': { time: 'O(n)', space: 'O(1)' },
  'Hash Table': { time: 'O(1)', space: 'O(n)' },
  'String': { time: 'O(n)', space: 'O(1)' },
  'Dynamic Programming': { time: 'O(n²)', space: 'O(n)' },
  'Math': { time: 'O(1)', space: 'O(1)' },
  'Sorting': { time: 'O(n log n)', space: 'O(1)' },
  'Greedy': { time: 'O(n)', space: 'O(1)' },
  'Depth-First Search': { time: 'O(V + E)', space: 'O(V)' },
  'Binary Search': { time: 'O(log n)', space: 'O(1)' },
  'Tree': { time: 'O(n)', space: 'O(h)' },
  'Breadth-First Search': { time: 'O(V + E)', space: 'O(V)' },
  'Two Pointers': { time: 'O(n)', space: 'O(1)' },
  'Binary Tree': { time: 'O(n)', space: 'O(h)' },
  'Stack': { time: 'O(n)', space: 'O(n)' },
  'Backtracking': { time: 'O(2^n)', space: 'O(n)' },
  'Heap': { time: 'O(n log k)', space: 'O(k)' },
  'Graph': { time: 'O(V + E)', space: 'O(V)' },
  'Linked List': { time: 'O(n)', space: 'O(1)' },
  'Binary Search Tree': { time: 'O(log n)', space: 'O(h)' },
  'Matrix': { time: 'O(m × n)', space: 'O(1)' },
  'Bit Manipulation': { time: 'O(1)', space: 'O(1)' },
  'Design': { time: 'varies', space: 'varies' },
  'Sliding Window': { time: 'O(n)', space: 'O(1)' },
  'Union Find': { time: 'O(α(n))', space: 'O(n)' },
  'Recursion': { time: 'O(2^n)', space: 'O(n)' },
  'Trie': { time: 'O(m)', space: 'O(ALPHABET_SIZE × N × M)' },
  'Divide and Conquer': { time: 'O(n log n)', space: 'O(log n)' },
  'Simulation': { time: 'O(n)', space: 'O(1)' },
  'Monotonic Stack': { time: 'O(n)', space: 'O(n)' },
  'Queue': { time: 'O(1)', space: 'O(n)' },
  'Combinatorics': { time: 'O(n!)', space: 'O(n)' },
  'Memoization': { time: 'O(n)', space: 'O(n)' }
};

function getCompaniesForProblem(title) {
  const companies = [];
  for (const [company, problems] of Object.entries(COMPANY_MAPPINGS)) {
    if (problems.includes(title)) {
      companies.push(company);
    }
  }
  return companies.length > 0 ? companies : ['Amazon', 'Google', 'Microsoft']; // Default fallback
}

function createAlgorithmSolutions(algorithms) {
  return algorithms.map((algorithm, index) => {
    const complexity = ALGORITHM_COMPLEXITIES[algorithm] || { time: 'O(n)', space: 'O(1)' };
    const isOptimal = index === 0; // First algorithm is typically optimal
    
    let difficulty = 'Intermediate';
    if (['Array', 'String', 'Math', 'Two Pointers', 'Hash Table'].includes(algorithm)) {
      difficulty = 'Beginner';
    } else if (['Dynamic Programming', 'Backtracking', 'Graph', 'Trie'].includes(algorithm)) {
      difficulty = 'Advanced';
    }

    const descriptions = {
      'Array': 'Direct array manipulation and traversal techniques',
      'Hash Table': 'Use hash map for O(1) lookups and efficient storage',
      'String': 'String processing and manipulation techniques',
      'Dynamic Programming': 'Break down into overlapping subproblems with memoization',
      'Math': 'Mathematical approach using formulas and number theory',
      'Sorting': 'Sort the data first to enable efficient algorithms',
      'Greedy': 'Make locally optimal choices at each step',
      'Depth-First Search': 'Explore as far as possible along each branch before backtracking',
      'Binary Search': 'Divide search space in half repeatedly',
      'Tree': 'Tree traversal and manipulation techniques',
      'Breadth-First Search': 'Explore all neighbors at current depth before moving deeper',
      'Two Pointers': 'Use two pointers moving towards each other or in same direction',
      'Binary Tree': 'Binary tree specific algorithms and properties',
      'Stack': 'Use LIFO data structure for parsing and state management',
      'Backtracking': 'Try all possibilities, backtrack when dead end reached',
      'Heap': 'Use priority queue for efficient min/max operations',
      'Graph': 'Model problem as graph and use graph algorithms',
      'Linked List': 'Manipulate linked list pointers and structure',
      'Binary Search Tree': 'Leverage BST properties for efficient operations',
      'Matrix': 'Work with 2D arrays using row/column techniques',
      'Bit Manipulation': 'Use bitwise operations for efficient computation',
      'Sliding Window': 'Maintain a window of elements and slide it across data',
      'Union Find': 'Track connected components with union-find data structure',
      'Recursion': 'Break problem into smaller identical subproblems',
      'Trie': 'Use prefix tree for string search and storage',
      'Divide and Conquer': 'Divide problem into smaller parts, solve, then combine',
      'Simulation': 'Directly simulate the described process step by step',
      'Monotonic Stack': 'Maintain stack elements in monotonic order',
      'Queue': 'Use FIFO data structure for level-order processing',
      'Combinatorics': 'Use mathematical combinations and permutations',
      'Memoization': 'Cache results of expensive function calls'
    };

    return {
      algorithm,
      timeComplexity: complexity.time,
      spaceComplexity: complexity.space,
      optimal: isOptimal,
      difficulty,
      description: descriptions[algorithm] || `Apply ${algorithm} techniques to solve this problem`
    };
  });
}

function convertProblemToNewFormat(problem) {
  const companies = getCompaniesForProblem(problem.title);
  const description = ENHANCED_DESCRIPTIONS[problem.id] || problem.description || `LeetCode Problem ${problem.id}: ${problem.title}`;
  
  return {
    id: problem.id,
    title: problem.title,
    difficulty: problem.difficulty,
    description: description,
    algorithms: problem.algorithms || [],
    algorithmSolutions: createAlgorithmSolutions(problem.algorithms || []),
    topics: problem.algorithms || [], // Use algorithms as topics for now
    companies: companies,
    leetcodeUrl: problem.leetcodeUrl || `https://leetcode.com/problems/${problem.titleSlug || problem.title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-]/g, '')}/`,
    acceptanceRate: parseFloat((problem.acceptanceRate || '0%').replace('%', '')),
    likes: Math.floor(Math.random() * 50000) + 1000, // Simulated likes
    dislikes: Math.floor(Math.random() * 5000) + 100, // Simulated dislikes  
    premium: problem.isPremium || false
  };
}

// Process all problems
console.log('Processing verified LeetCode problems...');
console.log(`Found ${verifiedData.problems.length} problems in dataset`);

const processedProblems = verifiedData.problems.map(convertProblemToNewFormat);

// Calculate statistics
const stats = {
  totalProblems: processedProblems.length,
  easy: processedProblems.filter(p => p.difficulty === 'Easy').length,
  medium: processedProblems.filter(p => p.difficulty === 'Medium').length,
  hard: processedProblems.filter(p => p.difficulty === 'Hard').length,
  algorithmCount: new Set(processedProblems.flatMap(p => p.algorithms)).size
};

// Extract all unique algorithms
const allAlgorithms = Array.from(new Set(processedProblems.flatMap(p => p.algorithms))).sort();

console.log('Dataset Statistics:');
console.log(`- Total Problems: ${stats.totalProblems}`);
console.log(`- Easy: ${stats.easy} (${(stats.easy/stats.totalProblems*100).toFixed(1)}%)`);
console.log(`- Medium: ${stats.medium} (${(stats.medium/stats.totalProblems*100).toFixed(1)}%)`);
console.log(`- Hard: ${stats.hard} (${(stats.hard/stats.totalProblems*100).toFixed(1)}%)`);
console.log(`- Total Algorithms: ${stats.algorithmCount}`);

// Generate completeLeetCodeDataset.ts
const datasetTsContent = `export interface AlgorithmSolution {
  algorithm: string;
  timeComplexity: string;
  spaceComplexity: string;
  optimal: boolean;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  description: string;
}

export interface LeetCodeProblem {
  id: number;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  description: string;
  algorithms: string[];
  algorithmSolutions: AlgorithmSolution[];
  topics: string[];
  companies: string[];
  leetcodeUrl: string;
  acceptanceRate?: number;
  likes?: number;
  dislikes?: number;
  premium?: boolean;
}

export const ALL_3662_LEETCODE_PROBLEMS: LeetCodeProblem[] = ${JSON.stringify(processedProblems, null, 2)};

export const DATASET_STATS = {
  totalProblems: ${stats.totalProblems},
  easy: ${stats.easy},
  medium: ${stats.medium},
  hard: ${stats.hard},
  algorithmCount: ${stats.algorithmCount}
};

// Comprehensive algorithm mapping and classification system
export const ALGORITHM_COMPLEXITY_GUIDE = {
${Object.entries(ALGORITHM_COMPLEXITIES).map(([alg, complexity]) => `  "${alg}": {
    averageTimeComplexity: "${complexity.time}",
    averageSpaceComplexity: "${complexity.space}",
    category: "${getCategoryForAlgorithm(alg)}"
  }`).join(',\n')}
};

export const PROBLEM_PATTERN_RECOGNITION = {
  "Array Processing": {
    keyIndicators: ["array", "elements", "traverse", "iterate"],
    commonAlgorithms: ["Array", "Two Pointers", "Sliding Window"],
    examples: [1, 26, 27, 88]
  },
  "String Manipulation": {
    keyIndicators: ["string", "characters", "substring", "palindrome"],
    commonAlgorithms: ["String", "Two Pointers", "Sliding Window"],
    examples: [3, 5, 28, 76]
  },
  "Tree Problems": {
    keyIndicators: ["tree", "node", "binary tree", "traversal"],
    commonAlgorithms: ["Tree", "DFS", "BFS", "Recursion"],
    examples: [94, 98, 102, 104]
  },
  "Dynamic Programming": {
    keyIndicators: ["optimal", "subproblems", "memoization", "dp"],
    commonAlgorithms: ["Dynamic Programming", "Memoization"],
    examples: [70, 91, 139, 300]
  },
  "Graph Problems": {
    keyIndicators: ["graph", "connected", "path", "cycle"],
    commonAlgorithms: ["Graph", "DFS", "BFS", "Union Find"],
    examples: [200, 207, 399, 547]
  }
};
`;

function getCategoryForAlgorithm(algorithm) {
  const categories = {
    'Array': 'Basic Data Structures',
    'String': 'Basic Data Structures', 
    'Hash Table': 'Basic Data Structures',
    'Linked List': 'Basic Data Structures',
    'Stack': 'Basic Data Structures',
    'Queue': 'Basic Data Structures',
    'Tree': 'Tree Algorithms',
    'Binary Tree': 'Tree Algorithms',
    'Binary Search Tree': 'Tree Algorithms',
    'Trie': 'Tree Algorithms',
    'Graph': 'Graph Algorithms',
    'Union Find': 'Graph Algorithms',
    'Topological Sort': 'Graph Algorithms',
    'Dynamic Programming': 'Advanced Algorithms',
    'Backtracking': 'Advanced Algorithms',
    'Greedy': 'Advanced Algorithms',
    'Divide and Conquer': 'Advanced Algorithms',
    'Binary Search': 'Search Algorithms',
    'Depth-First Search': 'Search Algorithms',
    'Breadth-First Search': 'Search Algorithms',
    'Two Pointers': 'Search Algorithms',
    'Sliding Window': 'Search Algorithms',
    'Math': 'Mathematical',
    'Bit Manipulation': 'Mathematical',
    'Combinatorics': 'Mathematical',
    'Design': 'System Design',
    'Simulation': 'Implementation',
    'Sorting': 'Sorting & Searching',
    'Heap': 'Advanced Data Structures',
    'Monotonic Stack': 'Advanced Data Structures',
    'Recursion': 'Fundamental Techniques',
    'Memoization': 'Fundamental Techniques'
  };
  return categories[algorithm] || 'Other';
}

// Generate allLeetCodeProblems.ts  
const allProblemsContent = `// All LeetCode Algorithms - Extracted from comprehensive dataset

export const ALL_ALGORITHMS: string[] = ${JSON.stringify(allAlgorithms, null, 2)};

export const ALGORITHM_CATEGORIES = {
  'Basic Data Structures': ['Array', 'String', 'Hash Table', 'Linked List', 'Stack', 'Queue'],
  'Tree Algorithms': ['Tree', 'Binary Tree', 'Binary Search Tree', 'Trie'],
  'Graph Algorithms': ['Graph', 'Union Find', 'Topological Sort'],
  'Search Algorithms': ['Binary Search', 'Depth-First Search', 'Breadth-First Search', 'Two Pointers', 'Sliding Window'],
  'Advanced Algorithms': ['Dynamic Programming', 'Backtracking', 'Greedy', 'Divide and Conquer'],
  'Mathematical': ['Math', 'Bit Manipulation', 'Combinatorics'],
  'Advanced Data Structures': ['Heap', 'Monotonic Stack', 'Segment Tree', 'Binary Indexed Tree'],
  'Fundamental Techniques': ['Recursion', 'Memoization', 'Sorting', 'Simulation']
};

export const DIFFICULTY_DISTRIBUTION = {
  Easy: ${stats.easy},
  Medium: ${stats.medium}, 
  Hard: ${stats.hard},
  Total: ${stats.totalProblems}
};

export const COMPANY_FREQUENCY = {
  'Amazon': ${processedProblems.filter(p => p.companies.includes('Amazon')).length},
  'Google': ${processedProblems.filter(p => p.companies.includes('Google')).length},
  'Microsoft': ${processedProblems.filter(p => p.companies.includes('Microsoft')).length},
  'Facebook': ${processedProblems.filter(p => p.companies.includes('Facebook')).length}
};

// Export for backward compatibility
export default ALL_ALGORITHMS;
`;

// Write the files
const dataPath = path.join(__dirname, '../data');

fs.writeFileSync(path.join(dataPath, 'completeLeetCodeDataset.ts'), datasetTsContent, 'utf8');
console.log('✅ Generated completeLeetCodeDataset.ts');

fs.writeFileSync(path.join(dataPath, 'allLeetCodeProblems.ts'), allProblemsContent, 'utf8');
console.log('✅ Generated allLeetCodeProblems.ts');

console.log('🎉 Dataset generation complete!');
console.log(`📊 Generated ${stats.totalProblems} problems with ${stats.algorithmCount} unique algorithms`);