import { type EditorialProblem, editorialProblems } from "./editorial-problems";

export interface UserProfile {
	id: string;
	solvedProblems: string[];
	weakCategories: string[];
	strongCategories: string[];
	preferredDifficulty: "Easy" | "Medium" | "Hard";
	averageCompletionTime: number;
	algorithmMastery: Map<string, number>; // 0-100 proficiency
	learningGoals: string[];
	recentActivity: ActivityEntry[];
}

export interface ActivityEntry {
	problemId: string;
	difficulty: string;
	category: string;
	score: number;
	completionTime: number;
	algorithmsUsed: string[];
	date: Date;
	mistakes: string[];
}

export interface Recommendation {
	problem: EditorialProblem;
	reason: string;
	priority: number; // 0-100
	estimatedDifficulty: number; // 0-100
	learningObjectives: string[];
	prerequisites: string[];
	relatedConcepts: string[];
	adaptiveHints: string[];
}

export interface LearningPath {
	id: string;
	name: string;
	description: string;
	problems: EditorialProblem[];
	estimatedDuration: number; // in hours
	difficulty: "Beginner" | "Intermediate" | "Advanced";
	prerequisites: string[];
	learningObjectives: string[];
	milestones: Milestone[];
}

export interface Milestone {
	problemIndex: number;
	title: string;
	description: string;
	requiredMastery: number;
}

export class AIRecommendationEngine {
	private userProfiles: Map<string, UserProfile> = new Map();
	private learningPaths: LearningPath[] = [];

	constructor() {
		this.initializeLearningPaths();
	}

	// Main recommendation function
	getRecommendations(userId: string, count: number = 5): Recommendation[] {
		const profile = this.getUserProfile(userId);
		if (!profile) {
			return this.getDefaultRecommendations(count);
		}

		const recommendations: Recommendation[] = [];

		// Get recommendations based on different strategies
		const weaknessRecommendations = this.getWeaknessBasedRecommendations(
			profile,
			Math.ceil(count * 0.4),
		);
		const progressionRecommendations = this.getProgressionBasedRecommendations(
			profile,
			Math.ceil(count * 0.3),
		);
		const similarityRecommendations = this.getSimilarityBasedRecommendations(
			profile,
			Math.ceil(count * 0.3),
		);

		recommendations.push(...weaknessRecommendations);
		recommendations.push(...progressionRecommendations);
		recommendations.push(...similarityRecommendations);

		// Sort by priority and remove duplicates
		const uniqueRecommendations =
			this.deduplicateRecommendations(recommendations);
		return uniqueRecommendations
			.sort((a, b) => b.priority - a.priority)
			.slice(0, count);
	}

	// Weakness-based recommendations
	private getWeaknessBasedRecommendations(
		profile: UserProfile,
		count: number,
	): Recommendation[] {
		const recommendations: Recommendation[] = [];

		for (const weakCategory of profile.weakCategories.slice(0, 2)) {
			const categoryProblems = editorialProblems.filter(
				(p) =>
					p.category === weakCategory &&
					!profile.solvedProblems.includes(p.title) &&
					this.isDifficultyAppropriate(p, profile),
			);

			const sortedProblems = categoryProblems.sort(
				(a, b) =>
					this.getDifficultyScore(a.difficulty) -
					this.getDifficultyScore(b.difficulty),
			);

			for (const problem of sortedProblems.slice(
				0,
				Math.ceil(count / profile.weakCategories.length),
			)) {
				recommendations.push({
					problem,
					reason: `Strengthen your ${weakCategory} skills - this is identified as a weak area`,
					priority: 90 + this.calculateCategoryUrgency(profile, weakCategory),
					estimatedDifficulty: this.estimateDifficultyForUser(problem, profile),
					learningObjectives: [
						`Master ${weakCategory} concepts`,
						`Improve algorithm selection`,
					],
					prerequisites: this.getPrerequisites(problem),
					relatedConcepts: this.getRelatedConcepts(problem),
					adaptiveHints: this.generateAdaptiveHints(problem, profile),
				});
			}
		}

		return recommendations;
	}

