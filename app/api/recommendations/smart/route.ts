import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/app/lib/prisma";
import { authOptions } from "@/lib/auth/next-auth";
import { comprehensiveProblems } from "@/lib/data/comprehensive-problems";

interface UserProfile {
	skillLevels: Record<string, number>; // 0-100 for each skill
	preferences: {
		difficulty: string;
		timeAvailable: number;
		focusAreas: string[];
		learningStyle: "visual" | "practice" | "theoretical";
	};
	weaknesses: string[];
	strengths: string[];
	goals: string[];
}

interface RecommendationEngine {
	generatePersonalizedQuiz(profile: UserProfile): any;
	suggestLearningPath(profile: UserProfile): any;
	recommendNextProblems(profile: UserProfile): any;
}

export async function POST(request: Request) {
	try {
		const session = await getServerSession(authOptions);

		if (!session?.user?.email) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const { action, params } = await request.json();
		const userId = session.user.email;

		// Get user's performance history
		const attempts = await prisma.quizAttempt.findMany({
			where: { userId },
			include: { quiz: true },
			orderBy: { completedAt: "desc" },
			take: 100, // Last 100 attempts
		});

		// Build user profile
		const userProfile = await buildUserProfile(userId, attempts, params);

		// Initialize recommendation engine
		const engine = new SmartRecommendationEngine();

		let result;
		switch (action) {
			case "personalizedQuiz":
				result = engine.generatePersonalizedQuiz(userProfile);
				break;
			case "learningPath":
				result = engine.suggestLearningPath(userProfile);
				break;
			case "nextProblems":
				result = engine.recommendNextProblems(userProfile);
				break;
			case "adaptiveDifficulty":
				result = engine.calculateAdaptiveDifficulty(userProfile);
				break;
			case "weaknessAnalysis":
				result = engine.analyzeWeaknesses(userProfile);
				break;
			default:
				return NextResponse.json({ error: "Invalid action" }, { status: 400 });
		}

		return NextResponse.json({
			profile: userProfile,
			recommendations: result,
			metadata: {
				generatedAt: new Date().toISOString(),
				basedOnAttempts: attempts.length,
				confidence: calculateConfidence(attempts.length),
			},
		});
	} catch (error) {
		console.error("Smart recommendations error:", error);
		return NextResponse.json(
			{ error: "Failed to generate recommendations" },
			{ status: 500 },
		);
	}
}

async function buildUserProfile(
	_userId: string,
	attempts: any[],
	_params?: any,
): Promise<UserProfile> {
	// Calculate skill levels based on performance
	const skillLevels: Record<string, number> = {};
	const categoryStats: Record<string, { scores: number[]; attempts: number }> =
		{};

	attempts.forEach((attempt) => {
		const category = attempt.quiz?.category;
		if (category) {
			if (!categoryStats[category]) {
				categoryStats[category] = { scores: [], attempts: 0 };
			}
			categoryStats[category].scores.push(attempt.score);
			categoryStats[category].attempts++;
		}
	});

	// Convert to skill levels (0-100)
	Object.keys(categoryStats).forEach((category) => {
		const stats = categoryStats[category];
		const avgScore =
			stats.scores.reduce((a, b) => a + b, 0) / stats.scores.length;
		const consistency = 1 - calculateStandardDeviation(stats.scores) / 100;
		const volume = Math.min(stats.attempts / 10, 1); // Max boost at 10+ attempts

		skillLevels[category] = Math.round(avgScore * consistency * volume);
	});

	// Identify strengths and weaknesses
	const skillEntries = Object.entries(skillLevels);
	const strengths = skillEntries
		.filter(([_, level]) => level >= 75)
		.map(([skill]) => skill)
		.slice(0, 5);

	const weaknesses = skillEntries
		.filter(([_, level]) => level < 60)
		.sort(([_, a], [__, b]) => a - b)
		.map(([skill]) => skill)
		.slice(0, 3);

	// Infer preferences from behavior
	const preferences = {
		difficulty: inferPreferredDifficulty(attempts),
		timeAvailable: inferTimePreference(attempts),
		focusAreas:
			strengths.length > 0
				? strengths.slice(0, 3)
				: ["Array", "String", "Tree"],
		learningStyle: inferLearningStyle(attempts) as
			| "visual"
			| "practice"
			| "theoretical",
	};

	// Set goals based on current level
	const goals = generateGoals(skillLevels, strengths, weaknesses);

	return {
		skillLevels,
		preferences,
		weaknesses,
		strengths,
		goals,
	};
}

