export const LEETCODE_PROBLEMS = [
  {
    id: 1,
    title: "Two Sum",
    difficulty: "Easy",
    category: "Array",
    description: "Find two numbers that add up to target"
  }
];

export function getRandomProblems(count: number) {
  return LEETCODE_PROBLEMS.slice(0, count);
}