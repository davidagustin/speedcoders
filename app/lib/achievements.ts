export interface Achievement {
	id: string;
	name: string;
	description: string;
	icon: string;
	rarity: "common" | "rare" | "epic" | "legendary";
	category:
		| "solving"
		| "streak"
		| "speed"
		| "accuracy"
		| "algorithm"
		| "special";
	requirement: {
		type: "count" | "streak" | "time" | "accuracy" | "special";
		value: number;
		condition?: string;
	};
	reward: {
		experience: number;
		badge?: string;
		title?: string;
	};
	isSecret: boolean;
	unlockedAt?: Date;
	progress?: number;
	totalRequired?: number;
}

export interface UserAchievement {
	userId: string;
	achievementId: string;
	unlockedAt: Date;
	progress: number;
	isNotified: boolean;
}

export interface Badge {
	id: string;
	name: string;
	description: string;
	icon: string;
	rarity: "common" | "rare" | "epic" | "legendary";
	achievementId: string;
	earnedAt?: Date;
}

export class AchievementSystem {
	private achievements: Achievement[] = [];
	private userAchievements: Map<string, UserAchievement[]> = new Map();

	constructor() {
		this.initializeAchievements();
	}

	private initializeAchievements() {
		this.achievements = [
			// Solving Achievements
			{
				id: "first-problem",
				name: "Getting Started",
				description: "Solve your first problem",
				icon: "🎯",
				rarity: "common",
				category: "solving",
				requirement: { type: "count", value: 1 },
				reward: { experience: 10, badge: "newcomer" },
				isSecret: false,
			},
			{
				id: "problem-solver-10",
				name: "Problem Solver",
				description: "Solve 10 problems",
				icon: "🧩",
				rarity: "common",
				category: "solving",
				requirement: { type: "count", value: 10 },
				reward: { experience: 50, badge: "solver" },
				isSecret: false,
			},
			{
				id: "century-club",
				name: "Century Club",
				description: "Solve 100 problems",
				icon: "💯",
				rarity: "rare",
				category: "solving",
				requirement: { type: "count", value: 100 },
				reward: { experience: 500, badge: "century", title: "Centurion" },
				isSecret: false,
			},
			{
				id: "problem-master",
				name: "Problem Master",
				description: "Solve 500 problems",
				icon: "👑",
				rarity: "epic",
				category: "solving",
				requirement: { type: "count", value: 500 },
				reward: { experience: 2000, badge: "master", title: "Master Solver" },
				isSecret: false,
			},
			{
				id: "legendary-solver",
				name: "Legendary Solver",
				description: "Solve 1000 problems",
				icon: "🏆",
				rarity: "legendary",
				category: "solving",
				requirement: { type: "count", value: 1000 },
				reward: { experience: 5000, badge: "legendary", title: "Legend" },
				isSecret: false,
			},

			// Streak Achievements
			{
				id: "streak-starter",
				name: "Streak Starter",
				description: "Maintain a 3-day solving streak",
				icon: "🔥",
				rarity: "common",
				category: "streak",
				requirement: { type: "streak", value: 3 },
				reward: { experience: 30 },
				isSecret: false,
			},
			{
				id: "dedicated",
				name: "Dedicated",
				description: "Maintain a 7-day solving streak",
				icon: "⚡",
				rarity: "common",
				category: "streak",
				requirement: { type: "streak", value: 7 },
				reward: { experience: 70, badge: "dedicated" },
				isSecret: false,
			},
			{
				id: "unstoppable",
				name: "Unstoppable",
				description: "Maintain a 30-day solving streak",
				icon: "🚀",
				rarity: "rare",
				category: "streak",
				requirement: { type: "streak", value: 30 },
				reward: { experience: 300, badge: "unstoppable", title: "Unstoppable" },
				isSecret: false,
			},
			{
				id: "marathon-runner",
				name: "Marathon Runner",
				description: "Maintain a 100-day solving streak",
				icon: "🏃‍♂️",
				rarity: "epic",
				category: "streak",
				requirement: { type: "streak", value: 100 },
				reward: {
					experience: 1000,
					badge: "marathon",
					title: "Marathon Runner",
				},
				isSecret: false,
			},

			// Speed Achievements
			{
				id: "speed-demon",
				name: "Speed Demon",
				description: "Solve an Easy problem in under 5 minutes",
				icon: "💨",
				rarity: "common",
				category: "speed",
				requirement: { type: "time", value: 300, condition: "difficulty:Easy" },
				reward: { experience: 25, badge: "speedy" },
				isSecret: false,
			},
			{
				id: "lightning-fast",
				name: "Lightning Fast",
				description: "Solve a Medium problem in under 10 minutes",
				icon: "⚡",
				rarity: "rare",
				category: "speed",
				requirement: {
					type: "time",
					value: 600,
					condition: "difficulty:Medium",
				},
				reward: { experience: 100, badge: "lightning" },
				isSecret: false,
			},
			{
				id: "flash",
				name: "The Flash",
				description: "Solve a Hard problem in under 15 minutes",
				icon: "🌪️",
				rarity: "epic",
				category: "speed",
				requirement: { type: "time", value: 900, condition: "difficulty:Hard" },
				reward: { experience: 300, badge: "flash", title: "Speed Master" },
				isSecret: false,
			},

			// Accuracy Achievements
			{
				id: "perfectionist",
				name: "Perfectionist",
				description: "Maintain 100% accuracy over 10 problems",
				icon: "💎",
				rarity: "rare",
				category: "accuracy",
				requirement: { type: "accuracy", value: 100, condition: "count:10" },
				reward: { experience: 200, badge: "perfect" },
				isSecret: false,
			},
			{
				id: "sharpshooter",
				name: "Sharpshooter",
				description: "Maintain 95% accuracy over 50 problems",
				icon: "🎯",
				rarity: "epic",
				category: "accuracy",
				requirement: { type: "accuracy", value: 95, condition: "count:50" },
				reward: {
					experience: 500,
					badge: "sharpshooter",
					title: "Sharpshooter",
				},
				isSecret: false,
			},

			// Algorithm-specific Achievements
			{
				id: "array-master",
				name: "Array Master",
				description: "Solve 25 Array problems",
				icon: "📊",
				rarity: "common",
				category: "algorithm",
				requirement: { type: "count", value: 25, condition: "category:Array" },
				reward: { experience: 100, badge: "array-master" },
				isSecret: false,
			},
			{
				id: "dp-wizard",
				name: "DP Wizard",
				description: "Solve 20 Dynamic Programming problems",
				icon: "🧙‍♂️",
				rarity: "rare",
				category: "algorithm",
				requirement: {
					type: "count",
					value: 20,
					condition: "category:Dynamic Programming",
				},
				reward: { experience: 200, badge: "dp-wizard", title: "DP Master" },
				isSecret: false,
			},
			{
				id: "graph-explorer",
				name: "Graph Explorer",
				description: "Solve 15 Graph problems",
				icon: "🗺️",
				rarity: "rare",
				category: "algorithm",
				requirement: { type: "count", value: 15, condition: "category:Graph" },
				reward: { experience: 150, badge: "graph-explorer" },
				isSecret: false,
			},
			{
				id: "tree-climber",
				name: "Tree Climber",
				description: "Solve 20 Tree problems",
				icon: "🌳",
				rarity: "common",
				category: "algorithm",
				requirement: { type: "count", value: 20, condition: "category:Tree" },
				reward: { experience: 120, badge: "tree-climber" },
				isSecret: false,
			},

			// Special Achievements
			{
				id: "early-bird",
				name: "Early Bird",
				description: "Solve a problem before 6 AM",
				icon: "🐦",
				rarity: "common",
				category: "special",
				requirement: {
					type: "special",
					value: 1,
					condition: "time:before-6am",
				},
				reward: { experience: 25, badge: "early-bird" },
				isSecret: false,
			},
			{
				id: "night-owl",
				name: "Night Owl",
				description: "Solve a problem after 11 PM",
				icon: "🦉",
				rarity: "common",
				category: "special",
				requirement: {
					type: "special",
					value: 1,
					condition: "time:after-11pm",
				},
				reward: { experience: 25, badge: "night-owl" },
				isSecret: false,
			},
			{
				id: "weekend-warrior",
				name: "Weekend Warrior",
				description: "Solve 10 problems on weekends",
				icon: "🏋️‍♂️",
				rarity: "common",
				category: "special",
				requirement: { type: "count", value: 10, condition: "time:weekend" },
				reward: { experience: 50, badge: "weekend-warrior" },
				isSecret: false,
			},
			{
				id: "polyglot",
				name: "Polyglot",
				description: "Solve problems in 3 different programming languages",
				icon: "🌍",
				rarity: "rare",
				category: "special",
				requirement: {
					type: "special",
					value: 3,
					condition: "languages:different",
				},
				reward: { experience: 150, badge: "polyglot", title: "Code Polyglot" },
				isSecret: false,
			},
			{
				id: "competitor",
				name: "Competitor",
				description: "Participate in 5 contests",
				icon: "🏆",
				rarity: "rare",
				category: "special",
				requirement: {
					type: "count",
					value: 5,
					condition: "contests:participated",
				},
				reward: { experience: 200, badge: "competitor" },
				isSecret: false,
			},
			{
				id: "top-performer",
				name: "Top Performer",
				description: "Finish in top 10% of a contest",
				icon: "🥇",
				rarity: "epic",
				category: "special",
				requirement: {
					type: "special",
					value: 1,
					condition: "contest:top-10-percent",
				},
				reward: {
					experience: 500,
					badge: "top-performer",
					title: "Elite Performer",
				},
				isSecret: false,
			},

			// Secret Achievements
			{
				id: "first-try",
				name: "First Try Ace",
				description: "Solve a Hard problem on your first attempt",
				icon: "🎯",
				rarity: "epic",
				category: "special",
				requirement: {
					type: "special",
					value: 1,
					condition: "first-attempt:Hard",
				},
				reward: { experience: 300, badge: "ace", title: "Natural" },
				isSecret: true,
			},
			{
				id: "error-hunter",
				name: "Error Hunter",
				description: "Fix 100 compilation errors",
				icon: "🐛",
				rarity: "rare",
				category: "special",
				requirement: {
					type: "count",
					value: 100,
					condition: "errors:compilation",
				},
				reward: { experience: 100, badge: "debugger" },
				isSecret: true,
			},
			{
				id: "comeback-king",
				name: "Comeback King",
				description: "Solve a problem after 10 failed attempts",
				icon: "👑",
				rarity: "epic",
				category: "special",
				requirement: {
					type: "special",
					value: 1,
					condition: "attempts:10-plus",
				},
				reward: {
					experience: 250,
					badge: "persistent",
					title: "Never Give Up",
				},
				isSecret: true,
			},
			{
				id: "midnight-coder",
				name: "Midnight Coder",
				description: "Solve problems at exactly midnight 5 times",
				icon: "🕛",
				rarity: "rare",
				category: "special",
				requirement: {
					type: "count",
					value: 5,
					condition: "time:exactly-midnight",
				},
				reward: { experience: 100, badge: "midnight", title: "Midnight Coder" },
				isSecret: true,
			},
			{
				id: "lucky-seven",
				name: "Lucky Seven",
				description: "Solve exactly 7 problems in a day",
				icon: "🍀",
				rarity: "rare",
				category: "special",
				requirement: {
					type: "special",
					value: 7,
					condition: "daily-count:exact",
				},
				reward: { experience: 77, badge: "lucky" },
				isSecret: true,
			},
		];
	}

