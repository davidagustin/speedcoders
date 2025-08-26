import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/app/lib/prisma";
import { authOptions } from "@/lib/auth/next-auth";

interface LearningPath {
	id: string;
	name: string;
	description: string;
	skills: string[];
	milestones: Milestone[];
	estimatedHours: number;
	difficulty: "Beginner" | "Intermediate" | "Advanced" | "Expert";
}

interface Milestone {
	id: string;
	title: string;
	description: string;
	requiredSkills: string[];
	points: number;
	unlockCriteria: {
		quizzesCompleted?: number;
		averageScore?: number;
		specificTopics?: string[];
	};
}

const learningPaths: LearningPath[] = [
	{
		id: "arrays-mastery",
		name: "Array Mastery Path",
		description: "Master array manipulation and algorithms",
		skills: ["Arrays", "Two Pointers", "Sliding Window", "Binary Search"],
		milestones: [
			{
				id: "array-basics",
				title: "Array Fundamentals",
				description: "Complete 10 easy array problems with 80% accuracy",
				requiredSkills: ["Arrays"],
				points: 100,
				unlockCriteria: {
					quizzesCompleted: 10,
					averageScore: 80,
					specificTopics: ["Array"],
				},
			},
			{
				id: "two-pointer-master",
				title: "Two Pointer Technique",
				description: "Master two-pointer problems",
				requiredSkills: ["Arrays", "Two Pointers"],
				points: 150,
				unlockCriteria: {
					quizzesCompleted: 5,
					averageScore: 75,
					specificTopics: ["Two Pointers"],
				},
			},
			{
				id: "sliding-window-expert",
				title: "Sliding Window Expert",
				description: "Solve complex sliding window problems",
				requiredSkills: ["Arrays", "Sliding Window"],
				points: 200,
				unlockCriteria: {
					quizzesCompleted: 8,
					averageScore: 70,
					specificTopics: ["Sliding Window"],
				},
			},
		],
		estimatedHours: 25,
		difficulty: "Beginner",
	},
	{
		id: "dynamic-programming",
		name: "Dynamic Programming Mastery",
		description: "Conquer the most challenging algorithmic paradigm",
		skills: ["Dynamic Programming", "Memoization", "Recursion"],
		milestones: [
			{
				id: "dp-intro",
				title: "DP Foundation",
				description:
					"Understand basic DP concepts and solve 5 classic problems",
				requiredSkills: ["Dynamic Programming", "Recursion"],
				points: 250,
				unlockCriteria: {
					quizzesCompleted: 5,
					averageScore: 60,
					specificTopics: ["Dynamic Programming"],
				},
			},
			{
				id: "dp-optimization",
				title: "DP Optimization",
				description: "Master space and time optimization in DP",
				requiredSkills: ["Dynamic Programming", "Memoization"],
				points: 350,
				unlockCriteria: {
					quizzesCompleted: 10,
					averageScore: 70,
					specificTopics: ["Dynamic Programming"],
				},
			},
		],
		estimatedHours: 40,
		difficulty: "Advanced",
	},
	{
		id: "system-design-prep",
		name: "System Design Preparation",
		description: "Prepare for system design interviews",
		skills: ["System Design", "Scalability", "Database Design", "Caching"],
		milestones: [
			{
				id: "basics-covered",
				title: "Fundamentals Complete",
				description: "Complete all basic algorithm categories",
				requiredSkills: ["Arrays", "Strings", "Trees", "Graphs"],
				points: 500,
				unlockCriteria: { quizzesCompleted: 50, averageScore: 75 },
			},
		],
		estimatedHours: 60,
		difficulty: "Expert",
	},
];

