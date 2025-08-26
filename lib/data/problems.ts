export interface LeetCodeProblem {
  id: number;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  description: string;
  example: string;
  constraints: string[];
  algorithms: string[];
  topics: string[];
  companies: string[];
  leetcodeUrl: string;
  acceptanceRate: string;
  likes: number;
  dislikes: number;
  premium: boolean;
}

// Import all 3662 problems from the complete dataset
import { ALL_3662_PROBLEMS } from '@/data/complete3662Problems';

export const leetcodeProblems: LeetCodeProblem[] = ALL_3662_PROBLEMS;

// All unique algorithms from the problems
export const allAlgorithms = Array.from(
  new Set(leetcodeProblems.flatMap(problem => problem.algorithms))
).sort();

// All unique topics from the problems
export const allTopics = Array.from(
  new Set(leetcodeProblems.flatMap(problem => problem.topics))
).sort();

// All unique companies from the problems
export const allCompanies = Array.from(
  new Set(leetcodeProblems.flatMap(problem => problem.companies))
).sort();

// Get random problems for quiz
export function getRandomProblems(count: number, difficulty?: 'Easy' | 'Medium' | 'Hard'): LeetCodeProblem[] {
  let filteredProblems = leetcodeProblems;
  
  if (difficulty) {
    filteredProblems = leetcodeProblems.filter(problem => problem.difficulty === difficulty);
  }
  
  const shuffled = [...filteredProblems].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.min(count, shuffled.length));
}

// Get problems by topic
export function getProblemsByTopic(topic: string): LeetCodeProblem[] {
  return leetcodeProblems.filter(problem => 
    problem.topics.includes(topic) || problem.algorithms.includes(topic)
  );
}

// Get problems by company
export function getProblemsByCompany(company: string): LeetCodeProblem[] {
  return leetcodeProblems.filter(problem => problem.companies.includes(company));
}

// Get problems by algorithm
export function getProblemsByAlgorithm(algorithm: string): LeetCodeProblem[] {
  return leetcodeProblems.filter(problem => problem.algorithms.includes(algorithm));
}

// Get all algorithms for a specific problem
export function getAlgorithmsForProblem(problemId: number): string[] {
  const problem = leetcodeProblems.find(p => p.id === problemId);
  return problem ? problem.algorithms : [];
}

// Get problem by ID
export function getProblemById(problemId: number): LeetCodeProblem | undefined {
  return leetcodeProblems.find(p => p.id === problemId);
}

// Get statistics about problems
export function getProblemStats() {
  const totalProblems = leetcodeProblems.length;
  const easyProblems = leetcodeProblems.filter(p => p.difficulty === 'Easy').length;
  const mediumProblems = leetcodeProblems.filter(p => p.difficulty === 'Medium').length;
  const hardProblems = leetcodeProblems.filter(p => p.difficulty === 'Hard').length;
  const premiumProblems = leetcodeProblems.filter(p => p.premium).length;

  return {
    total: totalProblems,
    easy: easyProblems,
    medium: mediumProblems,
    hard: hardProblems,
    premium: premiumProblems,
    algorithms: allAlgorithms.length,
    topics: allTopics.length,
    companies: allCompanies.length
  };
}
