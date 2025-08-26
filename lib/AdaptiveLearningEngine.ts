import { prisma } from "@/app/lib/prisma";
import { comprehensiveProblems } from "./data/comprehensive-problems";

export interface UserLearningProfile {
	userId: string;
	strengths: string[];
	weaknesses: string[];
	preferredDifficulty: "Easy" | "Medium" | "Hard";
	learningVelocity: number; // problems per week
	consistencyScore: number; // 0-100
	algorithmMastery: Record<string, number>; // algorithm -> mastery level (0-100)
	timeSpentByCategory: Record<string, number>;
	averageAccuracy: number;
	totalProblemsAttempted: number;
	lastActiveDate: Date;
	learningGoals: string[];
}

export interface LearningPath {
	id: string;
	userId: string;
	title: string;
	description: string;
	estimatedDuration: number; // in days
	difficulty: "Beginner" | "Intermediate" | "Advanced";
	problems: RecommendedProblem[];
	prerequisites: string[];
	goals: string[];
	adaptations: PathAdaptation[];
	createdAt: Date;
	updatedAt: Date;
	progress: number; // 0-100
	isActive: boolean;
}

export interface RecommendedProblem {
	problemId: string;
	title: string;
	difficulty: string;
	algorithms: string[];
	estimatedTime: number; // minutes
	priority: number; // 1-10
	reasoning: string;
	prerequisites: string[];
	learningObjectives: string[];
	order: number;
	completed: boolean;
	attempts: number;
	bestScore: number;
	timeSpent: number;
}

export interface PathAdaptation {
	timestamp: Date;
	reason: string;
	changes: string[];
	performanceTrigger: string;
	newDifficulty?: string;
	addedProblems?: string[];
	removedProblems?: string[];
}

export interface MLRecommendation {
	type: "problem" | "topic" | "difficulty" | "pacing";
	confidence: number; // 0-1
	reasoning: string;
	data: any;
	expectedImprovement: number;
}

export class AdaptiveLearningEngine {
	private static instance: AdaptiveLearningEngine;
	private readonly MASTERY_THRESHOLD = 75;
	private readonly MIN_PROBLEMS_FOR_ANALYSIS = 5;
	private readonly ADAPTATION_COOLDOWN = 24 * 60 * 60 * 1000; // 24 hours

	static getInstance(): AdaptiveLearningEngine {
		if (!AdaptiveLearningEngine.instance) {
			AdaptiveLearningEngine.instance = new AdaptiveLearningEngine();
		}
		return AdaptiveLearningEngine.instance;
	}

	async generateUserProfile(userId: string): Promise<UserLearningProfile> {
		// Get user's quiz attempts and performance data
		const attempts = await prisma.quizAttempt.findMany({
			where: { userId, completed: true },
			include: {
				quiz: {
					include: {
						questions: {
							include: {
								problem: true,
							},
						},
					},
				},
			},
			orderBy: { completedAt: "desc" },
			take: 50, // Analyze last 50 attempts
		});

		if (attempts.length < this.MIN_PROBLEMS_FOR_ANALYSIS) {
			return this.createBasicProfile(userId);
		}

		const algorithmPerformance = this.analyzeAlgorithmPerformance(attempts);
		const timeAnalysis = this.analyzeTimeSpent(attempts);
		const difficultyAnalysis = this.analyzeDifficultyPreference(attempts);
		const consistencyScore = this.calculateConsistencyScore(attempts);
		const learningVelocity = this.calculateLearningVelocity(attempts);

		return {
			userId,
			strengths: this.identifyStrengths(algorithmPerformance),
			weaknesses: this.identifyWeaknesses(algorithmPerformance),
			preferredDifficulty: difficultyAnalysis.preferred,
			learningVelocity,
			consistencyScore,
			algorithmMastery: algorithmPerformance,
			timeSpentByCategory: timeAnalysis.byCategory,
			averageAccuracy: this.calculateAverageAccuracy(attempts),
			totalProblemsAttempted: attempts.length,
			lastActiveDate: attempts[0]?.completedAt || new Date(),
			learningGoals: await this.inferLearningGoals(
				userId,
				algorithmPerformance,
			),
		};
	}