	// Check achievements for a user based on their activity
	checkAchievements(
		userId: string,
		activity: {
			problemsSolved: number;
			streak: number;
			accuracy: number;
			solveTime: number;
			difficulty: string;
			category: string;
			language: string;
			isFirstAttempt: boolean;
			timestamp: Date;
			compilationErrors: number;
			attempts: number;
		},
	): Achievement[] {
		const newAchievements: Achievement[] = [];
		const userAchievements = this.getUserAchievements(userId);
		const earnedIds = new Set(userAchievements.map((ua) => ua.achievementId));

		for (const achievement of this.achievements) {
			// Skip if already earned
			if (earnedIds.has(achievement.id)) continue;

			let earned = false;
			let progress = 0;

			switch (achievement.requirement.type) {
				case "count":
					if (this.checkCountRequirement(achievement, activity)) {
						earned = true;
					}
					progress = this.calculateCountProgress(achievement, activity);
					break;

				case "streak":
					if (activity.streak >= achievement.requirement.value) {
						earned = true;
					}
					progress = Math.min(activity.streak, achievement.requirement.value);
					break;

				case "time":
					if (this.checkTimeRequirement(achievement, activity)) {
						earned = true;
					}
					break;

				case "accuracy":
					if (this.checkAccuracyRequirement(achievement, activity)) {
						earned = true;
					}
					break;

				case "special":
					if (this.checkSpecialRequirement(achievement, activity)) {
						earned = true;
					}
					break;
			}

			if (earned) {
				newAchievements.push({
					...achievement,
					unlockedAt: new Date(),
					progress: achievement.requirement.value,
					totalRequired: achievement.requirement.value,
				});

				// Add to user achievements
				this.addUserAchievement(userId, achievement.id);
			} else if (progress > 0) {
				// Update progress for partially completed achievements
				this.updateAchievementProgress(userId, achievement.id, progress);
			}
		}

		return newAchievements;
	}