class SmartRecommendationEngine implements RecommendationEngine {
	generatePersonalizedQuiz(profile: UserProfile) {
		const problems: any[] = [];
		const targetSize = 10;

		// 40% focus on weaknesses
		const weaknessProblems = this.selectProblemsForWeaknesses(
			profile,
			Math.floor(targetSize * 0.4),
		);
		problems.push(...weaknessProblems);

		// 40% balanced practice
		const balancedProblems = this.selectBalancedProblems(
			profile,
			Math.floor(targetSize * 0.4),
		);
		problems.push(...balancedProblems);

		// 20% challenge problems (slightly above current level)
		const challengeProblems = this.selectChallengeProblems(
			profile,
			Math.ceil(targetSize * 0.2),
		);
		problems.push(...challengeProblems);

		return {
			type: "personalized_quiz",
			problems: problems.slice(0, targetSize),
			reasoning: {
				weaknessFocus: weaknessProblems.length,
				balancedPractice: balancedProblems.length,
				challengeLevel: challengeProblems.length,
				adaptedDifficulty: this.calculateAdaptiveDifficulty(profile),
			},
			estimatedTime: this.estimateTime(problems, profile),
			goals: this.mapProblemsToGoals(problems, profile.goals),
		};
	}

	suggestLearningPath(profile: UserProfile) {
		const paths = [
			{
				name: "Foundation Builder",
				description: "Strengthen your fundamental algorithmic skills",
				suitable: this.getAverageSkillLevel(profile) < 60,
				duration: "4-6 weeks",
				phases: [
					{
						name: "Arrays & Strings",
						topics: ["Array", "String", "Two Pointers"],
						priority: "high",
					},
					{
						name: "Basic Data Structures",
						topics: ["Stack", "LinkedList", "Hash Table"],
						priority: "high",
					},
					{
						name: "Search & Sort",
						topics: ["Binary Search", "Sorting"],
						priority: "medium",
					},
				],
			},
			{
				name: "Algorithm Specialist",
				description: "Deep dive into advanced algorithmic techniques",
				suitable:
					this.getAverageSkillLevel(profile) >= 60 &&
					this.getAverageSkillLevel(profile) < 80,
				duration: "6-8 weeks",
				phases: [
					{
						name: "Tree & Graph Algorithms",
						topics: ["Tree", "Graph", "DFS", "BFS"],
						priority: "high",
					},
					{
						name: "Dynamic Programming",
						topics: ["Dynamic Programming", "Memoization"],
						priority: "high",
					},
					{
						name: "Advanced Techniques",
						topics: ["Greedy", "Backtracking"],
						priority: "medium",
					},
				],
			},
			{
				name: "Interview Master",
				description: "Master all interview-level problems",
				suitable: this.getAverageSkillLevel(profile) >= 80,
				duration: "8-12 weeks",
				phases: [
					{ name: "Hard Problem Patterns", topics: ["All"], priority: "high" },
					{ name: "System Design Prep", topics: ["Design"], priority: "high" },
					{ name: "Mock Interviews", topics: ["All"], priority: "medium" },
				],
			},
		];

		const suitablePaths = paths.filter((path) => path.suitable);
		const recommendedPath = suitablePaths[0] || paths[0];

		return {
			recommendedPath,
			alternativePaths: paths.filter((path) => path !== recommendedPath),
			customization: this.customizePathForUser(recommendedPath, profile),
			milestones: this.generatePathMilestones(recommendedPath, profile),
		};
	}

	recommendNextProblems(profile: UserProfile) {
		const recommendations = [];

		// Immediate next problems (based on weaknesses)
		const immediate = this.selectProblemsForWeaknesses(profile, 5);
		recommendations.push({
			category: "Immediate Focus",
			problems: immediate,
			reason: "Address your current weak areas",
			priority: "high",
			estimatedTime: "30-45 minutes",
		});

		// Skill building problems
		const skillBuilding = this.selectSkillBuildingProblems(profile, 5);
		recommendations.push({
			category: "Skill Building",
			problems: skillBuilding,
			reason: "Strengthen your existing skills",
			priority: "medium",
			estimatedTime: "45-60 minutes",
		});

		// Challenge problems
		const challenges = this.selectChallengeProblems(profile, 3);
		recommendations.push({
			category: "Challenge Yourself",
			problems: challenges,
			reason: "Push your boundaries",
			priority: "low",
			estimatedTime: "60+ minutes",
		});

		return {
			recommendations,
			studyPlan: this.generateStudyPlan(recommendations, profile),
			nextReviewDate: this.calculateNextReviewDate(profile),
		};
	}

