const fs = require("fs");
const path = require("path");

// Read the README file
const readmePath = path.join(__dirname, "..", "README.md");
const readmeContent = fs.readFileSync(readmePath, "utf8");

// Parse problems from README - updated regex for the actual format
const problemRegex = /(\d+)\.\s+(.+?)\n(.+?)%\n(.+?)(?=\n\d+\.|$)/gs;
const problems = [];
let match;

while ((match = problemRegex.exec(readmeContent)) !== null) {
	const [_, number, title, percentage, difficultyLine] = match;
	const difficulty = difficultyLine.includes("Easy")
		? "Easy"
		: difficultyLine.includes("Med.")
			? "Medium"
			: "Hard";

	problems.push({
		number: parseInt(number),
		title: title.trim(),
		difficulty,
		percentage: parseFloat(percentage.replace(/[^\d.]/g, "")),
	});
}

// Generate enhanced problem data
const enhancedProblems = problems.slice(0, 50).map((problem) => {
	// Generate a basic description and algorithms based on the problem number
	const algorithms = generateAlgorithms(problem.number);
	const description = generateDescription(problem.title, problem.number);

	return {
		title: problem.title,
		difficulty: problem.difficulty,
		url: `https://leetcode.com/problems/${problem.title.toLowerCase().replace(/\s+/g, "-")}/`,
		algorithms,
		description,
		editorial: {
			approach: generateApproach(problem.title, algorithms),
			timeComplexity: generateTimeComplexity(problem.difficulty),
			spaceComplexity: generateSpaceComplexity(problem.difficulty),
			solutions: [
				{
					name: `${algorithms[0]} Approach`,
					description: `Use ${algorithms[0].toLowerCase()} to solve this problem efficiently.`,
					code: generateCodeSnippet(problem.title, algorithms[0]),
				},
			],
		},
	};
});

function generateAlgorithms(problemNumber) {
	const algorithmSets = [
		["Array", "Two Pointers", "Sorting"],
		["String", "Hash Table", "Sliding Window"],
		["Tree", "DFS", "BFS"],
		["Dynamic Programming", "Memoization"],
		["Graph", "DFS", "BFS"],
		["Linked List", "Two Pointers"],
		["Stack", "Queue"],
		["Binary Search", "Array"],
		["Greedy", "Sorting"],
		["Backtracking", "Recursion"],
	];

	return algorithmSets[problemNumber % algorithmSets.length];
}

function generateDescription(title, number) {
	const descriptions = {
		"Two Sum":
			"Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
		"Add Two Numbers":
			"You are given two non-empty linked lists representing two non-negative integers. The digits are stored in reverse order, and each of their nodes contains a single digit. Add the two numbers and return the sum as a linked list.",
		"Longest Substring Without Repeating Characters":
			"Given a string s, find the length of the longest substring without repeating characters.",
		"Median of Two Sorted Arrays":
			"Given two sorted arrays nums1 and nums2 of size m and n respectively, return the median of the two sorted arrays.",
		"Longest Palindromic Substring":
			"Given a string s, return the longest palindromic substring in s.",
		"Zigzag Conversion":
			'The string "PAYPALISHIRING" is written in a zigzag pattern on a given number of rows.',
		"Reverse Integer":
			"Given a signed 32-bit integer x, return x with its digits reversed.",
		"String to Integer (atoi)":
			"Implement the myAtoi(string s) function, which converts a string to a 32-bit signed integer.",
		"Palindrome Number":
			"Given an integer x, return true if x is a palindrome, and false otherwise.",
		"Regular Expression Matching":
			"Given an input string s and a pattern p, implement regular expression matching with support for '.' and '*'.",
	};

	return (
		descriptions[title] ||
		`Solve the problem: ${title}. This is problem number ${number} on LeetCode.`
	);
}

function generateApproach(title, algorithms) {
	return `Use ${algorithms.join(", ")} to solve this problem. The key insight is to apply the appropriate algorithm based on the problem constraints and requirements.`;
}

function generateTimeComplexity(difficulty) {
	const complexities = {
		Easy: "O(n)",
		Medium: "O(n log n)",
		Hard: "O(n²)",
	};
	return complexities[difficulty] || "O(n)";
}

function generateSpaceComplexity(difficulty) {
	const complexities = {
		Easy: "O(1)",
		Medium: "O(n)",
		Hard: "O(n)",
	};
	return complexities[difficulty] || "O(1)";
}

function generateCodeSnippet(title, algorithm) {
	const snippets = {
		Array: `// Array solution
const solve = (nums) => {
  // Implementation using array manipulation
  return result;
};`,
		"Hash Table": `// Hash table solution
const solve = (nums) => {
  const map = new Map();
  // Implementation using hash table
  return result;
};`,
		"Two Pointers": `// Two pointers solution
const solve = (nums) => {
  let left = 0, right = nums.length - 1;
  // Implementation using two pointers
  return result;
};`,
		"Dynamic Programming": `// Dynamic programming solution
const solve = (nums) => {
  const dp = new Array(nums.length).fill(0);
  // Implementation using dynamic programming
  return result;
};`,
		Tree: `// Tree traversal solution
const solve = (root) => {
  if (!root) return null;
  // Implementation using tree traversal
  return result;
};`,
	};

	return (
		snippets[algorithm] ||
		`// ${algorithm} solution
const solve = (input) => {
  // Implementation using ${algorithm.toLowerCase()}
  return result;
};`
	);
}

// Write the enhanced problems to a new file
const outputPath = path.join(
	__dirname,
	"..",
	"app",
	"lib",
	"extended-problems.ts",
);
const outputContent = `// Auto-generated from README.md
export const extendedProblems = ${JSON.stringify(enhancedProblems, null, 2)};

export const totalProblems = ${problems.length};
export const easyProblems = ${problems.filter((p) => p.difficulty === "Easy").length};
export const mediumProblems = ${problems.filter((p) => p.difficulty === "Medium").length};
export const hardProblems = ${problems.filter((p) => p.difficulty === "Hard").length};
`;

fs.writeFileSync(outputPath, outputContent);

console.log(`Generated ${enhancedProblems.length} enhanced problems`);
console.log(`Total problems in README: ${problems.length}`);
console.log(`Easy: ${problems.filter((p) => p.difficulty === "Easy").length}`);
console.log(
	`Medium: ${problems.filter((p) => p.difficulty === "Medium").length}`,
);
console.log(`Hard: ${problems.filter((p) => p.difficulty === "Hard").length}`);
