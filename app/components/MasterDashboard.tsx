"use client";

import {
	ArrowTrendingUpIcon,
	BellIcon,
	BoltIcon,
	ChartBarIcon,
	ClockIcon,
	CogIcon,
	FireIcon,
	MagnifyingGlassIcon,
	PlayIcon,
	StarIcon,
	TrophyIcon,
	UserGroupIcon,
} from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import AchievementCenter from "./AchievementCenter";
import AdvancedAnalytics from "./AdvancedAnalytics";
import AdvancedSearch from "./AdvancedSearch";
import CompetitiveLeaderboard from "./CompetitiveLeaderboard";
import PremiumUpgrade from "./PremiumUpgrade";
import SocialHub from "./SocialHub";

interface DashboardStats {
	totalSolved: number;
	totalProblems: number;
	currentStreak: number;
	accuracy: number;
	rank: number;
	experience: number;
	level: number;
	todaysGoal: {
		target: number;
		completed: number;
	};
	weeklyProgress: {
		day: string;
		problems: number;
	}[];
	recentAchievements: {
		name: string;
		icon: string;
		rarity: string;
		earnedAt: string;
	}[];
	upcomingContests: {
		name: string;
		date: string;
		participants: number;
	}[];
	recommendedProblems: {
		title: string;
		difficulty: string;
		category: string;
		estimatedTime: number;
	}[];
}

type ViewType =
	| "overview"
	| "practice"
	| "analytics"
	| "leaderboard"
	| "search"
	| "achievements"
	| "social"
	| "premium";

