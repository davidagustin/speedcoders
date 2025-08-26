"use client";

import {
	AcademicCapIcon,
	BookOpenIcon,
	ChartBarIcon,
	ClockIcon,
	FireIcon,
	StarIcon,
	TrophyIcon,
	ArrowRightIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";

export default function Dashboard() {
	// Mock user stats - in real app, this would come from API
	const userStats = {
		totalQuizzes: 15,
		totalQuestions: 120,
		averageScore: 78,
		bestScore: 95,
		totalTimeSpent: 480, // minutes
		streakDays: 7,
		algorithmsMastered: 8,
		categoriesCovered: 12,
		weeklyProgress: [
			{ week: "Mon", score: 75, questions: 10, timeSpent: 45 },
			{ week: "Tue", score: 82, questions: 12, timeSpent: 52 },
			{ week: "Wed", score: 78, questions: 8, timeSpent: 38 },
			{ week: "Thu", score: 85, questions: 15, timeSpent: 65 },
			{ week: "Fri", score: 90, questions: 10, timeSpent: 42 },
			{ week: "Sat", score: 88, questions: 12, timeSpent: 55 },
			{ week: "Sun", score: 92, questions: 8, timeSpent: 35 },
		],
	};

	const formatTime = (minutes: number) => {
		const hours = Math.floor(minutes / 60);
		const mins = minutes % 60;
		return `${hours}h ${mins}m`;
	};

	return (
		<div className="min-h-screen bg-gray-50 p-6">
			<div className="max-w-7xl mx-auto">
				{/* Header */}
				<div className="mb-8">
					<div className="flex items-center justify-between">
						<div>
							<h1 className="text-3xl font-bold text-gray-900">SpeedCoders Dashboard</h1>
							<p className="text-gray-600 mt-2">Welcome back! Keep up the great work.</p>
						</div>
						<div className="flex items-center space-x-2 bg-orange-100 px-4 py-2 rounded-lg">
							<FireIcon className="h-5 w-5 text-orange-600" />
							<span className="text-orange-800 font-semibold">{userStats.streakDays} day streak</span>
						</div>
					</div>
				</div>

				{/* Stats Grid */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
					<div className="bg-white p-6 rounded-lg shadow-sm border">
						<div className="flex items-center">
							<div className="p-2 bg-blue-100 rounded-lg">
								<BookOpenIcon className="h-6 w-6 text-blue-600" />
							</div>
							<div className="ml-4">
								<p className="text-sm font-medium text-gray-600">Total Quizzes</p>
								<p className="text-2xl font-bold text-gray-900">{userStats.totalQuizzes}</p>
							</div>
						</div>
					</div>

					<div className="bg-white p-6 rounded-lg shadow-sm border">
						<div className="flex items-center">
							<div className="p-2 bg-green-100 rounded-lg">
								<ChartBarIcon className="h-6 w-6 text-green-600" />
							</div>
							<div className="ml-4">
								<p className="text-sm font-medium text-gray-600">Average Score</p>
								<p className="text-2xl font-bold text-gray-900">{userStats.averageScore}%</p>
							</div>
						</div>
					</div>

					<div className="bg-white p-6 rounded-lg shadow-sm border">
						<div className="flex items-center">
							<div className="p-2 bg-purple-100 rounded-lg">
								<ClockIcon className="h-6 w-6 text-purple-600" />
							</div>
							<div className="ml-4">
								<p className="text-sm font-medium text-gray-600">Study Time</p>
								<p className="text-2xl font-bold text-gray-900">{formatTime(userStats.totalTimeSpent)}</p>
							</div>
						</div>
					</div>

					<div className="bg-white p-6 rounded-lg shadow-sm border">
						<div className="flex items-center">
							<div className="p-2 bg-yellow-100 rounded-lg">
								<StarIcon className="h-6 w-6 text-yellow-600" />
							</div>
							<div className="ml-4">
								<p className="text-sm font-medium text-gray-600">Algorithms Mastered</p>
								<p className="text-2xl font-bold text-gray-900">{userStats.algorithmsMastered}</p>
							</div>
						</div>
					</div>
				</div>

				{/* Quick Actions */}
				<div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
					<h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
						<Link
							href="/problems"
							className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-left group"
						>
							<div className="flex items-center gap-3">
								<div className="p-2 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
									<BookOpenIcon className="w-5 h-5 text-green-600" />
								</div>
								<div>
									<h3 className="font-medium text-gray-900">Browse Problems</h3>
									<p className="text-sm text-gray-600">Find problems to practice</p>
								</div>
								<ArrowRightIcon className="w-5 h-5 text-gray-400 group-hover:text-blue-600 ml-auto" />
							</div>
						</Link>

						<Link
							href="/playground"
							className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-left group"
						>
							<div className="flex items-center gap-3">
								<div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
									<AcademicCapIcon className="w-5 h-5 text-blue-600" />
								</div>
								<div>
									<h3 className="font-medium text-gray-900">Code Playground</h3>
									<p className="text-sm text-gray-600">Practice coding</p>
								</div>
								<ArrowRightIcon className="w-5 h-5 text-gray-400 group-hover:text-blue-600 ml-auto" />
							</div>
						</Link>

						<Link
							href="/timer"
							className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-left group"
						>
							<div className="flex items-center gap-3">
								<div className="p-2 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition-colors">
									<ClockIcon className="w-5 h-5 text-purple-600" />
								</div>
								<div>
									<h3 className="font-medium text-gray-900">Study Timer</h3>
									<p className="text-sm text-gray-600">Pomodoro technique</p>
								</div>
								<ArrowRightIcon className="w-5 h-5 text-gray-400 group-hover:text-blue-600 ml-auto" />
							</div>
						</Link>
					</div>
				</div>

				{/* Recent Activity */}
				<div className="bg-white rounded-lg shadow-sm border p-6">
					<h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
					<div className="space-y-3">
						{userStats.weeklyProgress.slice(-3).reverse().map((day, index) => (
							<div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
								<div className="flex items-center gap-3">
									<div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
										<span className="text-sm font-medium text-blue-600">{day.week}</span>
									</div>
									<div>
										<p className="font-medium text-gray-900">{day.questions} questions completed</p>
										<p className="text-sm text-gray-600">{day.score}% accuracy</p>
									</div>
								</div>
								<div className="text-right">
									<p className="text-sm font-medium text-gray-900">{day.timeSpent} min</p>
								</div>
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	);
}
