// Import all batch files

import { batch3Problems } from "./batch3";
import { batch4Problems } from "./batch4";
import { batch5Problems } from "./batch5";
import { comprehensiveProblems } from "./comprehensive-problems";

// Combine all problems into a single array
export const allProblems = [
	...comprehensiveProblems, // Problems 1-1000 (batch1 and batch2)
	...batch3Problems, // Problems 1001-1500
	...batch4Problems, // Problems 1501-2000
	...batch5Problems, // Problems 2001-2500
];

// Export individual batches for specific use cases
export { comprehensiveProblems as batch1And2Problems };
export { batch3Problems };
export { batch4Problems };
export { batch5Problems };

// Helper function to get problems by range
export const getProblemsByRange = (startId, endId) => {
	return allProblems.filter(
		(problem) => problem.id >= startId && problem.id <= endId,
	);
};

// Helper function to get problems by difficulty
export const getProblemsByDifficulty = (difficulty) => {
	return allProblems.filter(
		(problem) => problem.difficulty.toLowerCase() === difficulty.toLowerCase(),
	);
};

// Helper function to get problems by category
export const getProblemsByCategory = (category) => {
	return allProblems.filter(
		(problem) => problem.category.toLowerCase() === category.toLowerCase(),
	);
};

// Helper function to get problems by algorithm
export const getProblemsByAlgorithm = (algorithm) => {
	return allProblems.filter((problem) =>
		problem.algorithms.some((alg) =>
			alg.toLowerCase().includes(algorithm.toLowerCase()),
		),
	);
};

// Statistics about the problem database
export const problemStats = {
	totalProblems: allProblems.length,
	byDifficulty: {
		Easy: allProblems.filter((p) => p.difficulty === "Easy").length,
		Medium: allProblems.filter((p) => p.difficulty === "Medium").length,
		Hard: allProblems.filter((p) => p.difficulty === "Hard").length,
	},
	byCategory: allProblems.reduce((acc, problem) => {
		acc[problem.category] = (acc[problem.category] || 0) + 1;
		return acc;
	}, {}),
	byAlgorithm: allProblems.reduce((acc, problem) => {
		problem.algorithms.forEach((algorithm) => {
			acc[algorithm] = (acc[algorithm] || 0) + 1;
		});
		return acc;
	}, {}),
	ranges: {
		"1-1000": comprehensiveProblems.length,
		"1001-1500": batch3Problems.length,
		"1501-2000": batch4Problems.length,
		"2001-2500": batch5Problems.length,
	},
};

// Search function
export const searchProblems = (query) => {
	const searchTerm = query.toLowerCase();
	return allProblems.filter(
		(problem) =>
			problem.title.toLowerCase().includes(searchTerm) ||
			problem.description.toLowerCase().includes(searchTerm) ||
			problem.algorithms.some((alg) =>
				alg.toLowerCase().includes(searchTerm),
			) ||
			problem.category.toLowerCase().includes(searchTerm) ||
			problem.tags.some((tag) => tag.toLowerCase().includes(searchTerm)),
	);
};

// Get random problems for practice
export const getRandomProblems = (
	count = 10,
	difficulty = null,
	category = null,
) => {
	let filteredProblems = allProblems;

	if (difficulty) {
		filteredProblems = filteredProblems.filter(
			(p) => p.difficulty === difficulty,
		);
	}

	if (category) {
		filteredProblems = filteredProblems.filter((p) => p.category === category);
	}

	const shuffled = [...filteredProblems].sort(() => 0.5 - Math.random());
	return shuffled.slice(0, count);
};

// Get problems for a specific quiz configuration
export const getQuizProblems = (config) => {
	const {
		difficulty,
		category,
		algorithm,
		count = 10,
		problemIds = null,
	} = config;

	let filteredProblems = allProblems;

	if (problemIds) {
		filteredProblems = filteredProblems.filter((p) =>
			problemIds.includes(p.id),
		);
	} else {
		if (difficulty) {
			filteredProblems = filteredProblems.filter(
				(p) => p.difficulty === difficulty,
			);
		}

		if (category) {
			filteredProblems = filteredProblems.filter(
				(p) => p.category === category,
			);
		}

		if (algorithm) {
			filteredProblems = filteredProblems.filter((p) =>
				p.algorithms.some((alg) =>
					alg.toLowerCase().includes(algorithm.toLowerCase()),
				),
			);
		}
	}

	// Shuffle and return the requested number of problems
	const shuffled = [...filteredProblems].sort(() => 0.5 - Math.random());
	return shuffled.slice(0, count);
};

// Export the main interface
export default {
	allProblems,
	batch1And2Problems: comprehensiveProblems,
	batch3Problems,
	batch4Problems,
	batch5Problems,
	getProblemsByRange,
	getProblemsByDifficulty,
	getProblemsByCategory,
	getProblemsByAlgorithm,
	searchProblems,
	getRandomProblems,
	getQuizProblems,
	problemStats,
};