	async createPersonalizedLearningPath(
		userId: string,
		goals: string[] = [],
	): Promise<LearningPath> {
		const profile = await this.generateUserProfile(userId);
		const recommendations = await this.generateMLRecommendations(profile);

		const pathId = `path_${userId}_${Date.now()}`;
		const problems = await this.selectOptimalProblems(
			profile,
			recommendations,
			goals,
		);

		const learningPath: LearningPath = {
			id: pathId,
			userId,
			title: this.generatePathTitle(profile, goals),
			description: this.generatePathDescription(profile, goals),
			estimatedDuration: this.estimateCompletionTime(
				problems,
				profile.learningVelocity,
			),
			difficulty: this.determinePathDifficulty(profile, problems),
			problems,
			prerequisites: this.identifyPrerequisites(problems),
			goals: goals.length > 0 ? goals : profile.learningGoals,
			adaptations: [],
			createdAt: new Date(),
			updatedAt: new Date(),
			progress: 0,
			isActive: true,
		};

		// Store learning path in database
		await this.storeLearningPath(learningPath);

		return learningPath;
	}

	async adaptLearningPath(pathId: string): Promise<LearningPath> {
		const path = await this.getLearningPath(pathId);
		if (!path) throw new Error("Learning path not found");

		const profile = await this.generateUserProfile(path.userId);
		const recentPerformance = await this.analyzeRecentPerformance(
			path.userId,
			7,
		); // Last 7 days

		// Check if adaptation is needed
		const adaptationNeeds = this.assessAdaptationNeeds(
			path,
			profile,
			recentPerformance,
		);

		if (adaptationNeeds.length === 0) {
			return path; // No adaptation needed
		}

		// Apply adaptations
		const adaptedPath = await this.applyAdaptations(
			path,
			adaptationNeeds,
			profile,
		);

		// Store updated path
		await this.updateLearningPath(adaptedPath);

		return adaptedPath;
	}

	async generateMLRecommendations(
		profile: UserLearningProfile,
	): Promise<MLRecommendation[]> {
		const recommendations: MLRecommendation[] = [];

		// Difficulty recommendation based on performance trends
		const difficultyRec = this.recommendOptimalDifficulty(profile);
		recommendations.push(difficultyRec);

		// Topic recommendations based on weakness analysis
		const topicRecs = this.recommendTopicsToFocus(profile);
		recommendations.push(...topicRecs);

		// Problem sequence recommendations
		const sequenceRec = this.recommendProblemSequence(profile);
		recommendations.push(sequenceRec);

		// Pacing recommendations
		const pacingRec = this.recommendOptimalPacing(profile);
		recommendations.push(pacingRec);

		return recommendations.sort((a, b) => b.confidence - a.confidence);
	}

	private analyzeAlgorithmPerformance(attempts: any[]): Record<string, number> {
		const algorithmStats: Record<string, { correct: number; total: number }> =
			{};

		attempts.forEach((attempt) => {
			attempt.quiz.questions.forEach((question: any) => {
				const problem = comprehensiveProblems.find(
					(p) => p.title === question.problem.title,
				);
				if (problem) {
					problem.algorithms.forEach((algo) => {
						if (!algorithmStats[algo]) {
							algorithmStats[algo] = { correct: 0, total: 0 };
						}
						algorithmStats[algo].total++;
						if (attempt.score >= 70) {
							// Consider 70%+ as correct
							algorithmStats[algo].correct++;
						}
					});
				}
			});
		});

		const mastery: Record<string, number> = {};
		Object.entries(algorithmStats).forEach(([algo, stats]) => {
			mastery[algo] = Math.round((stats.correct / stats.total) * 100);
		});

		return mastery;
	}

	private analyzeTimeSpent(attempts: any[]): {
		byCategory: Record<string, number>;
		average: number;
	} {
		const categoryTime: Record<string, number> = {};
		let totalTime = 0;

		attempts.forEach((attempt) => {
			const timePerProblem = attempt.timeSpent / attempt.quiz.questions.length;
			totalTime += attempt.timeSpent;

			attempt.quiz.questions.forEach((question: any) => {
				const category = question.problem.category || "General";
				categoryTime[category] = (categoryTime[category] || 0) + timePerProblem;
			});
		});

		return {
			byCategory: categoryTime,
			average: totalTime / attempts.length,
		};
	}