export async function GET(_request: Request) {
	try {
		const session = await getServerSession(authOptions);

		if (!session?.user?.email) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const userId = session.user.email;

		// Get user's quiz attempts and calculate progress
		const attempts = await prisma.quizAttempt.findMany({
			where: { userId },
			include: { quiz: true },
			orderBy: { completedAt: "desc" },
		});

		// Calculate skill proficiency
		const skillProgress = calculateSkillProgress(attempts);

		// Calculate learning path progress
		const pathProgress = calculateLearningPathProgress(attempts, skillProgress);

		// Get achievements
		const achievements = calculateAchievements(attempts, skillProgress);

		// Calculate overall statistics
		const overallStats = calculateOverallStats(attempts);

		// Generate personalized recommendations
		const recommendations = generateRecommendations(
			skillProgress,
			pathProgress,
			attempts,
		);

		return NextResponse.json({
			skillProgress,
			pathProgress,
			achievements,
			overallStats,
			recommendations,
			availablePaths: learningPaths,
		});
	} catch (error) {
		console.error("Detailed progress error:", error);
		return NextResponse.json(
			{ error: "Failed to fetch detailed progress" },
			{ status: 500 },
		);
	}
}

function calculateSkillProgress(attempts: any[]) {
	const skillStats: Record<string, any> = {};

	attempts.forEach((attempt) => {
		const category = attempt.quiz?.category;
		if (category) {
			if (!skillStats[category]) {
				skillStats[category] = {
					totalAttempts: 0,
					totalScore: 0,
					bestScore: 0,
					averageScore: 0,
					recentTrend: [],
					proficiencyLevel: "Beginner",
					timeSpent: 0,
				};
			}

			skillStats[category].totalAttempts++;
			skillStats[category].totalScore += attempt.score;
			skillStats[category].bestScore = Math.max(
				skillStats[category].bestScore,
				attempt.score,
			);
			skillStats[category].timeSpent += attempt.timeSpent;
			skillStats[category].recentTrend.push({
				date: attempt.completedAt,
				score: attempt.score,
			});
		}
	});

	// Calculate averages and proficiency levels
	Object.keys(skillStats).forEach((skill) => {
		const stats = skillStats[skill];
		stats.averageScore = stats.totalScore / stats.totalAttempts;
		stats.recentTrend = stats.recentTrend.slice(-10); // Keep last 10

		// Determine proficiency level
		if (stats.averageScore >= 90) stats.proficiencyLevel = "Expert";
		else if (stats.averageScore >= 75) stats.proficiencyLevel = "Advanced";
		else if (stats.averageScore >= 60) stats.proficiencyLevel = "Intermediate";
		else stats.proficiencyLevel = "Beginner";
	});

	return skillStats;
}

function calculateLearningPathProgress(
	attempts: any[],
	skillProgress: Record<string, any>,
) {
	return learningPaths.map((path) => {
		const completedMilestones = path.milestones.filter((milestone) =>
			isMilestoneCompleted(milestone, attempts, skillProgress),
		);

		const totalMilestones = path.milestones.length;
		const completionPercentage =
			(completedMilestones.length / totalMilestones) * 100;

		const requiredSkills = path.skills;
		const masteredSkills = requiredSkills.filter(
			(skill) =>
				skillProgress[skill]?.proficiencyLevel === "Expert" ||
				skillProgress[skill]?.proficiencyLevel === "Advanced",
		);

		const nextMilestone = path.milestones.find(
			(milestone) => !isMilestoneCompleted(milestone, attempts, skillProgress),
		);

		return {
			...path,
			completionPercentage,
			completedMilestones: completedMilestones.length,
			totalMilestones,
			masteredSkills: masteredSkills.length,
			totalSkills: requiredSkills.length,
			nextMilestone,
			isUnlocked: isPathUnlocked(path, skillProgress),
			estimatedTimeRemaining: calculateTimeRemaining(
				path,
				completionPercentage,
			),
		};
	});
}

