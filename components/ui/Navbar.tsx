"use client";

import Link from "next/link";
import { useState } from "react";

export function Navbar() {
	const [isMenuOpen, setIsMenuOpen] = useState(false);

	return (
		<nav className="bg-white border-b border-gray-200 shadow-sm">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex justify-between items-center h-16">
					<div className="flex items-center">
						<Link href="/" className="flex items-center space-x-2">
							<div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
								<span className="text-white font-bold text-sm">SC</span>
							</div>
							<span className="text-xl font-bold text-gray-900">
								SpeedCoders
							</span>
						</Link>
					</div>

					<div className="hidden md:block">
						<div className="ml-10 flex items-baseline space-x-4">
							<Link
								href="/dashboard"
								className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium cursor-pointer"
							>
								Dashboard
							</Link>
							<Link
								href="/practice"
								className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium cursor-pointer"
							>
								Practice
							</Link>
							<Link
								href="/system-design"
								className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium cursor-pointer"
							>
								System Design
							</Link>
							<Link
								href="/study"
								className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium cursor-pointer"
							>
								Study
							</Link>
							<Link
								href="/contest"
								className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium cursor-pointer"
							>
								Contest
							</Link>
							<Link
								href="/company"
								className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium cursor-pointer"
							>
								Companies
							</Link>
							<Link
								href="/algorithms"
								className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium cursor-pointer"
							>
								Algorithms
							</Link>
							<Link
								href="/achievements"
								className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium cursor-pointer"
							>
								Achievements
							</Link>
							<Link
								href="/analytics"
								className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium cursor-pointer"
							>
								Analytics
							</Link>
							<Link
								href="/leaderboard"
								className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium cursor-pointer"
							>
								Leaderboard
							</Link>
							<Link
								href="/settings"
								className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium cursor-pointer"
							>
								Settings
							</Link>
						</div>
					</div>

					<div className="hidden md:block">
						<div className="flex items-center space-x-4">
							<Link
								href="/auth/login"
								className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
							>
								Sign In
							</Link>
							<Link
								href="/auth/signup"
								className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
							>
								Sign Up
							</Link>
						</div>
					</div>

					<div className="md:hidden">
						<button
							onClick={() => setIsMenuOpen(!isMenuOpen)}
							className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
						>
							<span className="sr-only">Open main menu</span>
							<svg
								className="h-6 w-6"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M4 6h16M4 12h16M4 18h16"
								/>
							</svg>
						</button>
					</div>
				</div>
			</div>

			{isMenuOpen && (
				<div className="md:hidden">
					<div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
						<Link
							href="/dashboard"
							className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900 cursor-pointer"
						>
							Dashboard
						</Link>
						<Link
							href="/practice"
							className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900 cursor-pointer"
						>
							Practice
						</Link>
						<Link
							href="/system-design"
							className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900 cursor-pointer"
						>
							System Design
						</Link>
						<Link
							href="/study"
							className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900 cursor-pointer"
						>
							Study
						</Link>
						<Link
							href="/contest"
							className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900 cursor-pointer"
						>
							Contest
						</Link>
						<Link
							href="/company"
							className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900 cursor-pointer"
						>
							Companies
						</Link>
						<Link
							href="/algorithms"
							className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900 cursor-pointer"
						>
							Algorithms
						</Link>
						<Link
							href="/achievements"
							className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900 cursor-pointer"
						>
							Achievements
						</Link>
						<Link
							href="/analytics"
							className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900 cursor-pointer"
						>
							Analytics
						</Link>
						<Link
							href="/leaderboard"
							className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900 cursor-pointer"
						>
							Leaderboard
						</Link>
						<Link
							href="/settings"
							className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900 cursor-pointer"
						>
							Settings
						</Link>
					</div>
				</div>
			)}
		</nav>
	);
}