	private analyzeDifficultyPreference(attempts: any[]): {
		preferred: "Easy" | "Medium" | "Hard";
		distribution: Record<string, number>;
	} {
		const difficultyScores: Record<string, number[]> = {
			Easy: [],
			Medium: [],
			Hard: [],
		};

		attempts.forEach((attempt) => {
			const difficulty = attempt.quiz.difficulty;
			if (difficultyScores[difficulty]) {
				difficultyScores[difficulty].push(attempt.score);
			}
		});

		// Calculate average scores by difficulty
		const avgScores: Record<string, number> = {};
		Object.entries(difficultyScores).forEach(([diff, scores]) => {
			avgScores[diff] =
				scores.length > 0
					? scores.reduce((a, b) => a + b, 0) / scores.length
					: 0;
		});

		// Find difficulty with best performance (above 75% accuracy)
		const preferred =
			(Object.entries(avgScores)
				.filter(([_, score]) => score >= 75)
				.sort(([_, a], [__, b]) => b - a)[0]?.[0] as
				| "Easy"
				| "Medium"
				| "Hard") || "Easy";

		return { preferred, distribution: avgScores };
	}

	private calculateConsistencyScore(attempts: any[]): number {
		if (attempts.length < 3) return 50;

		const scores = attempts.map((a) => a.score);
		const mean = scores.reduce((a, b) => a + b, 0) / scores.length;
		const variance =
			scores.reduce((sum, score) => sum + (score - mean) ** 2, 0) /
			scores.length;
		const stdDev = Math.sqrt(variance);

		// Lower standard deviation = higher consistency
		// Normalize to 0-100 scale (inverse relationship)
		const consistencyScore = Math.max(0, 100 - stdDev * 2);
		return Math.round(consistencyScore);
	}

	private calculateLearningVelocity(attempts: any[]): number {
		if (attempts.length < 2) return 1;

		const sortedAttempts = attempts.sort(
			(a, b) =>
				new Date(a.completedAt).getTime() - new Date(b.completedAt).getTime(),
		);
		const timeSpan =
			new Date(
				sortedAttempts[sortedAttempts.length - 1].completedAt,
			).getTime() - new Date(sortedAttempts[0].completedAt).getTime();
		const weeks = timeSpan / (1000 * 60 * 60 * 24 * 7);

		return Math.round((attempts.length / Math.max(weeks, 0.1)) * 10) / 10;
	}

	private identifyStrengths(
		algorithmMastery: Record<string, number>,
	): string[] {
		return Object.entries(algorithmMastery)
			.filter(([_, mastery]) => mastery >= this.MASTERY_THRESHOLD)
			.sort(([_, a], [__, b]) => b - a)
			.slice(0, 5)
			.map(([algo, _]) => algo);
	}

	private identifyWeaknesses(
		algorithmMastery: Record<string, number>,
	): string[] {
		return Object.entries(algorithmMastery)
			.filter(([_, mastery]) => mastery < this.MASTERY_THRESHOLD)
			.sort(([_, a], [__, b]) => a - b)
			.slice(0, 5)
			.map(([algo, _]) => algo);
	}

	private async inferLearningGoals(
		userId: string,
		algorithmMastery: Record<string, number>,
	): Promise<string[]> {
		const goals: string[] = [];
		const weakAlgorithms = this.identifyWeaknesses(algorithmMastery);

		if (weakAlgorithms.length > 0) {
			goals.push(`Improve ${weakAlgorithms[0]} proficiency`);
		}

		const overallMastery =
			Object.values(algorithmMastery).reduce((a, b) => a + b, 0) /
			Object.keys(algorithmMastery).length;

		if (overallMastery < 60) {
			goals.push("Build strong algorithmic foundations");
		} else if (overallMastery >= 80) {
			goals.push("Master advanced algorithms and optimization");
		}

		goals.push("Maintain consistent practice schedule");

		return goals;
	}

	private createBasicProfile(userId: string): UserLearningProfile {
		return {
			userId,
			strengths: [],
			weaknesses: [],
			preferredDifficulty: "Easy",
			learningVelocity: 3,
			consistencyScore: 50,
			algorithmMastery: {},
			timeSpentByCategory: {},
			averageAccuracy: 0,
			totalProblemsAttempted: 0,
			lastActiveDate: new Date(),
			learningGoals: [
				"Build algorithmic thinking skills",
				"Establish consistent practice",
			],
		};
	}

	private calculateAverageAccuracy(attempts: any[]): number {
		if (attempts.length === 0) return 0;
		const totalAccuracy = attempts.reduce(
			(sum, attempt) => sum + attempt.score,
			0,
		);
		return Math.round(totalAccuracy / attempts.length);
	}

