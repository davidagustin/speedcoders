"use client";

import {
	AcademicCapIcon,
	ArrowTrendingUpIcon,
	BoltIcon,
	ChartBarIcon,
	ClockIcon,
	FireIcon,
	StarIcon,
	TrophyIcon,
} from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";

interface AnalyticsData {
	totalProblems: number;
	solvedProblems: number;
	accuracy: number;
	averageTime: number;
	streak: number;
	rank: number;
	categoryBreakdown: CategoryStats[];
	difficultyBreakdown: DifficultyStats[];
	recentActivity: ActivityPoint[];
	strengthsWeaknesses: SkillAnalysis;
	timeSpentDaily: TimeData[];
	algorithmMastery: AlgorithmStats[];
	competitiveRanking: RankingData;
}

interface CategoryStats {
	category: string;
	solved: number;
	total: number;
	accuracy: number;
	averageTime: number;
}

interface DifficultyStats {
	difficulty: "Easy" | "Medium" | "Hard";
	solved: number;
	total: number;
	accuracy: number;
	averageTime: number;
	trending: "up" | "down" | "stable";
}

interface ActivityPoint {
	date: string;
	problemsSolved: number;
	timeSpent: number;
	accuracy: number;
}

interface SkillAnalysis {
	strengths: string[];
	weaknesses: string[];
	improving: string[];
	stagnant: string[];
}

interface TimeData {
	date: string;
	minutes: number;
}

interface AlgorithmStats {
	algorithm: string;
	mastery: number;
	problemsSolved: number;
	lastUsed: string;
	trending: "up" | "down" | "stable";
}

interface RankingData {
	currentRank: number;
	totalUsers: number;
	rankChange: number;
	percentile: number;
	nearbyUsers: RankingUser[];
}

interface RankingUser {
	username: string;
	rank: number;
	score: number;
	isCurrentUser?: boolean;
}

