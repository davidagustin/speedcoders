export interface LeetCodeProblem {
  id: number;
  title: string;
  slug: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: string[];
  algorithms: string[];
  dataStructures: string[];
  techniques: string[];
  timeComplexity: string;
  spaceComplexity: string;
}

export const leetcodeProblems: LeetCodeProblem[] = [
  {
    id: 1,
    title: "Two Sum",
    slug: "two-sum",
    difficulty: "Easy",
    category: ["Array", "Hash Table"],
    algorithms: ["Brute Force", "Hash Map", "Two Pointers"],
    dataStructures: ["Array", "Hash Table"],
    techniques: ["Complement Search", "Index Tracking"],
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)"
  },
  {
    id: 2,
    title: "Add Two Numbers",
    slug: "add-two-numbers",
    difficulty: "Medium",
    category: ["Linked List", "Math"],
    algorithms: ["Elementary Math", "Linked List Traversal"],
    dataStructures: ["Linked List"],
    techniques: ["Carry Propagation", "Dummy Node"],
    timeComplexity: "O(max(m,n))",
    spaceComplexity: "O(max(m,n))"
  },
  {
    id: 3,
    title: "Longest Substring Without Repeating Characters",
    slug: "longest-substring-without-repeating-characters",
    difficulty: "Medium",
    category: ["String", "Sliding Window"],
    algorithms: ["Sliding Window", "Two Pointers"],
    dataStructures: ["Hash Set", "Hash Map"],
    techniques: ["Window Expansion", "Window Contraction"],
    timeComplexity: "O(n)",
    spaceComplexity: "O(min(m,n))"
  }
];

export function getAllProblems(): LeetCodeProblem[] {
  return leetcodeProblems;
}

export function getRandomProblems(count: number, difficulty?: string): LeetCodeProblem[] {
  let filtered = difficulty 
    ? leetcodeProblems.filter(p => p.difficulty === difficulty)
    : leetcodeProblems;
  
  const shuffled = [...filtered].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

export function getProblemsByCategory(category: string): LeetCodeProblem[] {
  return leetcodeProblems.filter(p => p.category.includes(category));
}

export function getAllCategories(): string[] {
  const categories = new Set<string>();
  leetcodeProblems.forEach(p => p.category.forEach(c => categories.add(c)));
  return Array.from(categories).sort();
}

export function getAllAlgorithms(): string[] {
  const algorithms = new Set<string>();
  leetcodeProblems.forEach(p => p.algorithms.forEach(a => algorithms.add(a)));
  return Array.from(algorithms).sort();
}

export function filterProblems(filters: {
  difficulty?: string[];
  categories?: string[];
  algorithms?: string[];
  limit?: number;
}): LeetCodeProblem[] {
  let filtered = leetcodeProblems;
  
  if (filters.difficulty && filters.difficulty.length > 0) {
    filtered = filtered.filter(p => filters.difficulty!.includes(p.difficulty));
  }
  
  if (filters.categories && filters.categories.length > 0) {
    filtered = filtered.filter(p => 
      p.category.some(cat => filters.categories!.includes(cat))
    );
  }
  
  if (filters.algorithms && filters.algorithms.length > 0) {
    filtered = filtered.filter(p =>
      p.algorithms.some(algo => filters.algorithms!.includes(algo))
    );
  }
  
  if (filters.limit) {
    filtered = filtered.slice(0, filters.limit);
  }
  
  return filtered;
}