	private async selectOptimalProblems(
		profile: UserLearningProfile,
		recommendations: MLRecommendation[],
		goals: string[],
	): Promise<RecommendedProblem[]> {
		const problems: RecommendedProblem[] = [];
		const targetAlgorithms = new Set([
			...profile.weaknesses,
			...this.extractAlgorithmsFromGoals(goals),
		]);

		// Start with foundational problems for weak areas
		const foundationalProblems = comprehensiveProblems
			.filter(
				(p) =>
					p.difficulty === "Easy" &&
					p.algorithms.some((algo) => targetAlgorithms.has(algo)),
			)
			.slice(0, 5);

		foundationalProblems.forEach((problem, index) => {
			problems.push(
				this.createRecommendedProblem(
					problem,
					index + 1,
					8,
					"Foundation building for weak algorithm areas",
				),
			);
		});

		// Add progressive difficulty problems
		const progressiveProblems = comprehensiveProblems
			.filter(
				(p) =>
					p.difficulty === profile.preferredDifficulty &&
					p.algorithms.some((algo) => targetAlgorithms.has(algo)),
			)
			.slice(0, 8);

		progressiveProblems.forEach((problem, index) => {
			problems.push(
				this.createRecommendedProblem(
					problem,
					foundationalProblems.length + index + 1,
					7,
					"Progressive skill development",
				),
			);
		});

		// Add challenge problems for strengths
		if (profile.strengths.length > 0) {
			const challengeProblems = comprehensiveProblems
				.filter(
					(p) =>
						p.difficulty === "Hard" &&
						p.algorithms.some((algo) => profile.strengths.includes(algo)),
				)
				.slice(0, 3);

			challengeProblems.forEach((problem, index) => {
				problems.push(
					this.createRecommendedProblem(
						problem,
						problems.length + index + 1,
						6,
						"Challenge problems to maintain strength areas",
					),
				);
			});
		}

		return problems.sort(
			(a, b) => b.priority - a.priority || a.order - b.order,
		);
	}

	private createRecommendedProblem(
		problem: any,
		order: number,
		priority: number,
		reasoning: string,
	): RecommendedProblem {
		return {
			problemId: problem.id,
			title: problem.title,
			difficulty: problem.difficulty,
			algorithms: problem.algorithms,
			estimatedTime: this.estimateProblemTime(problem),
			priority,
			reasoning,
			prerequisites: this.identifyProblemPrerequisites(problem),
			learningObjectives: this.generateLearningObjectives(problem),
			order,
			completed: false,
			attempts: 0,
			bestScore: 0,
			timeSpent: 0,
		};
	}

	private estimateProblemTime(problem: any): number {
		const baseTime = { Easy: 15, Medium: 30, Hard: 60 };
		const complexityMultiplier = problem.algorithms.length > 2 ? 1.5 : 1.0;
		return Math.round(
			(baseTime[problem.difficulty as keyof typeof baseTime] || 30) *
				complexityMultiplier,
		);
	}

	private identifyProblemPrerequisites(problem: any): string[] {
		const prerequisites: string[] = [];

		// Basic prerequisites based on algorithms
		if (problem.algorithms.includes("Dynamic Programming")) {
			prerequisites.push("Recursion", "Memoization");
		}
		if (problem.algorithms.includes("Graph")) {
			prerequisites.push("DFS", "BFS");
		}
		if (problem.algorithms.includes("Binary Search Tree")) {
			prerequisites.push("Binary Tree", "Tree Traversal");
		}

		return prerequisites;
	}

	private generateLearningObjectives(problem: any): string[] {
		const objectives: string[] = [];

		problem.algorithms.forEach((algo: string) => {
			objectives.push(`Master ${algo} implementation`);
		});

		objectives.push(
			`Understand ${problem.difficulty.toLowerCase()} level problem patterns`,
		);
		objectives.push("Optimize time and space complexity");

		return objectives;
	}

	private extractAlgorithmsFromGoals(goals: string[]): string[] {
		const algorithms: string[] = [];
		const algorithmKeywords = [
			"Array",
			"String",
			"Dynamic Programming",
			"Graph",
			"Tree",
			"Binary Search",
			"Sorting",
			"Hash Table",
			"Stack",
			"Queue",
			"Heap",
			"Backtracking",
		];

		goals.forEach((goal) => {
			algorithmKeywords.forEach((keyword) => {
				if (goal.toLowerCase().includes(keyword.toLowerCase())) {
					algorithms.push(keyword);
				}
			});
		});

		return algorithms;
	}

