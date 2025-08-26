import { CacheService } from "./CacheService";
import { supabase } from "./supabase";

export interface UserProgress {
	userId: string;
	totalProblems: number;
	solvedProblems: number;
	easyProblems: number;
	mediumProblems: number;
	hardProblems: number;
	totalQuizzes: number;
	completedQuizzes: number;
	averageScore: number;
	studyStreak: number;
	longestStreak: number;
	totalStudyTime: number;
	lastActive: string;
	skillLevels: Record<string, SkillLevel>;
	achievements: Achievement[];
	recentActivity: ActivityEntry[];
}

export interface SkillLevel {
	category: string;
	level: number;
	experience: number;
	maxExperience: number;
	problems: number;
	accuracy: number;
}

export interface Achievement {
	id: string;
	name: string;
	description: string;
	icon: string;
	unlockedAt: string;
	category: "problem_solving" | "streak" | "quiz" | "speed" | "accuracy";
	rarity: "common" | "rare" | "epic" | "legendary";
}

export interface ActivityEntry {
	id: string;
	type:
		| "problem_solved"
		| "quiz_completed"
		| "achievement_unlocked"
		| "streak_milestone";
	title: string;
	description: string;
	timestamp: string;
	points?: number;
	metadata?: Record<string, any>;
}

export interface StudySession {
	id: string;
	userId: string;
	startTime: string;
	endTime?: string;
	duration: number;
	problemsSolved: number;
	quizzesCompleted: number;
	topicsStudied: string[];
	performance: number;
}

export class ProgressTracker {
	private cache = CacheService.getInstance();

	async getUserProgress(
		userId: string,
		forceRefresh = false,
	): Promise<UserProgress | null> {
		try {
			// Check cache first unless refresh is forced
			if (!forceRefresh) {
				const cached = await this.cache.get<UserProgress>(`progress:${userId}`);
				if (cached) return cached;
			}

			// Fetch user's problem solving stats
			const [
				problemStats,
				quizStats,
				streakData,
				skillData,
				achievements,
				activities,
			] = await Promise.all([
				this.getProblemStats(userId),
				this.getQuizStats(userId),
				this.getStreakData(userId),
				this.getSkillLevels(userId),
				this.getUserAchievements(userId),
				this.getRecentActivity(userId),
			]);

			const progress: UserProgress = {
				userId,
				...problemStats,
				...quizStats,
				...streakData,
				skillLevels: skillData,
				achievements,
				recentActivity: activities,
				lastActive: new Date().toISOString(),
			};

			// Cache for 5 minutes
			await this.cache.set(`progress:${userId}`, progress, 300);

			return progress;
		} catch (error) {
			console.error("Error fetching user progress:", error);
			return null;
		}
	}

	async updateProblemProgress(
		userId: string,
		problemId: string,
		difficulty: "Easy" | "Medium" | "Hard",
		category: string,
		timeSpent: number,
		correct: boolean,
	): Promise<void> {
		try {
			// Record the problem attempt
			await supabase.from("problem_attempts").insert({
				user_id: userId,
				problem_id: problemId,
				difficulty,
				category,
				time_spent: timeSpent,
				correct,
				attempted_at: new Date().toISOString(),
			});

			if (correct) {
				// Add experience points
				const points = this.calculatePoints(difficulty, timeSpent);
				await this.addExperience(userId, category, points);

				// Update streak
				await this.updateStreak(userId);

				// Check for achievements
				await this.checkAchievements(userId);

				// Add activity entry
				await this.addActivity(userId, {
					type: "problem_solved",
					title: `Solved ${difficulty} Problem`,
					description: `Completed a ${difficulty.toLowerCase()} problem in ${category}`,
					points,
				});
			}

			// Invalidate cache
			await this.cache.delete(`progress:${userId}`);
		} catch (error) {
			console.error("Error updating problem progress:", error);
		}
	}

	async updateQuizProgress(
		userId: string,
		quizId: string,
		score: number,
		timeSpent: number,
		categories: string[],
	): Promise<void> {
		try {
			// Calculate experience based on score
			const basePoints = Math.round(score * 2); // 2 points per percentage point
			const timeBonus = timeSpent < 600 ? 10 : 0; // Bonus for completing under 10 minutes
			const totalPoints = basePoints + timeBonus;

			// Add experience to all categories in the quiz
			for (const category of categories) {
				await this.addExperience(
					userId,
					category,
					Math.round(totalPoints / categories.length),
				);
			}

			// Update streak if score >= 70%
			if (score >= 70) {
				await this.updateStreak(userId);
			}

			// Add activity entry
			await this.addActivity(userId, {
				type: "quiz_completed",
				title: `Quiz Completed`,
				description: `Scored ${score}% on quiz`,
				points: totalPoints,
			});

			// Check for achievements
			await this.checkAchievements(userId);

			// Invalidate cache
			await this.cache.delete(`progress:${userId}`);
		} catch (error) {
			console.error("Error updating quiz progress:", error);
		}
	}

