"use client";

import {
	AcademicCapIcon,
	ChartBarIcon,
	CogIcon,
	HomeIcon,
	TrophyIcon,
	UserIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navigation = [
	{ name: "Dashboard", href: "/dashboard", icon: HomeIcon },
	{ name: "Quiz", href: "/quiz", icon: AcademicCapIcon },
	{ name: "Contest", href: "/contest", icon: TrophyIcon },
	{ name: "Analytics", href: "/performance", icon: ChartBarIcon },
	{ name: "Profile", href: "/profile", icon: UserIcon },
	{ name: "Settings", href: "/settings", icon: CogIcon },
];

export function Sidebar() {
	const pathname = usePathname();

	return (
		<div className="flex h-screen bg-gray-800">
			<div className="flex-1 flex flex-col min-h-0">
				<div className="flex items-center h-16 flex-shrink-0 px-4 bg-gray-900">
					<div className="flex items-center space-x-2">
						<div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
							<span className="text-white font-bold text-sm">SC</span>
						</div>
						<span className="text-xl font-bold text-white">SpeedCoders</span>
					</div>
				</div>
				<div className="flex-1 flex flex-col overflow-y-auto">
					<nav className="flex-1 px-2 py-4 bg-gray-800 space-y-1">
						{navigation.map((item) => {
							const isActive = pathname === item.href;
							return (
								<Link
									key={item.name}
									href={item.href}
									className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
										isActive
											? "bg-gray-900 text-white"
											: "text-gray-300 hover:bg-gray-700 hover:text-white"
									}`}
								>
									<item.icon
										className={`mr-3 flex-shrink-0 h-6 w-6 ${
											isActive
												? "text-white"
												: "text-gray-400 group-hover:text-gray-300"
										}`}
										aria-hidden="true"
									/>
									{item.name}
								</Link>
							);
						})}
					</nav>
				</div>
			</div>
		</div>
	);
}