	private recommendOptimalDifficulty(
		profile: UserLearningProfile,
	): MLRecommendation {
		const avgAccuracy = profile.averageAccuracy;
		let recommendedDifficulty = profile.preferredDifficulty;
		let confidence = 0.7;
		let reasoning = "Maintain current difficulty level";

		if (avgAccuracy >= 85 && profile.consistencyScore >= 70) {
			// User is excelling, recommend harder problems
			const difficultyMap = { Easy: "Medium", Medium: "Hard", Hard: "Hard" };
			recommendedDifficulty = difficultyMap[
				profile.preferredDifficulty as keyof typeof difficultyMap
			] as any;
			confidence = 0.85;
			reasoning =
				"High accuracy and consistency indicate readiness for increased difficulty";
		} else if (avgAccuracy < 60 || profile.consistencyScore < 40) {
			// User is struggling, recommend easier problems
			const difficultyMap = { Hard: "Medium", Medium: "Easy", Easy: "Easy" };
			recommendedDifficulty = difficultyMap[
				profile.preferredDifficulty as keyof typeof difficultyMap
			] as any;
			confidence = 0.8;
			reasoning =
				"Low accuracy or consistency suggest focusing on foundational concepts";
		}

		return {
			type: "difficulty",
			confidence,
			reasoning,
			data: { recommendedDifficulty },
			expectedImprovement: confidence > 0.8 ? 15 : 10,
		};
	}

	private recommendTopicsToFocus(
		profile: UserLearningProfile,
	): MLRecommendation[] {
		const recommendations: MLRecommendation[] = [];

		profile.weaknesses.slice(0, 3).forEach((weakness) => {
			recommendations.push({
				type: "topic",
				confidence: 0.9,
				reasoning: `Low mastery in ${weakness} (${profile.algorithmMastery[weakness] || 0}%)`,
				data: {
					topic: weakness,
					currentMastery: profile.algorithmMastery[weakness] || 0,
				},
				expectedImprovement: 20,
			});
		});

		return recommendations;
	}

	private recommendProblemSequence(
		profile: UserLearningProfile,
	): MLRecommendation {
		let sequence = "mixed";
		let confidence = 0.6;
		let reasoning = "Balanced approach with mixed problem types";

		if (profile.consistencyScore < 50) {
			sequence = "structured";
			confidence = 0.8;
			reasoning =
				"Low consistency benefits from structured, sequential learning";
		} else if (
			profile.totalProblemsAttempted > 50 &&
			profile.averageAccuracy > 75
		) {
			sequence = "adaptive";
			confidence = 0.85;
			reasoning =
				"Experienced user with good performance can handle adaptive sequencing";
		}

		return {
			type: "problem",
			confidence,
			reasoning,
			data: { sequence },
			expectedImprovement: confidence > 0.8 ? 12 : 8,
		};
	}

	private recommendOptimalPacing(
		profile: UserLearningProfile,
	): MLRecommendation {
		const currentVelocity = profile.learningVelocity;
		let recommendedPacing = currentVelocity;
		let confidence = 0.7;
		let reasoning = "Maintain current learning pace";

		if (profile.consistencyScore >= 80 && profile.averageAccuracy >= 75) {
			recommendedPacing = Math.min(currentVelocity * 1.3, 10);
			confidence = 0.8;
			reasoning = "High performance indicates potential for increased pace";
		} else if (profile.consistencyScore < 40) {
			recommendedPacing = Math.max(currentVelocity * 0.7, 1);
			confidence = 0.85;
			reasoning =
				"Inconsistent performance suggests slowing down for better retention";
		}

		return {
			type: "pacing",
			confidence,
			reasoning,
			data: { recommendedProblemsPerWeek: Math.round(recommendedPacing) },
			expectedImprovement:
				Math.abs(recommendedPacing - currentVelocity) > 1 ? 15 : 5,
		};
	}

	private generatePathTitle(
		profile: UserLearningProfile,
		goals: string[],
	): string {
		if (goals.length > 0) {
			return `Personalized Path: ${goals[0]}`;
		}

		if (profile.totalProblemsAttempted < 10) {
			return "Algorithm Foundations Journey";
		} else if (profile.averageAccuracy < 60) {
			return "Skill Reinforcement Path";
		} else if (profile.averageAccuracy >= 80) {
			return "Advanced Mastery Track";
		}

		return "Adaptive Learning Path";
	}

