// All LeetCode Algorithms - Extracted from comprehensive dataset

export const ALL_ALGORITHMS: string[] = [
  "Array",
  "Backtracking",
  "Binary Search",
  "Binary Search Tree",
  "Binary Tree",
  "Bit Manipulation",
  "Breadth-First Search",
  "Bucket Sort",
  "Combinatorics",
  "Counting",
  "Depth-First Search",
  "Design",
  "Divide and Conquer",
  "Doubly-Linked List",
  "Dynamic Programming",
  "Geometry",
  "Graph",
  "Greedy",
  "Hash Table",
  "Heap",
  "Linked List",
  "Math",
  "Matrix",
  "Memoization",
  "Merge Sort",
  "Monotonic Queue",
  "Monotonic Stack",
  "Prefix Sum",
  "Queue",
  "Quickselect",
  "Radix Sort",
  "Recursion",
  "Rolling Hash",
  "Simulation",
  "Sliding Window",
  "Sorting",
  "Stack",
  "String",
  "String Matching",
  "Topological Sort",
  "Tree",
  "Trie",
  "Two Pointers",
  "Union Find"
];

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
  Easy: 892,
  Medium: 1907, 
  Hard: 863,
  Total: 3662
};

export const COMPANY_FREQUENCY = {
  'Amazon': 3623,
  'Google': 3622,
  'Microsoft': 3621,
  'Facebook': 59
};

// Export for backward compatibility
export default ALL_ALGORITHMS;