	private checkCountRequirement(
		achievement: Achievement,
		activity: any,
	): boolean {
		const condition = achievement.requirement.condition;

		if (!condition) {
			return activity.problemsSolved >= achievement.requirement.value;
		}

		if (condition.startsWith("category:")) {
			const _category = condition.split(":")[1];
			// This would need to be tracked separately
			return false; // Placeholder
		}

		if (condition.startsWith("difficulty:")) {
			// This would need to be tracked separately
			return false; // Placeholder
		}

		return false;
	}

	private calculateCountProgress(
		achievement: Achievement,
		activity: any,
	): number {
		const condition = achievement.requirement.condition;

		if (!condition) {
			return Math.min(activity.problemsSolved, achievement.requirement.value);
		}

		// Return 0 for now, would need more detailed tracking
		return 0;
	}

	private checkTimeRequirement(
		achievement: Achievement,
		activity: any,
	): boolean {
		const condition = achievement.requirement.condition;

		if (condition?.includes("difficulty:")) {
			const difficulty = condition.split(":")[1];
			return (
				activity.difficulty === difficulty &&
				activity.solveTime <= achievement.requirement.value
			);
		}

		return activity.solveTime <= achievement.requirement.value;
	}

	private checkAccuracyRequirement(
		achievement: Achievement,
		activity: any,
	): boolean {
		// This would need historical data to check accuracy over multiple problems
		return activity.accuracy >= achievement.requirement.value;
	}