	calculateAdaptiveDifficulty(profile: UserProfile) {
		const avgSkill = this.getAverageSkillLevel(profile);

		let recommendedDifficulty;
		if (avgSkill < 50) recommendedDifficulty = "Easy";
		else if (avgSkill < 70) recommendedDifficulty = "Mixed (Easy/Medium)";
		else if (avgSkill < 85) recommendedDifficulty = "Mixed (Medium/Hard)";
		else recommendedDifficulty = "Hard";

		return {
			current: recommendedDifficulty,
			progression: this.calculateProgressionPath(avgSkill),
			adjustments: this.suggestDifficultyAdjustments(profile),
		};
	}

	analyzeWeaknesses(profile: UserProfile) {
		const analysis = profile.weaknesses.map((weakness) => {
			const skillLevel = profile.skillLevels[weakness] || 0;
			const relatedProblems = comprehensiveProblems.filter(
				(p) => p.category === weakness || p.algorithms.includes(weakness),
			);

			return {
				skill: weakness,
				currentLevel: skillLevel,
				severity:
					skillLevel < 30 ? "Critical" : skillLevel < 50 ? "Major" : "Minor",
				recommendedProblems: relatedProblems.slice(0, 10),
				studyTime: this.calculateStudyTimeForSkill(skillLevel),
				prerequisites: this.getPrerequisites(weakness),
				learningResources: this.getLearningResources(weakness),
			};
		});

		return {
			analysis,
			priorityOrder: analysis.sort((a, b) => a.currentLevel - b.currentLevel),
			studyPlan: this.generateWeaknessStudyPlan(analysis),
		};
	}

	// Helper methods
	private selectProblemsForWeaknesses(profile: UserProfile, count: number) {
		const problems: any[] = [];
		for (const weakness of profile.weaknesses) {
			const weaknessProblems = comprehensiveProblems.filter(
				(p) => p.category === weakness || p.algorithms.includes(weakness),
			);

			// Select easier problems for weaknesses
			const filteredProblems = weaknessProblems.filter(
				(p) =>
					p.difficulty === "Easy" ||
					(p.difficulty === "Medium" && profile.skillLevels[weakness] >= 40),
			);

			problems.push(
				...filteredProblems.slice(
					0,
					Math.ceil(count / profile.weaknesses.length),
				),
			);
		}
		return problems.slice(0, count);
	}

	private selectBalancedProblems(profile: UserProfile, count: number) {
		const categories = Object.keys(profile.skillLevels);
		const problems: any[] = [];

		categories.forEach((category) => {
			const categoryProblems = comprehensiveProblems.filter(
				(p) => p.category === category,
			);
			const skillLevel = profile.skillLevels[category];

			let difficulty;
			if (skillLevel < 50) difficulty = "Easy";
			else if (skillLevel < 75) difficulty = "Medium";
			else difficulty = "Hard";

			const suitableProblems = categoryProblems.filter(
				(p) => p.difficulty === difficulty,
			);
			problems.push(
				...suitableProblems.slice(0, Math.ceil(count / categories.length)),
			);
		});

		return problems.slice(0, count);
	}

	private selectChallengeProblems(profile: UserProfile, count: number) {
		const strongAreas = profile.strengths;
		const problems: any[] = [];

		strongAreas.forEach((area) => {
			const areaProblems = comprehensiveProblems.filter(
				(p) => p.category === area && p.difficulty === "Hard",
			);
			problems.push(
				...areaProblems.slice(0, Math.ceil(count / strongAreas.length)),
			);
		});

		return problems.slice(0, count);
	}

	private selectSkillBuildingProblems(profile: UserProfile, count: number) {
		// Select problems from moderate skill areas to build upon
		const moderateSkills = Object.entries(profile.skillLevels)
			.filter(([_, level]) => level >= 50 && level < 75)
			.map(([skill]) => skill);

		const problems: any[] = [];
		moderateSkills.forEach((skill) => {
			const skillProblems = comprehensiveProblems.filter(
				(p) => p.category === skill && p.difficulty === "Medium",
			);
			problems.push(
				...skillProblems.slice(0, Math.ceil(count / moderateSkills.length)),
			);
		});

		return problems.slice(0, count);
	}

	private getAverageSkillLevel(profile: UserProfile): number {
		const levels = Object.values(profile.skillLevels);
		return levels.length > 0
			? levels.reduce((a, b) => a + b, 0) / levels.length
			: 0;
	}