	async startStudySession(userId: string, topics: string[]): Promise<string> {
		try {
			const { data, error } = await supabase
				.from("study_sessions")
				.insert({
					user_id: userId,
					start_time: new Date().toISOString(),
					topics_studied: topics,
					problems_solved: 0,
					quizzes_completed: 0,
				})
				.select("id")
				.single();

			if (error) throw error;

			return data.id;
		} catch (error) {
			console.error("Error starting study session:", error);
			throw error;
		}
	}

	async endStudySession(
		sessionId: string,
		problemsSolved: number,
		quizzesCompleted: number,
	): Promise<StudySession | null> {
		try {
			const endTime = new Date().toISOString();

			const { data, error } = await supabase
				.from("study_sessions")
				.update({
					end_time: endTime,
					problems_solved: problemsSolved,
					quizzes_completed: quizzesCompleted,
				})
				.eq("id", sessionId)
				.select("*")
				.single();

			if (error) throw error;

			// Calculate session performance
			const startTime = new Date(data.start_time).getTime();
			const duration = new Date(endTime).getTime() - startTime;
			const performance = this.calculateSessionPerformance(
				duration,
				problemsSolved,
				quizzesCompleted,
			);

			await supabase
				.from("study_sessions")
				.update({ performance })
				.eq("id", sessionId);

			return {
				id: data.id,
				userId: data.user_id,
				startTime: data.start_time,
				endTime,
				duration,
				problemsSolved,
				quizzesCompleted,
				topicsStudied: data.topics_studied || [],
				performance,
			};
		} catch (error) {
			console.error("Error ending study session:", error);
			return null;
		}
	}

	async getLeaderboard(
		category?: string,
		timeFrame: "week" | "month" | "all" = "week",
	): Promise<
		Array<{
			userId: string;
			username: string;
			score: number;
			problemsSolved: number;
			rank: number;
		}>
	> {
		try {
			const cacheKey = `leaderboard:${category || "all"}:${timeFrame}`;
			const cached = await this.cache.get<any[]>(cacheKey);
			if (cached) return cached;

			let timeFilter = "";
			const now = new Date();

			if (timeFrame === "week") {
				const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
				timeFilter = `AND created_at >= '${weekAgo.toISOString()}'`;
			} else if (timeFrame === "month") {
				const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
				timeFilter = `AND created_at >= '${monthAgo.toISOString()}'`;
			}

			const categoryFilter = category ? `AND category = '${category}'` : "";

			const { data, error } = await supabase.rpc("get_leaderboard", {
				time_filter: timeFilter,
				category_filter: categoryFilter,
			});

			if (error) throw error;

			const leaderboard = (data || []).map((entry: any, index: number) => ({
				userId: entry.user_id,
				username: entry.username || `User${entry.user_id.slice(-4)}`,
				score: entry.total_score || 0,
				problemsSolved: entry.problems_solved || 0,
				rank: index + 1,
			}));

			// Cache for 10 minutes
			await this.cache.set(cacheKey, leaderboard, 600);

			return leaderboard;
		} catch (error) {
			console.error("Error fetching leaderboard:", error);
			return [];
		}
	}

	private async getProblemStats(userId: string) {
		const { data, error } = await supabase
			.from("problem_attempts")
			.select("difficulty, correct")
			.eq("user_id", userId);

		if (error) throw error;

		const attempts = data || [];
		const solved = attempts.filter((a) => a.correct);

		return {
			totalProblems: attempts.length,
			solvedProblems: solved.length,
			easyProblems: solved.filter((p) => p.difficulty === "Easy").length,
			mediumProblems: solved.filter((p) => p.difficulty === "Medium").length,
			hardProblems: solved.filter((p) => p.difficulty === "Hard").length,
		};
	}

	private async getQuizStats(userId: string) {
		const { data, error } = await supabase
			.from("quiz_attempts")
			.select("score, status")
			.eq("user_id", userId);

		if (error) throw error;

		const attempts = data || [];
		const completed = attempts.filter((a) => a.status === "completed");
		const avgScore =
			completed.length > 0
				? completed.reduce((sum, a) => sum + a.score, 0) / completed.length
				: 0;

		return {
			totalQuizzes: attempts.length,
			completedQuizzes: completed.length,
			averageScore: Math.round(avgScore * 10) / 10,
			totalStudyTime: 0, // This would come from study_sessions
		};
	}