	private checkSpecialRequirement(
		achievement: Achievement,
		activity: any,
	): boolean {
		const condition = achievement.requirement.condition;

		if (!condition) return false;

		if (condition === "time:before-6am") {
			return activity.timestamp.getHours() < 6;
		}

		if (condition === "time:after-11pm") {
			return activity.timestamp.getHours() >= 23;
		}

		if (condition === "time:weekend") {
			const day = activity.timestamp.getDay();
			return day === 0 || day === 6; // Sunday or Saturday
		}

		if (condition === "time:exactly-midnight") {
			return (
				activity.timestamp.getHours() === 0 &&
				activity.timestamp.getMinutes() === 0
			);
		}

		if (condition.startsWith("first-attempt:")) {
			const difficulty = condition.split(":")[1];
			return activity.isFirstAttempt && activity.difficulty === difficulty;
		}

		if (condition === "errors:compilation") {
			return activity.compilationErrors > 0;
		}

		if (condition === "attempts:10-plus") {
			return activity.attempts >= 10;
		}

		if (condition === "daily-count:exact") {
			// This would need daily tracking
			return false; // Placeholder
		}

		return false;
	}

	// User achievement management
	private addUserAchievement(userId: string, achievementId: string) {
		if (!this.userAchievements.has(userId)) {
			this.userAchievements.set(userId, []);
		}

		const userAchievements = this.userAchievements.get(userId)!;
		userAchievements.push({
			userId,
			achievementId,
			unlockedAt: new Date(),
			progress: 0,
			isNotified: false,
		});
	}