	// Progression-based recommendations
	private getProgressionBasedRecommendations(
		profile: UserProfile,
		count: number,
	): Recommendation[] {
		const recommendations: Recommendation[] = [];
		const nextDifficulty = this.getNextDifficulty(profile);

		const progressionProblems = editorialProblems.filter(
			(p) =>
				p.difficulty === nextDifficulty &&
				!profile.solvedProblems.includes(p.title) &&
				this.hasPrerequisiteKnowledge(p, profile),
		);

		// Prioritize problems that build on recent successes
		const recentCategories = this.getRecentSuccessfulCategories(profile);
		const prioritizedProblems = progressionProblems.sort((a, b) => {
			const aInRecent = recentCategories.includes(a.category) ? 10 : 0;
			const bInRecent = recentCategories.includes(b.category) ? 10 : 0;
			return bInRecent - aInRecent;
		});

		for (const problem of prioritizedProblems.slice(0, count)) {
			recommendations.push({
				problem,
				reason: `Natural progression to ${nextDifficulty} level based on your recent performance`,
				priority: 80 + this.calculateProgressionScore(problem, profile),
				estimatedDifficulty: this.estimateDifficultyForUser(problem, profile),
				learningObjectives: [
					`Progress to ${nextDifficulty} difficulty`,
					`Build on existing strengths`,
				],
				prerequisites: this.getPrerequisites(problem),
				relatedConcepts: this.getRelatedConcepts(problem),
				adaptiveHints: this.generateAdaptiveHints(problem, profile),
			});
		}

		return recommendations;
	}

	// Similarity-based recommendations
	private getSimilarityBasedRecommendations(
		profile: UserProfile,
		count: number,
	): Recommendation[] {
		const recommendations: Recommendation[] = [];

		// Find problems similar to recently solved ones
		const recentSolved = profile.recentActivity
			.filter((a) => a.score > 70)
			.slice(0, 3)
			.map((a) => editorialProblems.find((p) => p.title === a.problemId))
			.filter((p) => p !== undefined) as EditorialProblem[];

		for (const solvedProblem of recentSolved) {
			const similarProblems = this.findSimilarProblems(solvedProblem, profile);

			for (const problem of similarProblems.slice(
				0,
				Math.ceil(count / recentSolved.length),
			)) {
				recommendations.push({
					problem,
					reason: `Similar to "${solvedProblem.title}" which you solved successfully`,
					priority: 70 + this.calculateSimilarityScore(problem, solvedProblem),
					estimatedDifficulty: this.estimateDifficultyForUser(problem, profile),
					learningObjectives: [
						`Apply similar patterns`,
						`Reinforce successful strategies`,
					],
					prerequisites: this.getPrerequisites(problem),
					relatedConcepts: this.getRelatedConcepts(problem),
					adaptiveHints: this.generateAdaptiveHints(problem, profile),
				});
			}
		}

		return recommendations;
	}

	// Learning path recommendations
	getLearningPathRecommendations(userId: string): LearningPath[] {
		const profile = this.getUserProfile(userId);
		if (!profile) {
			return this.learningPaths.filter(
				(path) => path.difficulty === "Beginner",
			);
		}

		return this.learningPaths
			.filter((path) => {
				// Check if user has prerequisites
				const hasPrereqs = path.prerequisites.every(
					(prereq) =>
						profile.strongCategories.includes(prereq) ||
						(profile.algorithmMastery.get(prereq) ?? 0) > 60,
				);

				// Check appropriate difficulty
				const pathDifficulty = this.mapDifficultyToProfile(path.difficulty);
				const userLevel = this.getUserLevel(profile);

				return hasPrereqs && Math.abs(pathDifficulty - userLevel) <= 1;
			})
			.sort(
				(a, b) =>
					this.calculatePathRelevance(b, profile) -
					this.calculatePathRelevance(a, profile),
			);
	}

