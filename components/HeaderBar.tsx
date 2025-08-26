"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";

export default function HeaderBar() {
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
	const [scrolled, setScrolled] = useState(false);
	const [searchOpen, setSearchOpen] = useState(false);
	const [notificationCount, setNotificationCount] = useState(3);
	const pathname = usePathname();
	const { data: session } = useSession();

	useEffect(() => {
		const handleScroll = () => {
			setScrolled(window.scrollY > 10);
		};
		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	const navigation = [
		{ name: "Dashboard", href: "/dashboard", icon: "📊" },
		{ name: "Problems", href: "/problems", icon: "🧩" },
		{ name: "Contest", href: "/contest", icon: "🏆" },
		{ name: "Study Plans", href: "/study-planner", icon: "📚" },
		{ name: "Analytics", href: "/advanced-analytics", icon: "📈" },
		{ name: "Community", href: "/social-hub", icon: "👥" },
	];

	const userMenuItems = [
		{ name: "Profile", href: "/profile", icon: "👤" },
		{ name: "Settings", href: "/settings", icon: "⚙️" },
		{ name: "Achievements", href: "/achievement-center", icon: "🏅" },
		{ name: "Help Center", href: "/help", icon: "❓" },
	];

	return (
		<header className={`header-bar ${scrolled ? "scrolled" : ""}`}>
			<div className="header-container">
				{/* Logo Section */}
				<div className="header-left">
					<button
						onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
						className="mobile-menu-toggle"
						aria-label="Toggle menu"
					>
						<span className="hamburger-line"></span>
						<span className="hamburger-line"></span>
						<span className="hamburger-line"></span>
					</button>
					
					<Link href="/" className="logo-link">
						<div className="logo">
							<span className="logo-icon">🧠</span>
							<div className="logo-text">
								<span className="logo-title">SpeedCoders</span>
								<span className="logo-subtitle">Master the Code</span>
							</div>
						</div>
					</Link>
				</div>

				{/* Navigation */}
				<nav className="header-nav desktop-only">
					{navigation.map((item) => (
						<Link
							key={item.name}
							href={item.href}
							className={`nav-link ${pathname === item.href ? "active" : ""}`}
						>
							<span className="nav-icon">{item.icon}</span>
							<span className="nav-text">{item.name}</span>
							{item.name === "Contest" && (
								<span className="nav-badge live">LIVE</span>
							)}
						</Link>
					))}
				</nav>

				{/* Right Section */}
				<div className="header-right">
					{/* Search */}
					<button
						onClick={() => setSearchOpen(!searchOpen)}
						className="header-btn search-btn"
						aria-label="Search"
					>
						🔍
					</button>

					{/* Notifications */}
					<button className="header-btn notification-btn" aria-label="Notifications">
						🔔
						{notificationCount > 0 && (
							<span className="notification-badge">{notificationCount}</span>
						)}
					</button>

					{/* Theme Toggle */}
					<button className="header-btn theme-btn" aria-label="Toggle theme">
						🌙
					</button>

					{/* User Menu */}
					{session ? (
						<div className="user-menu">
							<button className="user-menu-trigger">
								<img
									src={session.user?.image || "/default-avatar.png"}
									alt={session.user?.name || "User"}
									className="user-avatar"
								/>
								<span className="user-name desktop-only">
									{session.user?.name || "User"}
								</span>
								<span className="user-level">Lv.42</span>
							</button>
							
							<div className="user-dropdown">
								<div className="dropdown-header">
									<div className="user-info">
										<div className="user-details">
											<p className="user-fullname">{session.user?.name}</p>
											<p className="user-email">{session.user?.email}</p>
										</div>
										<div className="user-stats">
											<div className="stat">
												<span className="stat-value">1,247</span>
												<span className="stat-label">Points</span>
											</div>
											<div className="stat">
												<span className="stat-value">89</span>
												<span className="stat-label">Streak</span>
											</div>
										</div>
									</div>
								</div>
								
								<div className="dropdown-menu">
									{userMenuItems.map((item) => (
										<Link
											key={item.name}
											href={item.href}
											className="dropdown-item"
										>
											<span className="item-icon">{item.icon}</span>
											<span className="item-text">{item.name}</span>
										</Link>
									))}
								</div>
								
								<div className="dropdown-footer">
									<button
										onClick={() => signOut()}
										className="logout-btn"
									>
										<span className="item-icon">🚪</span>
										<span className="item-text">Sign Out</span>
									</button>
								</div>
							</div>
						</div>
					) : (
						<div className="auth-buttons">
							<Link href="/auth/signin" className="btn-secondary">
								Sign In
							</Link>
							<Link href="/auth/signup" className="btn-primary">
								Get Started
							</Link>
						</div>
					)}
				</div>
			</div>

			{/* Search Overlay */}
			{searchOpen && (
				<div className="search-overlay">
					<div className="search-container">
						<input
							type="text"
							placeholder="Search problems, topics, or users..."
							className="search-input"
							autoFocus
						/>
						<button 
							onClick={() => setSearchOpen(false)}
							className="search-close"
						>
							✕
						</button>
					</div>
					<div className="search-suggestions">
						<h3>Popular Searches</h3>
						<div className="suggestion-tags">
							<span className="tag">Two Sum</span>
							<span className="tag">Binary Search</span>
							<span className="tag">Dynamic Programming</span>
							<span className="tag">Graph Algorithms</span>
						</div>
					</div>
				</div>
			)}

			{/* Mobile Menu */}
			{mobileMenuOpen && (
				<div className="mobile-menu">
					<div className="mobile-menu-header">
						<Link href="/" className="mobile-logo">
							<span className="logo-icon">🧠</span>
							<span className="logo-text">SpeedCoders</span>
						</Link>
						<button
							onClick={() => setMobileMenuOpen(false)}
							className="mobile-close"
						>
							✕
						</button>
					</div>
					
					<nav className="mobile-nav">
						{navigation.map((item) => (
							<Link
								key={item.name}
								href={item.href}
								className={`mobile-nav-link ${pathname === item.href ? "active" : ""}`}
								onClick={() => setMobileMenuOpen(false)}
							>
								<span className="nav-icon">{item.icon}</span>
								<span className="nav-text">{item.name}</span>
							</Link>
						))}
					</nav>

					{session && (
						<div className="mobile-user-section">
							<h3>Account</h3>
							{userMenuItems.map((item) => (
								<Link
									key={item.name}
									href={item.href}
									className="mobile-nav-link"
									onClick={() => setMobileMenuOpen(false)}
								>
									<span className="nav-icon">{item.icon}</span>
									<span className="nav-text">{item.name}</span>
								</Link>
							))}
							<button
								onClick={() => {
									signOut();
									setMobileMenuOpen(false);
								}}
								className="mobile-logout"
							>
								<span className="nav-icon">🚪</span>
								<span className="nav-text">Sign Out</span>
							</button>
						</div>
					)}
				</div>
			)}

			<style jsx>{`
				.header-bar {
					position: fixed;
					top: 0;
					left: 0;
					right: 0;
					z-index: 1000;
					background: rgba(255, 255, 255, 0.95);
					backdrop-filter: blur(10px);
					border-bottom: 1px solid rgba(0, 0, 0, 0.1);
					transition: all 0.3s ease;
				}

				.header-bar.scrolled {
					background: rgba(255, 255, 255, 0.98);
					box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
				}

				.header-container {
					max-width: 1400px;
					margin: 0 auto;
					padding: 0 1.5rem;
					height: 72px;
					display: flex;
					align-items: center;
					justify-content: space-between;
				}

				.header-left {
					display: flex;
					align-items: center;
					gap: 1.5rem;
				}

				.mobile-menu-toggle {
					display: none;
					flex-direction: column;
					justify-content: center;
					width: 32px;
					height: 32px;
					background: none;
					border: none;
					cursor: pointer;
					padding: 0;
				}

				.hamburger-line {
					width: 24px;
					height: 2px;
					background: #333;
					margin: 3px 0;
					transition: all 0.3s ease;
					border-radius: 2px;
				}

				.logo-link {
					text-decoration: none;
				}

				.logo {
					display: flex;
					align-items: center;
					gap: 0.75rem;
				}

				.logo-icon {
					font-size: 2rem;
					animation: pulse 2s infinite;
				}

				@keyframes pulse {
					0%, 100% { transform: scale(1); }
					50% { transform: scale(1.05); }
				}

				.logo-text {
					display: flex;
					flex-direction: column;
				}

				.logo-title {
					font-size: 1.25rem;
					font-weight: 800;
					background: linear-gradient(135deg, #667eea, #764ba2);
					-webkit-background-clip: text;
					-webkit-text-fill-color: transparent;
					background-clip: text;
				}

				.logo-subtitle {
					font-size: 0.75rem;
					color: #666;
					text-transform: uppercase;
					letter-spacing: 1px;
				}

				.header-nav {
					display: flex;
					align-items: center;
					gap: 0.5rem;
				}

				.nav-link {
					display: flex;
					align-items: center;
					gap: 0.5rem;
					padding: 0.5rem 1rem;
					border-radius: 8px;
					color: #555;
					text-decoration: none;
					transition: all 0.3s ease;
					position: relative;
				}

				.nav-link:hover {
					background: rgba(102, 126, 234, 0.1);
					color: #667eea;
				}

				.nav-link.active {
					background: linear-gradient(135deg, #667eea, #764ba2);
					color: white;
				}

				.nav-icon {
					font-size: 1.1rem;
				}

				.nav-text {
					font-weight: 500;
				}

				.nav-badge {
					position: absolute;
					top: -4px;
					right: -4px;
					background: #ff4757;
					color: white;
					font-size: 0.6rem;
					padding: 2px 6px;
					border-radius: 10px;
					font-weight: 700;
					animation: blink 1s infinite;
				}

				@keyframes blink {
					0%, 100% { opacity: 1; }
					50% { opacity: 0.6; }
				}

				.header-right {
					display: flex;
					align-items: center;
					gap: 1rem;
				}

				.header-btn {
					width: 40px;
					height: 40px;
					border-radius: 50%;
					background: #f5f5f5;
					border: none;
					cursor: pointer;
					display: flex;
					align-items: center;
					justify-content: center;
					font-size: 1.2rem;
					transition: all 0.3s ease;
					position: relative;
				}

				.header-btn:hover {
					background: #e0e0e0;
					transform: scale(1.1);
				}

				.notification-badge {
					position: absolute;
					top: -4px;
					right: -4px;
					background: #ff4757;
					color: white;
					font-size: 0.7rem;
					min-width: 18px;
					height: 18px;
					border-radius: 50%;
					display: flex;
					align-items: center;
					justify-content: center;
					font-weight: 700;
				}

				.user-menu {
					position: relative;
				}

				.user-menu-trigger {
					display: flex;
					align-items: center;
					gap: 0.75rem;
					padding: 0.5rem 1rem;
					background: #f5f5f5;
					border: none;
					border-radius: 40px;
					cursor: pointer;
					transition: all 0.3s ease;
				}

				.user-menu-trigger:hover {
					background: #e0e0e0;
				}

				.user-avatar {
					width: 32px;
					height: 32px;
					border-radius: 50%;
					object-fit: cover;
				}

				.user-name {
					font-weight: 600;
					color: #333;
				}

				.user-level {
					background: linear-gradient(135deg, #f093fb, #f5576c);
					color: white;
					font-size: 0.7rem;
					padding: 2px 8px;
					border-radius: 12px;
					font-weight: 700;
				}

				.user-dropdown {
					position: absolute;
					top: calc(100% + 8px);
					right: 0;
					width: 280px;
					background: white;
					border-radius: 12px;
					box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
					opacity: 0;
					visibility: hidden;
					transform: translateY(-10px);
					transition: all 0.3s ease;
				}

				.user-menu:hover .user-dropdown {
					opacity: 1;
					visibility: visible;
					transform: translateY(0);
				}

				.dropdown-header {
					padding: 1.5rem;
					border-bottom: 1px solid #eee;
				}

				.user-info {
					display: flex;
					flex-direction: column;
					gap: 1rem;
				}

				.user-details {
					display: flex;
					flex-direction: column;
					gap: 0.25rem;
				}

				.user-fullname {
					font-weight: 700;
					font-size: 1.1rem;
					color: #333;
					margin: 0;
				}

				.user-email {
					color: #666;
					font-size: 0.9rem;
					margin: 0;
				}

				.user-stats {
					display: flex;
					gap: 2rem;
				}

				.stat {
					display: flex;
					flex-direction: column;
					align-items: center;
				}

				.stat-value {
					font-weight: 700;
					font-size: 1.2rem;
					color: #667eea;
				}

				.stat-label {
					font-size: 0.75rem;
					color: #999;
					text-transform: uppercase;
				}

				.dropdown-menu {
					padding: 0.5rem;
				}

				.dropdown-item {
					display: flex;
					align-items: center;
					gap: 0.75rem;
					padding: 0.75rem 1rem;
					border-radius: 8px;
					color: #555;
					text-decoration: none;
					transition: all 0.3s ease;
				}

				.dropdown-item:hover {
					background: #f5f5f5;
					color: #667eea;
				}

				.item-icon {
					font-size: 1.1rem;
				}

				.item-text {
					font-weight: 500;
				}

				.dropdown-footer {
					padding: 0.5rem;
					border-top: 1px solid #eee;
				}

				.logout-btn {
					width: 100%;
					display: flex;
					align-items: center;
					gap: 0.75rem;
					padding: 0.75rem 1rem;
					border-radius: 8px;
					background: none;
					border: none;
					color: #ff4757;
					cursor: pointer;
					transition: all 0.3s ease;
				}

				.logout-btn:hover {
					background: rgba(255, 71, 87, 0.1);
				}

				.auth-buttons {
					display: flex;
					gap: 0.75rem;
				}

				.btn-secondary, .btn-primary {
					padding: 0.5rem 1.25rem;
					border-radius: 8px;
					text-decoration: none;
					font-weight: 600;
					transition: all 0.3s ease;
				}

				.btn-secondary {
					color: #667eea;
					border: 2px solid #667eea;
				}

				.btn-secondary:hover {
					background: rgba(102, 126, 234, 0.1);
				}

				.btn-primary {
					background: linear-gradient(135deg, #667eea, #764ba2);
					color: white;
				}

				.btn-primary:hover {
					transform: translateY(-2px);
					box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
				}

				.search-overlay {
					position: fixed;
					top: 72px;
					left: 0;
					right: 0;
					background: white;
					border-bottom: 1px solid #eee;
					box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
					padding: 2rem;
					z-index: 999;
				}

				.search-container {
					max-width: 800px;
					margin: 0 auto;
					position: relative;
				}

				.search-input {
					width: 100%;
					padding: 1rem 3rem 1rem 1.5rem;
					font-size: 1.25rem;
					border: 2px solid #eee;
					border-radius: 12px;
					outline: none;
					transition: all 0.3s ease;
				}

				.search-input:focus {
					border-color: #667eea;
				}

				.search-close {
					position: absolute;
					right: 1rem;
					top: 50%;
					transform: translateY(-50%);
					background: none;
					border: none;
					font-size: 1.5rem;
					color: #999;
					cursor: pointer;
				}

				.search-suggestions {
					max-width: 800px;
					margin: 2rem auto 0;
				}

				.search-suggestions h3 {
					font-size: 0.9rem;
					color: #999;
					margin-bottom: 1rem;
				}

				.suggestion-tags {
					display: flex;
					gap: 0.5rem;
					flex-wrap: wrap;
				}

				.tag {
					padding: 0.5rem 1rem;
					background: #f5f5f5;
					border-radius: 20px;
					font-size: 0.9rem;
					color: #555;
					cursor: pointer;
					transition: all 0.3s ease;
				}

				.tag:hover {
					background: #667eea;
					color: white;
				}

				.mobile-menu {
					display: none;
					position: fixed;
					top: 0;
					left: 0;
					width: 280px;
					height: 100vh;
					background: white;
					box-shadow: 2px 0 20px rgba(0, 0, 0, 0.1);
					z-index: 1001;
					overflow-y: auto;
				}

				.mobile-menu-header {
					display: flex;
					justify-content: space-between;
					align-items: center;
					padding: 1.5rem;
					border-bottom: 1px solid #eee;
				}

				.mobile-logo {
					display: flex;
					align-items: center;
					gap: 0.5rem;
					text-decoration: none;
					font-weight: 700;
					font-size: 1.25rem;
					color: #333;
				}

				.mobile-close {
					background: none;
					border: none;
					font-size: 1.5rem;
					color: #999;
					cursor: pointer;
				}

				.mobile-nav {
					padding: 1rem;
				}

				.mobile-nav-link {
					display: flex;
					align-items: center;
					gap: 1rem;
					padding: 1rem;
					border-radius: 8px;
					color: #555;
					text-decoration: none;
					transition: all 0.3s ease;
				}

				.mobile-nav-link:hover {
					background: #f5f5f5;
				}

				.mobile-nav-link.active {
					background: linear-gradient(135deg, #667eea, #764ba2);
					color: white;
				}

				.mobile-user-section {
					padding: 1rem;
					border-top: 1px solid #eee;
				}

				.mobile-user-section h3 {
					font-size: 0.9rem;
					color: #999;
					margin-bottom: 1rem;
				}

				.mobile-logout {
					width: 100%;
					display: flex;
					align-items: center;
					gap: 1rem;
					padding: 1rem;
					border-radius: 8px;
					background: none;
					border: none;
					color: #ff4757;
					cursor: pointer;
					transition: all 0.3s ease;
				}

				.mobile-logout:hover {
					background: rgba(255, 71, 87, 0.1);
				}

				.desktop-only {
					display: flex;
				}

				@media (max-width: 1024px) {
					.header-nav {
						display: none;
					}

					.desktop-only {
						display: none;
					}

					.mobile-menu-toggle {
						display: flex;
					}

					.mobile-menu {
						display: block;
					}
				}

				@media (max-width: 640px) {
					.header-container {
						padding: 0 1rem;
					}

					.logo-subtitle {
						display: none;
					}

					.auth-buttons {
						gap: 0.5rem;
					}

					.btn-secondary, .btn-primary {
						padding: 0.5rem 1rem;
						font-size: 0.9rem;
					}
				}
			`}</style>
		</header>
	);
}