export default function AdvancedAnalytics() {
	const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(
		null,
	);
	const [selectedTimeframe, setSelectedTimeframe] = useState<
		"7d" | "30d" | "90d" | "1y"
	>("30d");
	const [activeTab, setActiveTab] = useState<
		"overview" | "categories" | "algorithms" | "competitive"
	>("overview");
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		fetchAnalyticsData();
	}, [fetchAnalyticsData]);

	const fetchAnalyticsData = async () => {
		setLoading(true);
		// Simulate API call
		await new Promise((resolve) => setTimeout(resolve, 1000));

		const mockData: AnalyticsData = {
			totalProblems: 1247,
			solvedProblems: 342,
			accuracy: 78.5,
			averageTime: 23.4,
			streak: 12,
			rank: 1543,
			categoryBreakdown: [
				{
					category: "Array",
					solved: 45,
					total: 120,
					accuracy: 82.3,
					averageTime: 18.2,
				},
				{
					category: "Dynamic Programming",
					solved: 23,
					total: 85,
					accuracy: 65.4,
					averageTime: 35.7,
				},
				{
					category: "Tree",
					solved: 34,
					total: 95,
					accuracy: 88.2,
					averageTime: 21.3,
				},
				{
					category: "Graph",
					solved: 18,
					total: 76,
					accuracy: 72.1,
					averageTime: 42.1,
				},
				{
					category: "String",
					solved: 39,
					total: 102,
					accuracy: 79.5,
					averageTime: 19.8,
				},
				{
					category: "Hash Table",
					solved: 28,
					total: 78,
					accuracy: 84.6,
					averageTime: 16.4,
				},
			],
			difficultyBreakdown: [
				{
					difficulty: "Easy",
					solved: 156,
					total: 234,
					accuracy: 89.2,
					averageTime: 12.3,
					trending: "stable",
				},
				{
					difficulty: "Medium",
					solved: 142,
					total: 456,
					accuracy: 74.6,
					averageTime: 28.7,
					trending: "up",
				},
				{
					difficulty: "Hard",
					solved: 44,
					total: 557,
					accuracy: 56.8,
					averageTime: 47.2,
					trending: "down",
				},
			],
			recentActivity: generateActivityData(),
			strengthsWeaknesses: {
				strengths: ["Array Manipulation", "Hash Tables", "Tree Traversal"],
				weaknesses: ["Dynamic Programming", "Graph Algorithms", "Backtracking"],
				improving: ["Binary Search", "Two Pointers"],
				stagnant: ["Bit Manipulation", "Math"],
			},
			timeSpentDaily: generateTimeData(),
			algorithmMastery: [
				{
					algorithm: "Two Pointers",
					mastery: 85,
					problemsSolved: 23,
					lastUsed: "2 days ago",
					trending: "up",
				},
				{
					algorithm: "Sliding Window",
					mastery: 72,
					problemsSolved: 18,
					lastUsed: "1 day ago",
					trending: "stable",
				},
				{
					algorithm: "Binary Search",
					mastery: 68,
					problemsSolved: 15,
					lastUsed: "3 days ago",
					trending: "up",
				},
				{
					algorithm: "DFS",
					mastery: 79,
					problemsSolved: 31,
					lastUsed: "1 day ago",
					trending: "stable",
				},
				{
					algorithm: "Dynamic Programming",
					mastery: 45,
					problemsSolved: 12,
					lastUsed: "5 days ago",
					trending: "down",
				},
				{
					algorithm: "Greedy",
					mastery: 62,
					problemsSolved: 19,
					lastUsed: "2 days ago",
					trending: "up",
				},
			],
			competitiveRanking: {
				currentRank: 1543,
				totalUsers: 45632,
				rankChange: -23,
				percentile: 96.6,
				nearbyUsers: [
					{ username: "CodeMaster2024", rank: 1541, score: 2847 },
					{ username: "AlgoWizard", rank: 1542, score: 2845 },
					{ username: "You", rank: 1543, score: 2843, isCurrentUser: true },
					{ username: "DataStructGuru", rank: 1544, score: 2841 },
					{ username: "PythonNinja", rank: 1545, score: 2839 },
				],
			},
		};

		setAnalyticsData(mockData);
		setLoading(false);
	};

	const generateActivityData = (): ActivityPoint[] => {
		const data: ActivityPoint[] = [];
		const now = new Date();

		for (let i = 29; i >= 0; i--) {
			const date = new Date(now);
			date.setDate(date.getDate() - i);

			data.push({
				date: date.toISOString().split("T")[0],
				problemsSolved: Math.floor(Math.random() * 8) + 1,
				timeSpent: Math.floor(Math.random() * 120) + 30,
				accuracy: Math.floor(Math.random() * 40) + 60,
			});
		}

		return data;
	};

	const generateTimeData = (): TimeData[] => {
		const data: TimeData[] = [];
		const now = new Date();

		for (let i = 29; i >= 0; i--) {
			const date = new Date(now);
			date.setDate(date.getDate() - i);

			data.push({
				date: date.toISOString().split("T")[0],
				minutes: Math.floor(Math.random() * 180) + 20,
			});
		}

		return data;
	};

	if (loading || !analyticsData) {
		return (
			<div className="flex items-center justify-center min-h-96">
				<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
			</div>
		);
	}

	return (
		<div className="max-w-7xl mx-auto p-6 space-y-6">
			{/* Header */}
			<div className="flex justify-between items-center">
				<div>
					<h1 className="text-3xl font-bold text-gray-900">
						Analytics Dashboard
					</h1>
					<p className="text-gray-600 mt-1">
						Track your coding journey and performance insights
					</p>
				</div>
				<div className="flex gap-2">
					{(["7d", "30d", "90d", "1y"] as const).map((period) => (
						<button
							key={period}
							onClick={() => setSelectedTimeframe(period)}
							className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
								selectedTimeframe === period
									? "bg-blue-600 text-white"
									: "bg-gray-100 text-gray-700 hover:bg-gray-200"
							}`}
						>
							{period}
						</button>
					))}
				</div>
			</div>

			{/* Key Metrics Cards */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
				<MetricCard
					title="Problems Solved"
					value={analyticsData.solvedProblems}
					total={analyticsData.totalProblems}
					icon={ChartBarIcon}
					color="blue"
					suffix={`/ ${analyticsData.totalProblems}`}
				/>
				<MetricCard
					title="Accuracy Rate"
					value={analyticsData.accuracy}
					icon={TrophyIcon}
					color="green"
					suffix="%"
				/>
				<MetricCard
					title="Avg Solve Time"
					value={analyticsData.averageTime}
					icon={ClockIcon}
					color="yellow"
					suffix=" min"
				/>
				<MetricCard
					title="Current Streak"
					value={analyticsData.streak}
					icon={FireIcon}
					color="red"
					suffix=" days"
				/>
			</div>

			{/* Tab Navigation */}
			<div className="border-b border-gray-200">
				<nav className="flex space-x-8">
					{[
						{ id: "overview", name: "Overview", icon: ChartBarIcon },
						{ id: "categories", name: "Categories", icon: AcademicCapIcon },
						{ id: "algorithms", name: "Algorithms", icon: BoltIcon },
						{ id: "competitive", name: "Competitive", icon: StarIcon },
					].map((tab) => (
						<button
							key={tab.id}
							onClick={() => setActiveTab(tab.id as any)}
							className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
								activeTab === tab.id
									? "border-blue-500 text-blue-600"
									: "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
							}`}
						>
							<tab.icon className="h-5 w-5" />
							{tab.name}
						</button>
					))}
				</nav>
			</div>

			{/* Tab Content */}
			<div className="mt-6">
				{activeTab === "overview" && <OverviewTab data={analyticsData} />}
				{activeTab === "categories" && (
					<CategoriesTab data={analyticsData.categoryBreakdown} />
				)}
				{activeTab === "algorithms" && (
					<AlgorithmsTab data={analyticsData.algorithmMastery} />
				)}
				{activeTab === "competitive" && (
					<CompetitiveTab data={analyticsData.competitiveRanking} />
				)}
			</div>
		</div>
	);
}

