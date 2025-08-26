"use client";

import {
	ChartBarIcon,
	CheckCircleIcon,
	ClockIcon,
	FireIcon,
	TrophyIcon,
	XCircleIcon,
} from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";

interface ProgressData {
	totalAttempts: number;
	completedAttempts: number;
	averageScore: number;
	totalTimeSpent: number;
	currentStreak: number;
	bestStreak: number;
	problemsSolved: number;
	accuracyRate: number;
	recentActivity: Array<{
		id: string;
		quizTitle: string;
		score: number;
		timeSpent: number;
		completedAt: string;
		difficulty: string;
	}>;
	difficultyBreakdown: {
		easy: { solved: number; total: number };
		medium: { solved: number; total: number };
		hard: { solved: number; total: number };
	};
	categoryProgress: Array<{
		category: string;
		solved: number;
		total: number;
		percentage: number;
	}>;
}

export default function ProgressPage() {
	const [progressData, setProgressData] = useState<ProgressData | null>(null);
	const [loading, setLoading] = useState(true);
	const [timeRange, setTimeRange] = useState("week");

	useEffect(() => {
		fetchProgressData();
	}, [fetchProgressData]);

	const fetchProgressData = async () => {
		try {
			const response = await fetch(`/api/progress?timeRange=${timeRange}`);
			const data = await response.json();
			setProgressData(data);
		} catch (error) {
			console.error("Error fetching progress data:", error);
		} finally {
			setLoading(false);
		}
	};

	const formatTime = (minutes: number) => {
		const hours = Math.floor(minutes / 60);
		const mins = minutes % 60;
		return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
	};

	const getScoreColor = (score: number) => {
		if (score >= 80) return "text-green-600 dark:text-green-400";
		if (score >= 60) return "text-yellow-600 dark:text-yellow-400";
		return "text-red-600 dark:text-red-400";
	};

	const getDifficultyColor = (difficulty: string) => {
		switch (difficulty) {
			case "Easy":
				return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300";
			case "Medium":
				return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300";
			case "Hard":
				return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300";
			default:
				return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300";
		}
	};

	if (loading) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
				<div className="lg:pl-64">
					<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
						<div className="animate-pulse">
							<div className="h-8 bg-gray-200 dark:bg-slate-700 rounded w-1/4 mb-4"></div>
							<div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-1/2 mb-8"></div>
							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
								{[...Array(4)].map((_, i) => (
									<div key={i} className="card p-6">
										<div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-1/2 mb-2"></div>
										<div className="h-8 bg-gray-200 dark:bg-slate-700 rounded w-1/3"></div>
									</div>
								))}
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}

	if (!progressData) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
				<div className="lg:pl-64">
					<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
						<div className="text-center">
							<h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
								No Progress Data Available
							</h1>
							<p className="text-gray-600 dark:text-slate-300">
								Start taking quizzes to see your progress here!
							</p>
						</div>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
			<div className="lg:pl-64">
				<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
					{/* Header */}
					<div className="mb-8">
						<div className="flex items-center justify-between">
							<div>
								<h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
									Your Progress
								</h1>
								<p className="text-gray-600 dark:text-slate-300">
									Track your learning journey and see how you're improving
								</p>
							</div>
							<div className="flex gap-2">
								{["week", "month", "year"].map((range) => (
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

					{/* Stats Cards */}
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
						<div className="card p-6">
							<div className="flex items-center">
								<div className="flex-shrink-0">
									<div className="w-12 h-12 bg-indigo-500 rounded-xl flex items-center justify-center">
										<TrophyIcon className="w-6 h-6 text-white" />
									</div>
								</div>
								<div className="ml-4">
									<p className="text-sm font-medium text-gray-500 dark:text-slate-400">
										Problems Solved
									</p>
									<p className="text-2xl font-bold text-gray-900 dark:text-white">
										{progressData.problemsSolved}
									</p>
								</div>
							</div>
						</div>

						<div className="card p-6">
							<div className="flex items-center">
								<div className="flex-shrink-0">
									<div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
										<ChartBarIcon className="w-6 h-6 text-white" />
									</div>
								</div>
								<div className="ml-4">
									<p className="text-sm font-medium text-gray-500 dark:text-slate-400">
										Average Score
									</p>
									<p className="text-2xl font-bold text-gray-900 dark:text-white">
										{progressData.averageScore}%
									</p>
								</div>
							</div>
						</div>

						<div className="card p-6">
							<div className="flex items-center">
								<div className="flex-shrink-0">
									<div className="w-12 h-12 bg-yellow-500 rounded-xl flex items-center justify-center">
										<FireIcon className="w-6 h-6 text-white" />
									</div>
								</div>
								<div className="ml-4">
									<p className="text-sm font-medium text-gray-500 dark:text-slate-400">
										Current Streak
									</p>
									<p className="text-2xl font-bold text-gray-900 dark:text-white">
										{progressData.currentStreak} days
									</p>
								</div>
							</div>
						</div>

						<div className="card p-6">
							<div className="flex items-center">
								<div className="flex-shrink-0">
									<div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center">
										<ClockIcon className="w-6 h-6 text-white" />
									</div>
								</div>
								<div className="ml-4">
									<p className="text-sm font-medium text-gray-500 dark:text-slate-400">
										Time Spent
									</p>
									<p className="text-2xl font-bold text-gray-900 dark:text-white">
										{formatTime(progressData.totalTimeSpent)}
									</p>
								</div>
							</div>
						</div>
					</div>

					{/* Progress Charts */}
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
						{/* Difficulty Progress */}
						<div className="card p-6">
							<h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
								Difficulty Progress
							</h3>
							<div className="space-y-4">
								{Object.entries(progressData.difficultyBreakdown).map(
									([difficulty, data]) => (
										<div
											key={difficulty}
											className="flex items-center justify-between"
										>
											<div className="flex items-center gap-3">
												<span
													className={`badge ${getDifficultyColor(difficulty.charAt(0).toUpperCase() + difficulty.slice(1))}`}
												>
													{difficulty.charAt(0).toUpperCase() +
														difficulty.slice(1)}
												</span>
												<span className="text-sm text-gray-600 dark:text-slate-300">
													{data.solved}/{data.total}
												</span>
											</div>
											<div className="flex items-center gap-2">
												<div className="w-24 bg-gray-200 dark:bg-slate-700 rounded-full h-2">
													<div
														className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
														style={{
															width: `${(data.solved / data.total) * 100}%`,
														}}
													></div>
												</div>
												<span className="text-sm font-medium text-gray-900 dark:text-white w-12 text-right">
													{Math.round((data.solved / data.total) * 100)}%
												</span>
											</div>
										</div>
									),
								)}
							</div>
						</div>

						{/* Category Progress */}
						<div className="card p-6">
							<h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
								Category Progress
							</h3>
							<div className="space-y-3">
								{progressData.categoryProgress.slice(0, 6).map((category) => (
									<div
										key={category.category}
										className="flex items-center justify-between"
									>
										<span className="text-sm text-gray-600 dark:text-slate-300">
											{category.category}
										</span>
										<div className="flex items-center gap-2">
											<div className="w-20 bg-gray-200 dark:bg-slate-700 rounded-full h-2">
												<div
													className="bg-green-600 h-2 rounded-full transition-all duration-300"
													style={{ width: `${category.percentage}%` }}
												></div>
											</div>
											<span className="text-sm font-medium text-gray-900 dark:text-white w-12 text-right">
												{category.percentage}%
											</span>
										</div>
									</div>
								))}
							</div>
						</div>
					</div>

					{/* Recent Activity */}
					<div className="card p-6">
						<h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
							Recent Activity
						</h3>
						{progressData.recentActivity.length > 0 ? (
							<div className="overflow-x-auto">
								<table className="min-w-full divide-y divide-gray-200 dark:divide-slate-700">
									<thead className="bg-gray-50 dark:bg-slate-700">
										<tr>
											<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-300 uppercase tracking-wider">
												Quiz
											</th>
											<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-300 uppercase tracking-wider">
												Score
											</th>
											<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-300 uppercase tracking-wider">
												Time
											</th>
											<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-300 uppercase tracking-wider">
												Date
											</th>
											<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-300 uppercase tracking-wider">
												Status
											</th>
										</tr>
									</thead>
									<tbody className="bg-white dark:bg-slate-800 divide-y divide-gray-200 dark:divide-slate-700">
										{progressData.recentActivity.map((activity) => (
											<tr
												key={activity.id}
												className="hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
											>
												<td className="px-6 py-4 whitespace-nowrap">
													<div className="flex items-center">
														<div className="flex-shrink-0 h-8 w-8 bg-indigo-100 dark:bg-indigo-900/20 rounded-lg flex items-center justify-center">
															<ChartBarIcon className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
														</div>
														<div className="ml-3">
															<div className="text-sm font-medium text-gray-900 dark:text-white">
																{activity.quizTitle}
															</div>
															<div className="flex items-center gap-2">
																<span
																	className={`badge ${getDifficultyColor(activity.difficulty)}`}
																>
																	{activity.difficulty}
																</span>
															</div>
														</div>
													</div>
												</td>
												<td className="px-6 py-4 whitespace-nowrap">
													<span
														className={`text-sm font-medium ${getScoreColor(activity.score)}`}
													>
														{activity.score}%
													</span>
												</td>
												<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
													{formatTime(activity.timeSpent)}
												</td>
												<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-slate-400">
													{new Date(activity.completedAt).toLocaleDateString()}
												</td>
												<td className="px-6 py-4 whitespace-nowrap">
													{activity.score >= 60 ? (
														<CheckCircleIcon className="h-5 w-5 text-green-500" />
													) : (
														<XCircleIcon className="h-5 w-5 text-red-500" />
													)}
												</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
						) : (
							<div className="text-center py-8">
								<div className="mx-auto h-12 w-12 text-gray-400 mb-4">
									<ChartBarIcon className="h-12 w-12" />
								</div>
								<h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
									No recent activity
								</h3>
								<p className="text-gray-600 dark:text-slate-300">
									Start taking quizzes to see your activity here
								</p>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
