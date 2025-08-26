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
								className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
							>
								Dashboard
							</Link>
							<Link
								href="/quiz"
								className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
							>
								Quiz
							</Link>
							<Link
								href="/contest"
								className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
							>
								Contest
							</Link>
							<Link
								href="/battle"
								className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
							>
								Battle
							</Link>
							<Link
								href="/performance"
								className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
							>
								Analytics
							</Link>
							<Link
								href="/achievements"
								className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
							>
								Achievements
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
							className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900"
						>
							Dashboard
						</Link>
						<Link
							href="/quiz"
							className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900"
						>
							Quiz
						</Link>
						<Link
							href="/contest"
							className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900"
						>
							Contest
						</Link>
						<Link
							href="/battle"
							className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900"
						>
							Battle
						</Link>
						<Link
							href="/performance"
							className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900"
						>
							Analytics
						</Link>
						<Link
							href="/achievements"
							className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900"
						>
							Achievements
						</Link>
					</div>
				</div>
			)}
		</nav>
	);
}