interface MetricCardProps {
	title: string;
	value: number;
	total?: number;
	icon: React.ComponentType<{ className?: string }>;
	color: "blue" | "green" | "yellow" | "red";
	suffix?: string;
}

function MetricCard({
	title,
	value,
	total,
	icon: Icon,
	color,
	suffix = "",
}: MetricCardProps) {
	const colorClasses = {
		blue: "bg-blue-50 text-blue-600",
		green: "bg-green-50 text-green-600",
		yellow: "bg-yellow-50 text-yellow-600",
		red: "bg-red-50 text-red-600",
	};

	const percentage = total ? (value / total) * 100 : 0;

	return (
		<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
			<div className="flex items-center justify-between">
				<div>
					<p className="text-sm font-medium text-gray-600">{title}</p>
					<p className="text-2xl font-bold text-gray-900 mt-1">
						{value.toLocaleString()}
						{suffix}
					</p>
					{total && (
						<p className="text-sm text-gray-500 mt-1">
							{percentage.toFixed(1)}% complete
						</p>
					)}
				</div>
				<div className={`p-3 rounded-lg ${colorClasses[color]}`}>
					<Icon className="h-6 w-6" />
				</div>
			</div>
			{total && (
				<div className="mt-4">
					<div className="bg-gray-200 rounded-full h-2">
						<div
							className="bg-blue-600 rounded-full h-2 transition-all duration-300"
							style={{ width: `${percentage}%` }}
						/>
					</div>
				</div>
			)}
		</div>
	);
}