export default function MasterDashboard() {
	const [currentView, setCurrentView] = useState<ViewType>("overview");
	const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(
		null,
	);
	const [loading, setLoading] = useState(true);
	const [notifications, setNotifications] = useState<string[]>([]);

	useEffect(() => {
		loadDashboardData();
	}, [loadDashboardData]);

	const loadDashboardData = async () => {
		setLoading(true);
		await new Promise((resolve) => setTimeout(resolve, 1000));

		const mockStats: DashboardStats = {
			totalSolved: 284,
			totalProblems: 1247,
			currentStreak: 12,
			accuracy: 82.5,
			rank: 1543,
			experience: 24750,
			level: 15,
			todaysGoal: {
				target: 3,
				completed: 1,
			},
			weeklyProgress: [
				{ day: "Mon", problems: 4 },
				{ day: "Tue", problems: 2 },
				{ day: "Wed", problems: 5 },
				{ day: "Thu", problems: 3 },
				{ day: "Fri", problems: 1 },
				{ day: "Sat", problems: 0 },
				{ day: "Sun", problems: 0 },
			],
			recentAchievements: [
				{
					name: "Speed Demon",
					icon: "⚡",
					rarity: "rare",
					earnedAt: "2 hours ago",
				},
				{
					name: "Streak Master",
					icon: "🔥",
					rarity: "epic",
					earnedAt: "1 day ago",
				},
				{
					name: "Array Expert",
					icon: "📊",
					rarity: "common",
					earnedAt: "3 days ago",
				},
			],
			upcomingContests: [
				{
					name: "Weekly Algorithm Sprint",
					date: "2024-01-22",
					participants: 1247,
				},
				{
					name: "DP Masters Championship",
					date: "2024-01-28",
					participants: 856,
				},
				{
					name: "Speed Coding Challenge",
					date: "2024-02-05",
					participants: 2341,
				},
			],
			recommendedProblems: [
				{
					title: "Maximum Subarray Sum",
					difficulty: "Medium",
					category: "Dynamic Programming",
					estimatedTime: 25,
				},
				{
					title: "Valid Binary Search Tree",
					difficulty: "Medium",
					category: "Tree",
					estimatedTime: 20,
				},
				{
					title: "Longest Palindromic Substring",
					difficulty: "Medium",
					category: "String",
					estimatedTime: 30,
				},
			],
		};

		setDashboardStats(mockStats);
		setNotifications(["New achievement unlocked!", "Contest starting soon"]);
		setLoading(false);
	};

	const navigation = [
		{
			id: "overview",
			name: "Overview",
			icon: ChartBarIcon,
			current: currentView === "overview",
		},
		{
			id: "practice",
			name: "Practice",
			icon: PlayIcon,
			current: currentView === "practice",
		},
		{
			id: "analytics",
			name: "Analytics",
			icon: ArrowTrendingUpIcon,
			current: currentView === "analytics",
		},
		{
			id: "leaderboard",
			name: "Leaderboard",
			icon: TrophyIcon,
			current: currentView === "leaderboard",
		},
		{
			id: "search",
			name: "Search",
			icon: MagnifyingGlassIcon,
			current: currentView === "search",
		},
		{
			id: "achievements",
			name: "Achievements",
			icon: StarIcon,
			current: currentView === "achievements",
		},
		{
			id: "social",
			name: "Social",
			icon: UserGroupIcon,
			current: currentView === "social",
		},
		{
			id: "premium",
			name: "Premium",
			icon: BoltIcon,
			current: currentView === "premium",
		},
	];

	const getDifficultyColor = (difficulty: string) => {
		switch (difficulty) {
			case "Easy":
				return "text-green-600 bg-green-50 border-green-200";
			case "Medium":
				return "text-yellow-600 bg-yellow-50 border-yellow-200";
			case "Hard":
				return "text-red-600 bg-red-50 border-red-200";
			default:
				return "text-gray-600 bg-gray-50 border-gray-200";
		}
	};

	if (loading || !dashboardStats) {
		return (
			<div className="flex items-center justify-center min-h-screen bg-gray-50">
				<div className="text-center">
					<div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
					<p className="text-gray-600 mt-4">Loading your dashboard...</p>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-50">
			{/* Navigation */}
			<nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
				<div className="max-w-7xl mx-auto px-6">
					<div className="flex justify-between items-center h-16">
						<div className="flex items-center gap-8">
							<h1 className="text-xl font-bold text-gray-900">SpeedCoders</h1>

							<div className="flex space-x-1">
								{navigation.map((item) => (
									<button
										key={item.id}
										onClick={() => setCurrentView(item.id as ViewType)}
										className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
											item.current
												? "bg-blue-100 text-blue-700"
												: "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
										}`}
									>
										<item.icon className="h-5 w-5" />
										{item.name}
									</button>
								))}
							</div>
						</div>

						<div className="flex items-center gap-4">
							<button className="relative p-2 text-gray-600 hover:text-gray-900">
								<BellIcon className="h-6 w-6" />
								{notifications.length > 0 && (
									<span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
								)}
							</button>
							<button className="p-2 text-gray-600 hover:text-gray-900">
								<CogIcon className="h-6 w-6" />
							</button>
							<div className="h-8 w-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
								U
							</div>
						</div>
					</div>
				</div>
			</nav>

			{/* Main Content */}
			<div className="max-w-7xl mx-auto p-6">
				{currentView === "overview" && (
					<div className="space-y-6">
						{/* Welcome Header */}
						<div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 text-white">
							<div className="flex justify-between items-center">
								<div>
									<h2 className="text-3xl font-bold mb-2">Welcome back!</h2>
									<p className="text-blue-100 text-lg">
										Ready to solve some problems today?
									</p>
								</div>
								<div className="text-right">
									<div className="text-blue-100">Level</div>
									<div className="text-4xl font-bold">
										{dashboardStats.level}
									</div>
									<div className="text-sm text-blue-100">
										{dashboardStats.experience.toLocaleString()} XP
									</div>
								</div>
							</div>
						</div>

						{/* Quick Stats */}
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
							<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
								<div className="flex items-center justify-between">
									<div>
										<p className="text-sm font-medium text-gray-600">
											Problems Solved
										</p>
										<p className="text-3xl font-bold text-gray-900 mt-1">
											{dashboardStats.totalSolved}
										</p>
										<p className="text-sm text-gray-500 mt-1">
											of {dashboardStats.totalProblems.toLocaleString()}
										</p>
									</div>
									<div className="p-3 bg-blue-50 rounded-lg">
										<ChartBarIcon className="h-8 w-8 text-blue-600" />
									</div>
								</div>
								<div className="mt-4">
									<div className="bg-gray-200 rounded-full h-2">
										<div
											className="bg-blue-600 rounded-full h-2"
											style={{
												width: `${(dashboardStats.totalSolved / dashboardStats.totalProblems) * 100}%`,
											}}
										/>
									</div>
								</div>
							</div>

							<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
								<div className="flex items-center justify-between">
									<div>
										<p className="text-sm font-medium text-gray-600">
											Current Streak
										</p>
										<p className="text-3xl font-bold text-orange-600 mt-1">
											{dashboardStats.currentStreak}
										</p>
										<p className="text-sm text-gray-500 mt-1">days</p>
									</div>
									<div className="p-3 bg-orange-50 rounded-lg">
										<FireIcon className="h-8 w-8 text-orange-600" />
									</div>
								</div>
							</div>

							<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
								<div className="flex items-center justify-between">
									<div>
										<p className="text-sm font-medium text-gray-600">
											Accuracy
										</p>
										<p className="text-3xl font-bold text-green-600 mt-1">
											{dashboardStats.accuracy}%
										</p>
										<p className="text-sm text-gray-500 mt-1">overall</p>
									</div>
									<div className="p-3 bg-green-50 rounded-lg">
										<StarIcon className="h-8 w-8 text-green-600" />
									</div>
								</div>
							</div>

							<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
								<div className="flex items-center justify-between">
									<div>
										<p className="text-sm font-medium text-gray-600">
											Global Rank
										</p>
										<p className="text-3xl font-bold text-purple-600 mt-1">
											#{dashboardStats.rank}
										</p>
										<p className="text-sm text-gray-500 mt-1">top 5%</p>
									</div>
									<div className="p-3 bg-purple-50 rounded-lg">
										<TrophyIcon className="h-8 w-8 text-purple-600" />
									</div>
								</div>
							</div>
						</div>

						{/* Today's Goal */}
						<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
							<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
								<h3 className="text-lg font-semibold text-gray-900 mb-4">
									Today's Goal
								</h3>
								<div className="text-center">
									<div className="relative w-24 h-24 mx-auto mb-4">
										<svg className="w-24 h-24" viewBox="0 0 100 100">
											<circle
												cx="50"
												cy="50"
												r="45"
												fill="none"
												stroke="#e5e7eb"
												strokeWidth="10"
											/>
											<circle
												cx="50"
												cy="50"
												r="45"
												fill="none"
												stroke="#3b82f6"
												strokeWidth="10"
												strokeDasharray={`${(dashboardStats.todaysGoal.completed / dashboardStats.todaysGoal.target) * 283} 283`}
												strokeDashoffset="0"
												transform="rotate(-90 50 50)"
											/>
										</svg>
										<div className="absolute inset-0 flex items-center justify-center">
											<span className="text-2xl font-bold text-gray-900">
												{dashboardStats.todaysGoal.completed}/
												{dashboardStats.todaysGoal.target}
											</span>
										</div>
									</div>
									<p className="text-gray-600">
										{dashboardStats.todaysGoal.target -
											dashboardStats.todaysGoal.completed}{" "}
										problems left
									</p>
									<button
										onClick={() => setCurrentView("practice")}
										className="mt-4 w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
									>
										Start Practicing
									</button>
								</div>
							</div>

							{/* Weekly Progress */}
							<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
								<h3 className="text-lg font-semibold text-gray-900 mb-4">
									This Week
								</h3>
								<div className="space-y-3">
									{dashboardStats.weeklyProgress.map((day, index) => (
										<div
											key={index}
											className="flex items-center justify-between"
										>
											<span className="text-sm text-gray-600">{day.day}</span>
											<div className="flex items-center gap-2">
												<div className="w-20 h-2 bg-gray-200 rounded-full">
													<div
														className="h-2 bg-blue-600 rounded-full"
														style={{
															width: `${Math.min((day.problems / 5) * 100, 100)}%`,
														}}
													/>
												</div>
												<span className="text-sm font-medium text-gray-900 w-6 text-right">
													{day.problems}
												</span>
											</div>
										</div>
									))}
								</div>
							</div>

							{/* Recent Achievements */}
							<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
								<h3 className="text-lg font-semibold text-gray-900 mb-4">
									Recent Achievements
								</h3>
								<div className="space-y-3">
									{dashboardStats.recentAchievements.map(
										(achievement, index) => (
											<div
												key={index}
												className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
											>
												<div className="text-xl">{achievement.icon}</div>
												<div className="flex-1">
													<div className="font-medium text-gray-900 text-sm">
														{achievement.name}
													</div>
													<div className="text-xs text-gray-500">
														{achievement.earnedAt}
													</div>
												</div>
												<div
													className={`px-2 py-1 text-xs rounded-full ${
														achievement.rarity === "legendary"
															? "bg-yellow-100 text-yellow-800"
															: achievement.rarity === "epic"
																? "bg-purple-100 text-purple-800"
																: achievement.rarity === "rare"
																	? "bg-blue-100 text-blue-800"
																	: "bg-gray-100 text-gray-800"
													}`}
												>
													{achievement.rarity}
												</div>
											</div>
										),
									)}
								</div>
								<button
									onClick={() => setCurrentView("achievements")}
									className="mt-4 w-full text-blue-600 text-sm hover:text-blue-700 transition-colors"
								>
									View All Achievements →
								</button>
							</div>
						</div>

						{/* Quick Actions */}
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							{/* Upcoming Contests */}
							<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
								<h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
									<TrophyIcon className="h-5 w-5 text-yellow-500" />
									Upcoming Contests
								</h3>
								<div className="space-y-3">
									{dashboardStats.upcomingContests.map((contest, index) => (
										<div
											key={index}
											className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
										>
											<div>
												<div className="font-medium text-gray-900">
													{contest.name}
												</div>
												<div className="text-sm text-gray-500">
													{contest.date} •{" "}
													{contest.participants.toLocaleString()} participants
												</div>
											</div>
											<button className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors">
												Join
											</button>
										</div>
									))}
								</div>
							</div>

							{/* Recommended Problems */}
							<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
								<h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
									<BoltIcon className="h-5 w-5 text-green-500" />
									Recommended for You
								</h3>
								<div className="space-y-3">
									{dashboardStats.recommendedProblems.map((problem, index) => (
										<div
											key={index}
											className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
										>
											<div className="flex items-center justify-between mb-2">
												<div className="font-medium text-gray-900">
													{problem.title}
												</div>
												<span
													className={`px-2 py-1 text-xs rounded-full border ${getDifficultyColor(problem.difficulty)}`}
												>
													{problem.difficulty}
												</span>
											</div>
											<div className="flex items-center justify-between text-sm text-gray-500">
												<span>{problem.category}</span>
												<div className="flex items-center gap-1">
													<ClockIcon className="h-4 w-4" />~
													{problem.estimatedTime} min
												</div>
											</div>
										</div>
									))}
								</div>
								<button
									onClick={() => setCurrentView("search")}
									className="mt-4 w-full text-blue-600 text-sm hover:text-blue-700 transition-colors"
								>
									Browse All Problems →
								</button>
							</div>
						</div>
					</div>
				)}

				{currentView === "practice" && (
					<div className="text-center p-8">
						<h2 className="text-2xl font-bold mb-4">Practice Mode</h2>
						<p className="text-gray-600">
							Select a quiz or problem to start practicing
						</p>
					</div>
				)}
				{currentView === "analytics" && <AdvancedAnalytics />}
				{currentView === "leaderboard" && <CompetitiveLeaderboard />}
				{currentView === "search" && <AdvancedSearch />}
				{currentView === "achievements" && <AchievementCenter />}
				{currentView === "social" && <SocialHub />}
				{currentView === "premium" && <PremiumUpgrade />}
			</div>
		</div>
	);
}
