"use client";

import {
	AcademicCapIcon,
	CalendarIcon,
	ChartBarIcon,
	FireIcon,
	StarIcon,
	TrophyIcon,
	UserIcon,
} from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";

interface LeaderboardEntry {
	id: string;
	rank: number;
	name: string;
	email: string;
	avatar?: string;
	score: number;
	problemsSolved: number;
	averageScore: number;
	streak: number;
	joinDate: string;
	achievements: string[];
	level: number;
}

interface LeaderboardData {
	global: LeaderboardEntry[];
	weekly: LeaderboardEntry[];
	monthly: LeaderboardEntry[];
	categories: {
		[key: string]: LeaderboardEntry[];
	};
}

export default function LeaderboardPage() {
	const [leaderboardData, setLeaderboardData] =
		useState<LeaderboardData | null>(null);
	const [activeTab, setActiveTab] = useState("global");
	const [timeRange, setTimeRange] = useState("all");
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		fetchLeaderboardData();
	}, [fetchLeaderboardData]);

	const fetchLeaderboardData = async () => {
		try {
			// Mock data for demonstration
			const mockData: LeaderboardData = {
				global: [
					{
						id: "1",
						rank: 1,
						name: "Alex Chen",
						email: "alex@example.com",
						score: 2847,
						problemsSolved: 156,
						averageScore: 94,
						streak: 23,
						joinDate: "2024-01-15",
						achievements: ["Speed Demon", "Perfect Score", "Streak Master"],
						level: 15,
					},
					{
						id: "2",
						rank: 2,
						name: "Sarah Johnson",
						email: "sarah@example.com",
						score: 2712,
						problemsSolved: 142,
						averageScore: 91,
						streak: 18,
						joinDate: "2024-02-01",
						achievements: ["Algorithm Expert", "Consistent Performer"],
						level: 14,
					},
					{
						id: "3",
						rank: 3,
						name: "Mike Rodriguez",
						email: "mike@example.com",
						score: 2589,
						problemsSolved: 128,
						averageScore: 88,
						streak: 12,
						joinDate: "2024-01-20",
						achievements: ["Problem Solver", "Quick Learner"],
						level: 13,
					},
					{
						id: "4",
						rank: 4,
						name: "Emily Davis",
						email: "emily@example.com",
						score: 2456,
						problemsSolved: 115,
						averageScore: 85,
						streak: 9,
						joinDate: "2024-02-10",
						achievements: ["Rising Star"],
						level: 12,
					},
					{
						id: "5",
						rank: 5,
						name: "David Kim",
						email: "david@example.com",
						score: 2321,
						problemsSolved: 98,
						averageScore: 82,
						streak: 7,
						joinDate: "2024-01-25",
						achievements: ["Consistent Learner"],
						level: 11,
					},
				],
				weekly: [
					{
						id: "1",
						rank: 1,
						name: "Alex Chen",
						email: "alex@example.com",
						score: 847,
						problemsSolved: 23,
						averageScore: 96,
						streak: 7,
						joinDate: "2024-01-15",
						achievements: ["Weekly Champion"],
						level: 15,
					},
					{
						id: "2",
						rank: 2,
						name: "Sarah Johnson",
						email: "sarah@example.com",
						score: 712,
						problemsSolved: 19,
						averageScore: 93,
						streak: 7,
						joinDate: "2024-02-01",
						achievements: ["Consistent Performer"],
						level: 14,
					},
				],
				monthly: [
					{
						id: "1",
						rank: 1,
						name: "Alex Chen",
						email: "alex@example.com",
						score: 2847,
						problemsSolved: 89,
						averageScore: 94,
						streak: 23,
						joinDate: "2024-01-15",
						achievements: ["Monthly Champion"],
						level: 15,
					},
					{
						id: "2",
						rank: 2,
						name: "Sarah Johnson",
						email: "sarah@example.com",
						score: 2712,
						problemsSolved: 76,
						averageScore: 91,
						streak: 18,
						joinDate: "2024-02-01",
						achievements: ["Algorithm Expert"],
						level: 14,
					},
				],
				categories: {
					Algorithms: [
						{
							id: "1",
							rank: 1,
							name: "Alex Chen",
							email: "alex@example.com",
							score: 2847,
							problemsSolved: 156,
							averageScore: 94,
							streak: 23,
							joinDate: "2024-01-15",
							achievements: ["Algorithm Master"],
							level: 15,
						},
					],
					"Data Structures": [
						{
							id: "2",
							rank: 1,
							name: "Sarah Johnson",
							email: "sarah@example.com",
							score: 2712,
							problemsSolved: 142,
							averageScore: 91,
							streak: 18,
							joinDate: "2024-02-01",
							achievements: ["Data Structure Expert"],
							level: 14,
						},
					],
				},
			};

			setLeaderboardData(mockData);
		} catch (error) {
			console.error("Error fetching leaderboard data:", error);
		} finally {
			setLoading(false);
		}
	};

	const getRankIcon = (rank: number) => {
		switch (rank) {
			case 1:
				return <TrophyIcon className="h-6 w-6 text-yellow-500" />;
			case 2:
				return <StarIcon className="h-6 w-6 text-gray-400" />;
			case 3:
				return <StarIcon className="h-6 w-6 text-amber-600" />;
			default:
				return (
					<span className="text-lg font-bold text-gray-500 dark:text-slate-400">
						{rank}
					</span>
				);
		}
	};

	const getLevelColor = (level: number) => {
		if (level >= 15) return "text-purple-600 dark:text-purple-400";
		if (level >= 10) return "text-blue-600 dark:text-blue-400";
		if (level >= 5) return "text-green-600 dark:text-green-400";
		return "text-gray-600 dark:text-slate-400";
	};

	if (loading) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
				<div className="lg:pl-64">
					<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
						<div className="animate-pulse">
							<div className="h-8 bg-gray-200 dark:bg-slate-700 rounded w-1/4 mb-4"></div>
							<div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-1/2 mb-8"></div>
							<div className="space-y-4">
								{[...Array(5)].map((_, i) => (
									<div key={i} className="card p-6">
										<div className="h-6 bg-gray-200 dark:bg-slate-700 rounded w-3/4 mb-2"></div>
										<div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-1/2"></div>
									</div>
								))}
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}

	if (!leaderboardData) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
				<div className="lg:pl-64">
					<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
						<div className="text-center">
							<h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
								Leaderboard Unavailable
							</h1>
							<p className="text-gray-600 dark:text-slate-300">
								Unable to load leaderboard data at this time.
							</p>
						</div>
					</div>
				</div>
			</div>
		);
	}

	const currentData =
		leaderboardData[activeTab as keyof LeaderboardData] ||
		leaderboardData.global;

	return (
		<div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
			<div className="lg:pl-64">
				<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
					{/* Header */}
					<div className="mb-8">
						<div className="flex items-center justify-between">
							<div>
								<h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
									Leaderboard
								</h1>
								<p className="text-gray-600 dark:text-slate-300">
									See how you rank against other coders
								</p>
							</div>
							<div className="flex gap-2">
								{["all", "week", "month"].map((range) => (
									<button
										key={range}
										onClick={() => setTimeRange(range)}
										className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
											timeRange === range
												? "bg-indigo-600 text-white"
												: "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600"
										}`}
									>
										{range.charAt(0).toUpperCase() + range.slice(1)}
									</button>
								))}
							</div>
						</div>
					</div>

					{/* Tabs */}
					<div className="mb-8">
						<div className="border-b border-gray-200 dark:border-slate-700">
							<nav className="-mb-px flex space-x-8">
								{[
									{ id: "global", name: "Global", icon: TrophyIcon },
									{ id: "weekly", name: "Weekly", icon: CalendarIcon },
									{ id: "monthly", name: "Monthly", icon: ChartBarIcon },
								].map((tab) => (
									<button
										key={tab.id}
										onClick={() => setActiveTab(tab.id)}
										className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
											activeTab === tab.id
												? "border-indigo-500 text-indigo-600 dark:text-indigo-400"
												: "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-slate-400 dark:hover:text-slate-300"
										}`}
									>
										<tab.icon className="h-5 w-5" />
										{tab.name}
									</button>
								))}
							</nav>
						</div>
					</div>

					{/* Top 3 Podium */}
					{Array.isArray(currentData) && currentData.length >= 3 && (
						<div className="mb-8">
							<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
								{/* 2nd Place */}
								<div className="order-2 md:order-1">
									<div className="card p-6 text-center relative">
										<div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
											<div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center">
												<StarIcon className="h-5 w-5 text-white" />
											</div>
										</div>
										<div className="mt-4">
											<div className="w-16 h-16 bg-gray-200 dark:bg-slate-700 rounded-full mx-auto mb-3 flex items-center justify-center">
												<UserIcon className="h-8 w-8 text-gray-500 dark:text-slate-400" />
											</div>
											<h3 className="font-semibold text-gray-900 dark:text-white mb-1">
												{currentData[1].name}
											</h3>
											<p className="text-2xl font-bold text-gray-400 mb-2">
												{currentData[1].score}
											</p>
											<div className="flex items-center justify-center gap-2 text-sm text-gray-600 dark:text-slate-300">
												<FireIcon className="h-4 w-4" />
												<span>{currentData[1].streak} day streak</span>
											</div>
										</div>
									</div>
								</div>

								{/* 1st Place */}
								<div className="order-1 md:order-2">
									<div className="card p-6 text-center relative transform scale-105">
										<div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
											<div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center">
												<TrophyIcon className="h-6 w-6 text-white" />
											</div>
										</div>
										<div className="mt-4">
											<div className="w-20 h-20 bg-yellow-100 dark:bg-yellow-900/20 rounded-full mx-auto mb-3 flex items-center justify-center">
												<UserIcon className="h-10 w-10 text-yellow-600 dark:text-yellow-400" />
											</div>
											<h3 className="font-semibold text-gray-900 dark:text-white mb-1">
												{currentData[0].name}
											</h3>
											<p className="text-3xl font-bold text-yellow-600 dark:text-yellow-400 mb-2">
												{currentData[0].score}
											</p>
											<div className="flex items-center justify-center gap-2 text-sm text-gray-600 dark:text-slate-300">
												<FireIcon className="h-4 w-4" />
												<span>{currentData[0].streak} day streak</span>
											</div>
										</div>
									</div>
								</div>

								{/* 3rd Place */}
								<div className="order-3">
									<div className="card p-6 text-center relative">
										<div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
											<div className="w-8 h-8 bg-amber-600 rounded-full flex items-center justify-center">
												<StarIcon className="h-5 w-5 text-white" />
											</div>
										</div>
										<div className="mt-4">
											<div className="w-16 h-16 bg-amber-100 dark:bg-amber-900/20 rounded-full mx-auto mb-3 flex items-center justify-center">
												<UserIcon className="h-8 w-8 text-amber-600 dark:text-amber-400" />
											</div>
											<h3 className="font-semibold text-gray-900 dark:text-white mb-1">
												{currentData[2].name}
											</h3>
											<p className="text-2xl font-bold text-amber-600 dark:text-amber-400 mb-2">
												{currentData[2].score}
											</p>
											<div className="flex items-center justify-center gap-2 text-sm text-gray-600 dark:text-slate-300">
												<FireIcon className="h-4 w-4" />
												<span>{currentData[2].streak} day streak</span>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					)}

					{/* Full Leaderboard */}
					<div className="card">
						<div className="p-6 border-b border-gray-200 dark:border-slate-700">
							<h2 className="text-xl font-semibold text-gray-900 dark:text-white">
								Full Rankings
							</h2>
						</div>
						<div className="overflow-hidden">
							<table className="min-w-full divide-y divide-gray-200 dark:divide-slate-700">
								<thead className="bg-gray-50 dark:bg-slate-700">
									<tr>
										<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-300 uppercase tracking-wider">
											Rank
										</th>
										<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-300 uppercase tracking-wider">
											User
										</th>
										<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-300 uppercase tracking-wider">
											Score
										</th>
										<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-300 uppercase tracking-wider">
											Problems
										</th>
										<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-300 uppercase tracking-wider">
											Avg Score
										</th>
										<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-300 uppercase tracking-wider">
											Streak
										</th>
										<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-300 uppercase tracking-wider">
											Level
										</th>
									</tr>
								</thead>
								<tbody className="bg-white dark:bg-slate-800 divide-y divide-gray-200 dark:divide-slate-700">
									{Array.isArray(currentData) &&
										currentData.map((entry) => (
											<tr
												key={entry.id}
												className="hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
											>
												<td className="px-6 py-4 whitespace-nowrap">
													<div className="flex items-center">
														{getRankIcon(entry.rank)}
													</div>
												</td>
												<td className="px-6 py-4 whitespace-nowrap">
													<div className="flex items-center">
														<div className="flex-shrink-0 h-10 w-10">
															<div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-slate-700 flex items-center justify-center">
																<UserIcon className="h-6 w-6 text-gray-500 dark:text-slate-400" />
															</div>
														</div>
														<div className="ml-4">
															<div className="text-sm font-medium text-gray-900 dark:text-white">
																{entry.name}
															</div>
															<div className="text-sm text-gray-500 dark:text-slate-400">
																{entry.email}
															</div>
															{entry.achievements.length > 0 && (
																<div className="flex items-center gap-1 mt-1">
																	{entry.achievements
																		.slice(0, 2)
																		.map((achievement, index) => (
																			<span
																				key={index}
																				className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900/20 dark:text-indigo-300"
																			>
																				{achievement}
																			</span>
																		))}
																	{entry.achievements.length > 2 && (
																		<span className="text-xs text-gray-500 dark:text-slate-400">
																			+{entry.achievements.length - 2} more
																		</span>
																	)}
																</div>
															)}
														</div>
													</div>
												</td>
												<td className="px-6 py-4 whitespace-nowrap">
													<div className="text-sm font-bold text-gray-900 dark:text-white">
														{entry.score.toLocaleString()}
													</div>
												</td>
												<td className="px-6 py-4 whitespace-nowrap">
													<div className="text-sm text-gray-900 dark:text-white">
														{entry.problemsSolved}
													</div>
												</td>
												<td className="px-6 py-4 whitespace-nowrap">
													<div className="text-sm text-gray-900 dark:text-white">
														{entry.averageScore}%
													</div>
												</td>
												<td className="px-6 py-4 whitespace-nowrap">
													<div className="flex items-center gap-1">
														<FireIcon className="h-4 w-4 text-orange-500" />
														<span className="text-sm text-gray-900 dark:text-white">
															{entry.streak} days
														</span>
													</div>
												</td>
												<td className="px-6 py-4 whitespace-nowrap">
													<div className="flex items-center gap-1">
														<AcademicCapIcon
															className={`h-4 w-4 ${getLevelColor(entry.level)}`}
														/>
														<span
															className={`text-sm font-medium ${getLevelColor(entry.level)}`}
														>
															Level {entry.level}
														</span>
													</div>
												</td>
											</tr>
										))}
								</tbody>
							</table>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
