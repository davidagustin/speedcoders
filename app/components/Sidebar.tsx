"use client";

import {
	AcademicCapIcon,
	ChartBarIcon,
	CodeBracketIcon,
	CommandLineIcon,
	ComputerDesktopIcon,
	CpuChipIcon,
	FireIcon,
	HomeIcon,
	LanguageIcon,
	StarIcon,
	ClockIcon,
	UserIcon,
	CogIcon,
	TrophyIcon,
	BookOpenIcon,
	PuzzlePieceIcon,
	BeakerIcon,
	ChartPieIcon,
	UsersIcon,
	LightBulbIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navigation = [
	{ name: "Dashboard", href: "/dashboard", icon: HomeIcon, badge: null },
	{ name: "LeetCode", href: "/leetcode", icon: CodeBracketIcon, badge: "Hot" },
	{ name: "Problem Browser", href: "/problems", icon: StarIcon, badge: "New" },
	{ name: "Code Playground", href: "/playground", icon: CodeBracketIcon, badge: "New" },
	{ name: "Analytics", href: "/analytics", icon: ChartBarIcon, badge: "New" },
	{ name: "Study Timer", href: "/timer", icon: ClockIcon, badge: "New" },
	{ name: "Regex Trainer", href: "/regex", icon: CommandLineIcon, badge: null },
	{ name: "Language Tricks", href: "/languages", icon: LanguageIcon, badge: null },
	{ name: "System Design", href: "/system-design", icon: CpuChipIcon, badge: "New" },
	{ name: "Learning Paths", href: "/learning-paths", icon: AcademicCapIcon, badge: null },
	{ name: "Frontend Tricks", href: "/frontend", icon: ComputerDesktopIcon, badge: null },
	{ name: "Quiz", href: "/quiz", icon: PuzzlePieceIcon, badge: null },
	{ name: "Practice Arena", href: "/arena", icon: TrophyIcon, badge: "Hot" },
	{ name: "Study Groups", href: "/study-groups", icon: UsersIcon, badge: null },
	{ name: "Achievements", href: "/achievements", icon: FireIcon, badge: null },
	{ name: "Leaderboard", href: "/leaderboard", icon: ChartPieIcon, badge: null },
	{ name: "Data Structures", href: "/data-structures", icon: BeakerIcon, badge: null },
	{ name: "Visualizer", href: "/visualize", icon: LightBulbIcon, badge: null },
	{ name: "Progress", href: "/progress", icon: BookOpenIcon, badge: null },
];

export function Sidebar() {
	const pathname = usePathname();
	const [isCollapsed, setIsCollapsed] = useState(false);

	return (
		<div className={`flex h-screen bg-gray-800 transition-all duration-300 ${isCollapsed ? 'w-16' : 'w-64'}`}>
			<div className="flex-1 flex flex-col min-h-0">
				{/* Header */}
				<div className="flex items-center h-16 flex-shrink-0 px-4 bg-gray-900">
					<div className="flex items-center space-x-2">
						<div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
							<span className="text-white font-bold text-sm">SC</span>
						</div>
						{!isCollapsed && (
							<span className="text-xl font-bold text-white">SpeedCoders</span>
						)}
					</div>
				</div>

				{/* YOLO Mode Promo Box */}
				{!isCollapsed && (
					<div className="p-4 bg-gradient-to-r from-yellow-400 to-orange-500 mx-2 mt-2 rounded-lg">
						<div className="flex items-center space-x-2">
							<FireIcon className="h-5 w-5 text-white" />
							<div>
								<p className="text-white font-semibold text-sm">YOLO Mode</p>
								<p className="text-white text-xs">Random challenges!</p>
							</div>
						</div>
					</div>
				)}

				{/* Navigation */}
				<div className="flex-1 flex flex-col overflow-y-auto">
					<nav className="flex-1 px-2 py-4 bg-gray-800 space-y-1">
						{navigation.map((item) => {
							const isActive = pathname === item.href;
							return (
								<Link
									key={item.name}
									href={item.href}
									className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors ${
										isActive
											? "bg-blue-600 text-white"
											: "text-gray-300 hover:bg-gray-700 hover:text-white"
									}`}
									title={isCollapsed ? item.name : undefined}
								>
									<item.icon
										className={`flex-shrink-0 h-5 w-5 ${
											isActive
												? "text-white"
												: "text-gray-400 group-hover:text-gray-300"
										}`}
										aria-hidden="true"
									/>
									{!isCollapsed && (
										<>
											<span className="ml-3 flex-1">{item.name}</span>
											{item.badge && (
												<span className={`ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
													item.badge === "New" 
														? "bg-green-100 text-green-800" 
														: "bg-red-100 text-red-800"
												}`}>
													{item.badge}
												</span>
											)}
										</>
									)}
								</Link>
							);
						})}
					</nav>
				</div>

				{/* User Section */}
				<div className="flex-shrink-0 p-4 bg-gray-900">
					{!isCollapsed ? (
						<div className="flex items-center space-x-3">
							<div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
								<UserIcon className="h-5 w-5 text-gray-300" />
							</div>
							<div className="flex-1">
								<p className="text-sm font-medium text-white">User</p>
								<p className="text-xs text-gray-400">7 day streak</p>
							</div>
							<button
								onClick={() => setIsCollapsed(true)}
								className="text-gray-400 hover:text-white"
							>
								<svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
								</svg>
							</button>
						</div>
					) : (
						<div className="flex justify-center">
							<button
								onClick={() => setIsCollapsed(false)}
								className="text-gray-400 hover:text-white"
							>
								<svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
								</svg>
							</button>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