	private generatePathDescription(
		profile: UserLearningProfile,
		goals: string[],
	): string {
		const weaknessText =
			profile.weaknesses.length > 0
				? `Focus areas: ${profile.weaknesses.slice(0, 3).join(", ")}.`
				: "Balanced skill development.";

		const paceText = `Recommended pace: ${Math.round(profile.learningVelocity)} problems per week.`;

		return `Tailored learning path based on your performance analysis. ${weaknessText} ${paceText} Estimated completion: ${this.estimateCompletionTime([], profile.learningVelocity)} days.`;
	}

	private estimateCompletionTime(
		problems: RecommendedProblem[],
		velocity: number,
	): number {
		const totalProblems = problems.length || 15; // Default estimate
		const problemsPerWeek = Math.max(velocity, 1);
		return Math.ceil((totalProblems / problemsPerWeek) * 7);
	}

	private determinePathDifficulty(
		profile: UserLearningProfile,
		problems: RecommendedProblem[],
	): "Beginner" | "Intermediate" | "Advanced" {
		if (profile.totalProblemsAttempted < 10 || profile.averageAccuracy < 50) {
			return "Beginner";
		} else if (
			profile.averageAccuracy >= 80 &&
			profile.consistencyScore >= 70
		) {
			return "Advanced";
		}
		return "Intermediate";
	}

	private identifyPrerequisites(problems: RecommendedProblem[]): string[] {
		const allPrerequisites = new Set<string>();
		problems.forEach((problem) => {
			problem.prerequisites.forEach((prereq) => allPrerequisites.add(prereq));
		});
		return Array.from(allPrerequisites);
	}

	private async storeLearningPath(path: LearningPath): Promise<void> {
		// Store in database - implement based on your schema
		console.log("Storing learning path:", path.id);
	}

	private async getLearningPath(pathId: string): Promise<LearningPath | null> {
		// Retrieve from database - implement based on your schema
		console.log("Retrieving learning path:", pathId);
		return null;
	}

	private async updateLearningPath(path: LearningPath): Promise<void> {
		// Update in database - implement based on your schema
		console.log("Updating learning path:", path.id);
	}

	private async analyzeRecentPerformance(
		userId: string,
		days: number,
	): Promise<any> {
		const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

		const recentAttempts = await prisma.quizAttempt.findMany({
			where: {
				userId,
				completed: true,
				completedAt: { gte: since },
			},
			orderBy: { completedAt: "desc" },
		});

		return {
			attemptCount: recentAttempts.length,
			averageScore:
				recentAttempts.length > 0
					? recentAttempts.reduce((sum, attempt) => sum + attempt.score, 0) /
						recentAttempts.length
					: 0,
			trend: this.calculatePerformanceTrend(recentAttempts),
			consistency: this.calculateConsistencyScore(recentAttempts),
		};
	}

	private calculatePerformanceTrend(
		attempts: any[],
	): "improving" | "declining" | "stable" {
		if (attempts.length < 3) return "stable";

		const recent = attempts.slice(0, Math.floor(attempts.length / 2));
		const earlier = attempts.slice(Math.floor(attempts.length / 2));

		const recentAvg =
			recent.reduce((sum, a) => sum + a.score, 0) / recent.length;
		const earlierAvg =
			earlier.reduce((sum, a) => sum + a.score, 0) / earlier.length;

		const diff = recentAvg - earlierAvg;

		if (diff > 5) return "improving";
		if (diff < -5) return "declining";
		return "stable";
	}

	private assessAdaptationNeeds(
		path: LearningPath,
		profile: UserLearningProfile,
		recentPerformance: any,
	): string[] {
		const needs: string[] = [];

		// Check if user is consistently scoring too high or too low
		if (
			recentPerformance.averageScore >= 90 &&
			recentPerformance.consistency >= 80
		) {
			needs.push("increase_difficulty");
		} else if (recentPerformance.averageScore < 50) {
			needs.push("decrease_difficulty");
		}

		// Check if user is progressing too slowly or quickly
		const expectedProgress =
			((Date.now() - path.createdAt.getTime()) /
				(path.estimatedDuration * 24 * 60 * 60 * 1000)) *
			100;
		if (path.progress < expectedProgress * 0.5) {
			needs.push("adjust_pacing");
		}

		// Check if recent performance trend suggests need for topic change
		if (recentPerformance.trend === "declining") {
			needs.push("review_fundamentals");
		}

		return needs;
	}