	private async getStreakData(userId: string) {
		const { data, error } = await supabase
			.from("user_streaks")
			.select("*")
			.eq("user_id", userId)
			.single();

		if (error || !data) {
			return { studyStreak: 0, longestStreak: 0 };
		}

		return {
			studyStreak: data.current_streak || 0,
			longestStreak: data.longest_streak || 0,
		};
	}

	private async getSkillLevels(
		userId: string,
	): Promise<Record<string, SkillLevel>> {
		const { data, error } = await supabase
			.from("user_skills")
			.select("*")
			.eq("user_id", userId);

		if (error) throw error;

		const skills: Record<string, SkillLevel> = {};

		for (const skill of data || []) {
			skills[skill.category] = {
				category: skill.category,
				level: skill.level || 1,
				experience: skill.experience || 0,
				maxExperience: this.getMaxExperienceForLevel(skill.level || 1),
				problems: skill.problems_solved || 0,
				accuracy: skill.accuracy || 0,
			};
		}

		return skills;
	}

	private async getUserAchievements(userId: string): Promise<Achievement[]> {
		const { data, error } = await supabase
			.from("user_achievements")
			.select(`
        achievement_id,
        unlocked_at,
        achievements (
          name,
          description,
          icon,
          category,
          rarity
        )
      `)
			.eq("user_id", userId);

		if (error) throw error;

		return (data || []).map((ua: any) => ({
			id: ua.achievement_id,
			name: ua.achievements?.name || "Achievement",
			description: ua.achievements?.description || "Achievement unlocked",
			icon: ua.achievements?.icon || "🏆",
			unlockedAt: ua.unlocked_at,
			category: ua.achievements?.category || "general",
			rarity: ua.achievements?.rarity || "common",
		}));
	}

	private async getRecentActivity(userId: string): Promise<ActivityEntry[]> {
		const { data, error } = await supabase
			.from("user_activities")
			.select("*")
			.eq("user_id", userId)
			.order("created_at", { ascending: false })
			.limit(10);

		if (error) throw error;

		return (data || []).map((activity) => ({
			id: activity.id,
			type: activity.type,
			title: activity.title,
			description: activity.description,
			timestamp: activity.created_at,
			points: activity.points,
			metadata: activity.metadata,
		}));
	}

	private calculatePoints(difficulty: string, timeSpent: number): number {
		const basePoints = {
			Easy: 10,
			Medium: 20,
			Hard: 35,
		};

		const base = basePoints[difficulty as keyof typeof basePoints] || 10;
		const timeBonus = Math.max(0, 10 - Math.floor(timeSpent / 60000)); // Bonus for speed

		return base + timeBonus;
	}

	private async addExperience(
		userId: string,
		category: string,
		points: number,
	): Promise<void> {
		// This would update the user_skills table
		const { data: existing } = await supabase
			.from("user_skills")
			.select("*")
			.eq("user_id", userId)
			.eq("category", category)
			.single();

		const currentExp = existing?.experience || 0;
		const newExp = currentExp + points;
		const newLevel = this.calculateLevel(newExp);

		if (existing) {
			await supabase
				.from("user_skills")
				.update({
					experience: newExp,
					level: newLevel,
				})
				.eq("id", existing.id);
		} else {
			await supabase.from("user_skills").insert({
				user_id: userId,
				category,
				experience: newExp,
				level: newLevel,
			});
		}
	}

	private async updateStreak(userId: string): Promise<void> {
		// This would update the user_streaks table
		// Implementation would check if user has activity today vs yesterday
	}

	private async checkAchievements(userId: string): Promise<void> {
		// This would check for new achievements based on current progress
		// Implementation would query achievement conditions and award new ones
	}

	private async addActivity(
		userId: string,
		activity: Omit<ActivityEntry, "id" | "timestamp">,
	): Promise<void> {
		await supabase.from("user_activities").insert({
			user_id: userId,
			type: activity.type,
			title: activity.title,
			description: activity.description,
			points: activity.points,
			metadata: activity.metadata,
		});
	}

	private calculateLevel(experience: number): number {
		// Simple level calculation: 100 XP per level, increasing by 50 each level
		let level = 1;
		let requiredExp = 100;

		while (experience >= requiredExp) {
			experience -= requiredExp;
			level++;
			requiredExp += 50;
		}

		return level;
	}

	private getMaxExperienceForLevel(level: number): number {
		return 100 + (level - 1) * 50;
	}

	private calculateSessionPerformance(
		duration: number,
		problems: number,
		quizzes: number,
	): number {
		const hours = duration / (1000 * 60 * 60);
		const productivity = (problems * 10 + quizzes * 20) / Math.max(hours, 0.1);
		return Math.min(100, Math.round(productivity));
	}
}

export const progressTracker = new ProgressTracker();