	// Adaptive difficulty adjustment
	adaptDifficulty(
		userId: string,
		problemId: string,
		performance: number,
	): void {
		const profile = this.getUserProfile(userId);
		if (!profile) return;

		const problem = editorialProblems.find((p) => p.title === problemId);
		if (!problem) return;

		// Update user profile based on performance
		if (performance > 80) {
			// Strong performance - can handle harder problems
			this.updateCategoryStrength(profile, problem.category, 5);
			if (profile.preferredDifficulty === "Easy" && performance > 90) {
				profile.preferredDifficulty = "Medium";
			} else if (profile.preferredDifficulty === "Medium" && performance > 95) {
				profile.preferredDifficulty = "Hard";
			}
		} else if (performance < 40) {
			// Weak performance - add to weak categories
			if (!profile.weakCategories.includes(problem.category)) {
				profile.weakCategories.push(problem.category);
			}
			this.updateCategoryStrength(profile, problem.category, -3);
		}

		// Update algorithm mastery
		const algorithms = problem.solutions?.[0]?.name
			? [problem.solutions[0].name]
			: [];
		algorithms.forEach((algo) => {
			const currentMastery = profile.algorithmMastery.get(algo) ?? 50;
			const change = performance > 60 ? 5 : -2;
			profile.algorithmMastery.set(
				algo,
				Math.max(0, Math.min(100, currentMastery + change)),
			);
		});
	}

	// Utility methods
	private getUserProfile(userId: string): UserProfile | undefined {
		return this.userProfiles.get(userId);
	}

	private getDefaultRecommendations(count: number): Recommendation[] {
		const beginnerProblems = editorialProblems
			.filter((p) => p.difficulty === "Easy")
			.slice(0, count);

		return beginnerProblems.map((problem) => ({
			problem,
			reason: "Great starting problem for beginners",
			priority: 50,
			estimatedDifficulty: 30,
			learningObjectives: ["Learn basic problem-solving patterns"],
			prerequisites: [],
			relatedConcepts: [problem.category],
			adaptiveHints: [
				"Start with understanding the problem",
				"Think about edge cases",
			],
		}));
	}

	private isDifficultyAppropriate(
		problem: EditorialProblem,
		profile: UserProfile,
	): boolean {
		const problemDifficulty = this.getDifficultyScore(problem.difficulty);
		const userLevel = this.getUserLevel(profile);
		return Math.abs(problemDifficulty - userLevel) <= 1;
	}

	private getDifficultyScore(difficulty: string): number {
		const scores = { Easy: 1, Medium: 2, Hard: 3 };
		return scores[difficulty as keyof typeof scores] || 2;
	}

	private getUserLevel(profile: UserProfile): number {
		const difficultyScores = { Easy: 1, Medium: 2, Hard: 3 };
		const recentDifficulties = profile.recentActivity
			.slice(0, 10)
			.map(
				(a) =>
					difficultyScores[a.difficulty as keyof typeof difficultyScores] || 2,
			);

		const avgDifficulty =
			recentDifficulties.reduce((a, b) => a + b, 0) / recentDifficulties.length;
		return avgDifficulty || 1;
	}

	private calculateCategoryUrgency(
		profile: UserProfile,
		category: string,
	): number {
		const recentActivity = profile.recentActivity.filter(
			(a) => a.category === category,
		);
		const avgScore =
			recentActivity.reduce((sum, a) => sum + a.score, 0) /
			recentActivity.length;
		return Number.isNaN(avgScore)
			? 5
			: Math.max(0, 10 - Math.floor(avgScore / 10));
	}

	private estimateDifficultyForUser(
		problem: EditorialProblem,
		profile: UserProfile,
	): number {
		const baseDifficulty = this.getDifficultyScore(problem.difficulty) * 30;

		// Adjust based on category strength
		const categoryMastery = profile.strongCategories.includes(problem.category)
			? 20
			: profile.weakCategories.includes(problem.category)
				? -20
				: 0;

		// Adjust based on algorithm mastery
		const algorithms = problem.solutions?.[0]?.name
			? [problem.solutions[0].name]
			: [];
		const algorithmBonus =
			algorithms.reduce(
				(sum, algo) => sum + (profile.algorithmMastery.get(algo) ?? 50),
				0,
			) /
			algorithms.length /
			2;

		return Math.max(
			0,
			Math.min(100, baseDifficulty + categoryMastery + algorithmBonus),
		);
	}

