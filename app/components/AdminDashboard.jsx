import { useEffect, useMemo, useState } from "react";
import { allProblems as allLeetcodeProblems } from "@/lib/data/all-batches-index";
const algorithmCategories = ["Arrays", "Strings", "Hash Table", "Dynamic Programming", "Trees", "Graphs", "Backtracking", "Greedy"];

function AdminDashboard({ user }) {
	const [activeTab, setActiveTab] = useState("overview");
	const [timeRange, setTimeRange] = useState("7d");
	const [sortBy, setSortBy] = useState("xp");
	const [_filterUsers, _setFilterUsers] = useState("all");

	const [analytics, setAnalytics] = useState({
		users: [],
		quizData: [],
		systemStats: {},
	});

	useEffect(() => {
		loadAnalyticsData();
	}, [loadAnalyticsData]);

	const loadAnalyticsData = () => {
		const users = JSON.parse(localStorage.getItem("users") || "[]");
		const allQuizData = [];

		users.forEach((user) => {
			if (user.scores) {
				user.scores.forEach((score) => {
					allQuizData.push({
						...score,
						userId: user.id,
						username: user.username,
					});
				});
			}
		});

		const systemStats = {
			totalUsers: users.length,
			totalQuizzes: allQuizData.length,
			totalXP: users.reduce((sum, user) => sum + (user.totalXP || 0), 0),
			avgScore:
				allQuizData.length > 0
					? Math.round(
							allQuizData.reduce((sum, quiz) => sum + quiz.percentage, 0) /
								allQuizData.length,
						)
					: 0,
			avgTimePerQuiz:
				allQuizData.length > 0
					? Math.round(
							allQuizData.reduce((sum, quiz) => sum + quiz.timeSpent, 0) /
								allQuizData.length,
						)
					: 0,
		};

		setAnalytics({ users, quizData: allQuizData, systemStats });
	};

	const getTimeRangeData = () => {
		const now = new Date();
		const timeRanges = {
			"1d": 24 * 60 * 60 * 1000,
			"7d": 7 * 24 * 60 * 60 * 1000,
			"30d": 30 * 24 * 60 * 60 * 1000,
			"90d": 90 * 24 * 60 * 60 * 1000,
			all: Infinity,
		};

		const cutoff = now.getTime() - timeRanges[timeRange];

		return analytics.quizData.filter((quiz) => {
			const quizDate = new Date(quiz.date).getTime();
			return quizDate >= cutoff;
		});
	};

	const filteredQuizData = getTimeRangeData();

	const topUsers = useMemo(() => {
		const sorted = [...analytics.users];

		switch (sortBy) {
			case "xp":
				sorted.sort((a, b) => (b.totalXP || 0) - (a.totalXP || 0));
				break;
			case "quizzes":
				sorted.sort(
					(a, b) => (b.scores?.length || 0) - (a.scores?.length || 0),
				);
				break;
			case "avg_score":
				sorted.sort((a, b) => {
					const avgA =
						a.scores?.length > 0
							? a.scores.reduce((sum, s) => sum + s.percentage, 0) /
								a.scores.length
							: 0;
					const avgB =
						b.scores?.length > 0
							? b.scores.reduce((sum, s) => sum + s.percentage, 0) /
								b.scores.length
							: 0;
					return avgB - avgA;
				});
				break;
			case "recent":
				sorted.sort((a, b) => {
					const lastA =
						a.scores?.length > 0
							? new Date(a.scores[a.scores.length - 1].date)
							: new Date(0);
					const lastB =
						b.scores?.length > 0
							? new Date(b.scores[b.scores.length - 1].date)
							: new Date(0);
					return lastB - lastA;
				});
				break;
		}

		return sorted.slice(0, 20);
	}, [analytics.users, sortBy]);

	const getDifficultyStats = () => {
		const stats = { Easy: 0, Medium: 0, Hard: 0 };
		filteredQuizData.forEach((quiz) => {
			if (quiz.details) {
				quiz.details.forEach((detail) => {
					stats[detail.difficulty]++;
				});
			}
		});
		return stats;
	};

	const getAlgorithmPopularity = () => {
		const algoStats = {};
		filteredQuizData.forEach((quiz) => {
			if (quiz.details) {
				quiz.details.forEach((detail) => {
					detail.correctAnswer.forEach((algo) => {
						algoStats[algo] = (algoStats[algo] || 0) + 1;
					});
				});
			}
		});

		return Object.entries(algoStats)
			.sort(([, a], [, b]) => b - a)
			.slice(0, 15)
			.map(([algo, count]) => ({ algorithm: algo, count }));
	};

	const getUserActivityByDay = () => {
		const dailyActivity = {};
		const last7Days = [];

		for (let i = 6; i >= 0; i--) {
			const date = new Date();
			date.setDate(date.getDate() - i);
			const dateStr = date.toISOString().split("T")[0];
			last7Days.push(dateStr);
			dailyActivity[dateStr] = { quizzes: 0, users: new Set() };
		}

		filteredQuizData.forEach((quiz) => {
			const dateStr = quiz.date.split("T")[0];
			if (dailyActivity[dateStr]) {
				dailyActivity[dateStr].quizzes++;
				dailyActivity[dateStr].users.add(quiz.userId);
			}
		});

		return last7Days.map((date) => ({
			date,
			quizzes: dailyActivity[date].quizzes,
			activeUsers: dailyActivity[date].users.size,
		}));
	};

	const getQuizModeStats = () => {
		const modeStats = {};
		filteredQuizData.forEach((quiz) => {
			modeStats[quiz.mode] = (modeStats[quiz.mode] || 0) + 1;
		});
		return modeStats;
	};

	const difficultyStats = getDifficultyStats();
	const algorithmPopularity = getAlgorithmPopularity();
	const dailyActivity = getUserActivityByDay();
	const modeStats = getQuizModeStats();

	const exportAnalytics = () => {
		const exportData = {
			systemStats: analytics.systemStats,
			timeRange,
			users: analytics.users.map((user) => ({
				id: user.id,
				username: user.username,
				totalXP: user.totalXP || 0,
				quizzesCompleted: user.scores?.length || 0,
				avgScore:
					user.scores?.length > 0
						? Math.round(
								user.scores.reduce((sum, s) => sum + s.percentage, 0) /
									user.scores.length,
							)
						: 0,
				lastActive:
					user.scores?.length > 0
						? user.scores[user.scores.length - 1].date
						: null,
			})),
			quizData: filteredQuizData,
			algorithmPopularity,
			difficultyStats,
			modeStats,
			exportDate: new Date().toISOString(),
		};

		const blob = new Blob([JSON.stringify(exportData, null, 2)], {
			type: "application/json",
		});

		const url = URL.createObjectURL(blob);
		const link = document.createElement("a");
		link.href = url;
		link.download = `leetcode-quiz-analytics-${timeRange}-${new Date().toISOString().split("T")[0]}.json`;
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
		URL.revokeObjectURL(url);
	};

	const clearUserData = (userId) => {
		if (
			confirm(
				"Are you sure you want to clear this user's data? This action cannot be undone.",
			)
		) {
			const users = JSON.parse(localStorage.getItem("users") || "[]");
			const updatedUsers = users.filter((u) => u.id !== userId);
			localStorage.setItem("users", JSON.stringify(updatedUsers));
			loadAnalyticsData();
		}
	};

	const formatTime = (seconds) => {
		const mins = Math.floor(seconds / 60);
		const secs = seconds % 60;
		return `${mins}:${secs.toString().padStart(2, "0")}`;
	};

	if (!user || user.role !== "admin") {
		return (
			<div className="admin-access-denied">
				<h2>🚫 Access Denied</h2>
				<p>You need administrator privileges to access this dashboard.</p>
			</div>
		);
	}

	return (
		<div className="admin-dashboard">
			<div className="admin-header">
				<div className="admin-title">
					<h1>⚡ Admin Dashboard</h1>
					<p>System analytics and user management</p>
				</div>
				<div className="admin-controls">
					<select
						value={timeRange}
						onChange={(e) => setTimeRange(e.target.value)}
						className="time-range-select"
					>
						<option value="1d">Last 24 Hours</option>
						<option value="7d">Last 7 Days</option>
						<option value="30d">Last 30 Days</option>
						<option value="90d">Last 90 Days</option>
						<option value="all">All Time</option>
					</select>
					<button onClick={exportAnalytics} className="export-btn">
						📊 Export Data
					</button>
					<button onClick={loadAnalyticsData} className="refresh-btn">
						🔄 Refresh
					</button>
				</div>
			</div>

			<div className="admin-tabs">
				<button
					className={`tab-btn ${activeTab === "overview" ? "active" : ""}`}
					onClick={() => setActiveTab("overview")}
				>
					📊 Overview
				</button>
				<button
					className={`tab-btn ${activeTab === "users" ? "active" : ""}`}
					onClick={() => setActiveTab("users")}
				>
					👥 Users
				</button>
				<button
					className={`tab-btn ${activeTab === "content" ? "active" : ""}`}
					onClick={() => setActiveTab("content")}
				>
					📝 Content
				</button>
				<button
					className={`tab-btn ${activeTab === "system" ? "active" : ""}`}
					onClick={() => setActiveTab("system")}
				>
					⚙️ System
				</button>
			</div>

			{activeTab === "overview" && (
				<div className="admin-overview">
					{/* Key Metrics */}
					<div className="metrics-grid">
						<div className="metric-card">
							<div className="metric-icon">👥</div>
							<div className="metric-info">
								<h3>{analytics.systemStats.totalUsers}</h3>
								<p>Total Users</p>
							</div>
						</div>
						<div className="metric-card">
							<div className="metric-icon">🎯</div>
							<div className="metric-info">
								<h3>{analytics.systemStats.totalQuizzes}</h3>
								<p>Quizzes Completed</p>
							</div>
						</div>
						<div className="metric-card">
							<div className="metric-icon">⭐</div>
							<div className="metric-info">
								<h3>{analytics.systemStats.totalXP.toLocaleString()}</h3>
								<p>Total XP Earned</p>
							</div>
						</div>
						<div className="metric-card">
							<div className="metric-icon">📈</div>
							<div className="metric-info">
								<h3>{analytics.systemStats.avgScore}%</h3>
								<p>Average Score</p>
							</div>
						</div>
					</div>

					{/* Daily Activity Chart */}
					<div className="analytics-section">
						<h3>📊 Daily Activity ({timeRange})</h3>
						<div className="activity-chart">
							{dailyActivity.map((day) => (
								<div key={day.date} className="activity-bar">
									<div className="bar-container">
										<div
											className="bar quizzes"
											style={{
												height: `${Math.max(5, (day.quizzes / Math.max(...dailyActivity.map((d) => d.quizzes))) * 100)}px`,
											}}
											title={`${day.quizzes} quizzes`}
										/>
										<div
											className="bar users"
											style={{
												height: `${Math.max(5, (day.activeUsers / Math.max(...dailyActivity.map((d) => d.activeUsers))) * 100)}px`,
											}}
											title={`${day.activeUsers} active users`}
										/>
									</div>
									<div className="bar-label">
										{new Date(day.date).toLocaleDateString("en-US", {
											weekday: "short",
										})}
									</div>
								</div>
							))}
						</div>
						<div className="chart-legend">
							<div className="legend-item">
								<span className="legend-color quizzes"></span>
								<span>Quizzes</span>
							</div>
							<div className="legend-item">
								<span className="legend-color users"></span>
								<span>Active Users</span>
							</div>
						</div>
					</div>

					{/* Quiz Mode Distribution */}
					<div className="analytics-section">
						<h3>🎮 Quiz Mode Distribution</h3>
						<div className="mode-stats">
							{Object.entries(modeStats).map(([mode, count]) => {
								const percentage = Math.round(
									(count / filteredQuizData.length) * 100,
								);
								return (
									<div key={mode} className="mode-stat">
										<div className="mode-info">
											<span className="mode-name">{mode}</span>
											<span className="mode-count">{count}</span>
										</div>
										<div className="mode-bar">
											<div
												className="mode-fill"
												style={{ width: `${percentage}%` }}
											/>
										</div>
										<span className="mode-percentage">{percentage}%</span>
									</div>
								);
							})}
						</div>
					</div>

					{/* Difficulty Distribution */}
					<div className="analytics-section">
						<h3>🎚️ Problem Difficulty Distribution</h3>
						<div className="difficulty-distribution">
							{Object.entries(difficultyStats).map(([diff, count]) => {
								const total = Object.values(difficultyStats).reduce(
									(a, b) => a + b,
									0,
								);
								const percentage =
									total > 0 ? Math.round((count / total) * 100) : 0;
								return (
									<div key={diff} className="difficulty-item">
										<div className="difficulty-info">
											<span
												className={`difficulty-label ${diff.toLowerCase()}`}
											>
												{diff}
											</span>
											<span className="difficulty-count">{count}</span>
										</div>
										<div className="difficulty-bar">
											<div
												className={`difficulty-fill ${diff.toLowerCase()}`}
												style={{ width: `${percentage}%` }}
											/>
										</div>
										<span className="difficulty-percentage">{percentage}%</span>
									</div>
								);
							})}
						</div>
					</div>
				</div>
			)}

			{activeTab === "users" && (
				<div className="admin-users">
					<div className="users-controls">
						<div className="sort-controls">
							<label>Sort by:</label>
							<select
								value={sortBy}
								onChange={(e) => setSortBy(e.target.value)}
							>
								<option value="xp">XP (High to Low)</option>
								<option value="quizzes">Quiz Count</option>
								<option value="avg_score">Average Score</option>
								<option value="recent">Recent Activity</option>
							</select>
						</div>
						<div className="user-stats-summary">
							<span>
								Active Users:{" "}
								{analytics.users.filter((u) => u.scores?.length > 0).length}
							</span>
							<span>
								Inactive Users:{" "}
								{
									analytics.users.filter(
										(u) => !u.scores || u.scores.length === 0,
									).length
								}
							</span>
						</div>
					</div>

					<div className="users-table">
						<div className="table-header">
							<div>User</div>
							<div>XP</div>
							<div>Level</div>
							<div>Quizzes</div>
							<div>Avg Score</div>
							<div>Last Active</div>
							<div>Actions</div>
						</div>
						{topUsers.map((user) => {
							const avgScore =
								user.scores?.length > 0
									? Math.round(
											user.scores.reduce((sum, s) => sum + s.percentage, 0) /
												user.scores.length,
										)
									: 0;
							const lastActive =
								user.scores?.length > 0
									? new Date(
											user.scores[user.scores.length - 1].date,
										).toLocaleDateString()
									: "Never";

							return (
								<div key={user.id} className="table-row">
									<div className="user-cell">
										<span className="user-name">{user.username}</span>
										<span className="user-id">#{user.id}</span>
									</div>
									<div>{(user.totalXP || 0).toLocaleString()}</div>
									<div>LV.{Math.floor((user.totalXP || 0) / 1000) + 1}</div>
									<div>{user.scores?.length || 0}</div>
									<div
										className={`avg-score ${avgScore >= 80 ? "excellent" : avgScore >= 60 ? "good" : "needs-work"}`}
									>
										{avgScore}%
									</div>
									<div>{lastActive}</div>
									<div className="user-actions">
										<button
											onClick={() => clearUserData(user.id)}
											className="danger-btn small"
											title="Clear user data"
										>
											🗑️
										</button>
									</div>
								</div>
							);
						})}
					</div>
				</div>
			)}

			{activeTab === "content" && (
				<div className="admin-content">
					<div className="content-section">
						<h3>🧠 Algorithm Popularity</h3>
						<div className="algorithm-popularity">
							{algorithmPopularity.map((item) => {
								const maxCount = algorithmPopularity[0]?.count || 1;
								const percentage = Math.round((item.count / maxCount) * 100);
								return (
									<div key={item.algorithm} className="popularity-item">
										<div className="popularity-info">
											<span className="algorithm-name">{item.algorithm}</span>
											<span className="algorithm-count">
												{item.count} questions
											</span>
										</div>
										<div className="popularity-bar">
											<div
												className="popularity-fill"
												style={{ width: `${percentage}%` }}
											/>
										</div>
									</div>
								);
							})}
						</div>
					</div>

					<div className="content-section">
						<h3>📊 Problem Database Stats</h3>
						<div className="database-stats">
							<div className="stat-item">
								<span className="stat-label">Total Problems:</span>
								<span className="stat-value">{allLeetcodeProblems.length}</span>
							</div>
							<div className="stat-item">
								<span className="stat-label">Algorithm Categories:</span>
								<span className="stat-value">
									{Object.keys(algorithmCategories).length}
								</span>
							</div>
							<div className="stat-item">
								<span className="stat-label">Unique Algorithms:</span>
								<span className="stat-value">
									{
										new Set(
											allLeetcodeProblems.flatMap((p) => p.correctAlgorithms),
										).size
									}
								</span>
							</div>
						</div>
					</div>

					<div className="content-section">
						<h3>🎯 Quiz Performance Insights</h3>
						<div className="performance-insights">
							<div className="insight-card">
								<h4>🔥 Hardest Problems</h4>
								<p>Problems with lowest success rates need attention</p>
							</div>
							<div className="insight-card">
								<h4>⚡ Quick Wins</h4>
								<p>Easy problems with high engagement</p>
							</div>
							<div className="insight-card">
								<h4>📈 Trending Algorithms</h4>
								<p>Most practiced algorithms this week</p>
							</div>
						</div>
					</div>
				</div>
			)}

			{activeTab === "system" && (
				<div className="admin-system">
					<div className="system-section">
						<h3>💾 Storage Analytics</h3>
						<div className="storage-stats">
							<div className="storage-item">
								<span className="storage-label">Local Storage Usage:</span>
								<span className="storage-value">
									{Math.round(JSON.stringify(localStorage).length / 1024)} KB
								</span>
							</div>
							<div className="storage-item">
								<span className="storage-label">User Data:</span>
								<span className="storage-value">
									{Math.round(JSON.stringify(analytics.users).length / 1024)} KB
								</span>
							</div>
							<div className="storage-item">
								<span className="storage-label">Quiz Data:</span>
								<span className="storage-value">
									{Math.round(JSON.stringify(analytics.quizData).length / 1024)}{" "}
									KB
								</span>
							</div>
						</div>
					</div>

					<div className="system-section">
						<h3>🔧 System Actions</h3>
						<div className="system-actions">
							<button onClick={loadAnalyticsData} className="system-btn">
								🔄 Refresh Analytics
							</button>
							<button onClick={exportAnalytics} className="system-btn">
								📊 Export Analytics
							</button>
							<button
								onClick={() => {
									if (
										confirm(
											"Clear all cached data? This will not affect user data.",
										)
									) {
										// Clear non-essential cached data
										Object.keys(localStorage).forEach((key) => {
											if (key.startsWith("cache_") || key.startsWith("temp_")) {
												localStorage.removeItem(key);
											}
										});
										alert("Cache cleared successfully");
									}
								}}
								className="system-btn warning"
							>
								🧹 Clear Cache
							</button>
						</div>
					</div>

					<div className="system-section">
						<h3>📊 Performance Metrics</h3>
						<div className="performance-metrics">
							<div className="metric-item">
								<span className="metric-label">Average Quiz Duration:</span>
								<span className="metric-value">
									{formatTime(analytics.systemStats.avgTimePerQuiz)}
								</span>
							</div>
							<div className="metric-item">
								<span className="metric-label">Total Quiz Time:</span>
								<span className="metric-value">
									{formatTime(
										analytics.quizData.reduce(
											(sum, quiz) => sum + quiz.timeSpent,
											0,
										),
									)}
								</span>
							</div>
							<div className="metric-item">
								<span className="metric-label">Questions Answered:</span>
								<span className="metric-value">
									{analytics.quizData.reduce(
										(sum, quiz) => sum + quiz.totalQuestions,
										0,
									)}
								</span>
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}

export default AdminDashboard;