function isMilestoneCompleted(
	milestone: Milestone,
	attempts: any[],
	skillProgress: Record<string, any>,
): boolean {
	const criteria = milestone.unlockCriteria;

	if (criteria.quizzesCompleted) {
		const relevantAttempts = attempts.filter((attempt) =>
			criteria.specificTopics
				? criteria.specificTopics.includes(attempt.quiz?.category)
				: true,
		);
		if (relevantAttempts.length < criteria.quizzesCompleted) return false;
	}

	if (criteria.averageScore && criteria.specificTopics) {
		const topicScores = criteria.specificTopics.map(
			(topic) => skillProgress[topic]?.averageScore || 0,
		);
		const avgScore =
			topicScores.reduce((a, b) => a + b, 0) / topicScores.length;
		if (avgScore < criteria.averageScore) return false;
	}

	return true;
}

function isPathUnlocked(
	path: LearningPath,
	skillProgress: Record<string, any>,
): boolean {
	if (path.difficulty === "Beginner") return true;
	if (path.difficulty === "Intermediate") {
		return Object.values(skillProgress).some(
			(skill: any) =>
				skill.proficiencyLevel === "Intermediate" ||
				skill.proficiencyLevel === "Advanced" ||
				skill.proficiencyLevel === "Expert",
		);
	}
	if (path.difficulty === "Advanced") {
		return Object.values(skillProgress).some(
			(skill: any) =>
				skill.proficiencyLevel === "Advanced" ||
				skill.proficiencyLevel === "Expert",
		);
	}
	if (path.difficulty === "Expert") {
		return (
			Object.values(skillProgress).filter(
				(skill: any) => skill.proficiencyLevel === "Expert",
			).length >= 3
		);
	}
	return false;
}

function calculateTimeRemaining(
	path: LearningPath,
	completionPercentage: number,
): number {
	return Math.max(
		0,
		Math.round((path.estimatedHours * (100 - completionPercentage)) / 100),
	);
}

function calculateAchievements(
	attempts: any[],
	skillProgress: Record<string, any>,
) {
	const achievements = [];

	// Streak achievements
	let _currentStreak = 0;
	let maxStreak = 0;
	let tempStreak = 0;

	for (let i = 0; i < attempts.length; i++) {
		if (attempts[i].score >= 75) {
			tempStreak++;
			maxStreak = Math.max(maxStreak, tempStreak);
			if (i === attempts.length - 1) _currentStreak = tempStreak;
		} else {
			tempStreak = 0;
		}
	}

	if (maxStreak >= 5) {
		achievements.push({
			id: "streak-5",
			name: "Consistent Performer",
			description: "Achieved 5 consecutive high scores",
			icon: "🔥",
			points: 100,
			unlockedAt: new Date(),
			rarity: "Common",
		});
	}

	if (maxStreak >= 10) {
		achievements.push({
			id: "streak-10",
			name: "Unstoppable",
			description: "Achieved 10 consecutive high scores",
			icon: "⚡",
			points: 250,
			unlockedAt: new Date(),
			rarity: "Rare",
		});
	}

	// Skill mastery achievements
	const expertSkills = Object.keys(skillProgress).filter(
		(skill) => skillProgress[skill].proficiencyLevel === "Expert",
	);

	if (expertSkills.length >= 1) {
		achievements.push({
			id: "first-expert",
			name: "Subject Matter Expert",
			description: "Reached expert level in your first skill",
			icon: "🎯",
			points: 200,
			unlockedAt: new Date(),
			rarity: "Uncommon",
		});
	}

	if (expertSkills.length >= 3) {
		achievements.push({
			id: "triple-expert",
			name: "Renaissance Coder",
			description: "Mastered three different algorithmic areas",
			icon: "🌟",
			points: 500,
			unlockedAt: new Date(),
			rarity: "Epic",
		});
	}

	// Volume achievements
	if (attempts.length >= 50) {
		achievements.push({
			id: "volume-50",
			name: "Dedicated Student",
			description: "Completed 50 quizzes",
			icon: "📚",
			points: 300,
			unlockedAt: new Date(),
			rarity: "Uncommon",
		});
	}

	if (attempts.length >= 100) {
		achievements.push({
			id: "volume-100",
			name: "Century Club",
			description: "Completed 100 quizzes",
			icon: "💯",
			points: 750,
			unlockedAt: new Date(),
			rarity: "Rare",
		});
	}

	return achievements;
}