	private async applyAdaptations(
		path: LearningPath,
		needs: string[],
		profile: UserLearningProfile,
	): Promise<LearningPath> {
		const adaptations: PathAdaptation[] = [...path.adaptations];
		let updatedProblems = [...path.problems];

		needs.forEach((need) => {
			const adaptation: PathAdaptation = {
				timestamp: new Date(),
				reason: need,
				changes: [],
				performanceTrigger: this.getPerformanceTrigger(need),
				addedProblems: [],
				removedProblems: [],
			};

			switch (need) {
				case "increase_difficulty": {
					// Add harder problems, remove some easier ones
					const harderProblems = this.findHarderProblems(profile, 3);
					updatedProblems = updatedProblems.concat(harderProblems);
					adaptation.changes.push("Added 3 harder problems");
					adaptation.addedProblems = harderProblems.map((p) => p.title);
					break;
				}

				case "decrease_difficulty": {
					// Add easier foundational problems
					const easierProblems = this.findEasierProblems(profile, 2);
					updatedProblems = easierProblems.concat(updatedProblems);
					adaptation.changes.push("Added foundational problems");
					adaptation.addedProblems = easierProblems.map((p) => p.title);
					break;
				}

				case "adjust_pacing":
					// Modify estimated times and reorder problems
					updatedProblems = this.adjustProblemPacing(updatedProblems);
					adaptation.changes.push("Adjusted problem pacing and sequence");
					break;

				case "review_fundamentals": {
					// Insert review problems for struggling areas
					const reviewProblems = this.findReviewProblems(profile, 2);
					updatedProblems = reviewProblems.concat(updatedProblems);
					adaptation.changes.push("Added fundamental review problems");
					adaptation.addedProblems = reviewProblems.map((p) => p.title);
					break;
				}
			}

			adaptations.push(adaptation);
		});

		return {
			...path,
			problems: updatedProblems,
			adaptations,
			updatedAt: new Date(),
		};
	}

	private getPerformanceTrigger(need: string): string {
		const triggers = {
			increase_difficulty:
				"Consistently high scores (>90%) with high consistency",
			decrease_difficulty: "Low average scores (<50%)",
			adjust_pacing: "Progress significantly behind schedule",
			review_fundamentals: "Declining performance trend",
		};
		return triggers[need as keyof typeof triggers] || "Performance analysis";
	}

	private findHarderProblems(
		profile: UserLearningProfile,
		count: number,
	): RecommendedProblem[] {
		return comprehensiveProblems
			.filter(
				(p) =>
					p.difficulty === "Hard" &&
					p.algorithms.some((algo) => profile.strengths.includes(algo)),
			)
			.slice(0, count)
			.map((problem, index) =>
				this.createRecommendedProblem(
					problem,
					999 + index,
					9,
					"Advanced challenge to match improved performance",
				),
			);
	}

	private findEasierProblems(
		profile: UserLearningProfile,
		count: number,
	): RecommendedProblem[] {
		return comprehensiveProblems
			.filter(
				(p) =>
					p.difficulty === "Easy" &&
					p.algorithms.some((algo) => profile.weaknesses.includes(algo)),
			)
			.slice(0, count)
			.map((problem, index) =>
				this.createRecommendedProblem(
					problem,
					-index,
					8,
					"Foundational reinforcement for struggling areas",
				),
			);
	}

	private findReviewProblems(
		profile: UserLearningProfile,
		count: number,
	): RecommendedProblem[] {
		return comprehensiveProblems
			.filter(
				(p) =>
					p.difficulty === "Easy" &&
					p.algorithms.some((algo) =>
						Object.keys(profile.algorithmMastery).includes(algo),
					),
			)
			.slice(0, count)
			.map((problem, index) =>
				this.createRecommendedProblem(
					problem,
					-10 - index,
					7,
					"Review and reinforcement of fundamental concepts",
				),
			);
	}

	private adjustProblemPacing(
		problems: RecommendedProblem[],
	): RecommendedProblem[] {
		return problems.map((problem) => ({
			...problem,
			estimatedTime: Math.round(problem.estimatedTime * 1.2), // Add 20% more time
		}));
	}
}

export const adaptiveLearningEngine = AdaptiveLearningEngine.getInstance();
