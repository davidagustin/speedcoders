// Export all 3662 real LeetCode problems for the quiz
const fs = require('fs');
const path = require('path');

// Load the verified problems data
const verifiedProblemsPath = path.join(__dirname, 'verified-leetcode-problems.json');
const verifiedData = JSON.parse(fs.readFileSync(verifiedProblemsPath, 'utf8'));
const allProblems = verifiedData.problems;

// All available algorithms from the real problems
export const ALGORITHMS = [
  'Array',
  'Hash Table',
  'String',
  'Dynamic Programming',
  'Math',
  'Sorting',
  'Greedy',
  'Depth-First Search',
  'Binary Search',
  'Tree',
  'Breadth-First Search',
  'Two Pointers',
  'Binary Tree',
  'Stack',
  'Backtracking',
  'Heap',
  'Graph',
  'Linked List',
  'Binary Search Tree',
  'Matrix',
  'Bit Manipulation',
  'Design',
  'Sliding Window',
  'Union Find',
  'Recursion',
  'Trie',
  'Divide and Conquer',
  'Simulation',
  'Monotonic Stack',
  'Queue',
  'Combinatorics',
  'Memoization',
  'Geometry',
  'Game Theory',
  'Interactive',
  'Data Stream',
  'Rolling Hash',
  'Shortest Path',
  'Topological Sort',
  'Minimum Spanning Tree',
  'Bipartite Graph',
  'Strongly Connected Component',
  'Eulerian Circuit',
  'Randomized',
  'Reservoir Sampling',
  'Rejection Sampling',
  'Suffix Array',
  'Concurrency',
  'Doubly-Linked List',
  'Counting',
  'Iterator',
  'Merge Sort',
  'Quickselect',
  'Radix Sort',
  'Bucket Sort',
  'Prefix Sum',
  'Binary Indexed Tree',
  'Segment Tree',
  'Line Sweep',
  'Ordered Set'
];

// Convert problems to quiz format
export const ALL_QUIZ_PROBLEMS = allProblems.map(problem => ({
  id: problem.id,
  title: problem.title,
  difficulty: problem.difficulty,
  algorithms: problem.algorithms,
  description: `Problem ${problem.id}: ${problem.title}. 
    
This is a ${problem.difficulty} level problem from LeetCode.
    
Acceptance Rate: ${problem.acceptanceRate || 'N/A'}
${problem.isPremium ? '(Premium Problem)' : '(Free Problem)'}
    
Challenge: Select all algorithms that can be used to solve this problem efficiently.`,
  leetcodeUrl: problem.leetcodeUrl || `https://leetcode.com/problems/${problem.titleSlug || ''}/`,
  premium: problem.isPremium || false,
  acceptanceRate: problem.acceptanceRate,
  totalAccepted: problem.totalAccepted,
  totalSubmitted: problem.totalSubmitted
}));

// Export problems by difficulty
export const EASY_PROBLEMS = ALL_QUIZ_PROBLEMS.filter(p => p.difficulty === 'Easy');
export const MEDIUM_PROBLEMS = ALL_QUIZ_PROBLEMS.filter(p => p.difficulty === 'Medium');
export const HARD_PROBLEMS = ALL_QUIZ_PROBLEMS.filter(p => p.difficulty === 'Hard');

// Export free problems only (for users without premium)
export const FREE_PROBLEMS = ALL_QUIZ_PROBLEMS.filter(p => !p.premium);
export const PREMIUM_PROBLEMS = ALL_QUIZ_PROBLEMS.filter(p => p.premium);

// Statistics
export const PROBLEM_STATS = {
  total: ALL_QUIZ_PROBLEMS.length,
  easy: EASY_PROBLEMS.length,
  medium: MEDIUM_PROBLEMS.length,
  hard: HARD_PROBLEMS.length,
  free: FREE_PROBLEMS.length,
  premium: PREMIUM_PROBLEMS.length,
  algorithms: ALGORITHMS.length
};

// Utility functions for quiz
export function getRandomProblems(count = 10, difficulty = null, includePremium = false) {
  let problemPool;
  
  if (difficulty) {
    problemPool = ALL_QUIZ_PROBLEMS.filter(p => p.difficulty === difficulty);
  } else {
    problemPool = ALL_QUIZ_PROBLEMS;
  }
  
  // Filter out premium problems if not included
  if (!includePremium) {
    problemPool = problemPool.filter(p => !p.premium);
  }
  
  // Shuffle and select
  const shuffled = [...problemPool].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.min(count, shuffled.length));
}

export function getProblemsByAlgorithm(algorithm) {
  return ALL_QUIZ_PROBLEMS.filter(problem => 
    problem.algorithms.some(alg => 
      alg.toLowerCase().includes(algorithm.toLowerCase())
    )
  );
}

export function searchProblems(query, includePremium = false) {
  const searchTerm = query.toLowerCase();
  let results = ALL_QUIZ_PROBLEMS.filter(problem => 
    problem.title.toLowerCase().includes(searchTerm) ||
    problem.description.toLowerCase().includes(searchTerm) ||
    problem.algorithms.some(alg => alg.toLowerCase().includes(searchTerm))
  );
  
  if (!includePremium) {
    results = results.filter(p => !p.premium);
  }
  
  return results;
}

export function getProblemById(id) {
  return ALL_QUIZ_PROBLEMS.find(problem => problem.id === parseInt(id));
}

export function getProblemsInRange(startId, endId, includePremium = false) {
  let results = ALL_QUIZ_PROBLEMS.filter(problem => 
    problem.id >= startId && problem.id <= endId
  );
  
  if (!includePremium) {
    results = results.filter(p => !p.premium);
  }
  
  return results;
}

// Default export for the complete dataset
export default ALL_QUIZ_PROBLEMS;