	private getNextDifficulty(profile: UserProfile): "Easy" | "Medium" | "Hard" {
		const recentScores = profile.recentActivity.slice(0, 5).map((a) => a.score);
		const avgScore =
			recentScores.reduce((a, b) => a + b, 0) / recentScores.length;

		if (avgScore > 85 && profile.preferredDifficulty === "Easy")
			return "Medium";
		if (avgScore > 85 && profile.preferredDifficulty === "Medium")
			return "Hard";
		if (avgScore < 60 && profile.preferredDifficulty === "Hard")
			return "Medium";
		if (avgScore < 40 && profile.preferredDifficulty === "Medium")
			return "Easy";

		return profile.preferredDifficulty;
	}

	private findSimilarProblems(
		problem: EditorialProblem,
		profile: UserProfile,
	): EditorialProblem[] {
		return editorialProblems.filter(
			(p) =>
				p.title !== problem.title &&
				!profile.solvedProblems.includes(p.title) &&
				(p.category === problem.category ||
					p.solutions?.[0]?.name === problem.solutions?.[0]?.name ||
					p.difficulty === problem.difficulty),
		);
	}

	private deduplicateRecommendations(
		recommendations: Recommendation[],
	): Recommendation[] {
		const seen = new Set<string>();
		return recommendations.filter((rec) => {
			if (seen.has(rec.problem.title)) return false;
			seen.add(rec.problem.title);
			return true;
		});
	}

	private initializeLearningPaths(): void {
		this.learningPaths = [
			{
				id: "arrays-mastery",
				name: "Array Manipulation Mastery",
				description:
					"Master array-based problem solving from basics to advanced",
				problems: editorialProblems
					.filter((p) => p.category === "Array")
					.slice(0, 10),
				estimatedDuration: 20,
				difficulty: "Beginner",
				prerequisites: [],
				learningObjectives: [
					"Master array traversal",
					"Learn two-pointer technique",
					"Understand sliding window",
				],
				milestones: [
					{
						problemIndex: 2,
						title: "Basic Traversal",
						description: "Complete basic array problems",
						requiredMastery: 70,
					},
					{
						problemIndex: 5,
						title: "Two Pointers",
						description: "Master two-pointer technique",
						requiredMastery: 80,
					},
					{
						problemIndex: 9,
						title: "Advanced Arrays",
						description: "Solve complex array challenges",
						requiredMastery: 85,
					},
				],
			},
			{
				id: "dp-fundamentals",
				name: "Dynamic Programming Fundamentals",
				description: "Build strong foundation in dynamic programming",
				problems: editorialProblems
					.filter((p) => p.category === "Dynamic Programming")
					.slice(0, 12),
				estimatedDuration: 30,
				difficulty: "Intermediate",
				prerequisites: ["Array", "Recursion"],
				learningObjectives: [
					"Understand memoization",
					"Master tabulation",
					"Recognize DP patterns",
				],
				milestones: [
					{
						problemIndex: 3,
						title: "Memoization",
						description: "Master top-down approach",
						requiredMastery: 75,
					},
					{
						problemIndex: 7,
						title: "Tabulation",
						description: "Master bottom-up approach",
						requiredMastery: 80,
					},
					{
						problemIndex: 11,
						title: "Advanced DP",
						description: "Solve complex DP problems",
						requiredMastery: 90,
					},
				],
			},
		];
	}

	private getPrerequisites(problem: EditorialProblem): string[] {
		const prerequisites: string[] = [];

		if (problem.category === "Dynamic Programming") {
			prerequisites.push("Recursion", "Array");
		} else if (problem.category === "Graph") {
			prerequisites.push("Tree", "DFS", "BFS");
		} else if (problem.category === "Tree") {
			prerequisites.push("Recursion");
		}

		return prerequisites;
	}

	private getRelatedConcepts(problem: EditorialProblem): string[] {
		return [
			problem.category,
			...(problem.solutions?.[0]?.name ? [problem.solutions[0].name] : []),
		];
	}

	private generateAdaptiveHints(
		problem: EditorialProblem,
		profile: UserProfile,
	): string[] {
		const hints: string[] = [];

		if (profile.weakCategories.includes(problem.category)) {
			hints.push(`Focus on ${problem.category} fundamentals first`);
		}

		if (problem.hints && problem.hints.length > 0) {
			hints.push(problem.hints[0].text);
		}

		return hints;
	}

