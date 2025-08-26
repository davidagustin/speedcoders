"use client";

import {
	AcademicCapIcon,
	BoltIcon,
	CheckCircleIcon,
	FireIcon,
	LockClosedIcon,
	SparklesIcon,
	StarIcon,
	TrophyIcon,
} from "@heroicons/react/24/outline";
import {
	StarIcon as StarSolidIcon,
	TrophyIcon as TrophySolidIcon,
} from "@heroicons/react/24/solid";
import { useEffect, useState } from "react";
import {
	type Achievement,
	achievementSystem,
	type Badge,
} from "../lib/achievements";

interface UserStats {
	totalAchievements: number;
	earnedAchievements: number;
	totalExperience: number;
	badges: Badge[];
	titles: string[];
	level: number;
	nextLevelExp: number;
	currentExp: number;
}

export default function AchievementCenter() {
	const [achievements, setAchievements] = useState<Achievement[]>([]);
	const [userStats, setUserStats] = useState<UserStats | null>(null);
	const [selectedCategory, setSelectedCategory] = useState<
		| "all"
		| "solving"
		| "streak"
		| "speed"
		| "accuracy"
		| "algorithm"
		| "special"
	>("all");
	const [selectedRarity, setSelectedRarity] = useState<
		"all" | "common" | "rare" | "epic" | "legendary"
	>("all");
	const [showSecrets, setShowSecrets] = useState(false);
	const [recentAchievements, setRecentAchievements] = useState<Achievement[]>(
		[],
	);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		loadAchievements();
		loadUserStats();
	}, [showSecrets]);

	const loadAchievements = () => {
		const allAchievements = achievementSystem.getAllAchievements();
		const secretAchievements = showSecrets
			? achievementSystem.getSecretAchievements()
			: [];
		setAchievements([...allAchievements, ...secretAchievements]);
	};

	const loadUserStats = () => {
		const userId = "current-user"; // Would come from auth
		const progress = achievementSystem.getUserProgress(userId);

		// Calculate level from experience (100 exp per level)
		const level = Math.floor(progress.totalExperience / 100) + 1;
		const currentExp = progress.totalExperience % 100;
		const nextLevelExp = 100;

		setUserStats({
			...progress,
			level,
			nextLevelExp,
			currentExp,
		});

		// Mock recent achievements
		const mockRecent: Achievement[] = [
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
				unlockedAt: new Date(Date.now() - 86400000), // 1 day ago
			},
			{
				id: "problem-solver-10",
				name: "Problem Solver",
				description: "Solve 10 problems",
				icon: "🧩",
				rarity: "common",
				category: "solving",
				requirement: { type: "count", value: 10 },
				reward: { experience: 50 },
				isSecret: false,
				unlockedAt: new Date(Date.now() - 172800000), // 2 days ago
			},
		];

		setRecentAchievements(mockRecent);
		setLoading(false);
	};

	const filteredAchievements = achievements.filter((achievement) => {
		if (
			selectedCategory !== "all" &&
			achievement.category !== selectedCategory
		) {
			return false;
		}
		if (selectedRarity !== "all" && achievement.rarity !== selectedRarity) {
			return false;
		}
		return true;
	});

	const getRarityColor = (rarity: string) => {
		const colors = {
			common: "text-gray-600 bg-gray-100 border-gray-200",
			rare: "text-blue-600 bg-blue-100 border-blue-200",
			epic: "text-purple-600 bg-purple-100 border-purple-200",
			legendary: "text-yellow-600 bg-yellow-100 border-yellow-200",
		};
		return colors[rarity as keyof typeof colors] || colors.common;
	};

	const getCategoryIcon = (category: string) => {
		const icons = {
			solving: TrophyIcon,
			streak: FireIcon,
			speed: BoltIcon,
			accuracy: StarIcon,
			algorithm: AcademicCapIcon,
			special: SparklesIcon,
		};
		return icons[category as keyof typeof icons] || TrophyIcon;
	};

	const isAchievementEarned = (_achievementId: string) => {
		return Math.random() < 0.3; // Mock earned status
	};

	const getAchievementProgress = (achievementId: string) => {
		if (isAchievementEarned(achievementId)) return 100;
		return Math.floor(Math.random() * 80) + 10; // Mock progress
	};

	if (loading || !userStats) {
		return (
			<div className="flex items-center justify-center min-h-96">
				<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
			</div>
		);
	}

	return (
		<div className="max-w-7xl mx-auto p-6 space-y-6">
			{/* Header */}
			<div className="text-center mb-8">
				<h1 className="text-3xl font-bold text-gray-900 mb-2">
					Achievement Center
				</h1>
				<p className="text-gray-600">Track your progress and unlock rewards</p>
			</div>

			{/* User Stats Overview */}
			<div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 text-white mb-8">
				<div className="grid grid-cols-1 md:grid-cols-4 gap-6">
					<div className="text-center">
						<div className="text-3xl font-bold">Level {userStats.level}</div>
						<div className="text-blue-100">Current Level</div>
						<div className="w-full bg-blue-700 rounded-full h-3 mt-2">
							<div
								className="bg-white rounded-full h-3 transition-all duration-300"
								style={{
									width: `${(userStats.currentExp / userStats.nextLevelExp) * 100}%`,
								}}
							/>
						</div>
						<div className="text-xs text-blue-100 mt-1">
							{userStats.currentExp} / {userStats.nextLevelExp} XP
						</div>
					</div>

					<div className="text-center">
						<div className="text-3xl font-bold">
							{userStats.earnedAchievements}
						</div>
						<div className="text-blue-100">Achievements Unlocked</div>
						<div className="text-sm text-blue-200 mt-1">
							of {userStats.totalAchievements} total
						</div>
					</div>

					<div className="text-center">
						<div className="text-3xl font-bold">
							{userStats.totalExperience.toLocaleString()}
						</div>
						<div className="text-blue-100">Total XP</div>
					</div>

					<div className="text-center">
						<div className="text-3xl font-bold">{userStats.badges.length}</div>
						<div className="text-blue-100">Badges Earned</div>
						<div className="text-sm text-blue-200 mt-1">
							{userStats.titles.length} titles unlocked
						</div>
					</div>
				</div>
			</div>

			{/* Recent Achievements */}
			{recentAchievements.length > 0 && (
				<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
					<h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
						<SparklesIcon className="h-5 w-5 text-yellow-500" />
						Recent Achievements
					</h3>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						{recentAchievements.map((achievement) => (
							<div
								key={achievement.id}
								className="flex items-center gap-4 p-4 bg-green-50 border border-green-200 rounded-lg"
							>
								<div className="text-3xl">{achievement.icon}</div>
								<div className="flex-1">
									<div className="font-semibold text-gray-900">
										{achievement.name}
									</div>
									<div className="text-sm text-gray-600">
										{achievement.description}
									</div>
									<div className="text-xs text-green-600 mt-1">
										Earned {achievement.unlockedAt?.toLocaleDateString()}
									</div>
								</div>
								<div className="text-green-600">
									<CheckCircleIcon className="h-6 w-6" />
								</div>
							</div>
						))}
					</div>
				</div>
			)}

			{/* Filters */}
			<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
				<div className="flex flex-wrap gap-4 items-center">
					<div className="flex gap-2">
						<label className="text-sm font-medium text-gray-700">
							Category:
						</label>
						<select
							value={selectedCategory}
							onChange={(e) => setSelectedCategory(e.target.value as any)}
							className="px-3 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500"
						>
							<option value="all">All Categories</option>
							<option value="solving">Problem Solving</option>
							<option value="streak">Streaks</option>
							<option value="speed">Speed</option>
							<option value="accuracy">Accuracy</option>
							<option value="algorithm">Algorithms</option>
							<option value="special">Special</option>
						</select>
					</div>

					<div className="flex gap-2">
						<label className="text-sm font-medium text-gray-700">Rarity:</label>
						<select
							value={selectedRarity}
							onChange={(e) => setSelectedRarity(e.target.value as any)}
							className="px-3 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500"
						>
							<option value="all">All Rarities</option>
							<option value="common">Common</option>
							<option value="rare">Rare</option>
							<option value="epic">Epic</option>
							<option value="legendary">Legendary</option>
						</select>
					</div>

					<button
						onClick={() => {
							setShowSecrets(!showSecrets);
							loadAchievements();
						}}
						className={`px-4 py-2 rounded-lg text-sm transition-colors ${
							showSecrets
								? "bg-purple-600 text-white"
								: "bg-gray-100 text-gray-700 hover:bg-gray-200"
						}`}
					>
						{showSecrets ? "Hide" : "Show"} Secret Achievements
					</button>
				</div>
			</div>

			{/* Achievement Grid */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{filteredAchievements.map((achievement) => {
					const IconComponent = getCategoryIcon(achievement.category);
					const isEarned = isAchievementEarned(achievement.id);
					const progress = getAchievementProgress(achievement.id);

					return (
						<div
							key={achievement.id}
							className={`bg-white rounded-xl shadow-sm border-2 p-6 transition-all hover:shadow-md ${
								isEarned
									? "border-green-200 bg-green-50"
									: achievement.isSecret && !isEarned
										? "border-gray-200 bg-gray-50 opacity-50"
										: "border-gray-200"
							}`}
						>
							<div className="flex items-start justify-between mb-4">
								<div className="flex items-center gap-3">
									<div
										className={`p-3 rounded-lg ${getRarityColor(achievement.rarity)}`}
									>
										{isEarned || !achievement.isSecret ? (
											<div className="text-2xl">{achievement.icon}</div>
										) : (
											<LockClosedIcon className="h-6 w-6" />
										)}
									</div>
									<div>
										<span
											className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${getRarityColor(achievement.rarity)}`}
										>
											{achievement.rarity}
										</span>
									</div>
								</div>

								{isEarned && (
									<CheckCircleIcon className="h-6 w-6 text-green-600" />
								)}
							</div>

							<div className="mb-4">
								<h3 className="font-semibold text-gray-900 mb-1">
									{achievement.isSecret && !isEarned ? "???" : achievement.name}
								</h3>
								<p className="text-sm text-gray-600">
									{achievement.isSecret && !isEarned
										? "Hidden achievement"
										: achievement.description}
								</p>
							</div>

							{!isEarned && !achievement.isSecret && (
								<div className="mb-4">
									<div className="flex justify-between text-xs text-gray-600 mb-1">
										<span>Progress</span>
										<span>{progress}%</span>
									</div>
									<div className="w-full bg-gray-200 rounded-full h-2">
										<div
											className="bg-blue-600 rounded-full h-2 transition-all duration-300"
											style={{ width: `${progress}%` }}
										/>
									</div>
								</div>
							)}

							<div className="flex items-center justify-between text-sm">
								<div className="flex items-center gap-2 text-gray-500">
									<IconComponent className="h-4 w-4" />
									<span className="capitalize">{achievement.category}</span>
								</div>

								<div className="text-blue-600 font-medium">
									+{achievement.reward.experience} XP
									{achievement.reward.badge && <span className="ml-1">🏆</span>}
									{achievement.reward.title && <span className="ml-1">👑</span>}
								</div>
							</div>

							{achievement.reward.title && (
								<div className="mt-2 text-xs text-purple-600">
									Unlocks title: "{achievement.reward.title}"
								</div>
							)}
						</div>
					);
				})}
			</div>

			{filteredAchievements.length === 0 && (
				<div className="text-center py-12">
					<TrophyIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
					<h3 className="text-lg font-medium text-gray-900 mb-2">
						No achievements found
					</h3>
					<p className="text-gray-600">Try adjusting your filters</p>
				</div>
			)}

			{/* Badges Section */}
			{userStats.badges.length > 0 && (
				<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
					<h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
						<StarSolidIcon className="h-5 w-5 text-yellow-500" />
						Your Badges
					</h3>

					<div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
						{userStats.badges.map((badge) => (
							<div
								key={badge.id}
								className="text-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
							>
								<div className="text-3xl mb-2">{badge.icon}</div>
								<div className="text-sm font-medium text-gray-900">
									{badge.name}
								</div>
								<div
									className={`text-xs px-2 py-1 rounded-full mt-2 ${getRarityColor(badge.rarity)}`}
								>
									{badge.rarity}
								</div>
							</div>
						))}
					</div>
				</div>
			)}

			{/* Titles Section */}
			{userStats.titles.length > 0 && (
				<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
					<h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
						<TrophySolidIcon className="h-5 w-5 text-purple-500" />
						Your Titles
					</h3>

					<div className="flex flex-wrap gap-3">
						{userStats.titles.map((title, index) => (
							<span
								key={index}
								className="px-4 py-2 bg-purple-100 text-purple-800 rounded-full text-sm font-medium"
							>
								{title}
							</span>
						))}
					</div>
				</div>
			)}
		</div>
	);
}