	private updateAchievementProgress(
		userId: string,
		achievementId: string,
		progress: number,
	) {
		if (!this.userAchievements.has(userId)) {
			this.userAchievements.set(userId, []);
		}

		const userAchievements = this.userAchievements.get(userId)!;
		let userAchievement = userAchievements.find(
			(ua) => ua.achievementId === achievementId,
		);

		if (!userAchievement) {
			userAchievement = {
				userId,
				achievementId,
				unlockedAt: new Date(),
				progress: 0,
				isNotified: false,
			};
			userAchievements.push(userAchievement);
		}

		userAchievement.progress = progress;
	}

	// Public methods
	getAllAchievements(): Achievement[] {
		return this.achievements.filter((a) => !a.isSecret);
	}

	getSecretAchievements(): Achievement[] {
		return this.achievements.filter((a) => a.isSecret);
	}

	getUserAchievements(userId: string): UserAchievement[] {
		return this.userAchievements.get(userId) || [];
	}

	getAchievementById(id: string): Achievement | undefined {
		return this.achievements.find((a) => a.id === id);
	}

	getUserProgress(userId: string): {
		totalAchievements: number;
		earnedAchievements: number;
		totalExperience: number;
		badges: Badge[];
		titles: string[];
	} {
		const userAchievements = this.getUserAchievements(userId);
		const earned = userAchievements.length;
		const total = this.achievements.length;

		let totalExperience = 0;
		const badges: Badge[] = [];
		const titles: string[] = [];

		for (const userAchievement of userAchievements) {
			const achievement = this.getAchievementById(
				userAchievement.achievementId,
			);
			if (achievement) {
				totalExperience += achievement.reward.experience;

				if (achievement.reward.badge) {
					badges.push({
						id: achievement.reward.badge,
						name: achievement.name,
						description: achievement.description,
						icon: achievement.icon,
						rarity: achievement.rarity,
						achievementId: achievement.id,
						earnedAt: userAchievement.unlockedAt,
					});
				}

				if (achievement.reward.title) {
					titles.push(achievement.reward.title);
				}
			}
		}

		return {
			totalAchievements: total,
			earnedAchievements: earned,
			totalExperience,
			badges,
			titles,
		};
	}

	getAchievementsByCategory(category: Achievement["category"]): Achievement[] {
		return this.achievements.filter((a) => a.category === category);
	}

	getRarityColor(rarity: Achievement["rarity"]): string {
		const colors = {
			common: "text-gray-600 bg-gray-100",
			rare: "text-blue-600 bg-blue-100",
			epic: "text-purple-600 bg-purple-100",
			legendary: "text-yellow-600 bg-yellow-100",
		};
		return colors[rarity];
	}

	getCategoryIcon(category: Achievement["category"]): string {
		const icons = {
			solving: "🧩",
			streak: "🔥",
			speed: "⚡",
			accuracy: "🎯",
			algorithm: "🧠",
			special: "⭐",
		};
		return icons[category];
	}
}

export const achievementSystem = new AchievementSystem();
