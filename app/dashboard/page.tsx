"use client";

import { useState, useEffect } from 'react';
import Link from "next/link";
import { 
	ChartBarIcon, 
	TrophyIcon, 
	ClockIcon, 
	StarIcon, 
	CodeBracketIcon,
	AcademicCapIcon,
	FireIcon,
	BeakerIcon,
	PuzzlePieceIcon,
	UsersIcon,
	BookOpenIcon,
	LightBulbIcon
} from "@heroicons/react/24/outline";

interface UserStats {
	problemsSolved: number;
	achievements: number;
	studyTime: number;
	currentStreak: number;
	totalProblems: number;
	easyProblems: number;
	mediumProblems: number;
	hardProblems: number;
}

export default function DashboardPage() {
	const [userStats, setUserStats] = useState<UserStats>({
		problemsSolved: 0,
		achievements: 0,
		studyTime: 0,
		currentStreak: 0,
		totalProblems: 0,
		easyProblems: 0,
		mediumProblems: 0,
		hardProblems: 0
	});
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		loadStats();
	}, []);

	const loadStats = async () => {
		try {
			setLoading(true);
			const response = await fetch('/api/problems');
			const result = await response.json();
			
			if (result.success) {
				setUserStats({
					problemsSolved: 0, // This would come from user progress API
					achievements: 0, // This would come from achievements API
					studyTime: 0, // This would come from study sessions API
					currentStreak: 0, // This would come from user progress API
					totalProblems: result.data.stats.total,
					easyProblems: result.data.stats.easy,
					mediumProblems: result.data.stats.medium,
					hardProblems: result.data.stats.hard
				});
			}
		} catch (error) {
			console.error('Error loading stats:', error);
		} finally {
			setLoading(false);
		}
	};

	const formatTime = (minutes: number) => {
		const hours = Math.floor(minutes / 60);
		const mins = minutes % 60;
		return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
	};

	if (loading) {
		return (
			<div className="min-h-screen bg-gray-50 flex items-center justify-center">
				<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-50">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				{/* Header */}
				<div className="mb-8">
					<h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome to SpeedCoders</h1>
					<p className="text-gray-600">Your comprehensive platform for mastering algorithms and data structures</p>
				</div>

				{/* Quick Stats */}
				<div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
					<div className="bg-white p-6 rounded-lg shadow-sm">
						<div className="flex items-center">
							<div className="p-2 bg-blue-100 rounded-lg">
								<CodeBracketIcon className="h-6 w-6 text-blue-600" />
							</div>
							<div className="ml-4">
								<p className="text-sm font-medium text-gray-600">Problems Solved</p>
								<p className="text-2xl font-bold text-gray-900">{userStats.problemsSolved}</p>
							</div>
						</div>
					</div>
					<div className="bg-white p-6 rounded-lg shadow-sm">
						<div className="flex items-center">
							<div className="p-2 bg-green-100 rounded-lg">
								<TrophyIcon className="h-6 w-6 text-green-600" />
							</div>
							<div className="ml-4">
								<p className="text-sm font-medium text-gray-600">Achievements</p>
								<p className="text-2xl font-bold text-gray-900">{userStats.achievements}</p>
							</div>
						</div>
					</div>
					<div className="bg-white p-6 rounded-lg shadow-sm">
						<div className="flex items-center">
							<div className="p-2 bg-purple-100 rounded-lg">
								<ClockIcon className="h-6 w-6 text-purple-600" />
							</div>
							<div className="ml-4">
								<p className="text-sm font-medium text-gray-600">Study Time</p>
								<p className="text-2xl font-bold text-gray-900">{formatTime(userStats.studyTime)}</p>
							</div>
						</div>
					</div>
					<div className="bg-white p-6 rounded-lg shadow-sm">
						<div className="flex items-center">
							<div className="p-2 bg-orange-100 rounded-lg">
								<StarIcon className="h-6 w-6 text-orange-600" />
							</div>
							<div className="ml-4">
								<p className="text-sm font-medium text-gray-600">Current Streak</p>
								<p className="text-2xl font-bold text-gray-900">{userStats.currentStreak} days</p>
							</div>
						</div>
					</div>
				</div>

				{/* Problem Statistics */}
				<div className="bg-white p-6 rounded-lg shadow-sm mb-8">
					<h2 className="text-xl font-semibold text-gray-900 mb-4">Available Problems</h2>
					<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
						<div className="text-center">
							<div className="text-2xl font-bold text-blue-600">{userStats.totalProblems}</div>
							<div className="text-sm text-gray-600">Total Problems</div>
						</div>
						<div className="text-center">
							<div className="text-2xl font-bold text-green-600">{userStats.easyProblems}</div>
							<div className="text-sm text-gray-600">Easy</div>
						</div>
						<div className="text-center">
							<div className="text-2xl font-bold text-yellow-600">{userStats.mediumProblems}</div>
							<div className="text-sm text-gray-600">Medium</div>
						</div>
						<div className="text-center">
							<div className="text-2xl font-bold text-red-600">{userStats.hardProblems}</div>
							<div className="text-sm text-gray-600">Hard</div>
						</div>
					</div>
				</div>

				{/* Feature Grid */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					<Link href="/practice" className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
						<div className="flex items-center mb-4">
							<div className="p-2 bg-blue-100 rounded-lg">
								<CodeBracketIcon className="h-6 w-6 text-blue-600" />
							</div>
							<h3 className="ml-3 text-lg font-semibold text-gray-900">Practice Problems</h3>
						</div>
						<p className="text-gray-600">Browse and practice with our comprehensive collection of algorithm problems</p>
					</Link>

					<Link href="/system-design" className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
						<div className="flex items-center mb-4">
							<div className="p-2 bg-green-100 rounded-lg">
								<FireIcon className="h-6 w-6 text-green-600" />
							</div>
							<h3 className="ml-3 text-lg font-semibold text-gray-900">System Design</h3>
						</div>
						<p className="text-gray-600">Master scalable system architecture and design patterns</p>
					</Link>

					<Link href="/quiz" className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
						<div className="flex items-center mb-4">
							<div className="p-2 bg-purple-100 rounded-lg">
								<PuzzlePieceIcon className="h-6 w-6 text-purple-600" />
							</div>
							<h3 className="ml-3 text-lg font-semibold text-gray-900">Take Quizzes</h3>
						</div>
						<p className="text-gray-600">Test your knowledge with interactive quizzes and challenges</p>
					</Link>

					<Link href="/analytics" className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
						<div className="flex items-center mb-4">
							<div className="p-2 bg-indigo-100 rounded-lg">
								<ChartBarIcon className="h-6 w-6 text-indigo-600" />
							</div>
							<h3 className="ml-3 text-lg font-semibold text-gray-900">Analytics</h3>
						</div>
						<p className="text-gray-600">Track your progress with detailed analytics and insights</p>
					</Link>

					<Link href="/study" className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
						<div className="flex items-center mb-4">
							<div className="p-2 bg-yellow-100 rounded-lg">
								<AcademicCapIcon className="h-6 w-6 text-yellow-600" />
							</div>
							<h3 className="ml-3 text-lg font-semibold text-gray-900">Study Mode</h3>
						</div>
						<p className="text-gray-600">Follow structured learning paths to master algorithms</p>
					</Link>

					<Link href="/data-structures" className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
						<div className="flex items-center mb-4">
							<div className="p-2 bg-pink-100 rounded-lg">
								<BeakerIcon className="h-6 w-6 text-pink-600" />
							</div>
							<h3 className="ml-3 text-lg font-semibold text-gray-900">Data Structures</h3>
						</div>
						<p className="text-gray-600">Learn and practice with various data structures</p>
					</Link>

					<Link href="/achievements" className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
						<div className="flex items-center mb-4">
							<div className="p-2 bg-red-100 rounded-lg">
								<TrophyIcon className="h-6 w-6 text-red-600" />
							</div>
							<h3 className="ml-3 text-lg font-semibold text-gray-900">Achievements</h3>
						</div>
						<p className="text-gray-600">Unlock badges and achievements as you progress</p>
					</Link>

					<Link href="/leaderboard" className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
						<div className="flex items-center mb-4">
							<div className="p-2 bg-orange-100 rounded-lg">
								<UsersIcon className="h-6 w-6 text-orange-600" />
							</div>
							<h3 className="ml-3 text-lg font-semibold text-gray-900">Leaderboard</h3>
						</div>
						<p className="text-gray-600">Compete with other learners on the global leaderboard</p>
					</Link>

					<Link href="/visualize" className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
						<div className="flex items-center mb-4">
							<div className="p-2 bg-teal-100 rounded-lg">
								<LightBulbIcon className="h-6 w-6 text-teal-600" />
							</div>
							<h3 className="ml-3 text-lg font-semibold text-gray-900">Visualizer</h3>
						</div>
						<p className="text-gray-600">Visualize algorithms and data structures in action</p>
					</Link>

					<Link href="/algorithms" className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
						<div className="flex items-center mb-4">
							<div className="p-2 bg-cyan-100 rounded-lg">
								<BookOpenIcon className="h-6 w-6 text-cyan-600" />
							</div>
							<h3 className="ml-3 text-lg font-semibold text-gray-900">Algorithms</h3>
						</div>
						<p className="text-gray-600">Learn and master various algorithms and techniques</p>
					</Link>
				</div>

				{/* Call to Action */}
				<div className="mt-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-8 text-center text-white">
					<h2 className="text-2xl font-bold mb-4">Ready to Start Learning?</h2>
					<p className="text-blue-100 mb-6">Join thousands of developers mastering algorithms and data structures</p>
					<div className="flex flex-col sm:flex-row gap-4 justify-center">
						<Link
							href="/auth/register"
							className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
						>
							Get Started
						</Link>
						<Link
							href="/auth/login"
							className="bg-transparent border border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
						>
							Sign In
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
}
