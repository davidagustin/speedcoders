// Master index for all problem batches
// This file provides easy access to problems organized by ranges

import { batch3Problems } from "./batch3";
import { batch4Problems } from "./batch4";
import { batch5Problems } from "./batch5";
import { comprehensiveProblems } from "./comprehensive-problems";
import { systemDesignProblems } from "./system-design-problems";

// Problem ranges:
// - comprehensiveProblems: Problems 1-50 (core problems)
// - batch3Problems: Problems 1001-1500
// - batch4Problems: Problems 1501-2000
// - batch5Problems: Problems 2001-2500

export const allProblems = [
	...comprehensiveProblems,
	...batch3Problems,
	...batch4Problems,
	...batch5Problems,
];

export const allSystemDesignProblems = systemDesignProblems;

// Helper functions to get problems by range
export const getProblemsByRange = (startId, endId) => {
	return allProblems.filter(
		(problem) => problem.id >= startId && problem.id <= endId,
	);
};

export const getProblemsByDifficulty = (difficulty) => {
	return allProblems.filter((problem) => problem.difficulty === difficulty);
};

export const getProblemsByCategory = (category) => {
	return allProblems.filter((problem) => problem.category === category);
};

export const getProblemsByAlgorithm = (algorithm) => {
	return allProblems.filter((problem) =>
		problem.algorithms.some((alg) =>
			alg.toLowerCase().includes(algorithm.toLowerCase()),
		),
	);
};

// Get problems by batch
export const getBatch1Problems = () => comprehensiveProblems; // Problems 1-50
export const getBatch2Problems = () => getProblemsByRange(51, 1000); // Would need to be populated
export const getBatch3Problems = () => batch3Problems; // Problems 1001-1500
export const getBatch4Problems = () => batch4Problems; // Problems 1501-2000
export const getBatch5Problems = () => batch5Problems; // Problems 2001-2500

// Statistics
export const getProblemStats = () => {
	const totalProblems = allProblems.length;
	const easyProblems = allProblems.filter(
		(p) => p.difficulty === "Easy",
	).length;
	const mediumProblems = allProblems.filter(
		(p) => p.difficulty === "Medium",
	).length;
	const hardProblems = allProblems.filter(
		(p) => p.difficulty === "Hard",
	).length;

	const categories = [...new Set(allProblems.map((p) => p.category))];
	const algorithms = [...new Set(allProblems.flatMap((p) => p.algorithms))];

	return {
		total: totalProblems,
		byDifficulty: {
			easy: easyProblems,
			medium: mediumProblems,
			hard: hardProblems,
		},
		categories: categories.length,
		algorithms: algorithms.length,
		categoryList: categories,
		algorithmList: algorithms,
	};
};

// Search functionality
export const searchProblems = (query) => {
	const lowerQuery = query.toLowerCase();
	return allProblems.filter(
		(problem) =>
			problem.title.toLowerCase().includes(lowerQuery) ||
			problem.description.toLowerCase().includes(lowerQuery) ||
			problem.algorithms.some((alg) =>
				alg.toLowerCase().includes(lowerQuery),
			) ||
			problem.category.toLowerCase().includes(lowerQuery) ||
			problem.tags.some((tag) => tag.toLowerCase().includes(lowerQuery)),
	);
};

// Get random problems for practice
export const getRandomProblems = (count = 10, difficulty = null) => {
	let filteredProblems = allProblems;
	if (difficulty) {
		filteredProblems = allProblems.filter((p) => p.difficulty === difficulty);
	}

	const shuffled = [...filteredProblems].sort(() => 0.5 - Math.random());
	return shuffled.slice(0, count);
};

// Get problems for specific learning path
export const getLearningPathProblems = (path) => {
	const pathConfigs = {
		arrays: ["Array", "Two Pointers", "Sliding Window"],
		strings: ["String", "Hash Table"],
		trees: ["Tree", "DFS", "BFS"],
		graphs: ["Graph", "DFS", "BFS"],
		"dynamic-programming": ["Dynamic Programming"],
		greedy: ["Greedy"],
		"binary-search": ["Binary Search"],
		backtracking: ["Backtracking"],
		"stack-queue": ["Stack", "Queue"],
		"linked-list": ["Linked List"],
		math: ["Math", "Bit Manipulation"],
		database: ["Database", "SQL"],
	};

	const targetAlgorithms = pathConfigs[path] || [];
	return allProblems.filter((problem) =>
		targetAlgorithms.some((alg) =>
			problem.algorithms.some((problemAlg) =>
				problemAlg.toLowerCase().includes(alg.toLowerCase()),
			),
		),
	);
};

export default {
	allProblems,
	getProblemsByRange,
	getProblemsByDifficulty,
	getProblemsByCategory,
	getProblemsByAlgorithm,
	getBatch1Problems,
	getBatch2Problems,
	getBatch3Problems,
	getBatch4Problems,
	getBatch5Problems,
	getProblemStats,
	searchProblems,
	getRandomProblems,
	getLearningPathProblems,
};
