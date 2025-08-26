"use client";

import {
	ArrowPathIcon,
	ChevronDownIcon,
	ChevronUpIcon,
	FireIcon,
	TrophyIcon,
	UserIcon,
} from "@heroicons/react/24/outline";
import { TrophyIcon as TrophySolidIcon } from "@heroicons/react/24/solid";
import { useEffect, useState } from "react";

interface LeaderboardEntry {
	id: string;
	username: string;
	avatar?: string;
	rank: number;
	score: number;
	problemsSolved: number;
	accuracy: number;
	averageTime: number;
	streak: number;
	badges: Badge[];
	country?: string;
	rankChange: number; // +/- from previous period
	isCurrentUser?: boolean;
	level: number;
	experience: number;
	nextLevelExp: number;
}

interface Badge {
	id: string;
	name: string;
	icon: string;
	rarity: "common" | "rare" | "epic" | "legendary";
	earnedDate: string;
}

interface Tournament {
	id: string;
	name: string;
	startDate: string;
	endDate: string;
	participants: number;
	prize: string;
	status: "upcoming" | "active" | "completed";
	difficulty: "Easy" | "Medium" | "Hard" | "Mixed";
}

export default function CompetitiveLeaderboard() {
	const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
	const [tournaments, setTournaments] = useState<Tournament[]>([]);
	const [selectedTimeframe, setSelectedTimeframe] = useState<
		"daily" | "weekly" | "monthly" | "allTime"
	>("weekly");
	const [selectedCategory, setSelectedCategory] = useState<
		"global" | "friends" | "country"
	>("global");
	const [loading, setLoading] = useState(true);
	const [_showUserRank, _setShowUserRank] = useState(false);

	useEffect(() => {
		fetchLeaderboardData();
		fetchTournaments();
	}, []);

	const fetchLeaderboardData = async () => {
		setLoading(true);
		await new Promise((resolve) => setTimeout(resolve, 1000));

		const mockData: LeaderboardEntry[] = Array.from(
			{ length: 100 },
			(_, index) => ({
				id: `user-${index + 1}`,
				username: generateUsername(),
				rank: index + 1,
				score: 5000 - index * 45 + Math.floor(Math.random() * 40),
				problemsSolved: 450 - index * 4 + Math.floor(Math.random() * 8),
				accuracy: 95 - Math.floor(Math.random() * 15),
				averageTime: 15 + Math.floor(Math.random() * 20),
				streak: Math.floor(Math.random() * 30) + 1,
				badges: generateBadges(),
				country: getRandomCountry(),
				rankChange: Math.floor(Math.random() * 21) - 10,
				isCurrentUser: index === 42, // Current user at rank 43
				level: Math.floor((450 - index * 4) / 50) + 1,
				experience: Math.floor(Math.random() * 1000),
				nextLevelExp: 1000,
			}),
		);

		setLeaderboard(mockData);
		setLoading(false);
	};

	const fetchTournaments = async () => {
		const mockTournaments: Tournament[] = [
			{
				id: "weekly-sprint",
				name: "Weekly Algorithm Sprint",
				startDate: "2024-01-20",
				endDate: "2024-01-27",
				participants: 1245,
				prize: "🏆 $500 + Premium Badge",
				status: "active",
				difficulty: "Mixed",
			},
			{
				id: "dp-masters",
				name: "Dynamic Programming Masters",
				startDate: "2024-01-28",
				endDate: "2024-02-04",
				participants: 0,
				prize: "💎 DP Master Badge + $200",
				status: "upcoming",
				difficulty: "Hard",
			},
			{
				id: "beginner-cup",
				name: "Beginner's Cup",
				startDate: "2024-01-15",
				endDate: "2024-01-22",
				participants: 2341,
				prize: "🌟 Rising Star Badge",
				status: "completed",
				difficulty: "Easy",
			},
		];

		setTournaments(mockTournaments);
	};

	const generateUsername = (): string => {
		const adjectives = [
			"Swift",
			"Clever",
			"Brilliant",
			"Sharp",
			"Quick",
			"Smart",
			"Wise",
			"Nimble",
			"Fast",
			"Keen",
		];
		const nouns = [
			"Coder",
			"Dev",
			"Algo",
			"Binary",
			"Logic",
			"Code",
			"Script",
			"Debug",
			"Loop",
			"Function",
		];
		const numbers = Math.floor(Math.random() * 999) + 1;
		return `${adjectives[Math.floor(Math.random() * adjectives.length)]}${nouns[Math.floor(Math.random() * nouns.length)]}${numbers}`;
	};

	const generateBadges = (): Badge[] => {
		const allBadges = [
			{
				id: "speed-demon",
				name: "Speed Demon",
				icon: "⚡",
				rarity: "rare" as const,
			},
			{
				id: "perfectionist",
				name: "Perfectionist",
				icon: "💯",
				rarity: "epic" as const,
			},
			{
				id: "streak-master",
				name: "Streak Master",
				icon: "🔥",
				rarity: "rare" as const,
			},
			{
				id: "problem-solver",
				name: "Problem Solver",
				icon: "🧩",
				rarity: "common" as const,
			},
			{
				id: "algorithm-expert",
				name: "Algorithm Expert",
				icon: "🎯",
				rarity: "legendary" as const,
			},
		];

		return allBadges
			.slice(0, Math.floor(Math.random() * 4) + 1)
			.map((badge) => ({
				...badge,
				earnedDate: "2024-01-15",
			}));
	};

	const getRandomCountry = (): string => {
		const countries = [
			"🇺🇸",
			"🇨🇳",
			"🇮🇳",
			"🇯🇵",
			"🇰🇷",
			"🇬🇧",
			"🇩🇪",
			"🇫🇷",
			"🇨🇦",
			"🇦🇺",
		];
		return countries[Math.floor(Math.random() * countries.length)];
	};

	const getRankIcon = (rank: number) => {
		if (rank === 1)
			return <TrophySolidIcon className="h-6 w-6 text-yellow-500" />;
		if (rank === 2)
			return <TrophySolidIcon className="h-6 w-6 text-gray-400" />;
		if (rank === 3)
			return <TrophySolidIcon className="h-6 w-6 text-amber-600" />;
		return null;
	};

	const getBadgeRarityColor = (rarity: string) => {
		const colors = {
			common: "bg-gray-100 text-gray-800",
			rare: "bg-blue-100 text-blue-800",
			epic: "bg-purple-100 text-purple-800",
			legendary: "bg-yellow-100 text-yellow-800",
		};
		return colors[rarity as keyof typeof colors] || colors.common;
	};

	const currentUser = leaderboard.find((entry) => entry.isCurrentUser);

	if (loading) {
		return (
			<div className="flex items-center justify-center min-h-96">
				<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
			</div>
		);
	}

	return (
		<div className="max-w-7xl mx-auto p-6 space-y-6">
			{/* Header */}
			<div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
				<div>
					<h1 className="text-3xl font-bold text-gray-900">
						Competitive Leaderboard
					</h1>
					<p className="text-gray-600 mt-1">
						Compete with coders worldwide and climb the ranks
					</p>
				</div>

				<div className="flex flex-wrap gap-3">
					<select
						value={selectedTimeframe}
						onChange={(e) => setSelectedTimeframe(e.target.value as any)}
						className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
					>
						<option value="daily">Daily</option>
						<option value="weekly">Weekly</option>
						<option value="monthly">Monthly</option>
						<option value="allTime">All Time</option>
					</select>

					<select
						value={selectedCategory}
						onChange={(e) => setSelectedCategory(e.target.value as any)}
						className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
					>
						<option value="global">Global</option>
						<option value="friends">Friends</option>
						<option value="country">Country</option>
					</select>

					<button
						onClick={fetchLeaderboardData}
						className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors flex items-center gap-2"
					>
						<ArrowPathIcon className="h-4 w-4" />
						Refresh
					</button>
				</div>
			</div>

			{/* Current User Stats */}
			{currentUser && (
				<div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
					<div className="flex items-center justify-between">
						<div>
							<h3 className="text-xl font-bold mb-2">Your Current Ranking</h3>
							<div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
								<div>
									<div className="text-blue-100">Rank</div>
									<div className="text-2xl font-bold">#{currentUser.rank}</div>
								</div>
								<div>
									<div className="text-blue-100">Score</div>
									<div className="text-2xl font-bold">
										{currentUser.score.toLocaleString()}
									</div>
								</div>
								<div>
									<div className="text-blue-100">Problems</div>
									<div className="text-2xl font-bold">
										{currentUser.problemsSolved}
									</div>
								</div>
								<div>
									<div className="text-blue-100">Accuracy</div>
									<div className="text-2xl font-bold">
										{currentUser.accuracy}%
									</div>
								</div>
							</div>
						</div>

						<div className="text-right">
							<div className="text-blue-100">Level {currentUser.level}</div>
							<div className="w-32 bg-blue-700 rounded-full h-3 mt-2">
								<div
									className="bg-white rounded-full h-3 transition-all duration-300"
									style={{
										width: `${(currentUser.experience / currentUser.nextLevelExp) * 100}%`,
									}}
								/>
							</div>
							<div className="text-xs text-blue-100 mt-1">
								{currentUser.experience} / {currentUser.nextLevelExp} XP
							</div>
						</div>
					</div>
				</div>
			)}

			{/* Tournaments */}
			<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
				<h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
					<TrophyIcon className="h-5 w-5" />
					Active Tournaments
				</h3>

				<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
					{tournaments.map((tournament) => (
						<div
							key={tournament.id}
							className={`border rounded-lg p-4 ${
								tournament.status === "active"
									? "border-green-200 bg-green-50"
									: tournament.status === "upcoming"
										? "border-blue-200 bg-blue-50"
										: "border-gray-200 bg-gray-50"
							}`}
						>
							<div className="flex items-center justify-between mb-2">
								<h4 className="font-medium text-gray-900">{tournament.name}</h4>
								<span
									className={`px-2 py-1 text-xs font-semibold rounded-full ${
										tournament.status === "active"
											? "bg-green-100 text-green-800"
											: tournament.status === "upcoming"
												? "bg-blue-100 text-blue-800"
												: "bg-gray-100 text-gray-800"
									}`}
								>
									{tournament.status}
								</span>
							</div>

							<div className="text-sm text-gray-600 space-y-1">
								<div>
									📅 {tournament.startDate} - {tournament.endDate}
								</div>
								<div>
									👥 {tournament.participants.toLocaleString()} participants
								</div>
								<div>🎯 {tournament.difficulty} difficulty</div>
								<div className="font-medium text-gray-900">
									{tournament.prize}
								</div>
							</div>

							<button
								className={`mt-3 w-full px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
									tournament.status === "active"
										? "bg-green-600 text-white hover:bg-green-700"
										: tournament.status === "upcoming"
											? "bg-blue-600 text-white hover:bg-blue-700"
											: "bg-gray-300 text-gray-500 cursor-not-allowed"
								}`}
							>
								{tournament.status === "active"
									? "Join Now"
									: tournament.status === "upcoming"
										? "Register"
										: "Completed"}
							</button>
						</div>
					))}
				</div>
			</div>

			{/* Leaderboard */}
			<div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
				<div className="px-6 py-4 border-b border-gray-200">
					<h3 className="text-lg font-semibold text-gray-900">
						Top Performers
					</h3>
				</div>

				<div className="overflow-x-auto">
					<table className="min-w-full divide-y divide-gray-200">
						<thead className="bg-gray-50">
							<tr>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Rank
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									User
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Score
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Problems
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Accuracy
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Streak
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Badges
								</th>
							</tr>
						</thead>
						<tbody className="bg-white divide-y divide-gray-200">
							{leaderboard.slice(0, 50).map((entry) => (
								<tr
									key={entry.id}
									className={`hover:bg-gray-50 ${
										entry.isCurrentUser
											? "bg-blue-50 border-l-4 border-blue-600"
											: ""
									}`}
								>
									<td className="px-6 py-4 whitespace-nowrap">
										<div className="flex items-center gap-2">
											{getRankIcon(entry.rank)}
											<span
												className={`font-bold ${
													entry.rank <= 3
														? "text-yellow-600"
														: entry.isCurrentUser
															? "text-blue-600"
															: "text-gray-900"
												}`}
											>
												#{entry.rank}
											</span>

											{entry.rankChange !== 0 && (
												<div
													className={`flex items-center text-xs ${
														entry.rankChange > 0
															? "text-green-600"
															: "text-red-600"
													}`}
												>
													{entry.rankChange > 0 ? (
														<ChevronUpIcon className="h-3 w-3" />
													) : (
														<ChevronDownIcon className="h-3 w-3" />
													)}
													{Math.abs(entry.rankChange)}
												</div>
											)}
										</div>
									</td>

									<td className="px-6 py-4 whitespace-nowrap">
										<div className="flex items-center gap-3">
											<div className="h-8 w-8 bg-gray-300 rounded-full flex items-center justify-center">
												<UserIcon className="h-5 w-5 text-gray-600" />
											</div>
											<div>
												<div
													className={`font-medium ${
														entry.isCurrentUser
															? "text-blue-900"
															: "text-gray-900"
													}`}
												>
													{entry.username} {entry.isCurrentUser && "(You)"}
												</div>
												<div className="flex items-center gap-1 text-sm text-gray-500">
													{entry.country}
													<span>Level {entry.level}</span>
												</div>
											</div>
										</div>
									</td>

									<td className="px-6 py-4 whitespace-nowrap">
										<span
											className={`font-semibold ${
												entry.isCurrentUser ? "text-blue-600" : "text-gray-900"
											}`}
										>
											{entry.score.toLocaleString()}
										</span>
									</td>

									<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
										{entry.problemsSolved}
									</td>

									<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
										<span
											className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
												entry.accuracy >= 90
													? "bg-green-100 text-green-800"
													: entry.accuracy >= 75
														? "bg-yellow-100 text-yellow-800"
														: "bg-red-100 text-red-800"
											}`}
										>
											{entry.accuracy}%
										</span>
									</td>

									<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
										<div className="flex items-center gap-1">
											<FireIcon className="h-4 w-4 text-orange-500" />
											{entry.streak}
										</div>
									</td>

									<td className="px-6 py-4 whitespace-nowrap">
										<div className="flex gap-1">
											{entry.badges.slice(0, 3).map((badge) => (
												<span
													key={badge.id}
													className={`inline-flex px-1.5 py-0.5 text-xs font-medium rounded ${getBadgeRarityColor(
														badge.rarity,
													)}`}
													title={`${badge.name} - ${badge.rarity}`}
												>
													{badge.icon}
												</span>
											))}
											{entry.badges.length > 3 && (
												<span className="text-xs text-gray-500">
													+{entry.badges.length - 3}
												</span>
											)}
										</div>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>

				{/* Load More */}
				<div className="px-6 py-4 border-t border-gray-200 text-center">
					<button className="px-4 py-2 text-sm text-blue-600 hover:text-blue-700 font-medium">
						Load More Rankings
					</button>
				</div>
			</div>
		</div>
	);
}