	private estimateTime(problems: any[], profile: UserProfile): string {
		const avgTime = problems.reduce((total, problem) => {
			const baseTime =
				problem.difficulty === "Easy"
					? 15
					: problem.difficulty === "Medium"
						? 25
						: 35;
			const skillLevel = profile.skillLevels[problem.category] || 50;
			const adjustedTime = baseTime * (1 + (100 - skillLevel) / 200); // Adjust based on skill
			return total + adjustedTime;
		}, 0);

		return `${Math.round(avgTime)} minutes`;
	}

	private mapProblemsToGoals(problems: any[], goals: string[]): any {
		return goals.map((goal) => ({
			goal,
			relevantProblems: problems.filter(
				(p) => p.category === goal || p.algorithms.includes(goal),
			).length,
			contribution: "Supports goal achievement",
		}));
	}

	private customizePathForUser(path: any, profile: UserProfile) {
		return {
			adjustedDuration: this.adjustDurationForUser(path.duration, profile),
			personalizedPhases: path.phases.map((phase: any) => ({
				...phase,
				adjustedPriority: this.adjustPhasePriority(phase, profile),
				estimatedTime: this.estimatePhaseTime(phase, profile),
			})),
		};
	}

	private generatePathMilestones(path: any, _profile: UserProfile) {
		return path.phases.map((phase: any, index: number) => ({
			id: `milestone-${index}`,
			title: phase.name,
			description: `Complete ${phase.name} with 75% average score`,
			requiredProblems: 15,
			targetAccuracy: 75,
			estimatedWeeks: Math.ceil(phase.topics.length * 1.5),
			rewards: {
				points: 100 * (index + 1),
				badge: `${phase.name} Master`,
			},
		}));
	}

	private generateStudyPlan(recommendations: any[], profile: UserProfile) {
		const dailyTime = profile.preferences.timeAvailable || 60; // minutes
		const plan = [];

		for (let day = 1; day <= 7; day++) {
			const dayPlan = {
				day,
				focus:
					day <= 4
						? "Immediate Focus"
						: day <= 6
							? "Skill Building"
							: "Challenge",
				problems: [],
				estimatedTime: dailyTime,
			};

			const relevantCategory = recommendations.find(
				(r) => r.category === dayPlan.focus,
			);
			if (relevantCategory) {
				dayPlan.problems = relevantCategory.problems.slice(
					0,
					Math.ceil(dailyTime / 30),
				);
			}

			plan.push(dayPlan);
		}

		return plan;
	}

	private calculateNextReviewDate(profile: UserProfile): string {
		// Review frequency based on performance
		const avgSkill = this.getAverageSkillLevel(profile);
		const daysUntilReview = avgSkill < 50 ? 3 : avgSkill < 75 ? 5 : 7;

		const reviewDate = new Date();
		reviewDate.setDate(reviewDate.getDate() + daysUntilReview);

		return reviewDate.toISOString().split("T")[0];
	}

	private calculateProgressionPath(avgSkill: number) {
		const milestones = [
			{ skill: 25, difficulty: "Easy", focus: "Basic concepts" },
			{
				skill: 50,
				difficulty: "Mixed Easy/Medium",
				focus: "Pattern recognition",
			},
			{ skill: 70, difficulty: "Medium", focus: "Complex algorithms" },
			{
				skill: 85,
				difficulty: "Mixed Medium/Hard",
				focus: "Advanced techniques",
			},
			{ skill: 95, difficulty: "Hard", focus: "Expert-level problems" },
		];

		return milestones.filter((m) => m.skill > avgSkill).slice(0, 3);
	}

	private suggestDifficultyAdjustments(profile: UserProfile) {
		const suggestions = [];

		if (profile.weaknesses.length > 2) {
			suggestions.push("Focus on easier problems until weaknesses improve");
		}

		if (profile.strengths.length >= 3) {
			suggestions.push("Ready to increase overall difficulty level");
		}

		const recentTrend = 0; // Would calculate from recent attempts
		if (recentTrend > 10) {
			suggestions.push("Consider moving to next difficulty tier");
		}

		return suggestions;
	}

	private adjustDurationForUser(
		baseDuration: string,
		profile: UserProfile,
	): string {
		const avgSkill = this.getAverageSkillLevel(profile);
		const timeAvailable = profile.preferences.timeAvailable || 60;

		// Adjust based on skill level and available time
		const baseWeeks = parseInt(baseDuration.split("-")[0], 10);
		let adjustedWeeks = baseWeeks;

		if (avgSkill > 70) adjustedWeeks *= 0.8; // Faster for advanced users
		if (timeAvailable < 60) adjustedWeeks *= 1.3; // Longer for less time

		return `${Math.ceil(adjustedWeeks)}-${Math.ceil(adjustedWeeks * 1.3)} weeks`;
	}

