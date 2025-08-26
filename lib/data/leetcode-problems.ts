import { ALL_3662_PROBLEMS, LeetCodeProblem } from '../../data/all3662Problems';

export interface Algorithm {
  name: string;
  description: string;
  timeComplexity: string;
  spaceComplexity: string;
  approach: string;
  isOptimal: boolean;
}

export interface QuizProblem extends LeetCodeProblem {
  algorithms: Algorithm[];
}

// Export all problems
export const leetcodeProblems: QuizProblem[] = ALL_3662_PROBLEMS.map(problem => ({
  ...problem,
  algorithms: problem.algorithms.map(algName => ({
    name: algName,
    description: `Algorithm approach for ${problem.title}`,
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    approach: `Standard approach using ${algName}`,
    isOptimal: true
  }))
}));

export const allAlgorithms = [
  "Hash Table",
  "Two Pointers",
  "Sliding Window",
  "Binary Search",
  "Dynamic Programming",
  "Greedy",
  "Backtracking",
  "Depth-First Search",
  "Breadth-First Search",
  "Tree Traversal",
  "Linked List",
  "Stack",
  "Queue",
  "Heap",
  "Graph",
  "Union Find",
  "Trie",
  "Bit Manipulation",
  "Math",
  "Sorting",
  "Recursion",
  "Iteration",
  "Divide and Conquer",
  "Kadane's Algorithm",
  "Floyd's Cycle Detection",
  "Morris Traversal",
  "Expand Around Center",
  "Manacher's Algorithm",
  "Brute Force",
  "String",
  "Array",
  "Matrix"
];

export const getRandomProblem = (): QuizProblem => {
  return leetcodeProblems[Math.floor(Math.random() * leetcodeProblems.length)];
};

export const getProblemsByDifficulty = (difficulty: 'Easy' | 'Medium' | 'Hard'): QuizProblem[] => {
  return leetcodeProblems.filter(problem => problem.difficulty === difficulty);
};

export const getProblemsByAlgorithm = (algorithmName: string): QuizProblem[] => {
  return leetcodeProblems.filter(problem => 
    problem.algorithms.some(alg => alg.name === algorithmName)
  );
};

export const getRandomProblems = (count: number): QuizProblem[] => {
  const shuffled = [...leetcodeProblems].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

export const getProblemsByCategory = (category: string): QuizProblem[] => {
  return leetcodeProblems.filter(problem => 
    problem.categories.includes(category)
  );
};

export const getProblemsByCompany = (company: string): QuizProblem[] => {
  return leetcodeProblems.filter(problem => 
    problem.companies.includes(company)
  );
};