function calculateOverallStats(attempts: any[]) {
	if (attempts.length === 0) {
		return {
			totalQuizzes: 0,
			averageScore: 0,
			totalTimeSpent: 0,
			bestStreak: 0,
			totalPoints: 0,
			rank: "Beginner",
			percentile: 0,
		};
	}

	const totalQuizzes = attempts.length;
	const averageScore =
		attempts.reduce((sum, a) => sum + a.score, 0) / totalQuizzes;
	const totalTimeSpent = attempts.reduce((sum, a) => sum + a.timeSpent, 0);

	// Calculate best streak
	let bestStreak = 0;
	let currentStreak = 0;

	for (const attempt of attempts) {
		if (attempt.score >= 75) {
			currentStreak++;
			bestStreak = Math.max(bestStreak, currentStreak);
		} else {
			currentStreak = 0;
		}
	}

	// Calculate total points (simplified)
	const totalPoints = Math.round((averageScore * totalQuizzes) / 10);

	// Determine rank
	let rank = "Beginner";
	if (totalPoints >= 1000 && averageScore >= 80) rank = "Expert";
	else if (totalPoints >= 500 && averageScore >= 70) rank = "Advanced";
	else if (totalPoints >= 200 && averageScore >= 60) rank = "Intermediate";

	return {
		totalQuizzes,
		averageScore: Math.round(averageScore),
		totalTimeSpent,
		bestStreak,
		totalPoints,
		rank,
		percentile: Math.min(95, Math.round((averageScore - 50) * 2)), // Simplified percentile
	};
}

function generateRecommendations(
	skillProgress: Record<string, any>,
	pathProgress: any[],
	attempts: any[],
) {
	const recommendations = [];

	// Identify weak areas
	const weakSkills = Object.entries(skillProgress)
		.filter(([_, stats]: [string, any]) => stats.averageScore < 60)
		.sort(
			([_, a]: [string, any], [__, b]: [string, any]) =>
				a.averageScore - b.averageScore,
		)
		.slice(0, 3);

	if (weakSkills.length > 0) {
		recommendations.push({
			type: "improvement",
			priority: "high",
			title: "Focus on Weak Areas",
			description: `Consider practicing more ${weakSkills.map(([skill]) => skill).join(", ")}`,
			action: "Take targeted quizzes",
			estimatedTime: "2-3 hours per week",
		});
	}

	// Learning path recommendations
	const availablePaths = pathProgress
		.filter((path) => path.isUnlocked && path.completionPercentage < 100)
		.sort((a, b) => b.completionPercentage - a.completionPercentage);

	if (availablePaths.length > 0) {
		const suggestedPath = availablePaths[0];
		recommendations.push({
			type: "path",
			priority: "medium",
			title: `Continue ${suggestedPath.name}`,
			description: `You're ${Math.round(suggestedPath.completionPercentage)}% complete`,
			action: "Complete next milestone",
			estimatedTime: `${suggestedPath.estimatedTimeRemaining} hours remaining`,
		});
	}

	// Streak maintenance
	const recentAttempts = attempts.slice(0, 5);
	const recentAverage =
		recentAttempts.reduce((sum, a) => sum + a.score, 0) / recentAttempts.length;

	if (recentAverage >= 80) {
		recommendations.push({
			type: "challenge",
			priority: "low",
			title: "Ready for Harder Problems",
			description:
				"Your recent performance suggests you can handle more difficult challenges",
			action: "Try harder difficulty settings",
			estimatedTime: "Same as current pace",
		});
	}

	return recommendations;
}