function OverviewTab({ data }: { data: AnalyticsData }) {
	return (
		<div className="space-y-6">
			{/* Activity Chart */}
			<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
				<h3 className="text-lg font-semibold text-gray-900 mb-4">
					Recent Activity
				</h3>
				<div className="h-64 flex items-end justify-between gap-1">
					{data.recentActivity.slice(-14).map((point, index) => (
						<div key={index} className="flex-1 flex flex-col items-center">
							<div
								className="w-full bg-blue-500 rounded-t-sm transition-all duration-300 hover:bg-blue-600"
								style={{ height: `${(point.problemsSolved / 8) * 100}%` }}
								title={`${point.problemsSolved} problems solved`}
							/>
							<span className="text-xs text-gray-500 mt-2 transform -rotate-45 origin-top-left">
								{new Date(point.date).getDate()}
							</span>
						</div>
					))}
				</div>
			</div>

			{/* Difficulty Breakdown */}
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				{data.difficultyBreakdown.map((difficulty) => (
					<div
						key={difficulty.difficulty}
						className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
					>
						<div className="flex items-center justify-between mb-4">
							<h4 className="font-semibold text-gray-900">
								{difficulty.difficulty}
							</h4>
							<TrendIndicator trend={difficulty.trending} />
						</div>
						<div className="space-y-3">
							<div className="flex justify-between text-sm">
								<span className="text-gray-600">Solved:</span>
								<span className="font-medium">
									{difficulty.solved} / {difficulty.total}
								</span>
							</div>
							<div className="flex justify-between text-sm">
								<span className="text-gray-600">Accuracy:</span>
								<span className="font-medium">{difficulty.accuracy}%</span>
							</div>
							<div className="flex justify-between text-sm">
								<span className="text-gray-600">Avg Time:</span>
								<span className="font-medium">
									{difficulty.averageTime} min
								</span>
							</div>
							<div className="bg-gray-200 rounded-full h-2">
								<div
									className="bg-gradient-to-r from-green-400 to-blue-500 rounded-full h-2 transition-all duration-300"
									style={{
										width: `${(difficulty.solved / difficulty.total) * 100}%`,
									}}
								/>
							</div>
						</div>
					</div>
				))}
			</div>

			{/* Strengths & Weaknesses */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
					<h3 className="text-lg font-semibold text-gray-900 mb-4">
						Strengths
					</h3>
					<div className="space-y-3">
						{data.strengthsWeaknesses.strengths.map((strength, index) => (
							<div key={index} className="flex items-center gap-3">
								<div className="h-2 w-2 bg-green-500 rounded-full" />
								<span className="text-gray-700">{strength}</span>
							</div>
						))}
					</div>
					<h4 className="text-md font-medium text-gray-900 mt-6 mb-3">
						Improving
					</h4>
					<div className="space-y-3">
						{data.strengthsWeaknesses.improving.map((skill, index) => (
							<div key={index} className="flex items-center gap-3">
								<ArrowTrendingUpIcon className="h-4 w-4 text-blue-500" />
								<span className="text-gray-700">{skill}</span>
							</div>
						))}
					</div>
				</div>

				<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
					<h3 className="text-lg font-semibold text-gray-900 mb-4">
						Areas for Improvement
					</h3>
					<div className="space-y-3">
						{data.strengthsWeaknesses.weaknesses.map((weakness, index) => (
							<div key={index} className="flex items-center gap-3">
								<div className="h-2 w-2 bg-red-500 rounded-full" />
								<span className="text-gray-700">{weakness}</span>
							</div>
						))}
					</div>
					<h4 className="text-md font-medium text-gray-900 mt-6 mb-3">
						Stagnant
					</h4>
					<div className="space-y-3">
						{data.strengthsWeaknesses.stagnant.map((skill, index) => (
							<div key={index} className="flex items-center gap-3">
								<div className="h-4 w-4 border-2 border-gray-400 rounded-full" />
								<span className="text-gray-700">{skill}</span>
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	);
}

function CategoriesTab({ data }: { data: CategoryStats[] }) {
	return (
		<div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
			<div className="px-6 py-4 border-b border-gray-200">
				<h3 className="text-lg font-semibold text-gray-900">
					Category Performance
				</h3>
			</div>
			<div className="overflow-x-auto">
				<table className="min-w-full divide-y divide-gray-200">
					<thead className="bg-gray-50">
						<tr>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								Category
							</th>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								Progress
							</th>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								Accuracy
							</th>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								Avg Time
							</th>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								Status
							</th>
						</tr>
					</thead>
					<tbody className="bg-white divide-y divide-gray-200">
						{data.map((category) => {
							const progress = (category.solved / category.total) * 100;
							return (
								<tr key={category.category} className="hover:bg-gray-50">
									<td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
										{category.category}
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
										<div className="flex items-center gap-3">
											<div className="flex-1 bg-gray-200 rounded-full h-2">
												<div
													className="bg-blue-600 rounded-full h-2 transition-all duration-300"
													style={{ width: `${progress}%` }}
												/>
											</div>
											<span className="text-xs text-gray-600 min-w-0">
												{category.solved}/{category.total}
											</span>
										</div>
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
										<span
											className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
												category.accuracy >= 80
													? "bg-green-100 text-green-800"
													: category.accuracy >= 60
														? "bg-yellow-100 text-yellow-800"
														: "bg-red-100 text-red-800"
											}`}
										>
											{category.accuracy}%
										</span>
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
										{category.averageTime} min
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
										{progress >= 80 ? (
											<span className="text-green-600 font-medium">
												Mastered
											</span>
										) : progress >= 50 ? (
											<span className="text-blue-600 font-medium">
												Learning
											</span>
										) : (
											<span className="text-gray-600 font-medium">
												Beginner
											</span>
										)}
									</td>
								</tr>
							);
						})}
					</tbody>
				</table>
			</div>
		</div>
	);
}

function AlgorithmsTab({ data }: { data: AlgorithmStats[] }) {
	return (
		<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
			{data.map((algorithm) => (
				<div
					key={algorithm.algorithm}
					className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
				>
					<div className="flex items-center justify-between mb-4">
						<h4 className="font-semibold text-gray-900">
							{algorithm.algorithm}
						</h4>
						<TrendIndicator trend={algorithm.trending} />
					</div>

					<div className="space-y-4">
						<div>
							<div className="flex justify-between items-center mb-2">
								<span className="text-sm text-gray-600">Mastery Level</span>
								<span className="text-sm font-medium text-gray-900">
									{algorithm.mastery}%
								</span>
							</div>
							<div className="bg-gray-200 rounded-full h-3">
								<div
									className="bg-gradient-to-r from-red-400 via-yellow-400 to-green-400 rounded-full h-3 transition-all duration-300"
									style={{ width: `${algorithm.mastery}%` }}
								/>
							</div>
						</div>

						<div className="flex justify-between text-sm">
							<span className="text-gray-600">Problems Solved:</span>
							<span className="font-medium">{algorithm.problemsSolved}</span>
						</div>

						<div className="flex justify-between text-sm">
							<span className="text-gray-600">Last Used:</span>
							<span className="font-medium">{algorithm.lastUsed}</span>
						</div>
					</div>
				</div>
			))}
		</div>
	);
}

function CompetitiveTab({ data }: { data: RankingData }) {
	return (
		<div className="space-y-6">
			{/* Ranking Overview */}
			<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
				<h3 className="text-lg font-semibold text-gray-900 mb-6">
					Your Competitive Ranking
				</h3>

				<div className="grid grid-cols-1 md:grid-cols-4 gap-6">
					<div className="text-center">
						<div className="text-3xl font-bold text-blue-600">
							#{data.currentRank}
						</div>
						<div className="text-sm text-gray-600">Current Rank</div>
						<div
							className={`text-xs mt-1 ${
								data.rankChange > 0
									? "text-green-600"
									: data.rankChange < 0
										? "text-red-600"
										: "text-gray-500"
							}`}
						>
							{data.rankChange > 0 ? "+" : ""}
							{data.rankChange} from last week
						</div>
					</div>

					<div className="text-center">
						<div className="text-3xl font-bold text-gray-900">
							{data.totalUsers.toLocaleString()}
						</div>
						<div className="text-sm text-gray-600">Total Users</div>
					</div>

					<div className="text-center">
						<div className="text-3xl font-bold text-green-600">
							{data.percentile}%
						</div>
						<div className="text-sm text-gray-600">Percentile</div>
					</div>

					<div className="text-center">
						<div className="text-3xl font-bold text-purple-600">
							{data.nearbyUsers.find((u) => u.isCurrentUser)?.score || 0}
						</div>
						<div className="text-sm text-gray-600">Your Score</div>
					</div>
				</div>
			</div>

			{/* Leaderboard */}
			<div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
				<div className="px-6 py-4 border-b border-gray-200">
					<h3 className="text-lg font-semibold text-gray-900">
						Nearby Rankings
					</h3>
				</div>
				<div className="divide-y divide-gray-200">
					{data.nearbyUsers.map((user) => (
						<div
							key={user.username}
							className={`px-6 py-4 flex items-center justify-between ${
								user.isCurrentUser
									? "bg-blue-50 border-l-4 border-blue-600"
									: ""
							}`}
						>
							<div className="flex items-center gap-4">
								<div
									className={`text-lg font-bold ${
										user.rank <= 3
											? "text-yellow-500"
											: user.isCurrentUser
												? "text-blue-600"
												: "text-gray-600"
									}`}
								>
									#{user.rank}
								</div>
								<div>
									<div
										className={`font-medium ${
											user.isCurrentUser ? "text-blue-900" : "text-gray-900"
										}`}
									>
										{user.username}
									</div>
									{user.isCurrentUser && (
										<div className="text-sm text-blue-600">You</div>
									)}
								</div>
							</div>
							<div
								className={`font-semibold ${
									user.isCurrentUser ? "text-blue-600" : "text-gray-600"
								}`}
							>
								{user.score.toLocaleString()} pts
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}

function TrendIndicator({ trend }: { trend: "up" | "down" | "stable" }) {
	const icons = {
		up: <ArrowTrendingUpIcon className="h-4 w-4 text-green-500" />,
		down: (
			<ArrowTrendingUpIcon className="h-4 w-4 text-red-500 transform rotate-180" />
		),
		stable: <div className="h-4 w-4 bg-gray-400 rounded-full" />,
	};

	return icons[trend];
}
