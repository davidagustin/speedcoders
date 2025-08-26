import Link from "next/link";
import { ArrowRightIcon, AcademicCapIcon, ChartBarIcon, TrophyIcon, ClockIcon } from "@heroicons/react/24/outline";

export default function HomePage() {
	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
			{/* Navigation */}
			<nav className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex justify-between items-center h-16">
						<div className="flex items-center space-x-2">
							<AcademicCapIcon className="h-8 w-8 text-blue-600" />
							<span className="text-xl font-bold text-gray-900">SpeedCoders</span>
						</div>
						<div className="flex items-center space-x-4">
							<Link
								href="/dashboard"
								className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium cursor-pointer"
							>
								Dashboard
							</Link>
							<Link
								href="/problems"
								className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium cursor-pointer"
							>
								Problems
							</Link>
							<Link
								href="/quiz"
								className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium cursor-pointer"
							>
								Quiz
							</Link>
							<Link
								href="/auth/login"
								className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium cursor-pointer"
							>
								Sign In
							</Link>
						</div>
					</div>
				</div>
			</nav>

			{/* Hero Section */}
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
				<div className="text-center">
					<h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
						Master Algorithms &{" "}
						<span className="text-blue-600">Data Structures</span>
					</h1>
					<p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
						Learn algorithms, solve coding problems, and improve your programming skills 
						with interactive challenges and real-time feedback. Start practicing immediately!
					</p>
					<div className="flex flex-col sm:flex-row gap-4 justify-center">
						<Link
							href="/dashboard"
							className="inline-flex items-center px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg text-lg transition-colors cursor-pointer"
						>
							Start Learning Now
							<ArrowRightIcon className="ml-2 h-5 w-5" />
						</Link>
						<Link
							href="/problems"
							className="inline-flex items-center px-8 py-4 bg-white hover:bg-gray-50 text-gray-900 font-semibold rounded-lg text-lg border border-gray-300 transition-colors cursor-pointer"
						>
							Browse Problems
						</Link>
					</div>
				</div>
			</div>

			{/* Features Section */}
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
				<div className="grid md:grid-cols-3 gap-8">
					<div className="text-center">
						<div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
							<ChartBarIcon className="h-8 w-8 text-blue-600" />
						</div>
						<h3 className="text-xl font-semibold text-gray-900 mb-2">Track Progress</h3>
						<p className="text-gray-600">
							Monitor your learning journey with detailed analytics and performance insights.
						</p>
					</div>
					<div className="text-center">
						<div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
							<TrophyIcon className="h-8 w-8 text-green-600" />
						</div>
						<h3 className="text-xl font-semibold text-gray-900 mb-2">Earn Achievements</h3>
						<p className="text-gray-600">
							Unlock badges and achievements as you master different algorithms and concepts.
						</p>
					</div>
					<div className="text-center">
						<div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
							<ClockIcon className="h-8 w-8 text-purple-600" />
						</div>
						<h3 className="text-xl font-semibold text-gray-900 mb-2">Practice Anywhere</h3>
						<p className="text-gray-600">
							Access your learning materials anytime, anywhere with our responsive platform.
						</p>
					</div>
				</div>
			</div>

			{/* Quick Start Section */}
			<div className="bg-gray-50 py-20">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="text-center mb-12">
						<h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to Start?</h2>
						<p className="text-xl text-gray-600">
							Choose your path and begin your algorithm learning journey
						</p>
					</div>
					<div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
						<Link
							href="/quiz"
							className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
						>
							<h3 className="text-lg font-semibold text-gray-900 mb-2">Take a Quiz</h3>
							<p className="text-gray-600">Test your knowledge with interactive quizzes</p>
						</Link>
						<Link
							href="/problems"
							className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
						>
							<h3 className="text-lg font-semibold text-gray-900 mb-2">Solve Problems</h3>
							<p className="text-gray-600">Practice with curated coding problems</p>
						</Link>
						<Link
							href="/leetcode"
							className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
						>
							<h3 className="text-lg font-semibold text-gray-900 mb-2">LeetCode Style</h3>
							<p className="text-gray-600">Experience LeetCode-like problems</p>
						</Link>
						<Link
							href="/dashboard"
							className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
						>
							<h3 className="text-lg font-semibold text-gray-900 mb-2">View Dashboard</h3>
							<p className="text-gray-600">See your progress and achievements</p>
						</Link>
					</div>
				</div>
			</div>

			{/* Footer */}
			<footer className="bg-gray-900 text-white py-12">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="text-center">
						<div className="flex items-center justify-center space-x-2 mb-4">
							<AcademicCapIcon className="h-8 w-8 text-blue-400" />
							<span className="text-xl font-bold">SpeedCoders</span>
						</div>
						<p className="text-gray-400 mb-4">
							Master algorithms and data structures with interactive learning
						</p>
						<div className="flex justify-center space-x-6">
							<Link href="/auth/login" className="text-gray-400 hover:text-white cursor-pointer">
								Sign In
							</Link>
							<Link href="/auth/register" className="text-gray-400 hover:text-white cursor-pointer">
								Register
							</Link>
							<Link href="/dashboard" className="text-gray-400 hover:text-white cursor-pointer">
								Dashboard
							</Link>
						</div>
					</div>
				</div>
			</footer>
		</div>
	);
}