	// Additional helper methods
	private getRecentSuccessfulCategories(profile: UserProfile): string[] {
		return profile.recentActivity
			.filter((a) => a.score > 70)
			.slice(0, 5)
			.map((a) => a.category);
	}

	private hasPrerequisiteKnowledge(
		problem: EditorialProblem,
		profile: UserProfile,
	): boolean {
		const prerequisites = this.getPrerequisites(problem);
		return prerequisites.every(
			(prereq) =>
				profile.strongCategories.includes(prereq) ||
				(profile.algorithmMastery.get(prereq) ?? 0) > 60,
		);
	}

	private calculateProgressionScore(
		problem: EditorialProblem,
		profile: UserProfile,
	): number {
		let score = 0;

		// Bonus for building on strong categories
		if (profile.strongCategories.includes(problem.category)) {
			score += 10;
		}

		// Bonus for appropriate difficulty progression
		const nextDiff = this.getNextDifficulty(profile);
		if (problem.difficulty === nextDiff) {
			score += 15;
		}

		return score;
	}

	private calculateSimilarityScore(
		problem1: EditorialProblem,
		problem2: EditorialProblem,
	): number {
		let score = 0;

		if (problem1.category === problem2.category) score += 10;
		if (problem1.difficulty === problem2.difficulty) score += 5;
		if (problem1.solutions?.[0]?.name === problem2.solutions?.[0]?.name)
			score += 15;

		return score;
	}

	private mapDifficultyToProfile(difficulty: string): number {
		const mapping = { Beginner: 1, Intermediate: 2, Advanced: 3 };
		return mapping[difficulty as keyof typeof mapping] || 2;
	}

	private calculatePathRelevance(
		path: LearningPath,
		profile: UserProfile,
	): number {
		let relevance = 0;

		// Higher relevance if path addresses weak categories
		path.problems.forEach((problem) => {
			if (profile.weakCategories.includes(problem.category)) {
				relevance += 10;
			}
		});

		// Lower relevance if user already strong in path areas
		const pathCategories = [...new Set(path.problems.map((p) => p.category))];
		pathCategories.forEach((category) => {
			if (profile.strongCategories.includes(category)) {
				relevance -= 5;
			}
		});

		return relevance;
	}

	private updateCategoryStrength(
		profile: UserProfile,
		category: string,
		change: number,
	): void {
		if (change > 0) {
			if (!profile.strongCategories.includes(category) && change >= 5) {
				profile.strongCategories.push(category);
			}
			// Remove from weak if became strong
			profile.weakCategories = profile.weakCategories.filter(
				(c) => c !== category,
			);
		} else if (change < 0) {
			profile.strongCategories = profile.strongCategories.filter(
				(c) => c !== category,
			);
			if (!profile.weakCategories.includes(category) && change <= -3) {
				profile.weakCategories.push(category);
			}
		}
	}

	// Public methods for profile management
	createUserProfile(userId: string): UserProfile {
		const profile: UserProfile = {
			id: userId,
			solvedProblems: [],
			weakCategories: [],
			strongCategories: [],
			preferredDifficulty: "Easy",
			averageCompletionTime: 0,
			algorithmMastery: new Map(),
			learningGoals: [],
			recentActivity: [],
		};

		this.userProfiles.set(userId, profile);
		return profile;
	}

	updateUserProfile(userId: string, activity: ActivityEntry): void {
		let profile = this.getUserProfile(userId);
		if (!profile) {
			profile = this.createUserProfile(userId);
		}

		profile.recentActivity.unshift(activity);
		if (profile.recentActivity.length > 50) {
			profile.recentActivity = profile.recentActivity.slice(0, 50);
		}

		if (!profile.solvedProblems.includes(activity.problemId)) {
			profile.solvedProblems.push(activity.problemId);
		}

		// Update completion time average
		const recentTimes = profile.recentActivity
			.slice(0, 10)
			.map((a) => a.completionTime);
		profile.averageCompletionTime =
			recentTimes.reduce((a, b) => a + b, 0) / recentTimes.length;

		// Adapt difficulty based on performance
		this.adaptDifficulty(userId, activity.problemId, activity.score);
	}
}

export const aiRecommendationEngine = new AIRecommendationEngine();