	private adjustPhasePriority(phase: any, profile: UserProfile): string {
		const phaseSkills = phase.topics.map(
			(topic: string) => profile.skillLevels[topic] || 0,
		);
		const avgPhaseSkill =
			phaseSkills.reduce((a: number, b: number) => a + b, 0) /
			phaseSkills.length;

		if (avgPhaseSkill < 40) return "critical";
		if (avgPhaseSkill < 60) return "high";
		return phase.priority;
	}

	private estimatePhaseTime(phase: any, profile: UserProfile): string {
		const baseTime = phase.topics.length * 10; // 10 hours per topic
		const skillMultiplier =
			phase.topics.reduce((total: number, topic: string) => {
				const skill = profile.skillLevels[topic] || 50;
				return total + (100 - skill) / 100;
			}, 0) / phase.topics.length;

		return `${Math.round(baseTime * (1 + skillMultiplier))} hours`;
	}

	private calculateStudyTimeForSkill(skillLevel: number): string {
		const baseHours = skillLevel < 30 ? 20 : skillLevel < 50 ? 15 : 10;
		return `${baseHours} hours`;
	}

	private getPrerequisites(skill: string): string[] {
		const prerequisites: Record<string, string[]> = {
			"Dynamic Programming": ["Recursion", "Array"],
			Graph: ["Tree", "DFS", "BFS"],
			Backtracking: ["Recursion", "DFS"],
			Tree: ["Recursion"],
			Trie: ["Tree", "String"],
		};

		return prerequisites[skill] || [];
	}

	private getLearningResources(skill: string): string[] {
		return [
			`${skill} - LeetCode Explore`,
			`${skill} - Algorithm Visualization`,
			`${skill} - Practice Problems`,
		];
	}

	private generateWeaknessStudyPlan(analysis: any[]) {
		return analysis.map((weakness, index) => ({
			week: index + 1,
			focus: weakness.skill,
			dailyProblems: 2,
			reviewFrequency: "Every 3 days",
			milestone: `Achieve 60%+ accuracy in ${weakness.skill}`,
		}));
	}
}

// Utility functions
function calculateStandardDeviation(scores: number[]): number {
	const mean = scores.reduce((a, b) => a + b, 0) / scores.length;
	const variance =
		scores.reduce((sum, score) => sum + (score - mean) ** 2, 0) / scores.length;
	return Math.sqrt(variance);
}

function inferPreferredDifficulty(attempts: any[]): string {
	const difficultyCount: Record<string, number> = {};
	attempts.forEach((attempt) => {
		const difficulty = attempt.quiz?.difficulty;
		if (difficulty) {
			difficultyCount[difficulty] = (difficultyCount[difficulty] || 0) + 1;
		}
	});

	const mostCommon = Object.entries(difficultyCount).sort(
		([, a], [, b]) => b - a,
	)[0];

	return mostCommon ? mostCommon[0] : "Mixed";
}

function inferTimePreference(attempts: any[]): number {
	const times = attempts.map((a) => a.timeSpent);
	return times.length > 0
		? Math.round(times.reduce((a, b) => a + b, 0) / times.length)
		: 60;
}

function inferLearningStyle(attempts: any[]): string {
	// Simplified inference based on attempt patterns
	const avgScore =
		attempts.reduce((sum, a) => sum + a.score, 0) / attempts.length;
	if (avgScore > 80) return "practice"; // High scores suggest practice-oriented
	if (attempts.length > 50) return "practice"; // High volume suggests practice
	return "theoretical"; // Default
}

function generateGoals(
	skillLevels: Record<string, number>,
	strengths: string[],
	weaknesses: string[],
): string[] {
	const goals = [];

	// Goals based on weaknesses
	weaknesses.forEach((weakness) => {
		goals.push(`Improve ${weakness} to 70% proficiency`);
	});

	// Goals based on strengths
	if (strengths.length > 0) {
		goals.push(`Master ${strengths[0]} (achieve 90% proficiency)`);
	}

	// Overall goals
	const avgSkill =
		Object.values(skillLevels).reduce((a, b) => a + b, 0) /
		Object.values(skillLevels).length;
	if (avgSkill < 60) {
		goals.push("Reach intermediate level across all topics");
	} else if (avgSkill < 80) {
		goals.push("Achieve advanced proficiency");
	} else {
		goals.push("Maintain expert-level performance");
	}

	return goals.slice(0, 5); // Limit to 5 goals
}

function calculateConfidence(attemptCount: number): string {
	if (attemptCount < 5) return "Low";
	if (attemptCount < 20) return "Medium";
	if (attemptCount < 50) return "High";
	return "Very High";
}
