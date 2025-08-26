export interface Problem {
  id: number;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  description: string;
  correctAlgorithms: string[];
  allAlgorithms: string[];
  example: string;
  constraints: string[];
  acceptanceRate?: string;
  likes?: number;
  dislikes?: number;
  premium?: boolean;
  companies?: string[];
  leetcodeUrl?: string;
}

// Import the comprehensive dataset from master index
import { UNIQUE_CURATED_PROBLEMS, ALL_COMPREHENSIVE_ALGORITHMS } from '../data/masterProblemIndex';
import { ALL_ALGORITHMS } from '../data/allLeetCodeProblems';

// Convert to quiz format
function convertToQuizFormat(problem: any): Problem {
  return {
    id: problem.id,
    title: problem.title,
    difficulty: problem.difficulty,
    description: problem.description,
    correctAlgorithms: problem.algorithms?.slice(0, 3) || ['Array', 'Hash Table'],
    allAlgorithms: [...(problem.algorithms || []), ...getRelatedAlgorithms(problem.algorithms || [])].slice(0, 12),
    example: problem.example || generateExample(problem.id, problem.title),
    constraints: problem.constraints || generateConstraints(problem.difficulty),
    acceptanceRate: problem.acceptanceRate,
    likes: problem.likes,
    dislikes: problem.dislikes,
    premium: problem.premium || problem.isPremium,
    companies: problem.companies,
    leetcodeUrl: problem.leetcodeUrl
  };
}

// Get related algorithms for quiz options
function getRelatedAlgorithms(correctAlgorithms: string[]): string[] {
  const algorithmRelations = {
    'Hash Table': ['Array', 'String', 'Two Pointers'],
    'Array': ['Hash Table', 'Two Pointers', 'Sliding Window'],
    'String': ['Hash Table', 'Two Pointers', 'Sliding Window'],
    'Two Pointers': ['Array', 'String', 'Sliding Window'],
    'Dynamic Programming': ['Recursion', 'Memoization', 'Math'],
    'Tree': ['Recursion', 'Depth-First Search', 'Breadth-First Search'],
    'Graph': ['Depth-First Search', 'Breadth-First Search', 'Union Find']
  };

  const related = new Set<string>();
  correctAlgorithms.forEach(algo => {
    const relations = algorithmRelations[algo] || [];
    relations.forEach(rel => related.add(rel));
  });

  // Add common distractors
  const commonAlgos = ['Greedy', 'Sorting', 'Math', 'Bit Manipulation'];
  commonAlgos.forEach(algo => {
    if (Math.random() < 0.3) related.add(algo);
  });

  return Array.from(related).filter(algo => !correctAlgorithms.includes(algo));
}

function generateExample(id: number, title: string): string {
  return `Input: [sample input for problem ${id}]\nOutput: [expected output]\nExplanation: [solution approach for ${title}]`;
}

function generateConstraints(difficulty: string): string[] {
  return [
    `1 ≤ n ≤ ${difficulty === 'Easy' ? '10³' : difficulty === 'Medium' ? '10⁴' : '10⁵'}`,
    'Time complexity: optimize for the given constraints',
    'Space complexity: consider trade-offs'
  ];
}

// Convert master dataset to quiz format
export const problems: Problem[] = UNIQUE_CURATED_PROBLEMS.map(convertToQuizFormat);

// Use comprehensive algorithm list
export const allAlgorithms = ALL_ALGORITHMS;