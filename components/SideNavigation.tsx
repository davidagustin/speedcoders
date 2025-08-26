"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";

interface NavigationItem {
	name: string;
	href: string;
	icon: string;
	badge?: string;
	children?: NavigationItem[];
}

export default function SideNavigation() {
	const [collapsed, setCollapsed] = useState(false);
	const [openSections, setOpenSections] = useState<Record<string, boolean>>({});
	const pathname = usePathname();
	const { data: session } = useSession();

	useEffect(() => {
		// Auto-collapse on mobile
		const handleResize = () => {
			if (window.innerWidth < 1024) {
				setCollapsed(true);
			}
		};
		
		handleResize();
		window.addEventListener('resize', handleResize);
		return () => window.removeEventListener('resize', handleResize);
	}, []);

	const navigation: NavigationItem[] = [
		{
			name: "Overview",
			href: "/dashboard",
			icon: "📊",
		},
		{
			name: "Practice",
			href: "/problems",
			icon: "🧩",
			children: [
				{ name: "All Problems", href: "/problems", icon: "📝" },
				{ name: "By Topics", href: "/topics", icon: "🏷️" },
				{ name: "By Companies", href: "/company", icon: "🏢" },
				{ name: "Favorites", href: "/favorites", icon: "⭐" },
			]
		},
		{
			name: "Learning",
			href: "/study",
			icon: "📚",
			children: [
				{ name: "Study Plans", href: "/study-planner", icon: "📅" },
				{ name: "Learning Paths", href: "/learning-paths", icon: "🗺️" },
				{ name: "Algorithms", href: "/algorithms", icon: "⚡" },
				{ name: "Data Structures", href: "/data-structures", icon: "🏗️" },
			]
		},
		{
			name: "Compete",
			href: "/contest",
			icon: "🏆",
			badge: "LIVE",
			children: [
				{ name: "Active Contests", href: "/contest", icon: "🔥" },
				{ name: "Upcoming", href: "/contest/upcoming", icon: "⏰" },
				{ name: "Past Contests", href: "/contest/history", icon: "📜" },
				{ name: "Arena", href: "/arena", icon: "⚔️" },
			]
		},
		{
			name: "Community",
			href: "/social-hub",
			icon: "👥",
			children: [
				{ name: "Discussions", href: "/discussions", icon: "💬" },
				{ name: "Study Groups", href: "/study-groups", icon: "👥" },
				{ name: "Leaderboard", href: "/leaderboard", icon: "🏆" },
				{ name: "User Profiles", href: "/profiles", icon: "👤" },
			]
		},
		{
			name: "Tools",
			href: "/tools",
			icon: "🛠️",
			children: [
				{ name: "Code Editor", href: "/playground", icon: "💻" },
				{ name: "Visualizer", href: "/visualize", icon: "👁️" },
				{ name: "Timer", href: "/timer", icon: "⏱️" },
				{ name: "Regex Tester", href: "/regex", icon: "🔤" },
			]
		},
		{
			name: "Progress",
			href: "/progress",
			icon: "📈",
			children: [
				{ name: "Overview", href: "/progress", icon: "📊" },
				{ name: "Analytics", href: "/advanced-analytics", icon: "📈" },
				{ name: "Achievements", href: "/achievement-center", icon: "🏅" },
				{ name: "Streaks", href: "/streaks", icon: "🔥" },
			]
		},
	];

	const toggleSection = (sectionName: string) => {
		setOpenSections(prev => ({
			...prev,
			[sectionName]: !prev[sectionName]
		}));
	};

	const isActive = (href: string) => {
		return pathname === href || pathname.startsWith(href + '/');
	};

	const isParentActive = (item: NavigationItem) => {
		if (isActive(item.href)) return true;
		return item.children?.some(child => isActive(child.href)) || false;
	};

	return (
		<>
			{/* Side Navigation */}
			<aside className={`side-nav ${collapsed ? 'collapsed' : ''}`}>
				{/* Toggle Button */}
				<button
					onClick={() => setCollapsed(!collapsed)}
					className="nav-toggle"
					aria-label={collapsed ? "Expand navigation" : "Collapse navigation"}
				>
					{collapsed ? '▶️' : '◀️'}
				</button>

				{/* Navigation Content */}
				<nav className="nav-content">
					{/* User Section */}
					{session && !collapsed && (
						<div className="nav-user-section">
							<div className="nav-user-info">
								<img
									src={session.user?.image || "/default-avatar.png"}
									alt={session.user?.name || "User"}
									className="nav-user-avatar"
								/>
								<div className="nav-user-details">
									<p className="nav-user-name">{session.user?.name || "User"}</p>
									<p className="nav-user-level">Welcome back!</p>
								</div>
							</div>
						</div>
					)}

					{/* Quick Stats - Only show if user is logged in */}
					{session && !collapsed && (
						<div className="nav-quick-stats">
							<div className="quick-stat">
								<span className="stat-value">-</span>
								<span className="stat-label">Day Streak</span>
							</div>
							<div className="quick-stat">
								<span className="stat-value">-</span>
								<span className="stat-label">Problems Solved</span>
							</div>
							<div className="quick-stat">
								<span className="stat-value">-</span>
								<span className="stat-label">Contests Won</span>
							</div>
						</div>
					)}

					{/* Navigation Items */}
					<div className="nav-items">
						{navigation.map((item) => (
							<div key={item.name} className="nav-item-group">
								<div className="nav-item-wrapper">
									<Link
										href={item.href}
										className={`nav-item ${isParentActive(item) ? 'active' : ''}`}
										title={collapsed ? item.name : undefined}
									>
										<span className="nav-item-icon">{item.icon}</span>
										{!collapsed && (
											<>
												<span className="nav-item-text">{item.name}</span>
												{item.badge && (
													<span className="nav-badge">{item.badge}</span>
												)}
												{item.children && (
													<span className="nav-expand-icon">
														{openSections[item.name] ? '▼' : '▶'}
													</span>
												)}
											</>
										)}
									</Link>
									
									{item.children && (
										<button
											onClick={() => toggleSection(item.name)}
											className="nav-expand-btn"
											aria-label={`Toggle ${item.name} section`}
										>
											<span className="nav-expand-icon">
												{openSections[item.name] ? '▼' : '▶'}
											</span>
										</button>
									)}
								</div>

								{/* Child Items */}
								{item.children && openSections[item.name] && (
									<div className="nav-children">
										{item.children.map((child) => (
											<Link
												key={child.name}
												href={child.href}
												className={`nav-child-item ${isActive(child.href) ? 'active' : ''}`}
												title={collapsed ? child.name : undefined}
											>
												<span className="nav-child-icon">{child.icon}</span>
												{!collapsed && (
													<span className="nav-child-text">{child.name}</span>
												)}
											</Link>
										))}
									</div>
								)}
							</div>
						))}
					</div>

					{/* Bottom Section */}
					{!collapsed && (
						<div className="nav-bottom">
							{session ? (
								<div className="nav-user-actions">
									<Link href="/profile" className="nav-action-link">
										<span className="nav-action-icon">👤</span>
										<span className="nav-action-text">Profile</span>
									</Link>
									<Link href="/settings" className="nav-action-link">
										<span className="nav-action-icon">⚙️</span>
										<span className="nav-action-text">Settings</span>
									</Link>
								</div>
							) : (
								<div className="nav-auth-actions">
									<Link href="/auth/login" className="nav-action-link">
										<span className="nav-action-icon">🔑</span>
										<span className="nav-action-text">Sign In</span>
									</Link>
									<Link href="/auth/register" className="nav-action-link">
										<span className="nav-action-icon">📝</span>
										<span className="nav-action-text">Sign Up</span>
									</Link>
								</div>
							)}
						</div>
					)}
				</nav>
			</aside>

			{/* Mobile Overlay */}
			{!collapsed && (
				<div 
					className="mobile-nav-overlay"
					onClick={() => setCollapsed(true)}
				/>
			)}

			<style jsx>{`
				.side-nav {
					position: fixed;
					top: 72px;
					left: 0;
					height: calc(100vh - 72px);
					width: 280px;
					background: white;
					border-right: 1px solid #e5e7eb;
					overflow-y: auto;
					overflow-x: hidden;
					transition: all 0.3s ease;
					z-index: 900;
					box-shadow: 2px 0 10px rgba(0, 0, 0, 0.05);
				}

				.side-nav.collapsed {
					width: 64px;
				}

				.nav-toggle {
					position: absolute;
					top: 1rem;
					right: -12px;
					width: 24px;
					height: 24px;
					background: white;
					border: 1px solid #e5e7eb;
					border-radius: 50%;
					display: flex;
					align-items: center;
					justify-content: center;
					cursor: pointer;
					font-size: 0.7rem;
					z-index: 1;
					transition: all 0.3s ease;
					box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
				}

				.nav-toggle:hover {
					background: #f9fafb;
					transform: scale(1.1);
				}

				.nav-content {
					padding: 2rem 0 1rem;
					height: 100%;
					display: flex;
					flex-direction: column;
				}

				.nav-user-section {
					padding: 0 1rem 1rem;
					border-bottom: 1px solid #f3f4f6;
					margin-bottom: 1rem;
				}

				.nav-user-info {
					display: flex;
					align-items: center;
					gap: 0.75rem;
				}

				.nav-user-avatar {
					width: 40px;
					height: 40px;
					border-radius: 50%;
					object-fit: cover;
				}

				.nav-user-details {
					flex: 1;
				}

				.nav-user-name {
					font-weight: 600;
					font-size: 0.95rem;
					color: #111827;
					margin: 0 0 2px;
				}

				.nav-user-level {
					font-size: 0.75rem;
					color: #6b7280;
					margin: 0;
				}

				.nav-quick-stats {
					display: grid;
					grid-template-columns: 1fr 1fr 1fr;
					gap: 0.5rem;
					padding: 0 1rem 1rem;
					border-bottom: 1px solid #f3f4f6;
					margin-bottom: 1rem;
				}

				.quick-stat {
					text-align: center;
					padding: 0.5rem;
					background: linear-gradient(135deg, #667eea, #764ba2);
					border-radius: 8px;
					color: white;
				}

				.stat-value {
					display: block;
					font-weight: 700;
					font-size: 1rem;
					line-height: 1;
				}

				.stat-label {
					display: block;
					font-size: 0.6rem;
					opacity: 0.9;
					margin-top: 2px;
				}

				.nav-items {
					flex: 1;
					padding: 0 0.5rem;
				}

				.nav-item-group {
					margin-bottom: 0.25rem;
				}

				.nav-item-wrapper {
					position: relative;
				}

				.nav-item {
					display: flex;
					align-items: center;
					gap: 0.75rem;
					padding: 0.75rem 1rem;
					border-radius: 8px;
					color: #4b5563;
					text-decoration: none;
					transition: all 0.3s ease;
					position: relative;
					width: 100%;
				}

				.nav-item:hover {
					background: #f3f4f6;
					color: #667eea;
				}

				.nav-item.active {
					background: linear-gradient(135deg, #667eea, #764ba2);
					color: white;
				}

				.nav-item-icon {
					font-size: 1.1rem;
					width: 20px;
					text-align: center;
				}

				.nav-item-text {
					font-weight: 500;
					flex: 1;
				}

				.nav-badge {
					background: #ef4444;
					color: white;
					font-size: 0.6rem;
					padding: 2px 6px;
					border-radius: 10px;
					font-weight: 700;
					animation: pulse 2s infinite;
				}

				.nav-expand-icon {
					font-size: 0.7rem;
					color: #9ca3af;
					transition: transform 0.3s ease;
				}

				.nav-expand-btn {
					position: absolute;
					right: 0.5rem;
					top: 50%;
					transform: translateY(-50%);
					background: none;
					border: none;
					color: #9ca3af;
					cursor: pointer;
					padding: 0.25rem;
					font-size: 0.7rem;
				}

				.nav-children {
					margin-left: 1.5rem; /* Indent child items */
					border-left: 2px solid #f3f4f6;
					padding-left: 0.5rem;
				}

				.nav-child-item {
					display: flex;
					align-items: center;
					gap: 0.5rem;
					padding: 0.5rem 0.75rem;
					border-radius: 6px;
					color: #6b7280;
					text-decoration: none;
					font-size: 0.9rem;
					transition: all 0.3s ease;
				}

				.nav-child-item:hover {
					background: #f9fafb;
					color: #667eea;
				}

				.nav-child-item.active {
					background: rgba(102, 126, 234, 0.1);
					color: #667eea;
					font-weight: 600;
				}

				.nav-child-icon {
					font-size: 0.9rem;
				}

				.nav-child-text {
					font-weight: 500;
				}

				.nav-bottom {
					padding: 0 1rem;
					border-top: 1px solid #f3f4f6;
					margin-top: 1rem;
					padding-top: 1rem;
				}

				.nav-user-actions,
				.nav-auth-actions {
					display: flex;
					gap: 0.75rem;
				}

				.nav-action-link {
					display: flex;
					align-items: center;
					gap: 0.5rem;
					padding: 0.75rem 1rem;
					border-radius: 8px;
					color: #4b5563;
					text-decoration: none;
					transition: all 0.3s ease;
				}

				.nav-action-link:hover {
					background: #f3f4f6;
					color: #667eea;
				}

				.nav-action-link.active {
					background: linear-gradient(135deg, #667eea, #764ba2);
					color: white;
				}

				.nav-action-icon {
					font-size: 1.1rem;
					width: 20px;
					text-align: center;
				}

				.nav-action-text {
					font-weight: 500;
				}

				.nav-overlay {
					display: none;
				}

				.collapsed .nav-user-section,
				.collapsed .nav-quick-stats,
				.collapsed .nav-bottom,
				.collapsed .nav-submenu,
				.collapsed .nav-item-text,
				.collapsed .nav-badge,
				.collapsed .nav-expand-icon,
				.collapsed .nav-expand-btn {
					display: none;
				}

				.collapsed .nav-item {
					justify-content: center;
					padding: 0.75rem;
				}

				.collapsed .nav-item-icon {
					width: auto;
				}

				@media (max-width: 1024px) {
					.nav-overlay {
						display: block;
						position: fixed;
						top: 72px;
						left: 280px;
						right: 0;
						bottom: 0;
						background: rgba(0, 0, 0, 0.5);
						z-index: 899;
					}

					.collapsed .nav-overlay {
						display: none;
					}
				}

				@media (max-width: 640px) {
					.side-nav {
						transform: translateX(-100%);
						transition: transform 0.3s ease;
					}

					.side-nav:not(.collapsed) {
						transform: translateX(0);
					}
				}

				@keyframes pulse {
					0%, 100% { opacity: 1; }
					50% { opacity: 0.7; }
				}
			`}</style>
		</>
	);
}